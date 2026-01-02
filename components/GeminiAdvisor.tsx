
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SimulationState, MonthlyProjection } from '../types';
import { analyzeFinancials } from '../services/geminiService';
import { BrainCircuit, Loader2 } from './Icons';

interface GeminiAdvisorProps {
  state: SimulationState;
  projections?: MonthlyProjection[]; // New prop to see the future
}

const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ state, projections }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      // Pass projections if available, otherwise empty array (fallback)
      const result = await analyzeFinancials(state, projections || []);
      setAnalysis(result);
    } catch (e) {
      setAnalysis("An error occurred while contacting the financial advisor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-indigo-900 dark:to-slate-900 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800 overflow-hidden transition-colors duration-300 h-full flex flex-col">
      <div className="p-6 border-b border-indigo-50 dark:border-indigo-800/50 flex justify-between items-center bg-indigo-50/50 dark:bg-transparent">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Gemini CFO</h2>
            <p className="text-xs text-indigo-600 dark:text-indigo-300 font-medium">AI Financial Strategy</p>
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all flex items-center space-x-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4" />
              <span>Thinking...</span>
            </>
          ) : (
            <span>Run Analysis</span>
          )}
        </button>
      </div>
      
      <div className="p-6 flex-grow bg-white dark:bg-slate-900/50 min-h-[300px] overflow-y-auto">
        {analysis ? (
          <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300 prose-headings:text-slate-900 dark:prose-headings:text-white prose-strong:text-slate-900 dark:prose-strong:text-white prose-a:text-indigo-600 dark:prose-a:text-indigo-400">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-indigo-300/50 space-y-4 py-10">
            <BrainCircuit className="w-16 h-16 opacity-10 dark:opacity-20" />
            <div className="text-center max-w-xs space-y-2">
                <h3 className="font-semibold text-slate-600 dark:text-slate-300">Not sure if your numbers work?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                I can audit your pricing, check your burn rate, and warn you if you're running out of cash.
                </p>
                <button onClick={handleAnalyze} className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">
                    Click "Run Analysis" to start →
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiAdvisor;
