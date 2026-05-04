import { useEffect } from 'react';
import { useAppStore } from './store/projectStore';
import Sidebar from './components/Sidebar';
import ProjectDashboard from './components/ProjectDashboard';
import ExportWorkspace from './components/ExportWorkspace';
import NewProjectModal from './components/NewProjectModal';
import { Layout } from 'lucide-react';

export default function App() {
  const { fetchProjects, activeProject } = useAppStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="flex h-screen bg-[#0A0A0B] overflow-hidden text-[#EBEBF5]">
      <Sidebar />
      <main className="flex-1 flex flex-col relative h-full">
        <header className="h-12 border-b border-[#2C2C2E] bg-[#141416] flex items-center px-4 justify-between select-none shrink-0 cursor-default">
          <div className="flex items-center gap-3 text-sm font-medium">
            <Layout size={16} className="text-blue-600 hidden" />
            <span className="text-zinc-500 text-sm">Projects</span>
            {activeProject ? (
              <>
                <span className="text-zinc-700">/</span>
                <span className="text-sm font-medium text-[#EBEBF5]">{activeProject.name}</span>
                <span className="ml-4 px-2 py-0.5 rounded bg-zinc-800 text-[10px] uppercase tracking-wider text-zinc-400 border border-zinc-700">DNG MASTER</span>
              </>
            ) : (
              <>
                <span className="text-zinc-700">/</span>
                <span className="text-sm font-medium text-[#EBEBF5]">Dashboard</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-mono text-zinc-600 pt-[2px]">CONNECTION: API_MOCK_READY</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {activeProject ? <ExportWorkspace /> : <ProjectDashboard />}
        </div>
      </main>
      
      <NewProjectModal />
    </div>
  );
}
