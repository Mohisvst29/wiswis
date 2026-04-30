"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, UploadCloud, ImageIcon } from "lucide-react";

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formDataPayload = new FormData();
    formDataPayload.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formDataPayload });
      const data = await res.json();
      if (data.url) setFormData(prev => ({ ...prev, logoUrl: data.url }));
    } catch (err) {
      alert("فشل رفع الصورة");
    } finally {
      setUploadingImage(false);
    }
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
    if (confirm('هل أنت متأكد من إزالة هذا الشريك؟')) {
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">شركاء النجاح</h1>
          <p className="text-gray-400">إدارة شعارات الشركاء التي تظهر في شريط الماركات.</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ name: '', logoUrl: '', order: 0 }); setIsModalOpen(true); }} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-red-900/20">
          <Plus size={20} /> إضافة شريك جديد
        </button>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-right text-sm text-gray-400">
          <thead className="text-xs text-gray-500 uppercase bg-[#161616] border-b border-white/5">
            <tr>
              <th className="px-6 py-4">الشعار</th>
              <th className="px-6 py-4">اسم الشريك</th>
              <th className="px-6 py-4">الترتيب</th>
              <th className="px-6 py-4 text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="h-12 w-24 bg-white/5 rounded flex items-center justify-center p-2">
                    <img src={p.logoUrl} alt={p.name} className="max-h-full max-w-full object-contain" />
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-white text-base">{p.name}</td>
                <td className="px-6 py-4 font-mono text-gray-500">{p.order}</td>
                <td className="px-6 py-4 text-left">
                  <button onClick={() => openEdit(p)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-2 rounded-lg transition-colors mx-1"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors mx-1"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {partners.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">لا يوجد شركاء.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-2xl font-bold text-white">{editingId ? 'تعديل الشريك' : 'إضافة شريك جديد'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5"><X size={24} /></button>
            </div>
            <div className="p-6">
              <form id="partnerForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex flex-col items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                  <div className="w-32 h-20 bg-black border border-white/10 rounded-lg overflow-hidden shrink-0 relative flex items-center justify-center p-2">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon size={32} className="text-gray-600" />
                    )}
                    {uploadingImage && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>}
                  </div>
                  <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
                    <UploadCloud size={18} />
                    رفع الشعار
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">اسم الشريك (الشركة)</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ترتيب الظهور (رقم)</label>
                  <input required type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 text-left" dir="ltr" />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-white/5 bg-[#161616] flex justify-end gap-4 rounded-b-2xl">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-colors">إلغاء</button>
              <button form="partnerForm" type="submit" disabled={loading} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 disabled:opacity-50">{loading ? 'جاري الحفظ...' : 'حفظ'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
