use rust_agent::{RustAgent, Task, TaskType};
use serde_json::json;

fn main() {
    let mut agent = RustAgent::new("rust-agent-1".to_string());
    let capabilities = agent.get_capabilities();

    println!("Rust Agent '{}' initialized", capabilities.agent_id);
    println!("Capabilities: {:?}", capabilities.capabilities);

    // Example task processing
    let example_task = Task {
        id: "example-1".to_string(),
        task_type: TaskType::Computation,
        payload: json!({
            "operation": "multiply",
            "numbers": [2, 3, 4, 5]
        }),
        priority: 1,
    };

    let result = agent.process_task(example_task);
    println!("Result: {}", serde_json::to_string_pretty(&result).unwrap());
}
