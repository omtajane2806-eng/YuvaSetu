import React from 'react';
import {
  GraduationCap,
  Sprout,
  Compass,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  Video,
  PenTool,
} from 'lucide-react';

export interface AudienceSectionProps {
  onGetStarted: () => void;
  onExploreCreator: () => void;
}

export const AudienceSection: React.FC<AudienceSectionProps> = ({
  onGetStarted,
  onExploreCreator,
}) => {
  const audiences = [
    {
      id: 'audience-college-students',
      icon: GraduationCap,
      badge: 'Urban & University Degree',
      title: 'College Students',
      summary: 'Learn subjects, find resources, and prepare better.',
      points: [
        'Overcome missed 8:30 AM lectures and attendance shortfalls.',
        'Find university-aligned formula sheets and topper notes.',
        'Clear late-night assignment roadblocks with peer doubt solvers.',
        'Prepare thoroughly for mid-terms, practicals, and university exams.',
      ],
      accent: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400',
      badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'audience-rural-learners',
      icon: Sprout,
      badge: 'Accessible Education',
      title: 'Rural Learners',
      summary: 'Access affordable learning resources and peer support.',
      points: [
        'Bridge the gap when local college faculty or specialized coaching is limited.',
        'Access lightweight, downloadable PDFs and high-yield notes for low-bandwidth devices.',
        'Connect with top-tier university peers across India for free guidance.',
        'Democratize high-caliber technical learning with zero geographic barriers.',
      ],
      accent: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'audience-self-learners',
      icon: Compass,
      badge: 'Flexible & Self-Paced',
      title: 'Independent Self-Learners',
      summary: 'Learn at your own pace through student-created content.',
      points: [
        'Master engineering fundamentals without rigid classroom constraints.',
        'Learn from real, student-tested explanations instead of dry academic textbooks.',
        'Explore interdisciplinary subjects and modern computer science domains.',
        'Build strong first-principles knowledge step by step (Samajh Se Safalta Tak).',
      ],
      accent: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    },
  ];

  return (
    <section
      id="yuvasetu-audience-section"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12"
    >
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-400">
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
          Target Learners & Creators
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight">
          Who Is{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
            YuvaSetu For?
          </span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Whether you are striving for semester top rank, learning from remote towns, or studying independently, YuvaSetu adapts to your learning journey.
        </p>
      </div>

      {/* 3 AUDIENCE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {audiences.map((aud) => {
          const Icon = aud.icon;
          return (
            <div
              key={aud.id}
              id={aud.id}
              className={`p-7 rounded-3xl border ${aud.accent} bg-gradient-to-b from-[#0d1222] to-[#070914] shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-all`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${aud.badgeClass}`}>
                    {aud.badge}
                  </span>
                </div>

                <h3 className="text-xl font-black font-['Outfit'] text-white mt-5">
                  {aud.title}
                </h3>
                <p className="text-xs font-bold text-slate-300 mt-1.5 leading-snug">
                  {aud.summary}
                </p>

                <div className="mt-5 space-y-2.5 border-t border-slate-800/80 pt-4">
                  {aud.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80">
                <button
                  onClick={onGetStarted}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Join as {aud.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SPECIAL SPOTLIGHT FOR STUDENT CREATORS */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#090e1c] to-[#0d1428] border border-amber-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
            <PenTool className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Future Creator Ecosystem
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Student Creators</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-['Outfit'] text-white mt-1">
              Are You a Student Who Makes Great Notes or Explains Concepts Well?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1 max-w-3xl">
              Student creators are an essential pillar of YuvaSetu. As you publish high-yield notes, solve community doubts, and share video breakdowns, you build genuine contributor reputation and open future opportunities.
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          <button
            onClick={onExploreCreator}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Learn About Creator System</span>
          </button>
        </div>
      </div>
    </section>
  );
};
