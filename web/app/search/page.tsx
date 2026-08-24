'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppCard from '../../components/AppCard';

type AppData = {
  slug: string;
  name: string;
  description: string;
  category: string;
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<AppData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasSearched = Boolean(initialQuery.trim());

  useEffect(() => {
    if (!initialQuery.trim()) {
      return;
    }
    let isMounted = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    
    Promise.resolve().then(() => {
      if (isMounted) setIsLoading(true);
    });

    fetch(`${apiUrl}/api/v1/catalog/search?q=${encodeURIComponent(initialQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setResults(Array.isArray(data) ? data : []);
        }
      })
      .catch((e) => {
        console.error(e);
        if (isMounted) setResults([]);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Software</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for an app (e.g. VLC, Chrome)..." 
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm text-lg"
          />
          <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow transition-colors">
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500">Searching...</div>
      ) : hasSearched && results.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">No software found matching &quot;{initialQuery}&quot;</div>
      ) : hasSearched ? (
        <div>
          <h2 className="text-xl font-semibold mb-6 border-b border-gray-200 pb-2">Results for &quot;{initialQuery}&quot; ({results.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map(app => (
              <div key={app.slug} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <AppCard slug={app.slug} name={app.name} />
                <div className="mt-2 ml-7">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{app.category}</span>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{app.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
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
