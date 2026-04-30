"use client";
import React, { useEffect, useState } from 'react';

export default function FloatingActions() {
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data) {
        if (data.whatsapp) setWhatsapp(data.whatsapp);
        if (data.phone) {
          const firstPhone = data.phone.split(',')[0].trim();
          setPhone(firstPhone);
        }
      }
    });
  }, []);

  if (!whatsapp && !phone) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {phone && (
        <a href={`tel:${phone}`} title="اتصال مباشر" className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-110 transition-all duration-300">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </a>
      )}
      {whatsapp && (
        <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} title="مراسلة واتساب" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:scale-110 transition-all duration-300">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path></svg>
        </a>
      )}
    </div>
  );
}
