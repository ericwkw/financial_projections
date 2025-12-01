import React, { useState } from 'react';
import { Plan } from '../types';
import { Trash2, Plus, Users, DollarSign, BrainCircuit, Wand2 } from './Icons';
import Tooltip from './Tooltip';
import CostEstimatorModal from './CostEstimatorModal';

interface PlanManagerProps {
  plans: Plan[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Plan, value: any) => void;
  onDelete: (id: string) => void;
}

const PlanManager: React.FC<PlanManagerProps> = ({ plans, onAdd, onUpdate, onDelete }) => {
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
          <p className="text-sm text-slate-500 dark:text-slate-400">Define revenue tiers and variable costs per user.</p>
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
          return (
          <div 
            key={plan.id} 
            className={`p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group ${index === plans.length - 1 ? 'rounded-b-xl' : ''}`}
          >
            
            {/* Plan Name - Col Span 2 */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2">
                Plan Name
                {isFree && <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-bold">FREE</span>}
              </label>
              <input
                type="text"
                value={plan.name}
                onChange={(e) => onUpdate(plan.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium bg-white dark:bg-slate-950 placeholder-slate-400 text-sm"
                placeholder="Basic"
              />
            </div>

            {/* Price - Col Span 2 */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  value={plan.price}
                  onChange={(e) => onUpdate(plan.id, 'price', parseFloat(e.target.value) || 0)}
                  className={`w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 text-sm ${isFree ? 'border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'}`}
                />
              </div>
            </div>

            {/* Setup Fee - Col Span 2 */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1 text-slate-600 dark:text-slate-300">
                   Setup Fee
                </label>
                <Tooltip position="top" content="One-time implementation fee. Boosts cash flow, excludes MRR." width="w-40" />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  value={plan.setupFee || 0}
                  onChange={(e) => onUpdate(plan.id, 'setupFee', parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Variable Cost - Col Span 2 */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <BrainCircuit className="w-3 h-3" /> Var. Cost <span className="text-[9px] ml-1 opacity-70">(COGS)</span>
                </label>
                <Tooltip position="top" content={isFree ? "Costs for free users are pure loss." : "Marginal cost per user (Stripe, API). Reduces Margin."} width="w-40" />
              </div>
              <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input
                      type="number"
                      min="0"
                      value={plan.unitCost}
                      onChange={(e) => onUpdate(plan.id, 'unitCost', parseFloat(e.target.value) || 0)}
                      className={`w-full pl-7 pr-3 py-2 border bg-slate-50 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${isFree && plan.unitCost > 0 ? 'border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400' : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'}`}
                    />
                  </div>
                  <button 
                    onClick={() => openEstimator(plan.id)}
                    className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800"
                    title="Estimate with AI"
                  >
                    <Wand2 className="w-4 h-4" />
                  </button>
              </div>
            </div>

            {/* Billing - Col Span 2 */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Billing</label>
              <select
                value={plan.interval}
                onChange={(e) => onUpdate(plan.id, 'interval', e.target.value)}
                disabled={isFree}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950 disabled:opacity-50 text-sm"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
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
             <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Add a subscription plan to start modeling revenue.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanManager;