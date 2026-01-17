import Link from 'next/link';
import { 
  FlaskConical, 
  BarChart3, 
  FileText, 
  Search, 
  GitFork,
  ArrowRight,
  Zap,
  Shield,
  Database
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg synapse-gradient flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Synapse</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="text-primary text-sm font-medium">
              🧪 Built for Electrochemistry Research
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Research That's{' '}
            <span className="bg-clip-text text-transparent synapse-gradient">
              Reproducible
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            A unified platform that combines lab notebooks, data analysis, 
            and AI-powered search. Never lose an experiment again.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="px-8 py-4 rounded-lg synapse-gradient text-white font-semibold text-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Start Your Lab <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/demo" 
              className="px-8 py-4 rounded-lg border border-slate-600 text-white font-semibold text-lg hover:bg-slate-800 transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Everything You Need in One Place
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard 
            icon={<FlaskConical className="w-8 h-8" />}
            title="Electronic Lab Notebook"
            description="Track experiments with templates for CV, EIS, and more. Powered by eLabFTW."
            color="blue"
          />
          <FeatureCard 
            icon={<BarChart3 className="w-8 h-8" />}
            title="Data Analysis"
            description="Analyze CV, EIS data with MADAP. Interactive plots and automated peak detection."
            color="green"
          />
          <FeatureCard 
            icon={<FileText className="w-8 h-8" />}
            title="Document Editing"
            description="Edit Excel, Word, PDF files directly in browser with ONLYOFFICE."
            color="purple"
          />
          <FeatureCard 
            icon={<Search className="w-8 h-8" />}
            title="AI-Powered Search"
            description="Ask questions about your experiments. Get answers with citations."
            color="orange"
          />
          <FeatureCard 
            icon={<GitFork className="w-8 h-8" />}
            title="AI Diagrams"
            description="Turn methods into flowcharts instantly with AI diagram generation."
            color="pink"
          />
          <FeatureCard 
            icon={<Database className="w-8 h-8" />}
            title="FAIR Data Export"
            description="Export reproducible data packages. Get DOIs for your datasets."
            color="cyan"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">80%</div>
            <div className="text-slate-400">of research data is lost within 20 years</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">70%</div>
            <div className="text-slate-400">of researchers can't reproduce their own work</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-slate-400">of your data stays reproducible with Synapse</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <p>© 2026 Synapse. Open source under MIT License.</p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'cyan';
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  return (
    <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors">
      <div className={`w-14 h-14 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4 border`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}
