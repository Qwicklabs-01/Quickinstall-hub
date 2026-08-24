'use client';
import { useState, useEffect } from 'react';
import AppCard from '../../../components/AppCard';
import { DEFAULT_CATEGORIES, CategoryData } from '../../../lib/catalogData';
import { useSelection } from '../../context/SelectionContext';
import Link from 'next/link';

export default function CategoryClient({ slug }: { slug: string }) {
  const fallbackCategory = DEFAULT_CATEGORIES.find((c) => c.slug === slug) || null;
  const [category, setCategory] = useState<CategoryData | null>(fallbackCategory);
  const { toggleCategory, selectedApps } = useSelection();

  useEffect(() => {
    let isMounted = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      fetch(`${apiUrl}/api/v1/catalog/categories/${slug}`)
        .then((res) => {
          if (!res.ok) throw new Error("Category not found");
          return res.json();
        })
        .then((data) => {
          if (isMounted && data) setCategory(data);
        })
        .catch(() => {
          // Fallback to static data
        });
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!category) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-400 mb-2">Category Not Found</h1>
        <p className="text-gray-400 mb-6">The category you requested does not exist.</p>
        <Link href="/" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const allSelected = category.apps.every((app) => selectedApps.has(app.slug));

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Category Breadcrumb & Header */}
      <div className="mb-8 border-b border-gray-800/80 pb-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Link href="/" className="hover:text-gray-300 transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-blue-400 font-medium">{category.name}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{category.name}</h1>
            <p className="text-gray-400 text-sm mt-1">
              Select applications to add to your QuickInstall custom package ({category.apps.length} available)
            </p>
          </div>

          <button
            onClick={() => toggleCategory(category.apps)}
            className={`self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              allSelected
                ? 'bg-gray-800 hover:bg-gray-700 text-red-300 border border-gray-700'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:scale-105'
            }`}
          >
            {allSelected ? '✕ Deselect All' : '✓ Select All in Category'}
          </button>
        </div>
      </div>

      {/* Grid of Apps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {category.apps.map((app) => (
          <div key={app.slug} className="flex flex-col">
            <AppCard
              slug={app.slug}
              name={app.name}
              description={app.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
