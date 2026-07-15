const fs = require('fs');
const p = 'frontend/src/App.tsx';
let c = fs.readFileSync(p, 'utf-8');

// 1. Update the model assignment config to add capability filters
const oldConfig = `{ key: 'code', label: '\u{1F4BB} \u4EE3\u7801', types: ['llm'] },
              { key: 'reasoning', label: '\u{1F9E0} \u63A8\u7406', types: ['llm'] },
              { key: 'chat', label: '\u{1F4AC} \u5BF9\u8BDD', types: ['llm'] },
              { key: 'general', label: '\u{1F3AF} \u901A\u7528', types: ['llm'] },
              { key: 'vision', label: '\u{1F441} \u89C6\u89C9', types: ['llm'] },
              { key: 'tts', label: '\u{1F50A} TTS', types: ['tts', 'llm'] },
              { key: 'stt', label: '\u{1F399} STT', types: ['stt', 'llm'] },
              { key: 'image', label: '\u{1F3A8} \u56FE\u50CF\u751F\u6210', types: ['image', 'llm'] },`;

const newConfig = `{ key: 'code', label: '\u{1F4BB} \u4EE3\u7801', types: ['llm'], filter: (m) => m.type === 'llm' },
              { key: 'reasoning', label: '\u{1F9E0} \u63A8\u7406', types: ['llm'], filter: (m) => m.type === 'llm' },
              { key: 'chat', label: '\u{1F4AC} \u5BF9\u8BDD', types: ['llm'], filter: (m) => m.type === 'llm' },
              { key: 'general', label: '\u{1F3AF} \u901A\u7528', types: ['llm'], filter: (m) => m.type === 'llm' },
              { key: 'vision', label: '\u{1F441} \u89C6\u89C9', types: ['llm'], filter: (m) => m.capabilities?.visionScore > 0 || m.capabilities?.multimodal },
              { key: 'audio', label: '\u{1F50A} \u97F3\u9891', types: ['llm'], filter: (m) => m.capabilities?.audioScore > 0 },
              { key: 'tts', label: '\u{1F50A} TTS', types: ['tts'], filter: (m) => m.type === 'tts' },
              { key: 'stt', label: '\u{1F399} STT', types: ['stt'], filter: (m) => m.type === 'stt' },
              { key: 'image', label: '\u{1F3A8} \u56FE\u50CF\u751F\u6210', types: ['image'], filter: (m) => m.type === 'image' },`;

c = c.replace(oldConfig, newConfig);

// 2. Update the model filter in the select to use cfg.filter
const oldFilter = `providers.flatMap(p => p.models.filter(m => cfg.types.includes(m.type) || (cfg.key === 'vision' && m.capabilities?.visionScore > 0) || (cfg.key === 'vision' && m.capabilities?.multimodal)).map(m => (`;
const newFilter = `providers.flatMap(p => p.models.filter(m => cfg.filter ? cfg.filter(m) : cfg.types.includes(m.type)).map(m => (`;
c = c.replace(oldFilter, newFilter);

// 3. Update the description text
const oldDesc = '\u{1F527} \u4E3A\u4E0D\u540C\u4EFB\u52A1\u7C7B\u578B\u6307\u5B9A\u4E13\u7528\u6A21\u578B\u3002\u9ED8\u8BA4\u{1F527} \u201C\u8BA9\u5168\u5C40\u6A21\u578B\u51B3\u5B9A\u201D\u7531\u5B8F\u89C2\u8C03\u63A7\u6A21\u578B\u6839\u636E\u4EFB\u52A1\u81EA\u52A8\u9009\u62E9\u5B50\u4EE3\u7406\u6A21\u578B';
const newDesc = '\u{1F527} \u4E3A\u4E0D\u540C\u4EFB\u52A1\u7C7B\u578B\u6307\u5B9A\u9996\u9009\u6A21\u578B\uFF0C\u5931\u6548\u65F6\u81EA\u52A8\u56DE\u9000\u3002\u201C\u{1F527} \u8BA9\u5168\u5C40\u6A21\u578B\u51B3\u5B9A\u201D\u7531\u7B56\u7565\u6A21\u578B\u6309\u8D28\u91CF/\u901F\u5EA6\u6BD4\u4F8B\u81EA\u52A8\u9009\u62E9';
c = c.replace(oldDesc, newDesc);

fs.writeFileSync(p, c, 'utf-8');
console.log('Updated agent model assignment config');
