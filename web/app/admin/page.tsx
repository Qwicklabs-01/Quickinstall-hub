'use client';
import { useState, useEffect } from 'react';
import { ALL_APPS } from '../../lib/catalogData';

type AppData = {
  id: number;
  slug: string;
  name: string;
  category: string;
  url: string;
  version: string;
  sha256: string;
};

const DEFAULT_ADMIN_APPS: AppData[] = ALL_APPS.map((app, idx) => ({
  id: idx + 1,
  slug: app.slug,
  name: app.name,
  category: app.category,
  url: app.url || `https://example.com/downloads/${app.slug}.exe`,
  version: app.version || "1.0.0",
  sha256: app.sha256 || "0000000000000000000000000000000000000000000000000000000000000000",
}));

export default function AdminDashboard() {
  const [apps, setApps] = useState<AppData[]>(DEFAULT_ADMIN_APPS);
  const [isLoading, setIsLoading] = useState(false);
  const [editingApp, setEditingApp] = useState<AppData | null>(null);

  // Form state
  const [editUrl, setEditUrl] = useState("");
  const [editVersion, setEditVersion] = useState("");
  const [editSha256, setEditSha256] = useState("");

  const fetchApps = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        setIsLoading(false);
        return;
      }
      const res = await fetch(`${apiUrl}/api/v1/admin/apps`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setApps(data);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      fetch(`${apiUrl}/api/v1/admin/apps`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setApps(data);
          }
        })
        .catch(() => {
          // Fallback to DEFAULT_ADMIN_APPS
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const openEditModal = (app: AppData) => {
    setEditingApp(app);
    setEditUrl(app.url || "");
    setEditVersion(app.version || "");
    setEditSha256(app.sha256 || "");
  };

  const closeEditModal = () => {
    setEditingApp(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    try {
      // Update core metadata
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      await fetch(`${apiUrl}/api/v1/admin/apps/${editingApp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingApp.name,
          official_download_url: editUrl,
          latest_version: editVersion
        })
      });

      // Update version metadata (including hash)
      await fetch(`${apiUrl}/api/v1/admin/apps/${editingApp.id}/version`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: editVersion,
          download_url: editUrl,
          sha256: editSha256
        })
      });

      closeEditModal();
      fetchApps(); // Refresh the list
    } catch (e) {
      console.error(e);
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={fetchApps}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500 text-xl">Loading software catalog...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-700">Category</th>
                <th className="p-4 font-semibold text-gray-700">Application</th>
                <th className="p-4 font-semibold text-gray-700">Version</th>
                <th className="p-4 font-semibold text-gray-700">Download URL</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {apps.map(app => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-500">{app.category}</td>
                  <td className="p-4 font-medium text-gray-900">{app.name}</td>
                  <td className="p-4 text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono border border-gray-200">
                      v{app.version}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-blue-600 truncate max-w-[300px]">
                    <a href={app.url} target="_blank" rel="noreferrer" className="hover:underline">{app.url}</a>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => openEditModal(app)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Edit {editingApp.name}</h2>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                  <input 
                    type="text" 
                    required
                    value={editVersion}
                    onChange={e => setEditVersion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Download URL</label>
                  <input 
                    type="url" 
                    required
                    value={editUrl}
                    onChange={e => setEditUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SHA-256 Hash</label>
                  <input 
                    type="text" 
                    required
                    value={editSha256}
                    onChange={e => setEditSha256(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-mono"
                    placeholder="e.g. 0000000000000000000000000000000000000000000000000000000000000000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Required for the desktop agent to verify the integrity of the downloaded file.</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
