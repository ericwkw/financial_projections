import React, { useState, useEffect, useMemo } from 'react';
import { Plan, Employee, Financials } from './types';
import { INITIAL_PLANS, INITIAL_EMPLOYEES } from './constants';
import PlanManager from './components/PlanManager';
import EmployeeManager from './components/EmployeeManager';
import KPICard from './components/KPICard';
import FinancialCharts from './components/FinancialCharts';
import GeminiAdvisor from './components/GeminiAdvisor';
import { DollarSign, TrendingUp, Users } from './components/Icons';

const App: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);

  // --- Handlers for Plans ---
  const addPlan = () => {
    const newPlan: Plan = {
      id: Date.now().toString(),
      name: 'New Plan',
      price: 0,
      interval: 'monthly',
      subscribers: 0,
    };
    setPlans([...plans, newPlan]);
  };

  const updatePlan = (id: string, field: keyof Plan, value: any) => {
    setPlans(plans.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deletePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  // --- Handlers for Employees ---
  const addEmployee = () => {
    const newEmp: Employee = {
      id: Date.now().toString(),
      role: 'New Role',
      salary: 0,
      count: 1,
    };
    setEmployees([...employees, newEmp]);
  };

  const updateEmployee = (id: string, field: keyof Employee, value: any) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  // --- Financial Calculations ---
  const financials: Financials = useMemo(() => {
    let monthlyRevenue = 0;
    
    plans.forEach(plan => {
      const pricePerMonth = plan.interval === 'yearly' ? plan.price / 12 : plan.price;
      monthlyRevenue += pricePerMonth * plan.subscribers;
    });

    let annualExpenses = 0;
    employees.forEach(emp => {
      annualExpenses += emp.salary * emp.count;
    });
    
    const monthlyExpenses = annualExpenses / 12;

    return {
      mrr: monthlyRevenue,
      arr: monthlyRevenue * 12,
      monthlyExpenses,
      annualExpenses,
      netMonthly: monthlyRevenue - monthlyExpenses,
      profitMargin: monthlyRevenue > 0 ? ((monthlyRevenue - monthlyExpenses) / monthlyRevenue) * 100 : 0
    };
  }, [plans, employees]);

  // Format currency helper
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">SaaS Scenario Architect</h1>
          </div>
          <div className="text-sm text-slate-500">
             Build. Analyze. Optimize.
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="Monthly Revenue (MRR)" 
            value={fmt(financials.mrr)} 
            icon={<DollarSign className="w-5 h-5" />} 
            subtext={`ARR: ${fmt(financials.arr)}`}
            trend="neutral"
          />
          <KPICard 
            title="Monthly Expenses" 
            value={fmt(financials.monthlyExpenses)} 
            icon={<Users className="w-5 h-5" />} 
            subtext={`${employees.reduce((acc, e) => acc + e.count, 0)} Active Staff`}
            trend="neutral"
          />
          <KPICard 
            title="Net Profit (Monthly)" 
            value={fmt(financials.netMonthly)} 
            icon={<TrendingUp className="w-5 h-5" />} 
            trend={financials.netMonthly >= 0 ? 'positive' : 'negative'}
            subtext={financials.netMonthly >= 0 ? 'Profitable' : 'Burn Rate Warning'}
          />
           <KPICard 
            title="Profit Margin" 
            value={`${financials.profitMargin.toFixed(1)}%`} 
            icon={<div className="font-bold text-sm">%</div>} 
            trend={financials.profitMargin > 20 ? 'positive' : financials.profitMargin > 0 ? 'neutral' : 'negative'}
            subtext="Target: >20%"
          />
        </div>

        {/* Main Content: Left Inputs, Right Visuals */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Data Management */}
          <div className="xl:col-span-5 space-y-8">
             <PlanManager 
               plans={plans} 
               onAdd={addPlan} 
               onUpdate={updatePlan} 
               onDelete={deletePlan} 
             />
             <EmployeeManager 
               employees={employees}
               onAdd={addEmployee}
               onUpdate={updateEmployee}
               onDelete={deleteEmployee}
             />
          </div>

          {/* Right Column: Visuals & AI */}
          <div className="xl:col-span-7 space-y-8">
            <GeminiAdvisor state={{ plans, employees }} />
            <FinancialCharts financials={financials} plans={plans} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;