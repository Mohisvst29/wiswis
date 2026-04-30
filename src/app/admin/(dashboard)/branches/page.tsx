"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, UploadCloud, Map as MapIcon } from "lucide-react";

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ nameEn: '', nameAr: '', descEn: '', descAr: '', cityEn: '', cityAr: '', mapUrl: '', lat: 0, lng: 0, isActive: true });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const res = await fetch('/api/branches');
    const data = await res.json();
    setBranches(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId ? `/api/branches/${editingId}` : '/api/branches';
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setLoading(false);
    setIsModalOpen(false);
    fetchBranches();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المحطة؟')) {
      await fetch(`/api/branches/${id}`, { method: 'DELETE' });
      fetchBranches();
    }
  };

  const openEdit = (branch: any) => {
    setEditingId(branch._id);
    setFormData({
      nameEn: branch.nameEn, nameAr: branch.nameAr,
      descEn: branch.descEn, descAr: branch.descAr,
      cityEn: branch.cityEn, cityAr: branch.cityAr,
      mapUrl: branch.mapUrl || '',
      lat: branch.lat || 0, lng: branch.lng || 0, isActive: branch.isActive
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">إدارة المحطات والفروع</h1>
          <p className="text-gray-400">أضف محطاتك وحدد موقعها على الخريطة ليتمكن العملاء من الوصول إليها.</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ nameEn: '', nameAr: '', descEn: '', descAr: '', cityEn: '', cityAr: '', mapUrl: '', lat: 0, lng: 0, isActive: true }); setIsModalOpen(true); }} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-red-900/20">
          <Plus size={20} /> إضافة محطة جديدة
        </button>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-right text-sm text-gray-400">
          <thead className="text-xs text-gray-500 uppercase bg-[#161616] border-b border-white/5">
            <tr>
              <th className="px-6 py-4">اسم المحطة</th>
              <th className="px-6 py-4">المنطقة / المدينة</th>
              <th className="px-6 py-4">الخريطة</th>
              <th className="px-6 py-4">الحالة</th>
              <th className="px-6 py-4 text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((br) => (
              <tr key={br._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-white text-base">{br.nameAr}</div>
                  <div className="text-gray-500 text-xs" dir="ltr">{br.nameEn}</div>
                </td>
                <td className="px-6 py-4 font-medium">{br.cityAr}</td>
                <td className="px-6 py-4">
                  {br.mapUrl ? (
                    <a href={br.mapUrl} target="_blank" className="text-red-400 hover:text-red-300 flex items-center gap-1"><MapIcon size={16}/> عرض</a>
                  ) : <span className="text-gray-600">-</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${br.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {br.isActive ? 'تعمل حالياً' : 'مغلقة'}
                  </span>
                </td>
                <td className="px-6 py-4 text-left">
                  <button onClick={() => openEdit(br)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-2 rounded-lg transition-colors mx-1"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(br._id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors mx-1"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {branches.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">لا توجد محطات مضافة.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-2xl font-bold text-white">{editingId ? 'تعديل المحطة' : 'إضافة محطة'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="branchForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">اسم المحطة (عربي)</label>
                    <input required type="text" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500" placeholder="مثال: محطة السعادة" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">اسم المحطة (إنجليزي)</label>
                    <input required type="text" dir="ltr" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 text-left" placeholder="Example: Al-Saada Station" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">المنطقة (عربي)</label>
                    <input required type="text" value={formData.cityAr} onChange={e => setFormData({...formData, cityAr: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500" placeholder="مثال: الرياض" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">المنطقة (إنجليزي)</label>
                    <input required type="text" dir="ltr" value={formData.cityEn} onChange={e => setFormData({...formData, cityEn: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 text-left" placeholder="Example: Riyadh" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">تفاصيل المحطة والخدمات المتوفرة (عربي)</label>
                    <input required type="text" value={formData.descAr} onChange={e => setFormData({...formData, descAr: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500" placeholder="بنزين 91، ديزل، سوبرماركت..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">تفاصيل المحطة والخدمات المتوفرة (إنجليزي)</label>
                    <input required type="text" dir="ltr" value={formData.descEn} onChange={e => setFormData({...formData, descEn: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 text-left" placeholder="Benzene 91, Diesel, Supermarket..." />
                  </div>
                  <div className="md:col-span-2 border-t border-white/5 pt-6 mt-2">
                    <h3 className="text-lg font-bold text-white mb-4">إعدادات الخريطة</h3>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">رابط الخريطة (Google Maps URL)</label>
                    <input type="text" dir="ltr" value={formData.mapUrl} onChange={e => setFormData({...formData, mapUrl: e.target.value})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 text-left" placeholder="https://goo.gl/maps/..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">خط العرض (Latitude)</label>
                    <input type="number" step="any" dir="ltr" value={formData.lat} onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 text-left" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">خط الطول (Longitude)</label>
                    <input type="number" step="any" dir="ltr" value={formData.lng} onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 text-left" />
                  </div>
                  
                  <div className="md:col-span-2 flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                    <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-6 h-6 accent-red-600 rounded cursor-pointer" />
                    <label htmlFor="isActive" className="text-white font-medium cursor-pointer">هذه المحطة تعمل حالياً وجاهزة لاستقبال العملاء</label>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-white/5 bg-[#161616] flex justify-end gap-4 rounded-b-2xl">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-colors">إلغاء</button>
              <button form="branchForm" type="submit" disabled={loading} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 disabled:opacity-50">{loading ? 'جاري الحفظ...' : 'حفظ المحطة'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
