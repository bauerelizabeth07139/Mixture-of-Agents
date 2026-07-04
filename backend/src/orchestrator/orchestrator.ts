import { v4 as uuid } from 'uuid';
import { Project, SubAgent, SubAgentTask, Issue, AgentSummary, Model, Provider, UserPreferences } from '../types';
import { ApiPoolManager } from '../providers/api-pool';
import { LLMClient, QuotaExhaustedError } from '../services/llm-client';
import { ModelCapabilityScorer } from '../models/capability-scorer';

export type OrchestratorEventCallback = (event: string, data: any) => void;

export class Orchestrator {
  private project: Project;
  private poolManager: ApiPoolManager;
  private preferences: UserPreferences;
  private eventCallback: OrchestratorEventCallback | null = null;
  private abortController: AbortController | null = null;

  constructor(project: Project, poolManager: ApiPoolManager, preferences: UserPreferences) {
    this.project = project; this.poolManager = poolManager; this.preferences = preferences;
  }
  onEvent(cb: OrchestratorEventCallback) { this.eventCallback = cb; }
  private emit(event: string, data: any) { this.eventCallback?.(event, data); }

  async execute(): Promise<void> {
    this.abortController = new AbortController();
    this.project.orchestratorState.status = 'planning';
    this.emit('orchestrator_update', { status: 'planning', projectId: this.project.id });
    try {
      const subtasks = await this.decomposeTask();
      this.emit('orchestrator_update', { status: 'executing', subtasks: subtasks.length });
      for (const st of subtasks) { if (this.abortController.signal.aborted) break; await this.executeSubtask(st); }
      const result = await this.aggregateResults();
      this.project.orchestratorState.status = 'completed';
      this.emit('orchestrator_update', { status: 'completed', result });
    } catch (e: any) { this.project.orchestratorState.status = 'failed'; this.emit('error', { message: e.message }); }
  }

  private async decomposeTask(): Promise<Array<{description:string;taskType:string;priority:number}>> {
    const m = this.getOrchestratorModel(); if (!m) throw new Error('No orchestrator model');
    const resp = await this.callOrchestrator(`Decompose into subtasks. Task: "${this.project.initialTask}" Cost/eff: ${this.preferences.costEfficiencyRatio}. JSON: [{"description":"...","taskType":"code|agent|chat|general","priority":1-5}]`);
    try { const jm = resp.match(/\[[\s\S]*\]/); if (!jm) throw new Error(); return JSON.parse(jm[0]); }
    catch { return [{ description: this.project.initialTask, taskType: 'general', priority: 1 }]; }
  }

