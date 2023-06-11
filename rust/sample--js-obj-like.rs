

use serde_json::json;

fn main() {
    // Create a JSON object with initial key-value pairs
    let mut obj = json!({
        "ten": 10,
        "eleven": 11
    });

    // Add a new key-value pair
    obj["twelve"] = json!(12);

    // Access values in the JSON object
    println!("Value for 'ten': {:?}", obj["ten"]);
    println!("Value for 'eleven': {:?}", obj["eleven"]);
    println!("Value for 'twelve': {:?}", obj["twelve"]);
}

