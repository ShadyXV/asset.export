import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { useAppStore } from '../store/projectStore';
import { ArrowLeft, Crop } from 'lucide-react';

export default function ImageEditor() {
  const { activeProject, selectedImageId, selectImage, updateCropArea } = useAppStore();
  const image = activeProject?.images.find((img) => img.id === selectedImageId);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentCrop, setCurrentCrop] = useState<{x: number, y: number, width: number, height: number} | null>(null);

  useEffect(() => {
    if (image?.cropArea) {
      setCurrentCrop(image.cropArea);
    } else {
      setCurrentCrop(null);
    }
  }, [image]);

  if (!image) return null;

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setStartPos({ x, y });
    setCurrentCrop({ x, y, width: 0, height: 0 });
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const currentY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const x = Math.min(startPos.x, currentX);
    const y = Math.min(startPos.y, currentY);
    const width = Math.abs(currentX - startPos.x);
    const height = Math.abs(currentY - startPos.y);

    setCurrentCrop({ x, y, width, height });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (currentCrop && currentCrop.width > 0.05 && currentCrop.height > 0.05) {
      updateCropArea(image.id, currentCrop);
    } else if (image.cropArea) {
      // Revert if too small
      setCurrentCrop(image.cropArea);
    } else {
      setCurrentCrop(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Toolbar */}
      <div className="h-12 border-b border-[#2C2C2E] px-4 flex items-center justify-between shrink-0 bg-[#141416]">
        <div className="flex items-center gap-4">
          <button 
            className="p-1 rounded-md hover:bg-[#1C1C1E] text-zinc-500 hover:text-white transition-colors"
            onClick={() => selectImage(null)}
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="h-6 w-px bg-[#2C2C2E]" />
          
          <span className="text-[11px] font-mono text-[#EBEBF5]">
            {image.filename}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-black px-3 py-1 rounded border border-zinc-800">
            Draw to Focus
          </div>
        </div>
      </div>

      {/* Editor Stage */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
        <div 
          ref={containerRef}
          className="relative max-w-full max-h-full aspect-video shadow-2xl ring-1 ring-[#212328] cursor-crosshair select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img 
            src={image.imageUrl} 
            alt={image.filename}
            className="w-full h-full object-contain pointer-events-none"
            style={{ imageRendering: 'pixelated' }}
            referrerPolicy="no-referrer"
            draggable={false}
          />
          
          {currentCrop && (
            <div 
              className="absolute border-2 border-blue-500 shadow-[0_0_0_999px_rgba(0,0,0,0.6)]"
              style={{
                left: `${currentCrop.x * 100}%`,
                top: `${currentCrop.y * 100}%`,
                width: `${currentCrop.width * 100}%`,
                height: `${currentCrop.height * 100}%`,
              }}
            >
              {/* Crop handles */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500" />
              
              {!isDragging && (
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                  {(currentCrop.width * 100).toFixed(0)}% × {(currentCrop.height * 100).toFixed(0)}%
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
