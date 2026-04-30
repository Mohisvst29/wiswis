"use client";
import React, { useEffect, useState } from 'react';
import { useLang } from '@/components/LangProvider';
import { AnimatePresence, motion } from 'framer-motion';

export default function Hero() {
  const { t } = useLang();
  const [slides, setSlides] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/settings?key=heroSlides')
      .then(r => r.json())
      .then(data => {
        if (data && data.value && Array.isArray(data.value) && data.value.length > 0) {
          setSlides(data.value);
        } else {
          // Check for single background fallback
          fetch('/api/settings?key=heroBgUrl').then(r => r.json()).then(d => {
            if (d && d.value) setSlides([d.value]);
            else setSlides(['/assets/wiswis_hero.png']);
          });
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
    <section className="hero" id="home">
      <div className="hero-bg overflow-hidden relative w-full h-full">
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
              />
            )
          )}
        </AnimatePresence>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content relative z-10">
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
