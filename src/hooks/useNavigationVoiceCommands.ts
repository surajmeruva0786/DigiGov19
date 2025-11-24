import { useEffect } from 'react';
import { useVoiceControl } from '../contexts/VoiceControlContext';
import { VoiceCommand } from '../lib/voiceRecognition';

export function useNavigationVoiceCommands(onNavigate: (page: string) => void, onLogout?: () => void, onToggleChatbot?: () => void) {
    const { registerCommands, speak, isVoiceEnabled } = useVoiceControl();

    useEffect(() => {
        if (!isVoiceEnabled) return;

        const commands: VoiceCommand[] = [
            // Dashboard navigation
            {
                pattern: /(go to|open|show|navigate to) (dashboard|home)/i,
                action: () => {
                    speak('Opening dashboard');
                    onNavigate('dashboard');
                },
                description: 'Navigate to dashboard',
                examples: ['Go to dashboard', 'Open home'],
                category: 'navigation',
            },

            // Government Schemes
            {
                pattern: /(go to|open|show|navigate to) (government schemes|schemes)/i,
                action: () => {
                    speak('Opening government schemes');
                    onNavigate('schemes');
                },
                description: 'Navigate to government schemes',
                examples: ['Go to schemes', 'Open government schemes'],
                category: 'navigation',
            },

            // Health Services
            {
                pattern: /(go to|open|show|navigate to) (health services|health)/i,
                action: () => {
                    speak('Opening health services');
                    onNavigate('health');
                },
                description: 'Navigate to health services',
                examples: ['Go to health', 'Open health services'],
                category: 'navigation',
            },

            // Education
            {
                pattern: /(go to|open|show|navigate to) (education|scholarships)/i,
                action: () => {
                    speak('Opening education assistance');
                    onNavigate('education');
                },
                description: 'Navigate to education',
                examples: ['Go to education', 'Open scholarships'],
                category: 'navigation',
            },

            // Complaints
            {
                pattern: /(go to|open|show|navigate to) (complaints|complaint)/i,
                action: () => {
                    speak('Opening complaints');
                    onNavigate('complaints');
                },
                description: 'Navigate to complaints',
                examples: ['Go to complaints', 'Open complaint'],
                category: 'navigation',
            },

            // Documents
            {
                pattern: /(go to|open|show|navigate to) (documents|document)/i,
                action: () => {
                    speak('Opening documents');
                    onNavigate('documents');
                },
                description: 'Navigate to documents',
                examples: ['Go to documents', 'Open document'],
                category: 'navigation',
            },

            // Feedback
            {
                pattern: /(go to|open|show|navigate to) (feedback|citizen feedback)/i,
                action: () => {
                    speak('Opening feedback');
                    onNavigate('feedback');
                },
                description: 'Navigate to feedback',
                examples: ['Go to feedback', 'Open citizen feedback'],
                category: 'navigation',
            },

            // Bill Payments
            {
                pattern: /(go to|open|show|navigate to) (bill payments|bills|pay bills)/i,
                action: () => {
                    speak('Opening bill payments');
                    onNavigate('bill-payments');
                },
                description: 'Navigate to bill payments',
                examples: ['Go to bills', 'Open bill payments'],
                category: 'navigation',
            },

            // Children
            {
                pattern: /(go to|open|show|navigate to) (children|child|kids)/i,
                action: () => {
                    speak('Opening children section');
                    onNavigate('children');
                },
                description: 'Navigate to children',
                examples: ['Go to children', 'Open kids'],
                category: 'navigation',
            },

            // Digital ID
            {
                pattern: /(go to|open|show|navigate to) (digital id|id card|digital card)/i,
                action: () => {
                    speak('Opening digital ID card');
                    onNavigate('digital-id');
                },
                description: 'Navigate to digital ID',
                examples: ['Go to digital ID', 'Open ID card'],
                category: 'navigation',
            },

            // Applications
            {
                pattern: /(go to|open|show|navigate to) (applications|my applications)/i,
                action: () => {
                    speak('Opening applications');
                    onNavigate('applications');
                },
                description: 'Navigate to applications',
                examples: ['Go to applications', 'Show my applications'],
                category: 'navigation',
            },

            // Chatbot
            {
                pattern: /(open|show|start) (chatbot|chat|assistant)/i,
                action: () => {
                    if (onToggleChatbot) {
                        speak('Opening chatbot');
                        onToggleChatbot();
                    }
                },
                description: 'Open chatbot',
                examples: ['Open chatbot', 'Start chat'],
                category: 'action',
            },

            {
                pattern: /(close|hide|stop) (chatbot|chat|assistant)/i,
                action: () => {
                    if (onToggleChatbot) {
                        speak('Closing chatbot');
                        onToggleChatbot();
                    }
                },
                description: 'Close chatbot',
                examples: ['Close chatbot', 'Hide chat'],
                category: 'action',
            },

            // Logout
            {
                pattern: /(logout|log out|sign out)/i,
                action: () => {
                    if (onLogout) {
                        speak('Logging out');
                        setTimeout(() => onLogout(), 500);
                    }
                },
                description: 'Logout',
                examples: ['Logout', 'Sign out'],
                category: 'action',
            },
        ];

        registerCommands(commands);
    }, [isVoiceEnabled, onNavigate, onLogout, onToggleChatbot, registerCommands, speak]);
}
