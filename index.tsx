import { GoogleGenerativeAI } from "@google/generative-ai";

export const askGemini = async (question: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please configure your API key.");
  }

  const ai = new GoogleGenerativeAI(process.env.API_KEY);

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(question);
    const text = result.response.text();

    if (text) return text;
    throw new Error("Received an empty response from Gemini.");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("API key")) {
      throw new Error("Invalid or missing API key.");
    }
    throw new Error("Failed to get a response from Gemini.");
  }
};
