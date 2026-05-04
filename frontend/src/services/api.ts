import { Project, ExportSettings, ImageAsset } from "../types";

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Acme Hero Assets",
    masterDirectory: "/Volumes/RAID/Masters/Acme/Hero",
    lastOpened: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    imageCount: 12,
    totalSizeBytes: 1024 * 1024 * 540, // 540 MB
    images: Array.from({ length: 12 }).map((_, i) => ({
      id: `img-1-${i}`,
      filename: `hero_raw_${i + 1}.dng`,
      imageUrl: `https://picsum.photos/seed/hero_${i}/800/600`, // Using picsum for mock images
      sizeBytes: 1024 * 1024 * 45,
    }))
  },
  {
    id: "proj-2",
    name: "Marketing Campaign Q3",
    masterDirectory: "/Volumes/RAID/Masters/Q3_Campaign",
    lastOpened: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    imageCount: 56,
    totalSizeBytes: 1024 * 1024 * 1024 * 2.1, // 2.1 GB
    images: Array.from({ length: 56 }).map((_, i) => ({
      id: `img-2-${i}`,
      filename: `q3_asset_${i + 1}.tiff`,
      imageUrl: `https://picsum.photos/seed/q3_${i}/800/600`,
      sizeBytes: 1024 * 1024 * 38,
    }))
  },
  {
    id: "proj-3",
    name: "E-Commerce Fall Collection",
    masterDirectory: "/Volumes/RAID/Fall_Collection",
    lastOpened: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    imageCount: 300,
    totalSizeBytes: 1024 * 1024 * 1024 * 15.5, // 15.5 GB
    images: Array.from({ length: 300 }).map((_, i) => ({
      id: `img-3-${i}`,
      filename: `prod_${i + 1}.dng`,
      imageUrl: `https://picsum.photos/seed/fall_${i}/800/600`,
      sizeBytes: 1024 * 1024 * 53,
    }))
  },
  {
    id: "proj-4",
    name: "Blog Post Thumbnails",
    masterDirectory: "/Volumes/Local/Blog/Thumbs",
    lastOpened: new Date(Date.now() - 86400000 * 10).toISOString(),
    imageCount: 4,
    totalSizeBytes: 1024 * 1024 * 80, // 80 MB
    images: Array.from({ length: 4 }).map((_, i) => ({
      id: `img-4-${i}`,
      filename: `thumb_${i + 1}.cr2`,
      imageUrl: `https://picsum.photos/seed/blog_${i}/800/600`,
      sizeBytes: 1024 * 1024 * 20,
    }))
  },
  {
    id: "proj-5",
    name: "App Store Screenshots",
    masterDirectory: "/Volumes/SSD/Mobile/Store",
    lastOpened: new Date(Date.now() - 86400000 * 15).toISOString(),
    imageCount: 8,
    totalSizeBytes: 1024 * 1024 * 240, // 240 MB
    images: Array.from({ length: 8 }).map((_, i) => ({
      id: `img-5-${i}`,
      filename: `screen_${i + 1}.png`,
      imageUrl: `https://picsum.photos/seed/app_${i}/800/600`,
      sizeBytes: 1024 * 1024 * 30,
    }))
  }
];

export class MockAPI {
  static async getProjects(): Promise<Project[]> {
    return new Promise((resolve) => setTimeout(() => resolve(mockProjects), 500));
  }

  static async exportProject(project: Project, settings: ExportSettings): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const payload = {
          projectId: project.id,
          projectName: project.name,
          masterDirectory: project.masterDirectory,
          exports: project.images.map(img => ({
            id: img.id,
            filename: img.filename,
            crop: img.cropArea,
          })),
          settings
        };
        console.log("=== RUST API EXPORT PAYLOAD ===");
        console.log(JSON.stringify(payload, null, 2));
        console.log("===============================");
        resolve();
      }, 1500); 
    });
  }
}
