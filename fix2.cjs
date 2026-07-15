const fs = require('fs');
const p = 'frontend/src/App.tsx';
let c = fs.readFileSync(p, 'utf-8');
c = c.replace(
  "codeExecution?: Array<{lang: string; filename?: string; stdout: string; stderr: string; exitCode: number}>; thinkingMode?: string; serveUrl?: string;",
  "codeExecution?: Array<{lang: string; filename?: string; stdout: string; stderr: string; exitCode: number}>; thinkingMode?: string; serveUrl?: string; _streamingContent?: string;"
);
fs.writeFileSync(p, c, 'utf-8');
console.log('Done - added _streamingContent to ChatMsg');
