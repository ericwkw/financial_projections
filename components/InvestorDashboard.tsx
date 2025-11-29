
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
}

const InvestorDashboard: React.FC<InvestorDashboardProps> = ({ financials, plans, projections, state, darkMode }) => {
  const fmtNum = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(n);
  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. North Star - Valuation & Equity Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KPICard 
            title="Company Valuation" 
            value={fmtCurrency(financials.valuation)} 
            icon={<BrainCircuit className="w-5 h-5" />} 
            subtext={`Based on ${fmtNum(state.params.valuationMultiple)}x ARR`}
            tooltip="Estimated market value of the company."
        />
        <KPICard 
            title="Founder's Stake Value" 
            value={fmtCurrency(financials.founderValue)} 
            icon={<DollarSign className="w-5 h-5" />} 
            subtext={`At ${state.params.founderEquity}% Ownership`}
            color="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
            tooltip="The theoretical value of your personal equity in an exit scenario."
        />
      </div>

      {/* 2. The Efficiency Matrix (VC Metrics) */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Unit Economics & Efficiency
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricTile 
            label="LTV / CAC"
            value={`${fmtNum(financials.ltvCacRatio)}x`}
            target="> 3.0x"
            status={financials.ltvCacRatio >= 3 ? 'good' : financials.ltvCacRatio >= 1 ? 'warning' : 'bad'}
            tooltip="Lifetime Value divided by Customer Acquisition Cost. The primary measure of unit profitability."
          />
           <MetricTile 
            label="Net Rev Retention"
            value={`${fmtNum(financials.nrr)}%`}
            target="> 100%"
            status={financials.nrr >= 100 ? 'good' : financials.nrr >= 90 ? 'warning' : 'bad'}
            tooltip="NRR. Revenue retained from existing customers including upsells and churn. >100% means you grow without new sales."
          />
          <MetricTile 
            label="CAC Payback"
            value={financials.cacPaybackMonths === 0 ? "Instant" : `${fmtNum(financials.cacPaybackMonths)} mo`}
            target="< 12 mo"
            status={financials.cacPaybackMonths <= 12 ? 'good' : financials.cacPaybackMonths <= 18 ? 'warning' : 'bad'}
            tooltip="How many months of gross profit it takes to earn back the marketing spend for a new customer."
          />
          <MetricTile 
            label="Magic Number"
            value={`${fmtNum(financials.magicNumber)}`}
            target="> 0.75"
            status={financials.magicNumber >= 0.75 ? 'good' : financials.magicNumber >= 0.5 ? 'warning' : 'bad'}
            tooltip="Measures sales efficiency. For every $1 of marketing spend, how much new annual revenue did you create?"
          />
          <MetricTile 
            label="Burn Multiplier"
            value={`${fmtNum(financials.burnMultiplier)}x`}
            target="< 2.0x"
            status={financials.burnMultiplier <= 1.5 && financials.burnMultiplier > 0 ? 'good' : financials.burnMultiplier <= 2.5 ? 'warning' : 'bad'}
            tooltip="How much cash are you burning to add $1 of Net New ARR? Lower is better. < 1 is excellent."
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
