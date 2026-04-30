"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

export default function BranchesAdmin() {
  const [branches, setBranches] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [msg, setMsg] = useState("");

  const load = () => fetch("/api/branches").then(r=>r.json()).then(d=>{if(Array.isArray(d))setBranches(d)});
  useEffect(()=>{load()},[]);

  const handleSave = async () => {
    const method = editing._id ? "PUT" : "POST";
    const url = editing._id ? `/api/branches/${editing._id}` : "/api/branches";
    const res = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(editing) });
    if(res.ok) { load(); setEditing(null); setMsg("Saved!"); setTimeout(()=>setMsg(""),3000); }
  };

  const handleDelete = async (id:string) => {
    if(!confirm("Delete?")) return;
    await fetch(`/api/branches/${id}`, { method:"DELETE" });
    load();
  };

  const newBranch = () => setEditing({ name:{ar:"",en:""}, city:{ar:"",en:""}, latitude:24.7, longitude:46.6, status:"open", isActive:true });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Branches</h2>
        <button onClick={newBranch} className="btn-primary text-sm py-2 px-4"><Plus size={16}/>Add Branch</button>
      </div>
      {msg && <div className="mb-4 p-3 rounded-lg bg-green-900/20 text-green-400 text-sm">{msg}</div>}

      {editing && (
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex justify-between mb-4"><h3 className="font-bold text-white">{editing._id?"Edit":"New"} Branch</h3>
            <button onClick={()=>setEditing(null)} className="text-gray-400"><X size={20}/></button></div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 text-sm mb-1">Name (AR)</label>
                <input value={editing.name?.ar||""} onChange={e=>setEditing((p:any)=>({...p,name:{...p.name,ar:e.target.value}}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none" dir="rtl"/></div>
              <div><label className="block text-gray-400 text-sm mb-1">Name (EN)</label>
                <input value={editing.name?.en||""} onChange={e=>setEditing((p:any)=>({...p,name:{...p.name,en:e.target.value}}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"/></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 text-sm mb-1">City (AR)</label>
                <input value={editing.city?.ar||""} onChange={e=>setEditing((p:any)=>({...p,city:{...p.city,ar:e.target.value}}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none" dir="rtl"/></div>
              <div><label className="block text-gray-400 text-sm mb-1">City (EN)</label>
                <input value={editing.city?.en||""} onChange={e=>setEditing((p:any)=>({...p,city:{...p.city,en:e.target.value}}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"/></div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><label className="block text-gray-400 text-sm mb-1">Latitude</label>
                <input type="number" step="any" value={editing.latitude||""} onChange={e=>setEditing((p:any)=>({...p,latitude:parseFloat(e.target.value)}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"/></div>
              <div><label className="block text-gray-400 text-sm mb-1">Longitude</label>
                <input type="number" step="any" value={editing.longitude||""} onChange={e=>setEditing((p:any)=>({...p,longitude:parseFloat(e.target.value)}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"/></div>
              <div><label className="block text-gray-400 text-sm mb-1">Status</label>
                <select value={editing.status||"open"} onChange={e=>setEditing((p:any)=>({...p,status:e.target.value}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none">
                  <option value="open">Open</option><option value="closed">Closed</option></select></div>
            </div>
            <button onClick={handleSave} className="btn-primary text-sm py-2 px-4"><Save size={16}/>Save</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {branches.map(b=>(
          <div key={b._id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div><p className="font-bold text-white">{b.name?.en} - {b.city?.en}</p>
              <p className="text-sm text-gray-400">Lat: {b.latitude}, Lng: {b.longitude} · <span className={b.status==="open"?"text-green-400":"text-red-400"}>{b.status}</span></p></div>
            <div className="flex gap-2">
              <button onClick={()=>setEditing({...b})} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"><Edit2 size={16}/></button>
              <button onClick={()=>handleDelete(b._id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
