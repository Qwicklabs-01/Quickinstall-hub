'use client';
import { useState, useEffect } from 'react';
import AppCard from '../components/AppCard';
import Link from 'next/link';

type CategoryData = {
  name: string;
  slug: string;
  apps: { slug: string; name: string }[];
};

export default function Home() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/v1/catalog/apps`);
        const data = await res.json();
        setCategories(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      
      {/* Top Banner */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-semibold mb-2">1. Pick the apps you want</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500 text-xl">Loading catalog from database...</div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-8">
          {categories.map((category) => (
            <div key={category.slug} className="break-inside-avoid mb-8">
              <div className="border-b border-gray-200 pb-1 mb-3 flex justify-between items-baseline">
                <h2 className="text-lg font-semibold">{category.name}</h2>
                <Link href={`/categories/${category.slug}`} className="text-xs text-blue-500 hover:underline">
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
      )}

      {/* Note: The bottom download section has been moved to the persistent SelectionTray component */}
    </div>
  );
}
