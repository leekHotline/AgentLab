# Quick Start Guide

Get started with AgentLab multi-agent collaboration system in 5 minutes.

## Prerequisites

Ensure you have the following installed:
- **Node.js** 18+ and **pnpm**
- **Python** 3.9+
- **Rust** 1.70+ (optional, for Rust agent)

## Installation

```bash
# Clone the repository
git clone https://github.com/leekHotline/AgentLab.git
cd AgentLab

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## Running Examples

### 1. Run the Full Demo

```bash
cd examples
pnpm demo
```

This runs a complete demonstration showing task submission, scheduling, and processing.

### 2. Test Individual Agents

#### TypeScript Agent
```bash
cd packages/typescript-agent
pnpm build
# Use the built agent in your code
```

#### Python Agent
```bash
cd packages/python-agent
python3 src/main.py
```

Output:
```
Python Agent 'python-agent-1' initialized
Capabilities: ['data-processing', 'computation']
[python-agent-1] Processing task example-1
[python-agent-1] Task example-1 completed successfully
```

#### Rust Agent
```bash
cd packages/rust-agent
cargo run
```

Output:
```
Rust Agent 'rust-agent-1' initialized
Capabilities: [Computation, DataProcessing]
[rust-agent-1] Processing task example-1
[rust-agent-1] Task example-1 completed successfully
```

## Basic Usage

### 1. Create an Orchestrator

```typescript
import { Orchestrator, TaskType } from '@agentlab/orchestrator';

const orchestrator = new Orchestrator();
```

### 2. Register Agents

```typescript
import { TypeScriptAgent } from '@agentlab/typescript-agent';

const agent = new TypeScriptAgent('my-agent-1');
orchestrator.registerAgent(agent.getCapabilities());
```

### 3. Submit Tasks

```typescript
orchestrator.submitTask({
  id: 'task-001',
  type: TaskType.API_CALL,
  payload: { 
    endpoint: '/api/data',
    method: 'GET'
  },
  priority: 5
});
```

### 4. Listen to Events

```typescript
orchestrator.on('task-completed', ({ task, result }: any) => {
  console.log(`Task ${task.id} completed`);
  console.log('Result:', result.data);
});
```

### 5. Process Tasks (Agent Side)

```typescript
// This would typically run in the agent process
const result = await agent.processTask(task);
orchestrator.completeTask(result);
```

## Project Structure

```
AgentLab/
├── packages/
│   ├── orchestrator/        # Core orchestrator (TypeScript)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── orchestrator.ts
│   │   │   ├── scheduler.ts
│   │   │   └── types.ts
│   │   └── package.json
│   ├── typescript-agent/    # TypeScript agent worker
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   ├── python-agent/        # Python agent worker
│   │   ├── src/
│   │   │   ├── agent.py
│   │   │   └── main.py
│   │   └── package.json
│   └── rust-agent/          # Rust agent worker
│       ├── src/
│       │   ├── lib.rs
│       │   └── main.rs
│       ├── Cargo.toml
│       └── package.json
├── examples/                # Example demonstrations
│   ├── demo.ts
│   └── package.json
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md
│   └── API.md
├── package.json
└── pnpm-workspace.yaml
```

## Key Concepts

### Task Types

- **DATA_PROCESSING**: Data analysis and transformation
- **COMPUTATION**: Mathematical and scientific computations
- **API_CALL**: REST API calls and network operations
- **GENERAL**: General-purpose tasks

### Task Status Flow

```
PENDING → QUEUED → ASSIGNED → PROCESSING → COMPLETED/FAILED
```

### Agent Status

- **IDLE**: Available for work
- **BUSY**: Currently processing a task
- **OFFLINE**: Not available

## Next Steps

1. Read the [Architecture Documentation](../docs/ARCHITECTURE.md)
2. Explore the [API Reference](../docs/API.md)
3. Check out the [Example Code](../examples/)
4. Build your own multi-agent application!

## Troubleshooting

### "Cannot find module" errors

Make sure you've installed dependencies and built the packages:
```bash
pnpm install
pnpm build
```

### Rust compilation errors

Ensure you have Rust 1.70+ installed:
```bash
rustc --version
```

### Python import errors

Make sure you're running Python 3.9+:
```bash
python3 --version
```

## Support

For issues and questions:
- Check the [documentation](../docs/)
- Open an issue on GitHub
- Review existing examples

## License

MIT
