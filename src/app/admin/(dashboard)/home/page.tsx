"use client";
import React, { useState, useEffect } from "react";
import { PageWrapper, SectionCard, FormGrid, FormField, Input, Textarea, Button } from "@/components/ui/LayoutComponents";
import { Trash2, UploadCloud, Save } from "lucide-react";

export default function HomePageAdmin() {
  const [slides, setSlides] = useState<string[]>([]);
  const [about, setAbout] = useState({
    title: { ar: "", en: "" },
    description: { ar: "", en: "" },
    yearsOfExperience: 10,
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAboutImg, setUploadingAboutImg] = useState(false);

  useEffect(() => {
    // Fetch Hero Slides
    fetch('/api/settings?key=heroSlides').then(r => r.json()).then(data => {
      if (data && data.value && Array.isArray(data.value)) setSlides(data.value);
    });
    // Fetch About Data
    fetch('/api/about').then(r => r.json()).then(data => {
      if (data) setAbout(data);
    });
  }, []);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleAboutImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAboutImg(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setAbout(prev => ({ ...prev, image: data.url }));
    } catch (err) {}
    setUploadingAboutImg(false);
  };

  const handleSave = async () => {
    setLoading(true);
    // Save Hero
    await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify([{ key: 'heroSlides', value: slides }]) });
    // Save About
    await fetch('/api/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(about) });
    setLoading(false);
    alert("تم حفظ التعديلات بنجاح!");
  };

  return (
    <PageWrapper 
      title="محتوى الصفحة الرئيسية" 
      description="إدارة جميع أقسام الصفحة الرئيسية (البانر العلوي، من نحن، إلخ)"
      actionButton={<Button onClick={handleSave} disabled={loading}><Save size={18}/> {loading ? "جاري الحفظ..." : "حفظ التغييرات"}</Button>}
    >
      <SectionCard title="1. البانر العلوي (Hero Slider)" description="الصور التي تظهر في بداية الموقع">
        <div className="mb-6">
          <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 h-11 px-6 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2">
            {uploadingImage ? <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div> : <UploadCloud size={16} />}
            رفع صور جديدة
            <input type="file" multiple className="hidden" accept="image/*" onChange={handleHeroUpload} disabled={uploadingImage} />
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {slides.map((url, i) => (
            <div key={i} className="group relative bg-gray-100 rounded-2xl overflow-hidden aspect-video border border-gray-200 shadow-sm">
              <img src={url} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => setSlides(prev => prev.filter((_, idx) => idx !== i))} className="bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2">
                  <Trash2 size={16} /> إزالة
                </button>
              </div>
            </div>
          ))}
          {slides.length === 0 && <div className="col-span-full text-center text-gray-500 py-8">لا توجد صور مضافة للبانر.</div>}
        </div>
      </SectionCard>

      <SectionCard title="2. قسم من نحن (About Us)" description="النصوص والصورة الخاصة بقسم من نحن في الصفحة الرئيسية">
        <FormGrid>
          <FormField label="العنوان (عربي)">
            <Input value={about.title.ar} onChange={e => setAbout({...about, title: {...about.title, ar: e.target.value}})} />
          </FormField>
          <FormField label="العنوان (إنجليزي)">
            <Input dir="ltr" value={about.title.en} onChange={e => setAbout({...about, title: {...about.title, en: e.target.value}})} />
          </FormField>
          
          <FormField label="الوصف (عربي)">
            <Textarea rows={4} value={about.description.ar} onChange={e => setAbout({...about, description: {...about.description, ar: e.target.value}})} />
          </FormField>
          <FormField label="الوصف (إنجليزي)">
            <Textarea dir="ltr" rows={4} value={about.description.en} onChange={e => setAbout({...about, description: {...about.description, en: e.target.value}})} />
          </FormField>

          <FormField label="سنوات الخبرة">
            <Input type="number" dir="ltr" value={about.yearsOfExperience} onChange={e => setAbout({...about, yearsOfExperience: parseInt(e.target.value) || 0})} />
          </FormField>
          
          <FormField label="صورة القسم">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center p-2 relative overflow-hidden">
                {about.image ? <img src={about.image} className="max-h-full max-w-full object-cover" /> : <span className="text-gray-400 text-xs text-center">لا توجد صورة</span>}
                {uploadingAboutImg && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>}
              </div>
              <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 h-11 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2">
                <UploadCloud size={18} /> تغيير الصورة
                <input type="file" className="hidden" accept="image/*" onChange={handleAboutImgUpload} />
              </label>
            </div>
          </FormField>
        </FormGrid>
      </SectionCard>
    </PageWrapper>
  );
}
