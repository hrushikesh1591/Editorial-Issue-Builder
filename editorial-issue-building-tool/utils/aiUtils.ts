import { GoogleGenAI, Type } from "@google/genai";
import { SURGICAL_TOPICS } from "../types";

export async function categorizeArticles(titles: string[]): Promise<Record<string, string>> {
  if (titles.length === 0) return {};

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize these maxillofacial surgery article titles into exactly one of these topics: ${SURGICAL_TOPICS.join(", ")}. 
      Return a JSON array of objects with "title" and "topic" keys.
      
      Titles:
      ${titles.join("\n")}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              topic: { type: Type.STRING }
            },
            required: ["title", "topic"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    const topicMap: Record<string, string> = {};
    
    results.forEach((item: { title: string; topic: string }) => {
      topicMap[item.title] = item.topic;
    });

    return topicMap;
  } catch (error) {
    console.error("Gemini Categorization Error:", error);
    return {};
  }
}