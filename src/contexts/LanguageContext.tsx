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

    // Queue for translation
    const [stats, setStats] = useState({ pending: 0, translated: 0 });

    useEffect(() => {
        if (language !== 'HI') {
            restorePageContent();
            return;
        }

        // Initial scan
        scanAndQueue();

        // Observer for dynamic content
        const observer = new MutationObserver((mutations) => {
            let shouldScan = false;
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    shouldScan = true;
                }
                if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
                    // Verify if this is not a result of our own translation
                    const parent = mutation.target.parentElement;
                    if (parent && parent.getAttribute('data-translated') !== 'true') {
                        shouldScan = true;
                    }
                }
            });

            if (shouldScan) {
                // Debounce scan
                scanAndQueue();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        return () => observer.disconnect();
    }, [language]);

    // Ref to track processing queue to avoid closures capturing old state
    const processingRef = React.useRef(false);
    const queueRef = React.useRef<Set<Node>>(new Set());
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    const scanAndQueue = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            if (processingRef.current) return; // Busy

            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        const parent = node.parentElement;
                        if (!parent) return NodeFilter.FILTER_REJECT;

                        // Skip scripts, styles
                        const tagName = parent.tagName;
                        if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'NOSCRIPT') {
                            return NodeFilter.FILTER_REJECT;
                        }

                        // Skip already translated
                        if (parent.getAttribute('data-translated') === 'true') {
                            return NodeFilter.FILTER_REJECT;
                        }

                        // Skip empty
                        if (!node.nodeValue?.trim()) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        // Check if pure numbers or extremely short content (e.g. punctuation)
                        if (/^[\d\s\p{P}]+$/u.test(node.nodeValue || '')) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            let node = walker.nextNode();
            while (node) {
                queueRef.current.add(node);
                node = walker.nextNode();
            }

            if (queueRef.current.size > 0) {
                await processQueue();
            }
        }, 1000); // 1 second debounce
    };

    const processQueue = async () => {
        if (queueRef.current.size === 0 || processingRef.current) return;

        processingRef.current = true;

        // Take a batch of nodes
        const nodes = Array.from(queueRef.current).slice(0, 20); // Batch size 20
        // Remove them from queue immediately so we don't double process
        nodes.forEach(n => queueRef.current.delete(n));

        const texts = nodes.map(n => n.nodeValue || '').filter(t => t.trim());

        if (texts.length > 0) {
            try {
                const { translateBatch } = await import('../lib/gemini');
                const translations = await translateBatch(texts, 'Hindi');

                // Apply translations
                nodes.forEach((node, index) => {
                    const translatedText = translations[index];
                    if (translatedText && node.nodeValue !== translatedText) {
                        // Save original
                        if (node.parentElement && !node.parentElement.getAttribute('data-original-text')) {
                            node.parentElement.setAttribute('data-original-text', node.nodeValue || '');
                        }

                        node.nodeValue = translatedText;
                        node.parentElement?.setAttribute('data-translated', 'true');
                    }
                });
            } catch (error) {
                console.error('Queue processing error:', error);
                // On error, maybe add back to queue? No, skip to prevent loop.
            }
        }

        processingRef.current = false;

        // If more items, schedule next batch
        if (queueRef.current.size > 0) {
            setTimeout(processQueue, 2000); // Wait 2s between batches to stay within rate limit
        }
    };

    const restorePageContent = () => {
        queueRef.current.clear(); // Clear queue
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        const translatedElements = document.querySelectorAll('[data-translated="true"]');
        translatedElements.forEach(element => {
            const originalText = element.getAttribute('data-original-text');
            if (originalText) {
                element.textContent = originalText;
                element.removeAttribute('data-translated');
                element.removeAttribute('data-original-text');
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

