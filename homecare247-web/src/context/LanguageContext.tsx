'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Language } from '@/types';
import { TRANSLATIONS } from '@/data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('homecare247_lang') as Language;
      if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'bn')) {
        setLanguageState(savedLang);
      }
    } catch {
      // Ignore localStorage errors in private browsing
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('homecare247_lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // Ignore
    }
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    return TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

