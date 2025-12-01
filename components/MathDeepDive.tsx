
import React from 'react';
import { Variable } from './Icons';

const MathDeepDive: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Variable className="w-8 h-8 text-emerald-200" />
          The Math Engine
        </h2>
        <div className="max-w-3xl">
          <p className="text-emerald-50 text-lg leading-relaxed">
            Transparency is trust. Here is the exact logic running behind every number in your dashboard.
            <br/>We use industry-standard venture capital formulas to ensure your model holds up to scrutiny.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LTV & CAC */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
             Unit Economics (LTV & CAC)
           </h3>
           <div className="space-y-8">
             <div>
               <div className="flex justify-between items-baseline mb-2">
                 <h4 className="font-semibold text-blue-600 dark:text-blue-400">CAC (Customer Acquisition Cost)</h4>
                 <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Paid Cohorts Only</span>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
                 CAC = Total Sales & Marketing Spend / New <span className="text-blue-600 font-bold">PAYING</span> Customers
               </div>
               <p className="text-xs text-slate-500 mt-2">
                 *Crucial Detail: We ignore new Free users in the denominator. If you spend $1000 to get 100 free users and 1 paid user, your CAC is $1000, not $10.
               </p>
             </div>

             <div>
               <div className="flex justify-between items-baseline mb-2">
                 <h4 className="font-semibold text-emerald-600 dark:text-emerald-400">LTV (Lifetime Value)</h4>
                 <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Gross Margin Adjusted</span>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
                 LTV = (ARPPU × Gross Margin %) / Paid Churn Rate
               </div>
               <p className="text-xs text-slate-500 mt-2">
                 *ARPPU: Average Revenue Per Paying User.<br/>
                 *Paid Churn Rate: % of Paying users who cancel. We ignore free user churn so LTV isn't artificially lowered.
               </p>
             </div>
           </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
             Efficiency Metrics
           </h3>
           <div className="space-y-8">
             <div>
               <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Rule of 40</h4>
               <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
                 Score = <span className="font-bold">Annualized</span> Growth Rate % + Profit Margin %
               </div>
               <p className="text-xs text-slate-500 mt-2">
                 *We compound your monthly growth rate to an annual rate `((1+r)^12 - 1)` to correctly benchmark against public SaaS companies.
               </p>
             </div>

             <div>
               <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">Magic Number</h4>
               <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
                 Magic Number = Net New ARR / Annualized Marketing Spend
               </div>
               <p className="text-xs text-slate-500 mt-2">
                 Measures marketing efficiency. If > 1.0, you are making more recurring revenue than you spend on ads.
               </p>
             </div>

              <div>
               <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Burn Multiplier</h4>
               <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
                 Multiplier = Net Burn / Net New ARR
               </div>
               <p className="text-xs text-slate-500 mt-2">
                 Measures capital efficiency. How much cash do you burn to generate $1 of growth? Lower is better.
               </p>
             </div>
           </div>
        </div>

        {/* Core Financials */}
         <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:col-span-2">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
             Core P&L Logic
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                   <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Gross Profit</h5>
                   <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
                     Revenue - COGS
                   </p>
                   <p className="text-[10px] text-slate-400 mt-2">
                     COGS includes variable costs for BOTH free and paid users.
                   </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                   <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Operating Expenses</h5>
                   <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
                     (Salaries × (1 + TaxLoad) × (1 + Inflation)) + Fixed Expenses
                   </p>
                   <p className="text-[10px] text-slate-400 mt-2">
                     Salaries are fully loaded with benefits/taxes and increase annually by the "Salary Growth" rate.
                   </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                   <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Cash Flow (Annual vs Monthly)</h5>
                   <div className="font-mono text-xs text-slate-600 dark:text-slate-400 space-y-2">
                     <p>• Monthly Plans: Cash = Revenue</p>
                     <p>• Yearly Plans: Cash = 12 months Upfront</p>
                   </div>
                   <p className="text-[10px] text-slate-400 mt-2">
                     We differentiate between "Revenue" (Accrual) and "Cash Balance" (Bank).
                   </p>
                </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                   <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Sales Commissions</h5>
                   <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
                     Commission Rate × Gross New ARR
                   </p>
                   <p className="text-[10px] text-slate-400 mt-2">
                     Calculated on <span className="font-bold">Gross New Bookings</span>. 
                     <br/>In the Dashboard Snapshot, we include an <em>Estimated Commission</em> based on current growth velocity so your Burn Rate KPIs are accurate.
                   </p>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30">
                 <h5 className="font-bold text-sm text-amber-800 dark:text-amber-400 mb-2">Churn-Adjusted Expansion Revenue</h5>
                 <p className="font-mono text-xs text-amber-900/80 dark:text-amber-300/80">
                   MonthlyExpansionBucket = (PreviousBucket + NewUpsell) × (1 - PaidChurn%)
                 </p>
                 <p className="text-[10px] text-amber-800/60 dark:text-amber-400/60 mt-2">
                   <strong>Why?</strong> Upsold revenue isn't permanent. If a customer churns, their expansion revenue disappears too. We depreciate the accumulated expansion revenue by the paid churn rate every month to prevent unrealistic "infinite growth" in long-term projections.
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default MathDeepDive;
