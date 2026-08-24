'use client';
import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppCard from '../../components/AppCard';
import { ALL_APPS, DEFAULT_CATEGORIES, AppItem } from '../../lib/catalogData';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredResults = useMemo(() => {
    const qLower = query.toLowerCase().trim();
    return ALL_APPS.filter((app) => {
      if (selectedCategory !== 'all' && app.category !== selectedCategory) {
        return false;
      }
      if (!qLower) return true;
      return (
        app.name.toLowerCase().includes(qLower) ||
        app.description.toLowerCase().includes(qLower) ||
        app.category.toLowerCase().includes(qLower)
      );
    });
  }, [query, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header & Search Input */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Software Search
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Find Any Windows Application
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Search by software name, description, or category to select and install.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <svg className="absolute left-4 h-5 w-5 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for an app (e.g. VLC, Chrome, VS Code, Blender)..." 
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-gray-900/90 border border-gray-800 focus:border-blue-500/80 focus:ring-4 focus:ring-blue-500/10 outline-none text-white text-sm shadow-xl placeholder-gray-500 transition-all"
            autoFocus
          />
          <button 
            type="submit" 
            className="absolute right-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow transition-all hover:scale-105"
          >
            Search
          </button>
        </form>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900/80 text-gray-400 hover:text-gray-200 border border-gray-800'
            }`}
          >
            All ({ALL_APPS.length})
          </button>
          {DEFAULT_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'all' : cat.name)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-900/80 text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3 mb-6">
        <h2 className="text-sm font-semibold text-gray-300">
          Showing {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
          {query ? ` for "${query}"` : ''}
          {selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}
        </h2>
        {(query || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Results Grid */}
      {filteredResults.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No software found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {filteredResults.map((app) => (
            <div key={app.slug} className="flex flex-col">
              <AppCard slug={app.slug} name={app.name} description={app.description} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-[1400px] mx-auto px-4 py-12 text-center text-gray-500">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
