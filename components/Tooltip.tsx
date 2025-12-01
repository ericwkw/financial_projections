import React from 'react';
import { Info } from './Icons';

interface TooltipProps {
  content: string;
  className?: string;
  position?: 'top' | 'bottom';
  width?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, className, position = 'top', width = 'w-48' }) => {
  return (
    <div className={`relative flex items-center justify-center group ml-1.5 ${className}`}>
      {/* Icon Trigger */}
      <div className="cursor-help text-slate-400 hover:text-blue-500 dark:text-slate-500 dark:hover:text-blue-400 transition-colors">
        <Info className="w-4 h-4" />
      </div>
      
      {/* Tooltip Popup */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 ${width} p-3 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] pointer-events-none text-center font-medium leading-relaxed border border-slate-700 dark:border-slate-200
          ${position === 'top' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'}
        `}
      >
        {content}
        
        {/* CSS Arrow */}
        <div 
          className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-slate-800 dark:bg-white border-slate-700 dark:border-slate-200
            ${position === 'top' 
              ? 'bottom-[-5px] border-r border-b' 
              : 'top-[-5px] border-l border-t'
            }
          `}
        ></div>
      </div>
    </div>
  );
};

export default Tooltip;