'use client';

import { useState, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

interface FileUploadProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  accept?: string;
  multiple?: boolean;
}

export function FileUpload({ 
  onFilesUploaded, 
  accept = '.csv,.txt,.mpt,.dta,.xlsx',
  multiple = true 
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const processFiles = async (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type || getFileType(file.name),
      status: 'uploading' as const,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload for each file
    for (const file of newFiles) {
      await simulateUpload(file.id);
    }

    onFilesUploaded?.(files);
  };

  const simulateUpload = async (fileId: string) => {
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, progress, status: progress === 100 ? 'success' : 'uploading' }
            : f
        )
      );
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const types: Record<string, string> = {
      csv: 'CSV Data',
      txt: 'Text File',
      mpt: 'BioLogic Data',
      dta: 'Gamry Data',
      xlsx: 'Excel File',
      xls: 'Excel File',
    };
    return types[ext || ''] || 'Unknown';
  };

  const getTypeColor = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const colors: Record<string, string> = {
      csv: 'text-green-400 bg-green-500/10',
      txt: 'text-slate-400 bg-slate-500/10',
      mpt: 'text-blue-400 bg-blue-500/10',
      dta: 'text-purple-400 bg-purple-500/10',
      xlsx: 'text-emerald-400 bg-emerald-500/10',
    };
    return colors[ext || ''] || 'text-slate-400 bg-slate-500/10';
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-slate-600 hover:border-slate-500'}
        `}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className={`w-10 h-10 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-slate-500'}`} />
        <p className="text-white font-medium mb-1">
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-slate-400 text-sm mb-2">
          or click to browse
        </p>
        <p className="text-slate-500 text-xs">
          Supported: CSV, TXT, MPT (BioLogic), DTA (Gamry), XLSX
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg"
            >
              <div className={`p-2 rounded-lg ${getTypeColor(file.name)}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{file.name}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{formatSize(file.size)}</span>
                  <span>•</span>
                  <span>{getFileType(file.name)}</span>
                </div>
                {file.status === 'uploading' && (
                  <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {file.status === 'uploading' && (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                )}
                {file.status === 'success' && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
