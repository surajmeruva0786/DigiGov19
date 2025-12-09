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
    const isListeningRef = useRef(false);
    const isStartingRef = useRef(false);

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

        // Initialize speech recognition only once
        if (!recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.continuous = continuous;
            recognition.interimResults = interimResults;
            recognition.lang = lang;

            recognition.onstart = () => {
                isStartingRef.current = false;
                isListeningRef.current = true;
                setIsListening(true);
            };

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
                isStartingRef.current = false;

                // Don't treat 'aborted' as a real error - it's usually intentional
                if (event.error === 'aborted') {
                    return;
                }

                onError?.(event.error);

                // Auto-restart on certain errors if still supposed to be listening
                if ((event.error === 'no-speech' || event.error === 'audio-capture') && isListeningRef.current) {
                    setTimeout(() => {
                        if (isListeningRef.current && !isStartingRef.current) {
                            try {
                                isStartingRef.current = true;
                                recognition.start();
                            } catch (err) {
                                console.error('Error restarting after error:', err);
                                isStartingRef.current = false;
                            }
                        }
                    }, 1000);
                }
            };

            recognition.onend = () => {
                isStartingRef.current = false;

                // Auto-restart if continuous mode is enabled and we should still be listening
                if (continuous && isListeningRef.current) {
                    setTimeout(() => {
                        if (isListeningRef.current && !isStartingRef.current) {
                            try {
                                isStartingRef.current = true;
                                recognition.start();
                            } catch (error) {
                                console.error('Error restarting recognition:', error);
                                isStartingRef.current = false;
                                isListeningRef.current = false;
                                setIsListening(false);
                            }
                        }
                    }, 100);
                } else {
                    isListeningRef.current = false;
                    setIsListening(false);
                }
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    isListeningRef.current = false;
                    recognitionRef.current.stop();
                } catch (error) {
                    // Ignore errors on cleanup
                }
            }
        };
    }, []); // Empty deps - only initialize once

    const startListening = useCallback(() => {
        if (!recognitionRef.current || isListeningRef.current || isStartingRef.current) {
            return;
        }

        try {
            isStartingRef.current = true;
            recognitionRef.current.start();
            setTranscript('');
            setInterimTranscript('');
        } catch (error: any) {
            console.error('Error starting recognition:', error);
            isStartingRef.current = false;

            // If already started, just update state
            if (error.message && error.message.includes('already started')) {
                isListeningRef.current = true;
                setIsListening(true);
            } else {
                onError?.('Failed to start listening');
            }
        }
    }, [onError]);

    const stopListening = useCallback(() => {
        if (!recognitionRef.current || !isListeningRef.current) {
            return;
        }

        try {
            isListeningRef.current = false;
            isStartingRef.current = false;
            recognitionRef.current.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
            // Force state update even if stop fails
            isListeningRef.current = false;
            setIsListening(false);
        }
    }, []);

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
