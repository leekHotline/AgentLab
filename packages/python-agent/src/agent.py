"""
Python Agent - Data Processing Worker

This agent handles data processing and analysis tasks.
"""

import json
import time
from typing import Dict, Any, List
from enum import Enum
from dataclasses import dataclass, asdict
from datetime import datetime


class TaskType(str, Enum):
    """Task types supported by the agent"""
    DATA_PROCESSING = "data-processing"
    COMPUTATION = "computation"
    GENERAL = "general"


class AgentStatus(str, Enum):
    """Agent status"""
    IDLE = "idle"
    BUSY = "busy"
    OFFLINE = "offline"


@dataclass
class Task:
    """Task definition"""
    id: str
    type: TaskType
    payload: Dict[str, Any]
    priority: int = 0


@dataclass
class TaskResult:
    """Task result"""
    task_id: str
    success: bool
    data: Any = None
    error: str = None
    completed_at: str = None


@dataclass
class AgentCapability:
    """Agent capability definition"""
    agent_id: str
    language: str
    capabilities: List[TaskType]
    status: AgentStatus
    current_load: int


class PythonAgent:
    """Python Agent for data processing tasks"""
    
    def __init__(self, agent_id: str = "python-agent-1"):
        self.agent_id = agent_id
        self.current_task = None
        
    def get_capabilities(self) -> AgentCapability:
        """Get agent capabilities"""
        return AgentCapability(
            agent_id=self.agent_id,
            language="python",
            capabilities=[TaskType.DATA_PROCESSING, TaskType.COMPUTATION],
            status=AgentStatus.IDLE,
            current_load=0
        )
    
    def process_task(self, task: Task) -> TaskResult:
        """Process a task"""
        self.current_task = task
        print(f"[{self.agent_id}] Processing task {task.id}")
        
        try:
            if task.type == TaskType.DATA_PROCESSING:
                result = self._handle_data_processing(task.payload)
            elif task.type == TaskType.COMPUTATION:
                result = self._handle_computation(task.payload)
            else:
                raise ValueError(f"Unsupported task type: {task.type}")
            
            print(f"[{self.agent_id}] Task {task.id} completed successfully")
            
            return TaskResult(
                task_id=task.id,
                success=True,
                data=result,
                completed_at=datetime.now().isoformat()
            )
        except Exception as e:
            print(f"[{self.agent_id}] Task {task.id} failed: {str(e)}")
            
            return TaskResult(
                task_id=task.id,
                success=False,
                error=str(e),
                completed_at=datetime.now().isoformat()
            )
        finally:
            self.current_task = None
    
    def _handle_data_processing(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle data processing tasks"""
        # Simulate data processing
        time.sleep(1)
        
        data = payload.get("data", [])
        processed_data = [x * 2 for x in data] if isinstance(data, list) else data
        
        return {
            "status": "processed",
            "input_size": len(data) if isinstance(data, list) else 1,
            "output": processed_data,
            "timestamp": datetime.now().isoformat()
        }
    
    def _handle_computation(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle computation tasks"""
        # Simulate computation
        time.sleep(0.5)
        
        operation = payload.get("operation", "add")
        numbers = payload.get("numbers", [0, 0])
        
        if operation == "add":
            result = sum(numbers)
        elif operation == "multiply":
            result = 1
            for n in numbers:
                result *= n
        else:
            result = numbers[0] if numbers else 0
        
        return {
            "status": "computed",
            "operation": operation,
            "input": numbers,
            "result": result,
            "timestamp": datetime.now().isoformat()
        }


def main():
    """Main entry point"""
    agent = PythonAgent()
    capabilities = agent.get_capabilities()
    
    print(f"Python Agent '{agent.agent_id}' initialized")
    print(f"Capabilities: {[c.value for c in capabilities.capabilities]}")
    
    # Example task processing
    example_task = Task(
        id="example-1",
        type=TaskType.DATA_PROCESSING,
        payload={"data": [1, 2, 3, 4, 5]},
        priority=1
    )
    
    result = agent.process_task(example_task)
    print(f"Result: {json.dumps(asdict(result), indent=2)}")


if __name__ == "__main__":
    main()
