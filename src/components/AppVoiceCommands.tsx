import { useNavigationVoiceCommands } from '../hooks/useNavigationVoiceCommands';

interface AppVoiceCommandsProps {
    onNavigate: (page: string) => void;
    onLogout: () => void;
    onToggleChatbot: () => void;
}

export function AppVoiceCommands({ onNavigate, onLogout, onToggleChatbot }: AppVoiceCommandsProps) {
    // Register navigation voice commands
    useNavigationVoiceCommands(onNavigate, onLogout, onToggleChatbot);

    // This component doesn't render anything
    return null;
}
