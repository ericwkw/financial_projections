
import React, { useState } from 'react';
import { Info } from './Icons';

interface TooltipProps {
  content: string;
  className?: string;
  position?: 'top' | 'bottom';
  width?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, className = '', position = 'top', width = 'w-48' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={`relative flex items-center justify-center ml-1.5 ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Icon Trigger */}
      <div 
        className="cursor-help text-slate-400 hover:text-blue-500 dark:text-slate-500 dark:hover:text-blue-400 transition-colors"
        aria-label="More info"
      >
        <Info className="w-4 h-4" />
      </div>
      
      {/* Tooltip Popup */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 ${width} p-3 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs rounded-lg shadow-xl transition-all duration-200 z-[9999] pointer-events-none text-left font-medium leading-relaxed border border-slate-700 dark:border-slate-200
          ${position === 'top' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'}
          ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}
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
