import { motion, AnimatePresence } from 'motion/react';
import { X, Mic, Volume2, HelpCircle, Sparkles } from 'lucide-react';
import { useVoiceControl } from '../contexts/VoiceControlContext';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface VoiceControlPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function VoiceControlPanel({ isOpen, onClose }: VoiceControlPanelProps) {
    const { isVoiceEnabled, isListening, lastCommand, toggleVoice, speak } = useVoiceControl();
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');

    // Listen for voice recognition results
    useEffect(() => {
        const handleVoiceResult = (event: CustomEvent) => {
            if (event.detail.isFinal) {
                setTranscript(prev => prev + ' ' + event.detail.transcript);
                setInterimTranscript('');
            } else {
                setInterimTranscript(event.detail.transcript);
            }
        };

        window.addEventListener('voiceResult' as any, handleVoiceResult);
        return () => window.removeEventListener('voiceResult' as any, handleVoiceResult);
    }, []);

    const handleToggleVoice = () => {
        toggleVoice();
        // Removed voice announcement to avoid disturbing user
    };

    const clearTranscript = () => {
        setTranscript('');
        setInterimTranscript('');
    };

    const tutorialCommands = [
        {
            category: 'Navigation',
            commands: [
                { text: 'Go to dashboard', description: 'Navigate to main dashboard' },
                { text: 'Open government schemes', description: 'View available schemes' },
                { text: 'Show health services', description: 'Access health services' },
                { text: 'Navigate to education', description: 'View education & scholarships' },
                { text: 'Go to complaints', description: 'File or view complaints' },
                { text: 'Open documents', description: 'Manage your documents' },
                { text: 'Show feedback', description: 'Submit citizen feedback' },
                { text: 'Go to bills', description: 'Pay utility bills' },
                { text: 'Open children', description: 'Manage children profiles' },
                { text: 'Show digital ID', description: 'View digital ID card' },
                { text: 'Go to applications', description: 'Track applications' },
            ],
        },
        {
            category: 'Actions',
            commands: [
                { text: 'Open chatbot', description: 'Launch AI assistant' },
                { text: 'Close chatbot', description: 'Close AI assistant' },
                { text: 'Logout', description: 'Sign out of account' },
            ],
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b bg-white/80 backdrop-blur-sm flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg"
                                        animate={isListening ? {
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, -5, 0],
                                        } : {}}
                                        transition={{
                                            duration: 1.5,
                                            repeat: isListening ? Infinity : 0,
                                            ease: 'easeInOut',
                                        }}
                                    >
                                        <Mic className="w-6 h-6 text-white" />
                                    </motion.div>
                                    <div>
                                        <h2 className="text-xl font-semibold">Voice Control</h2>
                                        <p className="text-sm text-gray-500">
                                            {isVoiceEnabled ? (isListening ? 'Listening...' : 'Ready') : 'Disabled'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="hover:bg-white/50"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Voice Control Toggle */}
                            <div className="mt-4">
                                <Button
                                    onClick={handleToggleVoice}
                                    className={`w-full ${isVoiceEnabled
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                                        }`}
                                >
                                    {isVoiceEnabled ? (
                                        <>
                                            <Volume2 className="w-4 h-4 mr-2" />
                                            Stop Listening
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="w-4 h-4 mr-2" />
                                            Start Voice Control
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Microphone Animation */}
                            {isListening && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl p-6 shadow-lg"
                                >
                                    <div className="flex flex-col items-center">
                                        <motion.div
                                            className="relative w-24 h-24 mb-4"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-20 animate-pulse" />
                                            <div className="absolute inset-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                                                <Mic className="w-10 h-10 text-white" />
                                            </div>
                                        </motion.div>
                                        <p className="text-lg font-medium text-gray-900">Listening...</p>
                                        <p className="text-sm text-gray-500">Speak your command clearly</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Transcription Display */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-900">Transcription</h3>
                                    {transcript && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearTranscript}
                                            className="text-xs"
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>
                                <div className="min-h-[100px] max-h-[200px] overflow-y-auto bg-gray-50 rounded-lg p-4">
                                    {transcript || interimTranscript ? (
                                        <div className="space-y-2">
                                            {transcript && (
                                                <p className="text-gray-900">{transcript}</p>
                                            )}
                                            {interimTranscript && (
                                                <p className="text-gray-400 italic">{interimTranscript}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-sm text-center">
                                            Your spoken words will appear here...
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Last Command */}
                            {lastCommand && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200"
                                >
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-green-700 mb-1">Last Command</p>
                                            <p className="text-sm text-gray-900">{lastCommand}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Tutorial Commands */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <HelpCircle className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-gray-900">Available Commands</h3>
                                </div>

                                <div className="space-y-6">
                                    {tutorialCommands.map((category, idx) => (
                                        <div key={idx}>
                                            <h4 className="text-sm font-medium text-gray-700 mb-3">{category.category}</h4>
                                            <div className="space-y-2">
                                                {category.commands.map((cmd, cmdIdx) => (
                                                    <div
                                                        key={cmdIdx}
                                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                                                        onClick={() => {
                                                            // Add to transcript
                                                            setTranscript(prev => prev ? `${prev} ${cmd.text}` : cmd.text);

                                                            // Emit voice result event for transcription display
                                                            const transcriptEvent = new CustomEvent('voiceResult', {
                                                                detail: { transcript: cmd.text, isFinal: true }
                                                            });
                                                            window.dispatchEvent(transcriptEvent);

                                                            // Execute command without voice announcement

                                                            // Simulate voice recognition by creating a result callback
                                                            // This will trigger the registered commands in useNavigationVoiceCommands
                                                            const voiceService = (window as any).__voiceService;
                                                            if (voiceService && voiceService.processCommand) {
                                                                voiceService.processCommand(cmd.text.toLowerCase());
                                                            }
                                                        }}
                                                    >
                                                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900">"{cmd.text}"</p>
                                                            <p className="text-xs text-gray-500">{cmd.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-200">
                                <h4 className="text-sm font-medium text-amber-900 mb-2">💡 Tips for Best Results</h4>
                                <ul className="space-y-1 text-xs text-amber-800">
                                    <li>• Speak clearly and at a normal pace</li>
                                    <li>• Use a quiet environment for better accuracy</li>
                                    <li>• Wait for the "Listening..." indicator before speaking</li>
                                    <li>• You can click on any command to try it</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
