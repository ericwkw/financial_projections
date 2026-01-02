
import { Plan, Employee, OperatingExpense, ScenarioParams, Financials, MonthlyProjection, Cohort, CohortMetric } from "../types";

export const calculateFinancials = (
  plans: Plan[],
  employees: Employee[],
  expenses: OperatingExpense[],
  params: ScenarioParams
): Financials => {
  // 1. Current MRR, COGS (Variable), Subscriber Count
  let mrr = 0;
  let totalUnitCosts = 0; // Total Variable Costs (All users)
  let recurringUnitCosts = 0; // Variable Costs for Recurring Users ONLY
  
  let totalSubscribers = 0;
  let payingSubscribers = 0; // All who paid at least once
  let recurringSubscribers = 0; // Only those on monthly/yearly plans
  
  let oneTimeRevenueMonthly = 0;

  // Track weighted averages for blended metrics (All Users)
  let weightedGrowthSum = 0;
  let weightedChurnSum = 0;

  // Track weighted averages for Recurring SaaS Users Only
  let weightedRecurringGrowthSum = 0;
  let weightedRecurringChurnSum = 0;

  // Track weighted averages for Paying Users Only (For CAC)
  let totalNewPayingSubscribers = 0;
  let paidOneTimeRevenue = 0; // For Cash Flow Payback
  let paidOneTimeRevenueAccrual = 0; // For LTV/Revenue (Setup Fees + Lifetime, NO Annual)

  // Track New ARR for Commission Estimation & Efficiency Metrics
  let impliedNewArrMonthly = 0; 
  let netNewArrReal = 0; 
  
  // Track New Recurring Revenue & Costs from Growth (Snapshot Consistency)
  let newMrrFromGrowth = 0;
  let newUnitCostsFromGrowth = 0;

  // Track Churned Revenue & Costs (Snapshot Consistency)
  let churnedMrr = 0;
  let churnedUnitCosts = 0;

  // -- CASH FLOW TRACKING --
  let cashInflowFromNewUsers = 0;
  let cashInflowFromRenewals = 0;

  // -- LTV WEIGHTING ACCUMULATORS --
  let weightedLtvSum = 0;

  plans.forEach(plan => {
    const isPaid = plan.price > 0;
    const isRecurring = plan.interval === 'monthly' || plan.interval === 'yearly';
    
    // Determine Monthly Revenue (Accrual)
    let priceMonthly = 0;
    let planArrValue = 0;

    if (plan.interval === 'monthly') {
        priceMonthly = plan.price;
        planArrValue = plan.price * 12;
    } else if (plan.interval === 'yearly') {
        priceMonthly = plan.price / 12;
        planArrValue = plan.price;
    } else if (plan.interval === 'lifetime') {
        // Lifetime plans have 0 monthly recurring price
        priceMonthly = 0;
        planArrValue = 0; 
    }
    
    // Revenue only from paid plans
    if (isPaid) {
      mrr += priceMonthly * plan.subscribers;
      payingSubscribers += plan.subscribers;
      
      if (isRecurring) {
          recurringSubscribers += plan.subscribers;
          recurringUnitCosts += plan.unitCost * plan.subscribers;
      }
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
    const existingUsers = Math.max(0, plan.subscribers - churnedUsers);
    const netAddedUsers = newUsers - churnedUsers;

    // Calculate New Recurring Revenue/Cost from New Users (for P&L Consistency)
    if (isPaid) {
        newMrrFromGrowth += newUsers * priceMonthly;
        churnedMrr += churnedUsers * priceMonthly;
    }
    newUnitCostsFromGrowth += newUsers * plan.unitCost;
    churnedUnitCosts += churnedUsers * plan.unitCost;

    if (isPaid) {
        totalNewPayingSubscribers += newUsers;
        
        if (isRecurring) {
             weightedRecurringGrowthSum += effectiveGrowthRate * plan.subscribers;
             weightedRecurringChurnSum += effectiveChurnRate * plan.subscribers;
        }

        // For Cash Flow Payback Offset (Strict Paid Cohort)
        let upfrontCashRevenue = plan.setupFee || 0;
        if (plan.interval === 'lifetime') upfrontCashRevenue += plan.price;
        if (plan.interval === 'yearly') upfrontCashRevenue += plan.price;
        
        paidOneTimeRevenue += newUsers * upfrontCashRevenue;

        // For Accrual/LTV One-Time Revenue (Setup + Lifetime only)
        let accrualOneTime = plan.setupFee || 0;
        if (plan.interval === 'lifetime') accrualOneTime += plan.price;
        paidOneTimeRevenueAccrual += newUsers * accrualOneTime;

        // For Commission Estimation (Gross Adds)
        const dealValue = plan.interval === 'lifetime' ? plan.price : planArrValue;
        impliedNewArrMonthly += newUsers * dealValue; 

        // For Efficiency Metrics (Net New ARR - Dollar based)
        netNewArrReal += netAddedUsers * planArrValue;

        // --- CFO LTV CALCULATION PER PLAN ---
        let planLtv = 0;
        const marginFactor = 1 - (params.paymentProcessingRate / 100);
        const safeChurn = Math.max(params.minChurnFloor, churn); 

        if (plan.interval === 'lifetime') {
            // Lifetime LTV = (Upfront Price - Fees) - (Monthly Cost / Activity Churn%)
            // This subtracts the liability of hosting them forever.
            const upfrontProfit = (plan.price + plan.setupFee) * marginFactor;
            const lifetimeLiability = safeChurn > 0 ? plan.unitCost / (safeChurn / 100) : 0;
            planLtv = upfrontProfit - lifetimeLiability;
        } else {
            // SaaS LTV = SetupProfit + (MonthlyRecurringProfit / Churn%)
            const setupProfit = plan.setupFee * marginFactor;
            
            // Monthly Recurring Profit = (Price/mo * (1-Fees)) - UnitCost
            const monthlyRecurringProfit = (priceMonthly * marginFactor) - plan.unitCost;
            
            const recurringLtvTerm = safeChurn > 0 ? monthlyRecurringProfit / (safeChurn / 100) : 0;
            planLtv = setupProfit + recurringLtvTerm;
        }

        weightedLtvSum += planLtv * newUsers;
    }

    // -- ACCRUAL ONE-TIME REVENUE --
    const accrualOneTimePerUser = plan.setupFee + (plan.interval === 'lifetime' ? plan.price : 0);
    oneTimeRevenueMonthly += newUsers * accrualOneTimePerUser;

    // -- CASH FLOW CALCULATION --
    // 1. Cash from New Users (Upfront)
    let upfrontCashPerUser = plan.setupFee;
    if (plan.interval === 'monthly') upfrontCashPerUser += plan.price;
    else if (plan.interval === 'yearly') upfrontCashPerUser += plan.price;
    else if (plan.interval === 'lifetime') upfrontCashPerUser += plan.price;

    cashInflowFromNewUsers += newUsers * upfrontCashPerUser;

    // 2. Cash from Existing Users (Renewals)
    let renewalCashPerUser = 0;
    if (plan.interval === 'monthly') renewalCashPerUser = plan.price;
    else if (plan.interval === 'yearly') renewalCashPerUser = plan.price / 12; 
    
    cashInflowFromRenewals += existingUsers * renewalCashPerUser;

    // Unit Costs apply to ALL plans
    totalUnitCosts += plan.unitCost * plan.subscribers;
    totalSubscribers += plan.subscribers;
  });

  // Calculate Blended Rates (All Users)
  const blendedGrowthRate = totalSubscribers > 0 ? weightedGrowthSum / totalSubscribers : 0;
  const blendedChurnRate = totalSubscribers > 0 ? weightedChurnSum / totalSubscribers : 0;

  // Calculate SaaS-Only Rates
  const recurringGrowthRate = recurringSubscribers > 0 ? weightedRecurringGrowthSum / recurringSubscribers : 0;
  const recurringChurnRate = recurringSubscribers > 0 ? weightedRecurringChurnSum / recurringSubscribers : 0;

  // Fallback for dashboard display
  const paidChurnRate = recurringChurnRate; 
  const paidGrowthRate = recurringGrowthRate;

  const arr = mrr * 12;
  
  // -- Expansion Revenue Logic (Snapshot) --
  const impliedExpansionArr = arr * (params.expansionRate / 100); 
  const impliedExpansionMrr = impliedExpansionArr / 12;
  
  // -- COGS on Expansion --
  // Use recurringUnitCosts to exclude Lifetime users from the margin proxy
  const baseUnitCostRatio = mrr > 0 ? recurringUnitCosts / mrr : 0;
  const expansionUnitCost = impliedExpansionMrr * baseUnitCostRatio;
  
  // ==========================================
  // ACCRUAL P&L (Net Income)
  // ==========================================
  
  const totalAccrualRevenue = mrr - churnedMrr + newMrrFromGrowth + oneTimeRevenueMonthly + impliedExpansionMrr;

  const accrualPaymentFees = totalAccrualRevenue * (params.paymentProcessingRate / 100);
  const accrualCogs = totalUnitCosts - churnedUnitCosts + newUnitCostsFromGrowth + expansionUnitCost + accrualPaymentFees;

  // Payroll & OpEx
  let annualBaseSalary = 0;
  employees.forEach(emp => {
    annualBaseSalary += emp.salary * emp.count;
  });
  const payrollMonthly = (annualBaseSalary * (1 + params.payrollTax / 100)) / 12;

  const opexMonthly = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const acquisitionCosts = expenses
    .filter(e => e.isAcquisition)
    .reduce((acc, exp) => acc + exp.amount, 0);

  // Commissions
  const commissionsFromNewLogos = impliedNewArrMonthly * (params.commissionRate / 100);
  const totalNewArrBase = impliedNewArrMonthly + impliedExpansionArr;
  const estimatedTotalCommissions = totalNewArrBase * (params.commissionRate / 100);

  const netNewArr = netNewArrReal + impliedExpansionArr;

  const totalAccrualExpenses = accrualCogs + payrollMonthly + opexMonthly + estimatedTotalCommissions;
  const netMonthly = totalAccrualRevenue - totalAccrualExpenses;
  const profitMargin = totalAccrualRevenue > 0 ? (netMonthly / totalAccrualRevenue) * 100 : 0;

  // ==========================================
  // CASH FLOW (Burn Rate & Runway)
  // ==========================================
  
  const totalCashInflow = cashInflowFromNewUsers + cashInflowFromRenewals + impliedExpansionMrr;
  const cashPaymentFees = totalCashInflow * (params.paymentProcessingRate / 100);
  const netUnitCosts = totalUnitCosts - churnedUnitCosts + newUnitCostsFromGrowth + expansionUnitCost;
  const totalCashExpenses = netUnitCosts + cashPaymentFees + payrollMonthly + opexMonthly + estimatedTotalCommissions;
  const netCashFlow = totalCashInflow - totalCashExpenses;
  const grossBurn = totalCashExpenses;
  const burnRate = netCashFlow < 0 ? Math.abs(netCashFlow) : 0; 
  const runwayMonths = burnRate > 0 ? params.startingCash / burnRate : (params.startingCash > 0 ? 999 : 0);

  // ==========================================
  // METRICS
  // ==========================================
  
  const valuation = arr * params.valuationMultiple;
  const founderValue = valuation * (params.founderEquity / 100);

  const grossProfit = totalAccrualRevenue - accrualCogs; 
  const grossMarginPercent = totalAccrualRevenue > 0 ? (grossProfit / totalAccrualRevenue) : 0;

  // Recurring Gross Margin (Strictly for LTV)
  const recurringPaymentFees = (mrr + impliedExpansionMrr) * (params.paymentProcessingRate / 100);
  const recurringCogs = (recurringUnitCosts + expansionUnitCost) + recurringPaymentFees;

  const recurringGrossProfit = (mrr + impliedExpansionMrr) - recurringCogs;
  const recurringGrossMarginPercent = (mrr + impliedExpansionMrr) > 0 ? (recurringGrossProfit / (mrr + impliedExpansionMrr)) : 0;

  const arpu = totalSubscribers > 0 ? mrr / totalSubscribers : 0;
  
  // SaaS-only ARPPU (Recurring Revenue / Recurring Subs)
  const recurringArppu = recurringSubscribers > 0 ? mrr / recurringSubscribers : 0;
  
  // General ARPPU for display (includes all paying)
  const arppu = payingSubscribers > 0 ? mrr / payingSubscribers : 0;
  
  const conversionRate = totalSubscribers > 0 ? payingSubscribers / totalSubscribers : 0;
  
  // CAC: Cost to Acquire / New PAYING Customers
  const totalCacSpend = acquisitionCosts + commissionsFromNewLogos;
  const cac = totalNewPayingSubscribers > 0.1 ? totalCacSpend / totalNewPayingSubscribers : (totalCacSpend > 0 ? 99999 : 0);

  // LTV: Weighted Average based on New User Mix
  const ltv = totalNewPayingSubscribers > 0 ? weightedLtvSum / totalNewPayingSubscribers : 0;

  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  
  const monthlyRevenueGrowthRate = arr > 0 ? (netNewArr / 12) / (arr / 12) : 0;
  const annualizedRevenueGrowthRate = (Math.pow(1 + monthlyRevenueGrowthRate, 12) - 1) * 100;
  const finalGrowthRate = arr > 0 ? annualizedRevenueGrowthRate : 0; 
  const ruleOf40 = finalGrowthRate + profitMargin; 
  
  // NRR = Annualized Net Revenue Retention
  const monthlyNetRetention = 1 + (params.expansionRate - recurringChurnRate) / 100;
  const nrr = Math.pow(monthlyNetRetention, 12) * 100;

  // Payback
  const weightedAvgSetupFee = totalNewPayingSubscribers > 0 ? (paidOneTimeRevenue / totalNewPayingSubscribers) : 0;
  const adjustedCac = Math.max(0, cac - weightedAvgSetupFee);
  
  // Payback Denominator: Uses Recurring ARPPU (SaaS only)
  const monthlyRecurringGrossProfitPerUser = recurringArppu * recurringGrossMarginPercent;
  
  let cacPaybackMonths = 0;
  if (monthlyRecurringGrossProfitPerUser > 0) {
      cacPaybackMonths = adjustedCac / monthlyRecurringGrossProfitPerUser;
  } else {
      if (adjustedCac === 0 && totalNewPayingSubscribers > 0) {
          cacPaybackMonths = 0;
      } else {
          cacPaybackMonths = 999;
      }
  }

  // Blended Recurring Profit (For Cohorts)
  // This calculates the true recurring profit drag from ALL users (SaaS + LTD)
  // Formula: (SaaS Revenue - All Variable Costs) / All Paying Users
  // Note: 'mrr' is purely SaaS revenue. 'totalUnitCosts' includes LTD server costs.
  const blendedRecurringProfitPerUser = payingSubscribers > 0 
    ? (mrr - totalUnitCosts - (mrr * params.paymentProcessingRate / 100)) / payingSubscribers
    : 0;

  const monthlyAcquisitionTotal = acquisitionCosts + estimatedTotalCommissions;
  const magicNumber = monthlyAcquisitionTotal > 0 ? netNewArr / monthlyAcquisitionTotal : 0;

  let burnMultiplier = 0;
  if (burnRate > 0) {
      if (netNewArr > 0) {
          burnMultiplier = burnRate / netNewArr;
      } else {
          burnMultiplier = 999;
      }
  } else {
      burnMultiplier = 0;
  }

  // Weighted Avg One-Time Revenue (For Display)
  const weightedAvgOneTimeRevenue = totalNewPayingSubscribers > 0 ? (paidOneTimeRevenueAccrual / totalNewPayingSubscribers) : 0;

  return {
    mrr,
    arr,
    oneTimeRevenueMonthly,
    cogs: accrualCogs, 
    grossProfit,
    grossMarginPercent,
    recurringGrossMarginPercent,
    weightedAvgOneTimeRevenue,
    payrollMonthly,
    opexMonthly,
    commissions: estimatedTotalCommissions,
    totalExpenses: totalAccrualExpenses,
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
    paidChurnRate,
    blendedRecurringProfitPerUser // New Metric
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
  
  // Tracking for Yearly Plan Cash Flow Cohorts
  const newUsersCohortHistory: Record<string, number[]> = {};
  
  // Tracking Base Subscribers separately
  const baseSubscribersByPlan: Record<string, number> = {};
  
  plans.forEach(p => {
      newUsersCohortHistory[p.id] = [];
      baseSubscribersByPlan[p.id] = p.subscribers;
  });

  let expansionRevenueAccumulated = 0; 
  
  // Calculate Base Unit Cost Ratio for Expansion Proxy
  const baseMrr = plans.reduce((sum, p) => sum + (p.interval === 'yearly' ? p.price/12 : (p.interval === 'lifetime' ? 0 : p.price)) * p.subscribers, 0);
  
  const baseRecurringUnitCosts = plans.reduce((sum, p) => {
      if ((p.interval === 'monthly' || p.interval === 'yearly') && p.price > 0) {
          return sum + (p.unitCost * p.subscribers);
      }
      return sum;
  }, 0);
  
  const baseUnitCostRatio = baseMrr > 0 ? baseRecurringUnitCosts / baseMrr : 0;

  for (let i = 1; i <= months; i++) {
    let monthlyRecurringRevenue = 0; // Accrual
    let monthlyCashInflow = 0; // Actual Cash
    let monthlyOneTimeRevenue = 0;
    let monthlyUnitCosts = 0; 
    let totalSubs = 0;
    let monthlyNewPayingSubscribers = 0; 
    let newArrForCommissions = 0; 
    let newDealValueForCommissions = 0; 

    if (i > 1) {
       const prevRevenue = projections[i-2].revenue - projections[i-2].oneTimeRevenue; 
       
       // 1. Add New Expansion Revenue
       const newExpansion = prevRevenue * (params.expansionRate / 100);
       expansionRevenueAccumulated += newExpansion;

       // 2. Churn Existing Expansion (Use PaidChurn which is now SaaS-Specific)
       expansionRevenueAccumulated *= (1 - (baseFinancials.paidChurnRate / 100));

       newArrForCommissions += newExpansion * 12;
       
       monthlyCashInflow += newExpansion;
    }

    currentSubscribersByPlan = currentSubscribersByPlan.map(plan => {
      // ----------------------------
      // 1. GROWTH & CHURN LOGIC
      // ----------------------------
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

      newUsersCohortHistory[plan.id][i] = newUsers;
      
      baseSubscribersByPlan[plan.id] = Math.max(0, baseSubscribersByPlan[plan.id] * (1 - churnRate));

      // ----------------------------
      // 2. REVENUE (ACCRUAL)
      // ----------------------------
      let priceMonthly = 0;
      if (plan.interval === 'monthly') priceMonthly = plan.price;
      if (plan.interval === 'yearly') priceMonthly = plan.price / 12;
      // Lifetime = 0 Recurring Revenue

      monthlyRecurringRevenue += priceMonthly * currentSubs;
      
      monthlyOneTimeRevenue += newUsers * plan.setupFee;
      if (plan.interval === 'lifetime') {
          monthlyOneTimeRevenue += newUsers * plan.price;
      }

      // -- COGS INFLATION LOGIC --
      let inflationMultiplier = 1;
      if (i > 12) inflationMultiplier *= (1 + params.opexInflationRate/100);
      if (i > 24) inflationMultiplier *= (1 + params.opexInflationRate/100);
      if (i > 36) inflationMultiplier *= (1 + params.opexInflationRate/100);
      if (i > 48) inflationMultiplier *= (1 + params.opexInflationRate/100);

      monthlyUnitCosts += (plan.unitCost * inflationMultiplier) * currentSubs;
      totalSubs += currentSubs;
      
      // ----------------------------
      // 3. CASH FLOW (BANK)
      // ----------------------------
      monthlyCashInflow += newUsers * plan.setupFee; 

      if (plan.interval === 'yearly') {
        const baseRenewals = baseSubscribersByPlan[plan.id] / 12;
        monthlyCashInflow += baseRenewals * plan.price;

        monthlyCashInflow += newUsers * plan.price;

        const renewalMonthIndex = i - 12;
        if (renewalMonthIndex >= 1) {
            const usersJoinedThen = newUsersCohortHistory[plan.id][renewalMonthIndex] || 0;
            const retainedUsers = usersJoinedThen * Math.pow(1 - churnRate, 12);
            monthlyCashInflow += retainedUsers * plan.price;
        }

      } else if (plan.interval === 'lifetime') {
        monthlyCashInflow += newUsers * plan.price;
      } else {
        monthlyCashInflow += currentSubs * plan.price;
      }

      // ----------------------------
      // 4. COMMISSIONS
      // ----------------------------
      if (plan.price > 0 && newUsers > 0) {
        monthlyNewPayingSubscribers += newUsers;
        
        if (plan.interval === 'lifetime') {
            newDealValueForCommissions += newUsers * plan.price;
        } else {
            const arrValue = plan.interval === 'yearly' ? plan.price : plan.price * 12;
            newArrForCommissions += newUsers * arrValue;
        }
      }

      return { ...plan, subscribers: currentSubs };
    });

    monthlyRecurringRevenue += expansionRevenueAccumulated;
    monthlyCashInflow += expansionRevenueAccumulated;
    
    // -- Unit Cost Adjustment for Expansion Revenue --
    const expansionUnitCosts = expansionRevenueAccumulated * baseUnitCostRatio;
    let inflationMultiplier = 1;
    if (i > 12) inflationMultiplier *= (1 + params.opexInflationRate/100);
    if (i > 24) inflationMultiplier *= (1 + params.opexInflationRate/100);
    if (i > 36) inflationMultiplier *= (1 + params.opexInflationRate/100);
    if (i > 48) inflationMultiplier *= (1 + params.opexInflationRate/100);
    
    monthlyUnitCosts += (expansionUnitCosts * inflationMultiplier);

    const totalRevenue = monthlyRecurringRevenue + monthlyOneTimeRevenue;

    // -- DYNAMIC PAYMENT FEES --
    const paymentFees = totalRevenue * (params.paymentProcessingRate / 100);
    const monthlyCogs = monthlyUnitCosts + paymentFees;

    const grossProfit = totalRevenue - monthlyCogs;
    
    // Fixed costs (Payroll Inflation)
    let payroll = baseFinancials.payrollMonthly;
    if (i > 12) payroll *= (1 + params.salaryGrowthRate/100);
    if (i > 24) payroll *= (1 + params.salaryGrowthRate/100);
    if (i > 36) payroll *= (1 + params.salaryGrowthRate/100);
    if (i > 48) payroll *= (1 + params.salaryGrowthRate/100);

    // Fixed costs (OpEx Inflation)
    let opex = baseFinancials.opexMonthly;
    if (i > 12) opex *= (1 + params.opexInflationRate/100);
    if (i > 24) opex *= (1 + params.opexInflationRate/100);
    if (i > 36) opex *= (1 + params.opexInflationRate/100);
    if (i > 48) opex *= (1 + params.opexInflationRate/100);
    
    // Sales Commissions (Cash Out)
    const commissionsArr = Math.max(0, newArrForCommissions * (params.commissionRate / 100));
    const commissionsLtd = Math.max(0, newDealValueForCommissions * (params.commissionRate / 100));
    const totalCommissions = commissionsArr + commissionsLtd;

    // Net Income (Accrual P&L)
    const netIncome = grossProfit - payroll - opex - totalCommissions;

    // Net Cash Flow (Bank P&L)
    const cashFlowFees = monthlyCashInflow * (params.paymentProcessingRate / 100);
    const cashOutflow = monthlyUnitCosts + cashFlowFees + payroll + opex + totalCommissions;
    
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
      newPayingSubscribers: monthlyNewPayingSubscribers,
      cashBalance: currentCash,
      cashFlow: netCashFlow,
      commissions: totalCommissions
    });
  }

  return { projections, breakEvenMonth };
};

