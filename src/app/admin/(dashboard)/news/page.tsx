"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', imageUrl: '', isFeatured: false });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const res = await fetch('/api/news');
    const data = await res.json();
    setNews(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId ? `/api/news/${editingId}` : '/api/news';
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setLoading(false);
    setIsModalOpen(false);
    fetchNews();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this news post?')) {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
      fetchNews();
    }
  };

  const openEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({
      titleEn: item.titleEn, titleAr: item.titleAr,
      descriptionEn: item.descriptionEn, descriptionAr: item.descriptionAr,
      imageUrl: item.imageUrl, isFeatured: item.isFeatured || false
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Manage News</h1>
        <button onClick={() => { setEditingId(null); setFormData({ titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', imageUrl: '', isFeatured: false }); setIsModalOpen(true); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={18} /> Create Post
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="text-xs text-gray-500 uppercase bg-gray-950/50 border-b border-gray-800">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Featured</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="px-6 py-4"><img src={item.imageUrl || '/assets/wiswis_services.png'} alt="" className="w-16 h-12 object-cover rounded-md" /></td>
                <td className="px-6 py-4 font-medium text-white max-w-xs truncate">{item.titleEn}</td>
                <td className="px-6 py-4">{new Date(item.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{item.isFeatured && <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">Featured</span>}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(item)} className="text-blue-400 hover:text-blue-300 p-2"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Post' : 'Create Post'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="newsForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                    <input required type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title (EN)</label>
                    <input required type="text" value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title (AR)</label>
                    <input required type="text" dir="rtl" value={formData.titleAr} onChange={e => setFormData({...formData, titleAr: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Content (EN)</label>
                    <textarea required rows={5} value={formData.descriptionEn} onChange={e => setFormData({...formData, descriptionEn: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Content (AR)</label>
                    <textarea required rows={5} dir="rtl" value={formData.descriptionAr} onChange={e => setFormData({...formData, descriptionAr: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white outline-none"></textarea>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-3 mt-2">
                    <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 accent-red-600 rounded bg-gray-900 border-gray-800" />
                    <label htmlFor="isFeatured" className="text-white font-medium">Highlight as Featured News</label>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">Cancel</button>
              <button form="newsForm" type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium">{loading ? 'Saving...' : 'Save Post'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
