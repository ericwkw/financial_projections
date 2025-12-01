
import { Plan, Employee, OperatingExpense, ScenarioParams } from './types';

export const INITIAL_PLANS: Plan[] = [
  {
    id: '1',
    name: 'Basic',
    price: 9,
    setupFee: 0,
    unitCost: 1, 
    interval: 'monthly',
    subscribers: 100,
    monthlyGrowth: 8, // Fast growth
    monthlyChurn: 5, // Higher churn
  },
  {
    id: '2',
    name: 'Pro',
    price: 29,
    setupFee: 0,
    unitCost: 5, 
    interval: 'monthly',
    subscribers: 50,
    monthlyGrowth: 5,
    monthlyChurn: 2.5,
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 499,
    setupFee: 1000, 
    unitCost: 50, 
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
    salary: 120000, 
    count: 1,
  },
  {
    id: '3',
    role: 'Customer Support',
    salary: 48000, 
    count: 1,
  },
];

export const INITIAL_EXPENSES: OperatingExpense[] = [
  {
    id: '1',
    name: 'Cloud Hosting (AWS/GCP)',
    amount: 500,
    category: 'Tech',
    isAcquisition: false,
  },
  {
    id: '2',
    name: 'LLM API Credits (Base)',
    amount: 200,
    category: 'Tech',
    isAcquisition: false,
  },
  {
    id: '3',
    name: 'SaaS Subscriptions (Slack/Jira)',
    amount: 300,
    category: 'Operations',
    isAcquisition: false,
  },
  {
    id: '4',
    name: 'Google Ads',
    amount: 2000,
    category: 'Marketing',
    isAcquisition: true, 
  },
];

export const DEFAULT_SCENARIO: ScenarioParams = {
  startingCash: 50000, 
  marketingEfficiency: 1.0, // Baseline multiplier
  viralRate: 0.5, // 0.5% of users invite a friend per month
  expansionRate: 0.5, 
  payrollTax: 20, 
  salaryGrowthRate: 3,
  commissionRate: 10,
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
