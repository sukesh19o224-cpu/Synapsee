'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileUpload } from '@/components/FileUpload';
import { 
  ArrowLeft, 
  Activity, 
  Play, 
  Download, 
  Settings,
  Loader2,
  CheckCircle
} from 'lucide-react';

const equivalentCircuits = [
  { id: 'randles', name: 'Randles Circuit', formula: 'R(QR)' },
  { id: 'randles-w', name: 'Randles + Warburg', formula: 'R(Q(RW))' },
  { id: 'coating', name: 'Coating Model', formula: 'R(Q(R(QR)))' },
  { id: 'custom', name: 'Custom Circuit', formula: 'Define your own' },
];

export default function EISAnalysisPage() {
  const [step, setStep] = useState<'upload' | 'configure' | 'results'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCircuit, setSelectedCircuit] = useState('randles');
  const [config, setConfig] = useState({
    freqMin: '0.01',
    freqMax: '100000',
    amplitude: '10',
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
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
            <Activity className="w-6 h-6 text-green-400" />
            EIS Analysis
          </h1>
          <p className="text-slate-400">Electrochemical Impedance Spectroscopy with circuit fitting</p>
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
            <h2 className="text-lg font-semibold text-white mb-4">Upload EIS Data</h2>
            <FileUpload accept=".csv,.txt,.mpt,.dta,.z" />
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
          {/* Equivalent Circuit Selection */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Select Equivalent Circuit</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {equivalentCircuits.map((circuit) => (
                <button
                  key={circuit.id}
                  onClick={() => setSelectedCircuit(circuit.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedCircuit === circuit.id
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <p className="text-white font-medium">{circuit.name}</p>
                  <p className="text-slate-400 text-sm font-mono">{circuit.formula}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Fitting Parameters
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Min Frequency (Hz)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={config.freqMin}
                  onChange={(e) => setConfig({ ...config, freqMin: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Max Frequency (Hz)
                </label>
                <input
                  type="number"
                  value={config.freqMax}
                  onChange={(e) => setConfig({ ...config, freqMax: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Amplitude (mV)
                </label>
                <input
                  type="number"
                  value={config.amplitude}
                  onChange={(e) => setConfig({ ...config, amplitude: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                />
              </div>
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
                  Fitting Circuit...
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
          {/* Plots */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Nyquist Plot */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Nyquist Plot</h2>
                <button className="text-slate-400 hover:text-white">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="aspect-square bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">-Z'' vs Z'</p>
                </div>
              </div>
            </div>

            {/* Bode Plot */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Bode Plot</h2>
                <button className="text-slate-400 hover:text-white">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="aspect-square bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">|Z| & Phase vs Frequency</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fitted Parameters */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Fitted Parameters - Randles Circuit R(QR)
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900 rounded-lg">
                <p className="text-slate-400 text-sm">Rs (Solution)</p>
                <p className="text-white text-xl font-mono">12.4 Ω</p>
                <p className="text-slate-500 text-xs">±0.2 Ω</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <p className="text-slate-400 text-sm">Rct (Charge Transfer)</p>
                <p className="text-white text-xl font-mono">245 Ω</p>
                <p className="text-slate-500 text-xs">±3.1 Ω</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <p className="text-slate-400 text-sm">CPE-Q</p>
                <p className="text-white text-xl font-mono">3.2×10⁻⁵</p>
                <p className="text-slate-500 text-xs">F·s^(n-1)</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <p className="text-slate-400 text-sm">CPE-n</p>
                <p className="text-white text-xl font-mono">0.85</p>
                <p className="text-slate-500 text-xs">±0.01</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Excellent fit quality: χ² = 2.3×10⁻⁴
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep('configure')}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              ← Try Different Circuit
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
