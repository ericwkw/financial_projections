
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
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 shadow-sm sticky top-16 z-20 transition-colors overflow-y-auto max-h-[80vh] md:max-h-none">
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
                      <Tooltip position="bottom" content="Free growth. Imagine if every 100 users brought in 1 friend." />
                    </div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{params.viralRate}%</span>
                  </div>
                  <input
                    type="range" min="0" max="5" step="0.1"
                    value={params.viralRate}
                    onChange={(e) => onChange('viralRate', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Growth Speed Dial</label>
                      <Tooltip position="bottom" content="1.0 is normal. 1.2 means your marketing is working 20% better than expected." />
                    </div>
                    <span className="text-xs font-bold text-blue-500 dark:text-blue-400">{params.marketingEfficiency}x</span>
                  </div>
                  <input
                    type="range" min="0.5" max="2.0" step="0.1"
                    value={params.marketingEfficiency}
                    onChange={(e) => onChange('marketingEfficiency', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Expansion / Upsell</label>
                      <Tooltip position="bottom" content="How much extra money you make from existing customers each month (upgrades)." />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{params.expansionRate}%</span>
                  </div>
                  <input
                    type="range" min="0" max="5" step="0.1"
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
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Starting Cash</label>
                      <Tooltip position="bottom" content="Money in the bank right now." />
                   </div>
                   <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">HK$</span>
                      {/* Increased padding from pl-8 to pl-12 to accommodate HK$ prefix */}
                      <input
                        type="number" min="0"
                        value={params.startingCash}
                        onChange={(e) => onChange('startingCash', parseFloat(e.target.value))}
                        className="w-full pl-12 pr-2 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      />
                   </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                       <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Payroll Tax</label>
                       <Tooltip position="bottom" content="Hidden costs like insurance and taxes added on top of every salary." />
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{params.payrollTax}%</span>
                  </div>
                  <input
                    type="range" min="0" max="40" step="1"
                    value={params.payrollTax}
                    onChange={(e) => onChange('payrollTax', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                       <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Salary Growth</label>
                       <Tooltip position="bottom" content="Yearly raises for employees (Inflation)." />
                    </div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{params.salaryGrowthRate}% / yr</span>
                  </div>
                  <input
                    type="range" min="0" max="10" step="0.5"
                    value={params.salaryGrowthRate}
                    onChange={(e) => onChange('salaryGrowthRate', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                       <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sales Comm.</label>
                       <Tooltip position="bottom" content="Cash bonus paid to sales team for closing new deals." />
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
                        <Tooltip position="bottom" content="Company Value = ARR x This Number." />
                      </div>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{params.valuationMultiple}x</span>
                   </div>
                   <input
                        type="range" min="1" max="20" step="0.5"
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
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{params.founderEquity}%</span>
                    </div>
                    <input
                        type="range" min="0" max="100" step="1"
                        value={params.founderEquity}
                        onChange={(e) => onChange('founderEquity', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
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
