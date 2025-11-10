import { Handler } from "@netlify/functions";
import { GoogleGenerativeAI } from "@google/generative-ai";

const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { question } = JSON.parse(event.body || "{}");
    if (!question) {
      return { statusCode: 400, body: "Missing 'question' in body." };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: "GEMINI_API_KEY not set on server.",
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(question);
    const text = result.response.text();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    };
  } catch (err: any) {
    console.error("Gemini API error:", err);
    const status = err?.status || 500;
    const msg =
      err?.message ||
      (typeof err === "string" ? err : "Failed to call Gemini API.");
    return { statusCode: status, body: msg };
  }
};

export { handler };

