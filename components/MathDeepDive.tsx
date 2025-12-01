
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
            <br/>We use strict venture capital formulas so you (and investors) can trust the results.
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
                 <h4 className="font-semibold text-blue-600 dark:text-blue-400">CAC (Cost to Acquire Customer)</h4>
                 <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Paid Cohorts Only</span>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
                 CAC = (Marketing Spend + <span className="text-blue-600 font-bold">New Deal Commissions</span>) / New <span className="text-blue-600 font-bold">PAYING</span> Customers
               </div>
               <p className="text-xs text-slate-500 mt-2">
                 *We ignore new Free users in the denominator. Mixing in free users would make your marketing look artificially cheap. We don't allow that.
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
                 *Paid Churn Rate: % of Paying users who cancel. If a free user quits, you lose $0. If a paid user quits, you lose money. We only count the churn that hurts your wallet.
               </p>
             </div>

             <div>
               <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">CAC Payback Period</h4>
               <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
                 Months = (CAC - Avg Setup Fee) / (Monthly <span className="font-bold">Recurring</span> Gross Profit)
               </div>
               <p className="text-xs text-slate-500 mt-2">
                 *We subtract Setup Fees from the Cost. If you charge a huge setup fee, your payback might be "Instant" (0 months).
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
                 Score = Annualized <span className="font-bold">REVENUE</span> Growth % + Profit Margin %
               </div>
               <p className="text-xs text-slate-500 mt-2">
                 *We use <strong>Paid Revenue Growth</strong> (not User Growth). Getting 10,000 free users doesn't help your Rule of 40 score. Only money helps.
               </p>
             </div>

             <div>
               <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">Magic Number</h4>
               <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
                 Magic Number = Net New ARR / Monthly Acquisition Spend
               </div>
               <p className="text-xs text-slate-500 mt-2">
                 If > 1.0, you are making more recurring revenue in a year than you spent to get it. This is the "Golden Ratio" of marketing.
               </p>
             </div>

              <div>
               <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Burn Multiplier</h4>
               <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
                 Multiplier = Net Monthly Burn / Net New ARR
               </div>
               <p className="text-xs text-slate-500 mt-2">
                 How much cash do you set on fire to get $1 of growth? <br/>
                 Target: Burn less than $1 to get $1 of growth.
               </p>
             </div>
           </div>
        </div>

        {/* Core Financials */}
         <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:col-span-2">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
             Core P&L & Survival Logic
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                   <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Gross Burn vs Net Burn</h5>
                   <p className="font-mono text-xs text-slate-600 dark:text-slate-400 space-y-2">
                     <span className="block"><span className="font-bold">Gross Burn:</span> Total cash leaving the bank.</span>
                     <span className="block"><span className="font-bold">Net Burn:</span> Gross Burn - Revenue. (The amount you lose).</span>
                   </p>
                   <p className="text-[10px] text-slate-400 mt-2">
                     We calculate your Runway using Net Burn.
                   </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                   <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Operating Expenses</h5>
                   <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
                     (Salaries × (1 + TaxLoad) × (1 + Inflation)) + Fixed Expenses
                   </p>
                   <p className="text-[10px] text-slate-400 mt-2">
                     We automatically add taxes and inflation so you don't underestimate your costs.
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
                     Selling annual plans is the best way to extend your runway without raising money.
                   </p>
                </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                   <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Sales Commissions</h5>
                   <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
                     Commission Rate × Gross New ARR
                   </p>
                   <p className="text-[10px] text-slate-400 mt-2">
                     Calculated on <span className="font-bold">Gross New Bookings</span>. 
                     <br/>Salespeople get paid for closing the deal, even if the customer churns later.
                   </p>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30">
                 <h5 className="font-bold text-sm text-amber-800 dark:text-amber-400 mb-2">Churn-Adjusted Expansion Revenue</h5>
                 <p className="font-mono text-xs text-amber-900/80 dark:text-amber-300/80">
                   1. Expansion Revenue decays by PaidChurn% monthly.
                 </p>
                 <p className="text-[10px] text-amber-800/60 dark:text-amber-400/60 mt-2">
                   <strong>Why?</strong> Upsold revenue isn't permanent. If a customer churns, their expansion revenue disappears too. We model this decay to prevent unrealistic "Hockey Stick" charts.
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default MathDeepDive;
