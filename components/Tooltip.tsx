import React from 'react';
import { Info } from './Icons';

interface TooltipProps {
  content: string;
  className?: string;
  position?: 'top' | 'bottom';
}

const Tooltip: React.FC<TooltipProps> = ({ content, className, position = 'top' }) => {
  return (
    <div className={`relative flex items-center group ml-1.5 ${className}`}>
      <div className="cursor-help text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
        <Info className="w-4 h-4" />
      </div>
      
      {/* Tooltip Container */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 w-64 p-3 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] pointer-events-none text-center
          ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
        `}
      >
        {content}
        
        {/* Arrow */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent 
            ${position === 'top' 
              ? 'top-full border-t-slate-900 dark:border-t-slate-800 -mt-[1px]' 
              : 'bottom-full border-b-slate-900 dark:border-b-slate-800 -mb-[1px]'
            }
          `}
        ></div>
      </div>
    </div>
  );
};

export default Tooltip;