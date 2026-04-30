"use client";
import React, { useState, useEffect } from "react";
import { PageWrapper, SectionCard, FormGrid, FormField, Input, Button } from "@/components/ui/LayoutComponents";
import { Plus, Edit2, Trash2, X, MapPin } from "lucide-react";
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false, loading: () => <div className="h-48 bg-slate-100 rounded-xl animate-pulse"></div> });

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nameEn: '', nameAr: '', descEn: '', descAr: '', cityEn: '', cityAr: '', mapUrl: '', lat: 24.7136, lng: 46.6753, isActive: true });

  useEffect(() => { fetchBranches(); }, []);
  const fetchBranches = async () => { const res = await fetch('/api/branches'); setBranches(await res.json() || []); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { _id, ...payload } = formData as any;
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
    <PageWrapper title="المحطات (Branches)" actionButton={<Button onClick={() => { setEditingId(null); setFormData({ nameEn: '', nameAr: '', descEn: '', descAr: '', cityEn: '', cityAr: '', mapUrl: '', lat: 24.7136, lng: 46.6753, isActive: true }); setIsModalOpen(true); }}><Plus size={16}/> أضف محطة</Button>}>
      <SectionCard title="فروع ومحطات الخدمة">
        <table className="w-full text-right text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr><th className="px-6 py-3">الاسم (عربي / English)</th><th className="px-6 py-3">المدينة</th><th className="px-6 py-3">الخريطة</th><th className="px-6 py-3 text-left">إجراءات</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {branches.map(br => (
              <tr key={br._id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4"><div className="font-semibold text-slate-900">{br.nameAr}</div><div className="text-slate-500 text-xs" dir="ltr">{br.nameEn}</div></td>
                <td className="px-6 py-4">{br.cityAr}</td>
                <td className="px-6 py-4">{br.lat && br.lng ? <span className="text-emerald-600 flex items-center gap-1"><MapPin size={14}/> {br.lat.toFixed(4)}, {br.lng.toFixed(4)}</span> : '-'}</td>
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
      </SectionCard>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">{editingId ? 'تعديل المحطة' : 'إضافة محطة'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400 hover:text-slate-900"/></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <form id="form" onSubmit={handleSubmit} className="space-y-8">
                <FormGrid>
                  <FormField label="اسم المحطة (عربي)"><Input required value={formData.nameAr} onChange={e=>setFormData({...formData, nameAr:e.target.value})} /></FormField>
                  <FormField label="اسم المحطة (English)"><Input required dir="ltr" value={formData.nameEn} onChange={e=>setFormData({...formData, nameEn:e.target.value})} /></FormField>
                  <FormField label="المدينة (عربي)"><Input required value={formData.cityAr} onChange={e=>setFormData({...formData, cityAr:e.target.value})} /></FormField>
                  <FormField label="المدينة (English)"><Input required dir="ltr" value={formData.cityEn} onChange={e=>setFormData({...formData, cityEn:e.target.value})} /></FormField>
                  <FormField label="تفاصيل (عربي)" className="md:col-span-2"><Input value={formData.descAr} onChange={e=>setFormData({...formData, descAr:e.target.value})} /></FormField>
                  <FormField label="تفاصيل (English)" className="md:col-span-2"><Input dir="ltr" value={formData.descEn} onChange={e=>setFormData({...formData, descEn:e.target.value})} /></FormField>
                </FormGrid>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900">تحديد الموقع على الخريطة (Map Picker)</h3>
                  <div className="h-64 rounded-xl overflow-hidden border border-slate-200">
                    <MapPicker lat={formData.lat} lng={formData.lng} onChange={(lat: number, lng: number) => setFormData({...formData, lat, lng})} />
                  </div>
                  <FormGrid>
                    <FormField label="خط العرض (Lat)"><Input dir="ltr" type="number" step="any" value={formData.lat} readOnly className="bg-slate-50" /></FormField>
                    <FormField label="خط الطول (Lng)"><Input dir="ltr" type="number" step="any" value={formData.lng} readOnly className="bg-slate-50" /></FormField>
                  </FormGrid>
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
