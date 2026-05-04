import { Folder, Settings, Plus, Layers } from 'lucide-react';
import { useAppStore } from '../store/projectStore';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

export default function Sidebar() {
  const { projects, activeProject, setActiveProject, setNewProjectModalOpen } = useAppStore();

  return (
    <div className="w-16 md:w-64 bg-[#141416] border-r border-[#2C2C2E] flex flex-col shrink-0 select-none">
      <div className="p-4 border-b border-[#2C2C2E]">
        <Button variant="primary" className="w-full gap-2 justify-center md:justify-start font-semibold" onClick={() => setNewProjectModalOpen(true)}>
          <Plus size={16} />
          <span className="hidden md:inline">New Project</span>
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-2 hidden md:block">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider pl-2 mb-1">Projects</p>
        </div>
        
        <div className="space-y-1 px-2">
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => setActiveProject(project)}
              className={cn(
                "w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2 rounded-md text-xs transition-colors text-left group",
                activeProject?.id === project.id 
                  ? "bg-black border border-zinc-800 text-white" 
                  : "text-zinc-500 hover:bg-[#1C1C1E] hover:text-zinc-300 border border-transparent"
              )}
            >
              <Folder size={16} className={cn(
                "group-hover:text-zinc-300 transition-colors shrink-0",
                activeProject?.id === project.id ? "text-blue-400" : "text-zinc-500"
              )} />
              <span className="truncate flex-1 hidden md:block">{project.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-[#2C2C2E] space-y-1">
        <button 
          onClick={() => setActiveProject(null)}
          className={cn(
            "w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2 rounded-md text-xs transition-colors text-left text-zinc-500 hover:bg-[#1C1C1E] hover:text-zinc-300 border border-transparent",
            !activeProject ? "bg-black border border-zinc-800 text-white" : ""
          )}
        >
          <Layers size={16} className="shrink-0" />
          <span className="hidden md:block">Dashboard</span>
        </button>
        <button className="w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2 rounded-md text-xs transition-colors text-left text-zinc-500 hover:bg-[#1C1C1E] hover:text-zinc-300 border border-transparent">
          <Settings size={16} className="shrink-0" />
          <span className="hidden md:block">Settings</span>
        </button>
      </div>
    </div>
  );
}
