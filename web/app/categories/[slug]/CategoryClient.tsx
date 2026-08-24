'use client';
import { useState, useEffect } from 'react';
import AppCard from '../../../components/AppCard';
import { DEFAULT_CATEGORIES, CategoryData } from '../../../lib/catalogData';

export default function CategoryClient({ slug }: { slug: string }) {
  const fallbackCategory = DEFAULT_CATEGORIES.find((c) => c.slug === slug) || null;
  const [category, setCategory] = useState<CategoryData | null>(fallbackCategory);
  const [isLoading, setIsLoading] = useState(!fallbackCategory);

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
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      {isLoading ? (
        <div className="text-center py-20 text-gray-500">Loading category...</div>
      ) : !category ? (
        <div className="text-center py-20 text-red-500 text-xl font-bold">Category not found</div>
      ) : (
        <>
          <div className="mb-10 border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
            <p className="text-gray-500">Select the apps you want to install from this category.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.apps.map(app => (
              <div key={app.slug} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <AppCard slug={app.slug} name={app.name} />
                <p className="text-xs text-gray-500 mt-2 ml-7 line-clamp-2">{app.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
