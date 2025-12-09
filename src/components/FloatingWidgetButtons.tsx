import { motion } from 'motion/react';
import { MessageSquareText } from 'lucide-react';
import { Button } from './ui/button';
import { FloatingMicButton } from './FloatingMicButton';
import { VoiceStatus } from '../hooks/useVoiceAssistant';

interface FloatingWidgetButtonsProps {
    onChatbotClick: () => void;
    onMicClick: () => void;
    micStatus: VoiceStatus;
    micEnabled: boolean;
}

export function FloatingWidgetButtons({
    onChatbotClick,
    onMicClick,
    micStatus,
    micEnabled
}: FloatingWidgetButtonsProps) {
    return (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
            {/* Chatbot Button */}
            <motion.div
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    size="icon"
                    onClick={onChatbotClick}
                    className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    title="Open chatbot"
                >
                    <MessageSquareText className="w-6 h-6 text-white" />
                </Button>
            </motion.div>

            {/* Mic Button */}
            <FloatingMicButton
                onClick={onMicClick}
                status={micStatus}
                isEnabled={micEnabled}
            />
        </div>
    );
}
