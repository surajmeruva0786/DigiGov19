import { useSpeechRecognition } from './useSpeechRecognition';
import { speak, stopSpeaking } from '../lib/voiceSynthesis';
import { executeCommand } from '../lib/voiceCommands';
import { toast } from 'sonner';

export type VoiceStatus = 'idle' | 'listening' | 'processing' | 'speaking';

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
    const [status, setStatus] = useState<VoiceStatus>(autoEnable ? 'listening' : 'idle');
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



    // Speech recognition for command listening
    const {
        isListening: isListeningCommand,
        transcript: commandTranscript,
        startListening: startCommandListening,
        stopListening: stopCommandListening,
        resetTranscript,
        isSupported,
    } = useSpeechRecognition({
        continuous: true, // changed to true for continuous command listening
        interimResults: true,
        onResult: handleCommandResult,
        onError: (error) => {
            console.error('Command recognition error:', error);
            if (error === 'not-allowed') {
                toast.error('Microphone permission denied');
                setIsEnabled(false);
            }
        },
    });



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
            // resetToWakeWordListening(); // No longer needed
            if (isEnabled) {
                setStatus('listening');
                startCommandListening();
            }
        }
    }

    // Handle command timeout - Optional now with continuous listening, but good for resetting state if nothing heard
    function handleCommandTimeout() {
        // stopCommandListening(); // Don't stop, just reset
        if (!isMuted) {
            // speak("I didn't hear anything.").catch(console.error); // Optional feedback
        }
        // resetToWakeWordListening();
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
                // Check mic permission first
                await navigator.mediaDevices.getUserMedia({ audio: true });
                setIsEnabled(true);
                setStatus('listening');
                startCommandListening();
                playBeep();
                toast.success('Voice assistant enabled. Listening for commands...');
                if (!isMuted) {
                    speak('Voice assistant enabled. How can I help you?');
                }
            } catch (error) {
                console.error('Microphone permission error:', error);
                toast.error('Microphone permission denied');
            }
        } else {
            setIsEnabled(false);
            setStatus('idle');
            // stopWakeListening(); // Removed
            stopCommandListening();
            stopSpeaking();
            toast.info('Voice assistant disabled');
        }
    }, [isEnabled, isSupported, startCommandListening, stopCommandListening, isMuted]);

    // Auto-enable if requested
    useEffect(() => {
        if (autoEnable && isSupported && !isEnabled) {
            const autoStart = async () => {
                try {
                    await navigator.mediaDevices.getUserMedia({ audio: true });
                    setIsEnabled(true);
                    setStatus('listening');
                    startCommandListening();
                    toast.success('Voice assistant enabled. Listening for commands...', {
                        duration: 5000,
                    });
                } catch (error) {
                    console.error('Auto-enable microphone permission error:', error);
                    toast.error('Microphone permission denied. Click the microphone button to enable manually.');
                }
            };
            autoStart();
        }
    }, [autoEnable, isSupported, isEnabled, startCommandListening]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // stopWakeListening(); // Removed
            stopCommandListening();
            stopSpeaking();
            if (commandTimeoutRef.current) {
                clearTimeout(commandTimeoutRef.current);
            }
        };
    }, [stopCommandListening]);

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
