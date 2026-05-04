import { Project, ExportSettings } from "../types";

export class ApiService {
  static async getProjects(): Promise<Project[]> {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  }

  static async exportProject(project: Project, settings: ExportSettings): Promise<void> {
    const payload = {
      projectId: project.id,
      settings,
      exports: project.images.map(img => ({
        id: img.id,
        filename: img.filename,
        crop: img.cropArea || { x: 0, y: 0, width: 1, height: 1 },
      })),
    };

    const response = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to trigger export');
    }
  }

  static async browseDirectory(): Promise<string | null> {
    const response = await fetch('/api/browse');
    if (response.status === 204) {
      return null; // User cancelled
    }
    if (!response.ok) {
      throw new Error('Failed to open directory browser');
    }
    const data = await response.json();
    return data.path;
  }
}
