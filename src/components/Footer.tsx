"use client";
import React, { useEffect, useState } from 'react';
import { useLang } from '@/components/LangProvider';

export default function Footer() {
  const { t, lang } = useLang();
  const [logo, setLogo] = useState('');
  const [siteName, setSiteName] = useState(lang === 'ar' ? 'شركة وسوس للتجارة' : 'Wiswis Trading Company');

  const [socials, setSocials] = useState<any>({});

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data) {
        if (data.logoUrl) setLogo(data.logoUrl);
        if (data.siteNameAr && data.siteNameEn) {
          setSiteName(lang === 'ar' ? data.siteNameAr : data.siteNameEn);
        }
        setSocials({
          tiktok: data.socialTiktok,
          instagram: data.socialInstagram,
          facebook: data.socialFacebook,
          twitter: data.socialTwitter,
          snapchat: data.socialSnapchat,
          linkedin: data.socialLinkedin
        });
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
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 bg-white/10 rounded-full hover:bg-[var(--color-primary)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 bg-white/10 rounded-full hover:bg-[var(--color-primary)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 bg-white/10 rounded-full hover:bg-[var(--color-primary)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            )}
            {socials.facebook && (
              <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 bg-white/10 rounded-full hover:bg-[var(--color-primary)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            )}
            {socials.tiktok && (
              <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 bg-white/10 rounded-full hover:bg-[var(--color-primary)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-8-8H7v12Z"/></svg>
              </a>
            )}
            {socials.snapchat && (
              <a href={socials.snapchat} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 bg-white/10 rounded-full hover:bg-[var(--color-primary)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.14 4.54a4.5 4.5 0 0 1 3.72 0c1.07.51 1.74 1.63 1.74 2.83 0 1.25-.76 2.4-1.93 2.82l-.4.14c-.6.22-1 .78-1 1.41a1 1 0 0 1-1.63.76l-.08-.06a2.8 2.8 0 0 0-3.12 0l-.08.06a1 1 0 0 1-1.63-.76c0-.63-.4-1.2-1-1.41l-.4-.14C3.26 9.77 2.5 8.62 2.5 7.37c0-1.2.67-2.32 1.74-2.83Z"/><path d="M2.5 12c.98.54 1.8 1.4 2.22 2.45l.28.66a2 2 0 0 0 1.23 1.1l.6.17c1.3.38 2.05 1.71 1.72 3a2.9 2.9 0 0 1-1.9 2.1l-.8.27A1 1 0 0 0 5 22.8c0 .66.54 1.2 1.2 1.2h11.6c.66 0 1.2-.54 1.2-1.2a1 1 0 0 0-.85-1.05l-.8-.27a2.9 2.9 0 0 1-1.9-2.1c-.33-1.29.42-2.62 1.72-3l.6-.17a2 2 0 0 0 1.23-1.1l.28-.66C19.7 13.4 20.52 12.54 21.5 12"/><path d="M8.5 16h7"/></svg>
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
