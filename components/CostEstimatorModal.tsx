
import React, { useState } from 'react';
import { X, Wand2, Loader2, BrainCircuit, Calculator, Plus, Trash2 } from './Icons';
import { estimateUnitCost, CostEstimation } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface CostEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (cost: number) => void;
  planPrice: number;
  planInterval: string;
}

interface ManualCostItem {
  id: string;
  name: string;
  unitCost: number;
  quantity: number;
}

const CostEstimatorModal: React.FC<CostEstimatorModalProps> = ({ isOpen, onClose, onApply, planPrice, planInterval }) => {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  
  // AI State
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<CostEstimation | null>(null);

  // Manual State
  const [manualItems, setManualItems] = useState<ManualCostItem[]>([
    { id: '1', name: 'Server Compute', unitCost: 0, quantity: 1 },
    { id: '2', name: 'Database Storage', unitCost: 0, quantity: 1 }
  ]);

  if (!isOpen) return null;

  // Manual Logic
  const handleAddManualItem = () => {
    setManualItems([...manualItems, { id: Date.now().toString(), name: 'New Item', unitCost: 0, quantity: 1 }]);
  };

  const handleUpdateManualItem = (id: string, field: keyof ManualCostItem, value: any) => {
    setManualItems(items => items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleDeleteManualItem = (id: string) => {
    setManualItems(items => items.filter(item => item.id !== id));
  };

  const manualTotal = manualItems.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0);

  // AI Logic
  const handleEstimateAi = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const data = await estimateUnitCost(description, planPrice, planInterval);
      setAiResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const currentTotal = mode === 'manual' ? manualTotal : (aiResult?.estimatedCost || 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white">Variable Cost Estimator (HKD)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-1 mx-4 mt-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex">
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${mode === 'manual' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <Calculator className="w-4 h-4" />
            Manual Calculator
          </button>
          <button
            onClick={() => setMode('ai')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${mode === 'ai' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <Wand2 className="w-4 h-4" />
            AI Estimator
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
            
            {/* MANUAL MODE */}
            {mode === 'manual' && (
              <div className="space-y-4">
                 <div className="space-y-2">
                   {manualItems.map((item) => (
                     <div key={item.id} className="flex gap-2 items-center">
                        <div className="flex-grow">
                          <label className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 block">Item Name</label>
                          <input 
                            type="text" 
                            className="w-full p-2 text-sm border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                            placeholder="e.g. S3 Storage"
                            value={item.name}
                            onChange={(e) => handleUpdateManualItem(item.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="w-20">
                          <label className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 block">Cost (HK$)</label>
                           <input 
                            type="number" 
                            min="0"
                            step="0.001"
                            className="w-full p-2 text-sm border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-right"
                            value={item.unitCost}
                            onChange={(e) => handleUpdateManualItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                         <div className="w-16">
                          <label className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 block">Qty</label>
                           <input 
                            type="number" 
                            min="0"
                            className="w-full p-2 text-sm border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-right"
                            value={item.quantity}
                            onChange={(e) => handleUpdateManualItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                         <div className="w-8 pt-5 text-center">
                           <button onClick={() => handleDeleteManualItem(item.id)} className="text-slate-300 hover:text-red-500 dark:hover:text-red-400">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                   ))}
                 </div>
                 
                 <button onClick={handleAddManualItem} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    <Plus className="w-4 h-4" /> Add Line Item
                 </button>

                 <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Calculated Cost</span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">HK${manualTotal.toFixed(2)}</span>
                 </div>
              </div>
            )}

            {/* AI MODE */}
            {mode === 'ai' && (
              !aiResult ? (
                <div className="space-y-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg text-sm text-indigo-800 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-800/50">
                        <p>Describe your tech stack and usage per user. The AI will calculate your estimated COGS in HKD.</p>
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
                    <div className="flex justify-end">
                       <button
                            onClick={handleEstimateAi}
                            disabled={loading || !description.trim()}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                            Estimate with AI
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400 uppercase font-semibold">AI Estimated Cost</p>
                        <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                            HK${aiResult.estimatedCost.toFixed(2)}<span className="text-lg text-slate-400 font-medium">/mo</span>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700/50">
                        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1">
                            <BrainCircuit className="w-3 h-3" /> Breakdown
                        </h4>
                        <div className="prose prose-sm prose-indigo dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <ReactMarkdown>{aiResult.breakdown}</ReactMarkdown>
                        </div>
                    </div>
                    <div className="text-center">
                       <button 
                        onClick={() => setAiResult(null)}
                        className="text-sm text-slate-400 hover:text-indigo-500 underline"
                       >
                         Try a different description
                       </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl">
             <div className="text-xs text-slate-400">
               {mode === 'manual' ? 'Calculated total' : 'AI estimated total'} will be applied.
             </div>
             <div className="flex gap-3">
               <button 
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                    onClick={() => {
                        onApply(currentTotal);
                        onClose();
                    }}
                    disabled={currentTotal === 0}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-medium rounded-lg shadow-sm"
                >
                    Apply HK${currentTotal.toFixed(2)}
                </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default CostEstimatorModal;
