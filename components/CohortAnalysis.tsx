
import React, { useMemo, useState, useEffect } from 'react';
import { Financials, MonthlyProjection } from '../types';
import { generateCohortData } from '../services/projectionService';
import Tooltip from './Tooltip';
import { Users, DollarSign, Clock, Info, Calculator, RotateCcw, TrendingUp } from './Icons';

interface CohortAnalysisProps {
  projections: MonthlyProjection[];
  financials: Financials;
}

const CohortAnalysis: React.FC<CohortAnalysisProps> = ({ projections, financials }) => {
  const [mode, setMode] = useState<'retention' | 'ltv'>('retention');
  
  // --- SANDBOX STATE ---
  const [isSandbox, setIsSandbox] = useState(false);
  const [simChurn, setSimChurn] = useState(financials.paidChurnRate);
  const [simArppu, setSimArppu] = useState(financials.arppu);
  const [simCac, setSimCac] = useState(financials.cac);

  // Reset sandbox when real financials change (unless actively editing)
  useEffect(() => {
    if (!isSandbox) {
      setSimChurn(financials.paidChurnRate);
      setSimArppu(financials.arppu);
      setSimCac(financials.cac);
    }
  }, [financials, isSandbox]);

  // Create "Active" financials (Real vs Simulated)
  const activeFinancials = useMemo(() => {
    if (!isSandbox) return financials;
    return {
      ...financials,
      paidChurnRate: simChurn,
      arppu: simArppu,
      cac: simCac,
      // Recalculate LTV based on simulated values (simplified approximation for visualization)
      // LTV = Setup + (Recurring Margin / Churn)
      ltv: (financials.weightedAvgOneTimeRevenue * financials.grossMarginPercent) + 
           ((simArppu * financials.recurringGrossMarginPercent) / (Math.max(0.1, simChurn) / 100))
    } as Financials;
  }, [financials, isSandbox, simChurn, simArppu, simCac]);

  const cohorts = useMemo(() => generateCohortData(projections, activeFinancials), [projections, activeFinancials]);

  // Extract Key Insights
  const representativeCohort = cohorts[0]?.metrics || [];
  const retentionAt12Mo = representativeCohort[12]?.retentionRate || 0;
  const breakevenMetric = representativeCohort.find(m => m.isBreakeven);
  const breakevenMonth = breakevenMetric ? breakevenMetric.monthIndex : -1;

  // Helpers
  const getRetentionColor = (rate: number) => {
      if (rate >= 90) return 'bg-emerald-500 text-white';
      if (rate >= 75) return 'bg-emerald-400 text-white';
      if (rate >= 50) return 'bg-emerald-200 text-slate-800';
      if (rate >= 25) return 'bg-red-100 text-slate-800';
      return 'bg-red-200 text-slate-800';
  };

  const getLtvColor = (ltv: number, cac: number) => {
      if (ltv >= cac * 3) return 'bg-emerald-500 text-white'; 
      if (ltv >= cac) return 'bg-emerald-300 text-slate-900'; 
      if (ltv >= cac * 0.5) return 'bg-yellow-100 text-slate-900'; 
      return 'bg-red-100 text-slate-900'; 
  };

  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-HK', { style: 'currency', currency: 'HKD', maximumFractionDigits: 0 }).format(n);
  const fmtNum = (n: number) => new Intl.NumberFormat('en-HK', { maximumFractionDigits: 1 }).format(n);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* 1. Header & Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Customer Survival Analysis
                    {isSandbox && <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full uppercase tracking-wide">Simulator Active</span>}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Visualize how long customers stay and when they become profitable.
                </p>
            </div>

            <div className="flex gap-2">
                 <button
                    onClick={() => setIsSandbox(!isSandbox)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all border ${isSandbox ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'}`}
                >
                    {isSandbox ? <RotateCcw className="w-4 h-4" /> : <Calculator className="w-4 h-4" />}
                    {isSandbox ? "Exit Simulator" : "Simulate Changes"}
                </button>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('retention')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'retention' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        <Users className="w-4 h-4" />
                        Retention
                    </button>
                    <button
                        onClick={() => setMode('ltv')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'ltv' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        <DollarSign className="w-4 h-4" />
                        Profit
                    </button>
                </div>
            </div>
        </div>

        {/* 2. SANDBOX / EXPLAINER SECTION */}
        {isSandbox ? (
            <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-100">What-If Simulator</h3>
                    <span className="text-xs text-indigo-700 dark:text-indigo-300 ml-2">(These changes are temporary. Go to "Model Inputs" to save them.)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Churn Slider */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-slate-700">
                        <label className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <span>Churn Rate</span>
                            <span className="text-indigo-600 dark:text-indigo-400">{simChurn}%</span>
                        </label>
                        <input 
                           type="range" min="0.1" max="15" step="0.1" 
                           value={simChurn}
                           onChange={(e) => setSimChurn(parseFloat(e.target.value))}
                           className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            Lower this to improve <strong>Retention</strong>. <br/>
                            <span className="text-[10px] opacity-70">Real Value: {financials.paidChurnRate}%</span>
                        </p>
                    </div>

                    {/* ARPU Slider */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-slate-700">
                         <label className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <span>Avg Revenue (ARPU)</span>
                            <span className="text-indigo-600 dark:text-indigo-400">${Math.round(simArppu)}</span>
                        </label>
                        <input 
                           type="range" min="10" max="5000" step="10" 
                           value={simArppu}
                           onChange={(e) => setSimArppu(parseFloat(e.target.value))}
                           className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            Raise this to speed up <strong>Payback</strong>. <br/>
                            <span className="text-[10px] opacity-70">Real Value: ${Math.round(financials.arppu)}</span>
                        </p>
                    </div>

                    {/* CAC Slider */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-slate-700">
                         <label className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <span>Acquisition Cost (CAC)</span>
                            <span className="text-indigo-600 dark:text-indigo-400">${Math.round(simCac)}</span>
                        </label>
                        <input 
                           type="range" min="0" max="10000" step="50" 
                           value={simCac}
                           onChange={(e) => setSimCac(parseFloat(e.target.value))}
                           className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            Lower this to reach <strong>Breakeven</strong> faster. <br/>
                            <span className="text-[10px] opacity-70">Real Value: ${Math.round(financials.cac)}</span>
                        </p>
                    </div>
                </div>
            </div>
        ) : (
            <div className={`rounded-xl p-6 border ${mode === 'retention' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800'}`}>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex gap-4 md:w-2/3">
                        <div className={`p-3 rounded-full h-fit ${mode === 'retention' ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200' : 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-200'}`}>
                            {mode === 'retention' ? <Users className="w-6 h-6" /> : <DollarSign className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold mb-1 ${mode === 'retention' ? 'text-blue-900 dark:text-blue-100' : 'text-emerald-900 dark:text-emerald-100'}`}>
                                {mode === 'retention' ? "Retention Analysis" : "Profitability Analysis"}
                            </h3>
                            <p className={`text-sm leading-relaxed ${mode === 'retention' ? 'text-blue-800 dark:text-blue-200' : 'text-emerald-800 dark:text-emerald-200'}`}>
                                {mode === 'retention' 
                                    ? "This shows the % of customers remaining over time. A steeper drop means customers are leaving too fast." 
                                    : "This shows cumulative profit per customer over time. Green squares mean you have covered your CAC and are profitable."}
                            </p>
                        </div>
                    </div>
                    
                    {/* DRIVERS SECTION - Explicitly tells user where to go */}
                    <div className="md:w-1/3 bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> How to improve this?
                        </h4>
                        <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                             <li className="flex justify-between">
                                <span>1. Reduce Churn:</span>
                                <span className="font-semibold text-slate-900 dark:text-white">Inputs &gt; Plans</span>
                             </li>
                             <li className="flex justify-between">
                                <span>2. Increase Price:</span>
                                <span className="font-semibold text-slate-900 dark:text-white">Inputs &gt; Plans</span>
                             </li>
                             <li className="flex justify-between">
                                <span>3. Lower CAC:</span>
                                <span className="font-semibold text-slate-900 dark:text-white">Inputs &gt; Expenses</span>
                             </li>
                        </ul>
                        <button 
                            onClick={() => setIsSandbox(true)}
                            className="mt-3 w-full py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded transition-colors"
                        >
                            Or Simulate Here &rarr;
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* 3. High Level Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">1-Year Retention</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {Math.round(retentionAt12Mo)}%
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                   of customers are still active after 12 months.
                </p>
            </div>
             <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Time to Profit</span>
                </div>
                <div className={`text-3xl font-bold ${breakevenMonth > -1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                    {breakevenMonth === 0 ? "Instant" : breakevenMonth > -1 ? `Month ${breakevenMonth}` : "Never"}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                   {breakevenMonth > -1 
                     ? `is when a customer pays back their HK$${Math.round(activeFinancials.cac)} acquisition cost.` 
                     : "You never earn back your acquisition cost with current margins."}
                </p>
            </div>
        </div>

        {/* 4. The Heatmap Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                 <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Detailed Cohort History</h4>
                 <div className="text-xs text-slate-500">
                     {mode === 'retention' ? 'Values shown in %' : 'Values shown in Cumulative Profit (HKD)'}
                 </div>
             </div>
             
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-center border-collapse">
                     <thead>
                         <tr>
                             <th className="p-4 text-left font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700 min-w-[140px] sticky left-0 z-10">
                                 Sign Up Date
                             </th>
                             <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700 min-w-[100px]">
                                 Cohort Size
                             </th>
                             {Array.from({ length: 13 }).map((_, i) => (
                                 <th key={i} className="p-4 font-medium text-slate-500 dark:text-slate-400 border-b dark:border-slate-700 min-w-[60px] bg-slate-50 dark:bg-slate-800">
                                     <div className="flex flex-col items-center">
                                         <span>M{i}</span>
                                         {i === 0 && <span className="text-[9px] uppercase tracking-wide opacity-70">(Join)</span>}
                                     </div>
                                 </th>
                             ))}
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                         {cohorts.map((cohort, idx) => (
                             <tr key={cohort.acquisitionMonth}>
                                 <td className="p-3 text-left font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-900 sticky left-0 z-10 border-r border-slate-100 dark:border-slate-800">
                                     Month {cohort.acquisitionMonth}
                                 </td>
                                 <td className="p-3 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800">
                                     {cohort.size} Users
                                 </td>
                                 {cohort.metrics.map((metric, i) => (
                                     <td key={i} className="p-1">
                                         {mode === 'retention' ? (
                                             <div 
                                                className={`w-full h-full py-2 rounded text-xs font-medium ${getRetentionColor(metric.retentionRate)}`}
                                                title={`${metric.retentionRate.toFixed(1)}% Retention in Month ${i}`}
                                             >
                                                 {metric.retentionRate > 5 ? `${Math.round(metric.retentionRate)}%` : ''}
                                             </div>
                                         ) : (
                                             <div 
                                                className={`w-full h-full py-2 rounded text-xs font-medium transition-all ${getLtvColor(metric.cumulativeLtv, activeFinancials.cac)} ${metric.isBreakeven ? 'ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-slate-900' : ''}`}
                                                title={`Month ${i} Cumulative Profit: ${fmtCurrency(metric.cumulativeLtv)}`}
                                             >
                                                 {metric.cumulativeLtv > 0 ? `$${Math.round(metric.cumulativeLtv)}` : '$0'}
                                             </div>
                                         )}
                                     </td>
                                 ))}
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
             
             {/* 5. The "Legend" Footer */}
             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
                 {mode === 'retention' ? (
                     <div className="flex flex-wrap gap-6 items-center justify-center text-xs text-slate-600 dark:text-slate-400">
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded bg-emerald-500"></div> <span>90%+ (Excellent)</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded bg-emerald-200"></div> <span>50-75% (Okay)</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded bg-red-200"></div> <span>&lt; 25% (High Churn)</span>
                         </div>
                     </div>
                 ) : (
                     <div className="flex flex-wrap gap-6 items-center justify-center text-xs text-slate-600 dark:text-slate-400">
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded bg-red-100"></div> <span>Loss (Have not covered CAC)</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded bg-emerald-300"></div> <span>Profitable (Covered CAC)</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded border-2 border-emerald-500"></div> <span>Breakeven Moment</span>
                         </div>
                     </div>
                 )}
             </div>
        </div>
    </div>
  );
};

export default CohortAnalysis;
