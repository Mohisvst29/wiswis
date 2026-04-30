"use client";
import React, { useState, useEffect, useRef } from "react";
import { useLang } from "@/components/LangProvider";

export default function Partners() {
  const { lang } = useLang();
  const [partners, setPartners] = useState<any[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/partners")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Only use active partners that have logos
          const active = data.filter((p: any) => p.isActive !== false && p.logo);
          if (active.length > 0) {
            setPartners(active);
          } else if (data.length > 0) {
            setPartners(data);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Don't render the section if no partners with images
  if (partners.length === 0) return null;

  // Duplicate items enough times for smooth infinite scroll
  const displayItems = [...partners, ...partners, ...partners, ...partners];

  return (
    <section id="partners" style={{ padding: '4rem 0', background: '#0a0a0a', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', marginBottom: '2.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#9ca3af', display: 'block', marginBottom: '1rem' }}>
            {lang === 'ar' ? 'شركاء النجاح' : 'PARTNERS IN SUCCESS'}
          </span>
          <div style={{ width: '80px', height: '2px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)', margin: '0 auto' }} />
        </div>
      </div>

      {/* Marquee Container */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {/* Fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100px', background: 'linear-gradient(to right, #0a0a0a, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '100px', background: 'linear-gradient(to left, #0a0a0a, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        
        {/* Scrolling track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3rem',
            animation: `marqueeScroll ${partners.length * 5}s linear infinite`,
            width: 'max-content',
          }}
        >
          {displayItems.map((partner, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                height: '80px',
                minWidth: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name || 'Partner'}
                  style={{
                    maxHeight: '55px',
                    maxWidth: '150px',
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)',
                    opacity: 0.7,
                  }}
                  onError={(e) => {
                    // If image fails, show text instead
                    const el = e.currentTarget;
                    el.style.display = 'none';
                    if (el.parentElement) {
                      const span = document.createElement('span');
                      span.textContent = partner.name || 'Partner';
                      span.style.cssText = 'font-size:1.3rem;font-weight:800;color:rgba(255,255,255,0.5);letter-spacing:0.1em;text-transform:uppercase';
                      el.parentElement.appendChild(span);
                    }
                  }}
                />
              ) : (
                <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Marquee CSS Animation */}
      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
