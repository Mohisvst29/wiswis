"use client";
import React, { useEffect, useState } from 'react';
import { useLang } from '@/components/LangProvider';

export default function Services() {
  const { t, lang } = useLang();
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(data => {
      if (data && data.length > 0) {
        setServices(data);
      }
    }).catch(() => {});
  }, []);

  return (
    <section className="services" id="services">
      <div className="section-header reveal-scroll">
        <h4 className="section-subtitle">{t('services_sub')}</h4>
        <h2 className="section-title">{t('services_title')}</h2>
      </div>
      
      <div className="services-grid">
        {services.length > 0 ? (
          services.map((srv, idx) => (
            <div key={srv._id} className={`service-card reveal-scroll ${idx % 3 === 1 ? 'delay-1' : idx % 3 === 2 ? 'delay-2' : ''}`}>
              <img src={srv.imageUrl} alt={lang === 'ar' ? srv.titleAr : srv.titleEn} className="service-img" />
              <div className="service-overlay"></div>
              <div className="service-content">
                <h3>{lang === 'ar' ? srv.titleAr : srv.titleEn}</h3>
                <p>{lang === 'ar' ? srv.descriptionAr : srv.descriptionEn}</p>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="service-card reveal-scroll">
              <img src="/assets/wiswis_services.png" alt="Fuel Stations" className="service-img" />
              <div className="service-overlay"></div>
              <div className="service-content">
                <h3>{t('srv_fuel')}</h3>
                <p>{t('srv_fuel_desc')}</p>
              </div>
            </div>
            <div className="service-card reveal-scroll delay-1">
              <img src="/assets/wiswis_hero.png" alt="Car Wash" className="service-img" />
              <div className="service-overlay"></div>
              <div className="service-content">
                <h3>{t('srv_wash')}</h3>
                <p>{t('srv_wash_desc')}</p>
              </div>
            </div>
            <div className="service-card reveal-scroll delay-2">
              <img src="/assets/wiswis_about.png" alt="Maintenance" className="service-img" />
              <div className="service-overlay"></div>
              <div className="service-content">
                <h3>{t('srv_maint')}</h3>
                <p>{t('srv_maint_desc')}</p>
              </div>
            </div>
            <div className="service-card reveal-scroll">
              <img src="/assets/wiswis_services.png" alt="Supermarket" className="service-img" />
              <div className="service-overlay"></div>
              <div className="service-content">
                <h3>{t('srv_market')}</h3>
                <p>{t('srv_market_desc')}</p>
              </div>
            </div>
            <div className="service-card reveal-scroll delay-1">
              <img src="/assets/wiswis_hero.png" alt="Coffee" className="service-img" />
              <div className="service-overlay"></div>
              <div className="service-content">
                <h3>{t('srv_coffee')}</h3>
                <p>{t('srv_coffee_desc')}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
