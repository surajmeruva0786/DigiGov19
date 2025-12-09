import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { createWakeWordHandler } from './useWakeWord';
import { speak, stopSpeaking } from '../lib/voiceSynthesis';
import { executeCommand } from '../lib/voiceCommands';
import { toast } from 'sonner';

export type VoiceStatus = 'idle' | 'listening-wake' | 'listening-command' | 'processing' | 'speaking';

export interface VoiceAssistantState {
    isEnabled: boolean;
    status: VoiceStatus;
    currentTranscript: string;
    interimTranscript: string;
    commandHistory: string[];
    lastCommand: string;
    isMuted: boolean;
    isSupported: boolean;
}

export interface VoiceAssistantActions {
    toggleEnabled: () => void;
    setMuted: (muted: boolean) => void;
    clearHistory: () => void;
}

interface UseVoiceAssistantOptions {
    onNavigate?: (page: string) => void;
    autoEnable?: boolean;
}

export function useVoiceAssistant(options: UseVoiceAssistantOptions = {}) {
    const { onNavigate, autoEnable = false } = options;

    const [isEnabled, setIsEnabled] = useState(autoEnable);
    const [status, setStatus] = useState<VoiceStatus>(autoEnable ? 'listening-wake' : 'idle');
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [lastCommand, setLastCommand] = useState('');
    const [isMuted, setIsMuted] = useState(false);

    const commandTimeoutRef = useRef<NodeJS.Timeout>();

    // Navigation function
    const navigate = useCallback((path: string) => {
        if (onNavigate) {
            onNavigate(path);
        } else {
            console.warn('Navigation requested but no onNavigate prop provided:', path);
        }
    }, [onNavigate]);

    // Speech recognition for wake word detection
    const {
        isListening: isListeningWake,
        startListening: startWakeListening,
        stopListening: stopWakeListening,
        isSupported,
    } = useSpeechRecognition({
        continuous: true,
        interimResults: false,
        onResult: createWakeWordHandler('hey digigov', handleWakeWordDetected),
        onError: (error) => {
            console.error('Wake word recognition error:', error);
            if (error === 'not-allowed') {
                toast.error('Microphone permission denied');
                setIsEnabled(false);
            }
        },
    });

    // Speech recognition for command listening
    const {
        isListening: isListeningCommand,
        transcript: commandTranscript,
        startListening: startCommandListening,
        stopListening: stopCommandListening,
        resetTranscript,
    } = useSpeechRecognition({
        continuous: false,
        interimResults: true,
        onResult: handleCommandResult,
        onError: (error) => {
            console.error('Command recognition error:', error);
        },
    });

    // Handle wake word detection
    function handleWakeWordDetected() {
        if (status !== 'listening-wake') return;

        console.log('Wake word detected!');
        playBeep();

        // Stop wake word listening first
        stopWakeListening();

        setStatus('listening-command');
        setCurrentTranscript('');
        setInterimTranscript('');

        if (!isMuted) {
            speak('Yes?', { rate: 1.2 }).catch(console.error);
        }

        // Wait longer to ensure wake word recognition is fully stopped
        setTimeout(() => {
            console.log('Starting command listening...');
            startCommandListening();
            commandTimeoutRef.current = setTimeout(() => {
                if (status === 'listening-command') {
                    handleCommandTimeout();
                }
            }, 10000);
        }, 1000); // Increased from 500ms to 1000ms
    }

    // Handle command result
    function handleCommandResult(transcript: string, isFinal: boolean) {
        if (isFinal) {
            setCurrentTranscript(transcript);
            setInterimTranscript('');

            if (commandTimeoutRef.current) {
                clearTimeout(commandTimeoutRef.current);
            }

            processCommand(transcript);
        } else {
            setInterimTranscript(transcript);
        }
    }

    // Process voice command
    async function processCommand(transcript: string) {
        setStatus('processing');
        setLastCommand(transcript);
        setCommandHistory(prev => [transcript, ...prev].slice(0, 10));
        stopCommandListening();

        try {
            const result = await executeCommand(transcript, {
                navigate,
                currentPath: window.location.pathname,
            });

            if (result.shouldSpeak && !isMuted) {
                setStatus('speaking');
                await speak(result.message);
            }

            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error processing command:', error);
            toast.error('Sorry, there was an error processing your command');
        } finally {
            resetToWakeWordListening();
        }
    }

    // Handle command timeout
    function handleCommandTimeout() {
        stopCommandListening();
        if (!isMuted) {
            speak("I didn't hear anything. Say Hey DigiGov to try again.").catch(console.error);
        }
        resetToWakeWordListening();
    }

    // Reset to wake word listening
    function resetToWakeWordListening() {
        console.log('Resetting to wake word listening...');
        setStatus('listening-wake');
        setCurrentTranscript('');
        setInterimTranscript('');
        resetTranscript();

        // Wait longer to ensure command recognition is fully stopped
        setTimeout(() => {
            if (isEnabled) {
                console.log('Restarting wake word listening...');
                startWakeListening();
            }
        }, 1500); // Increased from 1000ms to 1500ms
    }

    // Play beep sound
    function playBeep() {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    // Toggle voice assistant
    const toggleEnabled = useCallback(async () => {
        if (!isSupported) {
            toast.error('Voice recognition is not supported in your browser');
            return;
        }

        if (!isEnabled) {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                setIsEnabled(true);
                setStatus('listening-wake');
                startWakeListening();
                toast.success('Voice assistant enabled. Say "Hey DigiGov!" to start');
            } catch (error) {
                console.error('Microphone permission error:', error);
                toast.error('Microphone permission denied');
            }
        } else {
            setIsEnabled(false);
            setStatus('idle');
            stopWakeListening();
            stopCommandListening();
            stopSpeaking();
            toast.info('Voice assistant disabled');
        }
    }, [isEnabled, isSupported, startWakeListening, stopWakeListening, stopCommandListening]);

    // Auto-enable if requested
    useEffect(() => {
        if (autoEnable && isSupported && !isEnabled) {
            const autoStart = async () => {
                try {
                    await navigator.mediaDevices.getUserMedia({ audio: true });
                    setIsEnabled(true);
                    setStatus('listening-wake');
                    startWakeListening();
                    toast.success('Voice assistant enabled. Say "Hey DigiGov!" to start', {
                        duration: 5000,
                    });
                } catch (error) {
                    console.error('Auto-enable microphone permission error:', error);
                    toast.error('Microphone permission denied. Click the microphone button to enable manually.');
                }
            };
            autoStart();
        }
    }, [autoEnable, isSupported, isEnabled, startWakeListening]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopWakeListening();
            stopCommandListening();
            stopSpeaking();
            if (commandTimeoutRef.current) {
                clearTimeout(commandTimeoutRef.current);
            }
        };
    }, [stopWakeListening, stopCommandListening]);

    const clearHistory = useCallback(() => {
        setCommandHistory([]);
        setCurrentTranscript('');
        setInterimTranscript('');
    }, []);

    const state: VoiceAssistantState = {
        isEnabled,
        status,
        currentTranscript,
        interimTranscript,
        commandHistory,
        lastCommand,
        isMuted,
        isSupported,
    };

    const actions: VoiceAssistantActions = {
        toggleEnabled,
        setMuted: setIsMuted,
        clearHistory,
    };

    return { ...state, ...actions };
}
