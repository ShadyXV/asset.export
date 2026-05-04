use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Project {
    pub id: Uuid,
    pub name: String,
    pub master_directory: String,
    pub last_opened: DateTime<Utc>,
    pub image_count: u32,
    pub total_size_bytes: u64,
    pub images: Vec<ProjectImage>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectImage {
    pub id: Uuid,
    pub filename: String,
    pub image_url: String,
    pub size_bytes: u64,
    pub crop_area: CropArea,
}

#[derive(Serialize, Deserialize, Clone, Copy, Debug)]
pub struct CropArea {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ExportRequest {
    pub project_id: Uuid,
    pub settings: ExportSettings,
    pub exports: Vec<ExportItem>,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ExportSettings {
    pub scales: Scales,
    pub format: ImageFormat,
    pub high_dpi_quality_offset: bool,
}

#[derive(Deserialize, Debug)]
pub struct Scales {
    pub x1: bool,
    pub x2: bool,
    pub x3: bool,
}

#[derive(Deserialize, PartialEq, Eq, Debug)]
#[serde(rename_all = "UPPERCASE")]
pub enum ImageFormat {
    JXL,
    AVIF,
    WEBP,
    JPEG,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ExportItem {
    pub id: Uuid,
    pub filename: String,
    pub crop: CropArea,
}
