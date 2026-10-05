import React from 'react';
import {
  BookOpen,
  Share2,
  HelpCircle,
  Users,
  Award,
  DollarSign,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export interface FeaturesProps {
  onFeatureClick: (featureId: string) => void;
}

export const Features: React.FC<FeaturesProps> = ({ onFeatureClick }) => {
  const featureCards = [
    {
      id: 'feature-learn',
      icon: BookOpen,
      emoji: '📚',
      title: 'Learn',
      highlight: 'Find notes, PDFs, videos, and other learning resources shared by students.',
      description:
        'Access handwritten notes, formula cheat sheets, and short student concept videos that break down tough syllabus topics with step-by-step clarity.',
      accent: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      actionText: 'Find Notes & Videos',
      viewTarget: 'explore',
    },
    {
      id: 'feature-share',
      icon: Share2,
      emoji: '💡',
      title: 'Share',
      highlight: 'Upload and share useful educational content.',
      description:
        'Upload your own organized class notes, solved previous-year papers, and revision mindmaps to help fellow students overcome tough exams.',
      accent: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      actionText: 'Contribute Notes',
      viewTarget: 'upload',
    },
    {
      id: 'feature-solve-doubts',
      icon: HelpCircle,
      emoji: '❓',
      title: 'Solve Doubts',
      highlight: 'Ask questions and receive explanations from fellow students.',
      description:
        'Post your questions and receive intuitive, first-principles "Samajh Se Safalta Tak" step-by-step explanations from peer toppers.',
      accent: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400',
      actionText: 'Ask & Solve Doubts',
      viewTarget: 'doubts',
    },
    {
      id: 'feature-study-rooms',
      icon: Users,
      emoji: '👥',
      title: 'Study Rooms',
      highlight: 'Join or create focused public/private study rooms.',
      description:
        'Join synchronized co-working rooms, ambient library focus timers, and group problem-solving sprints where students study together.',
      accent: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      actionText: 'Join Study Rooms',
      viewTarget: 'study_rooms',
    },
    {
      id: 'feature-build-reputation',
      icon: Award,
      emoji: '⭐',
      title: 'Build Reputation',
      highlight: 'Help other students and build your contributor reputation.',
      description:
        'Earn peer upvotes, contributor badges, and verified subject authority on your student profile as you help others solve difficult topics.',
      accent: 'from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400',
      actionText: 'Build Contributor Profile',
      viewTarget: 'dashboard',
    },
    {
      id: 'feature-learn-and-earn',
      icon: DollarSign,
      emoji: '🪙',
      title: 'VidyaTokens Rewards',
      highlight: 'Earn academic tokens for consistent study and helpful peer answers.',
      description:
        'Accumulate VidyaTokens for solving student doubts, contributing study sheets, and maintaining study streaks across semesters.',
      accent: 'from-amber-400/20 to-yellow-500/10 border-amber-400/30 text-amber-300',
      actionText: 'Explore VidyaTokens',
      viewTarget: 'wallet',
    },
  ];

  return (
    <section id="yuvasetu-core-features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Everything You Need In One Place
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight">
          Core Features Built For{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
            Student Success
          </span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Six foundational pillars designed to transform college study from lonely cramming into collaborative mastery.
        </p>
      </div>

      {/* 6 FEATURE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {featureCards.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              id={feat.id}
              onClick={() => onFeatureClick(feat.viewTarget)}
              className={`p-7 rounded-3xl bg-gradient-to-b ${feat.accent} bg-slate-900/60 border backdrop-blur-md shadow-xl hover:border-cyan-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {feat.emoji}
                  </div>
                  <span className="p-2 rounded-xl bg-slate-900/60 text-slate-400 group-hover:text-cyan-400 transition-colors">
                    <Icon className="w-4 h-4" />
                  </span>
                </div>

                <h3 className="text-xl font-black font-['Outfit'] text-white mt-5 flex items-center gap-2">
                  {feat.title}
                </h3>
                <p className="text-xs font-bold text-slate-200 mt-1">{feat.highlight}</p>
                <p className="text-xs text-slate-400 leading-relaxed mt-3">{feat.description}</p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-cyan-300 transition-colors">
                <span>{feat.actionText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
