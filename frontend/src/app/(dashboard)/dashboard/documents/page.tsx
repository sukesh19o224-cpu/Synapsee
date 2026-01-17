'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ID } from 'appwrite';
import { storage, BUCKETS } from '@/lib/appwrite';
import { 
  FileText, 
  Plus, 
  Search, 
  FolderOpen,
  FileSpreadsheet,
  File,
  FileImage,
  MoreVertical,
  Upload,
  Loader2,
  Download,
  Trash2
} from 'lucide-react';

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'xlsx':
    case 'xls':
    case 'csv':
      return FileSpreadsheet;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return FileImage;
    default:
      return FileText;
  }
};

const getFileColor = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'xlsx':
    case 'xls':
      return 'text-green-400 bg-green-500/10';
    case 'csv':
      return 'text-emerald-400 bg-emerald-500/10';
    case 'pdf':
      return 'text-red-400 bg-red-500/10';
    case 'docx':
    case 'doc':
      return 'text-blue-400 bg-blue-500/10';
    default:
      return 'text-slate-400 bg-slate-500/10';
  }
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await storage.listFiles(BUCKETS.DATA_FILES);
      setDocuments(response.files);
    } catch (error) {
      console.log('Storage bucket not found - create data-files bucket in Appwrite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      await storage.createFile(BUCKETS.DATA_FILES, ID.unique(), file);
      await fetchDocuments();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Make sure you created data-files bucket in Appwrite.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (fileId: string, fileName: string) => {
    const url = storage.getFileDownload(BUCKETS.DATA_FILES, fileId);
    window.open(url.toString(), '_blank');
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Delete this file?')) return;
    try {
      await storage.deleteFile(BUCKETS.DATA_FILES, fileId);
      await fetchDocuments();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept=".csv,.xlsx,.xls,.pdf,.docx,.doc,.txt,.mpt,.dta"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Documents</h1>
          <p className="text-slate-400">Reports, spreadsheets, and data files ({documents.length})</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 border border-slate-600 rounded-lg text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Quick Create */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'New Report', icon: FileText, color: 'blue', type: 'docx' },
          { name: 'New Spreadsheet', icon: FileSpreadsheet, color: 'green', type: 'xlsx' },
          { name: 'From Template', icon: FolderOpen, color: 'purple', type: 'template' },
          { name: 'Upload File', icon: Upload, color: 'orange', type: 'upload' },
        ].map((item) => (
          <button
            key={item.name}
            className={`p-4 rounded-xl border bg-${item.color}-500/5 border-${item.color}-500/20 hover:border-${item.color}-500/50 transition-all text-left`}
          >
            <item.icon className={`w-8 h-8 text-${item.color}-400 mb-2`} />
            <p className="text-white font-medium">{item.name}</p>
          </button>
        ))}
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No documents yet</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Create reports, spreadsheets, or upload existing documents to get started.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg synapse-gradient text-white font-medium hover:opacity-90">
            <Plus className="w-5 h-5" />
            Create Your First Document
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {documents.map((doc) => {
            const Icon = getFileIcon(doc.type);
            return (
              <div
                key={doc.id}
                className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${getFileColor(doc.type)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <button className="p-1 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-white font-medium truncate">{doc.name}</p>
                <p className="text-slate-400 text-sm">{doc.date}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* ONLYOFFICE Info */}
      <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Powered by ONLYOFFICE</h3>
            <p className="text-slate-400 text-sm">
              Edit Excel, Word, and PDF files directly in your browser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
