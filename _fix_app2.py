# Read the file which now ends at "// --- Main App ---" comment
with open(r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Check if ChatMsg interface already exists
has_chatmsg = 'interface ChatMsg' in content

app_code = '''

export default function App() {
  const [tab, setTab] = useState<'chat'|'providers'|'models'|'testing'|'extensions'|'terminal'|'editor'|'environment'>('chat');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [sending, setSending] = useState(false);
  const [modelId, setModelId] = useState('');
  const [thinking, setThinking] = useState<'low'|'medium'|'high'>('medium');
  const [ratio, setRatio] = useState(0.5);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [attachments, setAttachments] = useState<Array<{type:'image'|'text'|'file', name: string, data: string, preview?: string, size?: number}>>([]);
  const [dragging, setDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const tabNames: Record<string, string> = {
    chat: '对话', providers: '提供商', models: '模型', testing: '测试',
    extensions: '扩展', terminal: '终端', editor: '编辑器', environment: '环境',
  };

  const loadProviders = useCallback(async () => {
    try { const data = await api.fetchProviders(); setProviders(data); } catch {}
  }, []);

  useEffect(() => { loadProviders(); }, [loadProviders]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, sending]);

  // Drag-drop
  useEffect(() => {
    const onOver = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer?.types.includes('Files')) setDragging(true); };
    const onEnter = (e: DragEvent) => { e.preventDefault(); dragCounterRef.current++; if (e.dataTransfer?.types.includes('Files')) setDragging(true); };
    const onLeave = (e: DragEvent) => { dragCounterRef.current--; if (dragCounterRef.current === 0) setDragging(false); };
    const onDrop = (e: DragEvent) => {
      e.preventDefault(); e.stopPropagation(); setDragging(false); dragCounterRef.current = 0;
      if (e.dataTransfer?.files) processFiles(Array.from(e.dataTransfer.files));
    };
    window.addEventListener('dragover', onOver);
    window.addEventListener('dragenter', onEnter);
    window.addEventListener('dragleave', onLeave);
    window.addEventListener('drop', onDrop);
    return () => { window.removeEventListener('dragover', onOver); window.removeEventListener('dragenter', onEnter); window.removeEventListener('dragleave', onLeave); window.removeEventListener('drop', onDrop); };
  }, []);

  const processFiles = useCallback((files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader();
      if (file.type.startsWith('image/')) {
        reader.onload = () => setAttachments(prev => [...prev, { type: 'image', name: file.name, data: reader.result as string, preview: reader.result as string, size: file.size }]);
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('text/') || /\\.(txt|md|json|py|ts|tsx|js|jsx|csv|xml|yaml|yml|html|css)$/i.test(file.name)) {
        reader.onload = () => setAttachments(prev => [...prev, { type: 'text', name: file.name, data: reader.result as string, size: file.size }]);
        reader.readAsText(file);
      } else {
        reader.onload = () => setAttachments(prev => [...prev, { type: 'file', name: file.name, data: reader.result as string, size: file.size }]);
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const selectedModelSupportsVision = useCallback(() => {
    if (!modelId) return false;
    const m = providers.flatMap(p => p.models).find(m => m.id === modelId);
    return m?.capabilities?.multimodal || m?.type === 'vlm' || false;
  }, [modelId, providers]);

  const findVlmModel = useCallback(() => {
    return providers.flatMap(p => p.models).find(m => m.type === 'vlm' || m.capabilities?.multimodal);
  }, [providers]);

  const handleSend = useCallback(async (overrideText?: string) => {
    const task = overrideText || inputVal.trim();
    if ((!task && attachments.length === 0) || sending) return;
    setSending(true);
    const currentAttachments = [...attachments];
    setAttachments([]);
    let content = task;

    // Vision dispatch: if model lacks vision, use VLM to describe images
    const imageAttachments = currentAttachments.filter(a => a.type === 'image');
    if (imageAttachments.length > 0 && !selectedModelSupportsVision()) {
      const vlm = findVlmModel();
      if (vlm) {
        content = `[由 ${vlm.name} 视觉模型分析图片后提供描述作为上下文]\\n${task}`;
      }
    }
    const textAttachments = currentAttachments.filter(a => a.type === 'text');
    if (textAttachments.length > 0) {
      content += '\\n\\n' + textAttachments.map(a => `--- 文件: ${a.name} ---\\n${a.data}\\n--- 结束 ---`).join('\\n\\n');
    }

    const userMsg: ChatMsg = { id: Date.now().toString(), role: 'user', content, time: new Date().toLocaleTimeString('zh-CN'), attachments: currentAttachments.length > 0 ? currentAttachments : undefined };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: content, modelId: modelId || undefined, thinkingMode: thinking, costEfficiencyRatio: ratio }) });
      const data = await res.json();
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: data.role || 'orchestrator', content: data.content || data.message || JSON.stringify(data), time: new Date().toLocaleTimeString('zh-CN'), model: data.model, tools: data.tools, agents: data.agents }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'error', content: 'Error: ' + err.message, time: new Date().toLocaleTimeString('zh-CN') }]);
    } finally { setSending(false); }
  }, [inputVal, attachments, modelId, thinking, ratio, providers, selectedModelSupportsVision, findVlmModel, sending]);

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) { processFiles(Array.from(e.target.files)); e.target.value = ''; } };

  return (
    <div className="app">
      {dragging && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(56,189,248,0.15)', border:'3px dashed var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
          <div style={{ fontSize:24, fontWeight:700, color:'var(--accent)' }}>📎 拖放文件到此处</div>
        </div>
      )}
      <input ref={fileInputRef} type="file" multiple accept="image/*,.txt,.md,.json,.csv,.py,.js,.ts,.tsx,.jsx,.html,.css,.xml,.yaml,.yml" style={{ display:'none' }} onChange={handleFileInput} />
      <div className="sidebar">
        <div className="sidebar-logo"><span style={{ fontSize:22 }}>🧬</span><span style={{ fontWeight:700, fontSize:14 }}>Mixture of Agents</span></div>
        <div className="sidebar-nav">
          {(['chat','providers','models','testing','extensions','terminal','editor','environment'] as const).map(k => (
            <div key={k} className={`sidebar-item ${tab===k?'active':''}`} onClick={() => setTab(k)}>
              <span>{k==='chat'?'💬':k==='providers'?'🔑':k==='models'?'🤖':k==='testing'?'🧪':k==='extensions'?'🧩':k==='terminal'?'💻':k==='editor'?'📝':'🌐'}</span>
              <span>{tabNames[k]}</span>
            </div>
          ))}
        </div>
      </div>
      {tab === 'chat' ? (
        <div className="main-content">
          <div className="chat-container">
            {messages.length === 0 ? (
              <WelcomeScreen onQuickStart={(task) => { setInputVal(task); setTimeout(() => handleSend(task), 100); }} />
            ) : (
              <div className="chat-messages">
                {messages.map(m => <div key={m.id} id={'msg-'+m.id}><ChatMessage msg={m} /></div>)}
                {sending && (
                  <div className="message">
                    <div className="message-avatar orchestrator">🧠</div>
                    <div className="message-body">
                      <div className="message-header"><span className="message-name">调度引擎</span><span className="message-time">思考中...</span></div>
                      <div style={{ display:'flex', gap:4, padding:'4px 0' }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent)', animation:'pulse 1s infinite 0s' }} />
                        <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent)', animation:'pulse 1s infinite 0.2s' }} />
                        <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent)', animation:'pulse 1s infinite 0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
            <div className="prompt-bar">
              {attachments.length > 0 && <AttachmentPreview attachments={attachments} onRemove={(i) => setAttachments(prev => prev.filter((_, idx) => idx !== i))} />}
              <div className="prompt-wrapper">
                <textarea ref={inputRef} className="prompt-input" value={inputVal} onChange={e => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown} placeholder="描述你的任务... (Enter 发送, Shift+Enter 换行, 拖拽文件可上传)"
                  rows={1} style={{ height: Math.min(120, Math.max(24, inputVal.split('\\n').length * 22)) }} />
                <div className="prompt-actions">
                  <button className="prompt-btn" onClick={() => fileInputRef.current?.click()} title="添加文件" style={{ fontSize:16, fontWeight:700 }}>＋</button>
                  <button className="prompt-btn send" onClick={() => handleSend()} disabled={(!inputVal.trim() && attachments.length===0) || sending}>▶</button>
                </div>
              </div>
              <div className="prompt-meta">
                <span className="prompt-meta-chip" onClick={() => setSettingsOpen(!settingsOpen)}>⚙️ {modelId ? providers.flatMap(p=>p.models).find(m=>m.id===modelId)?.name || '已选模型' : '自动选择'}</span>
                <span className="prompt-meta-chip" onClick={() => setSettingsOpen(!settingsOpen)}>🧠 {thinking==='low'?'低':thinking==='medium'?'中':'高'}</span>
                <span className="prompt-meta-chip" onClick={() => setSettingsOpen(!settingsOpen)}>{ratio<=0.2?'🚀 效率':ratio>=0.8?'💰 成本':'⚖️ 均衡'} {ratio}</span>
                <span style={{ marginLeft:'auto' }}>{providers.length} 提供商 · {providers.flatMap(p=>p.models).length} 模型</span>
              </div>
            </div>
          </div>
          <SettingsPanel providers={providers} ratio={ratio} setRatio={setRatio} thinking={thinking} setThinking={setThinking}
            modelId={modelId} setModelId={setModelId} visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
      ) : (
        <div className="main-content">
          <div className="header"><h1>{tabNames[tab]}</h1></div>
          {tab === 'providers' && <ProviderPanel providers={providers} onRefresh={loadProviders} />}
          {tab === 'models' && <ModelPanel providers={providers} />}
          {tab === 'testing' && <TestingPanel providers={providers} />}
          {tab === 'extensions' && <ExtensionsPanel />}
          {tab === 'terminal' && <div style={{height:'calc(100vh - 60px)'}}><TerminalPanel /></div>}
          {tab === 'editor' && <div style={{height:'calc(100vh - 60px)'}}><EditorPanel /></div>}
          {tab === 'environment' && <EnvironmentPanel />}
        </div>
      )}
    </div>
  );
}
'''

with open(r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx', 'a', encoding='utf-8') as f:
    f.write(app_code)
print('Appended App component')