import React from 'react';
import { ScenarioParams } from '../types';
import Tooltip from './Tooltip';
import { RotateCcw } from './Icons';

interface ScenarioControlsProps {
  params: ScenarioParams;
  onChange: (field: keyof ScenarioParams, value: number) => void;
  onReset: () => void;
}

const ScenarioControls: React.FC<ScenarioControlsProps> = ({ params, onChange, onReset }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 shadow-sm sticky top-16 z-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 items-center">
          
          <div className="space-y-1">
             <div className="flex items-center">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase block mb-1">Starting Cash</label>
                <Tooltip content="The amount of money currently in your bank account. Used to calculate Runway." className="mb-1" />
             </div>
             <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  min="0"
                  value={params.startingCash}
                  onChange={(e) => onChange('startingCash', parseFloat(e.target.value))}
                  className="w-full pl-5 pr-2 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-medium"
                />
             </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Monthly Growth</label>
                 <Tooltip content="Compound monthly growth rate of new subscribers." />
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{params.growthRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={params.growthRate}
              onChange={(e) => onChange('growthRate', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Monthly Churn</label>
                <Tooltip content="The percentage of customers who cancel every month." />
              </div>
              <span className="text-xs font-bold text-red-500 dark:text-red-400">{params.churnRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={params.churnRate}
              onChange={(e) => onChange('churnRate', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Payroll Tax</label>
                 <Tooltip content="Percentage added to salaries for benefits/taxes (Load)." />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{params.payrollTax}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={params.payrollTax}
              onChange={(e) => onChange('payrollTax', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-500 dark:accent-slate-400"
            />
          </div>

          <div className="space-y-1">
             <div className="flex items-center">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase block mb-1">Valuation (x ARR)</label>
                <Tooltip content="Company Valuation = Annual Recurring Revenue (ARR) * This Multiple." className="mb-1" />
             </div>
             <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">x</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={params.valuationMultiple}
                  onChange={(e) => onChange('valuationMultiple', parseFloat(e.target.value))}
                  className="w-full pl-5 pr-2 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                />
             </div>
          </div>

          <div className="flex justify-end md:justify-center">
             <button
               onClick={onReset}
               className="p-2 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
               title="Reset Scenarios to Default"
             >
               <RotateCcw className="w-5 h-5" />
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ScenarioControls;