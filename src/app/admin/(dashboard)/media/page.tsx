"use client";
import React, { useState, useEffect } from "react";
import { PageWrapper, SectionCard, Button } from "@/components/ui/LayoutComponents";
import { UploadCloud, Trash2, Copy, Image as ImageIcon, FileText, Video } from "lucide-react";

export default function MediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const res = await fetch('/api/media');
    const data = await res.json();
    setMedia(Array.isArray(data) ? data : []);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      try {
        await fetch("/api/upload", { method: "POST", body: formData });
      } catch (err) {}
    }
    setUploading(false);
    fetchMedia();
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الملف؟")) {
      await fetch(`/api/media/${id}`, { method: 'DELETE' });
      fetchMedia();
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("تم نسخ الرابط!");
  };

  return (
    <PageWrapper 
      title="مدير الوسائط (Media Manager)" 
      description="إدارة الصور والفيديوهات والملفات المرفوعة."
      actionButton={
        <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
          {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <UploadCloud size={16} />}
          {uploading ? 'جاري الرفع...' : 'رفع ملفات جديدة'}
          <input type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      }
    >
      <SectionCard title="الملفات المرفوعة" description="جميع الملفات المحفوظة في مساحة التخزين الخاصة بك.">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item._id} className="group relative bg-slate-50 border border-slate-200 rounded-xl aspect-square flex flex-col items-center justify-center overflow-hidden hover:border-slate-300 transition-all shadow-sm">
              {item.resourceType === 'image' || !item.resourceType ? (
                <img src={item.url} alt="Media" className="w-full h-full object-cover" />
              ) : item.resourceType === 'video' ? (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white"><Video size={32} /></div>
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400"><FileText size={32} /></div>
              )}
              
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <button onClick={() => copyToClipboard(item.url)} className="bg-white text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg shadow-sm font-medium text-xs flex items-center gap-1.5">
                  <Copy size={12} /> نسخ الرابط
                </button>
                <button onClick={() => handleDelete(item._id)} className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg shadow-sm font-medium text-xs flex items-center gap-1.5">
                  <Trash2 size={12} /> حذف
                </button>
              </div>
            </div>
          ))}
          {media.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">لا توجد ملفات مرفوعة.</div>
          )}
        </div>
      </SectionCard>
    </PageWrapper>
  );
}
