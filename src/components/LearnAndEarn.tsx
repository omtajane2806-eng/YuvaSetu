import React from 'react';
import { Award, BookOpen, Star, Sparkles, CheckCircle2, ArrowRight, Coins, Users } from 'lucide-react';

export interface LearnAndEarnProps {
  onLearnMore: () => void;
}

export const LearnAndEarn: React.FC<LearnAndEarnProps> = ({ onLearnMore }) => {
  const pathways = [
    {
      title: 'Verified Handwritten Notes',
      description: 'Upload your clear handwritten lecture derivations, summary sheets, and solved PYQ sets to help peer students across colleges.',
      icon: BookOpen,
      badge: 'Study Notes',
    },
    {
      title: 'Doubt Resolution & Mentorship',
      description: 'Answer complex conceptual questions from peer students, share step-by-step intuition, and earn VidyaTokens with community upvotes.',
      icon: Star,
      badge: 'Doubt Solving',
    },
    {
      title: 'Contributor Reputation & Badges',
      description: 'Build your verified academic standing, collect subject mastery badges, and gain prominent recognition in student study circles.',
      icon: Award,
      badge: 'Academic Standing',
    },
  ];

  return (
    <section id="learn-and-earn-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-br from-[#0e1424] via-[#090d1a] to-[#070912] border border-amber-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Contributor Recognition
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight">
            Turn Knowledge Into{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              Peer Impact & Rewards
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Students who contribute verified study resources and resolve doubts for classmates earn VidyaTokens, build verified academic reputation badges, and get recognized as subject leaders in their university branches.
          </p>
        </div>

        {/* 3 Step Pathway */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 relative z-10">
          {pathways.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-lg hover:border-amber-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-black font-['Outfit'] text-white mt-4">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Contributor Rewards & Educational Integrity */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 relative z-10">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Core foundational peer notes and doubts remain 100% free and accessible for all students.</span>
          </div>
          <button
            onClick={onLearnMore}
            className="flex items-center gap-1.5 font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span>Learn About Contributor Rewards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
