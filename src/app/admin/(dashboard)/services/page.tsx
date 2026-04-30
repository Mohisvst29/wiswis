"use client";
import React, { useState, useEffect } from "react";
import { PageWrapper, SectionCard, FormGrid, FormField, Input, Textarea, Button } from "@/components/ui/LayoutComponents";
import { Plus, Edit2, Trash2, X, UploadCloud, ImageIcon } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', imageUrl: '', order: 0 });

  useEffect(() => { fetchServices(); }, []);
  const fetchServices = async () => { const res = await fetch('/api/services'); setServices(await res.json() || []); };

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
    await fetch(editingId ? `/api/services/${editingId}` : '/api/services', {
      method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    });
    setIsModalOpen(false);
    fetchServices();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('حذف؟')) { await fetch(`/api/services/${id}`, { method: 'DELETE' }); fetchServices(); }
  };

  return (
    <PageWrapper 
      title="الخدمات (Services)" 
      actionButton={<Button onClick={() => { setEditingId(null); setFormData({ titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', imageUrl: '', order: 0 }); setIsModalOpen(true); }}><Plus size={16}/> أضف خدمة</Button>}
    >
      <SectionCard title="قائمة الخدمات">
        <table className="w-full text-right text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr><th className="px-6 py-3">الصورة</th><th className="px-6 py-3">الاسم (عربي / English)</th><th className="px-6 py-3">الوصف</th><th className="px-6 py-3 text-left">إجراءات</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map(srv => (
              <tr key={srv._id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4"><img src={srv.imageUrl} className="w-12 h-12 rounded-xl object-cover" /></td>
                <td className="px-6 py-4"><div className="font-semibold text-slate-900">{srv.titleAr}</div><div className="text-slate-500 text-xs" dir="ltr">{srv.titleEn}</div></td>
                <td className="px-6 py-4 truncate max-w-[200px]">{srv.descriptionAr}</td>
                <td className="px-6 py-4 text-left">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditingId(srv._id); setFormData(srv); setIsModalOpen(true); }} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(srv._id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={16}/></button>
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
                  <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border">{formData.imageUrl ? <img src={formData.imageUrl} className="w-full h-full object-cover"/> : <ImageIcon className="m-auto mt-6 text-slate-300"/>}</div>
                  <label className="bg-slate-100 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer h-10 mt-5"><UploadCloud size={16}/> رفع صورة<input type="file" hidden onChange={handleImageUpload}/></label>
                </div>
                <FormGrid>
                  <FormField label="الاسم (عربي)"><Input required value={formData.titleAr} onChange={e=>setFormData({...formData, titleAr:e.target.value})} /></FormField>
                  <FormField label="الاسم (English)"><Input required dir="ltr" value={formData.titleEn} onChange={e=>setFormData({...formData, titleEn:e.target.value})} /></FormField>
                  <FormField label="الوصف (عربي)" className="md:col-span-2"><Textarea required rows={3} value={formData.descriptionAr} onChange={e=>setFormData({...formData, descriptionAr:e.target.value})} /></FormField>
                  <FormField label="الوصف (English)" className="md:col-span-2"><Textarea required dir="ltr" rows={3} value={formData.descriptionEn} onChange={e=>setFormData({...formData, descriptionEn:e.target.value})} /></FormField>
                </FormGrid>
              </form>
            </div>
            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3"><Button variant="outline" onClick={()=>setIsModalOpen(false)}>إلغاء</Button><Button form="form" disabled={loading}>{loading?'جاري...':'حفظ'}</Button></div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
