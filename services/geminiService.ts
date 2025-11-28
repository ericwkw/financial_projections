
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

    // We extract the key metrics to pass clearly to the LLM
    const metrics = {
      MRR: state.financials.mrr,
      ARR: state.financials.arr,
      BurnRate: state.financials.burnRate,
      RunwayMonths: state.financials.runwayMonths,
      LTV: state.financials.ltv,
      CAC: state.financials.cac,
      LTV_CAC_Ratio: state.financials.ltvCacRatio,
      RuleOf40: state.financials.ruleOf40,
      MagicNumber: state.financials.magicNumber,
      CAC_Payback_Months: state.financials.cacPaybackMonths,
      BurnMultiplier: state.financials.burnMultiplier
    };

    const prompt = `
    Here is the detailed SaaS financial model for analysis:

    **Key Investor Metrics:**
    ${JSON.stringify(metrics, null, 2)}
    
    **Plans (Pricing & Unit Economics):**
    ${JSON.stringify(state.plans.map(p => ({ name: p.name, price: p.price, unitCost: p.unitCost, subscribers: p.subscribers })), null, 2)}
    
    **Staffing (Cost Base):**
    ${JSON.stringify(state.employees, null, 2)}

    **Operating Expenses:**
    ${JSON.stringify(state.expenses, null, 2)}
    
    Please provide a critical investment memo analysis. 
    1. Evaluate the **Efficiency** (Magic Number, Burn Multiplier).
    2. Evaluate the **Unit Economics** (LTV/CAC, Payback Period).
    3. Evaluate the **Runway & Survival**.
    
    Be harsh if the numbers don't add up. Investors hate inefficiency.
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
