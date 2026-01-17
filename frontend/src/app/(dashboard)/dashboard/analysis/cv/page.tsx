'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileUpload } from '@/components/FileUpload';
import { 
  ArrowLeft, 
  Zap, 
  Play, 
  Download, 
  Settings,
  Loader2,
  CheckCircle
} from 'lucide-react';

export default function CVAnalysisPage() {
  const [step, setStep] = useState<'upload' | 'configure' | 'results'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [config, setConfig] = useState({
    scanRate: '50',
    area: '0.196',
    peakDetection: true,
    calculateDiffusion: true,
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    setStep('results');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/analysis"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-400" />
            Cyclic Voltammetry Analysis
          </h1>
          <p className="text-slate-400">Upload CV data and extract electrochemical parameters</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4">
        {['Upload Data', 'Configure', 'Results'].map((label, i) => {
          const stepNum = i + 1;
          const steps = { upload: 1, configure: 2, results: 3 };
          const currentStep = steps[step];
          const isActive = stepNum === currentStep;
          const isComplete = stepNum < currentStep;
          
          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${isComplete ? 'bg-green-500 text-white' : 
                  isActive ? 'bg-primary text-white' : 
                  'bg-slate-700 text-slate-400'}
              `}>
                {isComplete ? <CheckCircle className="w-5 h-5" /> : stepNum}
              </div>
              <span className={`text-sm ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {label}
              </span>
              {i < 2 && (
                <div className={`flex-1 h-0.5 ${isComplete ? 'bg-green-500' : 'bg-slate-700'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Upload CV Data</h2>
            <FileUpload accept=".csv,.txt,.mpt,.dta" />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => setStep('configure')}
              className="flex items-center gap-2 px-6 py-2 rounded-lg synapse-gradient text-white font-medium hover:opacity-90"
            >
              Continue <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Configure */}
      {step === 'configure' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Analysis Parameters
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Scan Rate (mV/s)
                </label>
                <input
                  type="number"
                  value={config.scanRate}
                  onChange={(e) => setConfig({ ...config, scanRate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Electrode Area (cm²)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={config.area}
                  onChange={(e) => setConfig({ ...config, area: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.peakDetection}
                  onChange={(e) => setConfig({ ...config, peakDetection: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-primary focus:ring-primary"
                />
                <span className="text-slate-300">Automatic peak detection</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.calculateDiffusion}
                  onChange={(e) => setConfig({ ...config, calculateDiffusion: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-primary focus:ring-primary"
                />
                <span className="text-slate-300">Calculate diffusion coefficient (Randles-Sevcik)</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setStep('upload')}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              ← Back
            </button>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-6 py-2 rounded-lg synapse-gradient text-white font-medium hover:opacity-90 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Analysis
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 'results' && (
        <div className="space-y-6">
          {/* CV Plot */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Cyclic Voltammogram</h2>
              <button className="flex items-center gap-2 px-3 py-1 text-sm text-slate-300 hover:text-white border border-slate-600 rounded-lg hover:bg-slate-700">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            
            {/* SVG CV Chart */}
            <div className="aspect-video bg-slate-900 rounded-lg border border-slate-700 p-4">
              <svg viewBox="0 0 400 250" className="w-full h-full">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 25" fill="none" stroke="#334155" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="360" height="200" x="30" y="10" fill="url(#grid)" />
                
                {/* Axes */}
                <line x1="30" y1="110" x2="390" y2="110" stroke="#64748b" strokeWidth="1" />
                <line x1="210" y1="10" x2="210" y2="210" stroke="#64748b" strokeWidth="1" />
                
                {/* CV Curve - realistic butterfly shape */}
                <path 
                  d="M 50 110 
                     Q 80 110, 100 95
                     Q 140 60, 180 40
                     Q 200 30, 220 45
                     Q 260 70, 300 90
                     Q 340 105, 360 110
                     Q 340 115, 300 130
                     Q 260 160, 220 180
                     Q 200 195, 180 180
                     Q 140 155, 100 130
                     Q 80 120, 50 110"
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="2"
                />
                
                {/* Peak markers */}
                <circle cx="180" cy="40" r="4" fill="#22c55e" />
                <text x="185" y="35" className="text-xs" fill="#22c55e">Epa</text>
                <circle cx="220" cy="180" r="4" fill="#ef4444" />
                <text x="225" y="190" className="text-xs" fill="#ef4444">Epc</text>
                
                {/* Axis labels */}
                <text x="200" y="240" className="text-xs" fill="#94a3b8" textAnchor="middle">Potential (V vs. Ref)</text>
                <text x="15" y="115" className="text-xs" fill="#94a3b8" transform="rotate(-90, 15, 115)">Current (mA)</text>
                
                {/* Scale values */}
                <text x="50" y="225" className="text-xs" fill="#64748b">-0.5</text>
                <text x="200" y="225" className="text-xs" fill="#64748b">0</text>
                <text x="355" y="225" className="text-xs" fill="#64748b">0.8</text>
              </svg>
            </div>
          </div>

          {/* Results Table */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Peak Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Anodic Peak Potential (Epa)</span>
                  <span className="text-white font-mono">0.45 V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cathodic Peak Potential (Epc)</span>
                  <span className="text-white font-mono">0.32 V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Peak Separation (ΔEp)</span>
                  <span className="text-white font-mono">130 mV</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Anodic Peak Current (Ipa)</span>
                  <span className="text-white font-mono">2.34 mA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cathodic Peak Current (Ipc)</span>
                  <span className="text-white font-mono">-2.21 mA</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Calculated Parameters</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">|Ipa/Ipc| Ratio</span>
                  <span className="text-white font-mono">1.06</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">E1/2 (Half-wave potential)</span>
                  <span className="text-white font-mono">0.385 V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Diffusion Coefficient (D)</span>
                  <span className="text-white font-mono">2.3×10⁻⁶ cm²/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reversibility</span>
                  <span className="text-green-400 font-medium">Quasi-reversible</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep('configure')}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              ← Adjust Parameters
            </button>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-600 rounded-lg text-white hover:bg-slate-800">
                <Download className="w-4 h-4" />
                Export Results
              </button>
              <Link
                href="/dashboard/experiments"
                className="flex items-center gap-2 px-4 py-2 rounded-lg synapse-gradient text-white font-medium hover:opacity-90"
              >
                Save to Experiment
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
