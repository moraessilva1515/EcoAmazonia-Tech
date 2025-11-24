import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { getTranslation } from './translations';
import type { Language } from './types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, ...args: any[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('ecoAmazoniaLanguage');
    return (savedLang && ['pt', 'en', 'es'].includes(savedLang) ? savedLang : 'pt') as Language;
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('ecoAmazoniaLanguage', lang);
    setLanguageState(lang);
  };

  const t = useCallback((key: string, ...args: any[]): string => {
    return getTranslation(language, key, ...args);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
