
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
    
    // Effective Growth = Plan Growth * Marketing Efficiency + Viral Rate
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
  
  // -- Expansion Revenue Logic (Snapshot) --
  const impliedExpansionArr = arr * (params.expansionRate / 100); 
  const impliedExpansionMrr = impliedExpansionArr / 12;
  
  // -- COGS on Expansion (Logical Fix) --
  // Assume Expansion Revenue carries the same Gross Margin profile as Base Revenue
  const baseCogsRatio = mrr > 0 ? totalCogs / mrr : 0;
  const expansionCogs = impliedExpansionMrr * baseCogsRatio;
  
  const finalTotalCogs = totalCogs + expansionCogs;

  // Gross Profit includes One-Time Revenue for P&L
  const totalRevenue = mrr + oneTimeRevenueMonthly + impliedExpansionMrr;
  const grossProfit = totalRevenue - finalTotalCogs; 
  const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) : 0;

  // Recurring Gross Margin (Strictly for LTV/Payback)
  // Isolates the margin of the subscription product itself
  const recurringGrossProfit = (mrr + impliedExpansionMrr) - finalTotalCogs;
  const recurringGrossMarginPercent = (mrr + impliedExpansionMrr) > 0 ? (recurringGrossProfit / (mrr + impliedExpansionMrr)) : 0;

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
  // Commission for CAC = New Logos Only
  const commissionsFromNewLogos = impliedNewArrMonthly * (params.commissionRate / 100);
  // Total Commission (P&L) = New Logos + Expansion
  const totalNewArrBase = impliedNewArrMonthly + impliedExpansionArr;
  const estimatedTotalCommissions = totalNewArrBase * (params.commissionRate / 100);

  // Add Expansion to Net New ARR for Efficiency Metrics
  const netNewArr = netNewArrReal + impliedExpansionArr;

  // 5. Totals
  const totalExpenses = finalTotalCogs + payrollMonthly + opexMonthly + estimatedTotalCommissions;
  const netMonthly = totalRevenue - totalExpenses;
  
  const profitMargin = totalRevenue > 0 ? (netMonthly / totalRevenue) * 100 : 0;
  
  const valuation = arr * params.valuationMultiple;
  const founderValue = valuation * (params.founderEquity / 100);

  // BURN CALCULATIONS
  const grossBurn = totalExpenses;
  const burnRate = netMonthly < 0 ? Math.abs(netMonthly) : 0; 
  const runwayMonths = burnRate > 0 ? params.startingCash / burnRate : (params.startingCash > 0 ? 999 : 0);

  // 6. SaaS Advanced Metrics
  const arpu = totalSubscribers > 0 ? mrr / totalSubscribers : 0;
  const arppu = payingSubscribers > 0 ? mrr / payingSubscribers : 0;
  const conversionRate = totalSubscribers > 0 ? payingSubscribers / totalSubscribers : 0;
  
  // CAC: Cost to Acquire / New PAYING Customers (Strict Definition)
  // Fully Loaded CAC = Marketing Spend + Sales Commissions on New Deals
  const totalCacSpend = acquisitionCosts + commissionsFromNewLogos;
  const cac = totalNewPayingSubscribers > 0.1 ? totalCacSpend / totalNewPayingSubscribers : (totalCacSpend > 0 ? 99999 : 0);

  // LTV: Use Paid Churn Only & Recurring Gross Margin
  const safePaidChurn = Math.max(0.5, paidChurnRate); 
  const ltv = safePaidChurn > 0 ? (arppu * recurringGrossMarginPercent) / (safePaidChurn / 100) : 0;

  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  
  // Rule of 40: Annualized REVENUE Growth + Profit Margin
  const monthlyRevenueGrowthRate = arr > 0 ? (netNewArr / 12) / (arr / 12) : 0;
  const annualizedRevenueGrowthRate = (Math.pow(1 + monthlyRevenueGrowthRate, 12) - 1) * 100;
  
  // Fallback if ARR is 0
  const finalGrowthRate = arr > 0 ? annualizedRevenueGrowthRate : (Math.pow(1 + (paidGrowthRate / 100), 12) - 1) * 100;
  
  const ruleOf40 = finalGrowthRate + profitMargin; 
  
  // NRR = 100 + Expansion - Churn
  const nrr = 100 + params.expansionRate - paidChurnRate;

  // 7. Efficiency Metrics
  
  // Setup Fees Allocation for Payback
  const weightedAvgSetupFee = totalNewPayingSubscribers > 0 ? 
    (oneTimeRevenueMonthly * (totalNewPayingSubscribers / (Math.max(1, totalSubscribers * (blendedGrowthRate/100))))) : 0; 
  
  // Adjusted CAC = CAC - Setup Fee
  const adjustedCac = Math.max(0, cac - weightedAvgSetupFee);
  
  // Payback Denominator: Gross Profit from RECURRING revenue only per user
  const monthlyRecurringGrossProfitPerUser = arppu * recurringGrossMarginPercent;
  
  let cacPaybackMonths = 0;
  if (monthlyRecurringGrossProfitPerUser > 0) {
      cacPaybackMonths = adjustedCac / monthlyRecurringGrossProfitPerUser;
  } else {
      cacPaybackMonths = 999;
  }

  // Magic Number = Net New ARR / Monthly Acquisition Spend
  // Correct Logic: Include Total Commissions (New + Expansion) in Cost if Net New ARR includes Expansion Revenue
  const monthlyAcquisitionTotal = acquisitionCosts + estimatedTotalCommissions;
  const magicNumber = monthlyAcquisitionTotal > 0 ? netNewArr / monthlyAcquisitionTotal : 0;

  // Burn Multiplier = Monthly Net Burn / Net New ARR
  let burnMultiplier = 0;
  if (burnRate > 0) {
      if (netNewArr > 0) {
          const monthlyBurn = burnRate;
          burnMultiplier = monthlyBurn / netNewArr;
      } else {
          burnMultiplier = 999;
      }
  } else {
      burnMultiplier = 0;
  }

  return {
    mrr,
    arr,
    oneTimeRevenueMonthly,
    cogs: finalTotalCogs, 
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
  
  // Calculate Base COGS Ratio for determining Expansion Costs
  const baseMrr = plans.reduce((sum, p) => sum + (p.interval === 'yearly' ? p.price/12 : p.price) * p.subscribers, 0);
  const baseCogs = plans.reduce((sum, p) => sum + p.unitCost * p.subscribers, 0);
  const baseCogsRatio = baseMrr > 0 ? baseCogs / baseMrr : 0;

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

       // 2. Churn Existing Expansion
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
      if (plan.price > 0 && newUsers > 0) {
        newArrForCommissions += newUsers * (plan.interval === 'yearly' ? plan.price : plan.price * 12);
      }

      return { ...plan, subscribers: currentSubs };
    });

    monthlyRecurringRevenue += expansionRevenueAccumulated;
    monthlyCashInflow += expansionRevenueAccumulated;
    
    // -- COGS Adjustment for Expansion Revenue --
    const expansionCogs = expansionRevenueAccumulated * baseCogsRatio;
    monthlyCogs += expansionCogs;

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
