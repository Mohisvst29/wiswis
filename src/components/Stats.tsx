"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useLang } from '@/components/LangProvider';

export default function Stats() {
  const { t } = useLang();
  const [animated, setAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
          const numbers = containerRef.current?.querySelectorAll('.stat-number');
          numbers?.forEach((el: any) => {
            const target = parseInt(el.getAttribute('data-target') || '0');
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
              current += step;
              if (current < target) {
                el.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = target;
              }
            };
            updateCounter();
          });
        }
      });
    }, { threshold: 0.1 });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <section className="stats" id="stats">
      <div className="stats-container reveal-scroll" ref={containerRef}>
        <div className="stat-item">
          <span className="stat-number" data-target="25">0</span><span className="stat-plus">+</span>
          <p className="stat-label">{t('stat_years')}</p>
        </div>
        <div className="stat-separator"></div>
        <div className="stat-item">
          <span className="stat-number" data-target="150">0</span><span className="stat-plus">+</span>
          <p className="stat-label">{t('stat_branches')}</p>
        </div>
        <div className="stat-separator"></div>
        <div className="stat-item">
          <span className="stat-number" data-target="10">0</span><span className="stat-letter">M</span>
          <p className="stat-label">{t('stat_clients')}</p>
        </div>
        <div className="stat-separator"></div>
        <div className="stat-item">
          <span className="stat-number" data-target="24">0</span><span className="stat-letter">/7</span>
          <p className="stat-label">{t('stat_support')}</p>
        </div>
      </div>
    </section>
  );
}
