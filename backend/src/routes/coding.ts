import { Router } from 'express';
import { ApiPoolManager } from '../providers/api-pool';
import { CodingEngine } from '../services/coding-engine';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { execSync, spawn } from 'child_process';

export function createCodingRoutes(pool: ApiPoolManager, wsBroadcast: Function, projectManager?: any) {
  const r = Router();
  const workDir = path.join(os.tmpdir(), 'moa-workspace');
  const engine = new CodingEngine(workDir);

  // Standalone coding execution (from Coding tab)
  r.post('/execute', async (req, res) => {
    const { description, projectPath, modelId, providerId } = req.body;
    if (!description) return res.status(400).json({ error: 'Missing description' });
    const prov = providerId ? pool.getProvider(providerId) : pool.getAllProviders().find(p => p.apiKeys.length > 0);
    if (!prov) return res.status(400).json({ error: 'No provider with keys' });
    const key = pool.getNextApiKey(prov.id); if (!key) return res.status(400).json({ error: 'No keys' });
    const model = modelId ? prov.models.find(m => m.id === modelId) : prov.models.find(m => m.type === 'llm');
    if (!model) return res.status(400).json({ error: 'No model' });
    const task = engine.createTask(description, projectPath || 'project');
    wsBroadcast('coding_started', { taskId: task.id, description });
    try {
      const plan = await engine.planTask(description, prov, key, model);
      wsBroadcast('coding_planned', { taskId: task.id, plan });
      await engine.executePlan(plan, task);
      wsBroadcast('coding_completed', { taskId: task.id, status: task.status, output: task.output });
      res.json(task);
    } catch (e: any) {
      task.status = 'failed'; task.output = e.message;
      wsBroadcast('coding_failed', { taskId: task.id, error: e.message });
      res.json(task);
    }
  });

  // Environment info endpoint - what tools are available on this machine
  r.get('/environment', (_req, res) => {
    const env: any = { cwd: workDir, platform: process.platform, arch: process.arch, nodeVersion: process.version, tools: {} };
    const check = (cmd: string) => { try { return execSync(cmd, { encoding: 'utf8', timeout: 5000, shell: 'powershell.exe' }).trim(); } catch { return null; } };
    env.tools.node = check('node -v');
    env.tools.npm = check('npm -v');
    env.tools.python = check('python --version') || check('python3 --version');
    env.tools.pip = check('pip --version') || check('pip3 --version');
    env.tools.git = check('git --version');
    env.tools.java = check('java -version 2>&1');
    env.tools.go = check('go version');
    env.tools.rust = check('rustc --version');
    env.tools.cargo = check('cargo --version');
    env.tools.docker = check('docker --version');
    env.tools.powershell = check('$PSVersionTable.PSVersion.ToString()');
    env.tools.tsc = check('npx tsc --version');
    env.tools.vite = check('npx vite --version');
    env.tools.electron = check('npx electron --version');
    // List desktop files as context
    try {
      const desktop = path.join(os.homedir(), 'Desktop');
      env.desktopFiles = fs.readdirSync(desktop).slice(0, 30);
    } catch { env.desktopFiles = []; }
    res.json(env);
  });

  // Run arbitrary command in sandboxed workspace (for coding sub-agents)
  r.post('/shell', async (req, res) => {
    const { command, workdir, timeout } = req.body;
    if (!command) return res.status(400).json({ error: 'Missing command' });
    const cwd = workdir ? path.resolve(workDir, workdir) : workDir;
    fs.mkdirSync(cwd, { recursive: true });
    const t = Math.min(Math.max(timeout || 30000, 1000), 120000);
    try {
      const output = execSync(command, { cwd, encoding: 'utf8', timeout: t, shell: 'powershell.exe', stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, FORCE_COLOR: '0' } });
      res.json({ success: true, output: (output || '').slice(0, 8000), exitCode: 0 });
    } catch (e: any) {
      res.json({ success: false, output: ((e.stdout || '') + '\n' + (e.stderr || e.message || '')).slice(0, 8000), exitCode: e.status || 1 });
    }
  });

  // Read a file from workspace
  r.post('/read-file', (req, res) => {
    const { filePath, workdir } = req.body;
    if (!filePath) return res.status(400).json({ error: 'Missing filePath' });
    const base = workdir ? path.resolve(workDir, workdir) : workDir;
    const full = path.resolve(base, filePath);
    if (!full.startsWith(workDir)) return res.status(403).json({ error: 'Access denied' });
    if (!fs.existsSync(full)) return res.status(404).json({ error: 'File not found' });
    try {
      const stat = fs.statSync(full);
      if (stat.size > 512 * 1024) return res.json({ content: fs.readFileSync(full, 'utf8').slice(0, 512 * 1024), truncated: true, size: stat.size });
      res.json({ content: fs.readFileSync(full, 'utf8'), truncated: false, size: stat.size });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // List workspace files
  r.get('/workspace', (_req, res) => {
    try {
      const files: string[] = [];
      const walk = (dir: string) => { if (!fs.existsSync(dir)) return; for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const f = path.join(dir, e.name); if (e.isDirectory()) walk(f); else files.push(path.relative(workDir, f)); } };
      walk(workDir); res.json({ workDir, files });
    } catch { res.json({ workDir, files: [] }); }
  });

  // List files in a specific workspace subdirectory
  r.post('/list-files', (req, res) => {
    const { workdir } = req.body;
    const cwd = workdir ? path.resolve(workDir, workdir) : workDir;
    if (!fs.existsSync(cwd)) return res.json({ files: [], dirs: [] });
    try {
      const entries = fs.readdirSync(cwd, { withFileTypes: true });
      res.json({
        files: entries.filter(e => e.isFile()).map(e => e.name),
        dirs: entries.filter(e => e.isDirectory()).map(e => e.name),
      });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  return r;
}
