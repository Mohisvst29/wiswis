"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Globe } from "lucide-react";

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ nameEn: '', nameAr: '', descEn: '', descAr: '', cityEn: '', cityAr: '', lat: 0, lng: 0, isActive: true });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const res = await fetch('/api/branches');
    const data = await res.json();
    setBranches(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId ? `/api/branches/${editingId}` : '/api/branches';
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setLoading(false);
    setIsModalOpen(false);
    fetchBranches();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this branch?')) {
      await fetch(`/api/branches/${id}`, { method: 'DELETE' });
      fetchBranches();
    }
  };

  const openEdit = (branch: any) => {
    setEditingId(branch._id);
    setFormData({
      nameEn: branch.nameEn, nameAr: branch.nameAr,
      descEn: branch.descEn, descAr: branch.descAr,
      cityEn: branch.cityEn, cityAr: branch.cityAr,
      lat: branch.lat || 0, lng: branch.lng || 0, isActive: branch.isActive
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage Branches</h1>
        <button onClick={() => { setEditingId(null); setFormData({ nameEn: '', nameAr: '', descEn: '', descAr: '', cityEn: '', cityAr: '', lat: 0, lng: 0, isActive: true }); setIsModalOpen(true); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={18} /> Add Branch
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="text-xs text-gray-500 uppercase bg-gray-950/50 border-b border-gray-800">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">City</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((br) => (
              <tr key={br._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="px-6 py-4 font-medium text-white">{br.nameEn} <br/><span className="text-gray-500 font-normal">{br.nameAr}</span></td>
                <td className="px-6 py-4">{br.cityEn}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${br.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{br.isActive ? 'Open' : 'Closed'}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(br)} className="text-blue-400 hover:text-blue-300 p-2"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(br._id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Branch' : 'Add Branch'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="branchForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name (EN)</label>
                    <input required type="text" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name (AR)</label>
                    <input required type="text" dir="rtl" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City (EN)</label>
                    <input required type="text" value={formData.cityEn} onChange={e => setFormData({...formData, cityEn: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City (AR)</label>
                    <input required type="text" dir="rtl" value={formData.cityAr} onChange={e => setFormData({...formData, cityAr: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Details (EN)</label>
                    <input required type="text" value={formData.descEn} onChange={e => setFormData({...formData, descEn: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Details (AR)</label>
                    <input required type="text" dir="rtl" value={formData.descAr} onChange={e => setFormData({...formData, descAr: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Latitude</label>
                    <input type="number" step="any" value={formData.lat} onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Longitude</label>
                    <input type="number" step="any" value={formData.lng} onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-3">
                    <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 accent-red-600 rounded bg-gray-900 border-gray-800" />
                    <label htmlFor="isActive" className="text-white font-medium">Branch is Open and Active</label>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">Cancel</button>
              <button form="branchForm" type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium">{loading ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
