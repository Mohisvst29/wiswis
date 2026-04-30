"use client";
import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      setSettings(data || {});
    });
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = Object.entries(settings).map(([key, value]) => ({ key, value }));
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setToast("Settings saved successfully!");
      setTimeout(() => setToast(""), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Global Settings</h1>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {toast && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg text-sm">
          {toast}
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white mb-1">General Information</h2>
          <p className="text-sm text-gray-400">Manage basic site details.</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Site Name (EN)</label>
              <input type="text" value={settings.siteNameEn || ''} onChange={(e) => handleChange('siteNameEn', e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Site Name (AR)</label>
              <input type="text" dir="rtl" value={settings.siteNameAr || ''} onChange={(e) => handleChange('siteNameAr', e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Primary Phone</label>
              <input type="text" value={settings.phone1 || ''} onChange={(e) => handleChange('phone1', e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Phone</label>
              <input type="text" value={settings.phone2 || ''} onChange={(e) => handleChange('phone2', e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input type="email" value={settings.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white mb-1">Design & Media</h2>
          <p className="text-sm text-gray-400">Configure visual settings and URLs.</p>
        </div>
        <div className="p-6 space-y-5">
           <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
              <input type="text" value={settings.logoUrl || ''} onChange={(e) => handleChange('logoUrl', e.target.value)} placeholder="/assets/logo.png" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none" />
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Hero Background Image URL</label>
              <input type="text" value={settings.heroBgUrl || ''} onChange={(e) => handleChange('heroBgUrl', e.target.value)} placeholder="/assets/wiswis_hero.png" className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none" />
           </div>
        </div>
      </div>
    </div>
  );
}
