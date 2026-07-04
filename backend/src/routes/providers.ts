import { Router } from 'express';
import { ApiPoolManager } from '../providers/api-pool';
import { PROVIDER_PRESETS } from '../providers/presets';
import { ModelCapabilityScorer } from '../models/capability-scorer';
import { LLMClient } from '../services/llm-client';
import { v4 as uuid } from 'uuid';
import { Provider } from '../types';

export function createProviderRoutes(pool: ApiPoolManager) {
  const r = Router();
  r.get('/presets', (_, res) => res.json(PROVIDER_PRESETS));
  r.get('/', (_, res) => res.json(pool.getAllProviders()));
  r.post('/from-preset', (req, res) => {
    const preset = PROVIDER_PRESETS.find(p => p.id === req.body.presetId);
    if (!preset) return res.status(404).json({ error: 'Not found' });
    const prov: Provider = { id: uuid(), name: preset.name, baseUrl: preset.baseUrl, type: preset.type, icon: preset.icon, apiKeys: [], models: [], isLocal: preset.id === 'local', createdAt: new Date().toISOString() };
    for (const mid of preset.defaultModels) prov.models.push({ id: uuid(), name: mid, providerId: prov.id, modelId: mid, type: 'llm', capabilities: ModelCapabilityScorer.getDefaultProfile(mid) });
    pool.addProvider(prov); res.json(prov);
  });
  r.post('/custom', (req, res) => {
    const prov: Provider = { id: uuid(), name: req.body.name, baseUrl: req.body.baseUrl, type: req.body.type || 'openai-compatible', apiKeys: [], models: [], isLocal: false, createdAt: new Date().toISOString() };
    pool.addProvider(prov); res.json(prov);
  });
  r.post('/:pid/keys', (req, res) => { const e = pool.addApiKey(req.params.pid, req.body.key); if (!e) return res.status(400).json({ error: 'Max 50 or not found' }); res.json(e); });
  r.delete('/:pid/keys/:kid', (req, res) => res.json({ success: pool.removeApiKey(req.params.pid, req.params.kid) }));
  r.post('/:pid/models', (req, res) => { const p = pool.getProvider(req.params.pid); if (!p) return res.status(404).json({ error: 'Not found' }); const m = { id: uuid(), name: req.body.name || req.body.modelId, providerId: p.id, modelId: req.body.modelId, type: req.body.type || 'llm', capabilities: ModelCapabilityScorer.getDefaultProfile(req.body.modelId) }; p.models.push(m); res.json(m); });
  r.post('/:pid/models/:mid/test', async (req, res) => { const p = pool.getProvider(req.params.pid); if (!p) return res.status(404).json({ error: 'Not found' }); const m = p.models.find(x => x.id === req.params.mid); if (!m) return res.status(404).json({ error: 'Not found' }); const k = pool.getNextApiKey(p.id); if (!k) return res.status(400).json({ error: 'No keys' }); res.json(await LLMClient.testModel(p, k, m.modelId)); });
  r.delete('/:pid', (req, res) => { pool.removeProvider(req.params.pid); res.json({ success: true }); });
  return r;
}
