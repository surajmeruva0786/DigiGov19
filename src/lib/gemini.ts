import { GoogleGenerativeAI } from '@google/generative-ai';

// Read API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

const SYSTEM_PROMPT = `You are DigiGov Assistant, an AI assistant specialized in helping Indian citizens with government services and schemes. Your role is to provide accurate, helpful information about:

1. **Government Schemes**: Information about various central and state government schemes including eligibility, benefits, and application process
2. **Complaints**: Guidance on filing complaints related to government sectors and services
3. **Documents**: Information about government certificates, documents, and how to obtain them (Aadhaar, PAN, Passport, etc.)
4. **Children Services**: Information about child upbringing, health, vaccinations, education schemes, and welfare programs
5. **Bill Payments**: Guidance on paying government bills (electricity, water, property tax, etc.)
6. **Health Services**: Information about government health services, hospitals, schemes like Ayushman Bharat, etc.
7. **Scholarships**: Information about government scholarship programs for students

**Guidelines:**
- Provide accurate, concise, and helpful information
- Use simple language that's easy to understand
- When discussing schemes, mention eligibility criteria and application process
- For documents, explain the required documents and process
- Always be respectful and professional
- If you don't know something, admit it and suggest contacting the relevant government department
- Focus only on Indian government services and schemes
- Provide step-by-step guidance when explaining processes

**Important:** You should only answer questions related to Indian government services. Politely decline questions outside this scope.`;

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export async function sendMessageToGemini(
    message: string,
    chatHistory: ChatMessage[]
): Promise<string> {
    try {
        // Using gemini-2.5-flash - confirmed available in your API
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
        });

        // Build conversation history for context
        // Filter out the welcome message and convert to Gemini format
        const history = chatHistory
            .filter(msg => msg.content !== getWelcomeMessage()) // Remove welcome message
            .map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            }));

        const chat = model.startChat({
            history: history,
        });

        // Send the message with system prompt prepended only on first user message
        const isFirstMessage = history.length === 0;
        const messageToSend = isFirstMessage
            ? `${SYSTEM_PROMPT}\n\nUser Question: ${message}`
            : message;

        const result = await chat.sendMessage(messageToSend);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error('Error calling Gemini API:', error);
        return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
}

export function getWelcomeMessage(): string {
    return "Hello! I'm DigiGov Assistant. I'm here to help you with information about Indian government services, schemes, documents, and more. How can I assist you today?";
}

export function getSuggestedQuestions(): string[] {
    return [
        "What is Ayushman Bharat scheme?",
        "How do I apply for a PAN card?",
        "What are the vaccination schedules for children?",
        "How can I pay my electricity bill online?",
        "What scholarships are available for students?",
        "How do I file a complaint about government services?",
    ];
}

export async function translateText(text: string, targetLanguage: string = 'Hindi'): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `Translate the following text to ${targetLanguage}. Return ONLY the translated text, no other words or explanations. maintain the tone and context.
        
        Text to translate: "${text}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original text on error
    }
}
