'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ID } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { 
  ArrowLeft, 
  FlaskConical, 
  Zap,
  Activity,
  Timer,
  Battery,
  Save,
  Loader2
} from 'lucide-react';

const templates = [
  {
    id: 'cv',
    name: 'Cyclic Voltammetry',
    icon: Zap,
    color: 'blue',
    description: 'Standard CV experiment with potential sweeps',
    fields: ['Scan Rate', 'Potential Range', 'Cycles', 'Working Electrode']
  },
  {
    id: 'eis',
    name: 'Electrochemical Impedance',
    icon: Activity,
    color: 'green',
    description: 'EIS measurement for impedance spectroscopy',
    fields: ['Frequency Range', 'Amplitude', 'DC Bias', 'Number of Points']
  },
  {
    id: 'chronoamperometry',
    name: 'Chronoamperometry',
    icon: Timer,
    color: 'purple',
    description: 'Time-based current measurement at fixed potential',
    fields: ['Applied Potential', 'Duration', 'Sample Interval']
  },
  {
    id: 'gitt',
    name: 'GITT/PITT',
    icon: Battery,
    color: 'orange',
    description: 'Galvanostatic/Potentiostatic intermittent titration',
    fields: ['Current/Potential Pulse', 'Pulse Duration', 'Rest Time', 'Cycles']
  },
];

export default function NewExperimentPage() {
  const router = useRouter();
  const [step, setStep] = useState<'template' | 'details'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sample: '',
    electrolyte: '',
    electrode: '',
    temperature: '25',
    notes: '',
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Create experiment in Appwrite database
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.EXPERIMENTS,
        ID.unique(),
        {
          title: formData.title,
          description: formData.description || '',
          type: selectedTemplate || 'custom',
          status: 'draft',
          createdAt: new Date().toISOString(),
        }
      );
      
      router.push('/dashboard/experiments');
    } catch (err: any) {
      console.error('Failed to create experiment:', err);
      setError(err.message || 'Failed to create experiment');
      setIsLoading(false);
    }
  };

  const template = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/experiments"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">New Experiment</h1>
          <p className="text-slate-400">
            {step === 'template' ? 'Choose a template to get started' : `Creating ${template?.name} experiment`}
          </p>
        </div>
      </div>

      {/* Step 1: Template Selection */}
      {step === 'template' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {templates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleTemplateSelect(tmpl.id)}
              className={`p-6 rounded-xl border text-left transition-all hover:scale-[1.02] bg-${tmpl.color}-500/5 border-${tmpl.color}-500/20 hover:border-${tmpl.color}-500/50`}
            >
              <div className={`w-12 h-12 rounded-lg bg-${tmpl.color}-500/20 flex items-center justify-center mb-4`}>
                <tmpl.icon className={`w-6 h-6 text-${tmpl.color}-400`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{tmpl.name}</h3>
              <p className="text-slate-400 text-sm mb-3">{tmpl.description}</p>
              <div className="flex flex-wrap gap-1">
                {tmpl.fields.slice(0, 3).map((field) => (
                  <span 
                    key={field}
                    className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-300"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </button>
          ))}
          
          {/* Custom Template Option */}
          <button
            onClick={() => {
              setSelectedTemplate('custom');
              setStep('details');
            }}
            className="p-6 rounded-xl border border-dashed border-slate-600 text-left transition-all hover:border-slate-500 hover:bg-slate-800/50"
          >
            <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center mb-4">
              <FlaskConical className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Custom Experiment</h3>
            <p className="text-slate-400 text-sm">Start from scratch with your own parameters</p>
          </button>
        </div>
      )}

      {/* Step 2: Experiment Details */}
      {step === 'details' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Experiment Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={`${template?.name || 'Experiment'} - ${new Date().toLocaleDateString()}`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Describe the purpose and goals of this experiment..."
              />
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Experimental Conditions</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Sample/Material
                </label>
                <input
                  type="text"
                  value={formData.sample}
                  onChange={(e) => setFormData({ ...formData, sample: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., LiFePO4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Electrolyte
                </label>
                <input
                  type="text"
                  value={formData.electrolyte}
                  onChange={(e) => setFormData({ ...formData, electrolyte: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 1M LiPF6 in EC/DMC"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Working Electrode
                </label>
                <input
                  type="text"
                  value={formData.electrode}
                  onChange={(e) => setFormData({ ...formData, electrode: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Glassy carbon"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="25"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Additional Notes</h2>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Any additional observations, safety notes, or special conditions..."
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep('template')}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              ← Back to templates
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title}
              className="flex items-center gap-2 px-6 py-2 rounded-lg synapse-gradient text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Experiment
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
