"use client";
import React, { useState } from 'react';
import { useLang } from '@/components/LangProvider';

export default function Contact() {
  const { t, lang } = useLang();
  const [btnText, setBtnText] = useState(t('btn_send'));
  const [btnBg, setBtnBg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    // Simulate API call
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      setBtnText(lang === 'ar' ? 'تم الإرسال بنجاح' : 'Sent Successfully');
      setBtnBg('#10B981');
      setTimeout(() => {
        setBtnText(t('btn_send'));
        setBtnBg('');
        form.reset();
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-container reveal-scroll">
        <div className="contact-info">
          <h4 className="section-subtitle">{t('contact_sub')}</h4>
          <h2 className="section-title">{t('contact_title')}</h2>
          <p>{t('contact_text')}</p>
          
          <div className="info-items">
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <p>0554460672</p>
                <p>0530783848</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">✉️</div>
              <p>info@wiswis.com</p>
            </div>
            <div className="info-item">
              <div className="info-icon">📍</div>
              <p>{t('contact_address')}</p>
            </div>
          </div>
        </div>
        <div className="contact-form">
          <form id="contactForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" id="name" name="name" required placeholder=" " />
              <label htmlFor="name">{t('form_name')}</label>
            </div>
            <div className="form-group">
              <input type="email" id="email" name="email" required placeholder=" " />
              <label htmlFor="email">{t('form_email')}</label>
            </div>
            <div className="form-group">
              <input type="text" id="subject" name="subject" required placeholder=" " />
              <label htmlFor="subject">{t('form_subject')}</label>
            </div>
            <div className="form-group">
              <textarea id="message" name="message" rows={4} required placeholder=" "></textarea>
              <label htmlFor="message">{t('form_message')}</label>
            </div>
            <button type="submit" className="btn btn-primary" style={{ background: btnBg }}>{btnText}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
