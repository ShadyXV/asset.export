import { useAppStore } from '../store/projectStore';
import { Button } from './ui/Button';
import { FolderOpen, X } from 'lucide-react';
import { useState } from 'react';
import { ApiService } from '../services/api';

export default function NewProjectModal() {
  const { isNewProjectModalOpen, setNewProjectModalOpen, createProject } = useAppStore();
  const [isCreating, setIsCreating] = useState(false);
  const [directoryPath, setDirectoryPath] = useState('');
  const [projectName, setProjectName] = useState('');

  if (!isNewProjectModalOpen) return null;

  const handleBrowse = async () => {
    try {
      const path = await ApiService.browseDirectory();
      if (path) {
        setDirectoryPath(path);
      }
    } catch (err) {
      console.error('Failed to browse directory:', err);
    }
  };

  const handleCreate = () => {
    if (!projectName || !directoryPath) return; // Optional simple validation
    setIsCreating(true);
    setTimeout(() => {
      createProject(projectName, directoryPath);
      setIsCreating(false);
      setNewProjectModalOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-[#2C2C2E]">
          <h2 className="text-[#EBEBF5] font-semibold text-sm uppercase tracking-wider">Create New Project</h2>
          <button 
            className="text-zinc-500 hover:text-white transition-colors"
            onClick={() => setNewProjectModalOpen(false)}
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">Project Name</label>
            <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-black border border-zinc-800 focus:border-blue-600 outline-none rounded px-3 py-2 text-xs font-mono text-white transition-colors"
              placeholder="e.g. Summer Campaign Assets"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">Master Asset Directory</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={directoryPath}
                onChange={(e) => setDirectoryPath(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-blue-600 outline-none rounded px-3 py-2 text-xs font-mono text-zinc-300 transition-colors"
                placeholder="/Volumes/..."
              />
              <Button variant="secondary" className="gap-2 shrink-0" onClick={handleBrowse}>
                <FolderOpen size={14} />
                Browse
              </Button>
            </div>
            <p className="text-[10px] text-zinc-600">Select the root folder containing your DNG or TIFF masters.</p>
          </div>
        </div>

        <div className="p-4 border-t border-[#2C2C2E] flex justify-end gap-3 bg-black/40">
          <Button variant="ghost" onClick={() => setNewProjectModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate} isLoading={isCreating}>Create Project</Button>
        </div>
      </div>
    </div>
  );
}
