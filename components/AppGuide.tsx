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
            Welcome! This tool helps you predict the future of your software business. 
            It answers the big question: <strong>"Can I make money with this pricing model?"</strong>
            <br/><br/>
            You don't need a finance degree to use it. Just follow the 3 steps below.
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
            Go to the <strong>Model Inputs</strong> tab. This is where you describe your business.
          </p>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Plans:</strong> Create a "Basic" plan for $10 and a "Pro" plan for $50.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Team:</strong> Who do you need to hire? Add yourself and maybe a developer.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Expenses:</strong> Add bills like Server Costs, Software subscriptions, or Rent.</span>
            </li>
          </ul>
        </div>

        {/* Step 2 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
           <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Tweak the Scenarios</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Use the <strong>Sliders</strong> at the top of the screen to test "What If" scenarios.
          </p>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Growth:</strong> What if users tell their friends? (Viral Rate)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Cash:</strong> Do you have $10k or $100k in the bank right now?</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Valuation:</strong> How much equity do you own?</span>
            </li>
          </ul>
        </div>

        {/* Step 3 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
           <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Check the Health</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Go to <strong>Analysis & P&L</strong> to see if you survive.
          </p>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Runway:</strong> How many months until you run out of money?</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Profit:</strong> When do you break even?</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Gemini CFO:</strong> Ask AI for advice on your numbers.</span>
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
              The total amount of subscription money you make in a year. 
              <br/><span className="italic text-slate-500">Formula: Monthly Revenue x 12.</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Churn (The Leaky Bucket)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The percentage of customers who cancel their subscription every month. 
              <br/><span className="text-red-500 font-medium">High churn kills businesses. Keep it under 5%.</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">CAC (Customer Acquisition Cost)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              How much money you spend on ads or sales to get <strong>ONE</strong> new customer.
              <br/><span className="italic text-slate-500">Example: You spend $100 on ads and get 1 customer. Your CAC is $100.</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">LTV (Lifetime Value)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The total profit you make from a single customer before they cancel.
              <br/><span className="text-emerald-600 font-medium">Target: You want LTV to be 3x higher than CAC.</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Runway</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              How much time you have left before your bank account hits $0. 
              <br/><span className="italic text-slate-500">If you have $10k and lose $1k/month, your runway is 10 months.</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Burn Rate</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The amount of cash your company "burns" (loses) every month to keep the lights on.
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
        <div className="space-y-4">
           <div className="flex gap-4 items-start">
             <div className="w-32 font-bold text-indigo-700 dark:text-indigo-300 text-sm mt-1">Viral Referral</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               Free growth. If set to 1%, it means for every 100 users you have, they bring in 1 new user for free every month.
             </p>
           </div>
           <div className="flex gap-4 items-start">
             <div className="w-32 font-bold text-indigo-700 dark:text-indigo-300 text-sm mt-1">Market Efficiency</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               A global multiplier for your growth. 
               <br/><strong>1.0x</strong> = Normal. 
               <br/><strong>1.5x</strong> = Your ads are working great (Growth is 50% faster).
               <br/><strong>0.5x</strong> = Hard times (Growth is half of what you expected).
             </p>
           </div>
           <div className="flex gap-4 items-start">
             <div className="w-32 font-bold text-indigo-700 dark:text-indigo-300 text-sm mt-1">Expansion Rate</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               Upselling. The percentage of extra revenue you get from existing customers each month (e.g., they upgrade from Basic to Pro).
             </p>
           </div>
        </div>
      </div>

    </div>
  );
};

export default AppGuide;