"use client";
import React, { useState, useEffect } from "react";
import { Save, Upload, Plus, X } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(setSettings).catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      if (res.ok) { setMsg("Settings saved!"); setTimeout(() => setMsg(""), 3000); }
    } catch { setMsg("Error saving"); }
    setSaving(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setSettings((p: any) => ({ ...p, [field]: data.url }));
    } catch (err) { console.error(err); }
  };

  if (!settings) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Site Settings</h2>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-4 disabled:opacity-50">
          <Save size={16} />{saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
      {msg && <div className="mb-4 p-3 rounded-lg bg-green-900/20 border border-green-900/30 text-green-400 text-sm">{msg}</div>}

      <div className="space-y-6">
        {/* Site Name */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Site Name</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Arabic</label>
              <input value={settings.siteName?.ar || ""} onChange={e => setSettings((p: any) => ({ ...p, siteName: { ...p.siteName, ar: e.target.value } }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none" dir="rtl" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">English</label>
              <input value={settings.siteName?.en || ""} onChange={e => setSettings((p: any) => ({ ...p, siteName: { ...p.siteName, en: e.target.value } }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Logo</h3>
          <div className="flex items-center gap-4">
            {settings.logo && <img src={settings.logo} alt="Logo" className="h-16 rounded-lg" />}
            <label className="btn-outline text-sm py-2 px-4 cursor-pointer"><Upload size={16} />Upload Logo
              <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, "logo")} />
            </label>
          </div>
          <div className="mt-4">
            <label className="block text-gray-400 text-sm mb-1">Logo Size (px)</label>
            <input type="number" value={settings.logoSize || 120} onChange={e => setSettings((p: any) => ({ ...p, logoSize: parseInt(e.target.value) }))}
              className="w-32 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none" />
          </div>
        </div>

        {/* Colors */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Colors</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Primary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={settings.primaryColor || "#8B0000"} onChange={e => setSettings((p: any) => ({ ...p, primaryColor: e.target.value }))} className="w-10 h-10 rounded cursor-pointer" />
                <input value={settings.primaryColor || "#8B0000"} onChange={e => setSettings((p: any) => ({ ...p, primaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={settings.secondaryColor || "#FF6B00"} onChange={e => setSettings((p: any) => ({ ...p, secondaryColor: e.target.value }))} className="w-10 h-10 rounded cursor-pointer" />
                <input value={settings.secondaryColor || "#FF6B00"} onChange={e => setSettings((p: any) => ({ ...p, secondaryColor: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Fonts */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Fonts</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Arabic Font</label>
              <select value={settings.fontArabic || "Cairo"} onChange={e => setSettings((p: any) => ({ ...p, fontArabic: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none">
                {["Cairo", "Tajawal", "Almarai", "Changa", "Amiri"].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">English Font</label>
              <select value={settings.fontEnglish || "Inter"} onChange={e => setSettings((p: any) => ({ ...p, fontEnglish: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none">
                {["Inter", "Montserrat", "Poppins", "Roboto"].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <input value={settings.email || ""} onChange={e => setSettings((p: any) => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Phone Numbers</label>
              {settings.phones?.map((phone: string, i: number) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input value={phone} onChange={e => { const phones = [...settings.phones]; phones[i] = e.target.value; setSettings((p: any) => ({ ...p, phones })); }}
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none" dir="ltr" />
                  <button onClick={() => { const phones = settings.phones.filter((_: any, j: number) => j !== i); setSettings((p: any) => ({ ...p, phones })); }}
                    className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg"><X size={16} /></button>
                </div>
              ))}
              <button onClick={() => setSettings((p: any) => ({ ...p, phones: [...(p.phones || []), ""] }))}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"><Plus size={14} />Add Phone</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Address (Arabic)</label>
                <input value={settings.address?.ar || ""} onChange={e => setSettings((p: any) => ({ ...p, address: { ...p.address, ar: e.target.value } }))}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none" dir="rtl" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Address (English)</label>
                <input value={settings.address?.en || ""} onChange={e => setSettings((p: any) => ({ ...p, address: { ...p.address, en: e.target.value } }))}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Social Links</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {["facebook", "twitter", "instagram", "linkedin", "youtube", "snapchat", "tiktok", "whatsapp"].map(platform => (
              <div key={platform}>
                <label className="block text-gray-400 text-sm mb-1 capitalize">{platform}</label>
                <input value={settings.socialLinks?.[platform] || ""} onChange={e => setSettings((p: any) => ({ ...p, socialLinks: { ...p.socialLinks, [platform]: e.target.value } }))}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none" placeholder={`https://${platform}.com/...`} />
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Map Location</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Latitude</label>
              <input type="number" step="any" value={settings.mapLatitude || ""} onChange={e => setSettings((p: any) => ({ ...p, mapLatitude: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Longitude</label>
              <input type="number" step="any" value={settings.mapLongitude || ""} onChange={e => setSettings((p: any) => ({ ...p, mapLongitude: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-red-800 focus:outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
