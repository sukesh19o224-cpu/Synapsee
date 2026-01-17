'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { useAuth } from '@/stores/auth';
import { 
  FlaskConical, 
  BarChart3, 
  FileText, 
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [experimentCount, setExperimentCount] = useState(0);
  const [recentExperiments, setRecentExperiments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.EXPERIMENTS,
          [Query.orderDesc('createdAt'), Query.limit(5)]
        );
        setExperimentCount(response.total);
        setRecentExperiments(response.documents);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Experiments', value: experimentCount.toString(), icon: FlaskConical, color: 'blue' },
    { label: 'Data Files', value: '0', icon: FileText, color: 'green' },
    { label: 'Analyses', value: '0', icon: BarChart3, color: 'purple' },
    { label: 'Searches', value: '0', icon: Search, color: 'orange' },
  ];

  const quickActions = [
    { label: 'New Experiment', href: '/dashboard/experiments/new', icon: FlaskConical },
    { label: 'Upload Data', href: '/dashboard/experiments?upload=true', icon: Plus },
    { label: 'Run Analysis', href: '/dashboard/analysis', icon: BarChart3 },
    { label: 'AI Search', href: '/dashboard/search', icon: Search },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'Researcher'}!
        </h1>
        <p className="text-slate-400 mt-1">
          Here's what's happening in your lab today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div 
            key={stat.label}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-slate-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-primary/50 hover:bg-slate-800 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <action.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-white font-medium group-hover:text-primary transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Experiments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Experiments</h2>
          <Link 
            href="/dashboard/experiments"
            className="text-primary hover:underline flex items-center gap-1 text-sm"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl">
          <div className="p-8 text-center">
            <FlaskConical className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No experiments yet</h3>
            <p className="text-slate-400 mb-4">
              Create your first experiment to start tracking your research
            </p>
            <Link
              href="/dashboard/experiments/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg synapse-gradient text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Create Experiment
            </Link>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Getting Started
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
              1
            </div>
            <div>
              <h3 className="text-white font-medium">Create an Experiment</h3>
              <p className="text-slate-400 text-sm">
                Use templates for CV, EIS, or create custom experiments
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
              2
            </div>
            <div>
              <h3 className="text-white font-medium">Upload Your Data</h3>
              <p className="text-slate-400 text-sm">
                Import .mpt, .dta, .csv files from your instruments
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
              3
            </div>
            <div>
              <h3 className="text-white font-medium">Analyze & Document</h3>
              <p className="text-slate-400 text-sm">
                Run analysis, generate plots, and write reports
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
