
import React, { useState } from 'react';
import { MonthlyProjection } from '../types';
import { Download } from './Icons';

interface PnLTableProps {
  projections: MonthlyProjection[];
}

const PnLTable: React.FC<PnLTableProps> = ({ projections }) => {
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('annual');

  // Helpers
  const fmt = (n: number) => Math.round(n).toLocaleString();

  // Logic to switch between Year 1 Monthly and 5-Year Annual
  let displayData: any[] = [];
  let headers: string[] = [];

  if (viewMode === 'monthly') {
    // Show first 12 months
    displayData = projections.slice(0, 12);
    headers = displayData.map(d => `M${d.month}`);
  } else {
    // Aggregate by Year (assuming 60 months)
    for (let year = 1; year <= 5; year++) {
      const yearData = projections.slice((year - 1) * 12, year * 12);
      if (yearData.length === 0) break;

      const aggregated = yearData.reduce((acc, curr) => ({
        month: year,
        revenue: acc.revenue + curr.revenue,
        oneTimeRevenue: acc.oneTimeRevenue + curr.oneTimeRevenue,
        cogs: acc.cogs + curr.cogs,
        grossProfit: acc.grossProfit + curr.grossProfit,
        payroll: acc.payroll + curr.payroll,
        opex: acc.opex + curr.opex,
        netIncome: acc.netIncome + curr.netIncome,
        cashFlow: acc.cashFlow + curr.cashFlow,
        cashBalance: curr.cashBalance // Take end of year balance
      }), { 
        month: year, revenue: 0, oneTimeRevenue: 0, cogs: 0, grossProfit: 0, payroll: 0, opex: 0, netIncome: 0, cashFlow: 0, cashBalance: 0 
      });

      displayData.push(aggregated);
    }
    headers = displayData.map(d => `Year ${d.month}`);
  }

  const downloadCSV = () => {
    // Export ALL data (60 months) regardless of view
    const csvHeaders = [
      "Month", 
      "Total Revenue", 
      "Recurring Revenue (MRR)", 
      "One-Time Revenue", 
      "COGS", 
      "Gross Profit", 
      "Payroll (Loaded)", 
      "OpEx", 
      "Commissions",
      "Net Income", 
      "Net Cash Flow", 
      "Cash Balance",
      "Total Subscribers"
    ];
    
    const rows = projections.map(p => [
      p.month,
      p.revenue.toFixed(2),
      (p.revenue - p.oneTimeRevenue).toFixed(2),
      p.oneTimeRevenue.toFixed(2),
      p.cogs.toFixed(2),
      p.grossProfit.toFixed(2),
      p.payroll.toFixed(2),
      p.opex.toFixed(2),
      p.commissions.toFixed(2),
      p.netIncome.toFixed(2),
      p.cashFlow.toFixed(2),
      p.cashBalance.toFixed(2),
      p.subscribers
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "saas_projections_5year.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {viewMode === 'monthly' ? 'Year 1 Detailed View' : '5-Year Strategic View'}
        </h2>
        
        <div className="flex items-center gap-2">
           <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center">
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'monthly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                Year 1 (Monthly)
              </button>
              <button
                onClick={() => setViewMode('annual')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'annual' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                5-Year (Annual)
              </button>
           </div>
           
           <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

           <button 
             onClick={downloadCSV}
             className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
           >
             <Download className="w-4 h-4" />
             Export
           </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 w-40">Metric</th>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 font-medium min-w-[80px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Revenue Section */}
            <tr>
              <td className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-200 sticky left-0 bg-white dark:bg-slate-900">Total Revenue</td>
              {displayData.map((d, i) => (
                <td key={i} className="px-4 py-3 text-slate-900 dark:text-slate-200 font-medium">${fmt(d.revenue)}</td>
              ))}
            </tr>
             <tr>
              <td className="px-4 py-3 text-left text-slate-500 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-900 pl-8 text-xs">Recurring (MRR)</td>
              {displayData.map((d, i) => (
                <td key={i} className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">${fmt(d.revenue - d.oneTimeRevenue)}</td>
              ))}
            </tr>
             <tr>
              <td className="px-4 py-3 text-left text-slate-500 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-900 pl-8 text-xs">One-Time (Setup)</td>
              {displayData.map((d, i) => (
                <td key={i} className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">${fmt(d.oneTimeRevenue)}</td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 text-left text-slate-500 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-900">COGS</td>
              {displayData.map((d, i) => (
                <td key={i} className="px-4 py-3 text-slate-500 dark:text-slate-400">({fmt(d.cogs)})</td>
              ))}
            </tr>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
              <td className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100 sticky left-0 bg-slate-50 dark:bg-slate-900">Gross Profit</td>
              {displayData.map((d, i) => (
                <td key={i} className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">${fmt(d.grossProfit)}</td>
              ))}
            </tr>

            {/* Expenses Section */}
            <tr>
              <td className="px-4 py-3 text-left text-slate-500 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-900 pt-6">Operating Expenses</td>
              {displayData.map((_, i) => <td key={i} className="pt-6"></td>)}
            </tr>
            <tr>
              <td className="px-4 py-3 text-left text-slate-500 dark:text-slate-400 pl-8 sticky left-0 bg-white dark:bg-slate-900">Payroll (Loaded)</td>
              {displayData.map((d, i) => (
                <td key={i} className="px-4 py-3 text-slate-500 dark:text-slate-400">{fmt(d.payroll)}</td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 text-left text-slate-500 dark:text-slate-400 pl-8 sticky left-0 bg-white dark:bg-slate-900">Other OpEx</td>
              {displayData.map((d, i) => (
                <td key={i} className="px-4 py-3 text-slate-500 dark:text-slate-400">{fmt(d.opex)}</td>
              ))}
            </tr>

            {/* Net Income Section */}
            <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-t-2 border-slate-200 dark:border-slate-700">
              <td className="px-4 py-3 text-left font-bold text-slate-900 dark:text-white sticky left-0 bg-slate-100 dark:bg-slate-800">Net Income</td>
              {displayData.map((d, i) => (
                <td key={i} className={`px-4 py-3 font-bold ${d.netIncome >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  ${fmt(d.netIncome)}
                </td>
              ))}
            </tr>
            
            {/* Cash Flow Section */}
             <tr className="text-xs text-slate-400 pt-4">
               <td className="px-4 py-2 text-left sticky left-0 bg-white dark:bg-slate-900 pt-4">Cash Movement</td>
               {displayData.map((_, i) => <td key={i} className="pt-4"></td>)}
             </tr>
             <tr className="text-xs">
              <td className="px-4 py-2 text-left text-slate-500 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-900">Operating Cash Flow</td>
              {displayData.map((d, i) => (
                <td key={i} className={`px-4 py-2 ${d.cashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  ${fmt(d.cashFlow)}
                </td>
              ))}
            </tr>
            <tr className="text-xs border-t border-slate-300 dark:border-slate-700">
              <td className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300 sticky left-0 bg-white dark:bg-slate-900">Cash Balance (EOP)</td>
              {displayData.map((d, i) => (
                <td key={i} className={`px-4 py-2 font-medium ${d.cashBalance < 0 ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                  ${fmt(d.cashBalance)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PnLTable;
