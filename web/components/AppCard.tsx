'use client';
import { useSelection } from '../app/context/SelectionContext';
type AppCardProps = {
  slug: string;
  name: string;
};

export default function AppCard({ slug, name }: AppCardProps) {
  const { selectedApps, toggleApp } = useSelection();
  const isSelected = selectedApps.has(slug);

  return (
    <label 
      className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors border ${
        isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent'
      }`}
    >
      <input 
        type="checkbox" 
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={isSelected}
        onChange={() => toggleApp(slug, name)}
      />
      <span className="flex-1 text-sm font-medium text-gray-800 truncate" title={name}>{name}</span>
    </label>
  );
}
