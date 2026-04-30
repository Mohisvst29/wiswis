"use client";
import React, { useEffect, useState } from 'react';
import { useLang } from '@/components/LangProvider';

export default function Branches() {
  const { t, lang } = useLang();
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/branches').then(r => r.json()).then(data => {
      if (data && data.length > 0) setBranches(data);
    }).catch(() => {});
  }, []);

  return (
    <section className="branches" id="branches">
      <div className="section-header reveal-scroll">
        <h4 className="section-subtitle">{t('branches_sub')}</h4>
        <h2 className="section-title">{t('branches_title')}</h2>
      </div>
      
      <div className="branches-container reveal-scroll">
        <div className="branches-sidebar">
          <div className="filter-group">
            <button className="filter-btn active">{t('city_all')}</button>
            <button className="filter-btn">{t('city_riyadh')}</button>
            <button className="filter-btn">{t('city_jeddah')}</button>
            <button className="filter-btn">{t('city_dammam')}</button>
          </div>
          <div className="branches-list">
            {branches.length > 0 ? (
              branches.map((b, i) => (
                <div key={b._id} className={`branch-card ${i === 0 ? 'active' : ''}`}>
                  <h4>{lang === 'ar' ? b.nameAr : b.nameEn}</h4>
                  <p>{lang === 'ar' ? b.descAr : b.descEn}</p>
                </div>
              ))
            ) : (
              <>
                <div className="branch-card active">
                  <h4>{t('branch_1')}</h4>
                  <p>{t('branch_1_desc')}</p>
                </div>
                <div className="branch-card">
                  <h4>{t('branch_2')}</h4>
                  <p>{t('branch_2_desc')}</p>
                </div>
                <div className="branch-card">
                  <h4>{t('branch_3')}</h4>
                  <p>{t('branch_3_desc')}</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="branches-map">
          <div className="map-placeholder">
            <div className="map-pin active" style={{ top: '40%', left: '30%' }}></div>
            <div className="map-pin" style={{ top: '60%', left: '50%' }}></div>
            <div className="map-pin" style={{ top: '30%', left: '70%' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
