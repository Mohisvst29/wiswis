"use client";
import React, { useState, useEffect } from "react";
import { Search, Mail, Trash2, CheckCircle } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await fetch('/api/contact');
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
  };

  const markRead = async (id: string, isRead: boolean) => {
    await fetch(`/api/contact/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead: !isRead })
    });
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this message?')) {
      await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      fetchMessages();
    }
  };

  const filtered = messages.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Inbox Messages</h1>
        <div className="relative w-full md:w-64">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search messages..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:border-red-500 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((msg) => (
          <div key={msg._id} className={`bg-gray-900 border ${msg.isRead ? 'border-gray-800 opacity-70' : 'border-red-900/50'} rounded-xl p-6 transition-all`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.isRead ? 'bg-gray-800 text-gray-400' : 'bg-red-500/20 text-red-400'}`}>
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{msg.name}</h3>
                  <p className="text-sm text-gray-400">{msg.email}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</span>
            </div>
            
            <div className="pl-14">
              <h4 className="font-semibold text-gray-200 mb-2">{msg.subject}</h4>
              <p className="text-gray-400 text-sm whitespace-pre-wrap">{msg.message}</p>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-800">
              <button onClick={() => markRead(msg._id, msg.isRead)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${msg.isRead ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'}`}>
                <CheckCircle size={16} /> {msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
              </button>
              <button onClick={() => handleDelete(msg._id)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <Mail size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-400 font-medium">No messages found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
