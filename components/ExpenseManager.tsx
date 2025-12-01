
import React from 'react';
import { OperatingExpense } from '../types';
import { Trash2, Plus, DollarSign, TrendingUp } from './Icons';
import Tooltip from './Tooltip';

interface ExpenseManagerProps {
  expenses: OperatingExpense[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof OperatingExpense, value: any) => void;
  onDelete: (id: string) => void;
}

const ExpenseManager: React.FC<ExpenseManagerProps> = ({ expenses, onAdd, onUpdate, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-t-xl">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Fixed Operating Expenses</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
            Costs that don't scale automatically per user.
            <Tooltip content="Fixed monthly costs (e.g. Base Server Fees, Rent, Software Subscriptions). Do NOT put variable per-user costs here. Toggle 'CAC' for Marketing spend." />
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-b-xl">
        {expenses.map((expense, index) => (
          <div 
            key={expense.id} 
            className={`p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group ${index === expenses.length - 1 ? 'rounded-b-xl' : ''}`}
          >
            
            <div className="md:col-span-4 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Expense Item</label>
              <input
                type="text"
                value={expense.name}
                onChange={(e) => onUpdate(expense.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950 font-medium"
                placeholder="e.g. AWS Base Instance"
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Monthly Cost
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">HK$</span>
                {/* Increased padding from pl-10 to pl-14 to accommodate HK$ prefix */}
                <input
                  type="number"
                  min="0"
                  value={expense.amount}
                  onChange={(e) => onUpdate(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full pl-14 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950"
                />
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Category</label>
              <select
                value={expense.category}
                onChange={(e) => onUpdate(expense.id, 'category', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950"
              >
                <option value="Marketing">Marketing</option>
                <option value="Tech">Tech / Server</option>
                <option value="Operations">Operations</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-1 flex flex-col items-center justify-center space-y-1">
               <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center">
                CAC?
               </label>
               <button 
                 onClick={() => onUpdate(expense.id, 'isAcquisition', !expense.isAcquisition)}
                 className={`p-2 rounded-lg transition-colors border ${expense.isAcquisition ? 'bg-indigo-100 border-indigo-300 text-indigo-600 dark:bg-indigo-900/40 dark:border-indigo-700 dark:text-indigo-400' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-600'}`}
                 title="Toggle if this is a Customer Acquisition Cost (e.g. Ads)"
               >
                 <TrendingUp className="w-4 h-4" />
               </button>
            </div>

            <div className="md:col-span-1 flex justify-end">
              <button
                onClick={() => onDelete(expense.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete Expense"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

          </div>
        ))}
        {expenses.length === 0 && (
          <div className="p-12 text-center rounded-b-xl">
             <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-8 h-8 text-slate-300 dark:text-slate-600" />
             </div>
             <p className="text-slate-500 dark:text-slate-400 font-medium">No expenses listed</p>
             <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Add monthly recurring costs here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseManager;
