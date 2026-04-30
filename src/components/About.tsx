"use client";
import React, { useState, useEffect } from 'react';
import { useLang } from '@/components/LangProvider';

export default function About() {
  const { t } = useLang();
  const [pdfLink, setPdfLink] = useState('#');

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data && data.certificatePdf) {
        setPdfLink(data.certificatePdf);
      }
    });
  }, []);

  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="about-image-wrapper reveal-scroll left">
          <img src="/assets/wiswis_about.png" alt="About Wiswis" className="about-img" />
          <div className="floating-badge">
            <span className="badge-number">25+</span>
            <span className="badge-text">{t('badge_text')}</span>
          </div>
        </div>
        <div className="about-content reveal-scroll right">
          <h4 className="section-subtitle">{t('about_sub')}</h4>
          <h2 className="section-title">{t('about_title')}</h2>
          <p className="about-text">{t('about_text')}</p>
          <ul className="about-features">
            <li>{t('feat_1')}</li>
            <li>{t('feat_2')}</li>
            <li>{t('feat_3')}</li>
          </ul>
          <div className="about-buttons">
            <a href="#services" className="btn btn-primary btn-glow">{t('btn_learn_more')}</a>
            {pdfLink !== '#' && (
              <a href={pdfLink} className="btn btn-outline btn-icon" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span>{t('btn_trademark')}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
