import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from './services/api';
import type { Provider, ProviderPreset, Model, Project } from './types';

function CapabilityBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="capability-bar">
      <span className="capability-label">{label}</span>
      <div className="capability-track"><div className="capability-fill" style={{ width: value * 10 + '%', background: color }} /></div>
      <span className="capability-value">{value}</span>
    </div>
  );
}

function ProviderSetup({ onRefresh }: { onRefresh: () => void }) {
  const [presets, setPresets] = useState<ProviderPreset[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [newKey, setNewKey] = useState('');
  const [selProv, setSelProv] = useState('');

  const load = useCallback(async () => {
    const [p, prov] = await Promise.all([api.fetchPresets(), api.fetchProviders()]);
    setPresets(p); setProviders(prov);
  }, []);


  useEffect(() => { load(); }, [load]);

  const [fetchingModels, setFetchingModels] = useState('');
  const fetchModels = async (provId: string) => {
    setFetchingModels(provId);
    try {
      const result = await api.fetchModels(provId);
      if (result.error) { alert('获取模型失败: ' + result.error); }
      else { await load(); onRefresh(); }
    } catch (e: any) { alert('获取模型失败: ' + e.message); }
    setFetchingModels('');
  };

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>📦 预设提供商</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
        {presets.map(p => {
          const added = providers.some(pr => pr.name === p.name);
          return (
            <div key={p.id} className="card" style={{ cursor: added ? 'default' : 'pointer', opacity: added ? 0.6 : 1 }}
              onClick={() => { if (!added) { api.addPreset(p.id).then(() => { load(); onRefresh(); }); } }}>
              <div className="card-title">{p.icon} {p.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.description}</div>
              <div style={{ marginTop: 8, fontSize: 11 }}>{added ? '✅ 已添加' : '点击添加'}</div>
            </div>
          );
        })}
      </div>
      <h3 style={{ margin: '24px 0 16px' }}>➕ 自定义提供商</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="名称" value={customName} onChange={e => setCustomName(e.target.value)} style={{ flex: 1 }} />
        <input placeholder="Base URL" value={customUrl} onChange={e => setCustomUrl(e.target.value)} style={{ flex: 2 }} />
        <button className="btn btn-primary" onClick={() => { if (customName && customUrl) { api.addCustom(customName, customUrl).then(() => { setCustomName(''); setCustomUrl(''); load(); }); } }}>添加</button>
      </div>
      {providers.length > 0 && (
        <>
          <h3 style={{ marginBottom: 16 }}>🔑 API Key 管理</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <select value={selProv} onChange={e => setSelProv(e.target.value)} style={{ flex: 1 }}>
              <option value="">选择提供商</option>
              {providers.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
            </select>
            <input placeholder="API Key" value={newKey} onChange={e => setNewKey(e.target.value)} type="password" style={{ flex: 2 }} />
            <button className="btn btn-primary" onClick={() => { if (selProv && newKey) { api.addKey(selProv, newKey).then(() => { setNewKey(''); load(); }); } }}>添加 Key</button>
          </div>
          {providers.map(p => (
            <div key={p.id} className="card">
              <div className="card-title">{p.icon || '🔧'} {p.name} <span className="badge badge-info">{p.models.length} 模型</span> <span className="badge badge-success">{p.apiKeys.length} Keys</span>\n                  {p.apiKeys.length > 0 && <button className="btn btn-sm" style={{ marginLeft: 'auto' }} onClick={(e) => { e.stopPropagation(); fetchModels(p.id); }} disabled={fetchingModels===p.id}>{fetchingModels===p.id ? '⏳ 获取中...' : '🔄 获取模型'}</button>}\n                </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>{p.baseUrl}</div>
              {p.models.map(m => (
                <div key={m.id} style={{ padding: '4px 0', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{m.name}</span>
                  <span className="badge badge-info">{m.type}</span>
                  {m.capabilities.multimodal && <span className="badge badge-warning">多模态</span>}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function ModelCapabilities({ providers }: { providers: Provider[] }) {
  const allModels = providers.flatMap(p => p.models.map(m => ({ ...m, providerName: p.name, providerIcon: p.icon })));
  const [selected, setSelected] = useState('');
  const model = allModels.find(m => m.id === selected);
  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>🎯 模型能力概览</h3>
      <select value={selected} onChange={e => setSelected(e.target.value)} style={{ marginBottom: 16 }}>
        <option value="">选择模型查看能力</option>
        {allModels.map(m => <option key={m.id} value={m.id}>{m.providerIcon} {m.providerName} - {m.name}</option>)}
      </select>
      {model && (
        <div className="card">
          <div className="card-title">{model.providerIcon} {model.name} <span className="badge badge-info">{model.type}</span></div>
          <CapabilityBar label="代码" value={model.capabilities.code} color="#3fb950" />
          <CapabilityBar label="Agent" value={model.capabilities.agent} color="#58a6ff" />
          <CapabilityBar label="对话" value={model.capabilities.chat} color="#d29922" />
          <CapabilityBar label="上下文" value={model.capabilities.context} color="#bc8cff" />
          <CapabilityBar label="速度" value={model.capabilities.speed} color="#f85149" />
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
            多模态: {model.capabilities.multimodal ? '✅ 支持' : '❌ 不支持'} | 输入: ${model.capabilities.pricing.inputPer1M}/1M | 输出: ${model.capabilities.pricing.outputPer1M}/1M
          </div>
        </div>
      )}
    </div>
  );
}

function CostEfficiencySlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [inputVal, setInputVal] = useState(String(value));
  const handleSlider = (v: number) => { onChange(v); setInputVal(String(v)); };
  const handleInput = (s: string) => { setInputVal(s); const n = parseFloat(s); if (!isNaN(n) && n >= 0 && n <= 1) onChange(n); };
  return (
    <div className="card">
      <div className="card-title">⚖️ 成本 / 效率 偏好</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>
        <span>🚀 效率优先 (0)</span><span>⚖️ 均衡 (0.5)</span><span>💰 成本优先 (1)</span>
      </div>
      <div className="slider-container">
        <input type="range" className="slider" min={0} max={1} step={0.01} value={value} onChange={e => handleSlider(parseFloat(e.target.value))} />
        <input type="number" value={inputVal} onChange={e => handleInput(e.target.value)} min={0} max={1} step={0.01} style={{ width: 70, textAlign: 'center', fontWeight: 600 }} />
      </div>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
        {value <= 0.2 ? '🚀 效率优先 - 选择最强模型' : value >= 0.8 ? '💰 成本优先 - 选择最经济模型' : '⚖️ 均衡模式 - 兼顾性能与成本'}
      </div>
    </div>
  );
}

function AgentMonitor({ project }: { project: Project | null }) {
  if (!project) return <div className="empty-state"><div className="icon">🤖</div><p>无活跃项目，请先创建任务</p></div>;
  const os = project.orchestratorState;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3>🤖 子代理监控</h3>
        <span className={`badge ${os.status === 'completed' ? 'badge-success' : os.status === 'failed' ? 'badge-error' : 'badge-info'}`}>{os.status}</span>
      </div>
      {os.subAgents.length === 0 && <div className="empty-state"><p>等待任务分解...</p></div>}
      {os.subAgents.map(a => (
        <div key={a.id} className="card">
          <div className="agent-card">
            <div className="agent-avatar">🤖</div>
            <div className="agent-info">
              <div className="agent-name">{a.name} <span className={`status-dot ${a.status}`} /></div>
              <div className="agent-model">{a.modelId}</div>
            </div>
          </div>
        </div>
      ))}
      {os.tasks.length > 0 && (
        <>
          <h4 style={{ margin: '16px 0 8px', fontSize: 13 }}>📋 任务列表</h4>
          {os.tasks.map(t => (
            <div key={t.id} className="card" style={{ padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, flex: 1 }}>{t.description.slice(0, 100)}</span>
                <span className={`badge ${t.status === 'completed' ? 'badge-success' : t.status === 'failed' ? 'badge-error' : 'badge-warning'}`}>{t.status}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>模型: {t.assignedModel} | 尝试: {t.attempts}</div>
              {t.result && <div style={{ marginTop: 8, padding: 8, background: 'var(--bg-tertiary)', borderRadius: 6, fontSize: 12, maxHeight: 200, overflow: 'auto', whiteSpace: 'pre-wrap' }}>{t.result.slice(0, 500)}</div>}
            </div>
          ))}
        </>
      )}
      {project.issueLibrary.length > 0 && (
        <>
          <h4 style={{ margin: '16px 0 8px', fontSize: 13 }}>⚠️ 问题库 ({project.issueLibrary.length})</h4>
          {project.issueLibrary.slice(-5).map(i => (
            <div key={i.id} className="card" style={{ padding: 12, borderLeft: '3px solid var(--error)' }}>
              <span className={`badge ${i.severity === 'critical' ? 'badge-error' : 'badge-warning'}`}>{i.severity}</span>
              <span style={{ fontSize: 12, marginLeft: 8 }}>{i.description}</span>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{new Date(i.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function TaskPanel({ providers, onExecute }: { providers: Provider[]; onExecute: (task: string, opts: any) => void }) {
  const [task, setTask] = useState('');
  const [projectName, setProjectName] = useState('');
  const [modelId, setModelId] = useState('');
  const [thinking, setThinking] = useState<'low' | 'medium' | 'high'>('medium');
  const [ratio, setRatio] = useState(0.5);
  const allModels = providers.flatMap(p => p.models.filter(m => m.type === 'llm').map(m => ({ ...m, pName: p.name, pIcon: p.icon })));
  const handleSubmit = () => { if (!task.trim()) return; onExecute(task, { costEfficiencyRatio: ratio, orchestratorModel: modelId, thinkingMode: thinking, projectName: projectName || 'New Project' }); setTask(''); };
  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>📝 新建任务</h3>
      <div className="form-group"><label>项目名称</label><input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="My Project" /></div>
      <div className="form-group"><label>任务描述</label><textarea value={task} onChange={e => setTask(e.target.value)} placeholder="描述你想要完成的任务..." rows={4} /></div>
      <div className="form-group">
        <label>宏观调控模型 (Orchestrator)</label>
        <select value={modelId} onChange={e => setModelId(e.target.value)}>
          <option value="">自动选择</option>
          {allModels.map(m => <option key={m.id} value={m.id}>{m.pIcon} {m.pName} - {m.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>思考强度</label>
        <select value={thinking} onChange={e => setThinking(e.target.value as any)}>
          <option value="low">低 - 快速响应</option><option value="medium">中 - 平衡</option><option value="high">高 - 深度分析</option>
        </select>
      </div>
      <CostEfficiencySlider value={ratio} onChange={setRatio} />
      <button className="btn btn-primary w-full" style={{ marginTop: 16 }} onClick={handleSubmit} disabled={!task.trim()}>🚀 执行任务</button>
    </div>
  );
}



// ─── Testing Panel ───
function TestingPanel({ providers }: { providers: Provider[] }) {
  const allModels = providers.flatMap(p => p.models.filter(m => m.type === 'llm').map(m => ({ ...m, pName: p.name, pIcon: p.icon, provId: p.id })));
  const [scope, setScope] = useState<'single' | 'provider' | 'all'>('single');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [testMode, setTestMode] = useState<'quick' | 'full'>('quick');
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, label: '' });
  const [reports, setReports] = useState<any[]>([]);
  const [multiResult, setMultiResult] = useState<any>(null);

  const model = allModels.find(m => m.id === selectedModel);
  const uniqueProviders = providers.filter(p => p.models.some(m => m.type === 'llm'));

  const runTest = async () => {
    setTesting(true); setReports([]); setMultiResult(null);
    try {
      if (scope === 'single') {
        if (!model) { alert('请选择模型'); setTesting(false); return; }
        setProgress({ current: 1, total: 1, label: model.modelId });
        const r = testMode === 'quick'
          ? await api.runQuickTest(model.provId, model.id)
          : await api.runFullTest(model.provId, model.id);
        setReports(r.reports || [r]);
      } else if (scope === 'provider') {
        if (!selectedProvider) { alert('请选择提供商'); setTesting(false); return; }
        const prov = providers.find(p => p.id === selectedProvider);
        const count = prov?.models.filter(m => m.type === 'llm').length || 0;
        setProgress({ current: 0, total: count, label: prov?.name || '' });
        const r = await api.runProviderTest(selectedProvider, testMode === 'quick');
        setReports(r.reports || []);
      } else {
        const totalCount = allModels.length;
        setProgress({ current: 0, total: totalCount, label: '所有模型' });
        const r = await api.runAllTest(testMode === 'quick');
        setReports(r.reports || []);
      }
    } catch (e: any) { alert('测试失败: ' + e.message); }
    setTesting(false);
  };

  const runMultiTest = async () => {
    if (!model) { alert('请选择模型'); return; }
    setTesting(true); setMultiResult(null);
    try {
      const r = await api.runMultimodalTest(model.provId, model.id);
      setMultiResult(r);
    } catch (e: any) { alert('多模态测试失败: ' + e.message); }
    setTesting(false);
  };

  // Compute summary stats for batch reports
  const summary = reports.length > 0 ? {
    count: reports.length,
    avgScore: (reports.reduce((s: number, r: any) => s + (r.overallScore || 0), 0) / reports.length).toFixed(1),
    best: reports.reduce((b: any, r: any) => (r.overallScore || 0) > (b.overallScore || 0) ? r : b, reports[0]),
    worst: reports.reduce((w: any, r: any) => (r.overallScore || 0) < (w.overallScore || 0) ? r : w, reports[0]),
  } : null;

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>🧪 模型能力测试</h3>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
        通过标准化测试题评估模型能力，自动评分并更新能力档案。支持单模型、单提供商、全量三种测试范围。
      </p>

      {/* Scope selector */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">📋 测试范围</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {[{k:'single',l:'🎯 单个模型',d:'测试选中的一个模型'},{k:'provider',l:'🔗 单个提供商',d:'测试该URL下所有模型'},{k:'all',l:'🌐 所有模型',d:'测试所有已配置的模型'}].map(s => (
            <div key={s.k} onClick={() => setScope(s.k as any)} style={{ flex: 1, padding: 12, borderRadius: 8, border: '2px solid ' + (scope === s.k ? 'var(--accent)' : 'var(--border)'), cursor: 'pointer', background: scope === s.k ? 'rgba(88,166,255,0.08)' : 'var(--bg-tertiary)', transition: 'all 0.2s' }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{s.l}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{s.d}</div>
            </div>
          ))}
        </div>

        {/* Selector based on scope */}
        {scope === 'single' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} style={{ flex: 1 }}>
              <option value="">选择模型</option>
              {allModels.map(m => <option key={m.id} value={m.id}>{m.pIcon} {m.pName} - {m.modelId}</option>)}
            </select>
          </div>
        )}
        {scope === 'provider' && (
          <select value={selectedProvider} onChange={e => setSelectedProvider(e.target.value)} style={{ width: '100%' }}>
            <option value="">选择提供商 (URL)</option>
            {uniqueProviders.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name} ({p.models.filter(m=>m.type==='llm').length} 模型) - {p.baseUrl}</option>)}
          </select>
        )}
        {scope === 'all' && (
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            将测试 {allModels.length} 个模型，来自 {uniqueProviders.length} 个提供商
          </div>
        )}
      </div>

      {/* Test mode and actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <select value={testMode} onChange={e => setTestMode(e.target.value as any)} style={{ width: 140 }}>
          <option value="quick">⚡ 快速测试 (3题)</option>
          <option value="full">🔬 完整测试 (8题)</option>
        </select>
        <button className="btn btn-primary" onClick={runTest} disabled={testing}>
          {testing ? '⏳ 测试中...' : '🚀 开始' + (scope === 'single' ? '测试' : scope === 'provider' ? '批量测试' : '全量测试')}
        </button>
        {scope === 'single' && model && (
          <button className="btn" onClick={runMultiTest} disabled={testing}>🖼️ 多模态测试</button>
        )}
      </div>

      {/* Progress indicator for batch tests */}
      {testing && (
        <div className="card" style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14 }}>⏳ 正在测试: {progress.label}</div>
          {progress.total > 1 && (
            <>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{progress.current} / {progress.total}</div>
              <div className="progress-bar mt-8"><div className="progress-fill" style={{ width: (progress.total > 0 ? (progress.current / progress.total) * 100 : 50) + '%' }} /></div>
            </>
          )}
        </div>
      )}

      {/* Summary for batch results */}
      {summary && reports.length > 1 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title">📊 测试汇总</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 8 }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700 }}>{summary.count}</div><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>测试模型</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>{summary.avgScore}</div><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>平均分</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: 'var(--success)' }}>{summary.best?.overallScore}</div><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>最高: {summary.best?.modelName?.slice(0, 15)}</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 700, color: 'var(--error)' }}>{summary.worst?.overallScore}</div><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>最低: {summary.worst?.modelName?.slice(0, 15)}</div></div>
          </div>
          {/* Ranking table */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>排名</div>
            {[...reports].sort((a: any, b: any) => (b.overallScore || 0) - (a.overallScore || 0)).map((rep: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: i % 2 === 0 ? 'var(--bg-tertiary)' : 'transparent', borderRadius: 4, fontSize: 12 }}>
                <span style={{ width: 24, fontWeight: 700, color: i === 0 ? 'var(--success)' : i < 3 ? 'var(--accent)' : 'var(--text-secondary)' }}>#{i + 1}</span>
                <span style={{ flex: 1 }}>{rep.providerName} / {rep.modelName}</span>
                <span className={`badge ${rep.overallScore >= 7 ? 'badge-success' : rep.overallScore >= 4 ? 'badge-warning' : 'badge-error'}`}>{rep.overallScore}/10</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual report details */}
      {reports.map((report: any, ri: number) => (
        <div key={ri} className="card" style={{ marginBottom: 12 }}>
          <div className="card-title">
            {reports.length > 1 && <span style={{ color: 'var(--text-secondary)', marginRight: 4 }}>#{ri + 1}</span>}
            {report.modelName} <span className="badge badge-info">{report.providerName}</span>
            <span style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 700 }}>{report.overallScore}/10</span>
          </div>
          {report.error && <div style={{ color: 'var(--error)', fontSize: 12, marginBottom: 8 }}>❌ {report.error}</div>}
          {report.results?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8, marginTop: 8 }}>
              {report.results.map((tr: any) => (
                <div key={tr.testId} style={{ padding: 10, background: 'var(--bg-tertiary)', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 12 }}>{tr.testName}</span>
                    <span className={`badge ${tr.score >= 7 ? 'badge-success' : tr.score >= 4 ? 'badge-warning' : 'badge-error'}`}>{tr.score}/10</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{tr.category} · {tr.latencyMs}ms · {tr.tokensUsed}tok</div>
                  <div style={{ fontSize: 11, marginTop: 2 }}>{tr.details}</div>
                </div>
              ))}
            </div>
          )}
          {report.capabilities && (
            <div style={{ marginTop: 12, padding: 10, background: 'var(--bg-tertiary)', borderRadius: 8 }}>
              <CapabilityBar label="代码" value={report.capabilities.code} color="#3fb950" />
              <CapabilityBar label="推理" value={report.capabilities.agent} color="#58a6ff" />
              <CapabilityBar label="对话" value={report.capabilities.chat} color="#d29922" />
              <CapabilityBar label="速度" value={report.capabilities.speed} color="#f85149" />
            </div>
          )}
        </div>
      ))}

      {/* Multimodal result */}
      {multiResult && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="card-title">🖼️ 多模态测试 <span className={`badge ${multiResult.score >= 7 ? 'badge-success' : multiResult.score >= 4 ? 'badge-warning' : 'badge-error'}`}>{multiResult.score}/10</span></div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>延迟: {multiResult.latencyMs}ms</div>
          <div style={{ marginTop: 8, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 8, fontSize: 13, whiteSpace: 'pre-wrap' }}>{multiResult.details}</div>
        </div>
      )}
    </div>
  );
}

// ─── Coding Panel ───
function CodingPanel({ providers }: { providers: Provider[] }) {
  const allModels = providers.flatMap(p => p.models.filter(m => m.type === 'llm').map(m => ({ ...m, pName: p.name, pIcon: p.icon, provId: p.id })));
  const [description, setDescription] = useState('');
  const [modelId, setModelId] = useState('');
  const [projectPath, setProjectPath] = useState('');
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [workspace, setWorkspace] = useState<any>(null);

  const execute = async () => {
    if (!description.trim()) return;
    setExecuting(true); setResult(null);
    try {
      const model = allModels.find(m => m.id === modelId);
      const r = await api.executeCoding(description, projectPath || undefined, modelId || undefined, model?.provId);
      setResult(r);
      // Refresh workspace
      const ws = await api.getWorkspace();
      setWorkspace(ws);
    } catch (e: any) { alert('执行失败: ' + e.message); }
    setExecuting(false);
  };

  const loadWorkspace = async () => {
    try { const ws = await api.getWorkspace(); setWorkspace(ws); } catch {}
  };

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>💻 自动编程</h3>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
        类似 Codex/Trae 的自动化编程能力。描述你要构建的项目，AI会自动生成计划并执行文件创建、代码编写、依赖安装等操作。
      </p>
      <div className="form-group">
        <label>编程任务描述</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="例如：创建一个Express.js REST API，包含用户CRUD操作和SQLite数据库" rows={4} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label>项目路径</label>
          <input value={projectPath} onChange={e => setProjectPath(e.target.value)} placeholder="my-project (可选)" />
        </div>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label>使用模型</label>
          <select value={modelId} onChange={e => setModelId(e.target.value)}>
            <option value="">自动选择</option>
            {allModels.map(m => <option key={m.id} value={m.id}>{m.pIcon} {m.pName} - {m.modelId}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-primary" onClick={execute} disabled={!description.trim() || executing}>
          {executing ? '⏳ 执行中...' : '🚀 开始编程'}
        </button>
        <button className="btn" onClick={loadWorkspace}>📁 查看工作区</button>
      </div>

      {executing && (
        <div className="card mt-16" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16 }}>🤖 AI正在规划并执行编程任务...</div>
          <div className="progress-bar mt-8"><div className="progress-fill" style={{ width: '70%', animation: 'pulse 1.5s infinite' }} /></div>
        </div>
      )}

      {result && (
        <div className="card mt-16">
          <div className="card-title">📋 执行结果 <span className={`badge ${result.status === 'completed' ? 'badge-success' : 'badge-error'}`}>{result.status}</span></div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>{result.description}</div>
          {result.plan.map((step: any, i: number) => (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <span>{step.status === 'completed' ? '✅' : step.status === 'failed' ? '❌' : step.status === 'running' ? '⏳' : '⬜'}</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{step.action}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{step.description}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 8, fontSize: 12, whiteSpace: 'pre-wrap', maxHeight: 300, overflow: 'auto' }}>{result.output}</div>
        </div>
      )}

      {workspace && workspace.files && workspace.files.length > 0 && (
        <div className="card mt-16">
          <div className="card-title">📁 工作区文件</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{workspace.workDir}</div>
          {workspace.files.map((f: string, i: number) => (
            <div key={i} style={{ padding: '4px 0', fontSize: 12, fontFamily: 'monospace' }}>📄 {f}</div>
          ))}
        </div>
      )}
    </div>
  );
}


export default function App() {
  const [tab, setTab] = useState<'task' | 'providers' | 'models' | 'monitor' | 'testing' | 'coding'>('task');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string; content: string; time: string }>>([]);

  const loadProviders = useCallback(async () => { setProviders(await api.fetchProviders()); }, []);

  useEffect(() => {
    loadProviders();
    const ws = new WebSocket(`ws://${window.location.hostname}:3001`);
    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.payload?.projectId) {
        fetch('/api/projects/' + msg.payload.projectId).then(r => r.json()).then(setProject).catch(() => {});
      }
      setMessages(prev => [...prev.slice(-50), { role: msg.type, content: JSON.stringify(msg.payload).slice(0, 200), time: new Date().toLocaleTimeString() }]);
    };
    return () => ws.close();
  }, [loadProviders]);

  const handleExecute = async (task: string, opts: any) => {
    const proj = await api.createProject(opts.projectName, '', task, opts.orchestratorModel || '');
    setProject(proj);
    setMessages(prev => [...prev, { role: 'user', content: task, time: new Date().toLocaleTimeString() }]);
    await api.executeProject(proj.id, opts);
    setTab('monitor');
  };

  return (
    <div className="app">
      <div className="sidebar">
        <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🧬</span>
            <div><div style={{ fontWeight: 600 }}>Mixture of Agents</div><div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>多模型协同智能体 · 智能调度引擎</div></div>
          </div>
        </div>
        <div style={{ padding: 8 }}>
          {[{k:'task',l:'📝 任务',i:'task'},{k:'monitor',l:'🤖 监控',i:'monitor'},{k:'providers',l:'📦 提供商',i:'providers'},{k:'models',l:'🎯 模型',i:'models'},{k:'testing',l:'🧪 测试',i:'testing'},{k:'coding',l:'💻 编程',i:'coding'}].map(t => (
            <div key={t.k} className={`tab ${tab === t.k ? 'active' : ''}`} onClick={() => setTab(t.k as any)}>{t.l}</div>
          ))}
        </div>
        <div style={{ padding: 12, flex: 1, overflowY: 'auto', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>📡 实时日志</div>
          {messages.slice(-15).map((m, i) => (
            <div key={i} style={{ padding: '3px 0', fontSize: 11, borderBottom: '1px solid rgba(48,54,61,0.5)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{m.time}</span>{' '}
              <span style={{ color: 'var(--accent)' }}>{m.role}</span>: {m.content.slice(0, 80)}
            </div>
          ))}
        </div>
      </div>
      <div className="main-content">
        <div className="header"><h1>{tab === 'task' ? '📝 新建任务' : tab === 'monitor' ? '🤖 子代理监控' : tab === 'providers' ? '📦 提供商管理' : '🎯 模型能力'}</h1></div>
        <div className="panel">
          {tab === 'task' && <TaskPanel providers={providers} onExecute={handleExecute} />}
          {tab === 'providers' && <ProviderSetup onRefresh={loadProviders} />}
          {tab === 'models' && <ModelCapabilities providers={providers} />}
          {tab === 'monitor' && <AgentMonitor project={project} />}
          {tab === 'testing' && <TestingPanel providers={providers} />}
          {tab === 'coding' && <CodingPanel providers={providers} />}
        </div>
      </div>
    </div>
  );
}
