
import React from 'react';
import { TrendingUp, Users, DollarSign, BrainCircuit, Briefcase, BookOpen, Info } from './Icons';

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
            Welcome! This tool is a flight simulator for your business. 
            It helps you answer the ultimate question: <strong>"Can I make money with this idea?"</strong>
            <br/><br/>
            No finance degree required. We've translated everything into plain English below.
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
            Go to the <strong>Model Inputs</strong> tab. Describe your business today.
          </p>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Plans:</strong> What do you sell? (e.g. HK$80/mo Basic Plan).</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Team:</strong> Who is on your payroll?</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>Expenses:</strong> Monthly bills like Servers or Ads.</span>
            </li>
          </ul>
        </div>

        {/* Step 2 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
           <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Tweak the Scenarios</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Use the <strong>Sliders</strong> at the top to ask "What If?"
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

      {/* 3. Common Questions (FAQ) - NEW SECTION */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-500" />
          Common Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
           <div>
             <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
               Q: How is "Lifetime Value" (LTV) calculated?
             </h4>
             <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
               <strong>A: It's (Monthly Profit) × (Average Stay).</strong><br/>
               The tricky part is knowing "how long they stay." We use your <strong>Churn Rate</strong> to estimate this.<br/>
               <em>Logic:</em> If 10% of people quit every month, the average person stays for 10 months (100% / 10% = 10).<br/>
               If you make HK$50 profit/month and they stay 10 months, LTV is <strong>HK$500</strong>.
             </p>
           </div>
           <div>
             <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
               Q: What is the "Magic Number"?
             </h4>
             <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
               <strong>A: Think of it like a Vending Machine.</strong><br/>
               If you put HK$1 into the machine (Marketing Spend), how much Annual Revenue comes out?<br/>
               • <strong>1.0:</strong> You put in HK$1, you get HK$1 back in yearly sales. (Good).<br/>
               • <strong>0.5:</strong> You put in HK$1, you only get HK$0.50 back. (Bad Machine).
             </p>
           </div>
           <div>
             <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
               Q: What is the "Burn Multiplier"?
             </h4>
             <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
               <strong>A: It's your startup's "Gas Mileage".</strong><br/>
               How much cash do you burn to add HK$1 of new revenue?<br/>
               • <strong>1.5x:</strong> You burn HK$1.50 to grow by HK$1. (Okay for early stage).<br/>
               • <strong>3.0x:</strong> You burn HK$3.00 to grow by HK$1. (Gas Guzzler - Dangerous).<br/>
               <em>Lower is always better.</em>
             </p>
           </div>
           <div>
             <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
               Q: How does CAC work without a Free Plan?
             </h4>
             <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
               <strong>A: We prevent you from cheating.</strong><br/>
               CAC = <code>Marketing Spend / New PAYING Users</code>. If you have a Free Plan, we <em>ignore</em> the free users in the math. This prevents your CAC from looking artificially cheap just because you got a bunch of free signups. We only count the customers who pay the bills.
             </p>
           </div>
           <div>
             <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
               Q: Why is "Burn Rate" higher than "Expenses"?
             </h4>
             <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
               <strong>A: Hidden Costs.</strong><br/>
               The dashboard automatically adds <strong>Payroll Taxes</strong> (e.g. MPF/Insurance, defaults to 20%) and estimated <strong>Sales Commissions</strong> on top of your raw salary numbers. This prevents you from running out of cash unexpectedly.
             </p>
           </div>
           <div>
             <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
               Q: Input numbers for today or future?
             </h4>
             <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
               <strong>A: Input numbers for TODAY.</strong><br/>
               Think of the "Model Inputs" tab as your starting line (Month 0). The charts will then calculate the future based on the Growth Rates you set in the top slider bar.
             </p>
           </div>
        </div>
      </div>

      {/* 4. The Dictionary (Simple Terms) */}
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
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">CAC (Price Tag of a Customer)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              How much you spend on ads/sales to get <strong>ONE</strong> new paying customer.
              <br/><span className="italic text-slate-500">Example: Spend HK$100 on ads -> Get 1 customer. CAC = HK$100.</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">LTV (Customer Worth)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The total profit you make from one customer before they quit.
              <br/><span className="text-emerald-600 font-medium">Goal: LTV should be 3x bigger than CAC.</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Runway (Survival Timer)</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              How many months until your bank account hits $0. 
              <br/><span className="italic text-slate-500">If you have HK$10k and lose HK$1k/month, you have 10 months to live.</span>
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

      {/* 5. Controls Explained */}
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
             <div className="w-32 font-bold text-indigo-700 dark:text-indigo-300 text-sm mt-1">Growth Speed Dial</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>A "Good Luck" Multiplier.</strong> 
               <br/>1.0x = Normal. 
               <br/>1.2x = Your ads are working better than expected (20% bonus).
               <br/>0.8x = Hard times (Growth is slower than planned).
             </p>
           </div>
           <div className="flex gap-4 items-start border-b border-indigo-200 dark:border-indigo-800 pb-4">
             <div className="w-32 font-bold text-indigo-700 dark:text-indigo-300 text-sm mt-1">Expansion / Upsell</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>Getting more from existing users.</strong> The % of extra revenue you get from current customers each month (e.g., they upgrade to Pro).
             </p>
           </div>

           {/* Ops */}
           <div className="flex gap-4 items-start border-b border-indigo-200 dark:border-indigo-800 pb-4">
             <div className="w-32 font-bold text-amber-700 dark:text-amber-400 text-sm mt-1">Payroll Tax</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>Hidden Employee Costs.</strong> Health insurance, taxes, and benefits. Usually adds 10-20% on top of the base salary.
             </p>
           </div>
           <div className="flex gap-4 items-start border-b border-indigo-200 dark:border-indigo-800 pb-4">
             <div className="w-32 font-bold text-amber-700 dark:text-amber-400 text-sm mt-1">Salary Growth</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>Raises (Inflation).</strong> Employees expect to be paid more every year. 3% is standard.
             </p>
           </div>
           <div className="flex gap-4 items-start border-b border-indigo-200 dark:border-indigo-800 pb-4">
             <div className="w-32 font-bold text-amber-700 dark:text-amber-400 text-sm mt-1">Sales Commission</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>Bonus for Sales.</strong> If set to 10%, you pay your sales team HK$10 for every HK$100 plan they sell.
             </p>
           </div>

           {/* Valuation */}
           <div className="flex gap-4 items-start border-b border-indigo-200 dark:border-indigo-800 pb-4">
             <div className="w-32 font-bold text-purple-700 dark:text-purple-400 text-sm mt-1">Valuation Multiple</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>What is your business worth?</strong> 
               <br/>Think of it like selling a lemonade stand. If your stand makes HK$100 a year, and someone buys it for HK$600, the multiple is <strong>6x</strong>.
               <br/>Investors usually value SaaS companies between 5x and 10x their yearly revenue (ARR).
             </p>
           </div>
           <div className="flex gap-4 items-start">
             <div className="w-32 font-bold text-purple-700 dark:text-purple-400 text-sm mt-1">Founder Equity</div>
             <p className="text-sm text-indigo-800 dark:text-indigo-200/80 flex-1">
               <strong>Your Slice of the Pie.</strong> The percentage of the company YOU own. If you sell the company for HK$10M and own 50%, you walk away with HK$5M.
             </p>
           </div>
        </div>
      </div>

    </div>
  );
};

export default AppGuide;
