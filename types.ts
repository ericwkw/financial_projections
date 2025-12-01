
export interface Plan {
  id: string;
  name: string;
  price: number; // Price to customer
  setupFee: number; // One-time implementation fee
  unitCost: number; // COGS per user (e.g. LLM tokens)
  interval: 'monthly' | 'yearly';
  subscribers: number;
  monthlyGrowth: number; // % New users per month specific to this plan
  monthlyChurn: number; // % Lost users per month specific to this plan
}

export interface Employee {
  id: string;
  role: string;
  salary: number; // Annual salary
  count: number;
}

export interface OperatingExpense {
  id: string;
  name: string;
  amount: number; // Monthly cost
  category: 'Marketing' | 'Tech' | 'Operations' | 'Other';
  isAcquisition: boolean; // Is this a CAC expense?
}

export interface ScenarioParams {
  startingCash: number; // Cash in bank
  marketingEfficiency: number; // Global Growth Multiplier (1.0 = baseline)
  viralRate: number; // % of Total Users that invite a new user each month
  expansionRate: number; // Monthly upsell %
  payrollTax: number; // % overhead on salaries
  salaryGrowthRate: number; // Annual % increase in salaries
  commissionRate: number; // % of New ARR paid as commission
  valuationMultiple: number; // x ARR
  founderEquity: number; // % Ownership
}

export interface Financials {
  mrr: number;
  arr: number;
  oneTimeRevenueMonthly: number; // From setup fees based on current growth
  cogs: number; // Monthly Cost of Goods Sold
  grossProfit: number;
  grossMarginPercent: number;
  payrollMonthly: number; // Fully loaded
  opexMonthly: number; // Non-payroll operating expenses
  totalExpenses: number;
  netMonthly: number;
  profitMargin: number;
  valuation: number;
  founderValue: number; // Value of founder's equity
  
  // Advanced SaaS Metrics
  arpu: number; // Average Revenue Per User (Blended)
  arppu: number; // Average Revenue Per PAYING User
  cac: number; // Customer Acquisition Cost (Per PAYING user)
  ltv: number; // Lifetime Value
  ltvCacRatio: number;
  burnRate: number;
  runwayMonths: number; // Months until cashout
  ruleOf40: number; // Growth % + Profit %
  nrr: number; // Net Revenue Retention %
  
  // Efficiency Metrics (New)
  cacPaybackMonths: number; // Months to recover CAC
  magicNumber: number; // Sales Efficiency
  netNewArr: number; // Net New ARR generated this month
  burnMultiplier: number; // Burn per $1 of Net New ARR
  
  // User Metrics
  totalSubscribers: number;
  payingSubscribers: number;
  conversionRate: number; // % of users who pay
  blendedGrowthRate: number; // Weighted average growth
  blendedChurnRate: number; // Weighted average churn
}

export interface MonthlyProjection {
  month: number;
  revenue: number;
  oneTimeRevenue: number;
  cogs: number;
  grossProfit: number;
  payroll: number;
  opex: number;
  netIncome: number;
  subscribers: number;
  cashBalance: number; // Actual money in bank
  commissions: number;
}

export interface SimulationState {
  plans: Plan[];
  employees: Employee[];
  expenses: OperatingExpense[];
  params: ScenarioParams;
  financials: Financials; 
}

export type Currency = 'USD' | 'EUR' | 'GBP';
