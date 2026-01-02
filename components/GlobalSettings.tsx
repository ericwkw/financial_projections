
import React from 'react';
import { ScenarioParams } from '../types';
import Tooltip from './Tooltip';
import { DollarSign, TrendingUp, BrainCircuit, Variable } from './Icons';

interface GlobalSettingsProps {
  params: ScenarioParams;
  onChange: (field: keyof ScenarioParams, value: number) => void;
  onReset: () => void;
}

const GlobalSettings: React.FC<GlobalSettingsProps> = ({ params, onChange, onReset }) => {
  // Helper to calculate monthly equivalent
  const getMonthlyRate = (annualRate: number) => {
     const monthly = (Math.pow(1 + annualRate / 100, 1/12) - 1) * 100;
     return monthly.toFixed(3);
  };

  const getPayrollMultiplier = (tax: number) => {
      return (1 + tax/100).toFixed(2);
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-8 text-white shadow-lg flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Variable className="w-8 h-8 text-slate-300" />
            Global Assumptions
            </h2>
            <div className="max-w-2xl">
            <p className="text-slate-300 text-lg leading-relaxed">
                Fine-tune the engine's hidden variables.
                <br/>Adjust inflation, tax loads, and safety buffers to match your local market reality.
            </p>
            </div>
        </div>
        <button
             onClick={onReset}
             className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors border border-slate-500"
        >
             Reset to Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 1. Macro Economics */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
               <DollarSign className="w-4 h-4" /> Macro Economics
            </h3>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Payment Processing Fee</label>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{params.paymentProcessingRate}%</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Stripe/PayPal fees deducted from Gross Revenue.</p>
                    <input
                        type="range" min="0" max="10" step="0.1"
                        value={params.paymentProcessingRate}
                        onChange={(e) => onChange('paymentProcessingRate', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-600"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Payroll Tax Load</label>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{params.payrollTax}%</span>
                    </div>
                     <div className="flex items-center justify-between text-xs mb-1">
                         <p className="text-slate-500 dark:text-slate-400">Effective Cost.</p>
                         <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 rounded font-mono text-[10px]">
                           {getPayrollMultiplier(params.payrollTax)}x Salary
                         </span>
                    </div>
                    <input
                        type="range" min="0" max="40" step="1"
                        value={params.payrollTax}
                        onChange={(e) => onChange('payrollTax', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-600"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            Annual Inflation (OpEx)
                            <Tooltip content="CRITICAL: This rate increases your future OpEx/COGS. It also reduces your LTV by simulating future margin compression." />
                        </label>
                         <span className="text-sm font-bold text-slate-900 dark:text-white">{params.opexInflationRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-1">
                         <p className="text-slate-500 dark:text-slate-400">Vendor cost increase.</p>
                         <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 rounded font-mono text-[10px]">
                           -{getMonthlyRate(params.opexInflationRate)}%/mo
                         </span>
                    </div>
                    <input
                        type="range" min="0" max="15" step="0.5"
                        value={params.opexInflationRate}
                        onChange={(e) => onChange('opexInflationRate', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-600"
                    />
                </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Salary Growth Rate</label>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{params.salaryGrowthRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-1">
                         <p className="text-slate-500 dark:text-slate-400">Annual Raises.</p>
                         <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 rounded font-mono text-[10px]">
                           -{getMonthlyRate(params.salaryGrowthRate)}%/mo
                         </span>
                    </div>
                    <input
                        type="range" min="0" max="15" step="0.5"
                        value={params.salaryGrowthRate}
                        onChange={(e) => onChange('salaryGrowthRate', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-600"
                    />
                </div>
            </div>
        </div>

        {/* 2. SaaS Physics */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
               <TrendingUp className="w-4 h-4" /> Growth & Safety Physics
            </h3>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Marketing Efficiency</label>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{params.marketingEfficiency}x</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Multiplier on your planned growth rates (Scenario modeling).</p>
                    <input
                        type="range" min="0.5" max="2.0" step="0.1"
                        value={params.marketingEfficiency}
                        onChange={(e) => onChange('marketingEfficiency', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Viral Referrals</label>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{params.viralRate}%</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Organic growth: % of users who invite a friend monthly.</p>
                    <input
                        type="range" min="0" max="5" step="0.1"
                        value={params.viralRate}
                        onChange={(e) => onChange('viralRate', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upsell / Expansion</label>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{params.expansionRate}%</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monthly % revenue increase from existing customers.</p>
                    <input
                        type="range" min="0" max="5" step="0.1"
                        value={params.expansionRate}
                        onChange={(e) => onChange('expansionRate', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">LTV Safety Floor</label>
                            <Tooltip content="Minimum churn rate used for LTV calculations. Prevents LTV from becoming infinite if churn is 0%. A standard safety buffer is 0.5%." />
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{params.minChurnFloor}%</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Zero-Churn Protection (Min Churn %)</p>
                    <input
                        type="range" min="0.1" max="2.0" step="0.1"
                        value={params.minChurnFloor}
                        onChange={(e) => onChange('minChurnFloor', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sales Commission</label>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{params.commissionRate}%</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">% of Gross New Bookings paid to sales team.</p>
                    <input
                        type="range" min="0" max="30" step="1"
                        value={params.commissionRate}
                        onChange={(e) => onChange('commissionRate', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
            </div>
        </div>

        {/* 3. Valuation & Exit */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
               <BrainCircuit className="w-4 h-4" /> Valuation & Exit
            </h3>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Valuation Multiple</label>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{params.valuationMultiple}x</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Multiple of Annual Recurring Revenue (ARR).</p>
                    <input
                        type="range" min="1" max="50" step="0.5"
                        value={params.valuationMultiple}
                        onChange={(e) => onChange('valuationMultiple', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Founder Equity</label>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{params.founderEquity}%</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Your ownership stake.</p>
                    <input
                        type="range" min="0" max="100" step="1"
                        value={params.founderEquity}
                        onChange={(e) => onChange('founderEquity', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Starting Cash (HKD)</label>
                    </div>
                    <input
                        type="number"
                        min="0"
                        value={params.startingCash}
                        onChange={(e) => onChange('startingCash', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
                    />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default GlobalSettings;
