
import { Plan, Employee, OperatingExpense, ScenarioParams } from './types';

export const INITIAL_PLANS: Plan[] = [
  {
    id: '1',
    name: 'Basic',
    price: 9,
    setupFee: 0,
    unitCost: 1, // e.g. Basic server load
    interval: 'monthly',
    subscribers: 100,
  },
  {
    id: '2',
    name: 'Pro',
    price: 29,
    setupFee: 0,
    unitCost: 5, // e.g. Higher LLM limits
    interval: 'monthly',
    subscribers: 50,
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 499,
    setupFee: 1000, // One-time onboarding fee
    unitCost: 50, // Dedicated resources
    interval: 'yearly',
    subscribers: 5,
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
    salary: 120000, // $10k/mo
    count: 1,
  },
  {
    id: '3',
    role: 'Customer Support',
    salary: 48000, // $4k/mo (Changed from 50000 to be divisible by 12)
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
    isAcquisition: true, // Marked as CAC
  },
];

export const DEFAULT_SCENARIO: ScenarioParams = {
  startingCash: 50000, // $50k initial funding
  growthRate: 5, // 5% MoM
  churnRate: 2, // 2% MoM
  expansionRate: 0.5, // 0.5% Expansion MoM
  payrollTax: 20, // 20% benefits/tax load
  valuationMultiple: 6, // 6x ARR
  founderEquity: 80, // 80% ownership
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
