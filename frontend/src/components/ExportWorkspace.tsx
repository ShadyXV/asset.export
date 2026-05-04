import { useAppStore } from '../store/projectStore';
import FormatSidebar from './FormatSidebar';
import ImageGrid from './ImageGrid';
import ImageEditor from './ImageEditor';

export default function ExportWorkspace() {
  const { activeProject, selectedImageId } = useAppStore();

  if (!activeProject) return null;

  return (
    <div className="flex h-full bg-[#0A0A0B]">
      <div className="flex-1 flex flex-col min-w-0 relative border-r border-[#2C2C2E]">
        {selectedImageId ? (
          <ImageEditor />
        ) : (
          <ImageGrid />
        )}
      </div>
      <FormatSidebar />
    </div>
  );
}
