import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { createWakeWordHandler } from '../hooks/useWakeWord';
import { speak, stopSpeaking } from '../lib/voiceSynthesis';
import { executeCommand } from '../lib/voiceCommands';
import { toast } from 'sonner';

type VoiceStatus = 'idle' | 'listening-wake' | 'listening-command' | 'processing' | 'speaking';

export function VoiceAssistant() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [status, setStatus] = useState<VoiceStatus>('idle');
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [lastCommand, setLastCommand] = useState('');
    const [showTranscript, setShowTranscript] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const commandTimeoutRef = useRef<NodeJS.Timeout>();

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

        // Play activation sound (beep)
        playBeep();

        // Stop wake word listening
        stopWakeListening();

        // Start command listening
        setStatus('listening-command');
        setCurrentTranscript('');
        setShowTranscript(true);

        // Speak confirmation
        if (!isMuted) {
            speak('Yes?', { rate: 1.2 }).catch(console.error);
        }

        // Start listening for command
        setTimeout(() => {
            startCommandListening();

            // Set timeout for command listening (10 seconds)
            commandTimeoutRef.current = setTimeout(() => {
                if (status === 'listening-command') {
                    handleCommandTimeout();
                }
            }, 10000);
        }, 500);
    }

    // Handle command result
    function handleCommandResult(transcript: string, isFinal: boolean) {
        setCurrentTranscript(transcript);

        if (isFinal && transcript.trim()) {
            // Clear timeout
            if (commandTimeoutRef.current) {
                clearTimeout(commandTimeoutRef.current);
            }

            // Process command
            processCommand(transcript);
        }
    }

    // Process voice command
    async function processCommand(transcript: string) {
        setStatus('processing');
        setLastCommand(transcript);
        stopCommandListening();

        try {
            const result = await executeCommand(transcript, {
                navigate,
                currentPath: location.pathname,
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
            // Return to wake word listening
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
        setStatus('listening-wake');
        setCurrentTranscript('');
        setShowTranscript(false);
        resetTranscript();

        // Restart wake word listening
        setTimeout(() => {
            if (isEnabled) {
                startWakeListening();
            }
        }, 1000);
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
    const toggleVoiceAssistant = useCallback(async () => {
        if (!isSupported) {
            toast.error('Voice recognition is not supported in your browser');
            return;
        }

        if (!isEnabled) {
            // Request microphone permission and start
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
            // Stop and disable
            setIsEnabled(false);
            setStatus('idle');
            stopWakeListening();
            stopCommandListening();
            stopSpeaking();
            toast.info('Voice assistant disabled');
        }
    }, [isEnabled, isSupported, startWakeListening, stopWakeListening, stopCommandListening]);

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

    // Show help
    const showHelp = () => {
        const helpMessage = `Voice Assistant Commands:
    
Navigation:
- "Go to dashboard"
- "Open documents"
- "Show my complaints"
- "Pay my bills"

Form Filling:
- "Fill my name as John Doe"
- "Enter phone number 1234567890"
- "Set amount to 500"

Actions:
- "Submit form"
- "Cancel"
- "Go back"

Say "Hey DigiGov!" to activate the assistant.`;

        toast.info(helpMessage, { duration: 10000 });
    };

    if (!isSupported) {
        return null;
    }

    return (
        <>
            {/* Floating Voice Button */}
            <motion.div
                className="fixed bottom-24 right-6 z-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                <div className="relative">
                    {/* Status Indicator */}
                    {isEnabled && (
                        <motion.div
                            className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${status === 'listening-wake' ? 'bg-blue-500' :
                                    status === 'listening-command' ? 'bg-green-500' :
                                        status === 'processing' ? 'bg-yellow-500' :
                                            status === 'speaking' ? 'bg-purple-500' :
                                                'bg-gray-400'
                                }`}
                            animate={{
                                scale: status === 'listening-wake' || status === 'listening-command' ? [1, 1.2, 1] : 1,
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    )}

                    {/* Main Button */}
                    <Button
                        size="icon"
                        onClick={toggleVoiceAssistant}
                        className={`w-16 h-16 rounded-full shadow-lg transition-all ${isEnabled
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                    >
                        {isEnabled ? (
                            <Mic className="w-8 h-8 text-white" />
                        ) : (
                            <MicOff className="w-8 h-8 text-white" />
                        )}
                    </Button>

                    {/* Help Button */}
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={showHelp}
                        className="absolute -left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </Button>

                    {/* Mute Button */}
                    {isEnabled && (
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setIsMuted(!isMuted)}
                            className="absolute -left-14 -top-12 w-10 h-10 rounded-full bg-white shadow-md"
                        >
                            {isMuted ? (
                                <VolumeX className="w-5 h-5" />
                            ) : (
                                <Volume2 className="w-5 h-5" />
                            )}
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Transcript Display */}
            <AnimatePresence>
                {showTranscript && currentTranscript && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-44 right-6 z-50"
                    >
                        <Card className="p-4 max-w-sm shadow-xl bg-white/95 backdrop-blur-sm">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        {status === 'listening-command' ? 'Listening...' :
                                            status === 'processing' ? 'Processing...' :
                                                status === 'speaking' ? 'Speaking...' : ''}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {currentTranscript}
                                    </p>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setShowTranscript(false)}
                                    className="h-6 w-6"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status Toast */}
            <AnimatePresence>
                {isEnabled && status === 'listening-wake' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                    >
                        <Card className="px-4 py-2 shadow-lg bg-blue-600 text-white">
                            <p className="text-sm font-medium flex items-center gap-2">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <Mic className="w-4 h-4" />
                                </motion.div>
                                Say "Hey DigiGov!" to start
                            </p>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
