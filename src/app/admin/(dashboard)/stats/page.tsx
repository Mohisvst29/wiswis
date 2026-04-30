"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

export default function StatsAdmin() {
  const [stats, setStats] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [msg, setMsg] = useState("");

  const load = () => fetch("/api/stats").then(r=>r.json()).then(d=>{if(Array.isArray(d))setStats(d)});
  useEffect(()=>{load()},[]);

  const handleSave = async () => {
    const method = editing._id ? "PUT" : "POST";
    const url = editing._id ? `/api/stats/${editing._id}` : "/api/stats";
    const res = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(editing) });
    if(res.ok) { load(); setEditing(null); setMsg("Saved!"); setTimeout(()=>setMsg(""),3000); }
  };

  const handleDelete = async (id:string) => {
    if(!confirm("Delete?")) return;
    await fetch(`/api/stats/${id}`,{method:"DELETE"});
    load();
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Stats</h2>
        <button onClick={()=>setEditing({key:"",value:0,label:{ar:"",en:""},icon:"Calendar",order:stats.length})} className="btn-primary text-sm py-2 px-4"><Plus size={16}/>Add Stat</button>
      </div>
      {msg && <div className="mb-4 p-3 rounded-lg bg-green-900/20 text-green-400 text-sm">{msg}</div>}

      {editing && (
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex justify-between mb-4"><h3 className="font-bold text-white">{editing._id?"Edit":"New"} Stat</h3>
            <button onClick={()=>setEditing(null)} className="text-gray-400"><X size={20}/></button></div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 text-sm mb-1">Key</label>
                <input value={editing.key||""} onChange={e=>setEditing((p:any)=>({...p,key:e.target.value}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none" placeholder="e.g. years"/></div>
              <div><label className="block text-gray-400 text-sm mb-1">Value</label>
                <input type="number" value={editing.value||0} onChange={e=>setEditing((p:any)=>({...p,value:parseInt(e.target.value)}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"/></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 text-sm mb-1">Label (AR)</label>
                <input value={editing.label?.ar||""} onChange={e=>setEditing((p:any)=>({...p,label:{...p.label,ar:e.target.value}}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none" dir="rtl"/></div>
              <div><label className="block text-gray-400 text-sm mb-1">Label (EN)</label>
                <input value={editing.label?.en||""} onChange={e=>setEditing((p:any)=>({...p,label:{...p.label,en:e.target.value}}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"/></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 text-sm mb-1">Icon</label>
                <select value={editing.icon||"Calendar"} onChange={e=>setEditing((p:any)=>({...p,icon:e.target.value}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none">
                  {["Calendar","MapPin","Building","Users"].map(i=><option key={i} value={i}>{i}</option>)}</select></div>
              <div><label className="block text-gray-400 text-sm mb-1">Order</label>
                <input type="number" value={editing.order||0} onChange={e=>setEditing((p:any)=>({...p,order:parseInt(e.target.value)}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"/></div>
            </div>
            <button onClick={handleSave} className="btn-primary text-sm py-2 px-4"><Save size={16}/>Save</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {stats.map(s=>(
          <div key={s._id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div><p className="font-bold text-white">{s.label?.en}: <span className="text-orange-400">{s.value}</span></p>
              <p className="text-sm text-gray-400">Key: {s.key}</p></div>
            <div className="flex gap-2">
              <button onClick={()=>setEditing({...s})} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"><Edit2 size={16}/></button>
              <button onClick={()=>handleDelete(s._id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
