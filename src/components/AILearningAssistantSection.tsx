import React from 'react';
import {
  Sparkles,
  Bot,
  Calendar,
  FileSearch,
  HelpCircle,
  Compass,
  CheckCircle2,
  ArrowRight,
  Brain,
  Zap,
  BookOpen
} from 'lucide-react';

export interface AILearningAssistantSectionProps {
  onOpenAI?: () => void;
}

export const AILearningAssistantSection: React.FC<AILearningAssistantSectionProps> = ({ onOpenAI }) => {
  const aiCapabilities = [
    {
      id: 'ai-doubt-assistant',
      icon: Bot,
      title: 'First-Principles Doubt Solver',
      description:
        'Turns difficult assignment equations into intuitive step-by-step logic. Guides you through the foundational intuition before formulating complete conceptual mastery (Samajh Se Safalta Tak).',
      badge: 'Active Module',
      status: 'active',
    },
    {
      id: 'ai-notes-summarization',
      icon: FileSearch,
      title: 'Concise Notes & Mindmaps',
      description:
        'Condenses lengthy 80-page textbook slide decks into high-yield formula cheat sheets, concept mindmaps, and rapid exam revision summaries.',
      badge: 'Active Module',
      status: 'active',
    },
    {
      id: 'ai-quiz-generation',
      icon: HelpCircle,
      title: 'Exam Practice & Quiz Drills',
      description:
        'Instantly generates adaptive multiple-choice questions, conceptual checks, and previous-year question simulations tailored to your course code.',
      badge: 'Active Module',
      status: 'active',
    },
    {
      id: 'ai-study-plans',
      icon: Calendar,
      title: 'Adaptive Study Timetable',
      description:
        'Customizes revision schedules around your university mid-sem and end-sem exam dates, focusing extra hours on your weakest syllabus modules.',
      badge: 'Integrated',
      status: 'integrated',
    },
    {
      id: 'ai-recommendations',
      icon: Compass,
      title: 'Smart Peer Content Discovery',
      description:
        'Recommends the highest-rated peer handnotes, 5-minute video solutions, and active study rooms suited specifically to your university syllabus.',
      badge: 'Integrated',
      status: 'integrated',
    },
  ];

  return (
    <section id="ai-assistant-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          YuvaSetu AI Learning Assistant
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight">
          Samajh Se Safalta Tak{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">
            With AI Guidance
          </span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Not just an AI that spits out raw answers. YuvaSetu AI acts as a patient 24/7 academic tutor that explains the intuition behind difficult derivations, steps, and theorems.
        </p>
      </div>

      {/* AI CAPABILITIES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiCapabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.id}
              id={cap.id}
              className="p-6 rounded-3xl bg-gradient-to-b from-[#0d1428] to-[#070914] border border-indigo-500/20 shadow-xl flex flex-col justify-between hover:border-indigo-500/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    cap.status === 'active'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {cap.badge}
                  </span>
                </div>

                <h3 className="text-lg font-black font-['Outfit'] text-white mt-5">
                  {cap.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                  {cap.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  First-Principles Socratic Logic
                </span>
              </div>
            </div>
          );
        })}

        {/* Highlight Card: Try AI Assistant */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-[#0a0f20] to-[#070914] border border-indigo-500/40 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black font-['Outfit'] text-white">
              Try It on Your Toughest Subject
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask any engineering, science, or commerce question. Experience how YuvaSetu breaks down complex jargon into clear intuition.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={onOpenAI}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Learning Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
