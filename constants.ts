
import { Plan, Employee, OperatingExpense, ScenarioParams } from './types';

export const INITIAL_PLANS: Plan[] = [
  {
    id: '1',
    name: 'Basic',
    price: 78, // ~10 USD
    setupFee: 0,
    unitCost: 8, // ~1 USD
    interval: 'monthly',
    subscribers: 100,
    monthlyGrowth: 8, // Fast growth
    monthlyChurn: 5, // Higher churn
  },
  {
    id: '2',
    name: 'Pro',
    price: 238, // ~30 USD
    setupFee: 0,
    unitCost: 40, // ~5 USD
    interval: 'monthly',
    subscribers: 50,
    monthlyGrowth: 5,
    monthlyChurn: 2.5,
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 3888, // ~500 USD
    setupFee: 8000, // ~1000 USD
    unitCost: 400, // ~50 USD
    interval: 'yearly',
    subscribers: 5,
    monthlyGrowth: 2, // Slow sales cycle
    monthlyChurn: 0.5, // Sticky
  },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: '1',
    role: 'Founder/CEO',
    salary: 0,
    count: 1,
  },
  {
    id: '2',
    role: 'Senior Engineer',
    salary: 960000, // ~120k USD
    count: 1,
  },
  {
    id: '3',
    role: 'Customer Support',
    salary: 380000, // ~48k USD
    count: 1,
  },
];

export const INITIAL_EXPENSES: OperatingExpense[] = [
  {
    id: '1',
    name: 'Cloud Hosting (AWS/GCP)',
    amount: 4000, // ~500 USD
    category: 'Tech',
    isAcquisition: false,
  },
  {
    id: '2',
    name: 'LLM API Credits (Base)',
    amount: 1500, // ~200 USD
    category: 'Tech',
    isAcquisition: false,
  },
  {
    id: '3',
    name: 'SaaS Subscriptions (Slack/Jira)',
    amount: 2500, // ~300 USD
    category: 'Operations',
    isAcquisition: false,
  },
  {
    id: '4',
    name: 'Google Ads',
    amount: 15000, // ~2000 USD
    category: 'Marketing',
    isAcquisition: true, 
  },
];

export const DEFAULT_SCENARIO: ScenarioParams = {
  startingCash: 400000, // ~50k USD
  marketingEfficiency: 1.0, // Baseline multiplier
  viralRate: 0.5, // 0.5% of users invite a friend per month
  expansionRate: 0.5, 
  payrollTax: 5, // MPF is lower in HK (~5% cap) but let's keep it configurable
  salaryGrowthRate: 3,
  opexInflationRate: 3, // New: Default 3% annual inflation on software/rent
  minChurnFloor: 0.5, // New: Safety buffer, never assume < 0.5% churn in LTV calc
  commissionRate: 10,
  paymentProcessingRate: 3.4, // Standard Stripe HK (3.4%)
  valuationMultiple: 6, 
  founderEquity: 80, 
};

export const GEMINI_MODEL = 'gemini-2.5-flash';

export const SYSTEM_INSTRUCTION = `
You are an expert Venture Capital Analyst and SaaS CFO. 
Your role is to analyze the user's financial model for INVESTMENT READINESS.

Focus on:
1. **Unit Economics**: Is the LTV/CAC ratio healthy (>3.0)? If not, warn them immediately.
2. **Runway**: Are they running out of cash too fast?
3. **Efficiency**: Check the 'Rule of 40' (Growth + Profit Margin).
4. **Valuation**: Is their valuation realistic given their ARR?

Be direct, critical, and strategic. Don't just summarize the numbers—tell them if they are fundable.
Format your response in Markdown. Use bold for warnings.
`;
