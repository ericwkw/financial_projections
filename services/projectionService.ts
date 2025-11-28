
import { Plan, Employee, OperatingExpense, ScenarioParams, Financials, MonthlyProjection } from "../types";

export const calculateFinancials = (
  plans: Plan[],
  employees: Employee[],
  expenses: OperatingExpense[],
  params: ScenarioParams
): Financials => {
  // 1. Current MRR, COGS, Subscriber Count
  let mrr = 0;
  let totalCogs = 0;
  let totalSubscribers = 0;

  plans.forEach(plan => {
    const priceMonthly = plan.interval === 'yearly' ? plan.price / 12 : plan.price;
    mrr += priceMonthly * plan.subscribers;
    totalCogs += plan.unitCost * plan.subscribers;
    totalSubscribers += plan.subscribers;
  });

  const arr = mrr * 12;
  const grossProfit = mrr - totalCogs;
  const grossMarginPercent = mrr > 0 ? (grossProfit / mrr) : 0;

  // 2. Payroll (Loaded)
  let annualBaseSalary = 0;
  employees.forEach(emp => {
    annualBaseSalary += emp.salary * emp.count;
  });
  const payrollMonthly = (annualBaseSalary * (1 + params.payrollTax / 100)) / 12;

  // 3. Operating Expenses & CAC Separation
  const opexMonthly = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const acquisitionCosts = expenses
    .filter(e => e.isAcquisition)
    .reduce((acc, exp) => acc + exp.amount, 0);

  // 4. Totals
  const totalExpenses = totalCogs + payrollMonthly + opexMonthly;
  const netMonthly = mrr - totalExpenses;
  const profitMargin = mrr > 0 ? (netMonthly / mrr) * 100 : 0;
  const valuation = arr * params.valuationMultiple;
  const burnRate = netMonthly < 0 ? Math.abs(netMonthly) : 0;
  const runwayMonths = burnRate > 0 ? params.startingCash / burnRate : (params.startingCash > 0 ? 999 : 0);

  // 5. SaaS Advanced Metrics
  const arpu = totalSubscribers > 0 ? mrr / totalSubscribers : 0;
  
  // CAC: Cost to Acquire / New Customers
  // New Subs = Total Subs * (GrowthRate/100)
  const impliedNewCustomers = Math.max(1, totalSubscribers * (params.growthRate / 100)); 
  const cac = impliedNewCustomers > 0 ? acquisitionCosts / impliedNewCustomers : 0;

  // LTV: (ARPU * GrossMargin%) / Churn%
  const safeChurn = Math.max(0.5, params.churnRate); 
  const ltv = safeChurn > 0 ? (arpu * grossMarginPercent) / (safeChurn / 100) : 0;

  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  const ruleOf40 = params.growthRate + profitMargin; 

  // 6. Efficiency Metrics (New)
  
  // CAC Payback: CAC / (ARPU * GM%)
  // How many months of gross profit to pay back the acquisition cost?
  const grossProfitPerUser = arpu * grossMarginPercent;
  const cacPaybackMonths = grossProfitPerUser > 0 ? cac / grossProfitPerUser : 0;

  // Net New ARR: ARR added this month minus ARR lost
  const netGrowthRate = (params.growthRate - params.churnRate) / 100;
  const netNewArr = arr * netGrowthRate;

  // SaaS Magic Number: Net New ARR / Annualized Marketing Spend
  // (Net New Monthly ARR * 12) / (Monthly Marketing * 12) -> Simplified: Net New Monthly ARR / Monthly Marketing
  // Wait, standard is: (Change in Quarterly Rev * 4) / Previous Q Sales&Marketing.
  // We will use: Annualized Net New Revenue / Annualized Marketing Spend
  const annualizedMarketing = acquisitionCosts * 12;
  const magicNumber = annualizedMarketing > 0 ? netNewArr / annualizedMarketing : 0;

  // Burn Multiplier: Burn / Net New ARR
  // How much cash do we burn to add $1 of ARR?
  // Only relevant if burning cash.
  const burnMultiplier = (burnRate > 0 && netNewArr > 0) 
    ? (burnRate * 12) / netNewArr 
    : 0;

  return {
    mrr,
    arr,
    cogs: totalCogs,
    grossProfit,
    grossMarginPercent,
    payrollMonthly,
    opexMonthly,
    totalExpenses,
    netMonthly,
    profitMargin,
    valuation,
    // Metrics
    arpu,
    cac,
    ltv,
    ltvCacRatio,
    burnRate,
    runwayMonths,
    ruleOf40,
    // Efficiency
    cacPaybackMonths,
    magicNumber,
    netNewArr,
    burnMultiplier
  };
};

export const generateProjections = (
  plans: Plan[],
  baseFinancials: Financials,
  params: ScenarioParams,
  months = 24
): { projections: MonthlyProjection[], breakEvenMonth: number | null } => {
  const projections: MonthlyProjection[] = [];
  let breakEvenMonth: number | null = null;
  let currentCash = params.startingCash;

  // Initial State
  let currentSubscribersByPlan = plans.map(p => ({ ...p }));

  for (let i = 1; i <= months; i++) {
    // Apply Growth & Churn to subscribers
    let monthlyRevenue = 0;
    let monthlyCogs = 0;
    let totalSubs = 0;

    currentSubscribersByPlan = currentSubscribersByPlan.map(plan => {
      // Net Growth Rate = Growth - Churn
      const netGrowthRate = (params.growthRate - params.churnRate) / 100;
      const newSubs = plan.subscribers * (1 + netGrowthRate);
      
      const priceMonthly = plan.interval === 'yearly' ? plan.price / 12 : plan.price;
      
      monthlyRevenue += priceMonthly * newSubs;
      monthlyCogs += plan.unitCost * newSubs;
      totalSubs += newSubs;

      return { ...plan, subscribers: newSubs };
    });

    const grossProfit = monthlyRevenue - monthlyCogs;
    
    // Fixed costs (Simplified: assuming constant OpEx/Payroll, 
    // in reality these step up with revenue, but good enough for estimation)
    const payroll = baseFinancials.payrollMonthly; 
    const opex = baseFinancials.opexMonthly;
    const netIncome = grossProfit - payroll - opex;

    currentCash += netIncome;

    if (breakEvenMonth === null && netIncome > 0) {
      breakEvenMonth = i;
    }

    projections.push({
      month: i,
      revenue: monthlyRevenue,
      cogs: monthlyCogs,
      grossProfit,
      payroll,
      opex,
      netIncome,
      subscribers: Math.round(totalSubs),
      cashBalance: currentCash
    });
  }

  return { projections, breakEvenMonth };
};
