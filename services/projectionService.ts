
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

  // Track New ARR for Commission Estimation & Efficiency Metrics
  let impliedNewArrMonthly = 0; // Just from new logos (for commissions)
  let netNewArrReal = 0; // Net change in ARR (New Logos - Churn + Expansion)

  plans.forEach(plan => {
    const isPaid = plan.price > 0;
    const priceMonthly = plan.interval === 'yearly' ? plan.price / 12 : plan.price;
    const planArrValue = plan.interval === 'yearly' ? plan.price : plan.price * 12;
    
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

    // Specific calculations per plan
    const newUsers = Math.max(0, plan.subscribers * (effectiveGrowthRate / 100));
    const churnedUsers = plan.subscribers * (effectiveChurnRate / 100);
    const netAddedUsers = newUsers - churnedUsers;

    if (isPaid) {
        // For Paid Growth Rate (User count based)
        weightedPaidGrowthSum += effectiveGrowthRate * plan.subscribers;
        weightedPaidChurnSum += effectiveChurnRate * plan.subscribers;
        totalNewPayingSubscribers += newUsers;
        
        // For Commission Estimation (Gross Adds)
        impliedNewArrMonthly += newUsers * planArrValue;

        // For Efficiency Metrics (Net New ARR - Dollar based)
        // This fixes the issue where low-price viral plans skew the growth % of high-price plans
        netNewArrReal += netAddedUsers * planArrValue;
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
  
  // FIXED: Gross Profit includes One-Time Revenue. 
  // Setup Fees are high margin (usually labor is in OpEx).
  const totalRevenue = mrr + oneTimeRevenueMonthly;
  const grossProfit = totalRevenue - totalCogs; 
  
  // FIXED: Margin % should divide by Total Revenue, not just MRR.
  const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) : 0;

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

  // 4. Commissions (Snapshot Estimation)
  // We include expansion revenue in commission base too
  const impliedExpansionArr = arr * (params.expansionRate / 100); // New Expansion ARR this month
  const totalNewArrBase = impliedNewArrMonthly + impliedExpansionArr;
  const estimatedCommissions = totalNewArrBase * (params.commissionRate / 100);

  // Add Expansion to Net New ARR (Expansion - Churn was already handled in plan loop, now adding Expansion)
  const netNewArr = netNewArrReal + impliedExpansionArr;

  // 5. Totals
  const totalExpenses = totalCogs + payrollMonthly + opexMonthly + estimatedCommissions;
  const netMonthly = totalRevenue - totalExpenses;
  
  // FIXED: Profit Margin uses Total Revenue denominator
  const profitMargin = totalRevenue > 0 ? (netMonthly / totalRevenue) * 100 : 0;
  
  const valuation = arr * params.valuationMultiple;
  const founderValue = valuation * (params.founderEquity / 100);

  // BURN CALCULATIONS (Explicitly Separated)
  const grossBurn = totalExpenses; // Monthly Cash Outflow (Now Includes Commissions)
  const burnRate = netMonthly < 0 ? Math.abs(netMonthly) : 0; // Net Cash Burn
  const runwayMonths = burnRate > 0 ? params.startingCash / burnRate : (params.startingCash > 0 ? 999 : 0);

  // 6. SaaS Advanced Metrics
  const arpu = totalSubscribers > 0 ? mrr / totalSubscribers : 0;
  const arppu = payingSubscribers > 0 ? mrr / payingSubscribers : 0;
  const conversionRate = totalSubscribers > 0 ? payingSubscribers / totalSubscribers : 0;
  
  // CAC: Cost to Acquire / New PAYING Customers (Strict Definition)
  const cac = totalNewPayingSubscribers > 0.1 ? acquisitionCosts / totalNewPayingSubscribers : (acquisitionCosts > 0 ? 99999 : 0);

  // LTV: Use Paid Churn Only
  const safePaidChurn = Math.max(0.5, paidChurnRate); 
  const ltv = safePaidChurn > 0 ? (arppu * grossMarginPercent) / (safePaidChurn / 100) : 0;

  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  
  // Rule of 40: Annualized REVENUE Growth + Profit Margin
  const monthlyRevenueGrowthRate = arr > 0 ? (netNewArr / 12) / (arr / 12) : 0; // Approximate monthly growth
  const annualizedRevenueGrowthRate = (Math.pow(1 + monthlyRevenueGrowthRate, 12) - 1) * 100;
  
  // Fallback: If ARR is 0, use paid growth rate
  const finalGrowthRate = arr > 0 ? annualizedRevenueGrowthRate : (Math.pow(1 + (paidGrowthRate / 100), 12) - 1) * 100;
  
  const ruleOf40 = finalGrowthRate + profitMargin; 
  
  // NRR = 100 + Expansion - Churn
  const nrr = 100 + params.expansionRate - paidChurnRate;

  // 7. Efficiency Metrics
  
  // Setup Fees Allocation
  const weightedAvgSetupFee = totalNewPayingSubscribers > 0 ? oneTimeRevenueMonthly / totalNewPayingSubscribers : 0;
  
  // Adjusted CAC = CAC - Setup Fee
  const adjustedCac = Math.max(0, cac - weightedAvgSetupFee);
  
  // Payback Denominator: Gross Profit from RECURRING revenue only per user
  const monthlyRecurringGrossProfitPerUser = arppu * grossMarginPercent;
  
  // Fix: If Margin is <= 0, Payback is Infinite (999), not 0 (Instant)
  let cacPaybackMonths = 0;
  if (monthlyRecurringGrossProfitPerUser > 0) {
      cacPaybackMonths = adjustedCac / monthlyRecurringGrossProfitPerUser;
  } else {
      // If we lose money per user, we never pay back. 
      // Return 999 as sentinel for "Never"
      cacPaybackMonths = 999;
  }

  // Magic Number = Annualized Net New ARR / Monthly Marketing Spend
  // Metric > 1.0 means you make more recurring revenue in a year than you spent to get it.
  const monthlyMarketing = acquisitionCosts;
  const magicNumber = monthlyMarketing > 0 ? netNewArr / monthlyMarketing : 0;

  // Burn Multiplier = Monthly Net Burn / Annualized Net New ARR
  // Wait, standard is Monthly Net Burn / Monthly Net New ARR? 
  // No, usually Net Burn / Net New ARR. 
  // Let's use Monthly Net Burn / Net New ARR (Annualized value added this month).
  // This tells us: "How much cash did I burn this month to generate $X of annual value?"
  // If I burn $200k to add $100k of ARR, my multiplier is 2.0x.
  let burnMultiplier = 0;
  if (burnRate > 0) {
      if (netNewArr > 0) {
          const monthlyBurn = burnRate;
          burnMultiplier = monthlyBurn / netNewArr;
      } else {
          // Burning cash + Zero/Neg Growth = Disaster
          burnMultiplier = 999;
      }
  } else {
      // Profitable (No burn) = 0 (Excellent)
      burnMultiplier = 0;
  }

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
    grossBurn,
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
       
       // 1. Add New Expansion Revenue (Monthly % of previous MRR)
       const newExpansion = prevRevenue * (params.expansionRate / 100);
       expansionRevenueAccumulated += newExpansion;

       // 2. Churn Existing Expansion (CRITICAL FIX)
       expansionRevenueAccumulated *= (1 - (baseFinancials.paidChurnRate / 100));

       // Expansion counts as New ARR for commissions
       newArrForCommissions += newExpansion * 12;
       
       monthlyCashInflow += newExpansion;
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
      monthlyCashInflow += newUsers * plan.setupFee;

      if (plan.interval === 'yearly') {
        // Annual Plans:
        monthlyCashInflow += newUsers * plan.price;
        const existingUsers = Math.max(0, plan.subscribers - churnedUsers); 
        monthlyCashInflow += (existingUsers / 12) * plan.price;
      } else {
        monthlyCashInflow += currentSubs * plan.price;
      }

      // Commission Base (Gross New Annualized Bookings)
      // Salespeople get paid for closing deals (newUsers), not Net Growth.
      if (plan.price > 0 && newUsers > 0) {
        newArrForCommissions += newUsers * (plan.interval === 'yearly' ? plan.price : plan.price * 12);
      }

      return { ...plan, subscribers: currentSubs };
    });

    monthlyRecurringRevenue += expansionRevenueAccumulated;
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
