"use client";
import React, { useState, useEffect } from "react";
import { PageWrapper, SectionCard, FormGrid, FormField, Input, Button } from "@/components/ui/LayoutComponents";
import { UploadCloud, Save, Eye } from "lucide-react";

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
      title="الإعدادات والمظهر" 
      description="التحكم الكامل في هوية الموقع وبيانات التواصل"
      actionButton={<Button onClick={handleSave} disabled={loading}><Save size={18}/> {loading ? "جاري الحفظ..." : "حفظ التعديلات"}</Button>}
    >
      <SectionCard title="1. الهوية البصرية" description="تحديث الشعار والتحكم بأبعاده">
        <FormGrid>
          <FormField label="رفع الشعار الجديد">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center p-2 relative">
                {settings.logoUrl ? <img src={settings.logoUrl} className="max-h-full max-w-full object-contain" /> : <span className="text-gray-400 text-xs">لا يوجد</span>}
                {uploadingLogo && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>}
              </div>
              <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 h-11 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2">
                <UploadCloud size={18} /> تصفح الملفات
                <input type="file" className="hidden" accept="image/*" onChange={(e) => uploadFile(e, 'logoUrl', setUploadingLogo)} />
              </label>
            </div>
          </FormField>
          <div className="space-y-6">
            <FormField label="عرض الشعار (px)">
              <Input dir="ltr" value={settings.logoWidth || ''} onChange={e => handleChange('logoWidth', e.target.value)} placeholder="مثال: 150px" />
            </FormField>
            <FormField label="طول الشعار (px)">
              <Input dir="ltr" value={settings.logoHeight || ''} onChange={e => handleChange('logoHeight', e.target.value)} placeholder="مثال: auto" />
            </FormField>
          </div>
        </FormGrid>
      </SectionCard>

      <SectionCard title="2. الألوان" description="تخصيص الهوية اللونية للموقع">
        <FormGrid>
          <FormField label="اللون الأساسي">
            <div className="flex gap-3 h-11">
              <input type="color" value={settings.primaryColor || '#7A0C16'} onChange={e => handleChange('primaryColor', e.target.value)} className="h-full w-14 rounded-xl border border-gray-300 p-1 cursor-pointer bg-white" />
              <Input dir="ltr" value={settings.primaryColor || '#7A0C16'} onChange={e => handleChange('primaryColor', e.target.value)} className="uppercase font-mono text-center w-full" />
            </div>
          </FormField>
          <FormField label="لون العناوين">
            <div className="flex gap-3 h-11">
              <input type="color" value={settings.headingColor || '#ffffff'} onChange={e => handleChange('headingColor', e.target.value)} className="h-full w-14 rounded-xl border border-gray-300 p-1 cursor-pointer bg-white" />
              <Input dir="ltr" value={settings.headingColor || '#ffffff'} onChange={e => handleChange('headingColor', e.target.value)} className="uppercase font-mono text-center w-full" />
            </div>
          </FormField>
          <FormField label="لون النصوص">
            <div className="flex gap-3 h-11">
              <input type="color" value={settings.textColor || '#d1d5db'} onChange={e => handleChange('textColor', e.target.value)} className="h-full w-14 rounded-xl border border-gray-300 p-1 cursor-pointer bg-white" />
              <Input dir="ltr" value={settings.textColor || '#d1d5db'} onChange={e => handleChange('textColor', e.target.value)} className="uppercase font-mono text-center w-full" />
            </div>
          </FormField>
        </FormGrid>
      </SectionCard>

      <SectionCard title="3. الخطوط" description="اختيار الخط العربي للموقع">
        <FormGrid>
          <FormField label="نوع الخط العربي">
            <select value={settings.fontFamily || 'Tajawal'} onChange={e => handleChange('fontFamily', e.target.value)} className="w-full h-11 bg-white border border-gray-300 rounded-xl px-4 text-sm text-gray-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 shadow-sm cursor-pointer">
              <option value="Tajawal">Tajawal</option>
              <option value="Cairo">Cairo</option>
              <option value="Almarai">Almarai</option>
              <option value="IBM Plex Sans Arabic">IBM Plex Sans Arabic</option>
            </select>
          </FormField>
        </FormGrid>
      </SectionCard>

      <SectionCard title="4. بيانات التواصل" description="الأرقام والإيميلات لخدمة العملاء (لفصل أكثر من رقم أو إيميل، استخدم الفاصلة , )">
        <FormGrid>
          <FormField label="رقم الجوال للاتصال (مفصولة بفاصلة)">
            <Input dir="ltr" value={settings.phone || ''} onChange={e => handleChange('phone', e.target.value)} placeholder="055..., 053..." />
          </FormField>
          <FormField label="رقم الواتساب (لطلب الخدمات)">
            <Input dir="ltr" value={settings.whatsapp || ''} onChange={e => handleChange('whatsapp', e.target.value)} placeholder="9665..." />
          </FormField>
          <FormField label="البريد الإلكتروني (مفصولة بفاصلة)">
            <Input dir="ltr" value={settings.email || ''} onChange={e => handleChange('email', e.target.value)} placeholder="info@..., support@..." />
          </FormField>
          <FormField label="اسم الموقع (عربي)">
            <Input value={settings.siteNameAr || ''} onChange={e => handleChange('siteNameAr', e.target.value)} />
          </FormField>
          <FormField label="اسم الموقع (إنجليزي)">
            <Input dir="ltr" value={settings.siteNameEn || ''} onChange={e => handleChange('siteNameEn', e.target.value)} />
          </FormField>
        </FormGrid>
      </SectionCard>

      <SectionCard title="5. السجل التجاري والشهادات" description="رابط جوجل درايف أو رفع ملف PDF">
        <FormGrid>
          <FormField label="رابط ملف السجل التجاري (PDF) أو Google Drive" className="md:col-span-2">
            <div className="flex flex-col md:flex-row gap-4">
              <Input 
                dir="ltr" 
                value={settings.certificatePdf || ''} 
                onChange={e => handleChange('certificatePdf', e.target.value)} 
                placeholder="https://drive.google.com/file/d/..." 
                className="flex-1"
              />
              <div className="flex gap-2">
                <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 h-11 rounded-xl text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 flex-shrink-0">
                  {uploadingCert ? <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div> : <UploadCloud size={18} />}
                  رفع من الجهاز
                  <input type="file" className="hidden" accept="application/pdf" onChange={(e) => uploadFile(e, 'certificatePdf', setUploadingCert)} disabled={uploadingCert} />
                </label>
                {settings.certificatePdf && (
                  <a href={settings.certificatePdf} target="_blank" className="flex items-center justify-center gap-2 h-11 px-4 bg-red-50 text-red-700 font-semibold text-sm border border-red-100 rounded-xl hover:bg-red-100 transition-colors flex-shrink-0">
                    <Eye size={18}/> تجربة الرابط
                  </a>
                )}
              </div>
            </div>
          </FormField>
        </FormGrid>
      </SectionCard>
    </PageWrapper>
  );
}
