export interface VoiceCommand {
    intent: string;
    patterns: RegExp[];
    action: (params: CommandParams) => Promise<CommandResult>;
    description: string;
    examples: string[];
}

export interface CommandParams {
    transcript: string;
    navigate: (path: string) => void;
    currentPath: string;
    matches?: RegExpMatchArray;
}

export interface CommandResult {
    success: boolean;
    message: string;
    shouldSpeak?: boolean;
}

// Navigation commands
export const navigationCommands: VoiceCommand[] = [
    {
        intent: 'NAVIGATE_DASHBOARD',
        patterns: [
            /go to (the )?dashboard/i,
            /open (the )?dashboard/i,
            /show (the )?dashboard/i,
            /take me to (the )?dashboard/i,
        ],
        action: async ({ navigate }) => {
            navigate('/dashboard');
            return { success: true, message: 'Opening dashboard', shouldSpeak: true };
        },
        description: 'Navigate to dashboard',
        examples: ['Go to dashboard', 'Open dashboard'],
    },
    {
        intent: 'NAVIGATE_DOCUMENTS',
        patterns: [
            /go to (my )?documents?/i,
            /open (my )?documents?/i,
            /show (my )?documents?/i,
        ],
        action: async ({ navigate }) => {
            navigate('/documents');
            return { success: true, message: 'Opening documents', shouldSpeak: true };
        },
        description: 'Navigate to documents',
        examples: ['Go to documents', 'Show my documents'],
    },
    {
        intent: 'NAVIGATE_COMPLAINTS',
        patterns: [
            /go to (my )?complaints?/i,
            /open (my )?complaints?/i,
            /show (my )?complaints?/i,
            /file (a )?complaint/i,
        ],
        action: async ({ navigate }) => {
            navigate('/complaints');
            return { success: true, message: 'Opening complaints', shouldSpeak: true };
        },
        description: 'Navigate to complaints',
        examples: ['Go to complaints', 'File a complaint'],
    },
    {
        intent: 'NAVIGATE_BILL_PAYMENTS',
        patterns: [
            /go to (bill )?payments?/i,
            /open (bill )?payments?/i,
            /pay (my )?bills?/i,
            /bill payment/i,
        ],
        action: async ({ navigate }) => {
            navigate('/bill-payments');
            return { success: true, message: 'Opening bill payments', shouldSpeak: true };
        },
        description: 'Navigate to bill payments',
        examples: ['Go to bill payments', 'Pay my bills'],
    },
    {
        intent: 'NAVIGATE_SCHEMES',
        patterns: [
            /go to schemes?/i,
            /open schemes?/i,
            /show (me )?(government )?schemes?/i,
            /apply for schemes?/i,
        ],
        action: async ({ navigate }) => {
            navigate('/schemes');
            return { success: true, message: 'Opening government schemes', shouldSpeak: true };
        },
        description: 'Navigate to schemes',
        examples: ['Go to schemes', 'Show government schemes'],
    },
    {
        intent: 'NAVIGATE_HEALTH',
        patterns: [
            /go to health/i,
            /open health/i,
            /health (services?|care)/i,
        ],
        action: async ({ navigate }) => {
            navigate('/health');
            return { success: true, message: 'Opening health services', shouldSpeak: true };
        },
        description: 'Navigate to health services',
        examples: ['Go to health', 'Open health services'],
    },
    {
        intent: 'GO_BACK',
        patterns: [
            /go back/i,
            /back/i,
            /previous page/i,
        ],
        action: async ({ navigate }) => {
            window.history.back();
            return { success: true, message: 'Going back', shouldSpeak: true };
        },
        description: 'Go back to previous page',
        examples: ['Go back', 'Previous page'],
    },
];

