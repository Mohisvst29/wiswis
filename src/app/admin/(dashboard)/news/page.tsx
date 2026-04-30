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
    <div className="space-y-6 animate-in fade-in duration-200 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">الأخبار والمقالات</h2>
          <p className="text-sm text-slate-500 mt-1">نشر الأخبار والفعاليات في الموقع.</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', imageUrl: '', isFeatured: false }); setIsModalOpen(true); }} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={16} /> إضافة خبر
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3 font-medium">الصورة</th>
                <th className="px-6 py-3 font-medium">العنوان</th>
                <th className="px-6 py-3 font-medium">التاريخ</th>
                <th className="px-6 py-3 font-medium">حالة التمييز</th>
                <th className="px-6 py-3 font-medium text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {news.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-20 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={16} className="text-slate-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 truncate max-w-[200px]">{item.titleAr}</div>
                    <div className="text-slate-500 text-xs mt-0.5 truncate max-w-[200px]" dir="ltr">{item.titleEn}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{new Date(item.date).toLocaleDateString('ar-EG')}</td>
                  <td className="px-6 py-4">
                    {item.isFeatured && <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">خبر رئيسي</span>}
                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-md transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(item._id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {news.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">لا توجد أخبار مضافة.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-900">{editingId ? 'تعديل الخبر' : 'نشر خبر جديد'}</h2>
                <p className="text-sm text-slate-500">صياغة عنوان وتفاصيل الخبر.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="newsForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex items-start gap-5">
                  <div className="w-32 h-20 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shrink-0 relative flex items-center justify-center">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-slate-400" />
                    )}
                    {uploadingImage && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-slate-700 block">صورة الغلاف للخبر</label>
                    <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
                      <UploadCloud size={16} /> رفع صورة
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 block">عنوان الخبر (عربي)</label>
                    <input required type="text" value={formData.titleAr} onChange={e => setFormData({...formData, titleAr: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 block">عنوان الخبر (إنجليزي)</label>
                    <input required type="text" dir="ltr" value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-left" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 block">محتوى الخبر (عربي)</label>
                    <textarea required rows={5} value={formData.descriptionAr} onChange={e => setFormData({...formData, descriptionAr: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all resize-none"></textarea>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 block">محتوى الخبر (إنجليزي)</label>
                    <textarea required rows={5} dir="ltr" value={formData.descriptionEn} onChange={e => setFormData({...formData, descriptionEn: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-left resize-none"></textarea>
                  </div>
                  
                  <div className="md:col-span-2 flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-4 h-4 text-slate-900 bg-white border-slate-300 rounded focus:ring-slate-900" />
                    <label htmlFor="isFeatured" className="text-sm font-medium text-slate-900 cursor-pointer">تمييز كخبر رئيسي (سيظهر في واجهة قسم الأخبار)</label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 text-sm font-medium transition-colors">إلغاء</button>
              <button form="newsForm" type="submit" disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50">
                {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
