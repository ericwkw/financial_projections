import React, { useState, useEffect, useMemo } from 'react';
import { Plan, Employee, OperatingExpense, ScenarioParams } from './types';
import { INITIAL_PLANS, INITIAL_EMPLOYEES, INITIAL_EXPENSES, DEFAULT_SCENARIO } from './constants';
import { calculateFinancials, generateProjections } from './services/projectionService';

import PlanManager from './components/PlanManager';
import EmployeeManager from './components/EmployeeManager';
import ExpenseManager from './components/ExpenseManager';
import ScenarioControls from './components/ScenarioControls';
import KPICard from './components/KPICard';
import InvestorDashboard from './components/InvestorDashboard'; // New
import AppGuide from './components/AppGuide';
import { TrendingUp, Sun, Moon, Briefcase, BrainCircuit, BookOpen } from './components/Icons';

const App: React.FC = () => {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState<'input' | 'analysis' | 'guide'>('input');
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [expenses, setExpenses] = useState<OperatingExpense[]>(INITIAL_EXPENSES);
  const [scenarioParams, setScenarioParams] = useState<ScenarioParams>(DEFAULT_SCENARIO);
  
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Sync Theme with DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // --- Handlers ---
  const handleScenarioChange = (field: keyof ScenarioParams, value: number) => {
    setScenarioParams(prev => ({ ...prev, [field]: value }));
  };

  const handleResetScenarios = () => {
    setScenarioParams(DEFAULT_SCENARIO);
  };

  // Generic Update Helper
  const updateItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, id: string, field: string, value: any) => {
    setter(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  const deleteItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, id: string) => {
    setter(prev => prev.filter(item => item.id !== id));
  };

  // --- Financial Calculations ---
  const financials = useMemo(() => 
    calculateFinancials(plans, employees, expenses, scenarioParams),
    [plans, employees, expenses, scenarioParams]
  );

  const { projections, breakEvenMonth } = useMemo(() => 
    // Generate 60 months (5 years) for long-term strategic view
    generateProjections(plans, financials, scenarioParams, 60),
    [plans, financials, scenarioParams]
  );

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const fmtNum = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(n);

  return (
    <div>
      <div className="min-h-screen pb-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">
                  SaaS Scenario Architect <span className="text-blue-600 dark:text-blue-400 font-light">v3</span>
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 transition-colors">
                <button 
                  onClick={() => setActiveTab('input')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'input' 
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Model Inputs
                </button>
                <button 
                  onClick={() => setActiveTab('analysis')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'analysis' 
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Analysis & P&L
                </button>
                 <button 
                  onClick={() => setActiveTab('guide')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'guide' 
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> Guide
                </button>
              </div>

              {/* Mobile Tab Select - Simplified */}
              <div className="md:hidden">
                 <select 
                   value={activeTab} 
                   onChange={(e) => setActiveTab(e.target.value as any)}
                   className="bg-slate-100 dark:bg-slate-800 border-none text-sm rounded-lg p-2 text-slate-900 dark:text-white"
                 >
                   <option value="input">Model Inputs</option>
                   <option value="analysis">Analysis & P&L</option>
                   <option value="guide">Guide</option>
                 </select>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Scenario Controls (Sticky) - Hidden on Guide Tab for cleanliness */}
        {activeTab !== 'guide' && (
          <ScenarioControls 
            params={scenarioParams} 
            onChange={handleScenarioChange} 
            onReset={handleResetScenarios}
          />
        )}

        <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
          
          {/* North Star KPIs (Visible on both Input and Analysis, but we can keep it consistent) */}
          {activeTab !== 'guide' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard 
                title="LTV / CAC Ratio" 
                value={financials.ltvCacRatio > 0 ? `${fmtNum(financials.ltvCacRatio)}x` : 'N/A'} 
                icon={<div className="font-bold text-xs">UNIT ECO</div>}
                trend={financials.ltvCacRatio > 3 ? 'positive' : 'negative'}
                subtext={`LTV: ${fmt(financials.ltv)} | CAC: ${fmt(financials.cac)}`}
                color={financials.ltvCacRatio < 3 && financials.ltvCacRatio > 0 ? "border-red-500/50 bg-red-50 dark:bg-red-900/20 dark:border-red-900" : undefined}
                tooltip="Lifetime Value per Customer divided by Cost to Acquire them. Target > 3x."
              />
              <KPICard 
                title="Cash Runway" 
                value={financials.runwayMonths > 60 ? 'Infinite' : `${fmtNum(financials.runwayMonths)} Months`}
                icon={<Briefcase className="w-5 h-5" />} 
                trend={financials.runwayMonths > 12 ? 'positive' : 'negative'}
                subtext={`Net Burn: ${fmt(financials.burnRate)} / mo`}
                color={financials.runwayMonths < 6 && financials.runwayMonths > 0 ? "border-red-500/50 bg-red-50 dark:bg-red-900/20 dark:border-red-900" : undefined}
                tooltip="How long until you run out of cash. Calculated as Cash / Burn Rate."
              />
              <KPICard 
                title="Rule of 40" 
                value={`${fmtNum(financials.ruleOf40)}%`}
                icon={<TrendingUp className="w-5 h-5" />}
                trend={financials.ruleOf40 > 40 ? 'positive' : 'neutral'}
                subtext={`Growth: ${scenarioParams.growthRate}% + Margin: ${fmtNum(financials.profitMargin)}%`}
                tooltip="Growth % + Profit % should be > 40 for healthy SaaS companies."
              />
               <KPICard 
                title="Valuation Estimate" 
                value={fmt(financials.valuation)} 
                icon={<BrainCircuit className="w-5 h-5" />} 
                subtext={`MRR: ${fmt(financials.mrr)} (${fmtNum(scenarioParams.valuationMultiple)}x ARR)`}
                tooltip="Estimated company value based on ARR multiple."
              />
            </div>
          )}

          {activeTab === 'guide' && <AppGuide />}

          {activeTab === 'input' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Left Column: Core Data */}
              <div className="xl:col-span-7 space-y-8">
                 <PlanManager 
                   plans={plans} 
                   onAdd={() => setPlans([...plans, { id: Date.now().toString(), name: 'New Plan', price: 0, unitCost: 0, interval: 'monthly', subscribers: 0 }])} 
                   onUpdate={(id, f, v) => updateItem(setPlans, id, f, v)} 
                   onDelete={(id) => deleteItem(setPlans, id)} 
                 />
                 <EmployeeManager 
                   employees={employees}
                   payrollTax={scenarioParams.payrollTax}
                   onAdd={() => setEmployees([...employees, { id: Date.now().toString(), role: 'New Role', salary: 0, count: 1 }])}
                   onUpdate={(id, f, v) => updateItem(setEmployees, id, f, v)}
                   onDelete={(id) => deleteItem(setEmployees, id)}
                 />
              </div>

              {/* Right Column: Expenses & Summary */}
              <div className="xl:col-span-5 space-y-8">
                <ExpenseManager 
                  expenses={expenses}
                  onAdd={() => setExpenses([...expenses, { id: Date.now().toString(), name: 'New Expense', amount: 0, category: 'Other', isAcquisition: false }])}
                  onUpdate={(id, f, v) => updateItem(setExpenses, id, f, v)}
                  onDelete={(id) => deleteItem(setExpenses, id)}
                />
                
                {/* Financial Health Summary */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4">Financial Health Check</h3>
                  <div className="space-y-4">
                    
                    {/* Gross Margin */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-300">Gross Margin</span>
                        <span className="font-medium text-slate-900 dark:text-white">{fmtNum(financials.grossMarginPercent * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className={`h-2 rounded-full ${financials.grossMarginPercent > 0.7 ? 'bg-emerald-500' : 'bg-yellow-500'}`} style={{ width: `${Math.min(financials.grossMarginPercent * 100, 100)}%` }}></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Target > 70% for SaaS</p>
                    </div>

                    {/* LTV/CAC */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-300">LTV / CAC Efficiency</span>
                        <span className="font-medium text-slate-900 dark:text-white">{financials.ltvCacRatio > 0 ? `${fmtNum(financials.ltvCacRatio)}x` : 'N/A'}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className={`h-2 rounded-full ${financials.ltvCacRatio > 3 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min(financials.ltvCacRatio * 20, 100)}%` }}></div>
                      </div>
                       <p className="text-xs text-slate-400 mt-1">Target > 3.0x</p>
                    </div>

                     {/* Monthly Breakdown */}
                     <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Gross Revenue</span>
                          <span className="text-slate-900 dark:text-white font-medium">{fmt(financials.mrr)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Total Expenses</span>
                          <span className="text-red-500 font-medium">-{fmt(financials.totalExpenses)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold pt-1">
                          <span className="text-slate-900 dark:text-white">Net Income</span>
                          <span className={financials.netMonthly >= 0 ? "text-emerald-500" : "text-red-500"}>{fmt(financials.netMonthly)}</span>
                        </div>
                     </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
             <InvestorDashboard 
               financials={financials} 
               plans={plans} 
               projections={projections} 
               state={{ plans, employees, expenses, params: scenarioParams, financials }}
               darkMode={darkMode}
             />
          )}

        </main>
      </div>
    </div>
  );
};

export default App;