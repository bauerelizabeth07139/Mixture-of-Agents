# Read current file
with open(r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The App function is missing. Add it after the ExtensionsPanel closing brace.
# First, check if there's already a ChatMsg type defined
if 'type ChatMsg' not in content and 'interface ChatMsg' not in content:
    # Add ChatMsg type before the App function
    pass

# The App component needs to be added at the end
app_component = r'''

// ─── Main App ───
interface ChatMsg {
  id: string; role: 'user' | 'orchestrator' | 'agent' | 'error' | 'system';
  content: string; time: string; model?: string; agentName?: string;
  tools?: Array<{ name: string; status: string; output?: string; icon: string }>;
  agents?: Array<{ name: string; status: string; task: string; model: string }>;
  attachments?: Array<{ type: 'image' | 'text' | 'file'; name: string; data: string; preview?: string; size?: number }>;
}

function App() {
  const [tab, setTab] = useState<'chat' | 'providers' | 'models' | 'testing' | 'extensions' | 'terminal' | 'editor' | 'environment'>('chat');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [sending, setSending] = useState(false);
  const [modelId, setModelId] = useState('');
  const [thinking, setThinking] = useState<'low' | 'medium' | 'high'>('medium');
  const [ratio, setRatio] = useState(0.5);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [attachments, setAttachments] = useState<Array<{ type: 'image' | 'text' | 'file'; name: string; data: string; preview?: string; size?: number }>>([]);
  const [dragging, setDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabNames: Record<string, string> = {
    chat: '对话', providers: '提供商', models: '模型', testing: '测试',
    extensions: '扩展', terminal: '终端', editor: '编辑器', environment: '环境',
  };

  const loadProviders = useCallback(async () => {
    try { const data = await api.fetchProviders(); setProviders(data); } catch {}
  }, []);

  useEffect(() => { loadProviders(); }, [loadProviders]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, sending]);

  // Drag-drop handlers
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
    const handleDragLeave = (e: DragEvent) => { if (e.relatedTarget === null) setDragging(false); };
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault(); setDragging(false);
      if (!e.dataTransfer?.files) return;
      const files = Array.from(e.dataTransfer.files);
      await processFiles(files);
    };
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    return () => { window.removeEventListener('dragover', handleDragOver); window.removeEventListener('dragleave', handleDragLeave); window.removeEventListener('drop', handleDrop); };
  }, []);

  const processFiles = async (files: File[]) => {
    const newAttachments: typeof attachments = [];
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>(res => { reader.onload = () => res(reader.result as string); reader.readAsDataURL(file); });
        newAttachments.push({ type: 'image', name: file.name, data: dataUrl, preview: dataUrl, size: file.size });
      } else if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.json') || file.name.endsWith('.py') || file.name.endsWith('.ts') || file.name.endsWith('.js')) {
        const reader = new FileReader();
        const text = await new Promise<string>(res => { reader.onload = () => res(reader.result as string); reader.readAsText(file); });
        newAttachments.push({ type: 'text', name: file.name, data: text, size: file.size });
      } else {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>(res => { reader.onload = () => res(reader.result as string); reader.readAsDataURL(file); });
        newAttachments.push({ type: 'file', name: file.name, data: dataUrl, size: file.size });
      }
    }
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleSend = useCallback(async (overrideText?: string) => {
    const text = overrideText || inputVal.trim();
    if (!text && attachments.length === 0) return;
    setSending(true);
    const userMsg: ChatMsg = {
      id: Date.now().toString(), role: 'user', content: text, time: new Date().toLocaleTimeString('zh-CN'),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setAttachments([]);

    try {
      // Build message content
      let content = text;
      // For images, if model doesn't support vision, find a VLM model to describe first
      const imageAttachments = attachments.filter(a => a.type === 'image');
      if (imageAttachments.length > 0) {
        const selectedModel = providers.flatMap(p => p.models).find(m => m.id === modelId);
        if (selectedModel && !selectedModel.capabilities.multimodal) {
          // Find a VLM model
          const vlmModel = providers.flatMap(p => p.models).find(m => m.type === 'vlm');
          if (vlmModel) {
            content = `[使用 ${vlmModel.name} 分析图片]\n${text}`;
          }
        }
        // Include image descriptions
        for (const img of imageAttachments) {
          content += `\n[附件: ${img.name}]`;
        }
      }

      // Include text attachments
      const textAttachments = attachments.filter(a => a.type === 'text');
      for (const ta of textAttachments) {
        content += `\n\n--- 文件: ${ta.name} ---\n${ta.data.slice(0, 5000)}`;
      }

      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, modelId: modelId || undefined, thinkingMode: thinking, costEfficiencyRatio: ratio }),
      });
      const data = await res.json();
      const assistantMsg: ChatMsg = {
        id: (Date.now() + 1).toString(), role: data.role || 'orchestrator',
        content: data.content || data.message || JSON.stringify(data),
        time: new Date().toLocaleTimeString('zh-CN'), model: data.model,
        tools: data.tools, agents: data.agents,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'error', content: 'Error: ' + err.message, time: new Date().toLocaleTimeString('zh-CN') }]);
    } finally {
      setSending(false);
    }
  }, [inputVal, attachments, modelId, thinking, ratio, providers]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    await processFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  return (
    <div className="app">
      {/* Drag overlay */}
      {dragging && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(56,189,248,0.15)', border: '3px dashed var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>📎 拖放文件到此处</div>
        </div>
      )}

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <span style={{ fontSize: 22 }}>🧬</span>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Mixture of Agents</span>
        </div>
        <div className="sidebar-nav">
          {(['chat', 'providers', 'models', 'testing', 'extensions', 'terminal', 'editor', 'environment'] as const).map(k => (
            <div key={k} className={`sidebar-item ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>
              <span>{k === 'chat' ? '💬' : k === 'providers' ? '🔑' : k === 'models' ? '🤖' : k === 'testing' ? '🧪' : k === 'extensions' ? '🧩' : k === 'terminal' ? '💻' : k === 'editor' ? '📝' : '🌐'}</span>
              <span>{tabNames[k]}</span>
            </div>
          ))}
        </div>
        {tab === 'chat' && messages.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-section-title">最近对话</div>
            {messages.filter(m => m.role === 'user').slice(-8).reverse().map(m => (
              <div key={m.id} style={{ padding: '6px 0', fontSize: 11, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                onClick={() => { const el = document.getElementById('msg-' + m.id); el?.scrollIntoView({ behavior: 'smooth' }); }}>
                {m.content.slice(0, 40)}...
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      {tab === 'chat' ? (
        <div className="main-content">
          <div className="chat-container">
            {messages.length === 0 ? (
              <WelcomeScreen onQuickStart={(task) => { setInputVal(task); setTimeout(() => handleSend(task), 100); }} />
            ) : (
              <div className="chat-messages">
                {messages.map(m => <div key={m.id} id={'msg-' + m.id}><ChatMessage msg={m} /></div>)}
                {sending && (
                  <div className="message">
                    <div className="message-avatar orchestrator">🧠</div>
                    <div className="message-body">
                      <div className="message-header"><span className="message-name">调度引擎</span><span className="message-time">思考中...</span></div>
                      <div style={{ display: 'flex', gap: 4, padding: '4px 0' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1s infinite 0s' }} />
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1s infinite 0.2s' }} />
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1s infinite 0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Prompt Bar */}
            <div className="prompt-bar">
              {/* Attachment previews */}
              {attachments.length > 0 && <AttachmentPreview attachments={attachments} onRemove={(i) => setAttachments(prev => prev.filter((_, idx) => idx !== i))} />}

              <div className="prompt-wrapper">
                <textarea ref={inputRef} className="prompt-input" value={inputVal} onChange={e => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown} placeholder="描述你的任务... (Enter 发送, Shift+Enter 换行, 拖拽文件可上传)"
                  rows={1} style={{ height: Math.min(120, Math.max(24, inputVal.split('\n').length * 22)) }} />
                <div className="prompt-actions">
                  <input ref={fileInputRef} type="file" multiple accept="image/*,.txt,.md,.json,.py,.ts,.js,.csv,.xml,.yaml,.yml" style={{ display: 'none' }} onChange={handleFileInput} />
                  <button className="prompt-btn" onClick={() => fileInputRef.current?.click()} title="添加文件" style={{ fontSize: 16, fontWeight: 700 }}>＋</button>
                  <button className="prompt-btn send" onClick={() => handleSend()} disabled={(!inputVal.trim() && attachments.length === 0) || sending}>▶</button>
                </div>
              </div>
              <div className="prompt-meta">
                <span className="prompt-meta-chip" onClick={() => setSettingsOpen(!settingsOpen)}>
                  ⚙️ {modelId ? providers.flatMap(p => p.models).find(m => m.id === modelId)?.name || '已选模型' : '自动选择'}
                </span>
                <span className="prompt-meta-chip" onClick={() => setSettingsOpen(!settingsOpen)}>
                  🧠 {thinking === 'low' ? '低' : thinking === 'medium' ? '中' : '高'}
                </span>
                <span className="prompt-meta-chip" onClick={() => setSettingsOpen(!settingsOpen)}>
                  {ratio <= 0.2 ? '🚀 效率' : ratio >= 0.8 ? '💰 成本' : '⚖️ 均衡'} {ratio}
                </span>
                <span style={{ marginLeft: 'auto' }}>{providers.length} 提供商 · {providers.flatMap(p => p.models).length} 模型</span>
              </div>
            </div>
          </div>

          {/* Settings Drawer */}
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

export default App;
'''

with open(r'C:\Users\vipuser\Documents\Codex\2026-07-08\ghp-ximpubtls1rxrj8gyywz03sikbglkw259kdn-2\work\moa-src\frontend\src\App.tsx', 'a', encoding='utf-8') as f:
    f.write(app_component)
print('Appended App component')