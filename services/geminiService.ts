import { GoogleGenAI } from "@google/genai";
import { SimulationState } from "../types";
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from "../constants";

export const analyzeFinancials = async (state: SimulationState): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    Here is the current SaaS financial snapshot:
    
    Plans:
    ${JSON.stringify(state.plans, null, 2)}
    
    Employees:
    ${JSON.stringify(state.employees, null, 2)}
    
    Please analyze this model.
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Error generating analysis. Please check your API key and try again.";
  }
};