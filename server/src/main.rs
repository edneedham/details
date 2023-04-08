use std::env;
use warp::Filter;
use warp::reject::Reject;
use serde::{Deserialize, Serialize};
use serde_json::json;
use dotenv::dotenv;

#[derive(Debug)]
struct CustomError(String);

impl Reject for CustomError {}

#[derive(Debug, Deserialize, Serialize)]
struct RequestData {
    text: String,
}

#[derive(Debug, Deserialize)]
struct OpenAIResponse {
    id: String,
    object: String,
    created: u64,
    model: String,
    usage: Usage,
    choices: Vec<Choice>,
}

#[derive(Debug, Deserialize)]
struct Choice {
    message: Message,
    finish_reason: String,
    index: u32,
}

#[derive(Debug, Deserialize)]
struct Message {
    role: String,
    content: String,
}

#[derive(Debug, Deserialize)]
struct Usage {
    prompt_tokens: u32,
    completion_tokens: u32,
    total_tokens: u32,
}

async fn handle_request(request_data: RequestData) -> Result<impl warp::Reply, warp::Rejection> {
    println!("Received request data: {:?}", request_data);
    let openai_api_key = match env::var("OPENAI_API_KEY") {
        Ok(key) => key,
        Err(_) => {
            return Err(warp::reject::custom(CustomError(
                "OPENAI_API_KEY must be set".to_string(),
            )));
        }
    };

    if request_data.text.trim().is_empty() {
        return Err(warp::reject::custom(CustomError(
            "Please provide valid text to summarize".to_string(),
        )));
    }

    let client = reqwest::Client::new();
    let openai_url = "https://api.openai.com/v1/chat/completions";
    let openai_prompt = format!("{}", request_data.text);

    let response = client
        .post(openai_url)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", openai_api_key))
        .json(&json!({
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": openai_prompt}],
            "temperature": 0.7,
        }))
        .send()
        .await
        .map_err(|e| { 
                eprintln!("Error connecting to OpenAI API: {:?}", e);
                 warp::reject::custom(CustomError("Failed to connect to OpenAI API".to_string()))})?;

    let raw_response_text = response.text().await.unwrap();
    println!("Raw OpenAI API response: {}", raw_response_text);

    let openai_response: OpenAIResponse = serde_json::from_str(&raw_response_text)
        .map_err(|e| {
            eprintln!("Error parsing OpenAI API response: {:?}", e);
            warp::reject::custom(CustomError("Failed to parse OpenAI API response".to_string()))})?;

    let first_choice = openai_response.choices.get(0).unwrap();
    Ok(warp::reply::json(&json!({ "result": first_choice.message.content })))
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    let summarize_route = warp::path("api")
        .and(warp::path("summarize"))
        .and(warp::post())
        .and(warp::body::json())
        .and_then(handle_request);

    let cors = warp::cors()
        .allow_any_origin()
        .allow_headers(vec!["content-type", "authorization"])
        .allow_methods(vec!["POST"]);

    let routes = summarize_route.with(cors);

    println!("Server started at http://localhost:3030");
    warp::serve(routes).run(([0, 0, 0, 0], 3030)).await;
}
