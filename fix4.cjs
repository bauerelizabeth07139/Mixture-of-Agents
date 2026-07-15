const fs = require('fs');
const p = 'frontend/src/App.tsx';
let lines = fs.readFileSync(p, 'utf-8').split('\n');

// Find the config array lines
let configStart = -1;
let configEnd = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("key: 'code'") && lines[i].includes("types: ['llm']")) {
    configStart = i;
  }
  if (configStart > 0 && lines[i].includes("key: 'image'")) {
    configEnd = i;
    break;
  }
}

if (configStart > 0 && configEnd > 0) {
  // Replace the config block
  const indent = '              ';
  const newConfig = [
    "{ key: 'code', label: '\u{1F4BB} \u4EE3\u7801', types: ['llm'], filter: (m) => m.type === 'llm' },",
    "{ key: 'reasoning', label: '\u{1F9E0} \u63A8\u7406', types: ['llm'], filter: (m) => m.type === 'llm' },",
    "{ key: 'chat', label: '\u{1F4AC} \u5BF9\u8BDD', types: ['llm'], filter: (m) => m.type === 'llm' },",
    "{ key: 'general', label: '\u{1F3AF} \u901A\u7528', types: ['llm'], filter: (m) => m.type === 'llm' },",
    "{ key: 'vision', label: '\u{1F441} \u89C6\u89C9', types: ['llm'], filter: (m) => (m.capabilities?.visionScore > 0) || m.capabilities?.multimodal },",
    "{ key: 'audio', label: '\u{1F50A} \u97F3\u9891', types: ['llm'], filter: (m) => m.capabilities?.audioScore > 0 },",
    "{ key: 'tts', label: '\u{1F50A} TTS', types: ['tts'], filter: (m) => m.type === 'tts' },",
    "{ key: 'stt', label: '\u{1F399} STT', types: ['stt'], filter: (m) => m.type === 'stt' },",
    "{ key: 'image', label: '\u{1F3A8} \u56FE\u50CF\u751F\u6210', types: ['image'], filter: (m) => m.type === 'image' },",
  ];

  lines.splice(configStart, configEnd - configStart + 1, ...newConfig.map(l => indent + l));
  fs.writeFileSync(p, lines.join('\n'), 'utf-8');
  console.log('Replaced config at lines ' + configStart + '-' + configEnd);
} else {
  console.log('Config not found: start=' + configStart + ' end=' + configEnd);
}
