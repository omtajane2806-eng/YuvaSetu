import React from 'react';
import {
  Sparkles,
  Bot,
  Calendar,
  FileSearch,
  HelpCircle,
  Compass,
  Lock,
} from 'lucide-react';

export const AIFutureSection: React.FC = () => {
  const aiCapabilities = [
    {
      id: 'ai-doubt-assistant',
      icon: Bot,
      title: 'AI Doubt Assistant',
      description:
        'Instant 24/7 first-principles breakdown. Helps unblock challenging assignment equations by turning raw confusion into guided, step-by-step reasoning.',
      badge: 'Coming Soon',
    },
    {
      id: 'ai-study-plans',
      icon: Calendar,
      title: 'Personalized Study Plans',
      description:
        'Adaptive study schedules calibrated against your university exam timetable, available daily hours, and self-identified syllabus weak spots.',
      badge: 'Coming Soon',
    },
    {
      id: 'ai-notes-summarization',
      icon: FileSearch,
      title: 'Notes Summarization',
      description:
        'One-click conversion of lengthy 80-page textbook slides into concise 2-page formula reference guides, visual mindmaps, and key takeaway sheets.',
      badge: 'Coming Soon',
    },
    {
      id: 'ai-quiz-generation',
      icon: HelpCircle,
      title: 'Quiz Generation',
      description:
        'Automatically generate tailored multiple-choice drills, previous-year question simulations, and rapid flashcards directly from uploaded peer notes.',
      badge: 'Coming Soon',
    },
    {
      id: 'ai-recommendations',
      icon: Compass,
      title: 'Personalized Recommendations',
      description:
        'Smart content discovery that recommends the most helpful peer notes, video explainers, and study rooms suited to your exact university course code.',
      badge: 'Coming Soon',
    },
  ];

  return (
    <section id="ai-coming-soon-section" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Future Platform Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight">
          Your Future{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            AI Learning Companion
          </span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Upcoming AI-powered capabilities designed to enhance peer learning and accelerate your conceptual mastery (Samajh Se Safalta Tak).
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
              className="p-6 rounded-3xl bg-gradient-to-b from-[#0d1428] to-[#070914] border border-cyan-500/20 shadow-xl flex flex-col justify-between hover:border-cyan-500/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
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

              <div className="pt-4 mt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5" /> Conceptual AI Engine
                </span>
                <span className="text-slate-500">v2.0 Roadmap</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-slate-500 italic">
        *AI backend integrations will be introduced in subsequent roadmap phases while preserving 100% human-verified peer quality.
      </div>
    </section>
  );
};
