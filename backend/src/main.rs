mod api;
mod db;
mod models;
mod processor;

use axum::{
    routing::{get, post},
    Router,
};
use clap::Parser;
use std::fs;
use std::path::PathBuf;

#[derive(Parser, Debug)]
#[command(name = "perfect-asset-backend")]
#[command(about = "High-performance image processing engine for 2026", long_about = None)]
struct Cli {
    /// Path to JSON payload to run in CLI mode
    #[arg(long)]
    run: Option<PathBuf>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();

    if let Some(payload_path) = cli.run {
        println!("Running in CLI mode with payload: {:?}", payload_path);
        let payload_str = fs::read_to_string(payload_path)?;
        let request: models::ExportRequest = serde_json::from_str(&payload_str)?;
        
        processor::process_exports(request).await?;
        println!("CLI export completed.");
        return Ok(());
    }

    println!("Starting server mode...");
    // Initialize SQLite database
    let pool = db::init_db().await?;

    let app = Router::new()
        .route("/projects", get(api::get_projects))
        .route("/export", post(api::trigger_export))
        .with_state(pool);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001").await?;
    println!("Listening on http://0.0.0.0:3001");
    axum::serve(listener, app).await?;

    Ok(())
}
