"use client";
import React, { useState, useEffect } from "react";
import { PageWrapper, SectionCard, FormGrid, FormField, Input, Button } from "@/components/ui/LayoutComponents";
import { Plus, Edit2, Trash2, X, MapPin, ExternalLink } from "lucide-react";

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nameEn: '', nameAr: '', descEn: '', descAr: '', cityEn: '', cityAr: '', mapUrl: '', isActive: true });

  useEffect(() => { fetchBranches(); }, []);
  const fetchBranches = async () => { const res = await fetch('/api/branches'); setBranches(await res.json() || []); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { _id, __v, createdAt, updatedAt, ...payload } = formData as any;
      const res = await fetch(editingId ? `/api/branches/${editingId}` : '/api/branches', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      setIsModalOpen(false); fetchBranches();
    } catch(err) {
      alert("حدث خطأ أثناء الحفظ!");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => { if (confirm('حذف؟')) { await fetch(`/api/branches/${id}`, { method: 'DELETE' }); fetchBranches(); } };

  return (
    <PageWrapper title="المحطات (Branches)" actionButton={<Button onClick={() => { setEditingId(null); setFormData({ nameEn: '', nameAr: '', descEn: '', descAr: '', cityEn: '', cityAr: '', mapUrl: '', isActive: true }); setIsModalOpen(true); }}><Plus size={16}/> أضف محطة</Button>}>
      <SectionCard title="فروع ومحطات الخدمة">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-right text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr><th className="px-6 py-3">الاسم (عربي / English)</th><th className="px-6 py-3">المدينة</th><th className="px-6 py-3">الموقع</th><th className="px-6 py-3 text-left">إجراءات</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {branches.map(br => (
                <tr key={br._id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4"><div className="font-semibold text-slate-900">{br.nameAr}</div><div className="text-slate-500 text-xs" dir="ltr">{br.nameEn}</div></td>
                  <td className="px-6 py-4">{br.cityAr}</td>
                  <td className="px-6 py-4">{br.mapUrl ? <a href={br.mapUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 flex items-center gap-1 hover:underline"><MapPin size={14}/> عرض <ExternalLink size={12}/></a> : '-'}</td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingId(br._id); setFormData(br); setIsModalOpen(true); }} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><Edit2 size={16}/></button>
                      <button onClick={() => handleDelete(br._id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {branches.map(br => (
            <div key={br._id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{br.nameAr}</div>
                  <div className="text-slate-500 text-xs" dir="ltr">{br.nameEn}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditingId(br._id); setFormData(br); setIsModalOpen(true); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(br._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                </div>
              </div>
              <div className="text-sm text-slate-500">📍 {br.cityAr}</div>
              {br.mapUrl && <a href={br.mapUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 flex items-center gap-1 hover:underline"><MapPin size={14}/> عرض الموقع <ExternalLink size={12}/></a>}
            </div>
          ))}
          {branches.length === 0 && <div className="text-center text-slate-400 py-8">لا توجد محطات بعد</div>}
        </div>
      </SectionCard>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">{editingId ? 'تعديل المحطة' : 'إضافة محطة'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400 hover:text-slate-900"/></button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[75vh]">
              <form id="form" onSubmit={handleSubmit} className="space-y-6">
                <FormGrid>
                  <FormField label="اسم المحطة (عربي)"><Input required value={formData.nameAr} onChange={e=>setFormData({...formData, nameAr:e.target.value})} /></FormField>
                  <FormField label="اسم المحطة (English)"><Input required dir="ltr" value={formData.nameEn} onChange={e=>setFormData({...formData, nameEn:e.target.value})} /></FormField>
                  <FormField label="المدينة (عربي)"><Input required value={formData.cityAr} onChange={e=>setFormData({...formData, cityAr:e.target.value})} /></FormField>
                  <FormField label="المدينة (English)"><Input required dir="ltr" value={formData.cityEn} onChange={e=>setFormData({...formData, cityEn:e.target.value})} /></FormField>
                  <FormField label="تفاصيل (عربي)" className="md:col-span-2"><Input value={formData.descAr} onChange={e=>setFormData({...formData, descAr:e.target.value})} /></FormField>
                  <FormField label="تفاصيل (English)" className="md:col-span-2"><Input dir="ltr" value={formData.descEn} onChange={e=>setFormData({...formData, descEn:e.target.value})} /></FormField>
                </FormGrid>
                
                <FormField label="رابط الموقع (Google Maps Link)">
                  <Input dir="ltr" placeholder="https://maps.google.com/..." value={formData.mapUrl} onChange={e=>setFormData({...formData, mapUrl:e.target.value})} />
                  <p className="text-xs text-slate-400 mt-1">افتح Google Maps → اضغط مشاركة → انسخ الرابط والصقه هنا</p>
                </FormField>
              </form>
            </div>
            <div className="p-4 sm:p-6 border-t bg-slate-50 flex justify-end gap-3"><Button variant="outline" onClick={()=>setIsModalOpen(false)}>إلغاء</Button><Button form="form" disabled={loading}>{loading?'جاري...':'حفظ'}</Button></div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
