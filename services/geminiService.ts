import { GoogleGenAI, Type } from "@google/genai";
import { GeminiInsight } from "../types";

// Initialize Gemini Client
// Ensure API key is set in environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVideoInsights = async (title: string, description: string): Promise<GeminiInsight | null> => {
  try {
    const model = "gemini-2.5-flash";
    
    const prompt = `
      You are an expert film and documentary critic.
      Analyze the following video metadata:
      Title: "${title}"
      Description: "${description}"

      Provide a JSON response with:
      1. "summary": A captivating 2-sentence summary that hooks the viewer.
      2. "keyTakeaways": An array of 3 short bullet points on what the viewer will learn.
      3. "similarTopics": An array of 3 related topics or genres.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            similarTopics: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "keyTakeaways", "similarTopics"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeminiInsight;
    }
    return null;

  } catch (error) {
    console.error("Error generating insights:", error);
    return null;
  }
};
