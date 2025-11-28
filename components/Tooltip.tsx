import React from 'react';
import { Info } from './Icons';

interface TooltipProps {
  content: string;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, className }) => {
  return (
    <div className={`relative flex items-center group ml-1.5 ${className}`}>
      <div className="cursor-help text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
        <Info className="w-4 h-4" />
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none text-center">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
      </div>
    </div>
  );
};

export default Tooltip;