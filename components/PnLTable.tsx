import React from 'react';
import { MonthlyProjection } from '../types';
import { Download } from './Icons';

interface PnLTableProps {
  projections: MonthlyProjection[];
}

const PnLTable: React.FC<PnLTableProps> = ({ projections }) => {
  // Only show first 12 months for density, or maybe all 24 with scroll
  const displayData = projections.slice(0, 12);

  const fmt = (n: number) => Math.round(n).toLocaleString();

  const downloadCSV = () => {
    const headers = ["Month", "Revenue", "COGS", "Gross Profit", "Payroll", "OpEx", "Net Income", "Cash Balance"];
    const rows = projections.map(p => [
      p.month,
      p.revenue.toFixed(2),
      p.cogs.toFixed(2),
      p.grossProfit.toFixed(2),
      p.payroll.toFixed(2),
      p.opex.toFixed(2),
      p.netIncome.toFixed(2),
      p.cashBalance.toFixed(2)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "saas_projections.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Projected Income Statement (Year 1)</h2>
        <button 
          onClick={downloadCSV}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium sticky left-0 bg-slate-50 dark:bg-slate-800 z-10">Metric</th>
              {displayData.map(m => (
                <th key={m.month} className="px-4 py-3 font-medium min-w-[80px]">M{m.month}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Revenue Section */}
            <tr>
              <td className="px-4 py-3 text-left font-medium text-slate-900 dark:text-slate-200 sticky left-0 bg-white dark:bg-slate-900">Revenue</td>
              {displayData.map(m => (
                <td key={m.month} className="px-4 py-3 text-slate-900 dark:text-slate-200 font-medium">${fmt(m.revenue)}</td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 text-left text-slate-500 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-900">COGS</td>
              {displayData.map(m => (
                <td key={m.month} className="px-4 py-3 text-slate-500 dark:text-slate-400">({fmt(m.cogs)})</td>
              ))}
            </tr>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30">
              <td className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100 sticky left-0 bg-slate-50 dark:bg-slate-900">Gross Profit</td>
              {displayData.map(m => (
                <td key={m.month} className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">${fmt(m.grossProfit)}</td>
              ))}
            </tr>

            {/* Expenses Section */}
            <tr>
              <td className="px-4 py-3 text-left text-slate-500 dark:text-slate-400 sticky left-0 bg-white dark:bg-slate-900 pt-6">Operating Expenses</td>
              {displayData.map(m => <td key={m.month} className="pt-6"></td>)}
            </tr>
            <tr>
              <td className="px-4 py-3 text-left text-slate-500 dark:text-slate-400 pl-8 sticky left-0 bg-white dark:bg-slate-900">Payroll (Loaded)</td>
              {displayData.map(m => (
                <td key={m.month} className="px-4 py-3 text-slate-500 dark:text-slate-400">{fmt(m.payroll)}</td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 text-left text-slate-500 dark:text-slate-400 pl-8 sticky left-0 bg-white dark:bg-slate-900">Other OpEx</td>
              {displayData.map(m => (
                <td key={m.month} className="px-4 py-3 text-slate-500 dark:text-slate-400">{fmt(m.opex)}</td>
              ))}
            </tr>

            {/* Net Income Section */}
            <tr className="bg-slate-100/50 dark:bg-slate-800/50 border-t-2 border-slate-200 dark:border-slate-700">
              <td className="px-4 py-3 text-left font-bold text-slate-900 dark:text-white sticky left-0 bg-slate-100 dark:bg-slate-800">Net Income</td>
              {displayData.map(m => (
                <td key={m.month} className={`px-4 py-3 font-bold ${m.netIncome >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  ${fmt(m.netIncome)}
                </td>
              ))}
            </tr>
            
            {/* Cash Balance */}
            <tr className="text-xs border-t border-slate-300 dark:border-slate-700">
              <td className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300 sticky left-0 bg-white dark:bg-slate-900">Cash Balance</td>
              {displayData.map(m => (
                <td key={m.month} className={`px-4 py-2 font-medium ${m.cashBalance < 0 ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                  ${fmt(m.cashBalance)}
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