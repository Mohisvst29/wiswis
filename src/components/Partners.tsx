"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";

export default function Partners() {
  const { lang } = useLang();
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/partners").then(r => r.ok ? r.json() : null).then(data => {
      if (Array.isArray(data) && data.length > 0) setPartners(data);
      else setPartners([
        { logo: "https://mazayafuel.com/wp-content/uploads/2023/10/logo.png", name: "Mazaya" },
        { logo: "https://www.aramco.com/Static/Img/Logo.svg", name: "Aramco" },
        { logo: "https://www.adnoc.ae/assets/images/logo.svg", name: "ADNOC" },
        { logo: "https://www.enoc.com/Static/Img/Logo.svg", name: "ENOC" },
      ]);
    }).catch(() => {});
  }, []);

  return (
    <section id="partners" style={{ padding: '6rem 0', background: '#0a0a0a', position: 'relative', overflow: 'hidden', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#6b7280', display: 'block', marginBottom: '1rem' }}>
            {lang === 'ar' ? 'شركاء النجاح' : 'PARTNERS IN SUCCESS'}
          </span>
          <div style={{ width: '80px', height: '2px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)', margin: '0 auto' }} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '3rem', opacity: 0.8 }}>
          {partners.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, filter: "grayscale(100%)" }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: "grayscale(0%)", scale: 1.1 }}
              viewport={{ once: true }}
              style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
            >
              <img 
                src={partner.logo} 
                alt={partner.name} 
                style={{ maxHeight: '100%', maxWidth: '180px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
