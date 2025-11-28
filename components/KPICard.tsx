import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
  color?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, subtext, icon, trend, color = "bg-white" }) => {
  return (
    <div className={`${color} p-6 rounded-xl shadow-sm border border-slate-200`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
          {icon}
        </div>
      </div>
      {subtext && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm ${trend === 'positive' ? 'text-green-600' : trend === 'negative' ? 'text-red-600' : 'text-slate-500'}`}>
            {subtext}
          </span>
        </div>
      )}
    </div>
  );
};

export default KPICard;