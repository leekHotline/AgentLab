/**
 * Task type definition
 */
export interface Task {
  id: string;
  type: TaskType;
  payload: any;
  priority?: number;
  createdAt: Date;
  status: TaskStatus;
  assignedTo?: string;
  result?: any;
  error?: string;
}

/**
 * Task types
 */
export enum TaskType {
  DATA_PROCESSING = 'data-processing',
  COMPUTATION = 'computation',
  API_CALL = 'api-call',
  GENERAL = 'general'
}

/**
 * Task status
 */
export enum TaskStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  ASSIGNED = 'assigned',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

/**
 * Agent capability
 */
export interface AgentCapability {
  agentId: string;
  language: 'typescript' | 'python' | 'rust';
  capabilities: TaskType[];
  status: AgentStatus;
  currentLoad: number;
}

/**
 * Agent status
 */
export enum AgentStatus {
  IDLE = 'idle',
  BUSY = 'busy',
  OFFLINE = 'offline'
}

/**
 * Task result
 */
export interface TaskResult {
  taskId: string;
  success: boolean;
  data?: any;
  error?: string;
  completedAt: Date;
}
