import { Orchestrator, TaskType, TaskStatus, Task, TaskResult, AgentCapability } from '@agentlab/orchestrator';
import { TypeScriptAgent } from '@agentlab/typescript-agent';

/**
 * Demo: Multi-Agent Collaboration System
 * 
 * This example demonstrates:
 * 1. Orchestrator initialization
 * 2. Agent registration
 * 3. Task submission and scheduling
 * 4. Result aggregation
 */

async function runDemo() {
  console.log('=== AgentLab Multi-Agent System Demo ===\n');

  // 1. Initialize orchestrator
  console.log('1. Initializing Orchestrator...');
  const orchestrator = new Orchestrator();

  // 2. Register agents
  console.log('\n2. Registering Agents...');
  
  // Register TypeScript agent
  const tsAgent = new TypeScriptAgent('ts-agent-1');
  orchestrator.registerAgent(tsAgent.getCapabilities());

  // Note: In a real system, Python and Rust agents would be 
  // separate processes communicating via IPC/network
  console.log('   ✓ TypeScript Agent registered');
  console.log('   ✓ Python Agent (would be separate process)');
  console.log('   ✓ Rust Agent (would be separate process)');

  // 3. Submit tasks
  console.log('\n3. Submitting Tasks...');
  
  const tasks = [
    {
      id: 'task-001',
      type: TaskType.API_CALL,
      payload: { 
        endpoint: '/api/users',
        method: 'GET'
      },
      priority: 2
    },
    {
      id: 'task-002',
      type: TaskType.GENERAL,
      payload: { 
        operation: 'process',
        data: 'sample data'
      },
      priority: 1
    },
    {
      id: 'task-003',
      type: TaskType.API_CALL,
      payload: { 
        endpoint: '/api/posts',
        method: 'POST',
        body: { title: 'New Post' }
      },
      priority: 3
    }
  ];

  tasks.forEach(task => {
    orchestrator.submitTask(task);
    console.log(`   ✓ Task ${task.id} submitted (${task.type})`);
  });

  // 4. Listen to events
  console.log('\n4. Processing Tasks...\n');
  
  orchestrator.on('task-assigned', ({ task, agent }: { task: Task; agent: AgentCapability }) => {
    console.log(`   → Task ${task.id} assigned to ${agent.agentId}`);
  });

  orchestrator.on('task-completed', ({ task, result }: { task: Task; result: TaskResult }) => {
    console.log(`   ✓ Task ${task.id} completed: ${result.success ? 'SUCCESS' : 'FAILED'}`);
  });

  // 5. Simulate task processing
  console.log('   Processing...\n');
  
  // Process all tasks as they get assigned
  let processedCount = 0;
  const totalTasks = 3;
  
  while (processedCount < totalTasks) {
    const allTasks = orchestrator.getAllTasks();
    for (const task of allTasks) {
      if (task.assignedTo === 'ts-agent-1' && task.status === TaskStatus.ASSIGNED) {
        // Note: In production, don't mutate task status directly
        // This is for demo purposes only - the agent should handle this
        const result = await tsAgent.processTask(task);
        orchestrator.completeTask(result);
        processedCount++;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 6. Display statistics
  console.log('\n5. System Statistics:');
  const stats = orchestrator.getStatistics();
  console.log(`   Total Tasks: ${stats.totalTasks}`);
  console.log(`   Completed: ${stats.completedTasks}`);
  console.log(`   Failed: ${stats.failedTasks}`);
  console.log(`   Pending: ${stats.pendingTasks}`);
  console.log(`   Registered Agents: ${stats.registeredAgents}`);

  // 7. Display final results
  console.log('\n6. Task Results:');
  const finalTasks = orchestrator.getAllTasks();
  finalTasks.forEach((task: Task) => {
    if (task.status === TaskStatus.COMPLETED) {
      console.log(`\n   Task ${task.id}:`);
      console.log(`   Status: ${task.status}`);
      console.log(`   Result:`, JSON.stringify(task.result, null, 4).split('\n').join('\n   '));
    }
  });

  console.log('\n=== Demo Complete ===\n');
}

// Run the demo
runDemo().catch(console.error);
