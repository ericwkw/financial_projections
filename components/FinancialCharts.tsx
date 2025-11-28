import React from 'react';
import {
  BarChart,
  Bar,
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
  Area
} from 'recharts';
import { Plan, Financials } from '../types';

interface FinancialChartsProps {
  financials: Financials;
  plans: Plan[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const FinancialCharts: React.FC<FinancialChartsProps> = ({ financials, plans }) => {
  // Data for Revenue Breakdown (Pie)
  const revenueData = plans.map((plan) => {
    const monthlyVal = plan.interval === 'yearly' ? plan.price / 12 : plan.price;
    return {
      name: plan.name,
      value: Math.round(monthlyVal * plan.subscribers),
    };
  }).filter(d => d.value > 0);

  // Data for Profit vs Expense (Bar)
  const overviewData = [
    {
      name: 'Monthly Financials',
      Revenue: financials.mrr,
      Expenses: financials.monthlyExpenses,
      Net: financials.netMonthly,
    },
  ];

  // Simulated Projection Data (12 months linear growth assumption)
  const projectionData = Array.from({ length: 12 }, (_, i) => {
    const growthFactor = 1 + (i * 0.05); // 5% MoM growth assumption for vis
    return {
      month: `M${i + 1}`,
      Revenue: Math.round(financials.mrr * growthFactor),
      Expenses: Math.round(financials.monthlyExpenses * (1 + (i * 0.01))), // 1% expense growth
      Profit: Math.round((financials.mrr * growthFactor) - (financials.monthlyExpenses * (1 + (i * 0.01)))),
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Revenue Source Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Revenue by Plan</h3>
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
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Overview Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Monthly Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={overviewData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" hide />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} cursor={{fill: 'transparent'}} />
              <Legend />
              <Bar dataKey="Revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              <Bar dataKey="Expenses" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
              <Bar dataKey="Net" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Projection Chart */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">12-Month Projection (Assuming 5% MoM Growth)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={projectionData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend />
              <Area type="monotone" dataKey="Profit" fill="#d1fae5" stroke="#10b981" />
              <Line type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeDasharray="5 5" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default FinancialCharts;