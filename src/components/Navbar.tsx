"use client";
import React, { useEffect, useState } from 'react';
import { useLang } from '@/components/LangProvider';

export default function Navbar() {
  const { lang, toggleLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [logo, setLogo] = useState('');
  const [siteName, setSiteName] = useState('Wiswis');
  const [phones, setPhones] = useState<string[]>(['0554460672', '0530783848']);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
      if (window.innerWidth > 992) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
    
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

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
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
        
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ zIndex: 99999, display: isMobile ? 'block' : 'none', marginInlineStart: 'auto' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        
        <nav 
          className="nav-links" 
          style={isMobile ? { 
            transform: menuOpen ? 'translateX(0)' : (lang === 'ar' ? 'translateX(100%)' : 'translateX(-100%)'),
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? 'auto' : 'none',
            right: lang === 'ar' ? 0 : 'auto',
            left: lang === 'en' ? 0 : 'auto',
            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
          } : undefined}
        >
          <button className="mobile-close-btn" onClick={() => setMenuOpen(false)} style={{ display: isMobile ? 'block' : 'none', position: 'absolute', top: '20px', left: lang === 'ar' ? '20px' : 'auto', right: lang === 'en' ? '20px' : 'auto', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', zIndex: 100000 }}>
            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <a href="#" onClick={() => setMenuOpen(false)}>{t('nav_home')}</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>{t('nav_about')}</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>{t('nav_services')}</a>
          <a href="#branches" onClick={() => setMenuOpen(false)}>{t('nav_branches')}</a>
          <a href="#news" onClick={() => setMenuOpen(false)}>{t('nav_news')}</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>{t('nav_contact')}</a>
        </nav>
        
        <div className="nav-actions desktop-only" style={{ display: 'none' }}>
          <div className="contact-numbers">
            {phones.map((p, i) => <span key={i} dir="ltr">{p}</span>)}
          </div>
        </div>
      </div>
    </header>
  );
}
