'use client';

import { useState } from 'react';
import { 
  GitFork, 
  Plus, 
  Download, 
  Share2,
  Wand2,
  LayoutGrid,
  Loader2
} from 'lucide-react';

const templates = [
  { id: 'flowchart', name: 'Experiment Flowchart', icon: '🔬' },
  { id: 'process', name: 'Process Diagram', icon: '⚙️' },
  { id: 'comparison', name: 'Comparison Chart', icon: '📊' },
  { id: 'timeline', name: 'Timeline', icon: '📅' },
];

const diagrams: any[] = [];

export default function DiagramsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    // Would open AI Draw.io with generated diagram
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Diagrams</h1>
          <p className="text-slate-400">Create diagrams from text with AI assistance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg synapse-gradient text-white font-medium hover:opacity-90">
          <Plus className="w-4 h-4" />
          New Diagram
        </button>
      </div>

      {/* AI Generator */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Generate from Text</h2>
            <p className="text-slate-400 text-sm">Describe your diagram and AI will create it</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Example: Create a flowchart showing the cyclic voltammetry process: prepare electrode → add electrolyte → connect potentiostat → run CV scan → analyze peaks"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-purple-500 text-white font-medium hover:bg-purple-600 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate Diagram
              </>
            )}
          </button>
        </div>
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Start from Template</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors text-left"
            >
              <div className="text-4xl mb-3">{template.icon}</div>
              <p className="text-white font-medium">{template.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Diagrams */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Your Diagrams</h2>
        
        {diagrams.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
            <GitFork className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No diagrams yet</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Create your first diagram using AI or start from a template
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {diagrams.map((diagram) => (
              <div
                key={diagram.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors cursor-pointer group"
              >
                <div className="aspect-video bg-slate-900 flex items-center justify-center">
                  <LayoutGrid className="w-12 h-12 text-slate-700" />
                </div>
                <div className="p-4">
                  <p className="text-white font-medium">{diagram.name}</p>
                  <p className="text-slate-400 text-sm">{diagram.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Powered by */}
      <div className="text-center text-slate-500 text-sm">
        <p>Powered by next-ai-draw-io</p>
      </div>
    </div>
  );
}
