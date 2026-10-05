import React from 'react';
import {
  AlertTriangle,
  Clock,
  HelpCircle,
  DollarSign,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Users,
  Video,
} from 'lucide-react';
import { YuvaSetuLogo } from './YuvaSetuLogo';

export interface ProblemSectionProps {
  onExploreSolution: () => void;
}

export const ProblemSection: React.FC<ProblemSectionProps> = ({ onExploreSolution }) => {
  const problems = [
    {
      id: 'problem-missed-lectures',
      icon: Clock,
      title: 'Missed Lectures',
      subtitle: '8:30 AM class missed in traffic?',
      description:
        'Long urban commutes, attendance constraints, or lab clashes often mean missing critical derivations with zero recorded lecture backups from your college.',
      accent: 'border-rose-500/30 bg-rose-500/5 text-rose-400',
      badge: 'Pain Point 01',
    },
    {
      id: 'problem-difficult-concepts',
      icon: AlertTriangle,
      title: 'Difficult Concepts',
      subtitle: 'Cryptic textbook jargon & hurried slides',
      description:
        'Professors rush through 60 slides in an hour. Textbooks explain concepts with dense mathematical formalisms instead of real intuition.',
      accent: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
      badge: 'Pain Point 02',
    },
    {
      id: 'problem-lack-of-guidance',
      icon: HelpCircle,
      title: 'Lack of Guidance',
      subtitle: 'Stuck on an assignment at 11 PM?',
      description:
        'When you hit a roadblock right before exam week or project submission, TA office hours are packed and you have no one to ask questions in your language.',
      accent: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400',
      badge: 'Pain Point 03',
    },
    {
      id: 'problem-expensive-resources',
      icon: DollarSign,
      title: 'Expensive Learning Resources',
      subtitle: 'Hefty coaching bills & paywalled notes',
      description:
        'Commercial coaching platforms charge thousands for generic lectures that do not align with your specific university syllabus and exam patterns.',
      accent: 'border-purple-500/30 bg-purple-500/5 text-purple-400',
      badge: 'Pain Point 04',
    },
  ];

  return (
    <section
      id="yuvasetu-problem-solution-section"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" />
          The College Reality
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight">
          Missed a Lecture?{' '}
          <span className="bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
            Didn't Understand the Topic?
          </span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Every college student faces these exact roadblocks. You are not alone, and you shouldn't have to struggle in isolation.
        </p>
      </div>

      {/* 4 PROBLEM CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {problems.map((prob) => {
          const Icon = prob.icon;
          return (
            <div
              key={prob.id}
              id={prob.id}
              className={`p-6 rounded-2xl border ${prob.accent} backdrop-blur-sm transition-all hover:scale-[1.02] flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    {prob.badge}
                  </span>
                </div>
                <h3 className="text-lg font-black font-['Outfit'] text-white mt-4">{prob.title}</h3>
                <p className="text-xs font-bold text-slate-300 mt-1">{prob.subtitle}</p>
                <p className="text-xs text-slate-400 leading-relaxed mt-3">{prob.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* INTRODUCING YUVASETU AS THE SOLUTION */}
      <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0c1224] via-[#090d1a] to-[#060810] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              The YuvaSetu Solution
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
              Learn From Peers Who Just Conquered The Exact Same Exam
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              YuvaSetu is built on a simple truth: <strong>the best person to explain a complex engineering or science topic is often a fellow student</strong> who solved the confusion 10 minutes ago. Access verified handwritten notes, 5-minute intuitive video breakdowns, and round-the-clock peer doubt solving.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Topper handwritten notes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Bite-sized concept videos</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Free & community-powered</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
            <button
              id="solution-explore-btn"
              onClick={onExploreSolution}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm shadow-xl shadow-cyan-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Peer Notes & Videos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-400 mt-2">No paywall • Instant preview</span>
          </div>
        </div>
      </div>
    </section>
  );
};
