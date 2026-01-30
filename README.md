# AgentLab - Multi-Agent Collaboration and Scheduling System

AgentLab is a distributed multi-agent collaboration system that enables multiple agents written in different programming languages (TypeScript, Python, Rust) to work together on complex tasks through a centralized orchestrator.

## Architecture Overview

```mermaid
graph TD
    A[Orchestrator TypeScript/JS] --> B[Task Queue]
    B --> C{Task Scheduler}
    C --> D[Python Agent]
    C --> E[Rust Agent]
    C --> F[TypeScript Agent]
    D --> G[Results Aggregator]
    E --> G
    F --> G
    G --> H[Task Completion]
    H --> A
```

## System Components

### 1. Orchestrator (TypeScript/JavaScript)
The central coordinator that:
- Receives incoming tasks
- Manages the task queue
- Delegates tasks to appropriate agents
- Aggregates results

```mermaid
sequenceDiagram
    participant Client
    participant Orchestrator
    participant Scheduler
    participant Agent
    
    Client->>Orchestrator: Submit Task
    Orchestrator->>Scheduler: Queue Task
    Scheduler->>Agent: Assign Task
    Agent->>Agent: Process Task
    Agent->>Scheduler: Return Result
    Scheduler->>Orchestrator: Aggregate Results
    Orchestrator->>Client: Return Final Result
```

### 2. Task Scheduler
Intelligent task distribution based on:
- Agent capabilities
- Current load
- Task priority
- Agent language specialization

```mermaid
flowchart LR
    A[Incoming Task] --> B{Task Type}
    B -->|Data Processing| C[Python Agent]
    B -->|Performance Critical| D[Rust Agent]
    B -->|API/Network| E[TypeScript Agent]
    C --> F[Result]
    D --> F
    E --> F
```

### 3. Agent Workers

#### Python Agent
- Data processing and analysis
- Machine learning tasks
- Scientific computing

#### Rust Agent
- High-performance computing
- Systems-level operations
- Memory-efficient processing

#### TypeScript/JavaScript Agent
- API integrations
- Web services
- Asynchronous operations

## Agent Communication Protocol

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Assigned: Task Received
    Assigned --> Processing: Start Work
    Processing --> Completed: Success
    Processing --> Failed: Error
    Completed --> Idle: Report Result
    Failed --> Idle: Report Error
    Failed --> Processing: Retry
```

## Task Lifecycle

```mermaid
graph LR
    A[Task Created] --> B[Queued]
    B --> C[Scheduled]
    C --> D[In Progress]
    D --> E{Success?}
    E -->|Yes| F[Completed]
    E -->|No| G[Retry/Failed]
    G --> B
    F --> H[Archived]
```

## Multi-Agent Collaboration Flow

```mermaid
graph TB
    subgraph "Orchestrator Layer"
        A[Orchestrator]
        B[Task Queue]
        C[Result Aggregator]
    end
    
    subgraph "Agent Layer"
        D[Python Agent 1]
        E[Python Agent 2]
        F[Rust Agent 1]
        G[Rust Agent 2]
        H[TS Agent 1]
        I[TS Agent 2]
    end
    
    A --> B
    B --> D
    B --> E
    B --> F
    B --> G
    B --> H
    B --> I
    D --> C
    E --> C
    F --> C
    G --> C
    H --> C
    I --> C
    C --> A
```

## Features

- 🔄 **Multi-language support**: Agents in TypeScript, Python, and Rust
- 📊 **Intelligent scheduling**: Dynamic task distribution based on agent capabilities
- 🔗 **Inter-agent communication**: Standardized protocol for agent communication
- ⚡ **High performance**: Rust agents for performance-critical tasks
- 🐍 **Data processing**: Python agents for data analysis and ML
- 🌐 **API integration**: TypeScript agents for web services
- 📈 **Scalable**: Easily add more agents as needed
- 🔍 **Monitoring**: Built-in task tracking and result aggregation

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.9+
- Rust 1.70+

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start the system
pnpm dev
```

### Quick Example

```typescript
// Submit a task to the orchestrator
const task = {
  id: 'task-001',
  type: 'data-processing',
  payload: { data: [...] }
};

const result = await orchestrator.submitTask(task);
```

## Project Structure

```
AgentLab/
├── packages/
│   ├── orchestrator/        # TypeScript orchestrator
│   ├── typescript-agent/    # TypeScript agent worker
│   ├── python-agent/        # Python agent worker
│   └── rust-agent/          # Rust agent worker
├── docs/                    # Documentation
├── package.json
└── pnpm-workspace.yaml
```

## License

MIT