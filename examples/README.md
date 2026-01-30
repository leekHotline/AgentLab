# Examples

This directory contains example demonstrations of the AgentLab multi-agent collaboration system.

## Demo

The main demo (`demo.ts`) showcases:

1. **Orchestrator initialization**: Setting up the central coordinator
2. **Agent registration**: Registering TypeScript, Python, and Rust agents
3. **Task submission**: Submitting multiple tasks with different priorities
4. **Task scheduling**: Automatic task distribution to available agents
5. **Result aggregation**: Collecting and displaying results

### Running the Demo

```bash
# From the root directory
pnpm install
pnpm build

# Run the demo
cd examples
pnpm demo
```

### Expected Output

The demo will:
- Initialize the orchestrator
- Register agents (TypeScript agent runs in-process, Python and Rust would be separate processes)
- Submit 3 tasks with different priorities
- Process tasks using the TypeScript agent
- Display completion statistics and results

### Example Output

```
=== AgentLab Multi-Agent System Demo ===

1. Initializing Orchestrator...

2. Registering Agents...
   ✓ TypeScript Agent registered
   ✓ Python Agent (would be separate process)
   ✓ Rust Agent (would be separate process)

3. Submitting Tasks...
   ✓ Task task-001 submitted (api-call)
   ✓ Task task-002 submitted (general)
   ✓ Task task-003 submitted (api-call)

4. Processing Tasks...
   → Task task-001 assigned to ts-agent-1
   ✓ Task task-001 completed: SUCCESS
   → Task task-003 assigned to ts-agent-1
   ✓ Task task-003 completed: SUCCESS
   → Task task-002 assigned to ts-agent-1
   ✓ Task task-002 completed: SUCCESS

5. System Statistics:
   Total Tasks: 3
   Completed: 3
   Failed: 0
   Pending: 0
   Registered Agents: 1

=== Demo Complete ===
```

## Creating Your Own Example

To create a new example:

1. Create a new `.ts` file in this directory
2. Import the necessary packages:
   ```typescript
   import { Orchestrator, TaskType } from '@agentlab/orchestrator';
   import { TypeScriptAgent } from '@agentlab/typescript-agent';
   ```
3. Build your example
4. Add a script to `package.json` to run it

## Notes

- The demo runs the TypeScript agent in-process for simplicity
- In a production system, Python and Rust agents would run as separate processes
- Inter-process communication would use IPC, WebSockets, or HTTP
- The orchestrator would communicate with remote agents through a protocol layer
