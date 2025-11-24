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
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Always emit transcription event for UI display
            if (finalTranscript) {
                const transcriptEvent = new CustomEvent('voiceResult', {
                    detail: { transcript: finalTranscript.trim(), isFinal: true }
                });
                window.dispatchEvent(transcriptEvent);

                console.log('Voice input (final):', finalTranscript.trim());

                if (this.onResultCallback) {
                    this.onResultCallback(finalTranscript.trim());
                }

                this.processCommand(finalTranscript.trim().toLowerCase());
            }

            if (interimTranscript) {
                const transcriptEvent = new CustomEvent('voiceResult', {
                    detail: { transcript: interimTranscript.trim(), isFinal: false }
                });
                window.dispatchEvent(transcriptEvent);
            }
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

        // No command matched - that's okay, we still transcribe everything
    }

    // Public method to manually trigger command processing (for tutorial commands)
    public executeCommand(transcript: string) {
        this.processCommand(transcript);
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
            interimResults: true,  // Enable interim results for real-time transcription
            language: 'en-IN',
        });

        // Expose globally for tutorial commands
        (window as any).__voiceService = voiceServiceInstance;
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
