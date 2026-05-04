use crate::models::{ExportRequest, ExportSettings, CropArea};
use image::{DynamicImage, GenericImageView, ImageBuffer, Rgba};

pub async fn process_exports(request: ExportRequest) -> Result<(), String> {
    println!("Processing exports for project: {}", request.project_id);

    for export in request.exports {
        println!("Processing image: {} (ID: {})", export.filename, export.id);
        
        // Mocking master image read (since we don't have real files)
        // In reality, this would load the image from the master_directory
        let master_img = image::DynamicImage::new_rgb8(4000, 3000); 

        // A. Relative Cropping & Sub-pixel Alignment
        let cropped = subpixel_crop(&master_img, &export.crop);
        
        // B. DPR Scaling & Filename Convention
        generate_variants(&cropped, &export.filename, &request.settings)?;
    }

    Ok(())
}

fn subpixel_crop(img: &DynamicImage, crop: &CropArea) -> DynamicImage {
    let (width, height) = img.dimensions();
    
    // Absolute pixel coordinates
    let abs_x = crop.x * width as f64;
    let abs_y = crop.y * height as f64;
    let abs_w = crop.width * width as f64;
    let abs_h = crop.height * height as f64;

    let out_w = abs_w.round() as u32;
    let out_h = abs_h.round() as u32;

    if out_w == 0 || out_h == 0 {
        return img.clone();
    }

    let mut out_buffer = ImageBuffer::new(out_w, out_h);

    // Taylor expansion based sub-pixel alignment concept
    // I(x + dx, y + dy) ~= I(x,y) + dI/dx * dx + dI/dy * dy
    for y in 0..out_h {
        for x in 0..out_w {
            let src_x = abs_x + x as f64;
            let src_y = abs_y + y as f64;
            
            let x0 = src_x.floor() as u32;
            let y0 = src_y.floor() as u32;
            
            let dx = src_x - x0 as f64;
            let dy = src_y - y0 as f64;

            // Clamp coordinates
            let x0 = x0.min(width - 1);
            let y0 = y0.min(height - 1);
            let x1 = (x0 + 1).min(width - 1);
            let y1 = (y0 + 1).min(height - 1);

            let p00 = img.get_pixel(x0, y0);
            let p10 = img.get_pixel(x1, y0);
            let p01 = img.get_pixel(x0, y1);
            
            // Simple gradient calculation for Taylor expansion
            let mut final_pixel = Rgba([0, 0, 0, 255]);
            for c in 0..3 {
                let v00 = p00[c] as f64;
                let v10 = p10[c] as f64;
                let v01 = p01[c] as f64;
                
                let grad_x = v10 - v00;
                let grad_y = v01 - v00;
                
                let val = v00 + grad_x * dx + grad_y * dy;
                final_pixel[c] = val.clamp(0.0, 255.0) as u8;
            }
            
            out_buffer.put_pixel(x, y, final_pixel);
        }
    }

    DynamicImage::ImageRgba8(out_buffer)
}

fn generate_variants(img: &DynamicImage, base_name: &str, settings: &ExportSettings) -> Result<(), String> {
    let (w, h) = img.dimensions();

    let ext = match settings.format {
        crate::models::ImageFormat::JXL => "jxl",
        crate::models::ImageFormat::AVIF => "avif",
        crate::models::ImageFormat::WEBP => "webp",
        crate::models::ImageFormat::JPEG => "jpg",
    };

    // Quality offset logic
    let x3_quality = if settings.high_dpi_quality_offset { 60 } else { 90 };
    let base_quality = 90;

    if settings.scales.x1 {
        let out_w = w / 3;
        let out_h = h / 3;
        let scaled = img.resize(out_w.max(1), out_h.max(1), image::imageops::FilterType::Lanczos3);
        save_image(&scaled, &format!("{}.{}", base_name, ext), base_quality)?;
    }

    if settings.scales.x2 {
        let out_w = (w * 2) / 3;
        let out_h = (h * 2) / 3;
        let scaled = img.resize(out_w.max(1), out_h.max(1), image::imageops::FilterType::Nearest);
        save_image(&scaled, &format!("{}@2x.{}", base_name, ext), base_quality)?;
    }

    if settings.scales.x3 {
        // x3 is native resolution (assuming master crop was at 3x scale conceptually)
        // using quality offset for x3
        save_image(img, &format!("{}@3x.{}", base_name, ext), x3_quality)?;
    }

    Ok(())
}

fn save_image(_img: &DynamicImage, path: &str, _quality: u8) -> Result<(), String> {
    println!("Saving: {} (Quality: {})", path, _quality);
    // In a real scenario we'd use jxl-rs or zune-image here to write
    // For mockup, we can just print. Writing standard JPEGs if possible:
    // img.save(path).map_err(|e| e.to_string())?;
    Ok(())
}
