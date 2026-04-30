"use client";
import React, { useState, useEffect } from "react";
import { PageWrapper, SectionCard, FormGrid, FormField, Input, Button } from "@/components/ui/LayoutComponents";
import { UploadCloud, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => setSettings(data || {}));
  }, []);

  const handleChange = (key: string, value: string) => setSettings((prev: any) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setLoading(true);
    const payload = Object.entries(settings).map(([key, value]) => ({ key, value }));
    await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setLoading(false);
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>, key: string, setLoader: (v: boolean) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoader(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) handleChange(key, data.url);
    setLoader(false);
  };

  return (
    <PageWrapper 
      title="الإعدادات (Settings)" 
      description="إدارة إعدادات الموقع، الهوية، الألوان وبيانات التواصل."
      actionButton={<Button onClick={handleSave} disabled={loading}><Save size={16}/> {loading ? "جاري الحفظ..." : "حفظ التغييرات"}</Button>}
    >
      <SectionCard title="الهوية البصرية (Branding)" description="تحديث الشعار وأبعاده.">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-32 h-32 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center p-4 relative">
            {settings.logoUrl ? <img src={settings.logoUrl} className="max-h-full max-w-full object-contain" /> : <span className="text-slate-400 text-sm">لا يوجد شعار</span>}
            {uploadingLogo && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>}
          </div>
          <div className="flex-1 space-y-6">
            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2">
              <UploadCloud size={16} /> ارفع الشعار
              <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadFile(e, 'logoUrl', setUploadingLogo)} />
            </label>
            <FormGrid>
              <FormField label="عرض الشعار (px أو %)"><Input dir="ltr" value={settings.logoWidth || ''} onChange={e => handleChange('logoWidth', e.target.value)} placeholder="150px" /></FormField>
              <FormField label="طول الشعار (px أو %)"><Input dir="ltr" value={settings.logoHeight || ''} onChange={e => handleChange('logoHeight', e.target.value)} placeholder="auto" /></FormField>
            </FormGrid>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="الألوان والخطوط (Colors & Fonts)">
        <FormGrid>
          <FormField label="اللون الرئيسي (Primary Color)">
            <div className="flex gap-3 h-10">
              <input type="color" value={settings.primaryColor || '#bd121c'} onChange={e => handleChange('primaryColor', e.target.value)} className="h-full w-12 rounded-xl border border-slate-300 p-1" />
              <Input dir="ltr" value={settings.primaryColor || '#bd121c'} onChange={e => handleChange('primaryColor', e.target.value)} className="uppercase font-mono" />
            </div>
          </FormField>
          <FormField label="لون العناوين (Headings)">
            <div className="flex gap-3 h-10">
              <input type="color" value={settings.headingColor || '#ffffff'} onChange={e => handleChange('headingColor', e.target.value)} className="h-full w-12 rounded-xl border border-slate-300 p-1" />
              <Input dir="ltr" value={settings.headingColor || '#ffffff'} onChange={e => handleChange('headingColor', e.target.value)} className="uppercase font-mono" />
            </div>
          </FormField>
          <FormField label="لون النصوص (Text)">
            <div className="flex gap-3 h-10">
              <input type="color" value={settings.textColor || '#d1d5db'} onChange={e => handleChange('textColor', e.target.value)} className="h-full w-12 rounded-xl border border-slate-300 p-1" />
              <Input dir="ltr" value={settings.textColor || '#d1d5db'} onChange={e => handleChange('textColor', e.target.value)} className="uppercase font-mono" />
            </div>
          </FormField>
          <FormField label="نوع الخط العربي (Font)">
            <select value={settings.fontFamily || 'Tajawal'} onChange={e => handleChange('fontFamily', e.target.value)} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm">
              <option value="Tajawal">Tajawal</option><option value="Cairo">Cairo</option><option value="Almarai">Almarai</option>
            </select>
          </FormField>
        </FormGrid>
      </SectionCard>

      <SectionCard title="التواصل (Contact)" description="البيانات التي تظهر في تذييل الموقع.">
        <FormGrid>
          <FormField label="اسم الموقع (عربي)"><Input value={settings.siteNameAr || ''} onChange={e => handleChange('siteNameAr', e.target.value)} /></FormField>
          <FormField label="اسم الموقع (إنجليزي)"><Input dir="ltr" value={settings.siteNameEn || ''} onChange={e => handleChange('siteNameEn', e.target.value)} /></FormField>
          <FormField label="البريد الإلكتروني (Email)"><Input dir="ltr" value={settings.email || ''} onChange={e => handleChange('email', e.target.value)} /></FormField>
          <FormField label="رقم الجوال (Phone)"><Input dir="ltr" value={settings.phone || ''} onChange={e => handleChange('phone', e.target.value)} /></FormField>
        </FormGrid>
      </SectionCard>

      <SectionCard title="السجل التجاري (Certificate)" description="رفع السجل التجاري كملف PDF ليتاح للعملاء.">
        <div className="flex items-center gap-6">
          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2">
            {uploadingCert ? <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div> : <UploadCloud size={16} />}
            ارفع ملف PDF
            <input type="file" className="hidden" accept="application/pdf" onChange={(e) => uploadFile(e, 'certificatePdf', setUploadingCert)} disabled={uploadingCert} />
          </label>
          {settings.certificatePdf && (
            <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium">
              تم الرفع بنجاح - <a href={settings.certificatePdf} target="_blank" className="underline hover:text-blue-900">معاينة الملف</a>
            </div>
          )}
        </div>
      </SectionCard>
    </PageWrapper>
  );
}
