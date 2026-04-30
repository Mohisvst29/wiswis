"use client";
import React from 'react';
import { useLang } from '@/components/LangProvider';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/assets/logo.png" alt="Wiswis Logo" className="brand-logo-footer" />
          <p>{t('footer_desc')}</p>
        </div>
        <div className="footer-links">
          <h4>{t('footer_links')}</h4>
          <a href="#about">{t('nav_about')}</a>
          <a href="#services">{t('nav_services')}</a>
          <a href="#branches">{t('nav_branches')}</a>
        </div>
        <div className="footer-social">
          <h4>{t('footer_social')}</h4>
          <div className="social-icons">
            <a href="#">X</a>
            <a href="#">In</a>
            <a href="#">Ig</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Wiswis Petroleum. All rights reserved.</p>
      </div>
    </footer>
  );
}
