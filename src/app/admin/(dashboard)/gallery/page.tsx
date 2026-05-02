"use client";
import React, { useEffect, useState } from "react";
import { ImageIcon, Plus, Trash2, Save, X } from "lucide-react";

interface GalleryItem {
  _id: string;
  url: string;
  caption: { ar: string; en: string };
  order: number;
}

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState({ ar: '', en: '' });
  const [newCaption, setNewCaption] = useState({ ar: '', en: '' });
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (Array.isArray(data)) setImages(data);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت');
        return;
      }
      setNewFile(file);
      setPreview(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    // Check file size
    if (file.size > 10 * 1024 * 1024) {
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    const uploadRes = await fetch('/api/upload', { 
      method: 'POST', 
      body: formData 
    });
    
    if (!uploadRes.ok) {
      const errorData = await uploadRes.json().catch(() => ({}));
      throw new Error(errorData.error || `خطأ في الرفع: ${uploadRes.status}`);
    }
    
    const uploadData = await uploadRes.json();
    return uploadData.url || null;
  };

  const handleUpload = async () => {
    if (!newFile) return;
    setUploading(true);
    setErrorMsg('');
    try {
      setUploadProgress('جاري رفع الصورة...');
      const url = await uploadSingleFile(newFile);

      if (url) {
        setUploadProgress('جاري حفظ البيانات...');
        const saveRes = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            caption: newCaption,
            order: images.length
          })
        });
        
        if (!saveRes.ok) {
          throw new Error('فشل في حفظ الصورة في المعرض');
        }
        
        setShowAddModal(false);
        setNewFile(null);
        setPreview('');
        setNewCaption({ ar: '', en: '' });
        fetchImages();
      } else {
        setErrorMsg('فشل في رفع الصورة. تأكد من حجم الملف وصيغته.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء الرفع');
    }
    setUploading(false);
    setUploadProgress('');
  };

  const handleMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setErrorMsg('');
    
    let successCount = 0;
    let failCount = 0;
    
    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`جاري رفع الصورة ${i + 1} من ${files.length}...`);
        
        try {
          // Check file size
          if (files[i].size > 10 * 1024 * 1024) {
            failCount++;
            continue;
          }
          
          const url = await uploadSingleFile(files[i]);
          
          if (url) {
            await fetch('/api/gallery', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url,
                caption: { ar: '', en: '' },
                order: images.length + i
              })
            });
            successCount++;
          } else {
            failCount++;
          }
        } catch (fileErr) {
          failCount++;
          console.error(`Failed to upload file ${i + 1}:`, fileErr);
        }
      }
      
      if (failCount > 0 && successCount === 0) {
        setErrorMsg(`فشل رفع جميع الصور (${failCount}). تأكد من حجم الملفات والاتصال.`);
      } else if (failCount > 0) {
        setErrorMsg(`تم رفع ${successCount} صور بنجاح، وفشلت ${failCount} صور.`);
      }
      
      fetchImages();
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء الرفع');
    }
    setUploading(false);
    setUploadProgress('');
    e.target.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    fetchImages();
  };

  const handleEditCaption = async (id: string) => {
    setSaving(true);
    await fetch(`/api/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: editCaption })
    });
    setEditingId(null);
    fetchImages();
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111' }}>معرض الصور</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>أضف وأدر صور معرض الشركة</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <label
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#f3f4f6', color: '#374151', padding: '0.6rem 1.2rem',
              borderRadius: '12px', fontWeight: '600', fontSize: '0.9rem', cursor: uploading ? 'not-allowed' : 'pointer',
              border: '1px solid #e5e7eb', transition: 'all 0.2s',
              opacity: uploading ? 0.5 : 1
            }}
          >
            <Plus size={18} />
            رفع عدة صور
            <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleMultiUpload} style={{ display: 'none' }} disabled={uploading} />
          </label>
          <button
            onClick={() => { setShowAddModal(true); setErrorMsg(''); }}
            disabled={uploading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'linear-gradient(135deg, #D4A017, #8f6c00)', color: 'white',
              padding: '0.6rem 1.2rem', borderRadius: '12px', fontWeight: '600',
              fontSize: '0.9rem', cursor: uploading ? 'not-allowed' : 'pointer', border: 'none', transition: 'all 0.2s',
              opacity: uploading ? 0.5 : 1
            }}
          >
            <Plus size={18} />
            إضافة صورة مع وصف
          </button>
        </div>
      </div>

      {uploading && (
        <div style={{
          background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '12px',
          padding: '1rem 1.5rem', marginBottom: '1.5rem', color: '#92400E',
          display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '500'
        }}>
          <div style={{
            width: '20px', height: '20px', border: '3px solid #D4A017',
            borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          {uploadProgress || 'جاري رفع الصور... يرجى الانتظار'}
        </div>
      )}

      {errorMsg && !uploading && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px',
          padding: '1rem 1.5rem', marginBottom: '1.5rem', color: '#991B1B',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: '500'
        }}>
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', fontWeight: 'bold', fontSize: '1.2rem' }}>×</button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
          <div style={{
            width: '40px', height: '40px', border: '4px solid #e5e7eb',
            borderTopColor: '#D4A017', borderRadius: '50%', margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }} />
          جاري التحميل...
        </div>
      ) : images.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem', background: '#f9fafb',
          borderRadius: '16px', border: '2px dashed #e5e7eb'
        }}>
          <ImageIcon size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
          <p style={{ color: '#6b7280', fontSize: '1.1rem', fontWeight: '500' }}>لا توجد صور في المعرض بعد</p>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.5rem' }}>ابدأ بإضافة صور لمعرض الشركة</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.25rem'
        }}>
          {images.map((img) => (
            <div key={img._id} style={{
              background: 'white', borderRadius: '16px', overflow: 'hidden',
              border: '1px solid #e5e7eb', transition: 'all 0.3s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
                <img
                  src={img.url}
                  alt={img.caption?.ar || ''}
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <button
                  onClick={() => handleDelete(img._id)}
                  style={{
                    position: 'absolute', top: '8px', left: '8px',
                    background: 'rgba(239, 68, 68, 0.9)', color: 'white',
                    border: 'none', borderRadius: '8px', padding: '6px',
                    cursor: 'pointer', backdropFilter: 'blur(4px)'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div style={{ padding: '0.75rem 1rem' }}>
                {editingId === img._id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      value={editCaption.ar}
                      onChange={e => setEditCaption({ ...editCaption, ar: e.target.value })}
                      placeholder="وصف بالعربي"
                      dir="rtl"
                      style={{
                        padding: '0.4rem 0.6rem', border: '1px solid #e5e7eb',
                        borderRadius: '8px', fontSize: '0.85rem'
                      }}
                    />
                    <input
                      value={editCaption.en}
                      onChange={e => setEditCaption({ ...editCaption, en: e.target.value })}
                      placeholder="English caption"
                      dir="ltr"
                      style={{
                        padding: '0.4rem 0.6rem', border: '1px solid #e5e7eb',
                        borderRadius: '8px', fontSize: '0.85rem'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditCaption(img._id)}
                        disabled={saving}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          gap: '0.3rem', background: '#D4A017', color: 'white',
                          border: 'none', borderRadius: '8px', padding: '0.4rem',
                          cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600'
                        }}
                      >
                        <Save size={14} /> حفظ
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          gap: '0.3rem', background: '#f3f4f6', color: '#6b7280',
                          border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.4rem',
                          cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600'
                        }}
                      >
                        <X size={14} /> إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => { setEditingId(img._id); setEditCaption(img.caption || { ar: '', en: '' }); }}
                    style={{ cursor: 'pointer', minHeight: '24px' }}
                  >
                    <p style={{ fontSize: '0.85rem', color: img.caption?.ar ? '#374151' : '#9ca3af', margin: 0 }}>
                      {img.caption?.ar || 'اضغط لإضافة وصف...'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, backdropFilter: 'blur(4px)'
        }} onClick={() => { if (!uploading) { setShowAddModal(false); setErrorMsg(''); } }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: '20px', padding: '2rem',
              width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>إضافة صورة جديدة</h2>

            {errorMsg && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px',
                padding: '0.75rem 1rem', marginBottom: '1rem', color: '#991B1B', fontSize: '0.85rem'
              }}>
                {errorMsg}
              </div>
            )}

            <div style={{
              border: '2px dashed #e5e7eb', borderRadius: '12px', padding: '2rem',
              textAlign: 'center', marginBottom: '1rem', cursor: 'pointer',
              background: preview ? 'transparent' : '#f9fafb'
            }} onClick={() => document.getElementById('gallery-file-input')?.click()}>
              {preview ? (
                <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', margin: '0 auto' }} />
              ) : (
                <>
                  <ImageIcon size={36} style={{ color: '#d1d5db', margin: '0 auto 0.5rem' }} />
                  <p style={{ color: '#6b7280' }}>اضغط لاختيار صورة</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.25rem' }}>JPG, PNG, WebP (الحد الأقصى 10MB)</p>
                </>
              )}
              <input id="gallery-file-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem', display: 'block' }}>وصف بالعربي</label>
                <input
                  value={newCaption.ar}
                  onChange={e => setNewCaption({ ...newCaption, ar: e.target.value })}
                  dir="rtl"
                  placeholder="وصف الصورة بالعربي (اختياري)"
                  style={{
                    width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #e5e7eb',
                    borderRadius: '10px', fontSize: '0.9rem'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem', display: 'block' }}>English Caption</label>
                <input
                  value={newCaption.en}
                  onChange={e => setNewCaption({ ...newCaption, en: e.target.value })}
                  dir="ltr"
                  placeholder="Image caption in English (optional)"
                  style={{
                    width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #e5e7eb',
                    borderRadius: '10px', fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleUpload}
                disabled={!newFile || uploading}
                style={{
                  flex: 1, background: !newFile ? '#e5e7eb' : 'linear-gradient(135deg, #D4A017, #8f6c00)',
                  color: !newFile ? '#9ca3af' : 'white', border: 'none', borderRadius: '12px',
                  padding: '0.75rem', fontWeight: '600', fontSize: '0.95rem',
                  cursor: !newFile ? 'not-allowed' : 'pointer'
                }}
              >
                {uploading ? uploadProgress || 'جاري الرفع...' : 'رفع الصورة'}
              </button>
              <button
                onClick={() => { setShowAddModal(false); setNewFile(null); setPreview(''); setNewCaption({ ar: '', en: '' }); setErrorMsg(''); }}
                disabled={uploading}
                style={{
                  background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb',
                  borderRadius: '12px', padding: '0.75rem 1.5rem', fontWeight: '600',
                  fontSize: '0.95rem', cursor: uploading ? 'not-allowed' : 'pointer'
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
