"use client";
import React, { useState, useEffect } from "react";
import { Save, CheckCircle, UploadCloud } from "lucide-react";

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
      setToast("تم حفظ الإعدادات والمظهر بنجاح!");
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
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">الإعدادات والمظهر</h1>
          <p className="text-gray-400">تحكم كامل في ألوان الموقع، الخطوط، الشعار والتفاصيل الأساسية.</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-red-900/20 disabled:opacity-50">
          <Save size={20} />
          {loading ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>

      {toast && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle size={24} className="text-emerald-500" />
          <p className="text-emerald-400 font-medium">{toast}</p>
        </div>
      )}

      {/* الهوية البصرية */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-white/5 bg-[#161616]">
          <h2 className="text-xl font-bold text-white">الهوية البصرية (الشعار)</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 bg-[#0a0a0a] border border-white/10 rounded-xl flex items-center justify-center p-2 relative">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" style={{ width: settings.logoWidth || 'auto', height: settings.logoHeight || 'auto', maxHeight: '100%', maxWidth: '100%' }} />
              ) : (
                <span className="text-gray-600 text-sm">لا يوجد شعار</span>
              )}
              {uploadingLogo && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-4">
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center gap-2">
                <UploadCloud size={20} />
                ارفع الشعار من الجهاز
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">عرض الشعار (px أو %)</label>
                  <input type="text" dir="ltr" value={settings.logoWidth || ''} onChange={(e) => handleChange('logoWidth', e.target.value)} placeholder="مثال: 150px" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">طول الشعار (px أو %)</label>
                  <input type="text" dir="ltr" value={settings.logoHeight || ''} onChange={(e) => handleChange('logoHeight', e.target.value)} placeholder="مثال: auto" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-red-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الألوان والخطوط */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-white/5 bg-[#161616]">
          <h2 className="text-xl font-bold text-white">تخصيص الألوان والخطوط</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">اللون الرئيسي (Primary Color)</label>
            <div className="flex gap-3">
              <input type="color" value={settings.primaryColor || '#bd121c'} onChange={(e) => handleChange('primaryColor', e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0 p-0" />
              <input type="text" dir="ltr" value={settings.primaryColor || '#bd121c'} onChange={(e) => handleChange('primaryColor', e.target.value)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none uppercase font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">لون العناوين الأساسية (Headings)</label>
            <div className="flex gap-3">
              <input type="color" value={settings.headingColor || '#ffffff'} onChange={(e) => handleChange('headingColor', e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0 p-0" />
              <input type="text" dir="ltr" value={settings.headingColor || '#ffffff'} onChange={(e) => handleChange('headingColor', e.target.value)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none uppercase font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">لون النصوص العادية (Text)</label>
            <div className="flex gap-3">
              <input type="color" value={settings.textColor || '#d1d5db'} onChange={(e) => handleChange('textColor', e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0 p-0" />
              <input type="text" dir="ltr" value={settings.textColor || '#d1d5db'} onChange={(e) => handleChange('textColor', e.target.value)} className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none uppercase font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">نوع الخط العربي (Google Fonts)</label>
            <select value={settings.fontFamily || 'Tajawal'} onChange={(e) => handleChange('fontFamily', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500">
              <option value="Tajawal">Tajawal (تاچوال)</option>
              <option value="Cairo">Cairo (كايرو)</option>
              <option value="Almarai">Almarai (المراعي)</option>
              <option value="Changa">Changa (تشانجا)</option>
            </select>
          </div>
        </div>
      </div>

      {/* معلومات التواصل */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-white/5 bg-[#161616]">
          <h2 className="text-xl font-bold text-white">معلومات الموقع والتواصل</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">اسم الموقع (عربي)</label>
            <input type="text" value={settings.siteNameAr || ''} onChange={(e) => handleChange('siteNameAr', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">اسم الموقع (إنجليزي)</label>
            <input type="text" dir="ltr" value={settings.siteNameEn || ''} onChange={(e) => handleChange('siteNameEn', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-red-500 text-left" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">البريد الإلكتروني للاتصال</label>
            <input type="email" dir="ltr" value={settings.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-red-500 text-left" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">رقم الجوال / الواتساب</label>
            <input type="text" dir="ltr" value={settings.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-red-500 text-left" />
          </div>
        </div>
      </div>
    </div>
  );
}
