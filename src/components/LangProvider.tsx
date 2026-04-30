"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

type LangContextType = {
  lang: 'en' | 'ar';
  toggleLang: () => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextType>({
  lang: 'en',
  toggleLang: () => {},
  t: () => '',
});

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<'en' | 'ar'>('ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key: string) => translations[lang][key] || key;

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
