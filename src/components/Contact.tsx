"use client";
import React, { useState, useEffect } from 'react';
import { useLang } from '@/components/LangProvider';
import { Phone, Mail, MapPin, Send, MessageSquare, AlertTriangle, Briefcase, DollarSign, Paperclip, ChevronDown, X } from "lucide-react";

export default function Contact() {
  const { lang, t } = useLang();
  const [msgType, setMsgType] = useState('استفسار عام');
  const [btnText, setBtnText] = useState(lang === 'ar' ? 'إرسال الرسالة' : 'Send Message');
  const [btnBg, setBtnBg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phones, setPhones] = useState<string[]>(['0554460672', '0530783848']);
  const [emails, setEmails] = useState<string[]>(['info@wiswis.com']);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data) {
        if (data.phone) setPhones(data.phone.split(',').map((p:string) => p.trim()).filter(Boolean));
        if (data.email) setEmails(data.email.split(',').map((e:string) => e.trim()).filter(Boolean));
      }
    });

    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('openContactModal', handleOpenModal);
    return () => window.removeEventListener('openContactModal', handleOpenModal);
  }, []);

  const messageTypes = [
    { id: 'استفسار عام', icon: <MessageSquare size={20} />, label: lang === 'ar' ? 'استفسار عام' : 'General Inquiry' },
    { id: 'شكوى', icon: <AlertTriangle size={20} />, label: lang === 'ar' ? 'شكوى' : 'Complaint' },
    { id: 'خدمات المستثمرين', icon: <DollarSign size={20} />, label: lang === 'ar' ? 'خدمات المستثمرين' : 'Investor Services' },
    { id: 'التقديم على وظيفة', icon: <Briefcase size={20} />, label: lang === 'ar' ? 'التقديم على وظيفة' : 'Job Application' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    setBtnText(lang === 'ar' ? 'جاري الإرسال...' : 'Sending...');
    
    setTimeout(() => {
      setBtnText(lang === 'ar' ? 'تم الإرسال بنجاح' : 'Sent Successfully');
      setBtnBg('#10B981');
      setTimeout(() => {
        setBtnText(lang === 'ar' ? 'إرسال الرسالة' : 'Send Message');
        setBtnBg('');
        form.reset();
        setIsModalOpen(false);
      }, 3000);
    }, 1500);
  };

  return (
    <section className="contact" id="contact" style={{ padding: '6rem 0', background: 'var(--color-bg)' }}>
      <div className="contact-container reveal-scroll" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
        
        <div className="contact-info" style={{ background: 'var(--color-card)', padding: '4rem 2rem', borderRadius: '24px', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <h4 className="section-subtitle" style={{ justifyContent: 'center' }}>{t('contact_sub')}</h4>
          <h2 className="section-title">{t('contact_title')}</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>{t('contact_text')}</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}><Phone size={24} /></div>
              <div dir="ltr" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{phones[0]}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}><Mail size={24} /></div>
              <div dir="ltr" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{emails[0]}</div>
            </div>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ padding: '1rem 3rem', borderRadius: '50px', fontSize: '1.2rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)' }}>
            <Send size={20} />
            {lang === 'ar' ? 'أرسل لنا رسالة' : 'Send us a message'}
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(5px)' }}>
          
          <div style={{ background: '#faf9f6', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', color: '#1a1a1a', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            
            {/* Close Button */}
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', left: lang === 'ar' ? '1.5rem' : 'auto', right: lang === 'en' ? '1.5rem' : 'auto', background: 'rgba(0,0,0,0.05)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4a2b2b', transition: 'all 0.2s' }}>
              <X size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '2rem', gap: '1rem', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
              <div style={{ width: '50px', height: '50px', background: '#fef3c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                <Send size={24} />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: '#3b1c1c' }}>{lang === 'ar' ? 'أرسل لنا رسالة' : 'Send us a message'}</h2>
            </div>

            <form id="contactForm" onSubmit={handleSubmit} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              
              {/* Message Type */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.8rem', color: '#4a2b2b' }}>{lang === 'ar' ? 'نوع الرسالة *' : 'Message Type *'}</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
                  {messageTypes.map(type => (
                    <div 
                      key={type.id} 
                      onClick={() => setMsgType(type.id)}
                      style={{ 
                        padding: '0.8rem', borderRadius: '12px', border: msgType === type.id ? '2px solid #f59e0b' : '1px solid #e5e7eb', 
                        background: msgType === type.id ? '#fffdf5' : '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontWeight: '600', color: msgType === type.id ? '#f59e0b' : '#6b7280', fontSize: '0.95rem' }}>{type.label}</span>
                      <span style={{ color: msgType === type.id ? '#f59e0b' : '#374151' }}>{type.icon}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Type */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.8rem', color: '#4a2b2b' }}>{lang === 'ar' ? 'نوع الخدمة المطلوبة *' : 'Service Type *'}</label>
                <div style={{ position: 'relative' }}>
                  <select required style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #7A0C16', background: '#ffffff', color: '#1a1a1a', fontSize: '1rem', appearance: 'none', outline: 'none' }}>
                    <option value="">{lang === 'ar' ? 'اختر نوع الخدمة' : 'Select Service Type'}</option>
                    <option value="محروقات">{lang === 'ar' ? 'محروقات' : 'Fuel'}</option>
                    <option value="صيانة">{lang === 'ar' ? 'صيانة سيارات' : 'Car Maintenance'}</option>
                    <option value="تجزئة">{lang === 'ar' ? 'متجر تموينات' : 'Convenience Store'}</option>
                  </select>
                  <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: lang === 'ar' ? '1rem' : 'auto', right: lang === 'en' ? '1rem' : 'auto', pointerEvents: 'none', color: '#9ca3af' }}>
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>

              {/* Name and Email */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.8rem', color: '#4a2b2b' }}>{lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}</label>
                  <input type="text" required placeholder={lang === 'ar' ? 'أدخل اسمك' : 'Enter your name'} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#ffffff', color: '#1a1a1a', fontSize: '1rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.8rem', color: '#4a2b2b' }}>{lang === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}</label>
                  <input type="email" required placeholder="example@email.com" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#ffffff', color: '#1a1a1a', fontSize: '1rem', outline: 'none', textAlign: 'left' }} />
                </div>
              </div>

              {/* Phone and City */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.8rem', color: '#4a2b2b' }}>{lang === 'ar' ? 'رقم الجوال *' : 'Mobile Number *'}</label>
                  <input type="tel" required placeholder="05xxxxxxxx" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#ffffff', color: '#1a1a1a', fontSize: '1rem', outline: 'none', textAlign: 'left' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.8rem', color: '#4a2b2b' }}>{lang === 'ar' ? 'المدينة' : 'City'}</label>
                  <input type="text" placeholder={lang === 'ar' ? 'المدينة (اختياري)' : 'City (Optional)'} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#ffffff', color: '#1a1a1a', fontSize: '1rem', outline: 'none' }} />
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.8rem', color: '#4a2b2b' }}>{lang === 'ar' ? 'رسالتك *' : 'Your Message *'}</label>
                <textarea required rows={4} placeholder={lang === 'ar' ? 'اكتب تفاصيل طلبك...' : 'Write your request details...'} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#ffffff', color: '#1a1a1a', fontSize: '1rem', outline: 'none', resize: 'vertical' }}></textarea>
              </div>

              {/* File Upload & Submit */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                  <input type="file" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontWeight: 'bold' }}>
                    <Paperclip size={20} />
                    <span>{lang === 'ar' ? 'إرفاق مستندات (اختياري)' : 'Attach Documents (Optional)'}</span>
                  </div>
                </div>
                
                <button type="submit" style={{ padding: '1rem 3rem', background: btnBg || 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 10px 20px rgba(122, 12, 22, 0.3)' }}>
                  {btnText}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
