
import React from 'react';
import { Plan, Financials, MonthlyProjection, SimulationState } from '../types';
import FinancialCharts from './FinancialCharts';
import PnLTable from './PnLTable';
import GeminiAdvisor from './GeminiAdvisor';
import MetricTile from './MetricTile';
import { TrendingUp, DollarSign, BrainCircuit } from './Icons';

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
      
      {/* 1. The Efficiency Matrix (VC Metrics) */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Unit Economics & Efficiency
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricTile 
            label="LTV / CAC"
            value={`${fmtNum(financials.ltvCacRatio)}x`}
            target="> 3.0x"
            status={financials.ltvCacRatio >= 3 ? 'good' : financials.ltvCacRatio >= 1 ? 'warning' : 'bad'}
            tooltip="Lifetime Value divided by Customer Acquisition Cost. The primary measure of unit profitability."
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

      {/* 2. Visual Analysis & AI Strategy */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
           <FinancialCharts financials={financials} plans={plans} projections={projections} darkMode={darkMode} />
        </div>
        <div className="xl:col-span-1 h-full">
           <GeminiAdvisor state={state} />
        </div>
      </div>

      {/* 3. Detailed P&L */}
      <PnLTable projections={projections} />

    </div>
  );
};

export default InvestorDashboard;
