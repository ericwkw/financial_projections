
import { Plan, Employee, OperatingExpense, ScenarioParams, Financials, MonthlyProjection, Cohort } from "../types";

export const calculateFinancials = (
  plans: Plan[],
  employees: Employee[],
  expenses: OperatingExpense[],
  params: ScenarioParams
): Financials => {
  // 1. Current MRR, COGS (Variable), Subscriber Count
  let mrr = 0;
  let totalUnitCosts = 0; // Renamed from totalCogs to separate Unit Costs from Fees
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

  plans.forEach(plan => {
    const isPaid = plan.price > 0;
    
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
        // Revenue is recognized upfront in 'oneTimeRevenueMonthly' or CashFlow.
        priceMonthly = 0;
        planArrValue = 0; 
    }
    
    // Revenue only from paid plans
    if (isPaid) {
      mrr += priceMonthly * plan.subscribers;
      payingSubscribers += plan.subscribers;
    }
    
    // Growth Logic for Snapshot
    const growth = plan.monthlyGrowth || 0;
    // Lifetime plans don't churn revenue-wise (Single Upfront Payment).
    const churn = plan.interval === 'lifetime' ? 0 : (plan.monthlyChurn || 0);
    
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
    // If we count commissions/setup fees from new users, we must also count their MRR and Unit Cost impact.
    if (isPaid) {
        newMrrFromGrowth += newUsers * priceMonthly;
        churnedMrr += churnedUsers * priceMonthly;
    }
    newUnitCostsFromGrowth += newUsers * plan.unitCost;
    churnedUnitCosts += churnedUsers * plan.unitCost;

    if (isPaid) {
        // For Paid Growth Rate (User count based)
        weightedPaidGrowthSum += effectiveGrowthRate * plan.subscribers;
        weightedPaidChurnSum += effectiveChurnRate * plan.subscribers;
        totalNewPayingSubscribers += newUsers;
        
        // For Cash Flow Payback Offset (Strict Paid Cohort)
        let upfrontCashRevenue = plan.setupFee || 0;
        if (plan.interval === 'lifetime') upfrontCashRevenue += plan.price;
        if (plan.interval === 'yearly') upfrontCashRevenue += plan.price;
        
        paidOneTimeRevenue += newUsers * upfrontCashRevenue;

        // For Accrual/LTV One-Time Revenue (Setup + Lifetime only)
        // This calculates the average "Starting Value" boost per user
        let accrualOneTime = plan.setupFee || 0;
        if (plan.interval === 'lifetime') accrualOneTime += plan.price;
        paidOneTimeRevenueAccrual += newUsers * accrualOneTime;

        // For Commission Estimation (Gross Adds)
        const dealValue = plan.interval === 'lifetime' ? plan.price : planArrValue;
        impliedNewArrMonthly += newUsers * dealValue; 

        // For Efficiency Metrics (Net New ARR - Dollar based)
        netNewArrReal += netAddedUsers * planArrValue;
    }

    // -- ACCRUAL ONE-TIME REVENUE --
    // Only includes setup fees + Lifetime Price. 
    // Does NOT include Annual Plan price (that is recognized ratably in MRR).
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
    // We assume smoothed renewals (1/12th of annual base renews monthly)
    let renewalCashPerUser = 0;
    if (plan.interval === 'monthly') renewalCashPerUser = plan.price;
    else if (plan.interval === 'yearly') renewalCashPerUser = plan.price / 12; 
    
    cashInflowFromRenewals += existingUsers * renewalCashPerUser;

    // Unit Costs apply to ALL plans (Free + Paid + Lifetime)
    totalUnitCosts += plan.unitCost * plan.subscribers;
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
  // Assume Expansion Revenue carries the same Unit Cost Ratio as Base Revenue (proxy)
  const baseUnitCostRatio = mrr > 0 ? totalUnitCosts / mrr : 0;
  const expansionUnitCost = impliedExpansionMrr * baseUnitCostRatio;
  
  // ==========================================
  // ACCRUAL P&L (Net Income)
  // ==========================================
  
  // Total Accrual Revenue
  const totalAccrualRevenue = mrr - churnedMrr + newMrrFromGrowth + oneTimeRevenueMonthly + impliedExpansionMrr;

  // Accrual Expenses
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

  // Commissions (Expense in period incurred)
  const commissionsFromNewLogos = impliedNewArrMonthly * (params.commissionRate / 100);
  const totalNewArrBase = impliedNewArrMonthly + impliedExpansionArr;
  const estimatedTotalCommissions = totalNewArrBase * (params.commissionRate / 100);

  // Net New ARR (for Efficiency)
  const netNewArr = netNewArrReal + impliedExpansionArr;

  // Totals
  const totalAccrualExpenses = accrualCogs + payrollMonthly + opexMonthly + estimatedTotalCommissions;
  const netMonthly = totalAccrualRevenue - totalAccrualExpenses;
  const profitMargin = totalAccrualRevenue > 0 ? (netMonthly / totalAccrualRevenue) * 100 : 0;

  // ==========================================
  // CASH FLOW (Burn Rate & Runway)
  // ==========================================
  
  const totalCashInflow = cashInflowFromNewUsers + cashInflowFromRenewals + impliedExpansionMrr;
  const cashPaymentFees = totalCashInflow * (params.paymentProcessingRate / 100);
  
  // Operational costs are generally cash-out same month
  // Note: We use the Net Unit Costs (Base - Churn + New) to represent this month's bill
  const netUnitCosts = totalUnitCosts - churnedUnitCosts + newUnitCostsFromGrowth + expansionUnitCost;
  
  const totalCashExpenses = netUnitCosts + cashPaymentFees + payrollMonthly + opexMonthly + estimatedTotalCommissions;
  
  const netCashFlow = totalCashInflow - totalCashExpenses;
  
  // Gross Burn is Total Cash Outflow
  const grossBurn = totalCashExpenses;
  
  // Net Burn (Burn Rate) is Net Cash Flow inverted (if negative)
  const burnRate = netCashFlow < 0 ? Math.abs(netCashFlow) : 0; 
  const runwayMonths = burnRate > 0 ? params.startingCash / burnRate : (params.startingCash > 0 ? 999 : 0);


  // ==========================================
  // METRICS
  // ==========================================
  
  const valuation = arr * params.valuationMultiple;
  const founderValue = valuation * (params.founderEquity / 100);

  // Gross Margin (Accrual Based)
  const grossProfit = totalAccrualRevenue - accrualCogs; 
  const grossMarginPercent = totalAccrualRevenue > 0 ? (grossProfit / totalAccrualRevenue) : 0;

  // Recurring Gross Margin (Strictly for LTV/Payback)
  // Isolates the margin of the subscription product itself
  const recurringPaymentFees = (mrr + impliedExpansionMrr) * (params.paymentProcessingRate / 100);
  const recurringCogs = (totalUnitCosts + expansionUnitCost) + recurringPaymentFees;

  const recurringGrossProfit = (mrr + impliedExpansionMrr) - recurringCogs;
  const recurringGrossMarginPercent = (mrr + impliedExpansionMrr) > 0 ? (recurringGrossProfit / (mrr + impliedExpansionMrr)) : 0;

  const arpu = totalSubscribers > 0 ? mrr / totalSubscribers : 0;
  const arppu = payingSubscribers > 0 ? mrr / payingSubscribers : 0;
  const conversionRate = totalSubscribers > 0 ? payingSubscribers / totalSubscribers : 0;
  
  // CAC: Cost to Acquire / New PAYING Customers (Strict Definition)
  const totalCacSpend = acquisitionCosts + commissionsFromNewLogos;
  const cac = totalNewPayingSubscribers > 0.1 ? totalCacSpend / totalNewPayingSubscribers : (totalCacSpend > 0 ? 99999 : 0);

  // Weighted Avg One-Time Revenue per New Paying User (Accrual/Setup basis)
  const weightedAvgOneTimeRevenue = totalNewPayingSubscribers > 0 ? (paidOneTimeRevenueAccrual / totalNewPayingSubscribers) : 0;

  // LTV: Use Paid Churn Only & Recurring Gross Margin
  // Also include the Gross Profit from Setup Fees/Lifetime plans
  // We approximate the margin on Setup Fees using the Global Gross Margin (as it accounts for Payment Fees but no unit costs usually)
  const setupProfit = weightedAvgOneTimeRevenue * grossMarginPercent;
  
  const safePaidChurn = Math.max(0.5, paidChurnRate); 
  const recurringLtv = safePaidChurn > 0 ? (arppu * recurringGrossMarginPercent) / (safePaidChurn / 100) : 0;
  const ltv = setupProfit + recurringLtv;

  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  
  // Rule of 40: Annualized REVENUE Growth + Profit Margin
  const monthlyRevenueGrowthRate = arr > 0 ? (netNewArr / 12) / (arr / 12) : 0;
  const annualizedRevenueGrowthRate = (Math.pow(1 + monthlyRevenueGrowthRate, 12) - 1) * 100;
  
  // Fallback if ARR is 0 (e.g. only LTD plans)
  const finalGrowthRate = arr > 0 ? annualizedRevenueGrowthRate : 0; 
  
  const ruleOf40 = finalGrowthRate + profitMargin; 
  
  // NRR = 100 + Expansion - Churn
  const nrr = 100 + params.expansionRate - paidChurnRate;

  // Setup Fees Allocation for Payback (Strict Paid Cohort)
  const weightedAvgSetupFee = totalNewPayingSubscribers > 0 ? (paidOneTimeRevenue / totalNewPayingSubscribers) : 0;
  
  // Adjusted CAC = CAC - Setup Fee
  const adjustedCac = Math.max(0, cac - weightedAvgSetupFee);
  
  // Payback Denominator: Gross Profit from RECURRING revenue only per user
  const monthlyRecurringGrossProfitPerUser = arppu * recurringGrossMarginPercent;
  
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

  // Magic Number = Net New ARR / Monthly Acquisition Spend
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
    cogs: accrualCogs, 
    grossProfit,
    grossMarginPercent,
    recurringGrossMarginPercent,
    weightedAvgOneTimeRevenue,
    payrollMonthly,
    opexMonthly,
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
  
  // Calculate Base Unit Cost Ratio (excluding payment fees for now)
  const baseMrr = plans.reduce((sum, p) => sum + (p.interval === 'yearly' ? p.price/12 : (p.interval === 'lifetime' ? 0 : p.price)) * p.subscribers, 0);
  const baseUnitCosts = plans.reduce((sum, p) => sum + p.unitCost * p.subscribers, 0);
  const baseUnitCostRatio = baseMrr > 0 ? baseUnitCosts / baseMrr : 0;

  for (let i = 1; i <= months; i++) {
    let monthlyRecurringRevenue = 0; // Accrual
    let monthlyCashInflow = 0; // Actual Cash
    let monthlyOneTimeRevenue = 0;
    let monthlyUnitCosts = 0; // Renamed for clarity
    let totalSubs = 0;
    let monthlyNewPayingSubscribers = 0; // New Calculation
    let newArrForCommissions = 0; // For Recurring Commissions
    let newDealValueForCommissions = 0; // For LTD Commissions

    if (i > 1) {
       const prevRevenue = projections[i-2].revenue - projections[i-2].oneTimeRevenue; 
       
       // 1. Add New Expansion Revenue
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
      // Force 0 churn for Lifetime plans (Revenue Churn is 0 since they paid once)
      const churn = plan.interval === 'lifetime' ? 0 : (plan.monthlyChurn || 0);

      const planGrowth = growth * params.marketingEfficiency;
      const viralGrowth = params.viralRate; 
      
      const totalGrowthRate = (planGrowth + viralGrowth) / 100;
      const churnRate = churn / 100;
      
      const newUsers = plan.subscribers * totalGrowthRate;
      const churnedUsers = plan.subscribers * churnRate;
      const netSubsChange = newUsers - churnedUsers;
      
      const currentSubs = Math.max(0, plan.subscribers + netSubsChange);
      
      // -- REVENUE (Accrual) --
      let priceMonthly = 0;
      if (plan.interval === 'monthly') priceMonthly = plan.price;
      if (plan.interval === 'yearly') priceMonthly = plan.price / 12;
      // Lifetime = 0 Recurring Revenue

      monthlyRecurringRevenue += priceMonthly * currentSubs;
      monthlyOneTimeRevenue += newUsers * plan.setupFee;
      
      // Lifetime Revenue goes into OneTimeRevenue
      if (plan.interval === 'lifetime') {
          monthlyOneTimeRevenue += newUsers * plan.price;
      }

      monthlyUnitCosts += plan.unitCost * currentSubs;
      totalSubs += currentSubs;
      
      // -- CASH FLOW (Bank) --
      monthlyCashInflow += newUsers * plan.setupFee;

      if (plan.interval === 'yearly') {
        // Annual Plans:
        monthlyCashInflow += newUsers * plan.price;
        const existingUsers = Math.max(0, plan.subscribers - churnedUsers); 
        monthlyCashInflow += (existingUsers / 12) * plan.price;
      } else if (plan.interval === 'lifetime') {
        // Lifetime Plans:
        // Cash = Price x New Users. No renewals.
        monthlyCashInflow += newUsers * plan.price;
      } else {
        // Monthly Plans: Cash = Revenue
        monthlyCashInflow += currentSubs * plan.price;
      }

      // Commission Base & New Paying Count
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
    monthlyUnitCosts += expansionUnitCosts;

    const totalRevenue = monthlyRecurringRevenue + monthlyOneTimeRevenue;

    // -- DYNAMIC PAYMENT FEES --
    // Fees applied to Total Revenue for P&L (Accrual matching)
    const paymentFees = totalRevenue * (params.paymentProcessingRate / 100);
    
    // Total COGS = Unit Costs + Payment Fees
    const monthlyCogs = monthlyUnitCosts + paymentFees;

    const grossProfit = totalRevenue - monthlyCogs;
    
    // Fixed costs (Payroll Inflation logic)
    let payroll = baseFinancials.payrollMonthly;
    if (i > 12) payroll *= (1 + params.salaryGrowthRate/100);
    if (i > 24) payroll *= (1 + params.salaryGrowthRate/100);
    if (i > 36) payroll *= (1 + params.salaryGrowthRate/100);
    if (i > 48) payroll *= (1 + params.salaryGrowthRate/100);

    const opex = baseFinancials.opexMonthly;
    
    // Sales Commissions (Cash Out)
    const commissionsArr = Math.max(0, newArrForCommissions * (params.commissionRate / 100));
    const commissionsLtd = Math.max(0, newDealValueForCommissions * (params.commissionRate / 100));
    const totalCommissions = commissionsArr + commissionsLtd;

    // Net Income (Accrual P&L)
    const netIncome = grossProfit - payroll - opex - totalCommissions;

    // Net Cash Flow (Bank P&L)
    // Cash Outflow COGS = Unit Costs (incurred monthly) + Fees on CASH INFLOW.
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

export const generateCohortData = (projections: MonthlyProjection[], financials: Financials): Cohort[] => {
  // Limit to first 12 cohorts for UI cleanliness, tracked over 12 months
  const monthsToTrack = 12;
  const cohortsToDisplay = projections.slice(0, 12);
  
  const paidChurnRate = financials.paidChurnRate / 100;
  // Use Recurring Gross Profit per User for LTV calc
  // Recurring Gross Margin % accounts for Payment Fees and Unit Costs
  // ARPPU is the top line revenue per paying user
  const monthlyGrossProfitPerUser = financials.arppu * financials.recurringGrossMarginPercent;
  
  // Calculate Avg One-Time Profit (Setup/Lifetime)
  // Use Global Margin % as a proxy for One-Time Margin (accounting for Payment Fees)
  const oneTimeGrossProfitPerUser = financials.weightedAvgOneTimeRevenue * financials.grossMarginPercent;
  
  const cac = financials.cac;

  return cohortsToDisplay.map(proj => {
    const acquisitionMonth = proj.month;
    const size = Math.round(proj.newPayingSubscribers);
    const metrics = [];
    
    let currentRetention = 1.0;
    
    // Initialize Cumulative Gross Profit with the Upfront/One-Time Profit at Month 0
    let cumulativeGrossProfit = oneTimeGrossProfitPerUser;

    for (let i = 0; i <= monthsToTrack; i++) {
        // Apply Churn (starting from month 1)
        if (i > 0) {
             currentRetention = currentRetention * (1 - paidChurnRate);
        }
        
        // Add Recurring Profit for this period
        // We assume subscription is paid at start of period. 
        // Month 0: User pays One-Time + Month 1 Subscription
        cumulativeGrossProfit += monthlyGrossProfitPerUser * currentRetention;
        
        metrics.push({
            monthIndex: i,
            retentionRate: currentRetention * 100,
            cumulativeLtv: cumulativeGrossProfit,
            isBreakeven: cumulativeGrossProfit > cac
        });
    }

    return {
        acquisitionMonth,
        size,
        cac,
        metrics
    };
  });
};
