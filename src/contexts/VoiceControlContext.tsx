import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getVoiceRecognitionService, VoiceCommand } from '../lib/voiceRecognition';

interface VoiceControlContextType {
    isVoiceEnabled: boolean;
    isListening: boolean;
    lastCommand: string;
    enableVoice: () => void;
    disableVoice: () => void;
    toggleVoice: () => void;
    registerCommand: (command: VoiceCommand) => void;
    registerCommands: (commands: VoiceCommand[]) => void;
    speak: (text: string) => void;
}

const VoiceControlContext = createContext<VoiceControlContextType | undefined>(undefined);

export function useVoiceControl() {
    const context = useContext(VoiceControlContext);
    if (!context) {
        throw new Error('useVoiceControl must be used within VoiceControlProvider');
    }
    return context;
}

interface VoiceControlProviderProps {
    children: ReactNode;
}

export function VoiceControlProvider({ children }: VoiceControlProviderProps) {
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [lastCommand, setLastCommand] = useState('');
    const voiceService = getVoiceRecognitionService();

    const speak = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-IN';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const enableVoice = useCallback(() => {
        if (!voiceService.isSupported()) {
            alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        setIsVoiceEnabled(true);
        localStorage.setItem('voiceControlEnabled', 'true');
        voiceService.start();
        // Removed voice announcement to avoid disturbing user
    }, [speak]);

    const disableVoice = useCallback(() => {
        setIsVoiceEnabled(false);
        localStorage.setItem('voiceControlEnabled', 'false');
        voiceService.stop();
        // Removed voice announcement to avoid disturbing user
    }, [speak]);

    const toggleVoice = useCallback(() => {
        if (isVoiceEnabled) {
            disableVoice();
        } else {
            enableVoice();
        }
    }, [isVoiceEnabled, enableVoice, disableVoice]);

    // Load voice preference from localStorage
    useEffect(() => {
        const savedPreference = localStorage.getItem('voiceControlEnabled');
        if (savedPreference === 'true') {
            // Auto-start disabled to prevent browser blocking issues
            // enableVoice(); 
        }
    }, [enableVoice]);

    // Setup voice service callbacks
    useEffect(() => {
        voiceService.onResult((transcript) => {
            setLastCommand(transcript);
        });

        voiceService.onStatusChange((listening) => {
            setIsListening(listening);
        });

        voiceService.onError((error) => {
            console.error('Voice recognition error:', error);
            if (error === 'not-allowed') {
                setIsVoiceEnabled(false);
                localStorage.setItem('voiceControlEnabled', 'false');
                speak('Microphone access denied. Voice control disabled.');
            }
        });
    }, [speak]);

    // Listen for toggle voice control event from header button
    useEffect(() => {
        const handleToggleEvent = () => {
            toggleVoice();
        };

        window.addEventListener('toggleVoiceControl', handleToggleEvent);
        return () => window.removeEventListener('toggleVoiceControl', handleToggleEvent);
    }, [toggleVoice]);

    const registerCommand = useCallback((command: VoiceCommand) => {
        voiceService.registerCommand(command);
    }, []);

    const registerCommands = useCallback((commands: VoiceCommand[]) => {
        voiceService.registerCommands(commands);
    }, []);

    const value: VoiceControlContextType = {
        isVoiceEnabled,
        isListening,
        lastCommand,
        enableVoice,
        disableVoice,
        toggleVoice,
        registerCommand,
        registerCommands,
        speak,
    };

    return (
        <VoiceControlContext.Provider value={value}>
            {children}
        </VoiceControlContext.Provider>
    );
}
