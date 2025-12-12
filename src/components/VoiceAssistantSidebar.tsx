import { motion, AnimatePresence } from 'motion/react';
import { X, Mic, Volume2, VolumeX, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { VoiceAssistantState, VoiceAssistantActions } from '../hooks/useVoiceAssistant';

interface VoiceAssistantSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    state: VoiceAssistantState;
    actions: VoiceAssistantActions;
}

export function VoiceAssistantSidebar({ isOpen, onClose, state, actions }: VoiceAssistantSidebarProps) {
    const { isEnabled, status, currentTranscript, interimTranscript, commandHistory, lastCommand, isMuted } = state;
    const { toggleEnabled, setMuted, clearHistory } = actions;

    const availableCommands = [
        {
            category: 'Navigation',
            commands: [
                { text: 'Go to dashboard', description: 'Navigate to main dashboard' },
                { text: 'Open documents', description: 'View your documents' },
                { text: 'Show my complaints', description: 'View complaints' },
                { text: 'Pay my bills', description: 'Open bill payments' },
                { text: 'Go to schemes', description: 'View government schemes' },
                { text: 'Open health services', description: 'Access health services' },
            ],
        },
        {
            category: 'Form Filling',
            commands: [
                { text: 'Fill my name as Rajesh Kumar', description: 'Fill name field' },
                { text: 'Enter phone number 1234567890', description: 'Fill phone field' },
                { text: 'Set amount to 500', description: 'Fill amount field' },
            ],
        },
        {
            category: 'Actions',
            commands: [
                { text: 'Submit form', description: 'Submit current form' },
                { text: 'Cancel', description: 'Cancel action' },
                { text: 'Help', description: 'Show help' },
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

                    {/* Sidebar Panel */}
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
                                        animate={status === 'listening' ? {
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, -5, 0],
                                        } : {}}
                                        transition={{
                                            duration: 1.5,
                                            repeat: status === 'listening' ? Infinity : 0,
                                            ease: 'easeInOut',
                                        }}
                                    >
                                        <Mic className="w-6 h-6 text-white" />
                                    </motion.div>
                                    <div>
                                        <h2 className="text-xl font-semibold">Voice Assistant</h2>
                                        <p className="text-sm text-gray-500">
                                            {!isEnabled ? 'Disabled' :
                                                status === 'listening' ? 'Listening...' :
                                                    status === 'processing' ? 'Processing...' :
                                                        status === 'speaking' ? 'Speaking...' :
                                                            'Ready'}
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

                            {/* Control Buttons */}
                            <div className="mt-4 flex gap-2">
                                <Button
                                    onClick={toggleEnabled}
                                    className={`flex-1 ${isEnabled
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                                        }`}
                                >
                                    {isEnabled ? (
                                        <>
                                            <Volume2 className="w-4 h-4 mr-2" />
                                            Stop Listening
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="w-4 h-4 mr-2" />
                                            Start Listening
                                        </>
                                    )}
                                </Button>
                                {isEnabled && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setMuted(!isMuted)}
                                        title={isMuted ? 'Unmute' : 'Mute'}
                                    >
                                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {/* Listening Animation */}
                            {status === 'listening' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl p-6 shadow-lg"
                                >
                                    <div className="flex flex-col items-center">
                                        <motion.div
                                            className="relative w-24 h-24 mb-4"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-pulse" />
                                            <div className="absolute inset-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                                <Mic className="w-10 h-10 text-white" />
                                            </div>
                                        </motion.div>
                                        <p className="text-lg font-medium text-gray-900">Listening...</p>
                                        <p className="text-sm text-gray-500">Speak your command clearly</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Current Transcription */}
                            <Card className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">Current Transcription</h3>
                                    {currentTranscript && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearHistory}
                                            className="text-xs"
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>
                                <div className="min-h-[60px] bg-gray-50 rounded-lg p-3">
                                    {currentTranscript || interimTranscript ? (
                                        <div className="space-y-1">
                                            {currentTranscript && (
                                                <p className="text-gray-900">{currentTranscript}</p>
                                            )}
                                            {interimTranscript && (
                                                <p className="text-gray-400 italic">{interimTranscript}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-sm text-center">
                                            Click Start Listening to speak...
                                        </p>
                                    )}
                                </div>
                            </Card>

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

                            {/* Command History */}
                            {commandHistory.length > 0 && (
                                <Card className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">Command History</h3>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {commandHistory.map((cmd, idx) => (
                                            <div key={idx} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                                                {cmd}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Available Commands */}
                            <Card className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <HelpCircle className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-gray-900">Available Commands</h3>
                                </div>
                                <div className="space-y-4">
                                    {availableCommands.map((category, idx) => (
                                        <div key={idx}>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">{category.category}</h4>
                                            <div className="space-y-1">
                                                {category.commands.map((cmd, cmdIdx) => (
                                                    <div
                                                        key={cmdIdx}
                                                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5" />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">"{cmd.text}"</p>
                                                            <p className="text-xs text-gray-500">{cmd.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Tips */}
                            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-200">
                                <h4 className="text-sm font-medium text-amber-900 mb-2">💡 Tips</h4>
                                <ul className="space-y-1 text-xs text-amber-800">
                                    <li>• Click "Start Listening" to activate</li>
                                    <li>• Speak clearly and at a normal pace</li>
                                    <li>• Wait for the beep before speaking</li>
                                    <li>• Commands are processed automatically</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
