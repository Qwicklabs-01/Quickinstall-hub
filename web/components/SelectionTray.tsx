'use client';
import { useSelection } from '../app/context/SelectionContext';
import { useState } from 'react';

export default function SelectionTray() {
  const { getSelectedCount, getAppSlugs } = useSelection();
  const [isLoading, setIsLoading] = useState(false);
  const [installerId, setInstallerId] = useState<string | null>(null);

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
      // Client fallback ID
      const fallbackId = `QI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setInstallerId(fallbackId);
    } catch {
      const fallbackId = `QI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setInstallerId(fallbackId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 p-4">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div>
          <span className="font-semibold text-lg text-blue-600">{count}</span>
          <span className="text-gray-700 ml-2">App(s) selected</span>
        </div>

        {installerId ? (
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <span className="text-sm font-medium text-gray-600 hidden md:inline">Ready to install:</span>
            <input 
              type="text" 
              readOnly 
              value={`QuickInstall.exe ${installerId}`}
              className="bg-gray-100 px-3 py-2 rounded border border-gray-300 text-sm font-mono w-full sm:w-64 focus:outline-none truncate"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={() => navigator.clipboard.writeText(`QuickInstall.exe ${installerId}`)}
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium transition-colors"
              >
                Copy
              </button>
              <a 
                href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/installers/${installerId}/download`}
                className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors text-center shadow-sm"
              >
                Download
              </a>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleGenerateInstaller}
            disabled={isLoading}
            className={`w-full md:w-auto px-6 py-2 rounded font-medium text-white shadow-sm transition-colors ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Generating..." : "Generate QuickInstall"}
          </button>
        )}
      </div>
    </div>
  );
}
