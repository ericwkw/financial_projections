
import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
  Area,
  ReferenceLine,
  LineChart
} from 'recharts';
import { Plan, Financials, MonthlyProjection } from '../types';

interface FinancialChartsProps {
  financials: Financials;
  plans: Plan[];
  projections: MonthlyProjection[];
  darkMode: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const FinancialCharts: React.FC<FinancialChartsProps> = ({ financials, plans, projections, darkMode }) => {
  // Data for Revenue Breakdown (Pie)
  const revenueData = plans.map((plan) => {
    const monthlyVal = plan.interval === 'yearly' ? plan.price / 12 : plan.price;
    return {
      name: plan.name,
      value: Math.round(monthlyVal * plan.subscribers),
    };
  }).filter(d => d.value > 0);

  // Cost Structure Breakdown (Pie)
  // Define colors directly in the data to ensure stability when filtering
  const costData = [
    { name: 'Payroll', value: financials.payrollMonthly, color: '#ef4444' }, // Red-500
    { name: 'OpEx', value: financials.opexMonthly, color: '#f59e0b' },    // Amber-500
    { name: 'COGS', value: financials.cogs, color: '#64748b' }           // Slate-500
  ].filter(d => d.value > 0);

  // Data for Burn Rate Chart
  const burnData = projections.map(p => ({
    month: p.month,
    netBurn: Math.max(0, -p.netIncome) // Show 0 if profitable
  }));

  // Chart Styles based on Mode
  const axisColor = darkMode ? '#94a3b8' : '#64748b';
  // Lighter grid for light mode (e2e8f0) to be barely visible but present
  const gridColor = darkMode ? '#334155' : '#e2e8f0'; 
  const tooltipStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderColor: darkMode ? '#334155' : '#e2e8f0',
    color: darkMode ? '#f8fafc' : '#0f172a',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  const formatCurrencyAxis = (val: number) => {
    if (Math.abs(val) >= 1000000) return `HK$${(val/1000000).toFixed(1)}M`;
    if (Math.abs(val) >= 1000) return `HK$${(val/1000).toFixed(0)}k`;
    return `HK$${val}`;
  };

  const formatMonthAxis = (month: number) => {
    // Show Years on the axis to reduce clutter for 60-month view
    if (month % 12 === 0) return `Year ${month / 12}`;
    if (month === 1) return 'Start';
    return ''; 
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 24-Month Projection */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-2 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">5-Year Financial Projection (HKD)</h3>
          <div className="flex gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div>Profit</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div>Loss</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div>Revenue</div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={projections}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: axisColor, fontSize: 12}} 
                tickFormatter={formatMonthAxis} 
                interval={5} // Show fewer ticks
              />
              <YAxis axisLine={false} tickLine={false} tick={{fill: axisColor, fontSize: 12}} tickFormatter={formatCurrencyAxis} />
              <Tooltip 
                formatter={(value: number) => [`HK$${Math.round(value).toLocaleString()}`, '']}
                labelFormatter={(l) => `Month ${l}`}
                contentStyle={tooltipStyle}
                itemStyle={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}
              />
              <ReferenceLine y={0} stroke={darkMode ? "#475569" : "#cbd5e1"} />
              <Area type="monotone" dataKey="netIncome" fill="url(#colorNet)" stroke="#10b981" strokeWidth={2} fillOpacity={0.1} name="Net Income" />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} name="Total Revenue" />
              <Line type="monotone" dataKey="grossProfit" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Gross Profit" />
              
              <defs>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NEW: Net Burn Rate Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 lg:col-span-2 transition-colors">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">Net Burn Rate Trend</h3>
             <p className="text-xs text-slate-400">Cash burn per month (Lower is better)</p>
         </div>
         <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={burnData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
               <CartesianGrid stroke={gridColor} vertical={false} />
               <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: axisColor, fontSize: 12}} 
                  tickFormatter={formatMonthAxis} 
                  interval={5} 
               />
               <YAxis axisLine={false} tickLine={false} tick={{fill: axisColor, fontSize: 12}} tickFormatter={formatCurrencyAxis} />
               <Tooltip 
                  formatter={(value: number) => [`HK$${Math.round(value).toLocaleString()}`, 'Net Burn']}
                  labelFormatter={(l) => `Month ${l}`}
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: '#ef4444' }}
               />
               <Line type="monotone" dataKey="netBurn" stroke="#ef4444" strokeWidth={2} dot={false} name="Net Burn" activeDot={{ r: 8 }} />
             </LineChart>
           </ResponsiveContainer>
         </div>
      </div>

      {/* Revenue Source Breakdown */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4">Revenue Mix</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={revenueData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                stroke={darkMode ? '#0f172a' : '#fff'}
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `HK$${value.toLocaleString()}`} contentStyle={tooltipStyle} itemStyle={{ color: darkMode ? '#e2e8f0' : '#1e293b' }} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Cost Structure Breakdown */}
       <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4">Monthly Cost Structure</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                stroke={darkMode ? '#0f172a' : '#fff'}
              >
                {costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `HK$${value.toLocaleString()}`} contentStyle={tooltipStyle} itemStyle={{ color: darkMode ? '#e2e8f0' : '#1e293b' }} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default FinancialCharts;
