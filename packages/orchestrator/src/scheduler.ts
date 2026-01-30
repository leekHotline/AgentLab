import EventEmitter from 'eventemitter3';
import { Task, TaskStatus, AgentCapability, AgentStatus, TaskType } from './types';

/**
 * Task Queue manages pending tasks
 */
export class TaskQueue {
  private queue: Task[] = [];
  private events = new EventEmitter();

  /**
   * Add a task to the queue
   */
  enqueue(task: Task, silent: boolean = false): void {
    this.queue.push(task);
    this.queue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    if (!silent) {
      this.events.emit('task-added', task);
    }
  }

  /**
   * Get the next task from the queue
   */
  dequeue(): Task | undefined {
    return this.queue.shift();
  }

  /**
   * Get all pending tasks
   */
  getTasks(): Task[] {
    return [...this.queue];
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Listen to queue events
   */
  on(event: string, handler: Function): void {
    this.events.on(event, handler as any);
  }
}

/**
 * Task Scheduler assigns tasks to agents
 */
export class TaskScheduler {
  private agents: Map<string, AgentCapability> = new Map();
  private taskQueue: TaskQueue;
  private events = new EventEmitter();

  constructor(taskQueue: TaskQueue) {
    this.taskQueue = taskQueue;
    this.taskQueue.on('task-added', () => this.scheduleTasks());
  }

  /**
   * Register an agent
   */
  registerAgent(agent: AgentCapability): void {
    this.agents.set(agent.agentId, agent);
    console.log(`Agent registered: ${agent.agentId} (${agent.language})`);
    this.scheduleTasks();
  }

  /**
   * Update agent status
   */
  updateAgentStatus(agentId: string, status: AgentStatus, load: number = 0): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.currentLoad = load;
      if (status === AgentStatus.IDLE) {
        this.scheduleTasks();
      }
    }
  }

  /**
   * Schedule tasks to available agents
   */
  private scheduleTasks(): void {
    while (this.taskQueue.size() > 0) {
      const task = this.taskQueue.dequeue();
      if (!task) break;

      const agent = this.findBestAgent(task);
      if (agent) {
        task.status = TaskStatus.ASSIGNED;
        task.assignedTo = agent.agentId;
        agent.status = AgentStatus.BUSY;
        agent.currentLoad++;
        
        this.events.emit('task-assigned', { task, agent });
        console.log(`Task ${task.id} assigned to ${agent.agentId}`);
      } else {
        // No available agent, put task back in queue without triggering event
        this.taskQueue.enqueue(task, true);
        break;
      }
    }
  }

  /**
   * Find the best agent for a task
   */
  private findBestAgent(task: Task): AgentCapability | undefined {
    const availableAgents = Array.from(this.agents.values()).filter(
      agent => 
        agent.status === AgentStatus.IDLE &&
        agent.capabilities.includes(task.type)
    );

    if (availableAgents.length === 0) return undefined;

    // Select agent with lowest load
    return availableAgents.reduce((best, current) => 
      current.currentLoad < best.currentLoad ? current : best
    );
  }

  /**
   * Listen to scheduler events
   */
  on(event: string, handler: Function): void {
    this.events.on(event, handler as any);
  }

  /**
   * Get all registered agents
   */
  getAgents(): AgentCapability[] {
    return Array.from(this.agents.values());
  }
}
