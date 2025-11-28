import React from 'react';
import { Plan } from '../types';
import { Trash2, Plus, Users, DollarSign } from './Icons';

interface PlanManagerProps {
  plans: Plan[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Plan, value: any) => void;
  onDelete: (id: string) => void;
}

const PlanManager: React.FC<PlanManagerProps> = ({ plans, onAdd, onUpdate, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Subscription Plans</h2>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Plan</span>
        </button>
      </div>
      <div className="divide-y divide-slate-100">
        {plans.map((plan) => (
          <div key={plan.id} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-end hover:bg-slate-50 transition-colors">
            
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Plan Name</label>
              <input
                type="text"
                value={plan.name}
                onChange={(e) => onUpdate(plan.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                placeholder="e.g. Basic"
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  value={plan.price}
                  onChange={(e) => onUpdate(plan.id, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Billing</label>
              <select
                value={plan.interval}
                onChange={(e) => onUpdate(plan.id, 'interval', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                <Users className="w-3 h-3" /> Subscribers
              </label>
              <input
                type="number"
                min="0"
                value={plan.subscribers}
                onChange={(e) => onUpdate(plan.id, 'subscribers', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div className="md:col-span-1 flex justify-end">
              <button
                onClick={() => onDelete(plan.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Plan"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

          </div>
        ))}
        {plans.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No plans added yet. Click "Add Plan" to start.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanManager;