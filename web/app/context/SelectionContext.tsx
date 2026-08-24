'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export type SelectedApp = {
  slug: string;
  name: string;
};

type SelectionContextType = {
  selectedApps: Set<string>;
  selectedAppList: SelectedApp[];
  toggleApp: (appSlug: string, appName: string) => void;
  toggleCategory: (apps: SelectedApp[]) => void;
  removeApp: (slug: string) => void;
  getSelectedCount: () => number;
  clearSelection: () => void;
  getAppSlugs: () => string[];
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [appMap, setAppMap] = useState<Map<string, string>>(new Map());
  
  const selectedApps = new Set(appMap.keys());
  
  const selectedAppList: SelectedApp[] = Array.from(appMap.entries()).map(([slug, name]) => ({
    slug,
    name,
  }));

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

  const removeApp = (slug: string) => {
    setAppMap(prev => {
      const newMap = new Map(prev);
      newMap.delete(slug);
      return newMap;
    });
  };

  const toggleCategory = (apps: SelectedApp[]) => {
    setAppMap(prev => {
      const newMap = new Map(prev);
      const allSelected = apps.every(app => newMap.has(app.slug));
      
      if (allSelected) {
        // Unselect all in this category
        apps.forEach(app => newMap.delete(app.slug));
      } else {
        // Select all in this category
        apps.forEach(app => newMap.set(app.slug, app.name));
      }
      return newMap;
    });
  };

  const getSelectedCount = () => appMap.size;
  
  const clearSelection = () => setAppMap(new Map());
  
  const getAppSlugs = () => Array.from(selectedApps);

  return (
    <SelectionContext.Provider value={{
      selectedApps,
      selectedAppList,
      toggleApp,
      toggleCategory,
      removeApp,
      getSelectedCount,
      clearSelection,
      getAppSlugs
    }}>
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
