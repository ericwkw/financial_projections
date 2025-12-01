
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
  let oneTimeRevenueMonthly = 0;

  // Track weighted averages for blended metrics
  let weightedGrowthSum = 0;
  let weightedChurnSum = 0;

  plans.forEach(plan => {
    const isPaid = plan.price > 0;
    const priceMonthly = plan.interval === 'yearly' ? plan.price / 12 : plan.price;
    
    // Revenue only from paid plans
    if (isPaid) {
      mrr += priceMonthly * plan.subscribers;
      payingSubscribers += plan.subscribers;
    }
    
    // Growth Logic for Snapshot
    // Base Plan Growth * Marketing Efficiency Multiplier + Viral Boost
    // We treat Viral Rate as a global lift applied to the base
    // Use fallback to 0 if monthlyGrowth/Churn are missing (backward compatibility)
    const growth = plan.monthlyGrowth || 0;
    const churn = plan.monthlyChurn || 0;
    
    const effectiveGrowthRate = (growth * params.marketingEfficiency) + params.viralRate;
    const effectiveChurnRate = churn;

    // Weighting by subscribers for an accurate "Blended" view
    weightedGrowthSum += effectiveGrowthRate * plan.subscribers;
    weightedChurnSum += effectiveChurnRate * plan.subscribers;

    // Estimate new users this month for setup fees
    const newUsers = Math.max(0, plan.subscribers * (effectiveGrowthRate / 100));
    oneTimeRevenueMonthly += newUsers * plan.setupFee;

    // Costs apply to ALL plans (Free + Paid)
    totalCogs += plan.unitCost * plan.subscribers;
    totalSubscribers += plan.subscribers;
  });

  // Calculate Blended Rates
  const blendedGrowthRate = totalSubscribers > 0 ? weightedGrowthSum / totalSubscribers : 0;
  const blendedChurnRate = totalSubscribers > 0 ? weightedChurnSum / totalSubscribers : 0;

  const arr = mrr * 12;
  const grossProfit = mrr - totalCogs; 
  const grossMarginPercent = mrr > 0 ? (grossProfit / mrr) : 0;

  // 2. Payroll (Fixed Operating Expense - Loaded)
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
  const netMonthly = (mrr + oneTimeRevenueMonthly) - totalExpenses;
  const profitMargin = mrr > 0 ? (netMonthly / mrr) * 100 : 0;
  
  const valuation = arr * params.valuationMultiple;
  const founderValue = valuation * (params.founderEquity / 100);

  const burnRate = netMonthly < 0 ? Math.abs(netMonthly) : 0;
  const runwayMonths = burnRate > 0 ? params.startingCash / burnRate : (params.startingCash > 0 ? 999 : 0);

  // 5. SaaS Advanced Metrics
  const arpu = totalSubscribers > 0 ? mrr / totalSubscribers : 0;
  const arppu = payingSubscribers > 0 ? mrr / payingSubscribers : 0;
  const conversionRate = totalSubscribers > 0 ? payingSubscribers / totalSubscribers : 0;
  
  // CAC: Cost to Acquire / New PAYING Customers
  const impliedNewPayingCustomers = Math.max(0.1, payingSubscribers * (blendedGrowthRate / 100)); 
  const cac = impliedNewPayingCustomers > 0 ? acquisitionCosts / impliedNewPayingCustomers : 0;

  // LTV: Use Blended Churn
  const safeChurn = Math.max(0.5, blendedChurnRate); 
  const ltv = safeChurn > 0 ? (arppu * grossMarginPercent) / (safeChurn / 100) : 0;

  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  
  // Rule of 40: Blended Growth + Profit Margin
  const ruleOf40 = blendedGrowthRate + profitMargin; 
  
  // NRR = 100 + Expansion - Churn
  const nrr = 100 + params.expansionRate - blendedChurnRate;

  // 6. Efficiency Metrics
  const weightedSetupFee = payingSubscribers > 0 ? oneTimeRevenueMonthly / impliedNewPayingCustomers : 0;
  const grossProfitPerPayingUser = (arppu * grossMarginPercent) + weightedSetupFee;
  const cacPaybackMonths = grossProfitPerPayingUser > 0 ? cac / grossProfitPerPayingUser : 0;

  const netGrowthRate = (blendedGrowthRate + params.expansionRate - blendedChurnRate) / 100;
  const netNewArr = arr * netGrowthRate;

  const annualizedMarketing = acquisitionCosts * 12;
  const magicNumber = annualizedMarketing > 0 ? netNewArr / annualizedMarketing : 0;

  const burnMultiplier = (burnRate > 0 && netNewArr > 0) 
    ? (burnRate * 12) / netNewArr 
    : 0;

  return {
    mrr,
    arr,
    oneTimeRevenueMonthly,
    cogs: totalCogs,
    grossProfit,
    grossMarginPercent,
    payrollMonthly,
    opexMonthly,
    totalExpenses,
    netMonthly,
    profitMargin,
    valuation,
    founderValue,
    arpu,
    arppu,
    cac,
    ltv,
    ltvCacRatio,
    burnRate,
    runwayMonths,
    ruleOf40,
    nrr,
    cacPaybackMonths,
    magicNumber,
    netNewArr,
    burnMultiplier,
    totalSubscribers,
    payingSubscribers,
    conversionRate,
    blendedGrowthRate,
    blendedChurnRate
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
  let expansionRevenueAccumulated = 0; 

  for (let i = 1; i <= months; i++) {
    let monthlyRecurringRevenue = 0;
    let monthlyOneTimeRevenue = 0;
    let monthlyCogs = 0;
    let totalSubs = 0;
    let newArrForCommissions = 0;

    if (i > 1) {
       const prevRevenue = projections[i-2].revenue - projections[i-2].oneTimeRevenue; 
       expansionRevenueAccumulated += prevRevenue * (params.expansionRate / 100);
       // Expansion counts as New ARR for commissions? Usually yes.
       newArrForCommissions += prevRevenue * (params.expansionRate / 100) * 12;
    }

    currentSubscribersByPlan = currentSubscribersByPlan.map(plan => {
      // PROJECTION LOGIC:
      // 1. Organic Plan Growth * Marketing Efficiency
      const growth = plan.monthlyGrowth || 0;
      const churn = plan.monthlyChurn || 0;

      const planGrowth = growth * params.marketingEfficiency;
      
      // 2. Viral Growth (Global rate applied to current user base)
      const viralGrowth = params.viralRate; 
      
      const totalGrowthRate = (planGrowth + viralGrowth) / 100;
      const churnRate = churn / 100;
      
      const newUsers = plan.subscribers * totalGrowthRate;
      const churnedUsers = plan.subscribers * churnRate;
      const netSubsChange = newUsers - churnedUsers;
      
      const currentSubs = Math.max(0, plan.subscribers + netSubsChange);
      
      const priceMonthly = plan.interval === 'yearly' ? plan.price / 12 : plan.price;
      
      // Cash Flow: Annual plans pay upfront
      // Accrual Revenue: Recognized monthly
      
      monthlyRecurringRevenue += priceMonthly * currentSubs;
      monthlyOneTimeRevenue += newUsers * plan.setupFee;
      
      monthlyCogs += plan.unitCost * currentSubs;
      totalSubs += currentSubs;
      
      // Commission Base: New Annualized Revenue from New Users
      // (Simplified: We pay commission on the NET new users this month)
      if (plan.price > 0 && netSubsChange > 0) {
        newArrForCommissions += netSubsChange * (plan.interval === 'yearly' ? plan.price : plan.price * 12);
      }

      return { ...plan, subscribers: currentSubs };
    });

    monthlyRecurringRevenue += expansionRevenueAccumulated;
    const totalRevenue = monthlyRecurringRevenue + monthlyOneTimeRevenue;
    const grossProfit = totalRevenue - monthlyCogs;
    
    // Fixed costs (Payroll Inflation logic)
    // Apply salary growth every 12 months
    let payroll = baseFinancials.payrollMonthly;
    if (i > 12) payroll *= (1 + params.salaryGrowthRate/100);
    if (i > 24) payroll *= (1 + params.salaryGrowthRate/100);
    if (i > 36) payroll *= (1 + params.salaryGrowthRate/100);
    if (i > 48) payroll *= (1 + params.salaryGrowthRate/100);

    const opex = baseFinancials.opexMonthly;
    
    // Sales Commissions
    const commissions = Math.max(0, newArrForCommissions * (params.commissionRate / 100));

    // Cash Logic (simplified for Accrual view in table, but we track cash balance)
    const netIncome = grossProfit - payroll - opex - commissions;

    currentCash += netIncome;

    if (breakEvenMonth === null && netIncome > 0) {
      breakEvenMonth = i;
    }

    projections.push({
      month: i,
      revenue: totalRevenue,
      oneTimeRevenue: monthlyOneTimeRevenue,
      cogs: monthlyCogs,
      grossProfit,
      payroll,
      opex,
      netIncome,
      subscribers: Math.round(totalSubs),
      cashBalance: currentCash,
      commissions
    });
  }

  return { projections, breakEvenMonth };
};
