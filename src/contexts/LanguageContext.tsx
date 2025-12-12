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

    // Auto-translate page content when language changes to Hindi
    useEffect(() => {
        if (language === 'HI') {
            translatePageContent();
        } else {
            // Restore original content if switching back to English
            restorePageContent();
        }
    }, [language]);

    const translatePageContent = async () => {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Skip scripts, styles, and already translated nodes
                    if (
                        node.parentElement?.tagName === 'SCRIPT' ||
                        node.parentElement?.tagName === 'STYLE' ||
                        node.parentElement?.getAttribute('data-translated') === 'true'
                    ) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Skip empty or whitespace-only nodes
                    if (!node.nodeValue?.trim()) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodesToTranslate: Node[] = [];
        let currentNode = walker.nextNode();
        while (currentNode) {
            nodesToTranslate.push(currentNode);
            currentNode = walker.nextNode();
        }

        // Process in batches to avoid overwhelming the browser/API
        const batchSize = 10;
        for (let i = 0; i < nodesToTranslate.length; i += batchSize) {
            const batch = nodesToTranslate.slice(i, i + batchSize);
            await Promise.all(batch.map(async (node) => {
                if (node.nodeValue) {
                    const originalText = node.nodeValue.trim();
                    // Store original text for restoration
                    if (!node.parentElement?.getAttribute('data-original-text')) {
                        node.parentElement?.setAttribute('data-original-text', originalText);
                    }

                    try {
                        // Import translate function dynamically to avoid circular dependencies if any
                        const { translateText } = await import('../lib/gemini');
                        const translatedText = await translateText(originalText, 'Hindi');

                        // Update text content
                        node.nodeValue = translatedText;
                        node.parentElement?.setAttribute('data-translated', 'true');
                    } catch (error) {
                        console.error('Failed to translate node:', error);
                    }
                }
            }));
        }
    };

    const restorePageContent = () => {
        const translatedElements = document.querySelectorAll('[data-translated="true"]');
        translatedElements.forEach(element => {
            const originalText = element.getAttribute('data-original-text');
            if (originalText) {
                // Find the text node child and restore it
                // This is a simplification; for complex nodes it might be trickier
                // but usually text nodes are direct children we targeted.
                // However, since we wrapped the logic in a TreeWalker targeting text nodes,
                // we should be careful. 
                // A safer way is to rely on React re-rendering for most things, 
                // relying on this only for static content not covered by React state.
                // Actually, simpler restoration:
                element.textContent = originalText;
                element.removeAttribute('data-translated');
                // element.removeAttribute('data-original-text'); // Keep it cached? No, remove to be clean.
            }
        });
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

