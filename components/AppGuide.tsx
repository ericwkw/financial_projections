
import React from 'react';
import { TrendingUp, Users, DollarSign, BrainCircuit, Briefcase } from './Icons';

const AppGuide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Introduction */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Welcome to SaaS Scenario Architect</h2>
        <div className="max-w-4xl">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            This comprehensive financial modeling tool is designed for SaaS founders and CFOs. 
            It allows you to simulate your startup's financial future over the next 5 years by experimenting with pricing, staffing, expenses, and growth assumptions.
          </p>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white mt-8 mb-4">How to Use This Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-16 h-16" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs">1</span>
              Model Inputs
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Go to the <strong>Model Inputs</strong> tab.
            </p>
            <ul className="text-sm text-slate-500 dark:text-slate-400 list-disc list-inside mt-2 space-y-1">
              <li>Add Plans: Define <strong>Growth %</strong> and <strong>Churn %</strong> for each tier individually.</li>
              <li>Hire your <strong>Team</strong> and set salaries.</li>
              <li>List monthly <strong>Operating Expenses</strong>.</li>
            </ul>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-16 h-16" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs">2</span>
              Adjust Scenarios
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Use the <strong>Scenario Bar</strong> (Grouped Controls).
            </p>
            <ul className="text-sm text-slate-500 dark:text-slate-400 list-disc list-inside mt-2 space-y-1">
              <li><strong>Growth:</strong> Viral Rate, Global Growth Factor, Expansion.</li>
              <li><strong>Ops & Cash:</strong> Starting Cash, Salary Growth (Inflation), Commissions.</li>
              <li><strong>Valuation:</strong> Exit Multiple & Equity.</li>
            </ul>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BrainCircuit className="w-16 h-16" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs">3</span>
              Analyze & Export
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Go to <strong>Analysis & P&L</strong>.
            </p>
             <ul className="text-sm text-slate-500 dark:text-slate-400 list-disc list-inside mt-2 space-y-1">
              <li>Check <strong>NRR</strong> & <strong>Burn Multiplier</strong>.</li>
              <li>Ask the <strong>Gemini CFO</strong> for advice.</li>
              <li><strong>Export CSV</strong> for investors.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Benchmarks Cheat Sheet */}
      <div className="bg-indigo-50 dark:bg-indigo-900/10 p-8 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800/30">
        <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-400 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" /> Variable Cost Benchmarks Cheat Sheet
        </h3>
        <p className="text-indigo-800 dark:text-indigo-200/80 mb-6 text-sm">
          Use these industry standard numbers to estimate your <strong>Variable Cost / User</strong>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 border-b pb-2 dark:border-slate-700">Payment Processing</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <li className="flex justify-between"><span>Stripe / PayPal</span> <span className="font-mono text-slate-500">2.9% + 30¢</span></li>
                    <li className="flex justify-between"><span>App Store</span> <span className="font-mono text-slate-500">15% - 30%</span></li>
                </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 border-b pb-2 dark:border-slate-700">AI / LLM Costs</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <li className="flex justify-between"><span>GPT-4o (Input)</span> <span className="font-mono text-slate-500">$5.00 / 1M tokens</span></li>
                    <li className="flex justify-between"><span>GPT-4o (Output)</span> <span className="font-mono text-slate-500">$15.00 / 1M tokens</span></li>
                    <li className="flex justify-between"><span>Gemini 1.5 Flash</span> <span className="font-mono text-slate-500">~$0.35 / 1M tokens</span></li>
                </ul>
            </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 border-b pb-2 dark:border-slate-700">Infrastructure</h4>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                    <li className="flex justify-between"><span>Storage (S3)</span> <span className="font-mono text-slate-500">$0.023 / GB</span></li>
                    <li className="flex justify-between"><span>Data Transfer</span> <span className="font-mono text-slate-500">$0.09 / GB</span></li>
                </ul>
            </div>
        </div>
      </div>

      {/* Concept Clarification */}
      <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-xl shadow-sm border border-amber-100 dark:border-amber-800/30">
        <h3 className="text-lg font-bold text-amber-900 dark:text-amber-400 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" /> Understanding Costs: Variable vs. Fixed
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
             <h4 className="font-bold text-amber-900 dark:text-amber-300 text-sm mb-2">Variable Cost / User (Input)</h4>
             <p className="text-sm text-amber-800 dark:text-amber-200/80 leading-relaxed">
               These are costs that go up <strong>automatically</strong> every time you get a new customer.
               <br/><br/>
               <em>Examples:</em> Stripe Fees (2.9%), AI Tokens ($1/user), SMS credits.
               <br/>
               <strong>Why it's an input:</strong> You estimate the cost *per unit*, and the model calculates the total based on your user count.
             </p>
           </div>
           <div>
             <h4 className="font-bold text-amber-900 dark:text-amber-300 text-sm mb-2">Fixed Operating Expenses</h4>
             <p className="text-sm text-amber-800 dark:text-amber-200/80 leading-relaxed">
               These are costs that stay roughly the <strong>same</strong> regardless of whether you add 1 or 100 users today.
               <br/><br/>
               <em>Examples:</em> Base Database Hosting ($500/mo), Rent, Employee Salaries, Marketing Retainer.
               <br/>
               <strong>Where to put them:</strong> In the "Fixed Operating Expenses" section.
             </p>
           </div>
        </div>
      </div>

      {/* Glossary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Key Metrics Glossary
          </h3>
          <dl className="space-y-6">
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">NRR (Net Revenue Retention)</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                The percentage of revenue you retain from existing customers, including upsells and churn. 
                <br/>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">> 100% means you are growing even without new sales (Negative Churn).</span>
              </dd>
            </div>
             <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">Implementation / Setup Fee</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                One-time fees charged to onboard new customers. These boost cash flow and help recover CAC instantly, but do not contribute to MRR (Valuation).
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">LTV:CAC Ratio</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                <strong>Lifetime Value divided by Customer Acquisition Cost.</strong>
                It measures if you make more money from a customer than it costs to find them.
                <br/><span className="text-emerald-600 dark:text-emerald-400 font-medium">> 3:1 is good.</span> <span className="text-red-500 font-medium">&lt; 1:1 is fatal.</span>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">Magic Number</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Measures sales efficiency. <em>"For every $1 of marketing spend, how much recurring revenue do I create?"</em>
                Target > 0.75.
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" /> Survival & Strategy
          </h3>
          <dl className="space-y-6">
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">Burn Rate</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                How much cash you are losing each month (Revenue - Expenses). If you are profitable, your burn rate is zero.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">Cash Runway</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Time until death. <em>Cash on Hand / Burn Rate</em>. Investors typically want to see 18-24 months of runway after a funding round.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">Rule of 40</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                A balance between Growth and Profitability. 
                <em>Growth Rate % + Profit Margin %</em> should be > 40.
                (e.g., 100% growth with -60% margin = 40).
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-white text-sm">Burn Multiplier</dt>
              <dd className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                How much cash are you burning to add $1 of Net New ARR? 
                <br/>Target &lt; 2. (Burning $2 to add $1 of ARR is okay in early stages, but must improve).
              </dd>
            </div>
          </dl>
        </div>
      </div>

    </div>
  );
};

export default AppGuide;
