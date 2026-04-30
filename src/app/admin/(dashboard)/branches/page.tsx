"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Map as MapIcon } from "lucide-react";

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
    <div className="space-y-6 animate-in fade-in duration-200 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">المحطات والفروع</h2>
          <p className="text-sm text-slate-500 mt-1">إدارة المحطات، عناوينها، وإحداثيات الخريطة.</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ nameEn: '', nameAr: '', descEn: '', descAr: '', cityEn: '', cityAr: '', mapUrl: '', lat: 0, lng: 0, isActive: true }); setIsModalOpen(true); }} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={16} /> إضافة محطة
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3 font-medium">اسم المحطة</th>
                <th className="px-6 py-3 font-medium">المنطقة</th>
                <th className="px-6 py-3 font-medium">الخريطة</th>
                <th className="px-6 py-3 font-medium">الحالة</th>
                <th className="px-6 py-3 font-medium text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {branches.map((br) => (
                <tr key={br._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{br.nameAr}</div>
                    <div className="text-slate-500 text-xs mt-0.5" dir="ltr">{br.nameEn}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{br.cityAr}</td>
                  <td className="px-6 py-4">
                    {br.mapUrl ? (
                      <a href={br.mapUrl} target="_blank" className="text-slate-500 hover:text-slate-900 flex items-center gap-1"><MapIcon size={16}/> عرض</a>
                    ) : <span className="text-slate-400">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${br.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {br.isActive ? 'نشط' : 'مغلق'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(br)} className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-md transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(br._id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {branches.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">لا توجد محطات مضافة.</td>
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
                <h2 className="text-xl font-semibold text-slate-900">{editingId ? 'تعديل المحطة' : 'إضافة محطة جديدة'}</h2>
                <p className="text-sm text-slate-500">سجل بيانات وموقع المحطة.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="branchForm" onSubmit={handleSubmit} className="space-y-8">
                
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">البيانات الأساسية</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 block">اسم المحطة (عربي)</label>
                      <input required type="text" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 block">اسم المحطة (إنجليزي)</label>
                      <input required type="text" dir="ltr" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-left" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 block">المنطقة (عربي)</label>
                      <input required type="text" value={formData.cityAr} onChange={e => setFormData({...formData, cityAr: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 block">المنطقة (إنجليزي)</label>
                      <input required type="text" dir="ltr" value={formData.cityEn} onChange={e => setFormData({...formData, cityEn: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-left" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-700 block">تفاصيل الخدمات (عربي)</label>
                      <input required type="text" value={formData.descAr} onChange={e => setFormData({...formData, descAr: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-700 block">تفاصيل الخدمات (إنجليزي)</label>
                      <input required type="text" dir="ltr" value={formData.descEn} onChange={e => setFormData({...formData, descEn: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-left" />
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-100"></div>

                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">إحداثيات الخريطة</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-700 block">رابط خرائط جوجل (Map URL)</label>
                      <input type="text" dir="ltr" value={formData.mapUrl} onChange={e => setFormData({...formData, mapUrl: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-left" placeholder="https://goo.gl/maps/..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 block">خط العرض (Latitude)</label>
                      <input type="number" step="any" dir="ltr" value={formData.lat} onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-left" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 block">خط الطول (Longitude)</label>
                      <input type="number" step="any" dir="ltr" value={formData.lng} onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-left" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-4 h-4 text-slate-900 bg-white border-slate-300 rounded focus:ring-slate-900" />
                  <label htmlFor="isActive" className="text-sm font-medium text-slate-900 cursor-pointer">المحطة نشطة وتعمل حالياً</label>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 text-sm font-medium transition-colors">إلغاء</button>
              <button form="branchForm" type="submit" disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50">
                {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
