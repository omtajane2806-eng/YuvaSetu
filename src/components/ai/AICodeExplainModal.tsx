import React, { useState } from 'react';
import { StructuredAIContent } from '../../types/ai';
import { aiService } from '../../services/aiService';
import { Code2, Sparkles, X, Check, Copy, ArrowRight } from 'lucide-react';

interface AICodeExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialId?: string;
}

export const AICodeExplainModal: React.FC<AICodeExplainModalProps> = ({
  isOpen,
  onClose,
  materialId,
}) => {
  const [codeSnippet, setCodeSnippet] = useState(
`// Example Binary Search Implementation
int binarySearch(int arr[], int n, int x) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == x)
            return mid;
        if (arr[mid] < x)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}`
  );
  const [explanation, setExplanation] = useState<StructuredAIContent['codeExplanation'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExplain = async () => {
    if (!codeSnippet.trim()) return;
    setLoading(true);
    try {
      const result = await aiService.explainCode(codeSnippet, materialId);
      setExplanation(result);
    } catch (e) {
      console.error('Failed to explain code', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyExplanation = () => {
    if (!explanation) return;
    const text = `=== CODE EXPLANATION ===\nWHAT IT DOES:\n${explanation.whatItDoes}\n\nSTEP-BY-STEP LOGIC:\n${explanation.stepByStepLogic?.join('\n')}\n\nTIME COMPLEXITY: ${explanation.timeComplexity}\nSPACE COMPLEXITY: ${explanation.spaceComplexity}\n\nEDGE CASES:\n${explanation.edgeCases?.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="yuvasetu-ai-code-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0b0f1e] border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-['Outfit'] text-white">
                Explain Code & Logic
              </h2>
              <p className="text-xs text-slate-400">
                Paste any algorithm snippet or function for step-by-step structural analysis.
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
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Paste or Edit Code Snippet
            </label>
            <textarea
              rows={6}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="w-full p-4 rounded-2xl bg-[#050711] border border-slate-800 font-mono text-cyan-300 text-xs focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
              placeholder="Paste C++, Java, Python, or JavaScript code..."
            />
            <button
              onClick={handleExplain}
              disabled={loading || !codeSnippet.trim()}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? (
                <span>Analyzing Code Structure...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain Code Logic & Complexities</span>
                </>
              )}
            </button>
          </div>

          {/* EXPLANATION RESULTS */}
          {explanation && (
            <div className="space-y-5 pt-2 border-t border-slate-800 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Analysis Breakdown
                </span>
                <button
                  onClick={handleCopyExplanation}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* What it does */}
              <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-1">
                <span className="font-bold text-cyan-400 text-xs block">What This Code Does</span>
                <p className="text-slate-200 leading-relaxed">{explanation.whatItDoes}</p>
              </div>

              {/* Step by Step Logic */}
              {explanation.stepByStepLogic && explanation.stepByStepLogic.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-300 text-xs uppercase tracking-wider block">
                    Step-by-Step Logic Execution
                  </span>
                  <div className="space-y-1.5">
                    {explanation.stepByStepLogic.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-slate-300 text-xs leading-relaxed"
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variables */}
              {explanation.variables && explanation.variables.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-300 text-xs uppercase tracking-wider block">
                    Key Variables & Roles
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {explanation.variables.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs"
                      >
                        <strong className="font-mono text-cyan-300">{v.name}: </strong>
                        <span className="text-slate-300">{v.purpose}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Complexity Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Time Complexity</span>
                  <p className="text-xs font-semibold text-emerald-300">{explanation.timeComplexity}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Space Complexity</span>
                  <p className="text-xs font-semibold text-cyan-300">{explanation.spaceComplexity}</p>
                </div>
              </div>

              {/* Edge Cases */}
              {explanation.edgeCases && explanation.edgeCases.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <span className="font-bold text-amber-300 text-xs uppercase tracking-wider block">
                    Critical Edge Cases
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                    {explanation.edgeCases.map((ec, idx) => (
                      <li key={idx}>{ec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
