const fs = require('fs');
const p = 'backend/src/routes/chat.ts';
let c = fs.readFileSync(p, 'utf-8');

// Update the system prompt for agent model map
const oldPrompt1 = "Sub-agent model assignments: ' + mapInfo + '. When value is empty, you (the orchestrator) decide which model to use for each sub-task.";
const newPrompt1 = "Sub-agent model PREFERRED assignments (these are first-choice models; if they fail, you may fall back to any available model): ' + mapInfo + '.";
c = c.replace(oldPrompt1, newPrompt1);

// Update the second prompt about strategy model selection
const oldPrompt2 = "if (hasAutoDecision) parts.push('For unassigned sub-task types, you (the orchestrator) must decide the best available model before dispatching the sub-agent.');";
const newPrompt2 = "if (hasAutoDecision) { const ratioDesc = ratio < 0.3 ? 'prefer fast/cheap models' : ratio > 0.7 ? 'prefer high-quality models' : 'balance quality and speed'; parts.push('For unassigned sub-task types, select the best model based on quality/speed ratio (' + ratioDesc + ', ratio=' + ratio.toFixed(2) + ').'); }";
c = c.replace(oldPrompt2, newPrompt2);

fs.writeFileSync(p, c, 'utf-8');
console.log('Updated strategy model selection prompts');
