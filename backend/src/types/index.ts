// ============================================================
// Mixture of Agents - Core Type Definitions
// ============================================================

/** Model capability types */
export type ModelCapability = 'code' | 'agent' | 'chat' | 'multimodal' | 'reasoning' | 'fast';

/** Model capability score (0-10) */
export interface ModelCapabilityProfile {
  code: number;        // Code generation & understanding
  agent: number;       // Tool use & multi-step reasoning
  chat: number;        // Conversational ability
  context: number;     // Context window size score (0-10)
  speed: number;       // Response speed score (0-10)
  multimodal: boolean; // Supports images/audio/video input
  pricing: {
    inputPer1M: number;  // $/1M input tokens
    outputPer1M: number; // $/1M output tokens
    userEditable: boolean;
  };
}

/** Model types */
export type ModelType = 'llm' | 'tts' | 'image' | 'stt';

/** A single model entry */
export interface Model {
  id: string;
  name: string;
  providerId: string;  // references Provider.id
  modelId: string;     // API model identifier (e.g. "gpt-4o")
  type: ModelType;
  capabilities: ModelCapabilityProfile;
  isDefault?: boolean;  // Is the default orchestrator model
}

/** API Provider (URL endpoint) */
export interface Provider {
  id: string;
  name: string;
  baseUrl: string;
  type: 'openai-compatible' | 'anthropic' | 'custom';
  icon?: string;
  apiKeys: ApiKeyEntry[];
  models: Model[];
  isLocal: boolean;
  createdAt: string;
}

/** API Key with usage tracking */
export interface ApiKeyEntry {
  id: string;
  key: string;          // Masked in display, stored encrypted
  isActive: boolean;
  remainingQuota: number | null;  // null = unknown
  lastChecked: string | null;
  failureCount: number;
}

/** Preset providers */
export interface ProviderPreset {
  id: string;
  name: string;
  baseUrl: string;
  type: Provider['type'];
  icon: string;
  description: string;
  defaultModels: string[];
}

/** Sub-agent task */
export interface SubAgentTask {
  id: string;
  agentId: string;
  description: string;
  assignedModel: string;   // model id
  status: 'pending' | 'running' | 'completed' | 'failed' | 'retrying';
  result?: string;
  error?: string;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

/** Sub-agent instance */
export interface SubAgent {
  id: string;
  name: string;
  modelId: string;
  providerId: string;
  status: 'idle' | 'working' | 'failed' | 'completed';
  currentTask?: string;  // task id
  tasks: string[];       // task ids
  createdAt: string;
}

/** Macro orchestrator state */
export interface OrchestratorState {
  id: string;
  defaultModelId: string;
  strategy: 'cost' | 'balanced' | 'efficiency';
  costEfficiencyRatio: number;  // 0=efficiency, 0.5=balanced, 1=cost
  subAgents: SubAgent[];
  tasks: SubAgentTask[];
  status: 'idle' | 'planning' | 'executing' | 'completed' | 'failed';
  createdAt: string;
}

/** Project workspace */
export interface Project {
  id: string;
  name: string;
  description: string;
  initialTask: string;          // Read-only after creation
  taskBackup: string;           // Encrypted/immutable copy
  issueLibrary: Issue[];        // Recent 50 issues
  completedAgents: AgentSummary[];  // Recent 20 completed
  pendingAgents: AgentSummary[];    // Pending → next summary library
  orchestratorState: OrchestratorState;
  createdAt: string;
  updatedAt: string;
}

/** Issue (problem encountered) */
export interface Issue {
  id: string;
  agentId: string;
  agentName: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  resolution?: string;
  timestamp: string;
}

/** Agent summary (for context libraries) */
export interface AgentSummary {
  id: string;
  agentId: string;
  name: string;
  modelId: string;
  taskDescription: string;
  outcome: 'completed' | 'failed' | 'partial';
  summary: string;
  issues: string[];
  duration: number;  // ms
  timestamp: string;
}

/** User preference for cost/efficiency */
export interface UserPreferences {
  costEfficiencyRatio: number;  // 0-1, 0=efficiency, 1=cost
  defaultOrchestratorModel?: string;
  thinkingMode: 'low' | 'medium' | 'high';
  maxConcurrentAgents: number;
  autoRetryOnFailure: boolean;
}

/** WebSocket message types */
export type WSMessageType = 
  | 'orchestrator_update'
  | 'agent_update'
  | 'task_update'
  | 'issue_created'
  | 'chat_message'
  | 'progress'
  | 'error';

export interface WSMessage {
  type: WSMessageType;
  payload: any;
  timestamp: string;
}

/** Chat message */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'orchestrator' | 'agent';
  agentId?: string;
  content: string;
  timestamp: string;
  metadata?: {
    modelUsed?: string;
    tokensUsed?: number;
    cost?: number;
  };
}
