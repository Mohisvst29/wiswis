"use client";
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLang } from '@/components/LangProvider';

interface GalleryImage {
  _id: string;
  url: string;
  caption?: { ar?: string; en?: string };
  order: number;
}

export default function Gallery() {
  const { t, lang } = useLang();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setImages(data);
      })
      .catch(() => {});
  }, []);

  // Register own IntersectionObserver after images load
  useEffect(() => {
    if (images.length === 0 || !sectionRef.current) return;

    const revealElements = sectionRef.current.querySelectorAll('.reveal-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [images]);

  const openLightbox = useCallback((index: number) => {
    setLightbox(index);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    document.body.style.overflow = '';
  }, []);

  const navigate = useCallback((dir: number) => {
    if (lightbox === null) return;
    const next = lightbox + dir;
    if (next >= 0 && next < images.length) {
      setLightbox(next);
    }
  }, [lightbox, images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(lang === 'ar' ? 1 : -1);
      if (e.key === 'ArrowRight') navigate(lang === 'ar' ? -1 : 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, navigate, closeLightbox, lang]);

  const handleImageLoad = (id: string) => {
    setLoaded(prev => new Set(prev).add(id));
  };

  if (images.length === 0) return null;

  return (
    <>
      <section className="gallery" id="gallery" ref={sectionRef}>
        <div className="section-header reveal-scroll">
          <h4 className="section-subtitle">{t('gallery_sub')}</h4>
          <h2 className="section-title">{t('gallery_title')}</h2>
        </div>

        <div className="gallery-grid reveal-scroll">
          {images.map((img, index) => (
            <div
              key={img._id}
              className={`gallery-item ${loaded.has(img._id) ? 'loaded' : ''}`}
              onClick={() => openLightbox(index)}
            >
              <img
                src={img.url}
                alt={img.caption ? (lang === 'ar' ? img.caption.ar : img.caption.en) || '' : ''}
                loading="lazy"
                onLoad={() => handleImageLoad(img._id)}
              />
              <div className="gallery-item-overlay">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
                {img.caption && (lang === 'ar' ? img.caption.ar : img.caption.en) && (
                  <p className="gallery-caption">{lang === 'ar' ? img.caption.ar : img.caption.en}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <button
              className="lightbox-nav lightbox-prev"
              onClick={() => navigate(-1)}
              disabled={lightbox === 0}
              aria-label="Previous"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <img
              src={images[lightbox].url}
              alt={images[lightbox].caption ? (lang === 'ar' ? images[lightbox].caption?.ar : images[lightbox].caption?.en) || '' : ''}
              className="lightbox-img"
            />

            <button
              className="lightbox-nav lightbox-next"
              onClick={() => navigate(1)}
              disabled={lightbox === images.length - 1}
              aria-label="Next"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            {images[lightbox].caption && (lang === 'ar' ? images[lightbox].caption?.ar : images[lightbox].caption?.en) && (
              <div className="lightbox-caption">
                {lang === 'ar' ? images[lightbox].caption?.ar : images[lightbox].caption?.en}
              </div>
            )}

            <div className="lightbox-counter">
              {lightbox + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

