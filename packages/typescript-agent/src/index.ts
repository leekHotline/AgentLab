import { Task, TaskResult, TaskType, AgentCapability, AgentStatus } from '@agentlab/orchestrator';

/**
 * TypeScript Agent - Handles API calls and network operations
 */
export class TypeScriptAgent {
  private agentId: string;
  private currentTask: Task | null = null;

  constructor(agentId: string = 'ts-agent-1') {
    this.agentId = agentId;
  }

  /**
   * Get agent capabilities
   */
  getCapabilities(): AgentCapability {
    return {
      agentId: this.agentId,
      language: 'typescript',
      capabilities: [TaskType.API_CALL, TaskType.GENERAL],
      status: AgentStatus.IDLE,
      currentLoad: 0
    };
  }

  /**
   * Process a task
   */
  async processTask(task: Task): Promise<TaskResult> {
    this.currentTask = task;
    console.log(`[${this.agentId}] Processing task ${task.id}`);

    try {
      let result: any;

      switch (task.type) {
        case TaskType.API_CALL:
          result = await this.handleApiCall(task.payload);
          break;
        case TaskType.GENERAL:
          result = await this.handleGeneralTask(task.payload);
          break;
        default:
          throw new Error(`Unsupported task type: ${task.type}`);
      }

      console.log(`[${this.agentId}] Task ${task.id} completed successfully`);
      
      return {
        taskId: task.id,
        success: true,
        data: result,
        completedAt: new Date()
      };
    } catch (error) {
      console.error(`[${this.agentId}] Task ${task.id} failed:`, error);
      
      return {
        taskId: task.id,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        completedAt: new Date()
      };
    } finally {
      this.currentTask = null;
    }
  }

  /**
   * Handle API call tasks
   */
  private async handleApiCall(payload: any): Promise<any> {
    // Simulate API call
    await this.sleep(1000);
    
    return {
      status: 'success',
      endpoint: payload.endpoint || '/api/data',
      method: payload.method || 'GET',
      response: {
        data: 'API response data',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Handle general tasks
   */
  private async handleGeneralTask(payload: any): Promise<any> {
    // Simulate task processing
    await this.sleep(500);
    
    return {
      status: 'processed',
      input: payload,
      output: `Processed by ${this.agentId}`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Helper to simulate async operations
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current task
   */
  getCurrentTask(): Task | null {
    return this.currentTask;
  }
}

export default TypeScriptAgent;
