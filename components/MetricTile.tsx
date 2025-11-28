
import React from 'react';
import Tooltip from './Tooltip';

interface MetricTileProps {
  label: string;
  value: string;
  target?: string;
  status: 'good' | 'bad' | 'neutral' | 'warning';
  tooltip: string;
}

const MetricTile: React.FC<MetricTileProps> = ({ label, value, target, status, tooltip }) => {
  const getColors = () => {
    switch (status) {
      case 'good': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30';
      case 'bad': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30';
      case 'warning': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30';
      case 'neutral': return 'text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700';
    }
  };

  const colors = getColors();

  return (
    <div className={`p-4 rounded-xl border ${colors} flex flex-col justify-between h-full transition-colors`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold uppercase opacity-70 tracking-wider">{label}</span>
          <Tooltip content={tooltip} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {target && <div className="text-xs opacity-60 mt-1">Target: {target}</div>}
      </div>
    </div>
  );
};

export default MetricTile;