  private async executeSubtask(st: {description:string;taskType:string;priority:number}): Promise<void> {
    const tid = uuid();
    const task: SubAgentTask = { id: tid, agentId: '', description: st.description, assignedModel: '', status: 'pending', attempts: 0, maxAttempts: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.project.orchestratorState.tasks.push(task); this.emit('task_update', { task, pid: this.project.id });
    const sel = this.selectBestModel(st.taskType);
    if (!sel) { task.status = 'failed'; task.error = 'No model'; this.addIssue('sys','sys',task.error,'critical'); return; }
    const agent = this.createSubAgent(sel.model.id, sel.provider.id);
    task.agentId = agent.id; task.assignedModel = sel.model.id; task.status = 'running'; agent.status = 'working'; agent.currentTask = tid;
    this.emit('agent_update', { agent, pid: this.project.id }); this.emit('task_update', { task, pid: this.project.id });
    await this.runRetry(task, agent, sel.provider, sel.apiKey, st.description);
  }

  private async runRetry(task: SubAgentTask, agent: SubAgent, prov: Provider, key: any, desc: string): Promise<void> {
    let provider = prov, apiKey = key;
    while (task.attempts < task.maxAttempts) {
      task.attempts++; task.updatedAt = new Date().toISOString(); this.emit('task_update', { task, pid: this.project.id });
      try {
        const ctx = this.buildCtx();
        const r = await LLMClient.chatCompletion(provider, apiKey, { messages: [{ role: 'system', content: 'Sub-agent. ' + ctx }, { role: 'user', content: desc }], model: task.assignedModel, temperature: 0.3, maxTokens: 4096 });
        task.result = r.content; task.status = 'completed'; task.completedAt = new Date().toISOString(); agent.status = 'completed';
        this.addSummary(agent, task, 'completed'); this.emit('task_update', { task, pid: this.project.id }); return;
      } catch (e: any) {
        if (e instanceof QuotaExhaustedError) {
          const res = this.poolManager.markKeyFailed(provider.id, e.keyId);
          if (res === 'provider_exhausted') { const nm = this.selectBestModel('general', provider.id); if (nm) { provider=nm.provider; apiKey=nm.apiKey; task.assignedModel=nm.model.id; agent.modelId=nm.model.id; agent.providerId=nm.provider.id; continue; } }
          const nk = this.poolManager.getNextApiKey(provider.id); if (nk) { apiKey = nk; continue; }
        }
        const ev = await this.evaluateFail(task, e.message);
        if (ev === 'switch') { const nm = this.selectBestModel('general', provider.id); if (nm) { provider=nm.provider; apiKey=nm.apiKey; task.assignedModel=nm.model.id; agent.modelId=nm.model.id; agent.providerId=nm.provider.id; task.status='retrying'; continue; } }
        if (ev === 'retry') { task.status = 'retrying'; continue; }
        task.status='failed'; task.error=e.message; agent.status='failed'; this.addIssue(agent.id,agent.name,e.message,'high'); this.addSummary(agent,task,'failed'); this.emit('task_update',{task,pid:this.project.id}); return;
      }
    }
  }

  private async evaluateFail(task: SubAgentTask, err: string): Promise<string> {
    try { const r = await this.callOrchestrator(`Fail: ${task.description} | ${task.assignedModel} | ${err}\nRespond: retry|switch|abort`); const d=r.trim().toLowerCase(); if(d.includes('switch'))return'switch'; if(d.includes('abort'))return'abort'; return'retry'; }
    catch { return task.attempts<task.maxAttempts?'retry':'abort'; }
  }

  private selectBestModel(t: string, excl?: string): {model:Model;provider:Provider;apiKey:any}|null {
    let ms = this.poolManager.getAvailableModels('llm'); if(!ms.length)return null;
    if(excl) ms=ms.filter(m=>m.providerId!==excl); if(!ms.length)return null;
    const sc = ms.map(m=>({model:m,score:ModelCapabilityScorer.computeSelectionScore(m.capabilities,this.preferences.costEfficiencyRatio,t as any)}));
    sc.sort((a,b)=>b.score-a.score);
    for(const{model}of sc){const f=this.poolManager.findProviderForModel(model.id);if(f)return f;} return null;
  }

  private createSubAgent(mid: string, pid: string): SubAgent {
    const a: SubAgent = {id:uuid(),name:`Agent-${this.project.orchestratorState.subAgents.length+1}`,modelId:mid,providerId:pid,status:'idle',tasks:[],createdAt:new Date().toISOString()};
    this.project.orchestratorState.subAgents.push(a); return a;
  }

  private buildCtx(): string {
    const iss=this.project.issueLibrary.filter(i=>!i.resolved).slice(-10); const dn=this.project.completedAgents.slice(-5);
    let c=''; if(iss.length){c+='\nIssues:';iss.forEach(i=>c+=`\n-[${i.severity}]${i.description}`);}
    if(dn.length){c+='\nRecent:';dn.forEach(a=>c+=`\n-${a.name}:${a.summary}`);} return c;
  }

  private async callOrchestrator(prompt: string): Promise<string> {
    const m=this.getOrchestratorModel(); if(!m)throw new Error('No orchestrator');
    const tp=this.preferences.thinkingMode==='high'?'[DEEP THINKING]\n':this.preferences.thinkingMode==='medium'?'[THINKING]\n':'';
    const r=await LLMClient.chatCompletion(m.provider,m.apiKey,{messages:[{role:'system',content:tp+'Macro orchestrator. Precise, thorough.'},{role:'user',content:prompt}],model:m.model.modelId,temperature:0.2,maxTokens:4096});
    return r.content;
  }

  private getOrchestratorModel():{provider:Provider;model:Model;apiKey:any}|null {
    const id=this.preferences.defaultOrchestratorModel||this.project.orchestratorState.defaultModelId;
    if(id){const f=this.poolManager.findProviderForModel(id);if(f)return f;}
    const ms=this.poolManager.getAvailableModels('llm'); return ms.length?this.poolManager.findProviderForModel(ms[0].id):null;
  }

  private addIssue(aid:string,an:string,d:string,s:string):void {
    this.project.issueLibrary.push({id:uuid(),agentId:aid,agentName:an,description:d,severity:s as any,resolved:false,timestamp:new Date().toISOString()});
    if(this.project.issueLibrary.length>50)this.project.issueLibrary=this.project.issueLibrary.slice(-50);
    this.emit('issue_created',{pid:this.project.id});
  }

  private addSummary(a:SubAgent,t:SubAgentTask,o:'completed'|'failed'):void {
    const s:AgentSummary={id:uuid(),agentId:a.id,name:a.name,modelId:a.modelId,taskDescription:t.description,outcome:o,summary:t.result||t.error||'',issues:[],duration:t.completedAt?new Date(t.completedAt).getTime()-new Date(t.createdAt).getTime():0,timestamp:new Date().toISOString()};
    if(o==='completed'){this.project.completedAgents.push(s);if(this.project.completedAgents.length>20)this.project.completedAgents=this.project.completedAgents.slice(-20);}
    else this.project.pendingAgents.push(s);
  }

  private async aggregateResults():Promise<string> {
    const dn=this.project.orchestratorState.tasks.filter(t=>t.status==='completed');
    if(!dn.length)return 'All tasks failed.';
    const p=`Aggregate: "${this.project.initialTask}"\n${dn.map((t,i)=>`---${i+1}:${t.description}---\n${t.result}`).join('\n\n')}`;
    try{return await this.callOrchestrator(p);}catch{return dn.map(t=>t.result).join('\n\n');}
  }

  abort():void{this.abortController?.abort();this.project.orchestratorState.status='failed';}
  getProject():Project{return this.project;}
}