export const generateCohortData = (
  projections: MonthlyProjection[],
  financials: Financials,
  paymentProcessingRate: number
): Cohort[] => {
  const cohorts: Cohort[] = [];
  const MAX_COHORT_MONTHS = 12; // Rows to display
  const MAX_LIFETIME_MONTHS = 12; // Columns to display (M0..M12)

  const acquisitionMonths = projections.slice(0, MAX_COHORT_MONTHS);

  acquisitionMonths.forEach((proj) => {
    const cohortSize = proj.newPayingSubscribers;
    const metrics: CohortMetric[] = [];

    let currentRetention = 100; // %
    let cumulativeGrossProfit = 0;

    // 1. Initial Profit (Day 1) = Setup Fees * (1 - Payment Fees).
    // This is pure cash margin from signup.
    const setupMarginPercent = 1 - (paymentProcessingRate / 100);
    const oneTimeProfit = financials.weightedAvgOneTimeRevenue * setupMarginPercent;
    
    cumulativeGrossProfit += oneTimeProfit;

    for (let m = 0; m <= MAX_LIFETIME_MONTHS; m++) {
      // 2. Recurring Profit (M0 onwards) = Blended Recurring Profit Per User
      // CFO FIX: Use the calculated blended metric which accounts for LTD cost drag
      const monthlyRecurringProfit = financials.blendedRecurringProfitPerUser;

      if (m > 0) {
        // Apply Churn (Using Paid Churn as best proxy for blended cohort decay)
        currentRetention = currentRetention * (1 - (financials.paidChurnRate / 100));
        cumulativeGrossProfit += (currentRetention / 100) * monthlyRecurringProfit;
      } else {
        // Month 0: Add the first month of recurring service profit on top of setup profit
        cumulativeGrossProfit += monthlyRecurringProfit;
      }

      metrics.push({
        monthIndex: m,
        retentionRate: currentRetention,
        cumulativeLtv: cumulativeGrossProfit,
        isBreakeven: cumulativeGrossProfit >= financials.cac
      });
    }

    cohorts.push({
      acquisitionMonth: proj.month,
      size: Math.round(cohortSize),
      cac: financials.cac,
      metrics
    });
  });

  return cohorts;
};
