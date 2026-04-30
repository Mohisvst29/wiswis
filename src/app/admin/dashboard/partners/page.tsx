"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  const load = () => fetch("/api/partners").then(r=>r.json()).then(d=>{if(Array.isArray(d))setPartners(d)});
  useEffect(()=>{load()},[]);

  const handleAdd = async (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if(!file) return;
    const fd = new FormData(); fd.append("file",file);
    const res = await fetch("/api/upload",{method:"POST",body:fd});
    const data = await res.json();
    if(data.url) {
      await fetch("/api/partners",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:file.name.split(".")[0],logo:data.url,order:partners.length})});
      load(); setMsg("Added!"); setTimeout(()=>setMsg(""),3000);
    }
  };

  const handleDelete = async (id:string) => {
    if(!confirm("Delete?")) return;
    await fetch(`/api/partners/${id}`,{method:"DELETE"});
    load();
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Partners</h2>
        <label className="btn-primary text-sm py-2 px-4 cursor-pointer"><Plus size={16}/>Add Partner<input type="file" accept="image/*" className="hidden" onChange={handleAdd}/></label>
      </div>
      {msg && <div className="mb-4 p-3 rounded-lg bg-green-900/20 text-green-400 text-sm">{msg}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {partners.map(p=>(
          <div key={p._id} className="glass rounded-xl p-4 flex flex-col items-center gap-3 group relative">
            <img src={p.logo} alt={p.name} className="h-16 object-contain"/>
            <p className="text-gray-400 text-sm truncate w-full text-center">{p.name}</p>
            <button onClick={()=>handleDelete(p._id)} className="absolute top-2 right-2 p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}
