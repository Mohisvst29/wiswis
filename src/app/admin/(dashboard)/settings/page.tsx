"use client";
import React, { useState, useEffect } from "react";
import { Save, UploadCloud } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      setSettings(data || {});
    });
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = Object.entries(settings).map(([key, value]) => ({ key, value }));
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setToast("تم حفظ الإعدادات بنجاح");
      setTimeout(() => setToast(""), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) handleChange('logoUrl', data.url);
    } catch (err) {
      alert("فشل رفع الشعار");
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">الإعدادات والمظهر</h2>
          <p className="text-sm text-slate-500 mt-1">إدارة إعدادات الموقع، الألوان، الخطوط، وبيانات التواصل.</p>
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

      {/* Card 1: Identity */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">الهوية البصرية (الشعار)</h3>
          <p className="text-sm text-slate-500 mt-1">تحديث شعار الموقع وأبعاده.</p>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-32 h-32 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-2 relative shrink-0">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-slate-400 text-sm">لا يوجد شعار</span>
              )}
              {uploadingLogo && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            <div className="flex-1 grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
                  <UploadCloud size={16} />
                  ارفع الشعار
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">عرض الشعار (px أو %)</label>
                <input type="text" dir="ltr" value={settings.logoWidth || ''} onChange={(e) => handleChange('logoWidth', e.target.value)} placeholder="مثال: 150px" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">طول الشعار (px أو %)</label>
                <input type="text" dir="ltr" value={settings.logoHeight || ''} onChange={(e) => handleChange('logoHeight', e.target.value)} placeholder="مثال: auto" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Colors and Fonts */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">تخصيص الألوان والخطوط</h3>
          <p className="text-sm text-slate-500 mt-1">تحديد الهوية اللونية والخطوط المستخدمة في الموقع.</p>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">اللون الرئيسي (Primary Color)</label>
            <div className="flex gap-3 h-10">
              <input type="color" value={settings.primaryColor || '#bd121c'} onChange={(e) => handleChange('primaryColor', e.target.value)} className="h-full w-12 rounded-lg cursor-pointer border border-slate-300 p-1" />
              <input type="text" dir="ltr" value={settings.primaryColor || '#bd121c'} onChange={(e) => handleChange('primaryColor', e.target.value)} className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 uppercase font-mono outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">لون العناوين الأساسية (Headings)</label>
            <div className="flex gap-3 h-10">
              <input type="color" value={settings.headingColor || '#ffffff'} onChange={(e) => handleChange('headingColor', e.target.value)} className="h-full w-12 rounded-lg cursor-pointer border border-slate-300 p-1" />
              <input type="text" dir="ltr" value={settings.headingColor || '#ffffff'} onChange={(e) => handleChange('headingColor', e.target.value)} className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 uppercase font-mono outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">لون النصوص العادية (Text)</label>
            <div className="flex gap-3 h-10">
              <input type="color" value={settings.textColor || '#d1d5db'} onChange={(e) => handleChange('textColor', e.target.value)} className="h-full w-12 rounded-lg cursor-pointer border border-slate-300 p-1" />
              <input type="text" dir="ltr" value={settings.textColor || '#d1d5db'} onChange={(e) => handleChange('textColor', e.target.value)} className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 uppercase font-mono outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">نوع الخط العربي (Google Fonts)</label>
            <select value={settings.fontFamily || 'Tajawal'} onChange={(e) => handleChange('fontFamily', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 h-10 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all">
              <option value="Tajawal">Tajawal</option>
              <option value="Cairo">Cairo</option>
              <option value="Almarai">Almarai</option>
              <option value="Changa">Changa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Card 3: Contact */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">معلومات الموقع والتواصل</h3>
          <p className="text-sm text-slate-500 mt-1">البيانات الأساسية التي تظهر في تذييل الموقع.</p>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">اسم الموقع (عربي)</label>
            <input type="text" value={settings.siteNameAr || ''} onChange={(e) => handleChange('siteNameAr', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">اسم الموقع (إنجليزي)</label>
            <input type="text" dir="ltr" value={settings.siteNameEn || ''} onChange={(e) => handleChange('siteNameEn', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-left" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">البريد الإلكتروني للاتصال</label>
            <input type="email" dir="ltr" value={settings.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-left" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 block">رقم الجوال / الواتساب</label>
            <input type="text" dir="ltr" value={settings.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-left" />
          </div>
        </div>
      </div>
    </div>
  );
}
