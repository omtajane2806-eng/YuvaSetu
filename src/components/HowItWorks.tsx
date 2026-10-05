import React from 'react';
import {
  UserPlus,
  BookOpen,
  HelpCircle,
  Radio,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export interface HowItWorksProps {
  onJoinClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onJoinClick }) => {
  const journeySteps = [
    {
      stepNumber: '01',
      title: 'Create your learning profile',
      actionVerb: 'Set Up Your Academic Base',
      description: 'Sign up in seconds, pick your branch and subjects, and personalize your feed for your semester exams.',
      icon: UserPlus,
      color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
      badge: 'Step 1 • Profile',
    },
    {
      stepNumber: '02',
      title: 'Explore learning resources',
      actionVerb: 'Study Verified Materials',
      description: 'Access curated handwritten lecture notes, quick formula sheets, and 5-minute visual concept breakdowns.',
      icon: BookOpen,
      color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
      badge: 'Step 2 • Discover',
    },
    {
      stepNumber: '03',
      title: 'Ask doubts and use AI',
      actionVerb: 'Get First-Principles Clarity',
      description: 'Post tough homework problems to peer solvers or consult the YuvaSetu AI companion for step-by-step intuition.',
      icon: HelpCircle,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      badge: 'Step 3 • Resolve',
    },
    {
      stepNumber: '04',
      title: 'Join live learning',
      actionVerb: 'Participate in Real Time',
      description: 'Attend interactive study rooms and live masterclasses led by university mentors to clarify difficult derivations.',
      icon: Radio,
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
      badge: 'Step 4 • Interactive',
    },
    {
      stepNumber: '05',
      title: 'Learn with the community',
      actionVerb: 'Collaborate with Peers',
      description: 'Engage in thoughtful academic discussions, help fellow classmates, and exchange high-yield exam tips.',
      icon: Users,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      badge: 'Step 5 • Community',
    },
    {
      stepNumber: '06',
      title: 'Track your progress',
      actionVerb: 'Samajh Se Safalta',
      description: 'Monitor your completed topics, earn VidyaTokens for contributions, and build unshakeable exam confidence.',
      icon: TrendingUp,
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
      badge: 'Step 6 • Mastery',
    },
  ];

  return (
    <section id="how-it-works-section" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold uppercase tracking-widest text-orange-400">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          The Student Journey
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight">
          How YuvaSetu{' '}
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400 bg-clip-text text-transparent">
            Works For You
          </span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          From first-year syllabus confusion to semester exam mastery — a continuous, connected journey designed around how students actually learn.
        </p>
      </div>

      {/* CONNECTED TIMELINE JOURNEY */}
      <div className="relative mt-14 sm:mt-16">
        {/* Continuous Connecting Line for Desktop */}
        <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-0.5 -translate-x-1/2 bg-gradient-to-b from-orange-500 via-sky-500 to-indigo-500 opacity-30" />

        <div className="space-y-8 sm:space-y-12 relative">
          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={step.stepNumber}
                id={`how-it-works-step-${step.stepNumber}`}
                className="relative flex flex-col lg:flex-row items-center justify-between gap-6"
              >
                {/* Left Side (Even steps on desktop) */}
                <div
                  className={`w-full lg:w-[45%] ${
                    isEven ? 'lg:text-right lg:pr-8' : 'lg:order-last lg:text-left lg:pl-8'
                  }`}
                >
                  <div className="p-6 rounded-3xl bg-[#0a0e1c] border border-slate-800/90 shadow-xl hover:border-slate-700 transition-all group">
                    <div
                      className={`flex items-center gap-3 mb-3 ${
                        isEven ? 'lg:justify-end' : 'lg:justify-start'
                      }`}
                    >
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                        {step.badge}
                      </span>
                      <span className="text-sm font-black font-['Outfit'] text-slate-600 group-hover:text-slate-400 transition-colors">
                        Phase {step.stepNumber}
                      </span>
                    </div>

                    <h3 className="text-xl font-black font-['Outfit'] text-white">
                      {step.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-300 mt-1">{step.actionVerb}</p>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2.5">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center Node Marker */}
                <div className="relative z-10 flex items-center justify-center">
                  <div
                    className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${step.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Right Side Spacer / Placeholder */}
                <div
                  className={`w-full lg:w-[45%] hidden lg:block ${
                    isEven ? 'lg:pl-8' : 'lg:order-first lg:pr-8'
                  }`}
                >
                  {/* Subtle step illustration indicator */}
                  <div className={`text-xs text-slate-500 font-mono ${isEven ? 'text-left' : 'text-right'}`}>
                    <span>{'//'} Milestone {step.stepNumber}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CALL TO ACTION BUTTON */}
      <div className="mt-14 text-center">
        <button
          id="how-it-works-join-btn"
          onClick={onJoinClick}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>Start Step 1: Create Free Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
