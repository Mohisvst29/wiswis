"use client";
import React, { useState } from 'react';
import { useLang } from '@/components/LangProvider';
import { Send, MessageSquare, AlertTriangle, Briefcase, DollarSign, Paperclip, ChevronDown } from "lucide-react";

export default function Contact() {
  const { lang } = useLang();
  const [msgType, setMsgType] = useState('استفسار عام');
  const [btnText, setBtnText] = useState(lang === 'ar' ? 'إرسال الرسالة' : 'Send Message');
  const [btnBg, setBtnBg] = useState('');

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
      }, 3000);
    }, 1500);
  };

  return (
    <section className="contact" id="contact" style={{ padding: '6rem 0', background: 'var(--color-bg)' }}>
      <div className="contact-container reveal-scroll" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
        
        <div className="premium-form-card" style={{ background: '#faf9f6', borderRadius: '24px', padding: '3rem', color: '#1a1a1a', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '2.5rem', gap: '1rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: '#3b1c1c' }}>{lang === 'ar' ? 'أرسل لنا رسالة' : 'Send us a message'}</h2>
            <div style={{ width: '50px', height: '50px', background: '#fef3c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <Send size={24} />
            </div>
          </div>

          <form id="contactForm" onSubmit={handleSubmit} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            
            {/* Message Type */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '1rem', color: '#4a2b2b' }}>{lang === 'ar' ? 'نوع الرسالة *' : 'Message Type *'}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {messageTypes.map(type => (
                  <div 
                    key={type.id} 
                    onClick={() => setMsgType(type.id)}
                    style={{ 
                      padding: '1rem', borderRadius: '12px', border: msgType === type.id ? '2px solid #f59e0b' : '1px solid #e5e7eb', 
                      background: msgType === type.id ? '#fffdf5' : '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontWeight: '600', color: msgType === type.id ? '#f59e0b' : '#6b7280' }}>{type.label}</span>
                    <span style={{ color: msgType === type.id ? '#f59e0b' : '#374151' }}>{type.icon}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Type */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.8rem', color: '#4a2b2b' }}>{lang === 'ar' ? 'نوع الخدمة المطلوبة *' : 'Service Type *'}</label>
              <div style={{ position: 'relative' }}>
                <select required style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '1px solid #7A0C16', background: '#ffffff', color: '#1a1a1a', fontSize: '1rem', appearance: 'none', outline: 'none' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
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
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.8rem', color: '#4a2b2b' }}>{lang === 'ar' ? 'رسالتك *' : 'Your Message *'}</label>
              <textarea required rows={5} placeholder={lang === 'ar' ? 'اكتب تفاصيل طلبك...' : 'Write your request details...'} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#ffffff', color: '#1a1a1a', fontSize: '1rem', outline: 'none', resize: 'vertical' }}></textarea>
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
    </section>
  );
}
