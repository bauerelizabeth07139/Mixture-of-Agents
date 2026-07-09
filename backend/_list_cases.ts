import { CapabilityTestEngine } from './src/services/capability-test';
const cases = CapabilityTestEngine.getTestCases();
console.log(JSON.stringify(cases.map(c=>({id:c.id,name:c.name,cat:c.category})), null, 2));
