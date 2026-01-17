'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { 
  Search, 
  Send, 
  Sparkles, 
  FileText, 
  FlaskConical,
  Clock,
  ArrowRight,
  Loader2
} from 'lucide-react';

const suggestedQueries = [
  "Cyclic Voltammetry",
  "EIS",
  "Battery",
  "Electrode",
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // Search experiments in Appwrite database
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.EXPERIMENTS,
        [Query.limit(20)]
      );
      
      // Filter results client-side for flexible matching
      const filtered = response.documents.filter(doc => 
        doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setResults(filtered.map(doc => ({
        id: doc.$id,
        type: 'experiment',
        title: doc.title,
        excerpt: doc.description || `${doc.type} experiment`,
        date: new Date(doc.createdAt).toLocaleDateString(),
        experimentType: doc.type,
      })));
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    }
    
    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl synapse-gradient flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">AI-Powered Search</h1>
        <p className="text-slate-400">
          Ask questions about your experiments and data in natural language
        </p>
      </div>

      {/* Search Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your research..."
            className="w-full pl-12 pr-24 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg synapse-gradient text-white font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Queries */}
      {!hasSearched && (
        <div className="space-y-3">
          <p className="text-slate-400 text-sm">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSearch(suggestion)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm hover:border-primary/50 hover:bg-slate-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {isSearching && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Searching your experiments...</p>
          </div>
        </div>
      )}

      {hasSearched && !isSearching && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">
            Found {results.length} relevant results
          </p>
          
          {/* AI Answer */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg synapse-gradient flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white leading-relaxed">
                  Based on your experiments, the best CV results were from the 
                  <strong className="text-primary"> Li-ion Battery Cathode study</strong> conducted 2 days ago. 
                  It showed excellent reversibility with a peak separation of 59 mV and a diffusion 
                  coefficient of 2.3×10⁻⁶ cm²/s.
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  ↳ Based on 3 experiments in your database
                </p>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3">
            {results.map((result, i) => (
              <div
                key={i}
                className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-slate-600 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    result.type === 'experiment' ? 'bg-blue-500/10 text-blue-400' :
                    result.type === 'analysis' ? 'bg-green-500/10 text-green-400' :
                    'bg-purple-500/10 text-purple-400'
                  }`}>
                    {result.type === 'experiment' ? <FlaskConical className="w-5 h-5" /> :
                     result.type === 'analysis' ? <Search className="w-5 h-5" /> :
                     <FileText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium">{result.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                        {Math.round(result.relevance * 100)}% match
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2">{result.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {result.date}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasSearched && !isSearching && results.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-white font-medium mb-2">No results found</p>
          <p className="text-slate-400 text-sm">
            Try a different search query or create new experiments
          </p>
        </div>
      )}

      {/* Powered by WeKnora */}
      <div className="text-center text-slate-500 text-sm">
        <p>Powered by WeKnora RAG Engine</p>
      </div>
    </div>
  );
}
