"use client";
import React, { useState, useEffect } from "react";
import { Save, Upload } from "lucide-react";

export default function HeroAdmin() {
  const [hero, setHero] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/hero").then(r => r.json()).then(data => {
      if (Array.isArray(data) && data.length > 0) setHero(data[0]);
      else setHero({ title: { ar: "نحو رحلة بلا حدود", en: "Towards a Limitless Journey" }, subtitle: { ar: "نقدم تجربة متكاملة من خدمات الوقود والخدمات المساندة", en: "We deliver a complete fuel and roadside service experience" }, backgroundType: "image", isActive: true });
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = hero._id ? "PUT" : "POST";
      const url = hero._id ? `/api/hero/${hero._id}` : "/api/hero";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(hero) });
      if (res.ok) { const data = await res.json(); setHero(data); setMsg("Saved!"); setTimeout(() => setMsg(""), 3000); }
    } catch { setMsg("Error saving"); }
    setSaving(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]; if (!file) return;
    const formData = new FormData(); formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) setHero((p: any) => ({ ...p, [field]: data.url }));
  };

  if (!hero) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Hero Section</h2>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-4 disabled:opacity-50"><Save size={16} />{saving ? "Saving..." : "Save"}</button>
      </div>
      {msg && <div className="mb-4 p-3 rounded-lg bg-green-900/20 border border-green-900/30 text-green-400 text-sm">{msg}</div>}
      <div className="space-y-6">
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Title</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-gray-400 text-sm mb-1">Arabic</label>
              <input value={hero.title?.ar || ""} onChange={e => setHero((p: any) => ({ ...p, title: { ...p.title, ar: e.target.value } }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none" dir="rtl" /></div>
            <div><label className="block text-gray-400 text-sm mb-1">English</label>
              <input value={hero.title?.en || ""} onChange={e => setHero((p: any) => ({ ...p, title: { ...p.title, en: e.target.value } }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none" /></div>
          </div>
        </div>
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Subtitle</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-gray-400 text-sm mb-1">Arabic</label>
              <textarea value={hero.subtitle?.ar || ""} onChange={e => setHero((p: any) => ({ ...p, subtitle: { ...p.subtitle, ar: e.target.value } }))} rows={3} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none resize-none" dir="rtl" /></div>
            <div><label className="block text-gray-400 text-sm mb-1">English</label>
              <textarea value={hero.subtitle?.en || ""} onChange={e => setHero((p: any) => ({ ...p, subtitle: { ...p.subtitle, en: e.target.value } }))} rows={3} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none resize-none" /></div>
          </div>
        </div>
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Background</h3>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">Type</label>
            <select value={hero.backgroundType || "image"} onChange={e => setHero((p: any) => ({ ...p, backgroundType: e.target.value }))} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none">
              <option value="image">Image</option><option value="video">Video</option>
            </select>
          </div>
          {hero.backgroundType === "image" ? (
            <div><label className="btn-outline text-sm py-2 px-4 cursor-pointer"><Upload size={16} />Upload Image<input type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, "backgroundImage")} /></label>
              {hero.backgroundImage && <img src={hero.backgroundImage} alt="" className="mt-4 h-40 rounded-lg object-cover" />}</div>
          ) : (
            <div><label className="btn-outline text-sm py-2 px-4 cursor-pointer"><Upload size={16} />Upload Video<input type="file" accept="video/*" className="hidden" onChange={e => handleUpload(e, "backgroundVideo")} /></label>
              {hero.backgroundVideo && <video src={hero.backgroundVideo} className="mt-4 h-40 rounded-lg" controls />}</div>
          )}
        </div>
      </div>
    </div>
  );
}
