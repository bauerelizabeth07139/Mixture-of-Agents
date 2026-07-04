const B = '/api';
const h = { 'Content-Type': 'application/json' };
export const api = {
  fetchPresets: () => fetch(B+'/providers/presets').then(r=>r.json()),
  fetchProviders: () => fetch(B+'/providers').then(r=>r.json()),
  addPreset: (pid: string) => fetch(B+'/providers/from-preset',{method:'POST',headers:h,body:JSON.stringify({presetId:pid})}).then(r=>r.json()),
  addCustom: (n: string, u: string) => fetch(B+'/providers/custom',{method:'POST',headers:h,body:JSON.stringify({name:n,baseUrl:u})}).then(r=>r.json()),
  addKey: (pid: string, k: string) => fetch(B+'/providers/'+pid+'/keys',{method:'POST',headers:h,body:JSON.stringify({key:k})}).then(r=>r.json()),
  removeKey: (pid: string, kid: string) => fetch(B+'/providers/'+pid+'/keys/'+kid,{method:'DELETE'}).then(r=>r.json()),
  fetchModels: (pid: string) => fetch(B+'/providers/'+pid+'/fetch-models',{method:'POST',headers:h}).then(r=>r.json()),
  testModel: (pid: string, mid: string) => fetch(B+'/providers/'+pid+'/models/'+mid+'/test',{method:'POST'}).then(r=>r.json()),
  // Testing - single model
  runFullTest: (pid: string, mid: string) => fetch(B+'/testing/'+pid+'/models/'+mid+'/test-full',{method:'POST',headers:h}).then(r=>r.json()),
  runQuickTest: (pid: string, mid: string) => fetch(B+'/testing/'+pid+'/models/'+mid+'/test-quick',{method:'POST',headers:h}).then(r=>r.json()),
  // Testing - provider scope (all models under one URL)
  runProviderTest: (pid: string, quick?: boolean) => fetch(B+'/testing/'+pid+'/test-all',{method:'POST',headers:h,body:JSON.stringify({quick:quick!==false})}).then(r=>r.json()),
  // Testing - all models
  runAllTest: (quick?: boolean) => fetch(B+'/testing/test-all-models',{method:'POST',headers:h,body:JSON.stringify({quick:quick!==false})}).then(r=>r.json()),
  // Multimodal
  runMultimodalTest: (pid: string, mid: string, imageUrl?: string) => fetch(B+'/testing/'+pid+'/models/'+mid+'/test-multimodal',{method:'POST',headers:h,body:JSON.stringify({imageUrl})}).then(r=>r.json()),
  // Coding
  executeCoding: (desc: string, projPath?: string, modelId?: string, providerId?: string) => fetch(B+'/coding/execute',{method:'POST',headers:h,body:JSON.stringify({description:desc,projectPath:projPath,modelId:modelId,providerId:providerId})}).then(r=>r.json()),
  getWorkspace: () => fetch(B+'/coding/workspace').then(r=>r.json()),
  // Projects
  fetchProjects: () => fetch(B+'/projects').then(r=>r.json()),
  createProject: (n: string, d: string, t: string, m: string) => fetch(B+'/projects',{method:'POST',headers:h,body:JSON.stringify({name:n,description:d,task:t,modelId:m})}).then(r=>r.json()),
  executeProject: (id: string, o: any) => fetch(B+'/projects/'+id+'/execute',{method:'POST',headers:h,body:JSON.stringify(o)}).then(r=>r.json()),
};
