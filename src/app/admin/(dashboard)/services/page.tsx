"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, UploadCloud, ImageIcon } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', imageUrl: '', order: 0 });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await fetch('/api/services');
    const data = await res.json();
    setServices(Array.isArray(data) ? data : []);
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
      if (data.url) setFormData(prev => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      alert("فشل رفع الصورة");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId ? `/api/services/${editingId}` : '/api/services';
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setLoading(false);
    setIsModalOpen(false);
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      fetchServices();
    }
  };

  const openEdit = (service: any) => {
    setEditingId(service._id);
    setFormData({
      titleEn: service.titleEn, titleAr: service.titleAr,
      descriptionEn: service.descriptionEn, descriptionAr: service.descriptionAr,
      imageUrl: service.imageUrl, order: service.order || 0
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">إدارة الخدمات</h1>
          <p className="text-gray-400">أضف وعَدّل الخدمات التي تعرضها الشركة في الموقع.</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', imageUrl: '', order: 0 }); setIsModalOpen(true); }} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-red-900/20">
          <Plus size={20} /> إضافة خدمة جديدة
        </button>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-right text-sm text-gray-400">
          <thead className="text-xs text-gray-500 uppercase bg-[#161616] border-b border-white/5">
            <tr>
              <th className="px-6 py-4">الصورة التعبيرية</th>
              <th className="px-6 py-4">اسم الخدمة</th>
              <th className="px-6 py-4 text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {services.map((srv) => (
              <tr key={srv._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-16 h-16 rounded-xl bg-black border border-white/10 overflow-hidden">
                    <img src={srv.imageUrl || '/assets/wiswis_services.png'} alt="" className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-white text-base">{srv.titleAr}</div>
                  <div className="text-gray-500 text-xs" dir="ltr">{srv.titleEn}</div>
                </td>
                <td className="px-6 py-4 text-left">
                  <button onClick={() => openEdit(srv)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-2 rounded-lg transition-colors mx-1"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(srv._id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors mx-1"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">لا توجد خدمات مضافة.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-2xl font-bold text-white">{editingId ? 'تعديل الخدمة' : 'إضافة خدمة'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="serviceForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex items-start gap-6 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="w-24 h-24 bg-black border border-white/10 rounded-xl overflow-hidden shrink-0 relative">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon size={32}/></div>
                    )}
                    {uploadingImage && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>}
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-gray-300 font-medium">الصورة التعبيرية للخدمة</p>
                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
                      <UploadCloud size={18} />
                      رفع صورة من الجهاز
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">اسم الخدمة (عربي)</label>
                    <input required type="text" value={formData.titleAr} onChange={e => setFormData({...formData, titleAr: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">اسم الخدمة (إنجليزي)</label>
                    <input required type="text" dir="ltr" value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 text-left" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">وصف الخدمة (عربي)</label>
                    <textarea required rows={4} value={formData.descriptionAr} onChange={e => setFormData({...formData, descriptionAr: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 resize-none"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">وصف الخدمة (إنجليزي)</label>
                    <textarea required rows={4} dir="ltr" value={formData.descriptionEn} onChange={e => setFormData({...formData, descriptionEn: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 text-left resize-none"></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-white/5 bg-[#161616] flex justify-end gap-4 rounded-b-2xl">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-colors">إلغاء</button>
              <button form="serviceForm" type="submit" disabled={loading} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 disabled:opacity-50">{loading ? 'جاري الحفظ...' : 'حفظ الخدمة'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
