"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, UploadCloud, ImageIcon } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
    const url = editingId ? `/api/news/${editingId}` : '/api/news';
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setLoading(false);
    setIsModalOpen(false);
    fetchNews();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">الأخبار والمقالات</h1>
          <p className="text-gray-400">شارك أحدث أخبار وفعاليات الشركة.</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', imageUrl: '', isFeatured: false }); setIsModalOpen(true); }} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-red-900/20">
          <Plus size={20} /> نشر خبر جديد
        </button>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-right text-sm text-gray-400">
          <thead className="text-xs text-gray-500 uppercase bg-[#161616] border-b border-white/5">
            <tr>
              <th className="px-6 py-4">صورة الخبر</th>
              <th className="px-6 py-4">العنوان</th>
              <th className="px-6 py-4">التاريخ</th>
              <th className="px-6 py-4">مميز</th>
              <th className="px-6 py-4 text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-20 h-12 rounded-lg bg-black border border-white/10 overflow-hidden">
                    <img src={item.imageUrl || '/assets/wiswis_services.png'} alt="" className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-white text-base max-w-xs truncate">{item.titleAr}</div>
                  <div className="text-gray-500 text-xs truncate max-w-xs" dir="ltr">{item.titleEn}</div>
                </td>
                <td className="px-6 py-4">{new Date(item.date).toLocaleDateString('ar-EG')}</td>
                <td className="px-6 py-4">
                  {item.isFeatured && <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">خبر رئيسي</span>}
                </td>
                <td className="px-6 py-4 text-left">
                  <button onClick={() => openEdit(item)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-2 rounded-lg transition-colors mx-1"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors mx-1"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {news.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">لا توجد أخبار.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-2xl font-bold text-white">{editingId ? 'تعديل الخبر' : 'نشر خبر جديد'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="newsForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex items-center gap-6 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="w-40 h-24 bg-black border border-white/10 rounded-xl overflow-hidden shrink-0 relative">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon size={32}/></div>
                    )}
                    {uploadingImage && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>}
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-gray-300 font-medium">صورة الغلاف للخبر</p>
                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
                      <UploadCloud size={18} />
                      رفع صورة من الجهاز
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">عنوان الخبر (عربي)</label>
                    <input required type="text" value={formData.titleAr} onChange={e => setFormData({...formData, titleAr: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">عنوان الخبر (إنجليزي)</label>
                    <input required type="text" dir="ltr" value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 text-left" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">محتوى الخبر (عربي)</label>
                    <textarea required rows={6} value={formData.descriptionAr} onChange={e => setFormData({...formData, descriptionAr: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 resize-none"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">محتوى الخبر (إنجليزي)</label>
                    <textarea required rows={6} dir="ltr" value={formData.descriptionEn} onChange={e => setFormData({...formData, descriptionEn: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 text-left resize-none"></textarea>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                    <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-6 h-6 accent-red-600 rounded cursor-pointer" />
                    <label htmlFor="isFeatured" className="text-white font-medium cursor-pointer">تمييز كخبر رئيسي هام (يظهر في المقدمة)</label>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-white/5 bg-[#161616] flex justify-end gap-4 rounded-b-2xl">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-colors">إلغاء</button>
              <button form="newsForm" type="submit" disabled={loading} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 disabled:opacity-50">{loading ? 'جاري الحفظ...' : 'حفظ الخبر'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
