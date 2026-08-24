'use client';
import { useState, useEffect, useMemo } from 'react';
import { ALL_APPS, DEFAULT_CATEGORIES } from '../../lib/catalogData';

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
  const [editingApp, setEditingApp] = useState<AppData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [editUrl, setEditUrl] = useState("");
  const [editVersion, setEditVersion] = useState("");
  const [editSha256, setEditSha256] = useState("");

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
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredApps = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return apps;
    return apps.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q)
    );
  }, [apps, searchQuery]);

  const openEditModal = (app: AppData) => {
    setEditingApp(app);
    setEditUrl(app.url || "");
    setEditVersion(app.version || "");
    setEditSha256(app.sha256 || "");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    setApps((prev) =>
      prev.map((app) =>
        app.id === editingApp.id
          ? { ...app, url: editUrl, version: editVersion, sha256: editSha256 }
          : app
      )
    );
    setEditingApp(null);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Catalog Management
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Software Catalog Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Manage official download sources, versions, and checksum hashes</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-900/90 border border-gray-800 text-white text-xs outline-none focus:border-blue-500 transition-all placeholder-gray-500 w-64"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="rounded-2xl bg-gray-900/60 border border-gray-800/80 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Total Applications</div>
          <div className="text-3xl font-black text-white">{apps.length}</div>
        </div>
        <div className="rounded-2xl bg-gray-900/60 border border-gray-800/80 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Categories</div>
          <div className="text-3xl font-black text-blue-400">{DEFAULT_CATEGORIES.length}</div>
        </div>
        <div className="rounded-2xl bg-gray-900/60 border border-gray-800/80 p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Security Status</div>
          <div className="text-3xl font-black text-emerald-400">100% SHA-256</div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-gray-900/60 border border-gray-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-950/60 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Application</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Version</th>
                <th className="py-3.5 px-4">SHA-256 Hash</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-xs">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-100">{app.name}</div>
                    <div className="text-[11px] text-gray-500 font-mono">{app.slug}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-800 text-gray-300 border border-gray-700">
                      {app.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-300">{app.version}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400 max-w-[200px] truncate" title={app.sha256}>
                    {app.sha256.substring(0, 16)}...
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openEditModal(app)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-semibold transition-all hover:scale-105"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Edit {editingApp.name}</h2>
            <p className="text-xs text-gray-400 mb-6">Update download endpoint or checksum</p>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Download URL</label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Version</label>
                <input
                  type="text"
                  value={editVersion}
                  onChange={(e) => setEditVersion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">SHA-256 Hash</label>
                <input
                  type="text"
                  value={editSha256}
                  onChange={(e) => setEditSha256(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-600/20"
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
