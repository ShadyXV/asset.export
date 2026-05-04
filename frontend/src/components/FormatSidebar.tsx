import { useAppStore } from '../store/projectStore';
import { Button } from './ui/Button';
import { Settings2, Download, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { ExportSettings } from '../types';

export default function FormatSidebar() {
  const { activeProject, exportSettings, updateExportSettings, triggerExport, isExporting } = useAppStore();

  if (!activeProject) return null;

  const toggleScale = (scale: keyof ExportSettings['scales']) => {
    updateExportSettings({
      scales: {
        ...exportSettings.scales,
        [scale]: !exportSettings.scales[scale]
      }
    });
  };

  return (
    <div className="w-[320px] bg-[#141416] flex flex-col shrink-0 select-none border-l border-[#2C2C2E]">
      <div className="h-12 px-4 flex items-center border-b border-[#2C2C2E]">
        <div className="flex items-center gap-2 text-[#EBEBF5] font-medium text-xs font-bold uppercase tracking-widest text-zinc-500">
          <Settings2 size={14} className="text-zinc-500" />
          Output Profile
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8">
        
        {/* Scaling */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Device Pixel Ratios</label>
          <div className="grid grid-cols-3 gap-2">
            {(['x1', 'x2', 'x3'] as const).map((scale) => (
              <button
                key={scale}
                onClick={() => toggleScale(scale)}
                className={cn(
                  "py-2 rounded font-mono text-xs border transition-colors flex justify-center items-center",
                  exportSettings.scales[scale] 
                    ? "bg-blue-600 border-blue-500 text-white" 
                    : "bg-black border-zinc-800 text-zinc-500 hover:border-zinc-600"
                )}
              >
                {scale === 'x1' ? '1x' : scale === 'x2' ? '2x' : '3x'}
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Format</label>
          <div className="grid grid-cols-2 gap-2">
            {(['JXL', 'AVIF', 'WEBP', 'JPEG'] as const).map((format) => (
              <button
                key={format}
                onClick={() => updateExportSettings({ format })}
                className={cn(
                  "py-2 rounded font-mono text-xs border transition-colors",
                  exportSettings.format === format 
                    ? "bg-blue-600 border-blue-500 text-white" 
                    : "bg-black border-zinc-800 text-zinc-500 hover:border-zinc-600"
                )}
              >
                {format}
              </button>
            ))}
          </div>
          <p className="text-zinc-500 text-[10px] pt-1">
            {exportSettings.format === 'JXL' && 'JPEG XL offers ~60% better compression than legacy JPEG.'}
            {exportSettings.format === 'AVIF' && 'AVIF is great for high dynamic range but slower to encode.'}
            {exportSettings.format === 'WEBP' && 'WebP is highly compatible with older browsers.'}
            {exportSettings.format === 'JPEG' && 'Legacy JPEG format for maximum compatibility.'}
          </p>
        </div>

        {/* Compression Engine */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Engine Rules</label>
          <div 
            className="bg-black border border-zinc-800 rounded p-3 flex gap-3 cursor-pointer hover:border-zinc-600 transition-colors"
            onClick={() => updateExportSettings({ highDpiQualityOffset: !exportSettings.highDpiQualityOffset })}
          >
            <div className={cn(
              "w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border transition-colors",
              exportSettings.highDpiQualityOffset ? "bg-blue-600 border-blue-600" : "bg-transparent border-zinc-600"
            )}>
              {exportSettings.highDpiQualityOffset && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <div>
              <p className="text-xs text-[#EBEBF5] mb-1">High-DPI Quality Offset</p>
              <p className="text-[10px] text-zinc-500 leading-tight">Automatically reduce compression quality on 3x assets to save bandwidth.</p>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-auto p-4 border-t border-[#2C2C2E] bg-black/40">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] text-zinc-500 uppercase">Estimated Bundle Size</span>
          <span className="text-xs font-mono font-bold text-white">1.42 GB</span>
        </div>
        <Button 
          variant="primary" 
          className="w-full py-2 text-xs font-semibold tracking-wide rounded-md"
          isLoading={isExporting}
          onClick={triggerExport}
        >
          {isExporting ? 'PROCESSING...' : 'Export Batch'}
        </Button>
      </div>

    </div>
  );
}
