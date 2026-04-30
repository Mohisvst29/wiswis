"use client";
import React, { useEffect, useState } from 'react';
import { useLang } from '@/components/LangProvider';
import { AnimatePresence, motion } from 'framer-motion';

export default function Hero() {
  const { t } = useLang();
  const [slides, setSlides] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data && data.heroSlides && Array.isArray(data.heroSlides) && data.heroSlides.length > 0) {
          setSlides(data.heroSlides);
        } else if (data && data.heroBgUrl) {
          setSlides([data.heroBgUrl]);
        } else {
          setSlides(['/assets/wiswis_hero.png']);
        }
      });
      
    setTimeout(() => {
      document.querySelectorAll('.reveal-text').forEach(el => {
        el.classList.add('active');
      });
    }, 100);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000); // switch every 6 seconds
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden" id="home">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <AnimatePresence initial={false}>
          {slides.length > 0 && (
            slides[currentIndex].match(/\.(mp4|webm|ogg)$/i) ? (
              <motion.video
                key={currentIndex}
                src={slides[currentIndex]}
                autoPlay loop muted playsInline
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
              />
            ) : (
              <motion.img
                key={currentIndex}
                src={slides[currentIndex]}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
              />
            )
          )}
        </AnimatePresence>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/80 via-black/40 to-[#0a0a0a] z-10"></div>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-900/30 to-black/60 z-10"></div>
      </div>
      
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 text-center">
        <h1 className="hero-title reveal-text">{t('hero_title')}</h1>
        <p className="hero-subtitle reveal-text delay-1">{t('hero_sub')}</p>
        <div className="hero-buttons reveal-text delay-2">
          <a href="#services" className="btn btn-primary btn-glow">{t('btn_explore')}</a>
          <a href="#contact" className="btn btn-outline">{t('btn_contact')}</a>
        </div>
      </div>
      
      <div className="hero-particles"></div>
      
      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
            ></button>
          ))}
        </div>
      )}
    </section>
  );
}
