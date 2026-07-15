const fs = require('fs');
const p = 'backend/src/routes/chat.ts';
let lines = fs.readFileSync(p, 'utf-8').split('\n');

// Find the ratio declaration line
let ratioDeclLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("const ratio = typeof costEfficiencyRatio")) {
    ratioDeclLine = i;
    break;
  }
}

// Find the hasAutoDecision line
let hasAutoLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("const hasAutoDecision = entries.some")) {
    hasAutoLine = i;
    break;
  }
}

if (ratioDeclLine > 0 && hasAutoLine > 0 && ratioDeclLine > hasAutoLine) {
  // Move ratio declaration before hasAutoDecision
  const ratioLine = lines[ratioDeclLine];
  lines.splice(ratioDeclLine, 1); // Remove from old position
  lines.splice(hasAutoLine, 0, ratioLine); // Insert before hasAutoDecision
  fs.writeFileSync(p, lines.join('\n'), 'utf-8');
  console.log('Moved ratio declaration from line ' + (ratioDeclLine+1) + ' to line ' + (hasAutoLine+1));
} else {
  console.log('ratioDecl=' + ratioDeclLine + ' hasAuto=' + hasAutoLine + ' - no move needed');
}
