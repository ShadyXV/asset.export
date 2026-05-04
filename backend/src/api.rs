use axum::{
    extract::{State, Json},
    http::StatusCode,
    response::IntoResponse,
};
use sqlx::SqlitePool;
use crate::models::{Project, ProjectImage, CropArea, ExportRequest};
use uuid::Uuid;
use chrono::Utc;

pub async fn get_projects(State(_pool): State<SqlitePool>) -> impl IntoResponse {
    // In a real scenario, fetch from DB using pool
    
    // For demonstration, returning a mock response exactly as per the spec
    let mock_project = Project {
        id: Uuid::new_v4(),
        name: "Sample Project".to_string(),
        master_directory: "/absolute/path/to/masters".to_string(),
        last_opened: Utc::now(),
        image_count: 15,
        total_size_bytes: 540000000,
        images: vec![
            ProjectImage {
                id: Uuid::new_v4(),
                filename: "original.dng".to_string(),
                image_url: "/preview/uuid.jpg".to_string(),
                size_bytes: 45000000,
                crop_area: CropArea {
                    x: 0.0,
                    y: 0.0,
                    width: 1.0,
                    height: 1.0,
                },
            }
        ],
    };

    (StatusCode::OK, Json(vec![mock_project]))
}

pub async fn trigger_export(
    State(_pool): State<SqlitePool>,
    Json(payload): Json<ExportRequest>,
) -> impl IntoResponse {
    match crate::processor::process_exports(payload).await {
        Ok(_) => (StatusCode::OK, Json(serde_json::json!({"status": "Export started"}))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e}))).into_response(),
    }
}

pub async fn browse_directory() -> impl IntoResponse {
    let path = tokio::task::spawn_blocking(|| {
        #[cfg(target_os = "macos")]
        {
            let output = std::process::Command::new("osascript")
                .arg("-e")
                .arg("POSIX path of (choose folder)")
                .output()
                .ok()?;
            
            if output.status.success() {
                let path_str = String::from_utf8_lossy(&output.stdout).trim().to_string();
                if !path_str.is_empty() {
                    return Some(path_str);
                }
            }
            None
        }
        #[cfg(not(target_os = "macos"))]
        {
            rfd::FileDialog::new().pick_folder().map(|p| p.display().to_string())
        }
    })
    .await
    .unwrap_or(None);

    if let Some(p) = path {
        return (StatusCode::OK, Json(serde_json::json!({ "path": p }))).into_response();
    }
    
    (StatusCode::NO_CONTENT, "").into_response()
}
