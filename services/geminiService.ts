
import { GoogleGenAI, Type } from "@google/genai";
import { SimulationState } from "../types";
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from "../constants";

export const analyzeFinancials = async (state: SimulationState): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Calculate the estimated commission amount for the breakdown
    const otherExpenses = state.financials.payrollMonthly + state.financials.opexMonthly + state.financials.cogs;
    const estCommissions = Math.max(0, state.financials.grossBurn - otherExpenses);

    // We extract the key metrics to pass clearly to the LLM
    // CRITICAL: We must provide the "Bridge" between raw costs and Gross Burn
    // so the AI doesn't flag "Unaccounted cash outflow" as a discrepancy.
    const metrics = {
      MRR: state.financials.mrr,
      ARR: state.financials.arr,
      GrossMarginPercent: (state.financials.grossMarginPercent * 100).toFixed(1) + "%",
      
      // Explicit Burn Breakdown
      GrossBurn_Total: state.financials.grossBurn,
      GrossBurn_Breakdown: {
        Payroll_Loaded: state.financials.payrollMonthly,
        OpEx: state.financials.opexMonthly,
        COGS: state.financials.cogs,
        Est_Sales_Commissions: estCommissions
      },
      
      NetBurn: state.financials.burnRate,
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

    **Context & Assumptions:**
    - Payroll Tax Load: ${state.params.payrollTax}% (Included in Payroll figures)
    - Sales Commission Rate: ${state.params.commissionRate}% (Of new Bookings)
    - Scenario_Growth_Multiplier: ${state.params.marketingEfficiency}x (Input Slider for Projection Speed)
    
    **Key Investor Metrics:**
    ${JSON.stringify(metrics, null, 2)}
    
    **Plans (Pricing & Unit Economics):**
    ${JSON.stringify(state.plans.map(p => ({ 
      name: p.name, 
      price: p.price, 
      interval: p.interval, // Critical for AI to calc MRR correcty
      unitCost: p.unitCost, 
      subscribers: p.subscribers 
    })), null, 2)}
    
    **Staffing (Base Salaries - Before Tax Load):**
    ${JSON.stringify(state.employees, null, 2)}

    **Operating Expenses:**
    ${JSON.stringify(state.expenses, null, 2)}
    
    Please provide a critical investment memo analysis. 
    1. Evaluate the **Efficiency** (Magic Number, Burn Multiplier, Rule of 40).
    2. Evaluate the **Unit Economics** (LTV/CAC, Payback Period, Gross Margin).
    3. Evaluate the **Runway & Survival** (Gross Burn vs Net Burn).
    
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

export interface CostEstimation {
  estimatedCost: number;
  breakdown: string;
}

export const estimateUnitCost = async (description: string): Promise<CostEstimation> => {
   try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
    You are a SaaS Solutions Architect and Cloud Cost Estimator.
    Estimate the MONTHLY Variable Cost of Goods Sold (COGS) PER USER based on this technical description:
    
    "${description}"

    Consider:
    1. Compute (AWS/GCP/Azure)
    2. Database/Storage per user
    3. Third-party API fees (OpenAI, Twilio, SendGrid, etc.)
    4. Payment Processing (e.g. Stripe ~2.9% + 30c)

    Return a JSON object with:
    - estimatedCost: number (The total estimated monthly cost per user in USD)
    - breakdown: string (A markdown formatted list explaining the cost components)
    
    Be conservative but realistic. If information is missing, make reasonable standard assumptions for a SaaS MVP.
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedCost: { type: Type.NUMBER },
            breakdown: { type: Type.STRING }
          }
        }
      }
    });
    
    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr) as CostEstimation;

   } catch (error) {
     console.error("Estimation failed", error);
     throw new Error("Failed to estimate costs.");
   }
}
