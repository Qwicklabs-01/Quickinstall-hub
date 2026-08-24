'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type SelectionContextType = {
  selectedApps: Set<string>; // Storing slugs for fast lookup
  toggleApp: (appSlug: string, appName: string) => void;
  getSelectedCount: () => number;
  clearSelection: () => void;
  getAppSlugs: () => string[]; // To send to the backend which expects slugs
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  // We store a map of slug -> name so we can retrieve the names easily when submitting
  const [appMap, setAppMap] = useState<Map<string, string>>(new Map());
  
  const selectedApps = new Set(appMap.keys());

  const toggleApp = (slug: string, name: string) => {
    setAppMap(prev => {
      const newMap = new Map(prev);
      if (newMap.has(slug)) {
        newMap.delete(slug);
      } else {
        newMap.set(slug, name);
      }
      return newMap;
    });
  };

  const getSelectedCount = () => appMap.size;
  
  const clearSelection = () => setAppMap(new Map());
  
  const getAppSlugs = () => Array.from(selectedApps);

  return (
    <SelectionContext.Provider value={{ selectedApps, toggleApp, getSelectedCount, clearSelection, getAppSlugs }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}
