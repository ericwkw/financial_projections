import React from 'react';
import Tooltip from './Tooltip';

interface KPICardProps {
  title: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
  color?: string;
  tooltip?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, subtext, icon, trend, color, tooltip }) => {
  // Use passed color or default white/dark card styles
  const baseClasses = color 
    ? color 
    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800";

  return (
    <div className={`${baseClasses} p-6 rounded-xl shadow-sm border transition-colors relative`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            {tooltip && <Tooltip position="bottom" content={tooltip} />}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
          {icon}
        </div>
      </div>
      {subtext && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm ${trend === 'positive' ? 'text-green-600 dark:text-green-400' : trend === 'negative' ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {subtext}
          </span>
        </div>
      )}
    </div>
  );
};

export default KPICard;