use serde::{Deserialize, Serialize};
use std::thread;
use std::time::Duration;
use chrono::Utc;

/// Task types supported by the agent
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum TaskType {
    DataProcessing,
    Computation,
    General,
}

/// Agent status
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum AgentStatus {
    Idle,
    Busy,
    Offline,
}

/// Task definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    #[serde(rename = "type")]
    pub task_type: TaskType,
    pub payload: serde_json::Value,
    #[serde(default)]
    pub priority: i32,
}

/// Task result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskResult {
    pub task_id: String,
    pub success: bool,
    pub data: Option<serde_json::Value>,
    pub error: Option<String>,
    pub completed_at: String,
}

/// Agent capability definition
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentCapability {
    pub agent_id: String,
    pub language: String,
    pub capabilities: Vec<TaskType>,
    pub status: AgentStatus,
    pub current_load: i32,
}

/// Rust Agent for high-performance computing
pub struct RustAgent {
    agent_id: String,
    current_task: Option<Task>,
}

impl RustAgent {
    /// Create a new Rust agent
    pub fn new(agent_id: String) -> Self {
        RustAgent {
            agent_id,
            current_task: None,
        }
    }

    /// Get agent capabilities
    pub fn get_capabilities(&self) -> AgentCapability {
        AgentCapability {
            agent_id: self.agent_id.clone(),
            language: "rust".to_string(),
            capabilities: vec![TaskType::Computation, TaskType::DataProcessing],
            status: AgentStatus::Idle,
            current_load: 0,
        }
    }

    /// Process a task
    pub fn process_task(&mut self, task: Task) -> TaskResult {
        self.current_task = Some(task.clone());
        println!("[{}] Processing task {}", self.agent_id, task.id);

        let result = match task.task_type {
            TaskType::Computation => self.handle_computation(&task.payload),
            TaskType::DataProcessing => self.handle_data_processing(&task.payload),
            _ => Err("Unsupported task type".to_string()),
        };

        self.current_task = None;

        match result {
            Ok(data) => {
                println!("[{}] Task {} completed successfully", self.agent_id, task.id);
                TaskResult {
                    task_id: task.id,
                    success: true,
                    data: Some(data),
                    error: None,
                    completed_at: Utc::now().to_rfc3339(),
                }
            }
            Err(error) => {
                println!("[{}] Task {} failed: {}", self.agent_id, task.id, error);
                TaskResult {
                    task_id: task.id,
                    success: false,
                    data: None,
                    error: Some(error),
                    completed_at: Utc::now().to_rfc3339(),
                }
            }
        }
    }

    /// Handle computation tasks
    fn handle_computation(&self, payload: &serde_json::Value) -> Result<serde_json::Value, String> {
        // Simulate computation
        thread::sleep(Duration::from_millis(500));

        let operation = payload.get("operation")
            .and_then(|v| v.as_str())
            .unwrap_or("add");

        let numbers = payload.get("numbers")
            .and_then(|v| v.as_array())
            .ok_or("Missing numbers array")?;

        let nums: Vec<f64> = numbers.iter()
            .filter_map(|v| v.as_f64())
            .collect();

        let result = match operation {
            "add" => nums.iter().sum::<f64>(),
            "multiply" => nums.iter().product::<f64>(),
            "average" => nums.iter().sum::<f64>() / nums.len() as f64,
            _ => nums.first().copied().unwrap_or(0.0),
        };

        Ok(serde_json::json!({
            "status": "computed",
            "operation": operation,
            "input": nums,
            "result": result,
            "timestamp": Utc::now().to_rfc3339()
        }))
    }

    /// Handle data processing tasks
    fn handle_data_processing(&self, payload: &serde_json::Value) -> Result<serde_json::Value, String> {
        // Simulate data processing
        thread::sleep(Duration::from_millis(800));

        let data = payload.get("data")
            .and_then(|v| v.as_array())
            .ok_or("Missing data array")?;

        let processed: Vec<serde_json::Value> = data.iter()
            .filter_map(|v| v.as_f64())
            .map(|n| serde_json::json!(n * 2.0))
            .collect();

        Ok(serde_json::json!({
            "status": "processed",
            "input_size": data.len(),
            "output": processed,
            "timestamp": Utc::now().to_rfc3339()
        }))
    }
}
