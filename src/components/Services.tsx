"use client";
import React, { useEffect, useState } from 'react';
import { useLang } from '@/components/LangProvider';

export default function Services() {
  const { t, lang } = useLang();
  const [services, setServices] = useState<any[]>([]);
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data && data.whatsapp) setWhatsapp(data.whatsapp);
    });
    fetch('/api/services').then(r => r.json()).then(data => {
      if (data && data.length > 0) {
        setServices(data);
        setTimeout(() => {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
          document.querySelectorAll('#services .reveal-scroll').forEach(el => observer.observe(el));
        }, 100);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <section className="services" id="services">
      <div className="section-header reveal-scroll">
        <h4 className="section-subtitle">{t('services_sub')}</h4>
        <h2 className="section-title">{t('services_title')}</h2>
      </div>
      
      <div className="services-grid">
        {loading ? (
          <div className="w-full col-span-full h-[300px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : services.length > 0 ? (
          services.map((srv, idx) => (
            <div key={srv._id} className={`service-card reveal-scroll ${idx % 3 === 1 ? 'delay-1' : idx % 3 === 2 ? 'delay-2' : ''}`}>
              <img src={srv.imageUrl} alt={lang === 'ar' ? srv.titleAr : srv.titleEn} className="service-img" />
              <div className="service-overlay"></div>
              <div className="service-content">
                <h3>{lang === 'ar' ? srv.titleAr : srv.titleEn}</h3>
                <p>{lang === 'ar' ? srv.descriptionAr : srv.descriptionEn}</p>
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(lang === 'ar' ? `أريد طلب خدمة: ${srv.titleAr}` : `I want to request service: ${srv.titleEn}`)}`} 
                     target="_blank" rel="noopener noreferrer" 
                     className="mt-4 inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#25D366]/30 hover:bg-[#128C7E] hover:scale-105 transition-all w-fit">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path></svg>
                    {lang === 'ar' ? 'طلب الخدمة' : 'Request'}
                  </a>
                )}
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
