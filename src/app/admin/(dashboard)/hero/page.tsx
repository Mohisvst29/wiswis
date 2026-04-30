"use client";
import React, { useState, useEffect } from "react";
import { Trash2, UploadCloud, Save } from "lucide-react";

export default function HeroPage() {
  const [slides, setSlides] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch('/api/settings?key=heroSlides').then(r => r.json()).then(data => {
      if (data && data.value && Array.isArray(data.value)) {
        setSlides(data.value);
      }
    });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImage(true);
    
    for (let i = 0; i < files.length; i++) {
      const formDataPayload = new FormData();
      formDataPayload.append("file", files[i]);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formDataPayload });
        const data = await res.json();
        if (data.url) {
          setSlides(prev => [...prev, data.url]);
        }
      } catch (err) {
        console.error("فشل رفع الصورة", err);
      }
    }
    setUploadingImage(false);
  };

  const removeSlide = (index: number) => {
    setSlides(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ key: 'heroSlides', value: slides }])
      });
      setToast("تم حفظ صور الهيرو بنجاح");
      setTimeout(() => setToast(""), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">إدارة الهيرو (الواجهة الرئيسية)</h2>
          <p className="text-sm text-slate-500 mt-1">تغيير الصور المتحركة في واجهة الموقع.</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50">
          <Save size={16} />
          {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>

      {toast && (
        <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-3 rounded-lg text-sm font-medium">
          {toast}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">الصور المرفوعة</h3>
            <p className="text-sm text-slate-500 mt-1">سيتم التبديل بين هذه الصور تلقائياً (Slider).</p>
          </div>
          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
            {uploadingImage ? <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div> : <UploadCloud size={16} />}
            إضافة صور
            <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
          </label>
        </div>
        <div className="p-6">
          {slides.length === 0 ? (
            <div className="py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
              لا توجد صور. ارفع صوراً ليتم عرضها في الواجهة.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {slides.map((url, i) => (
                <div key={i} className="group relative bg-slate-100 rounded-xl overflow-hidden aspect-video border border-slate-200 shadow-sm">
                  <img src={url} alt={`Slide ${i}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => removeSlide(i)} className="bg-white text-red-600 hover:bg-red-50 p-2 rounded-lg shadow-lg font-medium text-sm flex items-center gap-2">
                      <Trash2 size={16} /> حذف الصورة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
