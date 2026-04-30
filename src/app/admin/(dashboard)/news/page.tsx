"use client";
import React, { useState, useEffect } from "react";
import { PageWrapper, SectionCard, FormGrid, FormField, Input, Textarea, Button } from "@/components/ui/LayoutComponents";
import { Plus, Edit2, Trash2, X, UploadCloud, ImageIcon } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', imageUrl: '', isFeatured: false });

  useEffect(() => { fetchNews(); }, []);
  const fetchNews = async () => { const res = await fetch('/api/news'); setNews(await res.json() || []); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setFormData(p => ({ ...p, imageUrl: data.url }));
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch(editingId ? `/api/news/${editingId}` : '/api/news', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setIsModalOpen(false); fetchNews(); setLoading(false);
  };

  const handleDelete = async (id: string) => { if (confirm('حذف؟')) { await fetch(`/api/news/${id}`, { method: 'DELETE' }); fetchNews(); } };

  return (
    <PageWrapper title="الأخبار والمقالات (News)" actionButton={<Button onClick={() => { setEditingId(null); setFormData({ titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', imageUrl: '', isFeatured: false }); setIsModalOpen(true); }}><Plus size={16}/> أضف خبراً</Button>}>
      <SectionCard title="قائمة الأخبار">
        <table className="w-full text-right text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr><th className="px-6 py-3">الصورة</th><th className="px-6 py-3">العنوان</th><th className="px-6 py-3">الحالة</th><th className="px-6 py-3 text-left">إجراءات</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {news.map(item => (
              <tr key={item._id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4"><img src={item.imageUrl} className="w-16 h-10 rounded-lg object-cover" /></td>
                <td className="px-6 py-4"><div className="font-semibold text-slate-900 truncate max-w-[200px]">{item.titleAr}</div><div className="text-slate-500 text-xs truncate max-w-[200px]" dir="ltr">{item.titleEn}</div></td>
                <td className="px-6 py-4">{item.isFeatured ? <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-200">رئيسي</span> : '-'}</td>
                <td className="px-6 py-4 text-left">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditingId(item._id); setFormData(item); setIsModalOpen(true); }} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">{editingId ? 'تعديل' : 'إضافة'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400 hover:text-slate-900"/></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form id="form" onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-24 h-16 bg-slate-50 rounded-xl overflow-hidden border">{formData.imageUrl ? <img src={formData.imageUrl} className="w-full h-full object-cover"/> : <ImageIcon className="m-auto mt-4 text-slate-300"/>}</div>
                  <label className="bg-slate-100 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer h-10 mt-3"><UploadCloud size={16}/> رفع صورة غلاف<input type="file" hidden onChange={handleImageUpload}/></label>
                </div>
                <FormGrid>
                  <FormField label="العنوان (عربي)"><Input required value={formData.titleAr} onChange={e=>setFormData({...formData, titleAr:e.target.value})} /></FormField>
                  <FormField label="العنوان (English)"><Input required dir="ltr" value={formData.titleEn} onChange={e=>setFormData({...formData, titleEn:e.target.value})} /></FormField>
                  <FormField label="المحتوى (عربي)" className="md:col-span-2"><Textarea required rows={4} value={formData.descriptionAr} onChange={e=>setFormData({...formData, descriptionAr:e.target.value})} /></FormField>
                  <FormField label="المحتوى (English)" className="md:col-span-2"><Textarea required dir="ltr" rows={4} value={formData.descriptionEn} onChange={e=>setFormData({...formData, descriptionEn:e.target.value})} /></FormField>
                </FormGrid>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={e=>setFormData({...formData, isFeatured:e.target.checked})} className="w-4 h-4 rounded text-slate-900" />
                  <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer">تمييز كخبر رئيسي</label>
                </div>
              </form>
            </div>
            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3"><Button variant="outline" onClick={()=>setIsModalOpen(false)}>إلغاء</Button><Button form="form" disabled={loading}>{loading?'جاري...':'حفظ'}</Button></div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
