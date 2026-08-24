'use client';
import { useState, useEffect } from 'react';
import AppCard from '../components/AppCard';
import Link from 'next/link';
import { DEFAULT_CATEGORIES, CategoryData } from '../lib/catalogData';

export default function Home() {
  const [categories, setCategories] = useState<CategoryData[]>(DEFAULT_CATEGORIES);

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
        // Fallback to DEFAULT_CATEGORIES
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">1. Pick the apps you want</h1>
        <p className="text-gray-500">Select any applications below, then generate your custom installer.</p>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-8">
        {categories.map((category) => (
          <div key={category.slug} className="break-inside-avoid mb-8">
            <div className="border-b border-gray-200 pb-1 mb-3 flex justify-between items-baseline">
              <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
              <Link href={`/categories/${category.slug}`} className="text-xs text-blue-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              {category.apps.map(app => (
                <AppCard key={app.slug} slug={app.slug} name={app.name} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
