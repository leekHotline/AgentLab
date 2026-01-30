# API Reference

## Orchestrator API

### Class: `Orchestrator`

The main coordinator for the multi-agent system.

#### Constructor

```typescript
new Orchestrator()
```

Creates a new orchestrator instance.

#### Methods

##### `submitTask(task: Omit<Task, 'createdAt' | 'status'>): string`

Submit a new task to the orchestrator.

**Parameters:**
- `task`: Task object without `createdAt` and `status` fields
  - `id`: Unique task identifier
  - `type`: Task type (TaskType enum)
  - `payload`: Task-specific data
  - `priority` (optional): Task priority (higher = more important)

**Returns:** Task ID

**Example:**
```typescript
const taskId = orchestrator.submitTask({
  id: 'task-001',
  type: TaskType.DATA_PROCESSING,
  payload: { data: [1, 2, 3] },
  priority: 5
});
```

##### `registerAgent(agent: AgentCapability): void`

Register an agent with the orchestrator.

**Parameters:**
- `agent`: Agent capability information
  - `agentId`: Unique agent identifier
  - `language`: Programming language (typescript, python, rust)
  - `capabilities`: Array of supported task types
  - `status`: Current agent status
  - `currentLoad`: Number of tasks currently processing

**Example:**
```typescript
orchestrator.registerAgent({
  agentId: 'ts-agent-1',
  language: 'typescript',
  capabilities: [TaskType.API_CALL, TaskType.GENERAL],
  status: AgentStatus.IDLE,
  currentLoad: 0
});
```

##### `completeTask(result: TaskResult): void`

Mark a task as completed and update its result.

**Parameters:**
- `result`: Task result information
  - `taskId`: Task identifier
  - `success`: Whether task completed successfully
  - `data` (optional): Result data
  - `error` (optional): Error message if failed
  - `completedAt`: Completion timestamp

**Example:**
```typescript
orchestrator.completeTask({
  taskId: 'task-001',
  success: true,
  data: { processed: [2, 4, 6] },
  completedAt: new Date()
});
```

##### `getTaskStatus(taskId: string): Task | undefined`

Get the current status of a task.

**Parameters:**
- `taskId`: Task identifier

**Returns:** Task object or undefined if not found

##### `getAllTasks(): Task[]`

Get all tasks in the system.

**Returns:** Array of all tasks

##### `getAllAgents(): AgentCapability[]`

Get all registered agents.

**Returns:** Array of agent capabilities

##### `getStatistics(): SystemStats`

Get system statistics.

**Returns:** Statistics object containing:
- `totalTasks`: Total number of tasks
- `pendingTasks`: Tasks waiting to be processed
- `processingTasks`: Tasks currently being processed
- `completedTasks`: Successfully completed tasks
- `failedTasks`: Failed tasks
- `registeredAgents`: Number of registered agents
- `activeAgents`: Number of agents currently processing tasks

##### `on(event: string, handler: Function): void`

Listen to orchestrator events.

**Events:**
- `task-submitted`: Fired when a task is submitted
- `task-assigned`: Fired when a task is assigned to an agent
- `task-completed`: Fired when a task completes
- `agent-registered`: Fired when an agent registers

**Example:**
```typescript
orchestrator.on('task-completed', ({ task, result }) => {
  console.log(`Task ${task.id} completed`);
});
```

## TypeScript Agent API

### Class: `TypeScriptAgent`

Agent for handling API calls and network operations.

#### Constructor

```typescript
new TypeScriptAgent(agentId?: string)
```

**Parameters:**
- `agentId` (optional): Unique agent identifier (default: 'ts-agent-1')

#### Methods

##### `getCapabilities(): AgentCapability`

Get agent capabilities.

**Returns:** Agent capability object

##### `processTask(task: Task): Promise<TaskResult>`

Process a task.

**Parameters:**
- `task`: Task to process

**Returns:** Promise resolving to task result

**Example:**
```typescript
const agent = new TypeScriptAgent('ts-agent-1');
const result = await agent.processTask({
  id: 'task-001',
  type: TaskType.API_CALL,
  payload: { endpoint: '/api/data' },
  status: TaskStatus.ASSIGNED,
  createdAt: new Date()
});
```

##### `getCurrentTask(): Task | null`

Get the currently processing task.

**Returns:** Current task or null

## Types and Enums

### TaskType

Task types supported by the system.

```typescript
enum TaskType {
  DATA_PROCESSING = 'data-processing',
  COMPUTATION = 'computation',
  API_CALL = 'api-call',
  GENERAL = 'general'
}
```

### TaskStatus

Task status values.

```typescript
enum TaskStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  ASSIGNED = 'assigned',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}
```

### AgentStatus

Agent status values.

```typescript
enum AgentStatus {
  IDLE = 'idle',
  BUSY = 'busy',
  OFFLINE = 'offline'
}
```

### Task Interface

```typescript
interface Task {
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
```

### TaskResult Interface

```typescript
interface TaskResult {
  taskId: string;
  success: boolean;
  data?: any;
  error?: string;
  completedAt: Date;
}
```

### AgentCapability Interface

```typescript
interface AgentCapability {
  agentId: string;
  language: 'typescript' | 'python' | 'rust';
  capabilities: TaskType[];
  status: AgentStatus;
  currentLoad: number;
}
```

## Python Agent API

### Class: `PythonAgent`

Agent for data processing and computation.

```python
from agent import PythonAgent, Task, TaskType, TaskResult

# Create agent
agent = PythonAgent(agent_id="python-agent-1")

# Get capabilities
capabilities = agent.get_capabilities()

# Process task
task = Task(
    id="task-001",
    type=TaskType.DATA_PROCESSING,
    payload={"data": [1, 2, 3, 4, 5]},
    priority=1
)
result = agent.process_task(task)
```

## Rust Agent API

### Struct: `RustAgent`

Agent for high-performance computing.

```rust
use rust_agent::{RustAgent, Task, TaskType};

// Create agent
let mut agent = RustAgent::new("rust-agent-1".to_string());

// Get capabilities
let capabilities = agent.get_capabilities();

// Process task
let task = Task {
    id: "task-001".to_string(),
    task_type: TaskType::Computation,
    payload: json!({"operation": "add", "numbers": [1, 2, 3]}),
    priority: 1,
};
let result = agent.process_task(task);
```
