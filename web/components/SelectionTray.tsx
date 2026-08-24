'use client';
import { useSelection } from '../app/context/SelectionContext';
import { useState } from 'react';

export default function SelectionTray() {
  const { getSelectedCount, getAppSlugs, selectedAppList, removeApp, clearSelection } = useSelection();
  const [isLoading, setIsLoading] = useState(false);
  const [installerId, setInstallerId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const count = getSelectedCount();
  
  if (count === 0) return null;

  const handleGenerateInstaller = async () => {
    setIsLoading(true);
    setInstallerId(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) {
        const response = await fetch(`${apiUrl}/api/v1/installers/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apps: getAppSlugs() }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setInstallerId(data.installer_id);
          return;
        }
      }
      // Offline fallback ID
      const fallbackId = `QI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setInstallerId(fallbackId);
    } catch {
      const fallbackId = `QI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setInstallerId(fallbackId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const commandText = `QuickInstall.exe ${installerId || 'QI-CUSTOM'}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 pointer-events-none">
      <div className="max-w-[1200px] mx-auto pointer-events-auto">
        <div className="relative rounded-2xl bg-[#0f172a]/90 backdrop-blur-2xl border border-blue-500/30 p-4 shadow-2xl shadow-blue-950/50 transition-all duration-300">
          
          {/* Expanded Selected Apps Drawer */}
          {isExpanded && (
            <div className="border-b border-gray-800/80 pb-3 mb-3 max-h-48 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Selected Applications ({count})
                </span>
                <button
                  onClick={clearSelection}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedAppList.map((app) => (
                  <span
                    key={app.slug}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800/60 text-xs text-blue-200"
                  >
                    <span>{app.name}</span>
                    <button
                      onClick={() => removeApp(app.slug)}
                      className="text-blue-400 hover:text-white transition-colors text-xs font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Main Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Counter & Toggle List */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-600/30 animate-bounce">
                  {count}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {count} {count === 1 ? 'Application' : 'Applications'} Selected
                  </div>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Selection' : 'View Selection'}</span>
                    <span className="text-[10px]">{isExpanded ? '▲' : '▼'}</span>
                  </button>
                </div>
              </div>

              {/* Clear button (mobile) */}
              <button
                onClick={clearSelection}
                className="sm:hidden text-xs text-gray-400 hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Installer Action Flow */}
            {installerId ? (
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                <div className="flex items-center gap-2 w-full sm:w-auto bg-gray-900/90 border border-gray-700/80 rounded-xl px-3 py-2">
                  <span className="text-xs text-gray-400 hidden lg:inline">Command:</span>
                  <code className="text-xs font-mono text-blue-300 select-all font-semibold truncate max-w-[200px] sm:max-w-none">
                    {commandText}
                  </code>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Copy Command Button */}
                  <button
                    onClick={() => handleCopy(commandText)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                      copied
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy Command</span>
                      </>
                    )}
                  </button>

                  {/* Download Executable Button */}
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL || "https://github.com/Qwicklabs-01/Quickinstall-hub/releases"}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Get QuickInstall</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={clearSelection}
                  className="hidden sm:inline-block px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleGenerateInstaller}
                  disabled={isLoading}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-600/30 ${
                    isLoading
                      ? 'bg-blue-600/50 cursor-wait'
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Generating Installer...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate QuickInstall ({count})</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
