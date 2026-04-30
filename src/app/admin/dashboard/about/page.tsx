"use client";
import React, { useState, useEffect } from "react";
import { Save, Upload } from "lucide-react";

export default function AboutAdmin() {
  const [about, setAbout] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetch("/api/about").then(r => r.json()).then(setAbout); }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/about", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(about) });
    if (res.ok) { setMsg("Saved!"); setTimeout(() => setMsg(""), 3000); }
    setSaving(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setAbout((p: any) => ({ ...p, image: data.url }));
  };

  if (!about) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">About Section</h2>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-4"><Save size={16} />{saving ? "Saving..." : "Save"}</button>
      </div>
      {msg && <div className="mb-4 p-3 rounded-lg bg-green-900/20 text-green-400 text-sm">{msg}</div>}
      <div className="space-y-6">
        <div className="glass rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Title</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-gray-400 text-sm mb-1">Arabic</label>
              <input value={about.title?.ar||""} onChange={e=>setAbout((p:any)=>({...p,title:{...p.title,ar:e.target.value}}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none" dir="rtl"/></div>
            <div><label className="block text-gray-400 text-sm mb-1">English</label>
              <input value={about.title?.en||""} onChange={e=>setAbout((p:any)=>({...p,title:{...p.title,en:e.target.value}}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"/></div>
          </div>
        </div>
        <div className="glass rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Description</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-gray-400 text-sm mb-1">Arabic</label>
              <textarea value={about.description?.ar||""} onChange={e=>setAbout((p:any)=>({...p,description:{...p.description,ar:e.target.value}}))} rows={5} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none resize-none" dir="rtl"/></div>
            <div><label className="block text-gray-400 text-sm mb-1">English</label>
              <textarea value={about.description?.en||""} onChange={e=>setAbout((p:any)=>({...p,description:{...p.description,en:e.target.value}}))} rows={5} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none resize-none"/></div>
          </div>
        </div>
        <div className="glass rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Image & Experience</h3>
          <div className="flex items-center gap-4 mb-4">
            {about.image && <img src={about.image} alt="" className="h-24 rounded-lg"/>}
            <label className="btn-outline text-sm py-2 px-4 cursor-pointer"><Upload size={16}/>Upload<input type="file" accept="image/*" className="hidden" onChange={handleUpload}/></label>
          </div>
          <div><label className="block text-gray-400 text-sm mb-1">Years of Experience</label>
            <input type="number" value={about.yearsOfExperience||0} onChange={e=>setAbout((p:any)=>({...p,yearsOfExperience:parseInt(e.target.value)}))} className="w-32 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"/></div>
        </div>
      </div>
    </div>
  );
}
