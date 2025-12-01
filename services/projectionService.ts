
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

  // Track weighted averages for blended metrics (All Users)
  let weightedGrowthSum = 0;
  let weightedChurnSum = 0;

  // Track weighted averages for Paying Users Only (For LTV/CAC)
  let weightedPaidGrowthSum = 0;
  let weightedPaidChurnSum = 0;
  let totalNewPayingSubscribers = 0;

  plans.forEach(plan => {
    const isPaid = plan.price > 0;
    const priceMonthly = plan.interval === 'yearly' ? plan.price / 12 : plan.price;
    
    // Revenue only from paid plans
    if (isPaid) {
      mrr += priceMonthly * plan.subscribers;
      payingSubscribers += plan.subscribers;
    }
    
    // Growth Logic for Snapshot
    const growth = plan.monthlyGrowth || 0;
    const churn = plan.monthlyChurn || 0;
    
    // Effective Growth = Plan Growth * Marketing Multiplier + Viral Rate
    const effectiveGrowthRate = (growth * params.marketingEfficiency) + params.viralRate;
    const effectiveChurnRate = churn;

    // Weighting for All Users
    weightedGrowthSum += effectiveGrowthRate * plan.subscribers;
    weightedChurnSum += effectiveChurnRate * plan.subscribers;

    // Weighting for Paying Users Only
    const newUsers = Math.max(0, plan.subscribers * (effectiveGrowthRate / 100));
    
    if (isPaid) {
        weightedPaidGrowthSum += effectiveGrowthRate * plan.subscribers;
        weightedPaidChurnSum += effectiveChurnRate * plan.subscribers;
        totalNewPayingSubscribers += newUsers;
    }

    // One-time revenue applies to all new users who have a setup fee
    oneTimeRevenueMonthly += newUsers * plan.setupFee;

    // Costs apply to ALL plans (Free + Paid)
    totalCogs += plan.unitCost * plan.subscribers;
    totalSubscribers += plan.subscribers;
  });

  // Calculate Blended Rates (All Users)
  const blendedGrowthRate = totalSubscribers > 0 ? weightedGrowthSum / totalSubscribers : 0;
  const blendedChurnRate = totalSubscribers > 0 ? weightedChurnSum / totalSubscribers : 0;

  // Calculate Paid-Only Rates (For Unit Economics)
  const paidGrowthRate = payingSubscribers > 0 ? weightedPaidGrowthSum / payingSubscribers : 0;
  const paidChurnRate = payingSubscribers > 0 ? weightedPaidChurnSum / payingSubscribers : 0;

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
  
  // CAC: Cost to Acquire / New PAYING Customers (Strict Definition)
  // If we have 0 new paying users, but we spent money, CAC is effectively infinite (or maxed).
  // We use a safe floor to avoid Infinity.
  const cac = totalNewPayingSubscribers > 0.1 ? acquisitionCosts / totalNewPayingSubscribers : (acquisitionCosts > 0 ? 99999 : 0);

  // LTV: Use Paid Churn Only
  // Free users churning shouldn't hurt the LTV of a paid enterprise customer.
  const safePaidChurn = Math.max(0.5, paidChurnRate); 
  const ltv = safePaidChurn > 0 ? (arppu * grossMarginPercent) / (safePaidChurn / 100) : 0;

  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  
  // Rule of 40: Annualized Growth + Profit Margin
  // FIX: Previously used monthly growth (e.g. 5%), which fails Rule of 40. 
  // Should use Annualized Growth Rate (e.g. 80%).
  const annualizedGrowthRate = (Math.pow(1 + (blendedGrowthRate / 100), 12) - 1) * 100;
  const ruleOf40 = annualizedGrowthRate + profitMargin; 
  
  // NRR = 100 + Expansion - Churn (Paid Churn only? Usually NRR is on revenue, so Paid Churn is correct)
  const nrr = 100 + params.expansionRate - paidChurnRate;

  // 6. Efficiency Metrics
  const weightedSetupFee = totalNewPayingSubscribers > 0 ? 
    (oneTimeRevenueMonthly * (totalNewPayingSubscribers / (Math.max(1, totalSubscribers * (blendedGrowthRate/100))))) : 0; 
  // Simplified Setup Fee allocation: assume setup fees roughly align with paying user mix.
  
  const grossProfitPerPayingUser = (arppu * grossMarginPercent) + (oneTimeRevenueMonthly / Math.max(1, totalNewPayingSubscribers));
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
    blendedChurnRate,
    paidGrowthRate,
    paidChurnRate
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
    let monthlyRecurringRevenue = 0; // Accrual
    let monthlyCashInflow = 0; // Actual Cash
    let monthlyOneTimeRevenue = 0;
    let monthlyCogs = 0;
    let totalSubs = 0;
    let newArrForCommissions = 0;

    if (i > 1) {
       const prevRevenue = projections[i-2].revenue - projections[i-2].oneTimeRevenue; 
       expansionRevenueAccumulated += prevRevenue * (params.expansionRate / 100);
       // Expansion counts as New ARR for commissions
       newArrForCommissions += prevRevenue * (params.expansionRate / 100) * 12;
       // Expansion is usually recognized monthly, cash matches revenue for expansion
       monthlyCashInflow += prevRevenue * (params.expansionRate / 100);
    }

    currentSubscribersByPlan = currentSubscribersByPlan.map(plan => {
      // PROJECTION LOGIC:
      const growth = plan.monthlyGrowth || 0;
      const churn = plan.monthlyChurn || 0;

      const planGrowth = growth * params.marketingEfficiency;
      const viralGrowth = params.viralRate; 
      
      const totalGrowthRate = (planGrowth + viralGrowth) / 100;
      const churnRate = churn / 100;
      
      const newUsers = plan.subscribers * totalGrowthRate;
      const churnedUsers = plan.subscribers * churnRate;
      const netSubsChange = newUsers - churnedUsers;
      
      const currentSubs = Math.max(0, plan.subscribers + netSubsChange);
      
      // -- REVENUE (Accrual) --
      const priceMonthly = plan.interval === 'yearly' ? plan.price / 12 : plan.price;
      monthlyRecurringRevenue += priceMonthly * currentSubs;
      monthlyOneTimeRevenue += newUsers * plan.setupFee;
      monthlyCogs += plan.unitCost * currentSubs;
      totalSubs += currentSubs;
      
      // -- CASH FLOW (Bank) --
      // Setup fees are cash upfront
      monthlyCashInflow += newUsers * plan.setupFee;

      if (plan.interval === 'yearly') {
        // Annual Plans:
        // 1. New Users pay 100% Upfront
        monthlyCashInflow += newUsers * plan.price;
        
        // 2. Existing Users (Renewals)
        // Assumption: Renewals are spread evenly over the year.
        const existingUsers = Math.max(0, plan.subscribers - churnedUsers); 
        monthlyCashInflow += (existingUsers / 12) * plan.price;

      } else {
        // Monthly Plans: Cash = Revenue
        monthlyCashInflow += currentSubs * plan.price;
      }

      // Commission Base (New Annualized Bookings)
      if (plan.price > 0 && netSubsChange > 0) {
        newArrForCommissions += netSubsChange * (plan.interval === 'yearly' ? plan.price : plan.price * 12);
      }

      return { ...plan, subscribers: currentSubs };
    });

    monthlyRecurringRevenue += expansionRevenueAccumulated;
    // Add expansion revenue to cash (assuming monthly billing for expansion)
    monthlyCashInflow += expansionRevenueAccumulated;

    const totalRevenue = monthlyRecurringRevenue + monthlyOneTimeRevenue;
    const grossProfit = totalRevenue - monthlyCogs;
    
    // Fixed costs (Payroll Inflation logic)
    let payroll = baseFinancials.payrollMonthly;
    if (i > 12) payroll *= (1 + params.salaryGrowthRate/100);
    if (i > 24) payroll *= (1 + params.salaryGrowthRate/100);
    if (i > 36) payroll *= (1 + params.salaryGrowthRate/100);
    if (i > 48) payroll *= (1 + params.salaryGrowthRate/100);

    const opex = baseFinancials.opexMonthly;
    
    // Sales Commissions (Cash Out)
    const commissions = Math.max(0, newArrForCommissions * (params.commissionRate / 100));

    // Net Income (Accrual P&L)
    const netIncome = grossProfit - payroll - opex - commissions;

    // Net Cash Flow (Bank P&L)
    // Commissions are paid cash immediately
    const cashOutflow = monthlyCogs + payroll + opex + commissions;
    const netCashFlow = monthlyCashInflow - cashOutflow;

    currentCash += netCashFlow;

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
      cashFlow: netCashFlow,
      commissions
    });
  }

  return { projections, breakEvenMonth };
};
