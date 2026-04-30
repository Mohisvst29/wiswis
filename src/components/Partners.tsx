"use client";
import React, { useState, useEffect } from "react";
import { useLang } from "@/components/LangProvider";

export default function Partners() {
  const { lang } = useLang();
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/partners").then(r => r.ok ? r.json() : null).then(data => {
      if (Array.isArray(data) && data.length > 0) setPartners(data);
      else setPartners([
        { name: "Aramco" },
        { name: "ADNOC" },
        { name: "Mazaya" },
        { name: "ENOC" },
      ]);
    }).catch(() => {
      setPartners([
        { name: "Aramco" },
        { name: "ADNOC" },
        { name: "Mazaya" },
        { name: "ENOC" },
      ]);
    });
  }, []);

  return (
    <section id="partners" style={{ padding: '5rem 0', background: '#0a0a0a', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#9ca3af', display: 'block', marginBottom: '1rem' }}>
            {lang === 'ar' ? 'شركاء النجاح' : 'PARTNERS IN SUCCESS'}
          </span>
          <div style={{ width: '80px', height: '2px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)', margin: '0 auto' }} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
          {partners.map((partner, i) => (
            <div
              key={i}
              style={{ 
                height: '80px', 
                minWidth: '160px',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                transition: 'all 0.3s'
              }}
            >
              {partner.logo ? (
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  style={{ maxHeight: '50px', maxWidth: '140px', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.6 }}
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = 'none';
                    const span = document.createElement('span');
                    span.textContent = partner.name;
                    span.style.cssText = 'font-size:1.4rem;font-weight:800;color:rgba(255,255,255,0.5);letter-spacing:0.1em;text-transform:uppercase';
                    el.parentElement?.appendChild(span);
                  }}
                />
              ) : (
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-en-heading)' }}>
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

