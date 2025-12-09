import { useState, useEffect } from 'react';
import { FloatingMicButton } from './FloatingMicButton';
import { VoiceAssistantSidebar } from './VoiceAssistantSidebar';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

interface VoiceAssistantWidgetProps {
    onNavigate?: (page: string) => void;
    autoEnable?: boolean;
}

export function VoiceAssistantWidget({ onNavigate, autoEnable = false }: VoiceAssistantWidgetProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const voiceAssistant = useVoiceAssistant({ onNavigate, autoEnable });

    const handleButtonClick = () => {
        // If not enabled, enable it first
        if (!voiceAssistant.isEnabled) {
            voiceAssistant.toggleEnabled();
        }
        // Toggle sidebar
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Listen for mic button click from navbar
    useEffect(() => {
        const handleToggle = () => {
            handleButtonClick();
        };

        window.addEventListener('toggleVoiceAssistant', handleToggle);
        return () => window.removeEventListener('toggleVoiceAssistant', handleToggle);
    }, [voiceAssistant.isEnabled, isSidebarOpen]);

    return (
        <>
            {/* Sidebar Panel */}
            <VoiceAssistantSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                state={{
                    isEnabled: voiceAssistant.isEnabled,
                    status: voiceAssistant.status,
                    currentTranscript: voiceAssistant.currentTranscript,
                    interimTranscript: voiceAssistant.interimTranscript,
                    commandHistory: voiceAssistant.commandHistory,
                    lastCommand: voiceAssistant.lastCommand,
                    isMuted: voiceAssistant.isMuted,
                    isSupported: voiceAssistant.isSupported,
                }}
                actions={{
                    toggleEnabled: voiceAssistant.toggleEnabled,
                    setMuted: voiceAssistant.setMuted,
                    clearHistory: voiceAssistant.clearHistory,
                }}
            />
        </>
    );
}

