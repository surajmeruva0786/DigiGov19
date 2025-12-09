import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechRecognitionOptions {
    continuous?: boolean;
    interimResults?: boolean;
    lang?: string;
    onResult?: (transcript: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
}

interface UseSpeechRecognitionReturn {
    isListening: boolean;
    transcript: string;
    interimTranscript: string;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
    isSupported: boolean;
}

export function useSpeechRecognition(
    options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
    const {
        continuous = true,
        interimResults = true,
        lang = 'en-US',
        onResult,
        onError,
    } = options;

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check if browser supports Web Speech API
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            console.warn('Speech recognition not supported in this browser');
            return;
        }

        setIsSupported(true);

        // Initialize speech recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.lang = lang;

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimText = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const transcriptPart = result[0].transcript;

                if (result.isFinal) {
                    finalTranscript += transcriptPart + ' ';
                } else {
                    interimText += transcriptPart;
                }
            }

            if (finalTranscript) {
                setTranscript((prev) => prev + finalTranscript);
                onResult?.(finalTranscript.trim(), true);
            }

            if (interimText) {
                setInterimTranscript(interimText);
                onResult?.(interimText, false);
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            onError?.(event.error);

            // Auto-restart on certain errors
            if (event.error === 'no-speech' || event.error === 'audio-capture') {
                setTimeout(() => {
                    if (isListening) {
                        recognition.start();
                    }
                }, 1000);
            }
        };

        recognition.onend = () => {
            // Auto-restart if continuous mode is enabled
            if (continuous && isListening) {
                try {
                    recognition.start();
                } catch (error) {
                    console.error('Error restarting recognition:', error);
                }
            } else {
                setIsListening(false);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [continuous, interimResults, lang, onResult, onError]);

    const startListening = useCallback(() => {
        if (!recognitionRef.current || isListening) return;

        try {
            recognitionRef.current.start();
            setIsListening(true);
            setTranscript('');
            setInterimTranscript('');
        } catch (error) {
            console.error('Error starting recognition:', error);
            onError?.('Failed to start listening');
        }
    }, [isListening, onError]);

    const stopListening = useCallback(() => {
        if (!recognitionRef.current || !isListening) return;

        try {
            recognitionRef.current.stop();
            setIsListening(false);
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    }, [isListening]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        resetTranscript,
        isSupported,
    };
}
