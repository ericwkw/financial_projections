import { Plan, Employee } from './types';

export const INITIAL_PLANS: Plan[] = [
  {
    id: '1',
    name: 'Basic',
    price: 9,
    interval: 'monthly',
    subscribers: 100,
  },
  {
    id: '2',
    name: 'Pro',
    price: 29,
    interval: 'monthly',
    subscribers: 50,
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 499,
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
    salary: 120000,
    count: 1,
  },
  {
    id: '3',
    role: 'Customer Support',
    salary: 50000,
    count: 1,
  },
];

export const GEMINI_MODEL = 'gemini-2.5-flash';

export const SYSTEM_INSTRUCTION = `
You are an expert SaaS CFO and Strategic Business Advisor. 
Your role is to analyze the user's financial model (subscription plans and employee costs).
Provide a concise, actionable analysis focusing on:
1. Profitability and Run Rate.
2. Pricing Strategy anomalies (e.g., is the gap between tiers too large?).
3. Team composition risks (e.g., high revenue but low support staff).
4. Suggestions for increasing ARR.

Format your response in Markdown with clear headers. Use bold text for key metrics.
`;
