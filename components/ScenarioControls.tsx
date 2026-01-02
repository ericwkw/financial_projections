
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
           <span className="text-sm font-bold text-slate-900 dark:text-white">Growth Levers</span>
           <button
             onClick={onReset}
             className="text-xs text-slate-500 underline"
           >
             Reset
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* LEVER 1: Viral Growth */}
          <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Viral Referrals</label>
                  <Tooltip width="w-64" position="bottom" content="Percentage of users who invite a friend for free each month. A high viral rate decreases your reliance on paid ads." />
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{params.viralRate}%</span>
              </div>
              <input
                type="range" min="0" max="5" step="0.1"
                value={params.viralRate}
                onChange={(e) => onChange('viralRate', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">Free organic growth.</p>
          </div>

          {/* LEVER 2: Paid Growth Efficiency */}
          <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Growth Speed</label>
                  <Tooltip width="w-64" position="bottom" content="A multiplier on your marketing performance. 1.0x is baseline. 1.2x means your ads are performing 20% better than expected." />
                </div>
                <span className="text-xs font-bold text-blue-500 dark:text-blue-400">{params.marketingEfficiency}x</span>
              </div>
              <input
                type="range" min="0.5" max="2.0" step="0.1"
                value={params.marketingEfficiency}
                onChange={(e) => onChange('marketingEfficiency', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <p className="text-[10px] text-slate-400">Marketing efficiency multiplier.</p>
          </div>

          {/* LEVER 3: Expansion Revenue */}
          <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Upsell / Expansion</label>
                  <Tooltip width="w-64" position="bottom" content="Monthly % increase in revenue from existing customers (upgrades). This offsets churn." />
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{params.expansionRate}%</span>
              </div>
              <input
                type="range" min="0" max="5" step="0.1"
                value={params.expansionRate}
                onChange={(e) => onChange('expansionRate', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-[10px] text-slate-400">Existing customers paying more.</p>
          </div>

           {/* LEVER 4: Starting Cash */}
           <div className="space-y-2 border-l border-slate-100 dark:border-slate-800 pl-8 md:block hidden">
               <div className="flex items-center mb-2 justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Bank Balance</label>
                  <button onClick={onReset} className="text-[10px] text-slate-400 hover:text-blue-500 flex items-center gap-1" title="Reset all">
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
               </div>
               <div className="relative">
                  <span className="absolute left-2 top-1.5 text-xs text-slate-400">HK$</span>
                  <input
                    type="number" min="0"
                    value={params.startingCash}
                    onChange={(e) => onChange('startingCash', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-2 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
               </div>
               <p className="text-[10px] text-slate-400">Starting cash reserves.</p>
           </div>
          
        </div>
      </div>
    </div>
  );
};

export default ScenarioControls;
