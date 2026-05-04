import { useAppStore } from '../store/projectStore';
import { formatBytes, relativeTime } from '../lib/utils';
import { MoreHorizontal, FileImage, HardDrive } from 'lucide-react';

export default function ProjectDashboard() {
  const { projects, setActiveProject } = useAppStore();

  return (
    <div className="h-full overflow-y-auto p-8 bg-[#0A0A0B]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl tracking-tight font-light mb-8 text-[#EBEBF5]">Recent Projects</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg overflow-hidden hover:border-[#3C3C3E] transition-all cursor-pointer group flex flex-col p-2"
              onClick={() => setActiveProject(project)}
            >
              <div className="aspect-[4/3] bg-zinc-900 border border-zinc-800 rounded relative overflow-hidden">
                {project.images.length > 0 ? (
                  <img 
                    src={project.images[0].imageUrl} 
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800">
                    <FileImage size={48} />
                  </div>
                )}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative group/menu">
                  <button className="bg-black/50 backdrop-blur-md text-white p-1.5 rounded-md hover:bg-black/70" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal size={14} />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-32 bg-[#1C1C1E] border border-[#2C2C2E] rounded-md shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 flex flex-col p-1 text-xs">
                    <button className="text-left px-2 py-1.5 hover:bg-black rounded text-[#EBEBF5]" onClick={(e) => e.stopPropagation()}>Rename</button>
                    <button className="text-left px-2 py-1.5 hover:bg-black rounded text-[#EBEBF5]" onClick={(e) => e.stopPropagation()}>Duplicate</button>
                    <div className="h-px bg-[#2C2C2E] my-1" />
                    <button className="text-left px-2 py-1.5 hover:bg-red-500/10 text-red-500 rounded" onClick={(e) => e.stopPropagation()}>Delete</button>
                  </div>
                </div>
              </div>
              </div>
              
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-xs font-semibold text-[#EBEBF5] truncate mb-1">{project.name}</h3>
                
                <div className="mt-auto space-y-2 pt-3">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <div className="flex items-center gap-1.5">
                      <FileImage size={10} />
                      <span>{project.imageCount} items</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HardDrive size={10} />
                      <span>{formatBytes(project.totalSizeBytes)}</span>
                    </div>
                  </div>
                  <div className="text-[9px] text-zinc-600 uppercase tracking-widest font-semibold pt-1">
                    Opened {relativeTime(project.lastOpened)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
