'use client';
import { useState, useEffect, useMemo } from 'react';
import AppCard from '../components/AppCard';
import Link from 'next/link';
import { DEFAULT_CATEGORIES, CategoryData } from '../lib/catalogData';
import { useSelection } from './context/SelectionContext';

// Category icons mapping
const CATEGORY_ICONS: Record<string, string> = {
  'web-browsers': '🌐',
  'messaging': '💬',
  'media': '🎬',
  'developer-tools': '⚡',
  'runtimes': '☕',
  'adobe-creative-cloud': '🎨',
  'imaging-and-design': '🖼️',
  'documents-and-notes': '📄',
  'download-managers': '📥',
  'audio-and-music': '🎵',
  'operating-systems': '💻',
  'windows-utilities': '🛠️',
  'mac-essentials': '🍎',
  'gaming': '🎮',
  'security-and-passwords': '🔒',
  'online-storage': '☁️',
  'compression': '📦',
  'file-sharing': '🔄',
};

export default function Home() {
  const [categories, setCategories] = useState<CategoryData[]>(DEFAULT_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { toggleCategory, selectedApps } = useSelection();

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return;
        const res = await fetch(`${apiUrl}/api/v1/catalog/apps`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setCategories(data);
          }
        }
      } catch {
        // Fallback to static catalog
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered categories based on search and active category filter
  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return categories
      .map((cat) => {
        if (activeCategory !== 'all' && cat.slug !== activeCategory) {
          return null;
        }
        if (!query) return cat;

        const matchingApps = cat.apps.filter(
          (app) =>
            app.name.toLowerCase().includes(query) ||
            app.description.toLowerCase().includes(query) ||
            cat.name.toLowerCase().includes(query)
        );

        if (matchingApps.length === 0) return null;
        return {
          ...cat,
          apps: matchingApps,
        };
      })
      .filter((cat): cat is CategoryData => cat !== null);
  }, [categories, searchQuery, activeCategory]);

  const totalAppCount = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.apps.length, 0);
  }, [categories]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Hero Section */}
      <div className="relative mb-14 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          Fast • Silent • 100% Free & Open Source
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
          Install & Update Your Software <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            In A Single Click
          </span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8">
          Pick your favorite apps below. QuickInstall generates one trusted, cryptographically signed installer that downloads and installs everything silently without bundled bloatware.
        </p>

        {/* Live Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="relative flex items-center">
            <svg className="absolute left-4 h-5 w-5 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${totalAppCount}+ applications (e.g. Chrome, VLC, VS Code, Blender)...`}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-gray-900/90 border border-gray-800 focus:border-blue-500/80 focus:ring-4 focus:ring-blue-500/10 outline-none text-white text-sm shadow-xl placeholder-gray-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-gray-500 hover:text-gray-300 text-sm font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-900/80 text-gray-400 hover:text-gray-200 border border-gray-800'
            }`}
          >
            All Categories ({totalAppCount})
          </button>
          {categories.slice(0, 8).map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(activeCategory === cat.slug ? 'all' : cat.slug)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.slug
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-900/80 text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              {CATEGORY_ICONS[cat.slug] || '📁'} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Categories and Applications */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No applications found matching &quot;{searchQuery}&quot;
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 [column-fill:_balance]">
          {filteredCategories.map((category) => {
            const allCategorySelected = category.apps.every((app) => selectedApps.has(app.slug));
            const categoryIcon = CATEGORY_ICONS[category.slug] || '📁';

            return (
              <div
                key={category.slug}
                className="break-inside-avoid mb-6 rounded-2xl bg-[#111827]/60 border border-gray-800/80 p-4 shadow-sm hover:border-gray-700/80 transition-all"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-gray-800/80 pb-2.5 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">{categoryIcon}</span>
                    <h2 className="text-sm font-bold text-gray-100 truncate" title={category.name}>
                      {category.name}
                    </h2>
                  </div>

                  {/* Category Action: Select All / Clear */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleCategory(category.apps)}
                      className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors px-1.5 py-0.5 rounded hover:bg-blue-500/10"
                    >
                      {allCategorySelected ? 'Clear' : 'Select all'}
                    </button>
                    <span className="text-gray-600">•</span>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-[11px] text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>

                {/* Application Items */}
                <div className="flex flex-col gap-1.5">
                  {category.apps.map((app) => (
                    <AppCard
                      key={app.slug}
                      slug={app.slug}
                      name={app.name}
                      description={app.description}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
