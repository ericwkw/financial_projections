import React from 'react';
import { TrendingUp, Users, DollarSign, BrainCircuit, Briefcase } from './Icons';

const AppGuide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Introduction */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Welcome to SaaS Scenario Architect</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          This application is designed to help founders and CFOs model the financial future of a subscription-based (SaaS) business.
          It allows you to test pricing strategies, staffing plans, and growth assumptions to see how they impact your company's value and survival.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">1. Input Your Data</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Define your subscription tiers, hire your team, and list your monthly expenses.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">2. Adjust Scenarios</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Use the sliders to test "What if?" scenarios. What if growth slows? What if churn spikes?</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">3. Analyze Health</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Review investor-grade metrics (LTV/CAC, Rule of 40) and get AI advice on your strategy.</p>
          </div>
        </div>
      </div>

      {/* Glossary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Key Metrics Glossary
          </h3>
          <dl className="space-y-4">
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">MRR / ARR</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monthly Recurring Revenue and Annual Recurring Revenue. The predictability of this revenue is why SaaS companies are valued highly.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">COGS (Cost of Goods Sold)</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1">Direct costs to serve a customer (e.g., server hosting, LLM API fees). This is separate from Operating Expenses (OpEx) like rent or marketing.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">LTV (Lifetime Value)</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1">The total profit you expect from a single customer before they cancel (Churn).</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">CAC (Customer Acquisition Cost)</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total marketing/sales spend divided by the number of new customers acquired.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">LTV:CAC Ratio</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1">The "God Metric" for investors. It measures efficiency. &gt;3:1 is good. &gt;5:1 is excellent. &lt;1:1 means you lose money on every customer.</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" /> Survival & Strategy
          </h3>
          <dl className="space-y-4">
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">Burn Rate</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1">How much cash you are losing each month. If you are profitable, your burn rate is zero.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">Cash Runway</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1">How many months until your bank account reaches $0. Calculated as: <em>Cash on Hand / Burn Rate</em>.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">Rule of 40</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1">A principle that states your Growth Rate % + Profit Margin % should equal 40 or higher. High growth can justify high losses.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">Valuation Multiple</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1">SaaS companies are often valued at a multiple of their revenue (ARR), not just profit. Typical multiples range from 3x to 10x depending on growth speed.</dd>
            </div>
          </dl>
        </div>
      </div>

    </div>
  );
};

export default AppGuide;