import { motion } from 'motion/react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from './button';

interface SuggestionChipProps {
    suggestion: string;
    onClick: (suggestion: string) => void;
    isLoading?: boolean;
}

export function SuggestionChip({ suggestion, onClick, isLoading = false }: SuggestionChipProps) {
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 text-sm text-gray-600"
            >
                <Loader2 className="w-3 h-3 animate-spin text-purple-500" />
                <span>Generating suggestions...</span>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onClick(suggestion)}
                className="h-auto py-2 px-3 text-left whitespace-normal bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-purple-200 hover:border-purple-300 text-gray-700 hover:text-gray-900 transition-all"
            >
                <div className="flex items-start gap-2 w-full">
                    <Sparkles className="w-3 h-3 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm flex-1">{suggestion}</span>
                </div>
            </Button>
        </motion.div>
    );
}

interface SuggestionListProps {
    suggestions: string[];
    onSelect: (suggestion: string) => void;
    isLoading?: boolean;
    title?: string;
}

export function SuggestionList({ suggestions, onSelect, isLoading = false, title }: SuggestionListProps) {
    if (isLoading) {
        return (
            <div className="space-y-2">
                {title && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">{title}</span>
                    </div>
                )}
                <SuggestionChip suggestion="" onClick={() => { }} isLoading={true} />
            </div>
        );
    }

    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            {title && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">{title}</span>
                </div>
            )}
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <SuggestionChip
                        key={index}
                        suggestion={suggestion}
                        onClick={onSelect}
                    />
                ))}
            </div>
        </div>
    );
}
