import { motion } from 'motion/react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
import { VoiceStatus } from '../hooks/useVoiceAssistant';

interface FloatingMicButtonProps {
    onClick: () => void;
    status: VoiceStatus;
    isEnabled: boolean;
}

export function FloatingMicButton({ onClick, status, isEnabled }: FloatingMicButtonProps) {
    const getStatusColor = () => {
        if (!isEnabled) return 'from-gray-400 to-gray-500';
        switch (status) {
            case 'listening-wake':
                return 'from-blue-600 to-blue-700';
            case 'listening-command':
                return 'from-green-500 to-green-600';
            case 'processing':
                return 'from-yellow-500 to-yellow-600';
            case 'speaking':
                return 'from-purple-500 to-purple-600';
            default:
                return 'from-gray-400 to-gray-500';
        }
    };

    const shouldPulse = status === 'listening-wake' || status === 'listening-command';

    return (
        <motion.div
            className="relative"
            whileTap={{ scale: 0.95 }}
        >
            {/* Status Indicator */}
            {isEnabled && (
                <motion.div
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${status === 'listening-wake' ? 'bg-blue-500' :
                        status === 'listening-command' ? 'bg-green-500' :
                            status === 'processing' ? 'bg-yellow-500' :
                                status === 'speaking' ? 'bg-purple-500' :
                                    'bg-gray-400'
                        }`}
                    animate={shouldPulse ? {
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.7, 1],
                    } : {}}
                    transition={{
                        duration: 1.5,
                        repeat: shouldPulse ? Infinity : 0,
                        ease: 'easeInOut',
                    }}
                />
            )}

            <Button
                size="icon"
                onClick={onClick}
                className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-gradient-to-r ${getStatusColor()}`}
                title={isEnabled ? 'Open voice assistant' : 'Enable voice assistant'}
            >
                {isEnabled ? (
                    <Mic className="w-6 h-6 text-white" />
                ) : (
                    <MicOff className="w-6 h-6 text-white" />
                )}
            </Button>
        </motion.div>
    );
}
