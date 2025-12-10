import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || '');

// Cache for storing recent suggestions
const suggestionCache = new Map<string, { suggestions: string[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Debounce helper
let debounceTimer: NodeJS.Timeout;

/**
 * Generate suggestions for complaint subjects based on department
 */
export async function getComplaintSubjectSuggestions(
    department: string,
    partialInput: string = ''
): Promise<string[]> {
    const cacheKey = `complaint-subject-${department}-${partialInput}`;

    // Check cache first
    const cached = suggestionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.suggestions;
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are helping an Indian citizen file a complaint with the ${department} department.
${partialInput ? `They have started typing: "${partialInput}"` : 'They need to write a subject line.'}

Generate 3 concise, specific subject lines for common complaints in this department. Each should be:
- Clear and specific (not generic)
- Action-oriented
- Relevant to Indian government services
- Between 5-10 words

Format: Return ONLY the 3 subject lines, one per line, without numbering or bullets.

Examples for Health department:
Delay in issuing health card at PHC Sector 12
Poor sanitation conditions at Government Hospital
Unavailability of essential medicines at dispensary`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const suggestions = text
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.match(/^\d+[\.)]/)) // Remove numbered items
            .slice(0, 3);

        // Cache the results
        suggestionCache.set(cacheKey, { suggestions, timestamp: Date.now() });

        return suggestions;
    } catch (error) {
        console.error('Error generating subject suggestions:', error);
        return [];
    }
}

/**
 * Generate suggestions for complaint descriptions
 */
export async function getComplaintDescriptionSuggestions(
    department: string,
    subject: string,
    partialInput: string = ''
): Promise<string[]> {
    const cacheKey = `complaint-desc-${department}-${subject}-${partialInput.slice(0, 20)}`;

    const cached = suggestionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.suggestions;
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are helping an Indian citizen write a detailed complaint description.

Department: ${department}
Subject: ${subject}
${partialInput ? `Started writing: "${partialInput}"` : ''}

Generate 2 detailed, professional complaint descriptions. Each should:
- Be specific with dates, locations, or reference numbers if applicable
- Mention the impact on the citizen
- Be polite but firm
- Include a request for action
- Be 2-3 sentences long
- Use Indian context (locations, departments, processes)

Format: Return ONLY the 2 descriptions, separated by "---"

Example:
I visited the Revenue Department office on [date] to submit my land mutation application. Despite having all required documents, the clerk refused to accept my application citing unclear reasons. This delay is causing significant hardship as I need the updated records for a bank loan. I request immediate processing of my application.
---
The water supply in our locality (Ward 15, Sector 21) has been irregular for the past two weeks. We receive water only for 2 hours daily instead of the scheduled 6 hours. This is affecting over 200 families and causing severe inconvenience. Please restore regular water supply at the earliest.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const suggestions = text
            .split('---')
            .map(s => s.trim())
            .filter(s => s.length > 20)
            .slice(0, 2);

        suggestionCache.set(cacheKey, { suggestions, timestamp: Date.now() });

        return suggestions;
    } catch (error) {
        console.error('Error generating description suggestions:', error);
        return [];
    }
}

/**
 * Generate suggestions for feedback subjects
 */
export async function getFeedbackSubjectSuggestions(
    category: string,
    feedbackType: string,
    partialInput: string = ''
): Promise<string[]> {
    const cacheKey = `feedback-subject-${category}-${feedbackType}-${partialInput}`;

    const cached = suggestionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.suggestions;
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are helping an Indian citizen write feedback for government services.

Category: ${category}
Feedback Type: ${feedbackType}
${partialInput ? `Started typing: "${partialInput}"` : ''}

Generate 3 concise subject lines for this type of feedback. Each should be:
- Specific to the category and type
- Clear and professional
- Between 5-10 words
- Relevant to Indian government digital services

Format: Return ONLY the 3 subject lines, one per line, without numbering.

Examples for Digital Services - Suggestion:
Improve mobile app interface for senior citizens
Add regional language support in portal
Enable offline form filling feature`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const suggestions = text
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.match(/^\d+[\.)]/))
            .slice(0, 3);

        suggestionCache.set(cacheKey, { suggestions, timestamp: Date.now() });

        return suggestions;
    } catch (error) {
        console.error('Error generating feedback subject suggestions:', error);
        return [];
    }
}

/**
 * Generate suggestions for feedback descriptions
 */
export async function getFeedbackDescriptionSuggestions(
    category: string,
    feedbackType: string,
    subject: string,
    partialInput: string = ''
): Promise<string[]> {
    const cacheKey = `feedback-desc-${category}-${feedbackType}-${subject.slice(0, 20)}`;

    const cached = suggestionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.suggestions;
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `You are helping an Indian citizen write detailed feedback for government services.

Category: ${category}
Feedback Type: ${feedbackType}
Subject: ${subject}
${partialInput ? `Started writing: "${partialInput}"` : ''}

Generate 2 detailed, constructive feedback descriptions. Each should:
- Be specific with examples
- ${feedbackType === 'complaint' ? 'Describe the issue clearly and its impact' : feedbackType === 'suggestion' ? 'Explain the suggestion and its benefits' : 'Highlight what worked well'}
- Be professional and respectful
- Be 2-3 sentences long
- Include actionable points if applicable

Format: Return ONLY the 2 descriptions, separated by "---"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const suggestions = text
            .split('---')
            .map(s => s.trim())
            .filter(s => s.length > 20)
            .slice(0, 2);

        suggestionCache.set(cacheKey, { suggestions, timestamp: Date.now() });

        return suggestions;
    } catch (error) {
        console.error('Error generating feedback description suggestions:', error);
        return [];
    }
}

/**
 * Debounced suggestion fetcher
 */
export function debouncedGetSuggestions<T extends any[]>(
    fn: (...args: T) => Promise<string[]>,
    delay: number = 500
): (...args: T) => Promise<string[]> {
    return (...args: T) => {
        return new Promise((resolve) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                const result = await fn(...args);
                resolve(result);
            }, delay);
        });
    };
}

/**
 * Clear old cache entries
 */
export function clearOldCache() {
    const now = Date.now();
    for (const [key, value] of suggestionCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
            suggestionCache.delete(key);
        }
    }
}

// Clear cache periodically
setInterval(clearOldCache, 10 * 60 * 1000); // Every 10 minutes
