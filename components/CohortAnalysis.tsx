
import React, { useMemo, useState } from 'react';
import { Financials, MonthlyProjection } from '../types';
import { generateCohortData } from '../services/projectionService';
import Tooltip from './Tooltip';
import { Users, DollarSign } from './Icons';

interface CohortAnalysisProps {
  projections: MonthlyProjection[];
  financials: Financials;
}

const CohortAnalysis: React.FC<CohortAnalysisProps> = ({ projections, financials }) => {
  const [mode, setMode] = useState<'retention' | 'ltv'>('retention');
  
  const cohorts = useMemo(() => generateCohortData(projections, financials), [projections, financials]);

  // Color scales
  const getRetentionColor = (rate: number) => {
      // 100% -> Green, 0% -> Red
      // Simple opacity based on rate
      if (rate >= 90) return 'bg-emerald-500 text-white';
      if (rate >= 75) return 'bg-emerald-400 text-white';
      if (rate >= 50) return 'bg-emerald-200 text-slate-800';
      if (rate >= 25) return 'bg-red-100 text-slate-800';
      return 'bg-red-200 text-slate-800';
  };

  const getLtvColor = (ltv: number, cac: number) => {
      if (ltv >= cac * 3) return 'bg-emerald-500 text-white'; // Great
      if (ltv >= cac) return 'bg-emerald-300 text-slate-900'; // Breakeven
      if (ltv >= cac * 0.5) return 'bg-yellow-100 text-slate-900'; // Recovering
      return 'bg-red-100 text-slate-900'; // Negative
  };

  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-HK', { style: 'currency', currency: 'HKD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Cohort Analysis
                    <Tooltip content="Tracks specific groups of users (Cohorts) acquired in the same month to see how they behave over time." />
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Visualizing <strong>{mode === 'retention' ? 'User Retention' : 'Cumulative Gross Profit'}</strong> based on current Churn ({financials.paidChurnRate.toFixed(1)}%) and ARPU.
                </p>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                    onClick={() => setMode('retention')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'retention' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    <Users className="w-4 h-4" />
                    Retention %
                </button>
                <button
                    onClick={() => setMode('ltv')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === 'ltv' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    <DollarSign className="w-4 h-4" />
                    Cumulative LTV
                </button>
            </div>
        </div>

        {/* Heatmap Container */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-center border-collapse">
                     <thead>
                         <tr>
                             <th className="p-4 text-left font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700 min-w-[140px] sticky left-0 z-10">Cohort</th>
                             <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700 min-w-[100px]">Users</th>
                             {Array.from({ length: 13 }).map((_, i) => (
                                 <th key={i} className="p-4 font-medium text-slate-500 dark:text-slate-400 border-b dark:border-slate-700 min-w-[60px] bg-slate-50 dark:bg-slate-800">
                                     M{i}
                                 </th>
                             ))}
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                         {cohorts.map((cohort) => (
                             <tr key={cohort.acquisitionMonth}>
                                 <td className="p-3 text-left font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-900 sticky left-0 z-10 border-r border-slate-100 dark:border-slate-800">
                                     Month {cohort.acquisitionMonth}
                                 </td>
                                 <td className="p-3 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800">
                                     {cohort.size}
                                 </td>
                                 {cohort.metrics.map((metric, i) => (
                                     <td key={i} className="p-1">
                                         {mode === 'retention' ? (
                                             <div 
                                                className={`w-full h-full py-2 rounded text-xs font-medium ${getRetentionColor(metric.retentionRate)}`}
                                                title={`${metric.retentionRate.toFixed(1)}% Retention`}
                                             >
                                                 {metric.retentionRate > 5 ? `${Math.round(metric.retentionRate)}%` : ''}
                                             </div>
                                         ) : (
                                             <div 
                                                className={`w-full h-full py-2 rounded text-xs font-medium ${getLtvColor(metric.cumulativeLtv, cohort.cac)} ${metric.isBreakeven ? 'ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-slate-900' : ''}`}
                                                title={`Cum. LTV: ${fmtCurrency(metric.cumulativeLtv)}`}
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
             
             {/* Legend / Footer */}
             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-6 items-center justify-between">
                 <div className="text-xs text-slate-500 dark:text-slate-400">
                     * Projections assume constant churn rate of <strong>{financials.paidChurnRate.toFixed(1)}%</strong> and ARPU of <strong>{fmtCurrency(financials.arppu)}</strong>.
                 </div>
                 
                 {mode === 'ltv' && (
                     <div className="flex items-center gap-4 text-xs">
                         <span className="font-semibold text-slate-700 dark:text-slate-300">Legend:</span>
                         <div className="flex items-center gap-1">
                             <div className="w-3 h-3 rounded bg-red-100"></div> <span>Loss</span>
                         </div>
                         <div className="flex items-center gap-1">
                             <div className="w-3 h-3 rounded bg-emerald-300"></div> <span>Breakeven (LTV {'>'} CAC)</span>
                         </div>
                         <div className="flex items-center gap-1">
                             <div className="w-3 h-3 rounded bg-emerald-500"></div> <span>Profitable (3x CAC)</span>
                         </div>
                         <div className="flex items-center gap-1 ml-2">
                             <div className="w-3 h-3 rounded border-2 border-emerald-500"></div> <span>Payback Month</span>
                         </div>
                     </div>
                 )}
             </div>
        </div>
    </div>
  );
};

export default CohortAnalysis;
