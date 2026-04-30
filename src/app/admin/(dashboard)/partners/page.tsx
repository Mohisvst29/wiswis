"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, UploadCloud, ImageIcon } from "lucide-react";

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', logoUrl: '', order: 0 });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    const res = await fetch('/api/partners');
    const data = await res.json();
    setPartners(Array.isArray(data) ? data : []);
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
      if (data.url) setFormData(prev => ({ ...prev, logoUrl: data.url }));
    } catch (err) {
      alert("فشل رفع الشعار");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/partners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setLoading(false);
    setIsModalOpen(false);
    fetchPartners();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الشريك؟')) {
      await fetch(`/api/partners/${id}`, { method: 'DELETE' });
      fetchPartners();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">شركاء النجاح</h2>
          <p className="text-sm text-slate-500 mt-1">إضافة وإدارة شعارات الشركات المتعاونة.</p>
        </div>
        <button onClick={() => { setFormData({ name: '', logoUrl: '', order: 0 }); setIsModalOpen(true); }} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Plus size={16} /> إضافة شريك
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {partners.map((partner) => (
            <div key={partner._id} className="group relative bg-slate-50 border border-slate-200 rounded-xl aspect-square flex flex-col items-center justify-center p-4 hover:border-slate-300 transition-all">
              {partner.logoUrl ? (
                <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
              ) : (
                <ImageIcon size={32} className="text-slate-300" />
              )}
              
              <button 
                onClick={() => handleDelete(partner._id)} 
                className="absolute top-2 left-2 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 p-1.5 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
              
              <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur border-t border-slate-200 py-2 text-center transform translate-y-full group-hover:translate-y-0 transition-transform text-xs font-medium text-slate-700">
                {partner.name}
              </div>
            </div>
          ))}
          {partners.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">لا يوجد شركاء مضافين حالياً.</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-900">إضافة شريك جديد</h2>
                <p className="text-sm text-slate-500">ارفع شعار الشركة الشريكة.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100"><X size={20} /></button>
            </div>
            
            <div className="p-6">
              <form id="partnerForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 text-center">
                  <div className="w-32 h-32 mx-auto bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl overflow-hidden relative flex flex-col items-center justify-center group hover:border-slate-400 transition-colors">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} className="w-full h-full object-contain p-2" />
                    ) : (
                      <>
                        <UploadCloud size={28} className="text-slate-400 mb-2" />
                        <span className="text-xs font-medium text-slate-500">اختر شعار</span>
                      </>
                    )}
                    {uploadingImage && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>}
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 block">اسم الشريك (للتعريف فقط)</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all" />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 text-sm font-medium transition-colors">إلغاء</button>
              <button form="partnerForm" type="submit" disabled={loading || !formData.logoUrl} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50">
                {loading ? 'جاري الحفظ...' : 'إضافة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
