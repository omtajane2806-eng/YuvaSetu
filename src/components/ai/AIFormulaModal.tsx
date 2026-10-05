import React, { useState } from 'react';
import { StructuredAIContent } from '../../types/ai';
import { aiService } from '../../services/aiService';
import { Sigma, Sparkles, X, Check, Copy } from 'lucide-react';

interface AIFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIFormulaModal: React.FC<AIFormulaModalProps> = ({ isOpen, onClose }) => {
  const [formulaInput, setFormulaInput] = useState('mid = low + (high - low) / 2');
  const [explanation, setExplanation] = useState<StructuredAIContent['formulaExplanation'] | null>(
    () => aiService.explainFormula('mid = low + (high - low) / 2')
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExplain = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formulaInput.trim()) return;
    const result = aiService.explainFormula(formulaInput);
    setExplanation(result);
  };

  const sampleFormulas = [
    'mid = low + (high - low) / 2',
    'λ = n / m (Hash Load Factor)',
    'T(n) = 2T(n/2) + O(n) (Merge Sort)',
    'h(k, i) = (h(k) + i) mod m',
  ];

  return (
    <div
      id="yuvasetu-ai-formula-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0b0f1e] border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sigma className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-['Outfit'] text-white">
                Explain Formula & Derivation
              </h2>
              <p className="text-xs text-slate-400">
                Breakdown of variables, mathematical derivations, and when to apply in exams.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="py-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Input form */}
          <form onSubmit={handleExplain} className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Enter or Select a Formula
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formulaInput}
                onChange={(e) => setFormulaInput(e.target.value)}
                placeholder="e.g. λ = n/m, mid = low + (high-low)/2..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explain</span>
              </button>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sampleFormulas.map((f, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setFormulaInput(f);
                    setExplanation(aiService.explainFormula(f));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 cursor-pointer font-mono"
                >
                  {f}
                </button>
              ))}
            </div>
          </form>

          {/* EXPLANATION */}
          {explanation && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              {/* Formula display */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-base sm:text-lg font-bold font-mono text-cyan-300 tracking-wider">
                  {explanation.formula}
                </span>
              </div>

              {/* Simple explanation */}
              <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-1">
                <span className="font-bold text-cyan-400 text-xs block">Intuitive Meaning</span>
                <p className="text-slate-200 leading-relaxed">{explanation.simpleExplanation}</p>
              </div>

              {/* Variables */}
              {explanation.variables && explanation.variables.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-300 text-xs uppercase tracking-wider block">
                    Variables & Notation
                  </span>
                  <div className="space-y-1.5">
                    {explanation.variables.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs flex items-center justify-between gap-3"
                      >
                        <strong className="font-mono text-cyan-300">{v.symbol}</strong>
                        <span className="text-slate-300 text-right">{v.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Example */}
              {explanation.example && (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-300 text-xs uppercase tracking-wider block">
                    Step-by-Step Numerical Example
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">
                    {explanation.example}
                  </p>
                </div>
              )}

              {/* When to use */}
              {explanation.whenToUse && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                    When to Apply in Exams & Algorithms
                  </span>
                  <p className="text-slate-200">{explanation.whenToUse}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
