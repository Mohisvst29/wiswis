"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Eye, Mail, Clock } from "lucide-react";

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const load = () => fetch("/api/contact").then(r=>r.json()).then(d=>{if(Array.isArray(d))setMessages(d)});
  useEffect(()=>{load()},[]);

  const handleDelete = async (id:string) => {
    if(!confirm("Delete?")) return;
    await fetch(`/api/contact/${id}`,{method:"DELETE"});
    load(); if(selected?._id===id) setSelected(null);
  };

  const markRead = async (msg:any) => {
    setSelected(msg);
    if(!msg.isRead) {
      await fetch(`/api/contact/${msg._id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({isRead:true})});
      load();
    }
  };

  return (
    <div className="max-w-5xl">
      <h2 className="text-2xl font-bold text-white mb-6">Contact Messages</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {messages.map(m=>(
            <div key={m._id} onClick={()=>markRead(m)}
              className={`glass rounded-xl p-4 cursor-pointer transition-all hover:bg-white/5 ${selected?._id===m._id?"border border-red-800":""}  ${!m.isRead?"border-l-2 border-l-orange-500":""}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-white">{m.name}</p>
                  <p className="text-sm text-gray-400">{m.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!m.isRead && <div className="w-2 h-2 rounded-full bg-orange-500"/>}
                  <button onClick={(e)=>{e.stopPropagation();handleDelete(m._id)}} className="p-1 text-gray-600 hover:text-red-400"><Trash2 size={14}/></button>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">{m.message}</p>
              <div className="flex items-center gap-1 mt-2 text-gray-600 text-xs"><Clock size={12}/>{new Date(m.createdAt).toLocaleString()}</div>
            </div>
          ))}
          {messages.length===0 && <p className="text-gray-500 text-center py-8">No messages yet</p>}
        </div>

        {selected && (
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Message Details</h3>
            <div className="space-y-3">
              <div><span className="text-gray-400 text-sm">Name:</span><p className="text-white">{selected.name}</p></div>
              <div><span className="text-gray-400 text-sm">Email:</span><p className="text-white"><a href={`mailto:${selected.email}`} className="hover:text-orange-400">{selected.email}</a></p></div>
              {selected.phone && <div><span className="text-gray-400 text-sm">Phone:</span><p className="text-white" dir="ltr">{selected.phone}</p></div>}
              <div><span className="text-gray-400 text-sm">Message:</span><p className="text-white whitespace-pre-wrap mt-1">{selected.message}</p></div>
              <div><span className="text-gray-400 text-sm">Date:</span><p className="text-white">{new Date(selected.createdAt).toLocaleString()}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
