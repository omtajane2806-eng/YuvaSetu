import React from 'react';
import {
  BookOpen,
  Share2,
  HelpCircle,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Video,
} from 'lucide-react';
import { YuvaSetuLogo } from './YuvaSetuLogo';

export interface SolutionSectionProps {
  onExploreNotes: () => void;
  onGetStarted: () => void;
}

export const SolutionSection: React.FC<SolutionSectionProps> = ({
  onExploreNotes,
  onGetStarted,
}) => {
  const solutionPillars = [
    {
      icon: BookOpen,
      title: 'Find Peer-Created Learning Resources',
      description:
        'Access curated handwritten notes, formula cheat sheets, and short student concept videos that break down tough syllabus topics with step-by-step clarity.',
      accent: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    },
    {
      icon: Share2,
      title: 'Share Knowledge',
      description:
        'Upload your own organized class notes, solved previous-year questions, and revision mindmaps to help peers across colleges overcome tough exams.',
      accent: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    },
    {
      icon: HelpCircle,
      title: 'Ask Questions & Solve Doubts',
      description:
        'Post your questions and get intuitive, step-by-step explanations from fellow students who recently mastered the exact same problem.',
      accent: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    },
    {
      icon: Users,
      title: 'Study Together',
      description:
        'Join synchronized focus study rooms and virtual co-learning spaces to stay disciplined, motivated, and accountable together.',
      accent: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    },
  ];

  return (
    <section
      id="yuvasetu-solution-section"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          The YuvaSetu Solution
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight">
          One Platform.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
            A Community of Learners.
          </span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          YuvaSetu brings together everything college students need to bridge the gap between classroom confusion and true conceptual clarity — powered entirely by peers.
        </p>
      </div>

      {/* 4 SOLUTION PILLARS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {solutionPillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-6 rounded-3xl bg-gradient-to-b from-[#0e1324] to-[#070914] border border-slate-800/90 hover:border-cyan-500/40 shadow-xl flex flex-col justify-between transition-all group"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${item.accent} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black font-['Outfit'] text-white mt-5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>100% Student Powered</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CALLOUT BANNER */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#090d1a] to-[#0d1428] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-black font-['Outfit'] text-white">
              Ready to find notes and videos for your semester?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Browse handwritten topper notes, formula cheat sheets, and 5-min concept videos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onExploreNotes}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs transition-colors cursor-pointer"
          >
            Explore Notes & Videos
          </button>
        </div>
      </div>
    </section>
  );
};
