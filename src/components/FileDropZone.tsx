import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { Upload, FileVideo, FileImage } from 'lucide-react';

interface FileDropZoneProps {
  accept: string;
  onFileSelect: (file: File) => void;
  label?: string;
  hint?: string;
  icon?: 'video' | 'image';
}

export default function FileDropZone({ accept, onFileSelect, label = 'Drop your file here', hint = 'or click to browse', icon = 'video' }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const IconComponent = icon === 'image' ? FileImage : FileVideo;

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-brand-500 bg-brand-50 scale-[1.02]'
          : fileName
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 bg-white hover:border-brand-400 hover:bg-brand-50/50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        aria-label={label}
      />
      <div className="flex flex-col items-center gap-3">
        {fileName ? (
          <>
            <IconComponent className="w-10 h-10 text-green-500" />
            <p className="text-sm font-medium text-green-700 truncate max-w-full">{fileName}</p>
            <p className="text-xs text-gray-500">Click or drop to change file</p>
          </>
        ) : (
          <>
            <Upload className={`w-10 h-10 ${isDragging ? 'text-brand-700' : 'text-slate-500'}`} />
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <p className="text-xs text-gray-500">{hint}</p>
          </>
        )}
      </div>
    </div>
  );
}
