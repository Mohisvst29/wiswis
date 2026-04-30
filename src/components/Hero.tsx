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
    <section className="hero" id="home">
      <div className="hero-bg">
        <AnimatePresence initial={false}>
          {slides.length > 0 && (
            slides[currentIndex].match(/\.(mp4|webm|ogg)$/i) ? (
              <motion.video
                key={currentIndex}
                src={slides[currentIndex]}
                autoPlay loop muted playsInline
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <motion.img
                key={currentIndex}
                src={slides[currentIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="hero-image"
              />
            )
          )}
        </AnimatePresence>
        <div className="hero-overlay" style={{ background: 'rgba(0,0,0,0.6)' }}></div>
      </div>
      
      <div className="hero-content">
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
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 20 }}>
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              style={{ width: '12px', height: '12px', borderRadius: '50%', border: 'none', cursor: 'pointer', transition: 'all 0.3s', backgroundColor: i === currentIndex ? '#fff' : 'rgba(255,255,255,0.4)', transform: i === currentIndex ? 'scale(1.25)' : 'scale(1)' }}
            ></button>
          ))}
        </div>
      )}
    </section>
  );
}
