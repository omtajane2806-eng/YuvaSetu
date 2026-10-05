import React, { useState } from 'react';
import { FileText, Sparkles, BookOpen, Check, Copy, X } from 'lucide-react';

interface AISummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summaryData: {
    title: string;
    summary: string;
    keyConcepts: string[];
    importantDefinitions: Array<{ term: string; definition: string }>;
    examPoints: string[];
  } | null;
}

export const AISummaryModal: React.FC<AISummaryModalProps> = ({
  isOpen,
  onClose,
  summaryData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !summaryData) return null;

  const handleCopy = () => {
    const textToCopy = `=== ${summaryData.title} ===\n\nSUMMARY:\n${summaryData.summary}\n\nKEY CONCEPTS:\n${summaryData.keyConcepts.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nDEFINITIONS:\n${summaryData.importantDefinitions.map((d) => `• ${d.term}: ${d.definition}`).join('\n')}\n\nEXAM POINTS:\n${summaryData.examPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="vidyasetu-ai-summary-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0b0f1e] border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-['Outfit'] text-white">
                Curriculum Summary
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-md">{summaryData.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="py-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Executive Summary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Summary</span>
            </div>
            <p className="text-slate-200 leading-relaxed">{summaryData.summary}</p>
          </div>

          {/* Key Concepts */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Key Concepts & Principles
            </h3>
            <div className="space-y-2">
              {summaryData.keyConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{concept}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Definitions */}
          {summaryData.importantDefinitions.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Important Definitions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {summaryData.importantDefinitions.map((def, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1"
                  >
                    <span className="font-bold text-cyan-300 text-xs block">{def.term}</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{def.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam Points */}
          {summaryData.examPoints.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <span className="font-bold text-amber-300 text-xs uppercase tracking-wider block">
                Exam Checklist & Scoring Points
              </span>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-xs leading-relaxed">
                {summaryData.examPoints.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
