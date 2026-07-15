const fs = require('fs');
const p = 'frontend/src/App.tsx';
let c = fs.readFileSync(p, 'utf-8');

// Add type annotation to filter functions
c = c.replace(/filter: \(m\) =>/g, 'filter: (m: any) =>');

fs.writeFileSync(p, c, 'utf-8');
console.log('Added type annotations');
