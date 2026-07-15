const fs = require('fs');
const p = 'backend/src/routes/chat.ts';
let c = fs.readFileSync(p, 'utf-8');

// The ratio was moved up. But there are still uses of it later (chatTemperature, chatMaxTokens).
// The original declaration was removed from its old position. Let me check if it's still there.
const hasRatioDecl = c.includes("const ratio = typeof costEfficiencyRatio");
const hasChatTemp = c.includes("const chatTemperature = 0.1 + ratio * 0.7");

console.log('Has ratio declaration:', hasRatioDecl);
console.log('Has chatTemperature:', hasChatTemp);

// Count occurrences of 'const ratio'
const ratioCount = (c.match(/const ratio = typeof costEfficiencyRatio/g) || []).length;
console.log('Ratio declaration count:', ratioCount);
