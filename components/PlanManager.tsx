
import React, { useState } from 'react';
import { Plan } from '../types';
import { Trash2, Plus, Users, DollarSign, BrainCircuit, Wand2, Clock } from './Icons';
import Tooltip from './Tooltip';
import CostEstimatorModal from './CostEstimatorModal';

interface PlanManagerProps {
  plans: Plan[];
  globalCac: number; // New Prop for Payback Calculation
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Plan, value: any) => void;
  onDelete: (id: string) => void;
}

const PlanManager: React.FC<PlanManagerProps> = ({ plans, globalCac, onAdd, onUpdate, onDelete }) => {
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const openEstimator = (planId: string) => {
    setActivePlanId(planId);
    setIsEstimatorOpen(true);
  };

  const handleApplyCost = (cost: number) => {
    if (activePlanId) {
      onUpdate(activePlanId, 'unitCost', Number(cost.toFixed(2)));
    }
  };

  const getPaybackInfo = (plan: Plan) => {
    // 1. Calculate Monthly Price (Recurring Only)
    let monthlyPrice = 0;
    if (plan.interval === 'monthly') monthlyPrice = plan.price;
    if (plan.interval === 'yearly') monthlyPrice = plan.price / 12;
    // Lifetime plans have 0 monthly recurring price
    
    // 2. Calculate Gross Margin per User (Recurring)
    const margin = monthlyPrice - plan.unitCost;
    
    // 3. Handle Edge Cases
    if (plan.price === 0) return { months: 999, label: "Free" };
    
    // 4. Calculate Effective CAC (Global CAC - Upfront Cash)
    // Upfront Cash = Setup Fee + (Lifetime Price if applicable)
    let upfrontCash = plan.setupFee || 0;
    if (plan.interval === 'lifetime') {
        upfrontCash += plan.price;
    }

    // Effective CAC is the remaining cost we need to recover via subscription
    const effectiveCac = Math.max(0, globalCac - upfrontCash);
    
    if (effectiveCac === 0) return { months: 0, label: "Instant" };
    
    // If it's a lifetime plan and we still have CAC left (meaning Price < CAC),
    // and margin is negative (because monthlyPrice is 0 and unitCost > 0),
    // we will NEVER pay it back via recurring profit (since there is none).
    if (plan.interval === 'lifetime') return { months: 999, label: "Never" };

    if (margin <= 0) return { months: 999, label: "Never" };
    
    const months = effectiveCac / margin;
    return { months, label: `${months.toFixed(1)} mo` };
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      <CostEstimatorModal 
        isOpen={isEstimatorOpen} 
        onClose={() => setIsEstimatorOpen(false)} 
        onApply={handleApplyCost} 
      />
      
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-t-xl">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Subscription Plans</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Define revenue tiers, growth rates, and variable costs.</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Plan</span>
        </button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-b-xl">
        {plans.map((plan, index) => {
          const isFree = plan.price === 0;
          const payback = getPaybackInfo(plan);
          const isProfitable = payback.label !== "Never" && payback.label !== "Free";
          const isFreeLabel = payback.label === "Free";
          const isLifetime = plan.interval === 'lifetime';
          
          return (
          <div 
            key={plan.id} 
            className={`p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group ${index === plans.length - 1 ? 'rounded-b-xl' : ''}`}
          >
            
            {/* Plan Name - Col Span 2 */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">
                Name
                {isFree && <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-bold">FREE</span>}
              </label>
              <input
                type="text"
                value={plan.name}
                onChange={(e) => onUpdate(plan.id, 'name', e.target.value)}
                className="w-full px-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium bg-white dark:bg-slate-950 placeholder-slate-400 text-sm"
                placeholder="Basic"
              />
            </div>

            {/* Price & Billing - Col Span 3 */}
            <div className="md:col-span-3 space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Price (HKD) / {isLifetime ? 'Once' : plan.interval === 'yearly' ? 'Year' : 'Mo'}
                </label>
                {/* Payback Badge */}
                <div className={`flex items-center gap-1 text-[10px] px-1.5 rounded-full border cursor-help ${isFreeLabel ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : isProfitable ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700' : 'bg-red-50 text-red-600 border-red-100'}`} title="Payback Period (Months)">
                  <Clock className="w-3 h-3" />
                  <span>{payback.label}</span>
                  {!isFreeLabel && <Tooltip position="top" content="Months to recover Global Avg CAC. Lifetime deals count as instant payback if Price > CAC." width="w-48"/>}
                </div>
              </div>
              <div className="flex gap-2">
                  <div className="relative w-2/3">
                    <input
                      type="number"
                      min="0"
                      value={plan.price}
                      onChange={(e) => onUpdate(plan.id, 'price', parseFloat(e.target.value) || 0)}
                      className={`w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 text-sm ${isFree ? 'border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'}`}
                    />
                     {plan.interval === 'yearly' && plan.price > 0 && (
                        <div className="absolute top-full left-0 text-[9px] text-slate-400 mt-0.5 ml-1">
                          ≈ HK${(plan.price / 12).toFixed(0)}/mo
                        </div>
                     )}
                  </div>
                  <div className="w-1/3">
                    <select
                        value={plan.interval}
                        onChange={(e) => {
                            const newInterval = e.target.value;
                            onUpdate(plan.id, 'interval', newInterval);
                            // Force churn to 0 for lifetime to prevent calculation errors
                            if (newInterval === 'lifetime') {
                                onUpdate(plan.id, 'monthlyChurn', 0);
                            }
                        }}
                        className="w-full px-1 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950 text-sm"
                    >
                        <option value="monthly">/mo</option>
                        <option value="yearly">/yr</option>
                        <option value="lifetime">/life</option>
                    </select>
                  </div>
              </div>
            </div>

             {/* Setup - Col Span 1 */}
             <div className="md:col-span-1 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                 Setup (HKD)
                 <Tooltip position="top" content="One-time fee" width="w-24" />
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={plan.setupFee || 0}
                  onChange={(e) => onUpdate(plan.id, 'setupFee', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-2 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Growth & Churn - Col Span 2 */}
             <div className="md:col-span-2 grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase flex items-center gap-1">
                        Grw% <Tooltip position="top" content="Target monthly growth rate (%) for new subscribers." width="w-48" />
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        value={plan.monthlyGrowth || 0}
                        onChange={(e) => onUpdate(plan.id, 'monthlyGrowth', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-2 border border-blue-200 dark:border-blue-900/50 text-slate-900 dark:text-white bg-blue-50 dark:bg-blue-900/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className={`text-xs font-semibold uppercase flex items-center gap-1 ${isLifetime ? 'text-slate-300 dark:text-slate-600' : 'text-red-500 dark:text-red-400'}`}>
                        Chrn% <Tooltip position="top" content={isLifetime ? "Lifetime plans don't churn revenue (0%)." : "Monthly Churn"} width="w-32" />
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        value={isLifetime ? 0 : plan.monthlyChurn || 0}
                        disabled={isLifetime}
                        onChange={(e) => onUpdate(plan.id, 'monthlyChurn', parseFloat(e.target.value) || 0)}
                        className={`w-full px-2 py-2 border rounded-lg focus:outline-none text-sm ${isLifetime ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800' : 'border-red-200 dark:border-red-900/50 text-slate-900 dark:text-white bg-red-50 dark:bg-red-900/10 focus:ring-2 focus:ring-red-500'}`}
                    />
                </div>
             </div>

            {/* Variable Cost - Col Span 2 */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <BrainCircuit className="w-3 h-3" /> COGS (HKD)
                </label>
              </div>
              <div className="flex gap-1">
                  <div className="relative flex-grow">
                    <input
                      type="number"
                      min="0"
                      value={plan.unitCost}
                      onChange={(e) => onUpdate(plan.id, 'unitCost', parseFloat(e.target.value) || 0)}
                      className={`w-full px-2 py-2 border bg-slate-50 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isFree && plan.unitCost > 0 ? 'border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400' : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'}`}
                    />
                  </div>
                  <button 
                    onClick={() => openEstimator(plan.id)}
                    className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800"
                    title="Estimate"
                  >
                    <Wand2 className="w-4 h-4" />
                  </button>
              </div>
            </div>

            {/* Users - Col Span 1 */}
            <div className="md:col-span-1 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                <Users className="w-3 h-3" /> Users
              </label>
              <input
                type="number"
                min="0"
                value={plan.subscribers}
                onChange={(e) => onUpdate(plan.id, 'subscribers', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950 text-sm"
              />
            </div>

            {/* Delete - Col Span 1 */}
            <div className="md:col-span-1 flex justify-end pb-1">
              <button
                onClick={() => onDelete(plan.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete Plan"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

          </div>
        )}})
        }
        {plans.length === 0 && (
          <div className="p-12 text-center rounded-b-xl">
             <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-8 h-8 text-slate-300 dark:text-slate-600" />
             </div>
             <p className="text-slate-500 dark:text-slate-400 font-medium">No plans defined</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanManager;
