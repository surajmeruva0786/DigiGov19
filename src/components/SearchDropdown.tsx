import { motion, AnimatePresence } from 'motion/react';
import { FileText, MessageSquare, Folder, GraduationCap, ChevronRight, Loader2 } from 'lucide-react';
import { SearchResult } from '../lib/searchService';
import { Card } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchDropdownProps {
    results: SearchResult[];
    isLoading: boolean;
    onResultClick: (result: SearchResult) => void;
    onClose: () => void;
}

const getIcon = (type: string) => {
    switch (type) {
        case 'scheme':
            return GraduationCap;
        case 'complaint':
            return MessageSquare;
        case 'document':
            return FileText;
        case 'application':
            return Folder;
        default:
            return FileText;
    }
};

const getTypeLabel = (type: string, t: (key: string) => string) => {
    switch (type) {
        case 'scheme':
            return t('search.scheme');
        case 'complaint':
            return t('search.complaint');
        case 'document':
            return t('search.document');
        case 'application':
            return t('search.application');
        default:
            return type;
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case 'scheme':
            return 'text-purple-600 bg-purple-50';
        case 'complaint':
            return 'text-red-600 bg-red-50';
        case 'document':
            return 'text-blue-600 bg-blue-50';
        case 'application':
            return 'text-green-600 bg-green-50';
        default:
            return 'text-gray-600 bg-gray-50';
    }
};

export function SearchDropdown({ results, isLoading, onResultClick, onClose }: SearchDropdownProps) {
    const { t } = useLanguage();

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 z-50"
            >
                <Card className="p-6 shadow-2xl border-2 border-blue-100">
                    <div className="flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        <span className="text-gray-600">{t('search.searching')}</span>
                    </div>
                </Card>
            </motion.div>
        );
    }

    if (results.length === 0) {
        return null;
    }

    // Group results by type
    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.type]) {
            acc[result.type] = [];
        }
        acc[result.type].push(result);
        return acc;
    }, {} as Record<string, SearchResult[]>);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 z-50"
            >
                <Card className="max-h-[400px] overflow-y-auto shadow-2xl border-2 border-blue-100">
                    <div className="p-2">
                        {Object.entries(groupedResults).map(([type, typeResults]) => (
                            <div key={type} className="mb-4 last:mb-0">
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {getTypeLabel(type, t)}s
                                </div>
                                {typeResults.map((result, index) => {
                                    const Icon = getIcon(result.type);
                                    const colorClass = getTypeColor(result.type);

                                    return (
                                        <motion.button
                                            key={result.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => {
                                                onResultClick(result);
                                                onClose();
                                            }}
                                            className="w-full text-left px-3 py-3 rounded-lg hover:bg-blue-50 transition-colors group flex items-start gap-3"
                                        >
                                            <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium text-gray-900 truncate">{result.title}</h4>
                                                    {result.status && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                            {result.status}
                                                        </span>
                                                    )}
                                                </div>
                                                {result.description && (
                                                    <p className="text-sm text-gray-600 truncate">{result.description}</p>
                                                )}
                                                {result.date && (
                                                    <p className="text-xs text-gray-400 mt-1">{result.date}</p>
                                                )}
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-2" />
                                        </motion.button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
