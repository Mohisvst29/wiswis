"use client";
import React, { useEffect, useState } from 'react';
import { useLang } from '@/components/LangProvider';
import { Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const { t, lang } = useLang();
  const [logo, setLogo] = useState('');
  const [siteName, setSiteName] = useState('Wiswis');

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data) {
        if (data.logoUrl) setLogo(data.logoUrl);
        if (data.siteNameAr && data.siteNameEn) {
          setSiteName(lang === 'ar' ? data.siteNameAr : data.siteNameEn);
        }
      }
    });
  }, [lang]);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          {logo ? (
            <img src={logo} alt={siteName} className="brand-logo-footer" />
          ) : (
            <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: 'bold' }}>{siteName}</h2>
          )}
          <p>{t('footer_desc')}</p>
        </div>
        <div className="footer-links">
          <h4>{t('footer_links')}</h4>
          <a href="#">{t('nav_home')}</a>
          <a href="#about">{t('nav_about')}</a>
          <a href="#services">{t('nav_services')}</a>
          <a href="#branches">{t('nav_branches')}</a>
        </div>
        <div className="footer-social">
          <h4>{t('footer_social')}</h4>
          <div className="social-icons">
            <a href="#" className="flex items-center justify-center p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="flex items-center justify-center p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="flex items-center justify-center p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Instagram size={20} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
