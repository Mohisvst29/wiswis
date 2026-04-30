"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Upload } from "lucide-react";

export default function ServicesAdmin() {
  const [services, setServices] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [msg, setMsg] = useState("");

  const load = () => fetch("/api/services").then(r=>r.json()).then(d=>{if(Array.isArray(d))setServices(d)});
  useEffect(()=>{load()},[]);

  const handleSave = async () => {
    const method = editing._id ? "PUT" : "POST";
    const url = editing._id ? `/api/services/${editing._id}` : "/api/services";
    const res = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(editing) });
    if(res.ok) { load(); setEditing(null); setMsg("Saved!"); setTimeout(()=>setMsg(""),3000); }
  };

  const handleDelete = async (id:string) => {
    if(!confirm("Delete?")) return;
    await fetch(`/api/services/${id}`, { method:"DELETE" });
    load();
  };

  const handleUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if(!file) return;
    const fd = new FormData(); fd.append("file",file);
    const res = await fetch("/api/upload",{method:"POST",body:fd});
    const data = await res.json();
    if(data.url) setEditing((p:any)=>({...p,image:data.url}));
  };

  const newService = () => setEditing({ title:{ar:"",en:""}, description:{ar:"",en:""}, icon:"Fuel", order:services.length, isActive:true });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Services</h2>
        <button onClick={newService} className="btn-primary text-sm py-2 px-4"><Plus size={16}/>Add Service</button>
      </div>
      {msg && <div className="mb-4 p-3 rounded-lg bg-green-900/20 text-green-400 text-sm">{msg}</div>}

      {editing && (
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex justify-between mb-4"><h3 className="font-bold text-white">{editing._id?"Edit":"New"} Service</h3>
            <button onClick={()=>setEditing(null)} className="text-gray-400 hover:text-white"><X size={20}/></button></div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 text-sm mb-1">Title (AR)</label>
                <input value={editing.title?.ar||""} onChange={e=>setEditing((p:any)=>({...p,title:{...p.title,ar:e.target.value}}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none" dir="rtl"/></div>
              <div><label className="block text-gray-400 text-sm mb-1">Title (EN)</label>
                <input value={editing.title?.en||""} onChange={e=>setEditing((p:any)=>({...p,title:{...p.title,en:e.target.value}}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"/></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 text-sm mb-1">Description (AR)</label>
                <textarea value={editing.description?.ar||""} onChange={e=>setEditing((p:any)=>({...p,description:{...p.description,ar:e.target.value}}))} rows={3} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none resize-none" dir="rtl"/></div>
              <div><label className="block text-gray-400 text-sm mb-1">Description (EN)</label>
                <textarea value={editing.description?.en||""} onChange={e=>setEditing((p:any)=>({...p,description:{...p.description,en:e.target.value}}))} rows={3} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none resize-none"/></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 text-sm mb-1">Icon</label>
                <select value={editing.icon||"Fuel"} onChange={e=>setEditing((p:any)=>({...p,icon:e.target.value}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none">
                  {["Fuel","Car","Wrench","ShoppingCart","Coffee","Droplets","Zap","Shield"].map(i=><option key={i} value={i}>{i}</option>)}</select></div>
              <div><label className="block text-gray-400 text-sm mb-1">Order</label>
                <input type="number" value={editing.order||0} onChange={e=>setEditing((p:any)=>({...p,order:parseInt(e.target.value)}))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"/></div>
            </div>
            <div><label className="btn-outline text-sm py-2 px-4 cursor-pointer"><Upload size={16}/>Upload Image<input type="file" accept="image/*" className="hidden" onChange={handleUpload}/></label>
              {editing.image && <img src={editing.image} alt="" className="mt-2 h-20 rounded-lg"/>}</div>
            <button onClick={handleSave} className="btn-primary text-sm py-2 px-4"><Save size={16}/>Save</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {services.map(s=>(
          <div key={s._id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {s.image && <img src={s.image} alt="" className="w-12 h-12 rounded-lg object-cover"/>}
              <div><p className="font-bold text-white">{s.title?.en}</p><p className="text-sm text-gray-400" dir="rtl">{s.title?.ar}</p></div>
            </div>
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
