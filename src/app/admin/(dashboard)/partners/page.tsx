"use client";
import React, { useState, useEffect } from "react";
import { PageWrapper, SectionCard, FormGrid, FormField, Input, Button } from "@/components/ui/LayoutComponents";
import { Plus, Trash2, X, UploadCloud, ImageIcon } from "lucide-react";

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', logoUrl: '', order: 0 });

  useEffect(() => { fetchPartners(); }, []);
  const fetchPartners = async () => { const res = await fetch('/api/partners'); setPartners(await res.json() || []); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setFormData(p => ({ ...p, logoUrl: data.url }));
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/partners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setIsModalOpen(false); fetchPartners(); setLoading(false);
  };

  const handleDelete = async (id: string) => { if (confirm('حذف؟')) { await fetch(`/api/partners/${id}`, { method: 'DELETE' }); fetchPartners(); } };

  return (
    <PageWrapper title="شركاء النجاح (Partners)" actionButton={<Button onClick={() => { setFormData({ name: '', logoUrl: '', order: 0 }); setIsModalOpen(true); }}><Plus size={16}/> أضف شريكاً</Button>}>
      <SectionCard title="قائمة الشركاء">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {partners.map((partner) => (
            <div key={partner._id} className="group relative bg-white border border-slate-200 rounded-2xl aspect-square flex flex-col items-center justify-center p-6 shadow-sm hover:border-slate-300 transition-all">
              {partner.logoUrl ? <img src={partner.logoUrl} className="max-w-full max-h-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" /> : <ImageIcon size={32} className="text-slate-300" />}
              <button onClick={() => handleDelete(partner._id)} className="absolute top-2 left-2 bg-white text-red-500 hover:bg-red-50 p-1.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </SectionCard>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">إضافة شريك جديد</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400 hover:text-slate-900"/></button>
            </div>
            <div className="p-6">
              <form id="form" onSubmit={handleSubmit} className="space-y-6">
                <div className="w-32 h-32 mx-auto bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center">
                  {formData.logoUrl ? <img src={formData.logoUrl} className="w-full h-full object-contain p-2" /> : <UploadCloud size={28} className="text-slate-400" />}
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                </div>
                <FormField label="اسم الشريك"><Input required value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} /></FormField>
              </form>
            </div>
            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3"><Button variant="outline" onClick={()=>setIsModalOpen(false)}>إلغاء</Button><Button form="form" disabled={loading||!formData.logoUrl}>{loading?'جاري...':'حفظ'}</Button></div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