// Form filling commands
export const formCommands: VoiceCommand[] = [
    {
        intent: 'FILL_NAME',
        patterns: [
            /fill (my )?name (as |with )?(.+)/i,
            /enter (my )?name (as |with )?(.+)/i,
            /set name to (.+)/i,
        ],
        action: async ({ matches }) => {
            const name = matches?.[3] || matches?.[1];
            if (!name) {
                return { success: false, message: 'Please specify the name', shouldSpeak: true };
            }

            // Find name input field and fill it
            const nameInput = document.querySelector<HTMLInputElement>(
                'input[name="name"], input[id*="name"], input[placeholder*="name" i]'
            );

            if (nameInput) {
                nameInput.value = name.trim();
                nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                nameInput.dispatchEvent(new Event('change', { bubbles: true }));
                return { success: true, message: `Name set to ${name}`, shouldSpeak: true };
            }

            return { success: false, message: 'Name field not found on this page', shouldSpeak: true };
        },
        description: 'Fill name in form',
        examples: ['Fill my name as John Doe', 'Enter name John'],
    },
    {
        intent: 'FILL_PHONE',
        patterns: [
            /fill (my )?phone (number )?(as |with )?(.+)/i,
            /enter (my )?phone (number )?(as |with )?(.+)/i,
            /set phone (number )?to (.+)/i,
        ],
        action: async ({ matches }) => {
            const phone = matches?.[4] || matches?.[2];
            if (!phone) {
                return { success: false, message: 'Please specify the phone number', shouldSpeak: true };
            }

            // Remove spaces and convert words to numbers
            const phoneNumber = phone.replace(/\s+/g, '');

            const phoneInput = document.querySelector<HTMLInputElement>(
                'input[name="phone"], input[id*="phone"], input[type="tel"], input[placeholder*="phone" i]'
            );

            if (phoneInput) {
                phoneInput.value = phoneNumber;
                phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
                phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
                return { success: true, message: `Phone number set to ${phoneNumber}`, shouldSpeak: true };
            }

            return { success: false, message: 'Phone field not found on this page', shouldSpeak: true };
        },
        description: 'Fill phone number in form',
        examples: ['Fill phone number 9876543210', 'Enter my phone as 1234567890'],
    },
    {
        intent: 'FILL_AMOUNT',
        patterns: [
            /fill amount (as |with )?(.+)/i,
            /enter amount (as |with )?(.+)/i,
            /set amount to (.+)/i,
            /amount is (.+)/i,
        ],
        action: async ({ matches }) => {
            const amountText = matches?.[2] || matches?.[1];
            if (!amountText) {
                return { success: false, message: 'Please specify the amount', shouldSpeak: true };
            }

            // Extract numbers from text
            const amount = amountText.replace(/[^\d.]/g, '');

            const amountInput = document.querySelector<HTMLInputElement>(
                'input[name="amount"], input[id*="amount"], input[placeholder*="amount" i]'
            );

            if (amountInput) {
                amountInput.value = amount;
                amountInput.dispatchEvent(new Event('input', { bubbles: true }));
                amountInput.dispatchEvent(new Event('change', { bubbles: true }));
                return { success: true, message: `Amount set to ${amount}`, shouldSpeak: true };
            }

            return { success: false, message: 'Amount field not found on this page', shouldSpeak: true };
        },
        description: 'Fill amount in form',
        examples: ['Fill amount 500', 'Set amount to 1000'],
    },
];

// Action commands
export const actionCommands: VoiceCommand[] = [
    {
        intent: 'SUBMIT_FORM',
        patterns: [
            /submit (the )?form/i,
            /submit/i,
            /send (it)?/i,
            /proceed/i,
        ],
        action: async () => {
            const submitButton = document.querySelector<HTMLButtonElement>(
                'button[type="submit"], button:contains("Submit"), button:contains("Proceed"), button:contains("Continue")'
            );

            if (submitButton && !submitButton.disabled) {
                submitButton.click();
                return { success: true, message: 'Submitting form', shouldSpeak: true };
            }

            return { success: false, message: 'Submit button not found or disabled', shouldSpeak: true };
        },
        description: 'Submit current form',
        examples: ['Submit form', 'Submit', 'Proceed'],
    },
    {
        intent: 'CANCEL',
        patterns: [
            /cancel/i,
            /stop/i,
            /never mind/i,
            /go back/i,
        ],
        action: async () => {
            const cancelButton = document.querySelector<HTMLButtonElement>(
                'button:contains("Cancel"), button:contains("Close"), button:contains("Back")'
            );

            if (cancelButton) {
                cancelButton.click();
                return { success: true, message: 'Cancelled', shouldSpeak: true };
            }

            return { success: true, message: 'Cancelled', shouldSpeak: true };
        },
        description: 'Cancel current action',
        examples: ['Cancel', 'Stop', 'Never mind'],
    },
];

// Help commands
export const helpCommands: VoiceCommand[] = [
    {
        intent: 'HELP',
        patterns: [
            /help/i,
            /what can you do/i,
            /how do i/i,
            /commands/i,
        ],
        action: async () => {
            const helpMessage = `I can help you navigate the website, fill forms, and perform actions. 
        Try saying: Go to dashboard, Fill my name, Submit form, or ask me to navigate to any section.`;
            return { success: true, message: helpMessage, shouldSpeak: true };
        },
        description: 'Show help information',
        examples: ['Help', 'What can you do?'],
    },
];

// Combine all commands
export const allCommands: VoiceCommand[] = [
    ...navigationCommands,
    ...formCommands,
    ...actionCommands,
    ...helpCommands,
];

// Match command from transcript
export function matchCommand(transcript: string): VoiceCommand | null {
    const normalizedTranscript = transcript.toLowerCase().trim();

    for (const command of allCommands) {
        for (const pattern of command.patterns) {
            if (pattern.test(normalizedTranscript)) {
                return command;
            }
        }
    }

    return null;
}

// Execute command
export async function executeCommand(
    transcript: string,
    params: Omit<CommandParams, 'transcript' | 'matches'>
): Promise<CommandResult> {
    const command = matchCommand(transcript);

    if (!command) {
        return {
            success: false,
            message: "Sorry, I didn't understand that command. Try saying 'Help' for available commands.",
            shouldSpeak: true,
        };
    }

    // Find matching pattern to extract parameters
    let matches: RegExpMatchArray | undefined;
    for (const pattern of command.patterns) {
        const match = transcript.match(pattern);
        if (match) {
            matches = match;
            break;
        }
    }

    try {
        return await command.action({
            ...params,
            transcript,
            matches,
        });
    } catch (error) {
        console.error('Error executing command:', error);
        return {
            success: false,
            message: 'Sorry, there was an error executing that command',
            shouldSpeak: true,
        };
    }
}
