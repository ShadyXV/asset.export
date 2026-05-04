import { create } from 'zustand';
import { Project, ImageAsset, ExportSettings } from '../types';
import { ApiService } from '../services/api';

interface AppState {
  projects: Project[];
  activeProject: Project | null;
  selectedImageId: string | null;
  exportSettings: ExportSettings;
  isLoading: boolean;
  isExporting: boolean;
  isNewProjectModalOpen: boolean;

  setNewProjectModalOpen: (isOpen: boolean) => void;
  fetchProjects: () => Promise<void>;
  setActiveProject: (project: Project | null) => void;
  createProject: (name: string, directory: string) => void;
  selectImage: (id: string | null) => void;
  updateImageOrder: (projectId: string, newImages: ImageAsset[]) => void;
  batchRenameImages: (pattern: string) => void;
  updateCropArea: (imageId: string, crop: {x: number, y: number, width: number, height: number}) => void;
  updateExportSettings: (settings: Partial<ExportSettings>) => void;
  triggerExport: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  projects: [],
  activeProject: null,
  selectedImageId: null,
  exportSettings: {
    scales: { x1: true, x2: true, x3: true },
    format: 'JXL',
    highDpiQualityOffset: true,
  },
  isLoading: false,
  isExporting: false,
  isNewProjectModalOpen: false,

  setNewProjectModalOpen: (isOpen: boolean) => set({ isNewProjectModalOpen: isOpen }),

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await ApiService.getProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch projects', error);
      set({ isLoading: false });
    }
  },

  setActiveProject: (project) => {
    set({ activeProject: project, selectedImageId: null });
  },

  createProject: (name, directory) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      masterDirectory: directory,
      lastOpened: new Date().toISOString(),
      imageCount: 0,
      totalSizeBytes: 0,
      images: [],
    };
    set((state) => ({
      projects: [...state.projects, newProject],
      activeProject: newProject,
    }));
  },

  selectImage: (id) => {
    set({ selectedImageId: id });
  },

  updateImageOrder: (projectId, newImages) => {
    set((state) => {
      const updatedProjects = state.projects.map(p => 
        p.id === projectId ? { ...p, images: newImages } : p
      );
      return { 
        projects: updatedProjects,
        activeProject: state.activeProject?.id === projectId 
          ? { ...state.activeProject, images: newImages } 
          : state.activeProject 
      };
    });
  },

  batchRenameImages: (pattern) => {
    const { activeProject } = get();
    if (!activeProject) return;

    const newImages = activeProject.images.map((img, index) => {
      const newName = pattern.replace('##', String(index + 1).padStart(2, '0'));
      return { ...img, filename: newName + '.dng' }; // Mock extension
    });

    get().updateImageOrder(activeProject.id, newImages);
  },

  updateCropArea: (imageId, crop) => {
    const { activeProject, updateImageOrder } = get();
    if (!activeProject) return;

    const newImages = activeProject.images.map((img) => 
      img.id === imageId ? { ...img, cropArea: crop } : img
    );

    updateImageOrder(activeProject.id, newImages);
  },

  updateExportSettings: (settings) => {
    set((state) => ({
      exportSettings: { ...state.exportSettings, ...settings }
    }));
  },

  triggerExport: async () => {
    const { activeProject, exportSettings } = get();
    if (!activeProject) return;

    set({ isExporting: true });
    try {
      await ApiService.exportProject(activeProject, exportSettings);
    } catch (error) {
      console.error('Export failed', error);
    } finally {
      set({ isExporting: false });
    }
  }
}));
