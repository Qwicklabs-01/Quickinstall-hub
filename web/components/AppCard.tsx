'use client';
import { useSelection } from '../app/context/SelectionContext';

type AppCardProps = {
  slug: string;
  name: string;
  description?: string;
};

// Generates consistent soft accent colors for initial badges
function getAvatarGradient(name: string) {
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600',
    'from-rose-500 to-red-600',
    'from-violet-500 to-purple-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export default function AppCard({ slug, name, description }: AppCardProps) {
  const { selectedApps, toggleApp } = useSelection();
  const isSelected = selectedApps.has(slug);
  const avatarGradient = getAvatarGradient(name);

  return (
    <div
      onClick={() => toggleApp(slug, name)}
      className={`group relative flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 select-none border ${
        isSelected
          ? 'bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-500/10'
          : 'bg-gray-900/40 hover:bg-gray-800/60 border-gray-800/60 hover:border-gray-700/80 hover:-translate-y-0.5'
      }`}
    >
      {/* Custom Checkbox */}
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-150 ${
          isSelected
            ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
            : 'border-gray-700 bg-gray-900/80 group-hover:border-gray-500'
        }`}
      >
        {isSelected && (
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      {/* App Mini Avatar Badge */}
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr ${avatarGradient} text-white font-bold text-xs shadow-sm`}>
        {name.charAt(0)}
      </div>

      {/* App Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className={`text-sm font-semibold truncate transition-colors ${isSelected ? 'text-blue-200' : 'text-gray-200 group-hover:text-white'}`}>
            {name}
          </span>
        </div>
        {description && (
          <p className="text-[11px] text-gray-500 truncate group-hover:text-gray-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
