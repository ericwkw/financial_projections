
import { Plan, Employee, OperatingExpense, ScenarioParams, Financials, MonthlyProjection } from "../types";

export const calculateFinancials = (
  plans: Plan[],
  employees: Employee[],
  expenses: OperatingExpense[],
  params: ScenarioParams
): Financials => {
  // 1. Current MRR, COGS (Variable), Subscriber Count
  let mrr = 0;
  let totalCogs = 0;
  let totalSubscribers = 0;
  let payingSubscribers = 0;

  plans.forEach(plan => {
    const isPaid = plan.price > 0;
    const priceMonthly = plan.interval === 'yearly' ? plan.price / 12 : plan.price;
    
    // Revenue only from paid plans
    if (isPaid) {
      mrr += priceMonthly * plan.subscribers;
      payingSubscribers += plan.subscribers;
    }
    
    // Costs apply to ALL plans (Free + Paid)
    totalCogs += plan.unitCost * plan.subscribers;
    totalSubscribers += plan.subscribers;
  });

  const arr = mrr * 12;
  const grossProfit = mrr - totalCogs;
  const grossMarginPercent = mrr > 0 ? (grossProfit / mrr) : 0;

  // 2. Payroll (Fixed Operating Expense - Loaded)
  let annualBaseSalary = 0;
  employees.forEach(emp => {
    annualBaseSalary += emp.salary * emp.count;
  });
  const payrollMonthly = (annualBaseSalary * (1 + params.payrollTax / 100)) / 12;

  // 3. Operating Expenses & CAC Separation (Fixed Operating Expenses)
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
  // Blended ARPU: Revenue / All Users (Shows dilution by free users)
  const arpu = totalSubscribers > 0 ? mrr / totalSubscribers : 0;
  
  // ARPPU: Revenue / Paying Users (Shows pricing power)
  const arppu = payingSubscribers > 0 ? mrr / payingSubscribers : 0;
  
  const conversionRate = totalSubscribers > 0 ? payingSubscribers / totalSubscribers : 0;
  
  // CAC: Cost to Acquire / New PAYING Customers
  // If we calculate CAC based on free users, it looks artificially cheap.
  // Investors care about the cost to acquire REVENUE.
  const impliedNewPayingCustomers = Math.max(0.1, payingSubscribers * (params.growthRate / 100)); 
  const cac = impliedNewPayingCustomers > 0 ? acquisitionCosts / impliedNewPayingCustomers : 0;

  // LTV: (ARPPU * GrossMargin%) / Churn%
  // We use ARPPU (Paying User Rev) but apply the Overall Gross Margin %
  // This penalizes LTV if free users drag down margins (which is accurate).
  const safeChurn = Math.max(0.5, params.churnRate); 
  const ltv = safeChurn > 0 ? (arppu * grossMarginPercent) / (safeChurn / 100) : 0;

  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  const ruleOf40 = params.growthRate + profitMargin; 

  // 6. Efficiency Metrics (New)
  
  // CAC Payback: CAC / (ARPPU * GM%)
  // How many months of gross profit from a PAYING user to pay back their CAC?
  const grossProfitPerPayingUser = arppu * grossMarginPercent;
  const cacPaybackMonths = grossProfitPerPayingUser > 0 ? cac / grossProfitPerPayingUser : 0;

  // Net New ARR
  const netGrowthRate = (params.growthRate - params.churnRate) / 100;
  const netNewArr = arr * netGrowthRate;

  // Magic Number: Net New ARR / Annualized Marketing
  const annualizedMarketing = acquisitionCosts * 12;
  const magicNumber = annualizedMarketing > 0 ? netNewArr / annualizedMarketing : 0;

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
    arppu,
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
    burnMultiplier,
    // Users
    totalSubscribers,
    payingSubscribers,
    conversionRate
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
    let monthlyRevenue = 0;
    let monthlyCogs = 0;
    let totalSubs = 0;

    currentSubscribersByPlan = currentSubscribersByPlan.map(plan => {
      // Net Growth Rate = Growth - Churn
      const netGrowthRate = (params.growthRate - params.churnRate) / 100;
      const newSubs = plan.subscribers * (1 + netGrowthRate);
      
      const priceMonthly = plan.interval === 'yearly' ? plan.price / 12 : plan.price;
      
      monthlyRevenue += priceMonthly * newSubs;
      monthlyCogs += plan.unitCost * newSubs; // COGS apply to free users too
      totalSubs += newSubs;

      return { ...plan, subscribers: newSubs };
    });

    const grossProfit = monthlyRevenue - monthlyCogs;
    
    // Fixed costs (Simplified linear projection)
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
