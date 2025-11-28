import React from 'react';
import { Plan } from '../types';
import { Trash2, Plus, Users, DollarSign, BrainCircuit } from './Icons';
import Tooltip from './Tooltip';

interface PlanManagerProps {
  plans: Plan[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Plan, value: any) => void;
  onDelete: (id: string) => void;
}

const PlanManager: React.FC<PlanManagerProps> = ({ plans, onAdd, onUpdate, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-t-xl">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Subscription Plans</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Define revenue tiers and variable costs.</p>
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
        {plans.map((plan, index) => (
          <div 
            key={plan.id} 
            className={`p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-end hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group ${index === plans.length - 1 ? 'rounded-b-xl' : ''}`}
          >
            
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Plan Name</label>
              <input
                type="text"
                value={plan.name}
                onChange={(e) => onUpdate(plan.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium bg-white dark:bg-slate-950 placeholder-slate-400"
                placeholder="e.g. Basic"
              />
            </div>

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
                  className="w-full pl-7 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center">
                 <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <BrainCircuit className="w-3 h-3" /> Unit Cost
                </label>
                <Tooltip position="top" content="Cost of Goods Sold (COGS) per user. Examples: LLM tokens, server usage, payment processing fees. This directly reduces your Gross Margin." />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  value={plan.unitCost}
                  onChange={(e) => onUpdate(plan.id, 'unitCost', parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Billing</label>
              <select
                value={plan.interval}
                onChange={(e) => onUpdate(plan.id, 'interval', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                <Users className="w-3 h-3" /> Users
              </label>
              <input
                type="number"
                min="0"
                value={plan.subscribers}
                onChange={(e) => onUpdate(plan.id, 'subscribers', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950"
              />
            </div>

            <div className="md:col-span-1 flex justify-end">
              <button
                onClick={() => onDelete(plan.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete Plan"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

          </div>
        ))}
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