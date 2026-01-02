
import React from 'react';
import { Plan, Financials, MonthlyProjection, SimulationState } from '../types';
import FinancialCharts from './FinancialCharts';
import PnLTable from './PnLTable';
import GeminiAdvisor from './GeminiAdvisor';
import MetricTile from './MetricTile';
import { TrendingUp, DollarSign, BrainCircuit, Users } from './Icons';
import KPICard from './KPICard';

interface InvestorDashboardProps {
  financials: Financials;
  plans: Plan[];
  projections: MonthlyProjection[];
  state: SimulationState;
  darkMode: boolean;
  breakEvenMonth: number | null;
}

const InvestorDashboard: React.FC<InvestorDashboardProps> = ({ financials, plans, projections, state, darkMode, breakEvenMonth }) => {
  const fmtNum = (n: number) => new Intl.NumberFormat('en-HK', { maximumFractionDigits: 1 }).format(n);
  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-HK', { style: 'currency', currency: 'HKD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. North Star - Valuation & Equity Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
            title="Current MRR" 
            value={fmtCurrency(financials.mrr)} 
            icon={<DollarSign className="w-5 h-5" />} 
            subtext={`Run Rate: ${fmtCurrency(financials.arr)}/yr`}
            tooltip="Monthly Recurring Revenue. The consistent monthly income from subscriptions."
        />
        <KPICard 
            title="Avg. Revenue (ARPPU)" 
            value={fmtCurrency(financials.arppu)} 
            icon={<Users className="w-5 h-5" />} 
            subtext="Per Paying User / Mo"
            tooltip="Average Revenue Per Paying User. This represents the average monthly value of a paying customer. High ARPPU indicates strong pricing power."
        />
        <KPICard 
            title="Company Valuation" 
            value={fmtCurrency(financials.valuation)} 
            icon={<BrainCircuit className="w-5 h-5" />} 
            subtext={`Based on ${fmtNum(state.params.valuationMultiple)}x ARR`}
            tooltip="Estimated company value based on annual revenue and market multiples."
        />
        <KPICard 
            title="Founder's Stake Value" 
            value={fmtCurrency(financials.founderValue)} 
            icon={<TrendingUp className="w-5 h-5" />} 
            subtext={`At ${state.params.founderEquity}% Ownership`}
            color="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
            tooltip="Estimated value of your personal shares based on current valuation."
        />
      </div>

      {/* 2. The Efficiency Matrix (VC Metrics) */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Unit Economics & Efficiency
        </h3>
        {/* Adjusted grid for 7 items: 2 cols mobile, 3 tablet, 4 desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <MetricTile 
            label="LTV / CAC"
            value={`${fmtNum(financials.ltvCacRatio)}x`}
            target="> 3.0x"
            status={financials.ltvCacRatio >= 3 ? 'good' : financials.ltvCacRatio >= 1 ? 'warning' : 'bad'}
            tooltip="Profit from a customer vs. cost to find them. Goal: make $3 for every $1 spent."
          />
           <MetricTile 
            label="Net Rev Retention"
            value={`${fmtNum(financials.nrr)}%`}
            target="> 100%"
            status={financials.nrr >= 100 ? 'good' : financials.nrr >= 90 ? 'warning' : 'bad'}
            tooltip="Percentage of recurring revenue retained from existing customers, including upgrades and churn. Above 100% is excellent."
          />
          <MetricTile 
            label="CAC Payback"
            value={
                financials.cacPaybackMonths >= 999 ? "Never" :
                financials.cacPaybackMonths === 0 ? "Instant" : 
                `${fmtNum(financials.cacPaybackMonths)} mo`
            }
            target="< 12 mo"
            status={financials.cacPaybackMonths >= 999 ? 'bad' : financials.cacPaybackMonths <= 12 ? 'good' : financials.cacPaybackMonths <= 18 ? 'warning' : 'bad'}
            tooltip="Months required to earn back the cost of acquiring a new customer."
          />
          <MetricTile 
            label="Magic Number"
            value={`${fmtNum(financials.magicNumber)}`}
            target="> 0.75"
            status={financials.magicNumber >= 0.75 ? 'good' : financials.magicNumber >= 0.5 ? 'warning' : 'bad'}
            tooltip="Sales efficiency metric. Measures how much new annual revenue you create for every $1 spent on marketing."
          />
          <MetricTile 
            label="Burn Multiplier"
            value={financials.burnMultiplier >= 999 ? "Neg. Growth" : `${fmtNum(financials.burnMultiplier)}x`}
            target="< 2.0x"
            status={financials.burnMultiplier >= 999 ? 'bad' : financials.burnMultiplier <= 1.5 && financials.burnMultiplier > 0 ? 'good' : financials.burnMultiplier <= 2.5 ? 'warning' : 'bad'}
            tooltip="Capital efficiency metric. Measures how much cash you burn to generate $1 of new annual revenue. 'Neg. Growth' means you are burning cash while revenue is shrinking."
          />
          <MetricTile 
            label="Time to Profit"
            value={breakEvenMonth ? `Month ${breakEvenMonth}` : "Never"}
            target="< 24 mo"
            status={breakEvenMonth && breakEvenMonth < 24 ? 'good' : breakEvenMonth ? 'warning' : 'bad'}
            tooltip="The forecasted month when your monthly revenue will exceed your monthly expenses."
          />
          <MetricTile 
            label="Free-to-Paid Conv."
            value={`${fmtNum(financials.conversionRate * 100)}%`}
            target="> 5%"
            status={financials.conversionRate >= 0.05 ? 'good' : financials.conversionRate >= 0.02 ? 'warning' : 'neutral'}
            tooltip="Percentage of total users who convert to paying customers."
          />
        </div>
      </div>

      {/* 3. Visual Analysis & AI Strategy */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
           <FinancialCharts financials={financials} plans={plans} projections={projections} darkMode={darkMode} />
        </div>
        <div className="xl:col-span-1 h-full">
           <GeminiAdvisor state={state} projections={projections} />
        </div>
      </div>

      {/* 4. Detailed P&L */}
      <PnLTable projections={projections} />

    </div>
  );
};

export default InvestorDashboard;
