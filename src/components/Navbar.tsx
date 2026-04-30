"use client";
import React, { useEffect, useState } from 'react';
import { useLang } from '@/components/LangProvider';

export default function Navbar() {
  const { lang, toggleLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [logo, setLogo] = useState('');
  const [siteName, setSiteName] = useState('Wiswis');
  const [phones, setPhones] = useState<string[]>(['0554460672', '0530783848']);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch settings for dynamic logo and phones
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data) {
        if (data.logoUrl) setLogo(data.logoUrl);
        if (data.siteNameAr && data.siteNameEn) {
          setSiteName(lang === 'ar' ? data.siteNameAr : data.siteNameEn);
        }
        if (data.phone) {
          setPhones(data.phone.split(',').map((p:string) => p.trim()).filter(Boolean));
        }
      }
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lang]);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <div className="logo">
          {logo ? (
            <img src={logo} alt={siteName} className="brand-logo" />
          ) : (
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{siteName}</h2>
          )}
        </div>
        
        <nav className="nav-links">
          <a href="#">{t('nav_home')}</a>
          <a href="#about">{t('nav_about')}</a>
          <a href="#services">{t('nav_services')}</a>
          <a href="#branches">{t('nav_branches')}</a>
          <a href="#news">{t('nav_news')}</a>
          <a href="#contact">{t('nav_contact')}</a>
        </nav>

        <div className="nav-actions">
          <div className="contact-numbers">
            {phones.map((p, i) => <span key={i} dir="ltr">{p}</span>)}
          </div>
          <button className="lang-toggle" onClick={toggleLang}>
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>
        </div>
      </div>
    </header>
  );
}
