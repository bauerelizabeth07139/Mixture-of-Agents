const fs = require('fs');
const p = 'backend/src/routes/chat.ts';
let lines = fs.readFileSync(p, 'utf-8').split('\n');

// Find the ratio line and move it before the if block
let ratioLineIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("const ratio = typeof costEfficiencyRatio")) {
    ratioLineIdx = i;
    break;
  }
}

// Find the if (agentModelMap line before it
let ifLineIdx = -1;
for (let i = ratioLineIdx - 1; i >= 0; i--) {
  if (lines[i].includes("if (agentModelMap && Object.keys(agentModelMap)")) {
    ifLineIdx = i;
    break;
  }
}

if (ratioLineIdx > 0 && ifLineIdx > 0) {
  const ratioLine = lines[ratioLineIdx];
  lines.splice(ratioLineIdx, 1);
  lines.splice(ifLineIdx, 0, ratioLine);
  fs.writeFileSync(p, lines.join('\n'), 'utf-8');
  console.log('Moved ratio to line ' + (ifLineIdx+1));
} else {
  console.log('Not found: ratio=' + ratioLineIdx + ' if=' + ifLineIdx);
}
