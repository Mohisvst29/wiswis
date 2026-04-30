"use client";
import React, { useEffect, useState } from 'react';
import { useLang } from '@/components/LangProvider';

export default function News() {
  const { t, lang } = useLang();
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/news').then(r => r.json()).then(data => {
      if (data && data.length > 0) setNews(data);
    }).catch(() => {});
  }, []);

  return (
    <section className="news" id="news">
      <div className="section-header reveal-scroll">
        <h4 className="section-subtitle">{t('news_sub')}</h4>
        <h2 className="section-title">{t('news_title')}</h2>
      </div>

      <div className="news-layout reveal-scroll">
        <div className="news-featured">
          <div className="news-img-wrapper">
            <img src="/assets/wiswis_about.png" alt="Featured News" />
          </div>
          <div className="news-content">
            <span className="news-date">Oct 15, 2026</span>
            <h3>{t('news_1_title')}</h3>
            <p>{t('news_1_desc')}</p>
            <a href="#" className="read-more">{t('read_more')}</a>
          </div>
        </div>
        <div className="news-grid">
          <div className="news-item">
            <div className="news-img-wrapper">
              <img src="/assets/wiswis_services.png" alt="News 2" />
            </div>
            <div className="news-content">
              <span className="news-date">Sep 28, 2026</span>
              <h4>{t('news_2_title')}</h4>
              <a href="#" className="read-more">{t('read_more')}</a>
            </div>
          </div>
          <div className="news-item">
            <div className="news-img-wrapper">
              <img src="/assets/wiswis_hero.png" alt="News 3" />
            </div>
            <div className="news-content">
              <span className="news-date">Sep 10, 2026</span>
              <h4>{t('news_3_title')}</h4>
              <a href="#" className="read-more">{t('read_more')}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
