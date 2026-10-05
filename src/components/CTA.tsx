import React from 'react';
import { ArrowRight, BookOpen, Users, Sparkles } from 'lucide-react';
import { YuvaSetuLogo } from './YuvaSetuLogo';

export interface CTAProps {
  onExploreClick: () => void;
  onGetStartedClick?: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onExploreClick, onGetStartedClick }) => {
  return (
    <section id="yuvasetu-final-cta-section" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#070b16] to-[#0d1428] border border-orange-500/30 p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden">
        {/* Glow ambient background lights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-orange-500/15 via-sky-500/10 to-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Official Emblem Mini Pill */}
          <div className="inline-flex items-center justify-center">
            <YuvaSetuLogo variant="badge" size="sm" showTagline={false} />
          </div>

          {/* Requested Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight">
            Your Next Breakthrough Starts with{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400 bg-clip-text text-transparent">
              Understanding.
            </span>
          </h2>

          {/* Requested Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
            Everything you need — verified handwritten notes, instant peer doubt solving, interactive study rooms, and an AI learning companion — all in one connected place.
          </p>

          {/* Requested Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="final-cta-start-learning-btn"
              onClick={onGetStartedClick || onExploreClick}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black text-base shadow-2xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>

            <button
              id="final-cta-explore-learning-btn"
              onClick={onExploreClick}
              className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-white hover:border-sky-400 font-bold text-base transition-all cursor-pointer w-full sm:w-auto"
            >
              <BookOpen className="w-5 h-5 text-sky-400" />
              <span>Explore Learning</span>
            </button>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
            <span>100% Free Core Learning</span>
            <span>•</span>
            <span>Verified Peer Materials</span>
            <span>•</span>
            <span className="text-orange-400 font-medium">Samajh Se Safalta Tak</span>
          </div>
        </div>
      </div>
    </section>
  );
};
