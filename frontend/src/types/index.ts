export interface CropArea {
  x: number; // 0 to 1
  y: number; // 0 to 1
  width: number; // 0 to 1
  height: number; // 0 to 1
}

export interface ImageAsset {
  id: string;
  filename: string;
  imageUrl: string;
  sizeBytes: number;
  cropArea?: CropArea;
}

export interface Project {
  id: string;
  name: string;
  masterDirectory: string;
  lastOpened: string; // ISO string
  imageCount: number;
  totalSizeBytes: number;
  images: ImageAsset[];
}

export interface ExportSettings {
  scales: {
    x1: boolean;
    x2: boolean;
    x3: boolean;
  };
  format: 'JXL' | 'AVIF' | 'WEBP' | 'JPEG';
  highDpiQualityOffset: boolean;
}
