"use client";
import React, { useEffect, useState } from 'react';
import { useLang } from '@/components/LangProvider';
import Image from 'next/image';

export default function Navbar() {
  const { lang, toggleLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <div className="logo">
          <img src="/assets/logo.png" alt="Wiswis Logo" className="brand-logo" />
        </div>
        
        <nav className="nav-links">
          <a href="#about">{t('nav_about')}</a>
          <a href="#services">{t('nav_services')}</a>
          <a href="#branches">{t('nav_branches')}</a>
          <a href="#news">{t('nav_news')}</a>
          <a href="#contact">{t('nav_contact')}</a>
        </nav>

        <div className="nav-actions">
          <div className="contact-numbers">
            <span>0554460672</span>
            <span>0530783848</span>
          </div>
          <button className="lang-toggle" onClick={toggleLang}>
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>
        </div>
      </div>
    </header>
  );
}
