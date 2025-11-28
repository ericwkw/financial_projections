import React, { useState } from 'react';
import { X, Wand2, Loader2, BrainCircuit } from './Icons';
import { estimateUnitCost, CostEstimation } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface CostEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (cost: number) => void;
}

const CostEstimatorModal: React.FC<CostEstimatorModalProps> = ({ isOpen, onClose, onApply }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CostEstimation | null>(null);

  if (!isOpen) return null;

  const handleEstimate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const data = await estimateUnitCost(description);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <Wand2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">AI Cost Estimator</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
            {!result ? (
                <div className="space-y-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg text-sm text-indigo-800 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-800/50">
                        <p>Describe your tech stack and usage per user. The AI will calculate your estimated COGS.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Technical Description
                        </label>
                        <textarea
                            className="w-full h-32 p-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white resize-none"
                            placeholder="e.g. AI chatbot using GPT-4o (avg 100 queries/mo), storing chat logs on AWS DynamoDB, generating 5 images per user via DALL-E 3."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400 uppercase font-semibold">Estimated Variable Cost</p>
                        <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                            ${result.estimatedCost.toFixed(2)}<span className="text-lg text-slate-400 font-medium">/mo</span>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700/50">
                        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1">
                            <BrainCircuit className="w-3 h-3" /> Breakdown
                        </h4>
                        <div className="prose prose-sm prose-indigo dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <ReactMarkdown>{result.breakdown}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl">
            {result ? (
                <>
                    <button 
                        onClick={() => setResult(null)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                        Recalculate
                    </button>
                    <button
                        onClick={() => {
                            onApply(result.estimatedCost);
                            onClose();
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm"
                    >
                        Apply Cost
                    </button>
                </>
            ) : (
                <button
                    onClick={handleEstimate}
                    disabled={loading || !description.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                    Estimate
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default CostEstimatorModal;
