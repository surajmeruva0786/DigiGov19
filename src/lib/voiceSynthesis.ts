export function speak(text: string, options: SpeechSynthesisUtteranceOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
            reject(new Error('Speech synthesis not supported'));
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Apply options
        utterance.lang = options.lang || 'en-US';
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        if (options.voice) {
            utterance.voice = options.voice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = (error) => reject(error);

        window.speechSynthesis.speak(utterance);
    });
}

export function stopSpeaking(): void {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

export function getVoices(): SpeechSynthesisVoice[] {
    if (!('speechSynthesis' in window)) {
        return [];
    }
    return window.speechSynthesis.getVoices();
}

export function getPreferredVoice(lang: string = 'en-US'): SpeechSynthesisVoice | null {
    const voices = getVoices();

    // Try to find a voice matching the language
    const matchingVoice = voices.find(voice => voice.lang.startsWith(lang));

    return matchingVoice || voices[0] || null;
}

interface SpeechSynthesisUtteranceOptions {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
}
