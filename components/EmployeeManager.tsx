import React from 'react';
import { Employee } from '../types';
import { Trash2, Plus, DollarSign, Briefcase } from './Icons';
import Tooltip from './Tooltip';

interface EmployeeManagerProps {
  employees: Employee[];
  payrollTax: number;
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Employee, value: any) => void;
  onDelete: (id: string) => void;
}

const EmployeeManager: React.FC<EmployeeManagerProps> = ({ employees, payrollTax, onAdd, onUpdate, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-t-xl">
        <div>
           <div className="flex items-center">
             <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Team Structure</h2>
           </div>
           <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
             Salaries exclude {payrollTax}% tax/benefits load.
             <Tooltip content={`An additional ${payrollTax}% is added to every salary in the P&L to account for health insurance, payroll taxes, and benefits. You can adjust this percentage in the settings bar above.`} />
           </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Role</span>
        </button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-b-xl">
        {employees.map((emp, index) => (
          <div 
            key={emp.id} 
            className={`p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group ${index === employees.length - 1 ? 'rounded-b-xl' : ''}`}
          >
            
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> Role / Title
              </label>
              <input
                type="text"
                value={emp.role}
                onChange={(e) => onUpdate(emp.id, 'role', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950 font-medium"
                placeholder="e.g. Senior Engineer"
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Monthly Salary
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">HK$</span>
                <input
                  type="number"
                  min="0"
                  value={emp.salary / 12}
                  onChange={(e) => onUpdate(emp.id, 'salary', (parseFloat(e.target.value) || 0) * 12)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950"
                />
              </div>
              <p className="text-[10px] text-slate-400 text-right pr-1">
                 ≈ HK${(emp.salary).toLocaleString()} / yr
              </p>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Headcount</label>
              <input
                type="number"
                min="1"
                value={emp.count}
                onChange={(e) => onUpdate(emp.id, 'count', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950"
              />
            </div>

            <div className="md:col-span-1 flex justify-end pt-8">
              <button
                onClick={() => onDelete(emp.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete Role"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

          </div>
        ))}
        {employees.length === 0 && (
          <div className="p-12 text-center rounded-b-xl">
            <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
               <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No employees added</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Add roles to estimate your biggest operating expense.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManager;