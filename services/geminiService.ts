
import { GoogleGenAI, Type } from "@google/genai";
import { SimulationState, MonthlyProjection } from "../types";
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from "../constants";

export const analyzeFinancials = async (state: SimulationState, projections: MonthlyProjection[]): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });

    // 1. Analyze Projections to create a "Future Health" summary
    // We summarize to avoid token limits while keeping strategic signal
    const year1 = projections.slice(0, 12);
    const year2 = projections.slice(12, 24);
    const year3 = projections.slice(24, 36);

    const summarizeYear = (data: MonthlyProjection[]) => {
       if (data.length === 0) return null;
       const lastMonth = data[data.length - 1];
       const totalRev = data.reduce((sum, m) => sum + m.revenue, 0);
       const totalBurn = data.reduce((sum, m) => sum + (m.cashFlow < 0 ? Math.abs(m.cashFlow) : 0), 0);
       return {
           EndingMRR: lastMonth.revenue - lastMonth.oneTimeRevenue,
           TotalRevenue: totalRev,
           TotalBurn: totalBurn,
           EndingCash: lastMonth.cashBalance,
           ProfitableMonths: data.filter(m => m.netIncome > 0).length
       };
    };

    // Find the "Cash Low Point" (Lowest bank balance in first 24 months)
    const minCashBalance = Math.min(...projections.slice(0, 24).map(p => p.cashBalance));
    const monthsUntilBankruptcy = projections.findIndex(p => p.cashBalance < 0);
    const bankruptcyMonth = monthsUntilBankruptcy === -1 ? "Safe > 60mo" : monthsUntilBankruptcy + 1;

    const futureOutlook = {
        Year1_Summary: summarizeYear(year1),
        Year2_Summary: summarizeYear(year2),
        Year3_Summary: summarizeYear(year3),
        Survival_Check: {
            Lowest_Bank_Balance: minCashBalance,
            Bankruptcy_Forecast_Month: bankruptcyMonth
        }
    };

    // We extract the key metrics to pass clearly to the LLM
    // CRITICAL: We must provide the "Bridge" between raw costs and Gross Burn
    // so the AI doesn't flag "Unaccounted cash outflow" as a discrepancy.
    const metrics = {
      MRR: state.financials.mrr,
      ARR: state.financials.arr,
      GrossMarginPercent: (state.financials.grossMarginPercent * 100).toFixed(1) + "%",
      
      // Explicit Burn Breakdown to prevent "Hidden Cost" hallucinations
      GrossBurn_Total: state.financials.grossBurn,
      GrossBurn_Breakdown: {
        Payroll_Loaded: state.financials.payrollMonthly,
        OpEx: state.financials.opexMonthly,
        COGS: state.financials.cogs,
        Sales_Commissions: state.financials.commissions
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
    Here is the detailed SaaS financial model for analysis. 
    
    **CRITICAL INSTRUCTION**: Use the 'Key Investor Metrics' object below as the SINGLE SOURCE OF TRUTH for your math. 
    Do NOT attempt to re-calculate MRR or Burn from the raw lists, as the raw lists exclude Tax Loads, Commission Estimates, and Billing Intervals which are already accounted for in the Metrics.
    NOTE: All currency figures are in **HKD (Hong Kong Dollar)**.

    **Context & Assumptions:**
    - Payroll Tax Load: ${state.params.payrollTax}% (Included in Payroll figures)
    - Sales Commission Rate: ${state.params.commissionRate}% (Of new Gross Bookings)
    - Payment Processing Rate: ${state.params.paymentProcessingRate}% (Of Gross Revenue)
    - Scenario_Growth_Multiplier: ${state.params.marketingEfficiency}x (Input Slider for Projection Speed)
    
    **Key Investor Metrics (Current Snapshot):**
    ${JSON.stringify(metrics, null, 2)}
    
    **Future Financial Outlook (3-Year Forecast):**
    ${JSON.stringify(futureOutlook, null, 2)}
    
    **Plans (Pricing & Unit Economics):**
    ${JSON.stringify(state.plans.map(p => ({ 
      name: p.name, 
      price: p.price, 
      interval: p.interval, // NOTE: 'yearly' price means MRR = price / 12.
      unitCost: p.unitCost, 
      subscribers: p.subscribers 
    })), null, 2)}
    
    **Staffing (Base Salaries - Before Tax Load):**
    ${JSON.stringify(state.employees, null, 2)}

    **Operating Expenses:**
    ${JSON.stringify(state.expenses, null, 2)}
    
    Please provide a critical investment memo analysis. 
    1. **Survival Check**: Analyze the 'Future Financial Outlook'. Are they hitting a cash wall (Lowest Bank Balance < 0)? When?
    2. **Efficiency**: Evaluate the Magic Number, Burn Multiplier, and Rule of 40.
    3. **Unit Economics**: Is the LTV/CAC > 3.0? Is the Payback Period < 12 months?
    
    Be direct. If the 'Bankruptcy_Forecast_Month' is a number, WARN THEM LOUDLY.
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

export const estimateUnitCost = async (description: string, price: number, interval: string): Promise<CostEstimation> => {
   try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
    You are a SaaS Solutions Architect and Cloud Cost Estimator based in Hong Kong.
    Estimate the MONTHLY Variable Cost of Goods Sold (COGS) PER USER in **HKD (Hong Kong Dollar)** based on this technical description:
    
    "${description}"

    **Financial Context:**
    - Subscription Price: HKD $${price}
    - Billing Interval: ${interval}

    **Cost Components to Estimate:**
    1. Compute (AWS/GCP/Azure)
    2. Database/Storage per user
    3. Third-party API fees (OpenAI, Twilio, SendGrid, etc.)
    
    **IMPORTANT EXCLUSION:**
    - **DO NOT** include Payment Processing Fees (Stripe/PayPal) in this estimate. 
    - The application calculates payment fees automatically as a separate global percentage. 
    - Only estimate the *technical* and *service* delivery costs.

    Return a JSON object with:
    - estimatedCost: number (The total estimated monthly cost per user in HKD)
    - breakdown: string (A markdown formatted list explaining the cost components.)
    
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
