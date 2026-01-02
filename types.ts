
export interface Plan {
  id: string;
  name: string;
  description?: string; // Optional description for the plan
  price: number; // Price to customer
  setupFee: number; // One-time implementation fee
  unitCost: number; // COGS per user (e.g. LLM tokens)
  interval: 'monthly' | 'yearly' | 'lifetime';
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
  opexInflationRate: number; // Annual % increase in OpEx (Vendor costs)
  minChurnFloor: number; // Minimum churn % used for LTV calculation safety buffer
  commissionRate: number; // % of New ARR paid as commission
  paymentProcessingRate: number; // % fee (e.g., Stripe) on Revenue
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
  recurringGrossMarginPercent: number; // Gross Margin on Recurring Revenue only
  weightedAvgOneTimeRevenue: number; // Avg Setup/Lifetime fee per NEW PAYING user
  payrollMonthly: number; // Fully loaded
  opexMonthly: number; // Non-payroll operating expenses
  commissions: number; // Monthly Sales Commissions (New)
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
  grossBurn: number; // Total Monthly Cash Outflow
  burnRate: number; // Net Monthly Cash Burn (Gross Burn - Revenue)
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
  blendedGrowthRate: number; // Weighted average growth (All Users)
  blendedChurnRate: number; // Weighted average churn (All Users)
  paidGrowthRate: number; // Weighted average growth (Paying Users Only)
  paidChurnRate: number; // Weighted average churn (Paying Users Only)
  
  // Cohort specific
  blendedRecurringProfitPerUser: number; // (SaaS Rev - All Variable Costs) / All Paying Users
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
  newPayingSubscribers: number; // New field for Cohort Analysis
  cashBalance: number; // Actual money in bank
  cashFlow: number; // Net change in cash this month (Inflow - Outflow)
  commissions: number;
}

export interface CohortMetric {
  monthIndex: number; // 0, 1, 2...
  retentionRate: number; // 0-100
  cumulativeLtv: number; // Cumulative Gross Profit per User
  isBreakeven: boolean;
}

export interface Cohort {
  acquisitionMonth: number;
  size: number;
  cac: number;
  metrics: CohortMetric[];
}

export interface SimulationState {
  plans: Plan[];
  employees: Employee[];
  expenses: OperatingExpense[];
  params: ScenarioParams;
  financials: Financials; 
}

export type Currency = 'HKD' | 'USD' | 'EUR' | 'GBP';
