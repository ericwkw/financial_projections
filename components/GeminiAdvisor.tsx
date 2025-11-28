import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SimulationState } from '../types';
import { analyzeFinancials } from '../services/geminiService';
import { BrainCircuit, Loader2 } from './Icons';

interface GeminiAdvisorProps {
  state: SimulationState;
}

const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ state }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeFinancials(state);
      setAnalysis(result);
    } catch (e) {
      setAnalysis("An error occurred while contacting the financial advisor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl shadow-lg border border-indigo-800 text-white overflow-hidden">
      <div className="p-6 border-b border-indigo-800/50 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Gemini CFO</h2>
            <p className="text-xs text-indigo-300">AI-Powered Financial Analysis</p>
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all flex items-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4" />
              <span>Analyzing Model...</span>
            </>
          ) : (
            <span>Run Analysis</span>
          )}
        </button>
      </div>
      
      <div className="p-6 min-h-[200px] max-h-[500px] overflow-y-auto bg-slate-900/50">
        {analysis ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-indigo-300/50 space-y-4 py-10">
            <BrainCircuit className="w-12 h-12 opacity-20" />
            <p className="text-sm text-center max-w-xs">
              Click "Run Analysis" to let Gemini evaluate your pricing tiers, burn rate, and profit margins.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiAdvisor;