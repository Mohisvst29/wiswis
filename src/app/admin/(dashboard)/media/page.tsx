"use client";
import React, { useState, useRef } from "react";
import { UploadCloud, FileImage, FileVideo, X, CheckCircle, Copy } from "lucide-react";

export default function MediaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const selected = e.dataTransfer.files?.[0];
    if (selected) processFile(selected);
  };

  const processFile = (selected: File) => {
    setFile(selected);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selected);
    setUploadedUrl("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setUploadedUrl(data.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setUploadedUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Media Manager</h1>
        <p className="text-gray-400">Upload images and videos to Cloudinary to use across the site.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        {!file ? (
          <div 
            onDragOver={(e) => e.preventDefault()} 
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-700 hover:border-red-500 hover:bg-gray-800/50 transition-colors rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer text-center"
          >
            <UploadCloud size={48} className="text-gray-500 mb-4" />
            <p className="text-white font-medium text-lg mb-1">Click to upload or drag and drop</p>
            <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                  {file.type.startsWith("image/") ? (
                    <img src={preview!} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <FileVideo size={32} className="text-blue-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-medium truncate max-w-xs">{file.name}</h3>
                  <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={clearFile} disabled={uploading} className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            {uploadedUrl ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg flex items-center gap-4">
                <CheckCircle size={24} className="text-emerald-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-emerald-400 font-medium mb-1">Upload Successful!</p>
                  <div className="flex items-center gap-2 bg-black/40 rounded px-3 py-2">
                    <span className="text-xs text-gray-300 truncate flex-1">{uploadedUrl}</span>
                    <button onClick={() => navigator.clipboard.writeText(uploadedUrl)} className="text-gray-400 hover:text-white shrink-0" title="Copy to clipboard">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-3 border-t border-gray-800 pt-6">
                <button onClick={clearFile} disabled={uploading} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 font-medium transition-colors">Cancel</button>
                <button onClick={handleUpload} disabled={uploading} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                  {uploading ? "Uploading..." : "Upload to Cloudinary"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
