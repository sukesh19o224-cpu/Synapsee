'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { 
  Plus, 
  Search, 
  Filter,
  FlaskConical,
  MoreVertical,
  Calendar,
  FileText,
  Loader2
} from 'lucide-react';

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Fetch experiments from Appwrite
  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.EXPERIMENTS,
          [Query.orderDesc('createdAt'), Query.limit(50)]
        );
        setExperiments(response.documents);
      } catch (error) {
        console.error('Failed to fetch experiments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExperiments();
  }, []);

  // Filter experiments by search and type
  const filteredExperiments = experiments.filter(exp => {
    const matchesSearch = exp.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || exp.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Experiments</h1>
          <p className="text-slate-400">Manage your research experiments</p>
        </div>
        <Link
          href="/dashboard/experiments/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg synapse-gradient text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Experiment
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="cv">Cyclic Voltammetry</option>
            <option value="eis">EIS</option>
            <option value="chronoamperometry">Chronoamperometry</option>
            <option value="gitt">GITT</option>
          </select>
          <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Experiments List or Empty State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filteredExperiments.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <FlaskConical className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No experiments yet</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Create your first experiment to start tracking and analyzing your electrochemistry research.
          </p>
          <Link
            href="/dashboard/experiments/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg synapse-gradient text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Create Your First Experiment
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredExperiments.map((experiment) => (
            <Link
              key={experiment.$id}
              href={`/dashboard/experiments/${experiment.$id}`}
              className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FlaskConical className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{experiment.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(experiment.createdAt).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700">
                      {experiment.type || 'custom'}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-400">
                      {experiment.status || 'draft'}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </button>
            </Link>
          ))}
        </div>
      )}

      {/* Template Cards */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Start Templates</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Cyclic Voltammetry', color: 'blue', desc: 'Standard CV experiment' },
            { name: 'EIS', color: 'green', desc: 'Impedance spectroscopy' },
            { name: 'Chronoamperometry', color: 'purple', desc: 'Time-based current' },
            { name: 'GITT/PITT', color: 'orange', desc: 'Diffusion analysis' },
          ].map((template) => (
            <Link
              key={template.name}
              href={`/dashboard/experiments/new?template=${template.name.toLowerCase().replace(/ /g, '-')}`}
              className={`p-4 rounded-xl border bg-${template.color}-500/5 border-${template.color}-500/20 hover:border-${template.color}-500/40 transition-colors`}
            >
              <h3 className={`text-${template.color}-400 font-medium mb-1`}>{template.name}</h3>
              <p className="text-slate-500 text-sm">{template.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
