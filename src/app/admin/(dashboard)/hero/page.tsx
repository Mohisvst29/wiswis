"use client";
import React, { useState, useEffect } from "react";
import { PageWrapper, SectionCard, Button } from "@/components/ui/LayoutComponents";
import { Trash2, UploadCloud, Save } from "lucide-react";

export default function HeroPage() {
  const [slides, setSlides] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetch('/api/settings?key=heroSlides').then(r => r.json()).then(data => {
      if (data && data.value && Array.isArray(data.value)) setSlides(data.value);
    });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData(); fd.append("file", files[i]);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) setSlides(prev => [...prev, data.url]);
      } catch (err) {}
    }
    setUploadingImage(false);
  };

  const handleSave = async () => {
    setLoading(true);
    await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify([{ key: 'heroSlides', value: slides }]) });
    setLoading(false);
  };

  return (
    <PageWrapper title="واجهة الهيرو (Hero Slider)" actionButton={<Button onClick={handleSave} disabled={loading}><Save size={16}/> {loading ? "جاري الحفظ..." : "حفظ التغييرات"}</Button>}>
      <SectionCard title="صور وخلفيات الهيرو">
        <div className="mb-6 flex justify-end">
          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2">
            {uploadingImage ? <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div> : <UploadCloud size={16} />}
            رفع صور جديدة
            <input type="file" multiple className="hidden" accept="image/*,video/*" onChange={handleImageUpload} disabled={uploadingImage} />
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {slides.map((url, i) => (
            <div key={i} className="group relative bg-slate-100 rounded-2xl overflow-hidden aspect-video border border-slate-200 shadow-sm">
              <img src={url} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => setSlides(prev => prev.filter((_, idx) => idx !== i))} className="bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl shadow-lg font-medium text-sm flex items-center gap-2">
                  <Trash2 size={16} /> إزالة
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </PageWrapper>
  );
}
