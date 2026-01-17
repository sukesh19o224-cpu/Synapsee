'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Zap, 
  Activity, 
  Upload,
  ArrowRight,
  Play,
  FileText
} from 'lucide-react';

const analysisTypes = [
  {
    id: 'cv',
    name: 'Cyclic Voltammetry',
    icon: Zap,
    color: 'blue',
    description: 'Analyze CV data: peak detection, current extraction, reversibility',
    features: ['Peak detection', 'Current analysis', 'Randles-Sevcik', 'Diffusion coefficient'],
  },
  {
    id: 'eis',
    name: 'EIS Analysis',
    icon: Activity,
    color: 'green',
    description: 'Impedance spectroscopy: Nyquist plots, Bode diagrams, circuit fitting',
    features: ['Nyquist plot', 'Bode plot', 'Equivalent circuit', 'R, C, W extraction'],
  },
  {
    id: 'chronoamperometry',
    name: 'Chronoamperometry',
    icon: BarChart3,
    color: 'purple',
    description: 'Time-current analysis: Cottrell equation, diffusion analysis',
    features: ['Cottrell analysis', 'Current decay', 'Diffusion coefficient'],
  },
];

const recentAnalyses: any[] = [];

export default function AnalysisPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Data Analysis</h1>
        <p className="text-slate-400">Analyze your electrochemical data with MADAP</p>
      </div>

      {/* Analysis Types */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Choose Analysis Type</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {analysisTypes.map((type) => (
            <Link
              key={type.id}
              href={`/dashboard/analysis/${type.id}`}
              className={`p-6 rounded-xl border transition-all hover:scale-[1.02] bg-${type.color}-500/5 border-${type.color}-500/20 hover:border-${type.color}-500/50`}
            >
              <div className={`w-12 h-12 rounded-lg bg-${type.color}-500/20 flex items-center justify-center mb-4`}>
                <type.icon className={`w-6 h-6 text-${type.color}-400`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{type.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{type.description}</p>
              <div className="flex flex-wrap gap-1">
                {type.features.map((feature) => (
                  <span 
                    key={feature}
                    className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-300"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Analyses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Analyses</h2>
        </div>
        
        {recentAnalyses.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
            <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No analyses yet</h3>
            <p className="text-slate-400 mb-4">
              Upload data and run your first analysis
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recentAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{analysis.name}</p>
                    <p className="text-slate-400 text-sm">{analysis.date}</p>
                  </div>
                </div>
                <Link
                  href={`/dashboard/analysis/results/${analysis.id}`}
                  className="flex items-center gap-1 text-primary hover:underline text-sm"
                >
                  View results <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Upload */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Quick Analysis</h3>
            <p className="text-slate-400 text-sm">
              Upload a data file to automatically detect the type and start analysis
            </p>
          </div>
          <Link
            href="/dashboard/analysis/quick"
            className="flex items-center gap-2 px-4 py-2 rounded-lg synapse-gradient text-white font-medium hover:opacity-90"
          >
            <Play className="w-4 h-4" />
            Start
          </Link>
        </div>
      </div>
    </div>
  );
}
