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
        } else {
          setPhone('0500000000');
        }
      } else {
        setWhatsapp('0500000000');
        setPhone('0500000000');
      }
    });
  }, []);

  const waNumber = whatsapp || '0500000000';
  const phNumber = phone || '0500000000';

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 999999, display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {phNumber && (
        <a href={`tel:${phNumber}`} title="اتصال مباشر" style={{ width: '56px', height: '56px', backgroundColor: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </a>
      )}
      {waNumber && (
        <a href={`https://wa.me/${waNumber.replace(/\D/g, '')}`} title="مراسلة واتساب" target="_blank" rel="noopener noreferrer" style={{ width: '56px', height: '56px', backgroundColor: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path></svg>
        </a>
      )}
    </div>
  );
}
