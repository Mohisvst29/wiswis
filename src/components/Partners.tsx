"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/hooks/useLocale";

export default function Partners() {
  const { locale, dir } = useLocale();
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
    <section className="py-20 bg-[#0a0a0a] relative overflow-hidden" id="partners" style={{ direction: dir }}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 block">
            {locale === 'ar' ? 'شركاء النجاح' : 'PARTNERS IN SUCCESS'}
          </span>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-30 hover:opacity-60 transition-opacity duration-500">
          {partners.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, filter: "grayscale(100%)" }}
              whileInView={{ opacity: 1 }}
              whileHover={{ filter: "grayscale(0%)", scale: 1.1 }}
              viewport={{ once: true }}
              className="h-12 md:h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer"
            >
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="max-h-full max-w-[150px] object-contain invert"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
