import { useState, useEffect, useCallback } from 'react';

interface UseWakeWordOptions {
    wakeWord: string;
    sensitivity?: number; // 0-1, how closely it must match
    onWakeWordDetected?: () => void;
}

interface UseWakeWordReturn {
    isListeningForWakeWord: boolean;
    lastDetectedTime: number | null;
    startListening: () => void;
    stopListening: () => void;
}

export function useWakeWord(options: UseWakeWordOptions): UseWakeWordReturn {
    const { wakeWord, sensitivity = 0.7, onWakeWordDetected } = options;

    const [isListeningForWakeWord, setIsListeningForWakeWord] = useState(false);
    const [lastDetectedTime, setLastDetectedTime] = useState<number | null>(null);

    const checkForWakeWord = useCallback((transcript: string): boolean => {
        const normalizedTranscript = transcript.toLowerCase().trim();
        const normalizedWakeWord = wakeWord.toLowerCase().trim();

        // Exact match
        if (normalizedTranscript.includes(normalizedWakeWord)) {
            return true;
        }

        // Fuzzy match for common variations
        const variations = [
            normalizedWakeWord,
            normalizedWakeWord.replace(/\s+/g, ''), // Remove spaces
            normalizedWakeWord.replace('hey', 'hi'),
            normalizedWakeWord.replace('hey', 'hay'),
        ];

        return variations.some(variation =>
            normalizedTranscript.includes(variation)
        );
    }, [wakeWord]);

    const handleTranscript = useCallback((transcript: string, isFinal: boolean) => {
        if (!isFinal) return; // Only check final results

        if (checkForWakeWord(transcript)) {
            const now = Date.now();

            // Debounce: don't trigger if detected within last 2 seconds
            if (lastDetectedTime && now - lastDetectedTime < 2000) {
                return;
            }

            setLastDetectedTime(now);
            onWakeWordDetected?.();
        }
    }, [checkForWakeWord, lastDetectedTime, onWakeWordDetected]);

    const startListening = useCallback(() => {
        setIsListeningForWakeWord(true);
    }, []);

    const stopListening = useCallback(() => {
        setIsListeningForWakeWord(false);
    }, []);

    return {
        isListeningForWakeWord,
        lastDetectedTime,
        startListening,
        stopListening,
    };
}

// Export the transcript handler for use with useSpeechRecognition
export function createWakeWordHandler(
    wakeWord: string,
    onDetected: () => void
): (transcript: string, isFinal: boolean) => void {
    let lastDetectedTime: number | null = null;

    return (transcript: string, isFinal: boolean) => {
        if (!isFinal) return;

        const normalizedTranscript = transcript.toLowerCase().trim();
        const normalizedWakeWord = wakeWord.toLowerCase().trim();

        // Check for wake word
        const variations = [
            normalizedWakeWord,
            normalizedWakeWord.replace(/\s+/g, ''),
            normalizedWakeWord.replace('hey', 'hi'),
            normalizedWakeWord.replace('hey', 'hay'),
            'hey digi gov',
            'hey digital gov',
            'a digi gov',
        ];

        const detected = variations.some(variation =>
            normalizedTranscript.includes(variation)
        );

        if (detected) {
            const now = Date.now();

            // Debounce
            if (lastDetectedTime && now - lastDetectedTime < 2000) {
                return;
            }

            lastDetectedTime = now;
            onDetected();
        }
    };
}
