
import { GoogleGenAI } from "@google/genai";

/**
 * Calls the Gemini API to get an answer for a given question.
 * @param question The question to ask the Gemini model.
 * @returns A promise that resolves to the text response from the model.
 */
export const askGemini = async (question: string): Promise<string> => {
  // It's recommended to create a new instance for each call, especially in serverless
  // environments or when the API key might change.
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please configure your API key.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
    });

    // Use the .text property for direct access to the text response
    const text = response.text;
    
    if (text) {
      return text;
    } else {
      // This case is unlikely with .text, but provides robust error handling
      throw new Error('Received an empty response from Gemini.');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Provide a more user-friendly error message
    if (error instanceof Error && error.message.includes('API key')) {
        throw new Error('The provided API Key is invalid or missing. Please check your configuration.');
    }
    throw new Error('Failed to get a response from Gemini. The service may be temporarily unavailable.');
  }
};
