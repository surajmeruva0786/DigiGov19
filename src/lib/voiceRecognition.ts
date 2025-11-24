// Voice Recognition Service using Web Speech API

export interface VoiceCommand {
    pattern: RegExp;
    action: (matches: string[]) => void;
    description: string;
    examples: string[];
    category: 'navigation' | 'form' | 'action' | 'control';
}

export interface VoiceRecognitionOptions {
    continuous?: boolean;
    interimResults?: boolean;
    language?: string;
}

export class VoiceRecognitionService {
    private recognition: SpeechRecognition | null = null;
    private isListening: boolean = false;
    private commands: VoiceCommand[] = [];
    private onResultCallback: ((transcript: string) => void) | null = null;
    private onErrorCallback: ((error: string) => void) | null = null;
    private onStatusChangeCallback: ((isListening: boolean) => void) | null = null;

    constructor(options: VoiceRecognitionOptions = {}) {
        if (!this.isSupported()) {
            console.warn('Speech recognition is not supported in this browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = options.continuous ?? true;
        this.recognition.interimResults = options.interimResults ?? false;
        this.recognition.lang = options.language ?? 'en-IN';
        this.recognition.maxAlternatives = 1;

        this.setupEventHandlers();
    }

    isSupported(): boolean {
        return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    }

    private setupEventHandlers() {
        if (!this.recognition) return;

        this.recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const transcript = event.results[last][0].transcript.trim().toLowerCase();

            console.log('Voice input:', transcript);

            if (this.onResultCallback) {
                this.onResultCallback(transcript);
            }

            this.processCommand(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);

            if (this.onErrorCallback) {
                this.onErrorCallback(event.error);
            }

            // Restart on certain errors
            if (event.error === 'no-speech' || event.error === 'audio-capture') {
                setTimeout(() => {
                    if (this.isListening) {
                        this.start();
                    }
                }, 1000);
            }
        };

        this.recognition.onend = () => {
            // Auto-restart if still supposed to be listening
            if (this.isListening) {
                setTimeout(() => {
                    this.start();
                }, 100);
            }
        };

        this.recognition.onstart = () => {
            console.log('Voice recognition started');
            if (this.onStatusChangeCallback) {
                this.onStatusChangeCallback(true);
            }
        };
    }

    registerCommand(command: VoiceCommand) {
        this.commands.push(command);
    }

    registerCommands(commands: VoiceCommand[]) {
        this.commands.push(...commands);
    }

    clearCommands() {
        this.commands = [];
    }

    private processCommand(transcript: string) {
        for (const command of this.commands) {
            const matches = transcript.match(command.pattern);
            if (matches) {
                console.log('Command matched:', command.description);
                command.action(matches);
                return;
            }
        }

        console.log('No command matched for:', transcript);
    }

    start() {
        if (!this.recognition) {
            console.error('Speech recognition not initialized');
            return;
        }

        if (this.isListening) {
            console.log('Already listening');
            return;
        }

        try {
            this.recognition.start();
            this.isListening = true;
        } catch (error) {
            console.error('Error starting recognition:', error);
        }
    }

    stop() {
        if (!this.recognition) return;

        this.isListening = false;
        try {
            this.recognition.stop();
            if (this.onStatusChangeCallback) {
                this.onStatusChangeCallback(false);
            }
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    }

    onResult(callback: (transcript: string) => void) {
        this.onResultCallback = callback;
    }

    onError(callback: (error: string) => void) {
        this.onErrorCallback = callback;
    }

    onStatusChange(callback: (isListening: boolean) => void) {
        this.onStatusChangeCallback = callback;
    }

    getIsListening(): boolean {
        return this.isListening;
    }

    getCommands(): VoiceCommand[] {
        return this.commands;
    }
}

// Singleton instance
let voiceServiceInstance: VoiceRecognitionService | null = null;

export function getVoiceRecognitionService(): VoiceRecognitionService {
    if (!voiceServiceInstance) {
        voiceServiceInstance = new VoiceRecognitionService({
            continuous: true,
            interimResults: false,
            language: 'en-IN',
        });
    }
    return voiceServiceInstance;
}

// Type declarations for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}
