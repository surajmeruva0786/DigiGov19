import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations, Language, TranslationKey } from '../lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('EN');

    // Load language preference from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('appLanguage') as Language;
        if (savedLang && (savedLang === 'EN' || savedLang === 'HI')) {
            setLanguage(savedLang);
        }
    }, []);

    // Save language preference when changed
    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('appLanguage', lang);
    };

    const t = (key: string): string => {
        // Check if language exists in translations
        if (language === 'EN' || language === 'HI') {
            const langTranslations = translations[language];
            // Check if key exists in translations
            if (key in langTranslations) {
                return (langTranslations as any)[key];
            }
        }

        // Fallback to English if key not found in current language
        if (language !== 'EN' && key in translations.EN) {
            return (translations.EN as any)[key];
        }

        // Return key itself if not found anywhere
        return key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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
