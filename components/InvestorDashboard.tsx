
import React from 'react';
import { Plan, Financials, MonthlyProjection, SimulationState } from '../types';
import FinancialCharts from './FinancialCharts';
import PnLTable from './PnLTable';
import GeminiAdvisor from './GeminiAdvisor';
import MetricTile from './MetricTile';
import { TrendingUp, DollarSign, BrainCircuit } from './Icons';
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
  const fmtNum = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(n);
  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. North Star - Valuation & Equity Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
            title="Current ARR" 
            value={fmtCurrency(financials.arr)} 
            icon={<DollarSign className="w-5 h-5" />} 
            subtext={`Monthly Rev: ${fmtCurrency(financials.mrr)}`}
            tooltip="Annual Recurring Revenue. This is how much money you make in a year from subscriptions."
        />
        <KPICard 
            title="Company Valuation" 
            value={fmtCurrency(financials.valuation)} 
            icon={<BrainCircuit className="w-5 h-5" />} 
            subtext={`Based on ${fmtNum(state.params.valuationMultiple)}x ARR`}
            tooltip="A rough estimate of what your company might be worth to investors."
        />
        <KPICard 
            title="Founder's Stake Value" 
            value={fmtCurrency(financials.founderValue)} 
            icon={<TrendingUp className="w-5 h-5" />} 
            subtext={`At ${state.params.founderEquity}% Ownership`}
            color="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
            tooltip="The potential value of your personal shares if you sold the company."
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
            tooltip="Profit from a customer vs. Cost to find them. Goal: Make $3 for every $1 spent."
          />
           <MetricTile 
            label="Net Rev Retention"
            value={`${fmtNum(financials.nrr)}%`}
            target="> 100%"
            status={financials.nrr >= 100 ? 'good' : financials.nrr >= 90 ? 'warning' : 'bad'}
            tooltip="Are you keeping your money? > 100% means upgrades are earning you more than people quitting."
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
            tooltip="How many months it takes to earn back the money you spent on ads for a new customer."
          />
          <MetricTile 
            label="Magic Number"
            value={`${fmtNum(financials.magicNumber)}`}
            target="> 0.75"
            status={financials.magicNumber >= 0.75 ? 'good' : financials.magicNumber >= 0.5 ? 'warning' : 'bad'}
            tooltip="Marketing Efficiency. If you put $1 into ads, do you get more than $1 of yearly revenue back?"
          />
          <MetricTile 
            label="Burn Multiplier"
            value={financials.burnMultiplier >= 999 ? "Neg. Growth" : `${fmtNum(financials.burnMultiplier)}x`}
            target="< 2.0x"
            status={financials.burnMultiplier >= 999 ? 'bad' : financials.burnMultiplier <= 1.5 && financials.burnMultiplier > 0 ? 'good' : financials.burnMultiplier <= 2.5 ? 'warning' : 'bad'}
            tooltip="Capital Efficiency. How much cash do you burn to grow? Lower is better."
          />
          <MetricTile 
            label="Time to Profit"
            value={breakEvenMonth ? `Month ${breakEvenMonth}` : "Never"}
            target="< 24 mo"
            status={breakEvenMonth && breakEvenMonth < 24 ? 'good' : breakEvenMonth ? 'warning' : 'bad'}
            tooltip="The specific month when your company finally makes more money than it spends."
          />
          <MetricTile 
            label="Free-to-Paid Conv."
            value={`${fmtNum(financials.conversionRate * 100)}%`}
            target="> 5%"
            status={financials.conversionRate >= 0.05 ? 'good' : financials.conversionRate >= 0.02 ? 'warning' : 'neutral'}
            tooltip="Percentage of Total Users who actually pay you. Crucial for free-tier apps."
          />
        </div>
      </div>

      {/* 3. Visual Analysis & AI Strategy */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
           <FinancialCharts financials={financials} plans={plans} projections={projections} darkMode={darkMode} />
        </div>
        <div className="xl:col-span-1 h-full">
           <GeminiAdvisor state={state} />
        </div>
      </div>

      {/* 4. Detailed P&L */}
      <PnLTable projections={projections} />

    </div>
  );
};

export default InvestorDashboard;
