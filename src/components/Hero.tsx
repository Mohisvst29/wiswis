"use client";
import React, { useEffect } from 'react';
import { useLang } from '@/components/LangProvider';

export default function Hero() {
  const { t } = useLang();

  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll('.reveal-text').forEach(el => {
        el.classList.add('active');
      });
    }, 100);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <img src="/assets/wiswis_hero.png" alt="Wiswis Hero" className="hero-image" id="hero-img" />
        <div className="hero-overlay"></div>
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
    </section>
  );
}
