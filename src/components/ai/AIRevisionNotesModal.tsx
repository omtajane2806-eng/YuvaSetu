import React, { useState } from 'react';
import { BookOpen, Sparkles, AlertTriangle, Check, Copy, X, ListOrdered } from 'lucide-react';

interface AIRevisionNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  revisionData: {
    topic: string;
    importantConcepts: string[];
    definitions: Array<{ term: string; meaning: string }>;
    formulas: string[];
    examples: string[];
    commonMistakes: string[];
    quickRevision: string[];
  } | null;
}

export const AIRevisionNotesModal: React.FC<AIRevisionNotesModalProps> = ({
  isOpen,
  onClose,
  revisionData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !revisionData) return null;

  const handleCopy = () => {
    const textToCopy = `=== ${revisionData.topic} ===\n\nCONCEPTS:\n${revisionData.importantConcepts.map((c) => `• ${c}`).join('\n')}\n\nDEFINITIONS:\n${revisionData.definitions.map((d) => `• ${d.term}: ${d.meaning}`).join('\n')}\n\nFORMULAS & COMPLEXITIES:\n${revisionData.formulas.map((f) => `• ${f}`).join('\n')}\n\nEXAMPLES:\n${revisionData.examples.map((e) => `• ${e}`).join('\n')}\n\nCOMMON MISTAKES:\n${revisionData.commonMistakes.map((m) => `• ${m}`).join('\n')}\n\nQUICK REVISION:\n${revisionData.quickRevision.map((q) => `• ${q}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="vidyasetu-ai-revision-notes-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0b0f1e] border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* TOP BAR */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-['Outfit'] text-white">
                Structured Revision Notes
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-md">{revisionData.topic}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Notes'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENT BODY */}
        <div className="py-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Quick Revision Bullets */}
          <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
            <span className="font-bold text-cyan-400 text-xs uppercase tracking-wider block">
              Quick Revision Summary
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {revisionData.quickRevision.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-200 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Concepts */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Core Concepts
            </h3>
            <div className="space-y-2">
              {revisionData.importantConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-slate-200 text-xs leading-relaxed"
                >
                  {concept}
                </div>
              ))}
            </div>
          </div>

          {/* Formulas */}
          {revisionData.formulas.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Formulas & Recurrences
              </h3>
              <div className="space-y-2">
                {revisionData.formulas.map((form, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300 text-xs"
                  >
                    {form}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {revisionData.examples.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Concrete Examples & Tracing
              </h3>
              <div className="space-y-2">
                {revisionData.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs leading-relaxed"
                  >
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          {revisionData.commonMistakes.length > 0 && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-300 uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Common Mistakes to Avoid</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-xs leading-relaxed">
                {revisionData.commonMistakes.map((mis, idx) => (
                  <li key={idx}>{mis}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
