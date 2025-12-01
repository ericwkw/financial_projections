import React from 'react';
import { TrendingUp, Users, DollarSign, BrainCircuit, Briefcase, BookOpen } from './Icons';

const AppGuide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* 1. Introduction Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-200" />
          Quick Start Guide
        </h2>
        <div className="max-w-3xl">
          <p className="text-blue-50 text-lg leading-relaxed">
            Welcome! This tool is like a flight simulator for your business. 
            It helps you answer the big question: <strong>"Can I make money with this idea?"</strong>
            <br/><br/>
            You don't need a finance degree. We've translated everything into plain English below.
          </p>
        </div>
      </div>

      {/* 2. Three Step Tutorial */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Build Your Model</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Go to the <strong>Model Inputs</strong> tab. Describe your business.
          </p>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Plans:</strong> "Basic" for $10/mo, "Pro" for $50/mo.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Team:</strong> Who do you need to hire? (Don't forget yourself).</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Expenses:</strong> Monthly bills like Servers, Software, or Ads.</span>
            </li>
          </ul>
        </div>

        {/* Step 2 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
           <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Tweak the Scenarios</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Use the <strong>Sliders</strong> at the top to test "What If" questions.
          </p>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Growth:</strong> What if users tell their friends? (Viral)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Cash:</strong> What if you start with less money?</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Equity:</strong> How much of the company do you keep?</span>
            </li>
          </ul>
        </div>

        {/* Step 3 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
           <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Check the Health</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Go to <strong>Analysis & P&L</strong> to see the results.
          </p>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Runway:</strong> When do you run out of money?</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Profit:</strong> When do you start making money?</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Gemini CFO:</strong> Ask AI for advice.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. The Dictionary (Simple Terms) */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-500" />
          The "Plain English" Dictionary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">ARR (Annual Recurring Revenue)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The total subscription money you make in a year. 
              <br/><span className="italic text-slate-500">Simple Math: Monthly Revenue x 12.</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Churn (The Leaky Bucket)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The percentage of customers who quit every month. 
              <br/><span className="text-red-500 font-medium">If this is high, your business will fail. Keep it under 5%.</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">CAC (Customer Acquisition Cost)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              How much you spend on ads/sales to get <strong>ONE</strong> new customer.
              <br/><span className="italic text-slate-500">Example: Spend $100 on ads -> Get 1 customer. CAC = $100.</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">LTV (Lifetime Value)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The total profit you make from one customer before they quit.
              <br/><span className="text-emerald-600 font-medium">Goal: LTV should be 3x bigger than CAC.</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Runway (Survival Time)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              How many months until your bank account hits $0. 
              <br/><span className="italic text-slate-500">If you have $10k and lose $1k/month, you have 10 months to live.</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Burn Rate</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The amount of cash you lose every month. If you are profitable, your burn rate is $0.
            </p>
          </div>

        </div>
      </div>

      {/* 4. Controls Explained */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-800/50">
         <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          What do the sliders do?
        </h3>
        <div className="space-y-6">
           {/* Growth */}
           <div className="flex gap-4 items-start border-b border-indigo-200 dark:border-indigo-800 pb-4">
             <div className="w-32 font-bold text-indigo-700 dark:text-indigo-300 text-sm mt-1">Viral Referral</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>Free Growth.</strong> If set to 1%, it means for every 100 users you have, they invite 1 new user for free every month.
             </p>
           </div>
           <div className="flex gap-4 items-start border-b border-indigo-200 dark:border-indigo-800 pb-4">
             <div className="w-32 font-bold text-indigo-700 dark:text-indigo-300 text-sm mt-1">Market Efficiency</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>A "Good Luck" Multiplier.</strong> 
               <br/>1.0x = Normal. 
               <br/>1.5x = Your ads are working great (Growth is 50% faster).
               <br/>0.5x = Hard times (Growth is half of what you planned).
             </p>
           </div>
           <div className="flex gap-4 items-start border-b border-indigo-200 dark:border-indigo-800 pb-4">
             <div className="w-32 font-bold text-indigo-700 dark:text-indigo-300 text-sm mt-1">Expansion / Upsell</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>Getting more from existing users.</strong> The % of extra revenue you get from current customers each month (e.g., upgrades).
             </p>
           </div>

           {/* Ops */}
           <div className="flex gap-4 items-start border-b border-indigo-200 dark:border-indigo-800 pb-4">
             <div className="w-32 font-bold text-amber-700 dark:text-amber-400 text-sm mt-1">Payroll Tax</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>Hidden Employee Costs.</strong> Health insurance, taxes, and benefits. Usually adds 20% on top of the salary.
             </p>
           </div>
           <div className="flex gap-4 items-start border-b border-indigo-200 dark:border-indigo-800 pb-4">
             <div className="w-32 font-bold text-amber-700 dark:text-amber-400 text-sm mt-1">Salary Growth</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>Raises.</strong> Employees expect to be paid more every year. 3% is standard for inflation.
             </p>
           </div>
           <div className="flex gap-4 items-start border-b border-indigo-200 dark:border-indigo-800 pb-4">
             <div className="w-32 font-bold text-amber-700 dark:text-amber-400 text-sm mt-1">Sales Commission</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>Bonus for Sales.</strong> If set to 10%, you pay your sales team $10 for every $100 plan they sell.
             </p>
           </div>

           {/* Valuation */}
           <div className="flex gap-4 items-start border-b border-indigo-200 dark:border-indigo-800 pb-4">
             <div className="w-32 font-bold text-purple-700 dark:text-purple-400 text-sm mt-1">Valuation Multiple</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>What are you worth?</strong> Investors value SaaS companies as a multiple of their Revenue (ARR).
               <br/>Example: $1M ARR x 6 Multiple = $6M Valuation.
             </p>
           </div>
           <div className="flex gap-4 items-start">
             <div className="w-32 font-bold text-purple-700 dark:text-purple-400 text-sm mt-1">Founder Equity</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>Your Slice of the Pie.</strong> The percentage of the company YOU own. If you sell the company for $10M and own 50%, you get $5M.
             </p>
           </div>
        </div>
      </div>

    </div>
  );
};

export default AppGuide;