import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, HelpCircle, X } from 'lucide-react';
import { useVoiceControl } from '../contexts/VoiceControlContext';
import { Button } from './ui/button';
import { useState } from 'react';

export function VoiceControlIndicator() {
    const { isVoiceEnabled, isListening, lastCommand, toggleVoice } = useVoiceControl();
    const [showHelp, setShowHelp] = useState(false);

    return (
        <>
            {/* Floating Voice Indicator */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2"
            >
                {/* Last Command Display */}
                <AnimatePresence>
                    {lastCommand && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-lg shadow-lg px-4 py-2 max-w-xs"
                        >
                            <p className="text-xs text-gray-500 mb-1">Last command:</p>
                            <p className="text-sm font-medium text-gray-900">{lastCommand}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Voice Control Button */}
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setShowHelp(!showHelp)}
                        className="h-12 w-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
                        title="Voice commands help"
                    >
                        <HelpCircle className="w-5 h-5 text-gray-600" />
                    </Button>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            size="icon"
                            onClick={toggleVoice}
                            className={`h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all ${!isVoiceEnabled
                                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
                                    : isListening
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                                }`}
                            title={!isVoiceEnabled ? 'Enable voice control' : isListening ? 'Stop listening' : 'Start listening'}
                        >
                            {!isVoiceEnabled ? (
                                <MicOff className="w-6 h-6 text-white" />
                            ) : isListening ? (
                                <>
                                    <Mic className="w-6 h-6 text-white" />
                                    {/* Pulsing animation when listening */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-red-400"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0, 0.5],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                    />
                                </>
                            ) : (
                                <Mic className="w-6 h-6 text-white" />
                            )}
                        </Button>
                    </motion.div>
                </div>

                {/* Listening Indicator */}
                <AnimatePresence>
                    {isListening && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                            <Volume2 className="w-4 h-4" />
                            <span>Listening...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Help Modal */}
            <AnimatePresence>
                {showHelp && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowHelp(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold">Voice Commands</h3>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setShowHelp(false)}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                <div>
                                    <h4 className="font-medium text-sm text-gray-700 mb-2">Navigation</h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                        <li>• "Go to dashboard"</li>
                                        <li>• "Open government schemes"</li>
                                        <li>• "Show health services"</li>
                                        <li>• "Navigate to education"</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm text-gray-700 mb-2">Forms</h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                        <li>• "Fill name [your name]"</li>
                                        <li>• "Fill email [your email]"</li>
                                        <li>• "Fill phone [number]"</li>
                                        <li>• "Submit form"</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm text-gray-700 mb-2">Actions</h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                        <li>• "Open chatbot"</li>
                                        <li>• "Close chatbot"</li>
                                        <li>• "Logout"</li>
                                        <li>• "Help"</li>
                                    </ul>
                                </div>

                                <div className="pt-4 border-t">
                                    <p className="text-xs text-gray-500">
                                        <strong>Tip:</strong> Speak clearly and wait for the command to be processed.
                                        The system works best in quiet environments.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
