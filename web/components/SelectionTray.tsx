'use client';
import { useSelection } from '../app/context/SelectionContext';
import { useState } from 'react';
import { generateBatchScript, generatePowerShellCommand } from '../lib/catalogData';

export default function SelectionTray() {
  const { getSelectedCount, selectedAppList, removeApp, clearSelection } = useSelection();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const count = getSelectedCount();
  
  if (count === 0) return null;

  const handleDownloadBatch = () => {
    const scriptContent = generateBatchScript(selectedAppList);
    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'QuickInstall-Package.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyPowerShell = () => {
    const command = generatePowerShellCommand(selectedAppList);
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const psCommand = generatePowerShellCommand(selectedAppList);

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 pointer-events-none">
        <div className="max-w-[1200px] mx-auto pointer-events-auto">
          <div className="relative rounded-2xl bg-[#0f172a]/95 backdrop-blur-2xl border border-blue-500/40 p-4 shadow-2xl shadow-blue-950/60 transition-all duration-300">
            
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
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm shadow-md shadow-blue-600/40 animate-pulse">
                    {count}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {count} {count === 1 ? 'App' : 'Apps'} Selected
                    </div>
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-medium"
                    >
                      <span>{isExpanded ? 'Hide Selected Apps' : 'View Selected Apps'}</span>
                      <span className="text-[10px]">{isExpanded ? '▲' : '▼'}</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Clear button */}
                <button
                  onClick={clearSelection}
                  className="sm:hidden text-xs text-gray-400 hover:text-red-400 transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Generate & Download Flow */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={clearSelection}
                  className="hidden sm:inline-block px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Clear Selection
                </button>
                
                {/* 1-Click Download Button */}
                <button
                  onClick={handleDownloadBatch}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-emerald-600/30 hover:scale-105"
                  title="Download self-running 1-Click Windows batch installer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download 1-Click Installer (.bat)</span>
                </button>

                {/* Open Package Options Modal */}
                <button
                  onClick={() => setShowModal(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-blue-600/30 hover:scale-105"
                >
                  <span>More Options</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Package Ready Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-2xl bg-gray-900 border border-gray-800 p-6 sm:p-8 shadow-2xl">
            
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold p-1"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-3 shadow-lg shadow-emerald-500/20">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white">Your Custom Installer Is Ready!</h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Selected {count} Windows {count === 1 ? 'application' : 'applications'} ready to install silently.
              </p>
            </div>

            {/* Selected Apps Preview Pill Box */}
            <div className="rounded-xl bg-gray-950 border border-gray-800 p-3 mb-6 max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-1.5">
                {selectedAppList.map((app) => (
                  <span key={app.slug} className="px-2.5 py-1 rounded-md bg-gray-800/80 text-gray-300 text-xs font-medium border border-gray-700">
                    {app.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Download Option 1: 1-Click .bat Installer */}
            <div className="space-y-4">
              <div className="rounded-xl bg-gradient-to-r from-emerald-950/40 to-emerald-900/20 border border-emerald-500/30 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Option 1: 1-Click Windows Script (Recommended)</h4>
                      <p className="text-[11px] text-gray-400">Downloads a `.bat` file that silently installs all your selected apps.</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleDownloadBatch}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download QuickInstall-Package.bat</span>
                </button>
              </div>

              {/* Option 2: PowerShell Terminal Command */}
              <div className="rounded-xl bg-gray-950 border border-gray-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Option 2: Run directly in PowerShell
                  </h4>
                  <span className="text-[10px] text-gray-500">Windows Terminal / PowerShell</span>
                </div>
                <div className="relative flex items-center mb-2">
                  <input
                    type="text"
                    readOnly
                    value={psCommand}
                    className="w-full pl-3 pr-24 py-2 bg-gray-900 border border-gray-700/80 rounded-lg text-xs font-mono text-blue-300 focus:outline-none truncate"
                  />
                  <button
                    onClick={handleCopyPowerShell}
                    className={`absolute right-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600'
                    }`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick 3-Step Windows Guide */}
            <div className="mt-6 pt-4 border-t border-gray-800/80">
              <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                How to use:
              </h5>
              <ol className="text-xs text-gray-400 space-y-1.5 list-decimal list-inside">
                <li>Click <strong className="text-white">Download QuickInstall-Package.bat</strong>.</li>
                <li>Go to your Downloads folder and <strong className="text-white">double-click</strong> the file.</li>
                <li>Windows will automatically download and install all your software silently!</li>
              </ol>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
