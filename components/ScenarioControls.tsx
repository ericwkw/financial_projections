
import React from 'react';
import { ScenarioParams } from '../types';
import Tooltip from './Tooltip';
import { RotateCcw, TrendingUp, DollarSign, BrainCircuit } from './Icons';

interface ScenarioControlsProps {
  params: ScenarioParams;
  onChange: (field: keyof ScenarioParams, value: number) => void;
  onReset: () => void;
}

const ScenarioControls: React.FC<ScenarioControlsProps> = ({ params, onChange, onReset }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 shadow-sm sticky top-16 z-20 transition-colors overflow-y-auto md:overflow-visible max-h-[80vh] md:max-h-none">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-4 md:hidden">
           <span className="text-sm font-bold text-slate-900 dark:text-white">Scenario Settings</span>
           <button
             onClick={onReset}
             className="text-xs text-slate-500 underline"
           >
             Reset Defaults
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Group 1: Growth Engine */}
          <div className="md:col-span-4 lg:col-span-4 relative group">
             <div className="absolute -left-3 top-0 bottom-0 w-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
               <TrendingUp className="w-4 h-4" /> Growth Engine
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4">
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Viral Referral Rate</label>
                      <Tooltip width="w-64" position="bottom" content="Free growth engine. Impact: Increases MRR exponentially without increasing your marketing spend, extending your runway." />
                    </div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{params.viralRate}%</span>
                  </div>
                  <input
                    type="range" min="0" max="5" step="0.1"
                    title="Impact: Increases MRR exponentially without increasing CAC."
                    value={params.viralRate}
                    onChange={(e) => onChange('viralRate', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Growth Speed Dial</label>
                      <Tooltip width="w-64" position="bottom" content="Marketing efficiency multiplier. Impact: Higher efficiency lowers your effective CAC and accelerates revenue growth." />
                    </div>
                    <span className="text-xs font-bold text-blue-500 dark:text-blue-400">{params.marketingEfficiency}x</span>
                  </div>
                  <input
                    type="range" min="0.5" max="2.0" step="0.1"
                    title="Impact: Higher efficiency lowers effective CAC and accelerates Revenue."
                    value={params.marketingEfficiency}
                    onChange={(e) => onChange('marketingEfficiency', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Expansion / Upsell</label>
                      <Tooltip width="w-64" position="bottom" content="Monthly upsell percentage. Impact: Increases Lifetime Value (LTV) and Net Revenue Retention (NRR) while offsetting churn." />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{params.expansionRate}%</span>
                  </div>
                  <input
                    type="range" min="0" max="5" step="0.1"
                    title="Impact: Increases LTV and Net Revenue Retention (NRR)."
                    value={params.expansionRate}
                    onChange={(e) => onChange('expansionRate', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
             </div>
          </div>

          {/* Group 2: Operations & Cash */}
          <div className="md:col-span-5 lg:col-span-5 relative group border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-8">
             <div className="absolute -left-3 top-0 bottom-0 w-1 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
               <DollarSign className="w-4 h-4" /> Ops & Cash Flow
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                
                <div className="space-y-1">
                   <div className="flex items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Starting Cash (HKD)</label>
                      <Tooltip width="w-64" position="bottom" content="Current bank balance. Impact: Directly determines your Day 1 runway. Does not affect unit economics." />
                   </div>
                   <div className="relative">
                      <input
                        type="number" min="0"
                        title="Impact: Directly determines Day 1 Runway."
                        value={params.startingCash}
                        onChange={(e) => onChange('startingCash', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-2 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                   </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                       <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Payroll Tax</label>
                       <Tooltip width="w-64" position="bottom" content="Hidden employee costs (e.g. MPF, insurance). Impact: Increases gross burn and reduces profit margin." />
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{params.payrollTax}%</span>
                  </div>
                  <input
                    type="range" min="0" max="40" step="1"
                    title="Impact: Increases Gross Burn and reduces Profit Margin."
                    value={params.payrollTax}
                    onChange={(e) => onChange('payrollTax', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                       <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Salary Growth</label>
                       <Tooltip width="w-64" position="bottom" content="Annual salary increase (inflation). Impact: Compounding increase in operating expenses that significantly shortens runway over time." />
                    </div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{params.salaryGrowthRate}% / yr</span>
                  </div>
                  <input
                    type="range" min="0" max="10" step="0.5"
                    title="Impact: Compounding increase in OpEx."
                    value={params.salaryGrowthRate}
                    onChange={(e) => onChange('salaryGrowthRate', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                       <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Payment Fee</label>
                       <Tooltip width="w-64" position="bottom" content="Transaction fees (e.g. Stripe). Impact: A direct reduction of gross margin, automatically calculated on all revenue." />
                    </div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{params.paymentProcessingRate}%</span>
                  </div>
                  <input
                    type="range" min="0" max="10" step="0.1"
                    title="Impact: Direct hit to Gross Margin."
                    value={params.paymentProcessingRate}
                    onChange={(e) => onChange('paymentProcessingRate', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

             </div>
          </div>

          {/* Group 3: Valuation */}
          <div className="md:col-span-3 lg:col-span-3 relative group border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-8 flex flex-col">
             <div className="absolute -left-3 top-0 bottom-0 w-1 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" /> Valuation
                </h3>
                <button onClick={onReset} className="hidden md:block text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Reset">
                  <RotateCcw className="w-4 h-4" />
                </button>
             </div>
             
             <div className="space-y-4 flex-grow">
                <div className="space-y-1">
                   <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Valuation Multiple</label>
                        <Tooltip width="w-64" position="bottom" content="Valuation multiplier based on ARR. Impact: Determines company valuation and founder net worth." />
                      </div>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{params.valuationMultiple}x</span>
                   </div>
                   <input
                        type="range" min="1" max="20" step="0.5"
                        title="Impact: Sets Company Valuation and Founder Net Worth."
                        value={params.valuationMultiple}
                        onChange={(e) => onChange('valuationMultiple', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-tight">
                      Based on <strong>ARR</strong> (Annual Recurring Revenue = MRR x 12).
                    </p>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Founder Equity</label>
                      <Tooltip width="w-64" position="bottom" content="Your ownership percentage. Impact: Determines the value of your personal stake upon exit." />
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{params.founderEquity}%</span>
                    <input
                        type="range" min="0" max="100" step="1"
                        title="Impact: Determines Founder Wealth upon exit."
                        value={params.founderEquity}
                        onChange={(e) => onChange('founderEquity', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
                    />
                </div>
                
                <div className="space-y-1 md:hidden">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                         <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sales Comm.</label>
                      </div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{params.commissionRate}%</span>
                    </div>
                    <input
                      type="range" min="0" max="25" step="1"
                      value={params.commissionRate}
                      onChange={(e) => onChange('commissionRate', parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ScenarioControls;
