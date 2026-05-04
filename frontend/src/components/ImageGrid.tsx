import React, { useState } from 'react';
import { useAppStore } from '../store/projectStore';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LayoutGrid, List as ListIcon, UploadCloud, Edit3, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { formatBytes } from '../lib/utils';
import { ImageAsset } from '../types';

interface SortableItemProps {
  image: ImageAsset;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

function SortableImageItem({ image, viewMode, onClick }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  if (viewMode === 'list') {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="flex items-center gap-4 bg-[#1C1C1E] p-2 rounded-lg border border-[#2C2C2E] hover:border-[#3C3C3E] group cursor-pointer"
        onClick={onClick}
      >
        <div 
          {...attributes} 
          {...listeners}
          className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white cursor-grab active:cursor-grabbing shrink-0"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col gap-[2px]">
            <div className="w-4 h-[2px] bg-current rounded-full" />
            <div className="w-4 h-[2px] bg-current rounded-full" />
            <div className="w-4 h-[2px] bg-current rounded-full" />
          </div>
        </div>
        <img 
          src={image.imageUrl} 
          className="w-12 h-12 object-cover rounded bg-zinc-900 border border-zinc-800" 
          alt={image.filename}
          draggable={false}
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] text-[#EBEBF5] truncate">{image.filename}</p>
        </div>
        <div className="px-4 text-[10px] font-mono text-zinc-500">
          {formatBytes(image.sizeBytes)}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative aspect-square bg-[#1C1C1E] p-1.5 rounded-lg border border-[#2C2C2E] hover:border-blue-600 transition-colors group cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="flex-1 bg-zinc-900 rounded overflow-hidden mb-2 border border-zinc-800 relative">
        <img 
          src={image.imageUrl} 
          className="w-full h-full object-cover" 
          alt={image.filename}
          style={{ imageRendering: 'pixelated' }}
          draggable={false}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
          <div 
            {...attributes} 
            {...listeners}
            className="self-end p-1.5 bg-black/50 backdrop-blur rounded cursor-grab active:cursor-grabbing text-white/70 hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-[2px]">
              <div className="w-3 h-[2px] bg-current rounded-full" />
              <div className="w-3 h-[2px] bg-current rounded-full" />
              <div className="w-3 h-[2px] bg-current rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center px-0.5">
        <span className="text-[10px] font-mono truncate text-[#EBEBF5]">{image.filename}</span>
        <span className="text-[9px] font-mono text-zinc-500 pl-2 shrink-0">{formatBytes(image.sizeBytes)}</span>
      </div>
    </div>
  );
}

export default function ImageGrid() {
  const { activeProject, selectImage, updateImageOrder, batchRenameImages } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [renamePattern, setRenamePattern] = useState('hero-banner-##');
  const [isRenaming, setIsRenaming] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!activeProject) return null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = activeProject.images.findIndex((img) => img.id === active.id);
      const newIndex = activeProject.images.findIndex((img) => img.id === over.id);
      
      const newImages = arrayMove(activeProject.images, oldIndex, newIndex);
      updateImageOrder(activeProject.id, newImages);
    }
  };

  const handleBatchRename = () => {
    batchRenameImages(renamePattern);
    setIsRenaming(false);
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Toolbar */}
      <div className="h-12 border-b border-[#2C2C2E] px-4 flex items-center justify-between shrink-0 bg-[#141416]">
        <div className="flex items-center gap-4">
          <div className="flex bg-black p-1 rounded-md border border-zinc-800">
            <button 
              className={`px-3 py-1 text-xs rounded ${viewMode === 'grid' ? 'bg-zinc-800 text-[#EBEBF5]' : 'text-zinc-500 hover:text-[#EBEBF5]'}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded ${viewMode === 'list' ? 'bg-zinc-800 text-[#EBEBF5]' : 'text-zinc-500 hover:text-[#EBEBF5]'}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
          
          <div className="h-6 w-px bg-[#2C2C2E]" />
          
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {activeProject.images.length} master files
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isRenaming ? (
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={renamePattern}
                onChange={(e) => setRenamePattern(e.target.value)}
                className="bg-black border border-zinc-800 rounded px-3 py-1 text-xs font-mono text-white outline-none focus:border-blue-600"
                placeholder="pattern-##"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleBatchRename()}
              />
              <Button size="sm" variant="primary" onClick={handleBatchRename}>Apply</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsRenaming(false)}>Cancel</Button>
            </div>
          ) : (
            <div 
              className="text-[11px] text-blue-400 cursor-pointer mr-2 hover:underline"
              onClick={() => setIsRenaming(true)}
            >
              Batch Rename: {renamePattern}
            </div>
          )}
          
          <Button size="sm" variant="primary" className="gap-2">
            <UploadCloud size={14} />
            Add Masters
          </Button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-6" id="scroll-container">
        {activeProject.images.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#5e626b]">
            <ImageIcon size={48} className="mb-4 opacity-50" />
            <p>Drag and drop master files here to begin</p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={activeProject.images.map(i => i.id)}
              strategy={rectSortingStrategy}
            >
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" 
                : "flex flex-col gap-2 max-w-4xl mx-auto"
              }>
                {activeProject.images.map(img => (
                  <SortableImageItem 
                    key={img.id} 
                    image={img} 
                    viewMode={viewMode}
                    onClick={() => selectImage(img.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
