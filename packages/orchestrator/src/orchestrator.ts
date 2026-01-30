import EventEmitter from 'eventemitter3';
import { Task, TaskStatus, TaskType, TaskResult, AgentCapability, AgentStatus } from './types';
import { TaskQueue, TaskScheduler } from './scheduler';

/**
 * Orchestrator - Main coordinator for multi-agent system
 */
export class Orchestrator {
  private taskQueue: TaskQueue;
  private scheduler: TaskScheduler;
  private tasks: Map<string, Task> = new Map();
  private events = new EventEmitter();

  constructor() {
    this.taskQueue = new TaskQueue();
    this.scheduler = new TaskScheduler(this.taskQueue);

    // Listen to task assignments
    this.scheduler.on('task-assigned', ({ task, agent }: { task: Task; agent: AgentCapability }) => {
      console.log(`[Orchestrator] Task ${task.id} assigned to agent ${agent.agentId}`);
      this.events.emit('task-assigned', { task, agent });
    });
  }

  /**
   * Submit a new task
   */
  submitTask(task: Omit<Task, 'createdAt' | 'status'>): string {
    const fullTask: Task = {
      ...task,
      createdAt: new Date(),
      status: TaskStatus.PENDING,
      priority: task.priority || 0
    };

    this.tasks.set(fullTask.id, fullTask);
    fullTask.status = TaskStatus.QUEUED;
    this.taskQueue.enqueue(fullTask);

    console.log(`[Orchestrator] Task ${fullTask.id} submitted`);
    this.events.emit('task-submitted', fullTask);

    return fullTask.id;
  }

  /**
   * Register an agent with the orchestrator
   */
  registerAgent(agent: AgentCapability): void {
    this.scheduler.registerAgent(agent);
    this.events.emit('agent-registered', agent);
  }

  /**
   * Handle task completion
   */
  completeTask(result: TaskResult): void {
    const task = this.tasks.get(result.taskId);
    if (!task) {
      console.error(`Task ${result.taskId} not found`);
      return;
    }

    task.status = result.success ? TaskStatus.COMPLETED : TaskStatus.FAILED;
    task.result = result.data;
    task.error = result.error;

    if (task.assignedTo) {
      this.scheduler.updateAgentStatus(task.assignedTo, AgentStatus.IDLE, 0);
    }

    console.log(`[Orchestrator] Task ${result.taskId} ${task.status}`);
    this.events.emit('task-completed', { task, result });
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get all agents
   */
  getAllAgents(): AgentCapability[] {
    return this.scheduler.getAgents();
  }

  /**
   * Listen to orchestrator events
   */
  on(event: string, handler: Function): void {
    this.events.on(event, handler as any);
  }

  /**
   * Get system statistics
   */
  getStatistics() {
    const tasks = Array.from(this.tasks.values());
    return {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === TaskStatus.PENDING || t.status === TaskStatus.QUEUED).length,
      processingTasks: tasks.filter(t => t.status === TaskStatus.PROCESSING || t.status === TaskStatus.ASSIGNED).length,
      completedTasks: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      failedTasks: tasks.filter(t => t.status === TaskStatus.FAILED).length,
      registeredAgents: this.scheduler.getAgents().length,
      activeAgents: this.scheduler.getAgents().filter(a => a.status === AgentStatus.BUSY).length
    };
  }
}

export * from './types';
export * from './scheduler';
