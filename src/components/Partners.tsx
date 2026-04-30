"use client";
import React, { useState, useEffect } from "react";
import { useLang } from "@/components/LangProvider";

export default function Partners() {
  const { lang } = useLang();
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/partners")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((p: any) => p.isActive !== false);
          if (active.length > 0) setPartners(active);
        }
      })
      .catch(() => {});
  }, []);

  if (partners.length === 0) return null;

  // Duplicate for seamless loop
  const displayItems = [...partners, ...partners, ...partners, ...partners];

  return (
    <section id="partners" style={{ padding: '4rem 0', background: '#f8f8f8', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', marginBottom: '2.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#9ca3af', display: 'block', marginBottom: '1rem' }}>
            {lang === 'ar' ? 'شركاء النجاح' : 'PARTNERS IN SUCCESS'}
          </span>
          <div style={{ width: '80px', height: '2px', background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.15), transparent)', margin: '0 auto' }} />
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {/* Fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to right, #f8f8f8, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to left, #f8f8f8, transparent)', zIndex: 2, pointerEvents: 'none' }} />

        <div
          className="partners-marquee-track"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem',
            width: 'max-content',
          }}
        >
          {displayItems.map((partner, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                height: '90px',
                minWidth: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 2rem',
                borderRadius: '16px',
                border: 'none',
                background: 'transparent',
              }}
            >
              {partner.logoUrl ? (
                <img
                  src={partner.logoUrl}
                  alt={partner.name || 'Partner'}
                  style={{
                    maxHeight: '60px',
                    maxWidth: '160px',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
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
