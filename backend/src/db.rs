use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use std::env;

pub async fn init_db() -> Result<SqlitePool, sqlx::Error> {
    let db_url = env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:perfect_asset.db".to_string());
    
    // Create DB file if it doesn't exist
    if !std::path::Path::new("perfect_asset.db").exists() {
        std::fs::File::create("perfect_asset.db").unwrap();
    }

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await?;

    // Initialize tables
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            master_directory TEXT NOT NULL,
            last_opened TEXT NOT NULL
        );"
    )
    .execute(&pool)
    .await?;

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS images (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            filename TEXT NOT NULL,
            image_url TEXT NOT NULL,
            size_bytes INTEGER NOT NULL,
            crop_x REAL NOT NULL,
            crop_y REAL NOT NULL,
            crop_width REAL NOT NULL,
            crop_height REAL NOT NULL,
            FOREIGN KEY(project_id) REFERENCES projects(id)
        );"
    )
    .execute(&pool)
    .await?;

    Ok(pool)
}
