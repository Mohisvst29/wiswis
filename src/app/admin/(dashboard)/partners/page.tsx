"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: '', logoUrl: '', order: 0 });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    const res = await fetch('/api/partners');
    const data = await res.json();
    setPartners(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId ? `/api/partners/${editingId}` : '/api/partners';
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setLoading(false);
    setIsModalOpen(false);
    fetchPartners();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this partner?')) {
      await fetch(`/api/partners/${id}`, { method: 'DELETE' });
      fetchPartners();
    }
  };

  const openEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({ name: item.name, logoUrl: item.logoUrl, order: item.order || 0 });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Partners</h1>
        <button onClick={() => { setEditingId(null); setFormData({ name: '', logoUrl: '', order: 0 }); setIsModalOpen(true); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={18} /> Add Partner
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="text-xs text-gray-500 uppercase bg-gray-950/50 border-b border-gray-800">
            <tr>
              <th className="px-6 py-4">Logo</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="px-6 py-4"><img src={p.logoUrl} alt={p.name} className="h-10 object-contain rounded-md" /></td>
                <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                <td className="px-6 py-4">{p.order}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(p)} className="text-blue-400 hover:text-blue-300 p-2"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Partner' : 'Add Partner'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6">
              <form id="partnerForm" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Partner Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL (Use Media Manager)</label>
                  <input required type="text" value={formData.logoUrl} onChange={e => setFormData({...formData, logoUrl: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                  <input required type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">Cancel</button>
              <button form="partnerForm" type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium">{loading ? 'Saving...' : 'Save Partner'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
