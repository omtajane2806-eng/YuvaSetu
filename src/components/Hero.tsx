import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Search,
  Users,
  HelpCircle,
  TrendingUp,
  Radio,
  Cpu,
  GraduationCap,
  CheckCircle2,
  Layers,
  ChevronRight,
} from 'lucide-react';

export interface HeroProps {
  onExploreNotes: (subjectFilter?: string) => void;
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreNotes, onGetStarted }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNode, setActiveNode] = useState<string>('student');

  const quickSubjects = [
    { name: 'Computer Science (DSA)', icon: '💻' },
    { name: 'Engg Mathematics', icon: '📐' },
    { name: 'Operating Systems', icon: '⚙️' },
    { name: 'Database Systems', icon: '🗄️' },
    { name: 'Computer Networks', icon: '🌐' },
  ];

  // Connected Ecosystem Nodes
  const ecosystemNodes = [
    {
      id: 'learning',
      label: 'Learning',
      sublabel: 'Verified Notes & Guides',
      icon: BookOpen,
      accent: 'text-sky-400 border-sky-500/40 bg-sky-500/10 hover:border-sky-400',
      activeBorder: 'border-sky-400 shadow-lg shadow-sky-500/20 bg-sky-500/20',
      pos: 'top-2 left-6 sm:top-4 sm:left-10',
      detail: 'Curated peer notes, formula sheets, and 5-min concept breakdowns.',
    },
    {
      id: 'doubts',
      label: 'Doubts',
      sublabel: 'Peer & Mentor Solvers',
      icon: HelpCircle,
      accent: 'text-amber-400 border-amber-500/40 bg-amber-500/10 hover:border-amber-400',
      activeBorder: 'border-amber-400 shadow-lg shadow-amber-500/20 bg-amber-500/20',
      pos: 'top-2 right-6 sm:top-4 sm:right-10',
      detail: 'Ask any challenging problem. Verified solutions from peers and mentors.',
    },
    {
      id: 'community',
      label: 'Community',
      sublabel: 'Peer Study Circles',
      icon: Users,
      accent: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-400',
      activeBorder: 'border-emerald-400 shadow-lg shadow-emerald-500/20 bg-emerald-500/20',
      pos: 'bottom-2 left-6 sm:bottom-4 sm:left-10',
      detail: 'Collaborate with branch peers across universities. Share wisdom.',
    },
    {
      id: 'ai',
      label: 'AI Companion',
      sublabel: 'Samajh AI Guide',
      icon: Sparkles,
      accent: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10 hover:border-indigo-400',
      activeBorder: 'border-indigo-400 shadow-lg shadow-indigo-500/20 bg-indigo-500/20',
      pos: 'bottom-2 right-6 sm:bottom-4 sm:right-10',
      detail: '24/7 patient tutor explaining concepts from first principles.',
    },
    {
      id: 'growth',
      label: 'Academic Growth',
      sublabel: 'Safalta: Exam Mastery',
      icon: TrendingUp,
      accent: 'text-rose-400 border-rose-500/40 bg-rose-500/10 hover:border-rose-400',
      activeBorder: 'border-rose-400 shadow-lg shadow-rose-500/20 bg-rose-500/20',
      pos: 'bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2',
      detail: 'Track learning milestones, earn VidyaTokens, and ace your exams.',
    },
  ];

  return (
    <section
      id="yuvasetu-hero-section"
      className="relative pt-6 sm:pt-10 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Background Depth Layers */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-orange-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* LEFT COLUMN: Hero Content */}
        <div className="lg:col-span-6 space-y-6 text-left relative z-10">
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-md">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400 bg-clip-text text-transparent">
              Samajh Se Safalta Tak
            </span>
          </div>

          {/* Main Headline communicating concept understanding & academic growth */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] text-white tracking-tight leading-[1.12]">
            Understand Concepts.{' '}
            <span className="block mt-1 bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400 bg-clip-text text-transparent">
              Learn Together. Grow Academically.
            </span>
          </h1>

          {/* Short supporting statement */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
            YuvaSetu connects verified study notes, peer doubt resolution, interactive study rooms, and an AI learning companion into one cohesive ecosystem — taking you from understanding to academic success.
          </p>

          {/* Quick Search */}
          <div className="pt-1">
            <div className="relative max-w-lg">
              <input
                id="hero-quick-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onExploreNotes(searchQuery);
                  }
                }}
                placeholder="Search subjects, notes, problems (e.g. DSA, OS, Maths)..."
                className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-xl transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                id="hero-quick-search-btn"
                onClick={() => onExploreNotes(searchQuery)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:opacity-95 transition-opacity cursor-pointer"
              >
                Search
              </button>
            </div>

            {/* Popular Subject Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span className="text-slate-400 font-medium">Quick Topics:</span>
              {quickSubjects.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => onExploreNotes(sub.name)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                >
                  <span className="mr-1">{sub.icon}</span>
                  {sub.name}
                </button>
              ))}
            </div>
          </div>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="hero-primary-cta-start-learning"
              onClick={onGetStarted}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-black text-sm sm:text-base shadow-xl shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <button
              id="hero-secondary-cta-explore-learning"
              onClick={() => onExploreNotes()}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-white hover:border-sky-400 font-bold text-sm sm:text-base transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Explore Learning</span>
            </button>
          </div>

          {/* Qualitative Value Proof (No fake inflated metrics) */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/80">
            <div>
              <div className="text-xs sm:text-sm font-black font-['Outfit'] text-white">Connected Platform</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Notes, Doubts & Live in One Place</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black font-['Outfit'] text-orange-400">100% Free Core</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Academic Access for Students</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black font-['Outfit'] text-sky-400">Peer & AI Mentorship</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Collaborative Exam Prep</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sophisticated Learning Ecosystem Visualization */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#0e1428] via-[#090d1c] to-[#060812] border border-slate-800/90 p-6 sm:p-8 shadow-2xl overflow-hidden min-h-[440px] sm:min-h-[480px] flex flex-col justify-between">
            {/* Header / Subhead of Visual */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                  The YuvaSetu Ecosystem
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Everything connected for you
              </span>
            </div>

            {/* Visual Canvas with Connecting SVG & Interactive Nodes */}
            <div className="relative flex-1 my-4 flex items-center justify-center min-h-[300px]">
              {/* SVG Connecting Web of Lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                viewBox="0 0 400 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Center to Top-Left (Learning) */}
                <line x1="200" y1="140" x2="80" y2="50" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
                {/* Center to Top-Right (Doubts) */}
                <line x1="200" y1="140" x2="320" y2="50" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
                {/* Center to Bottom-Left (Community) */}
                <line x1="200" y1="140" x2="80" y2="240" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
                {/* Center to Bottom-Right (AI) */}
                <line x1="200" y1="140" x2="320" y2="240" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
                {/* Center to Growth */}
                <line x1="200" y1="140" x2="200" y2="260" stroke="#fb7185" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />

                {/* Outer Ring Connectors */}
                <path d="M 80 50 Q 200 20 320 50" stroke="#475569" strokeWidth="1" strokeOpacity="0.3" fill="none" />
                <path d="M 80 240 Q 200 290 320 240" stroke="#475569" strokeWidth="1" strokeOpacity="0.3" fill="none" />

                {/* Animated Signals Pulsing Along Lines */}
                <circle cx="140" cy="95" r="2.5" fill="#38bdf8" className="animate-ping" />
                <circle cx="260" cy="95" r="2.5" fill="#fbbf24" className="animate-ping" />
                <circle cx="140" cy="190" r="2.5" fill="#34d399" className="animate-ping" />
                <circle cx="260" cy="190" r="2.5" fill="#818cf8" className="animate-ping" />
              </svg>

              {/* Central Core: The Student */}
              <div
                onClick={() => setActiveNode('student')}
                className={`relative z-10 p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                  activeNode === 'student'
                    ? 'bg-slate-900 border-orange-500 shadow-xl shadow-orange-500/20 scale-105'
                    : 'bg-slate-900/90 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-white mt-1.5">You (Student)</span>
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                  Center of Focus
                </span>
              </div>

              {/* Orbiting Ecosystem Nodes */}
              {ecosystemNodes.map((node) => {
                const Icon = node.icon;
                const isSelected = activeNode === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveNode(node.id)}
                    className={`absolute z-10 p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${node.pos} ${
                      isSelected ? node.activeBorder : node.accent
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <div className="text-left">
                        <div className="text-xs font-black text-white leading-tight">{node.label}</div>
                        <div className="text-[9px] text-slate-400 leading-tight hidden sm:block">
                          {node.sublabel}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Interactive Insight Card */}
            <div className="pt-3 border-t border-slate-800/80 relative z-10 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-400">Focused Pillar: </span>
                <span className="font-bold text-white">
                  {activeNode === 'student'
                    ? 'The Student'
                    : ecosystemNodes.find((n) => n.id === activeNode)?.label}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm">
                  {activeNode === 'student'
                    ? 'Everything in YuvaSetu revolves around empowering you from concept confusion to academic mastery.'
                    : ecosystemNodes.find((n) => n.id === activeNode)?.detail}
                </p>
              </div>

              <button
                onClick={() => onExploreNotes()}
                className="shrink-0 flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors ml-4 cursor-pointer"
              >
                <span>Explore</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
