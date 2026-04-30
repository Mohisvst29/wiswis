"use client";
import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, Image as ImageIcon, CheckCircle } from "lucide-react";

export default function HeroSettingsPage() {
  const [slides, setSlides] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/settings?key=heroSlides').then(r => r.json()).then(data => {
      if (data && data.value && Array.isArray(data.value)) {
        setSlides(data.value);
      } else {
        setSlides(['/assets/wiswis_hero.png']); // Default fallback
      }
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ key: 'heroSlides', value: slides }])
      });
      setToast("تم حفظ صور الهيرو بنجاح!");
      setTimeout(() => setToast(""), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addSlide = () => setSlides([...slides, '']);
  const removeSlide = (index: number) => {
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    setSlides(newSlides);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingIndex(index);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        const newSlides = [...slides];
        newSlides[index] = data.url;
        setSlides(newSlides);
      }
    } catch (err) {
      console.error(err);
      alert("فشل الرفع، تأكد من إعدادات Cloudinary");
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">إدارة صور الهيرو</h1>
          <p className="text-gray-400">تحكم في الصور المتغيرة في واجهة الموقع الرئيسية (Slider).</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-red-900/20 disabled:opacity-50">
          <Save size={20} />
          {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>

      {toast && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle size={24} className="text-emerald-500" />
          <p className="text-emerald-400 font-medium">{toast}</p>
        </div>
      )}

      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-lg space-y-6">
        {slides.map((url, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-6 items-start bg-[#1a1a1a] p-4 rounded-xl border border-white/5 relative group">
            {/* Image Preview */}
            <div className="w-full md:w-64 h-36 bg-black rounded-lg overflow-hidden relative shrink-0 border border-white/10">
              {url ? (
                <img src={url} alt={`Slide ${i+1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <ImageIcon size={40} />
                </div>
              )}
              {uploadingIndex === i && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">رابط الصورة (أو ارفع من الجهاز)</label>
                <input 
                  type="text" 
                  dir="ltr"
                  value={url} 
                  onChange={(e) => {
                    const newSlides = [...slides];
                    newSlides[i] = e.target.value;
                    setSlides(newSlides);
                  }} 
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none text-left" 
                  placeholder="https://..."
                />
              </div>
              
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  اختر صورة من الجهاز
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, i)} />
                </label>
                
                {slides.length > 1 && (
                  <button onClick={() => removeSlide(i)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                    <Trash2 size={16} /> حذف
                  </button>
                )}
              </div>
            </div>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-900 border border-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-red-900/50">
              {i + 1}
            </div>
          </div>
        ))}

        <button onClick={addSlide} className="w-full py-4 border-2 border-dashed border-white/10 hover:border-red-500/50 rounded-xl text-gray-400 hover:text-red-400 flex items-center justify-center gap-2 font-medium transition-colors hover:bg-red-500/5">
          <Plus size={20} /> أضف صورة جديدة للهيرو
        </button>
      </div>
    </div>
  );
}
