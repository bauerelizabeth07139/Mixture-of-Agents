const fs = require('fs');
const p = 'frontend/src/App.tsx';
let c = fs.readFileSync(p, 'utf-8');
const marker = "} else if (evt === 'llm_response') {";
const insert = `} else if (evt === 'stream_token') {
                  setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: (m._streamingContent || '') + d.content, _streamingContent: (m._streamingContent || '') + d.content } : m));
                } else if (evt === 'llm_response') {`;
c = c.replace(marker, insert);
fs.writeFileSync(p, c, 'utf-8');
console.log('Done');
