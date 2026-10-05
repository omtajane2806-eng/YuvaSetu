import React from 'react';
import {
  Coins,
  Sparkles,
  Bot,
  Calendar,
  FileSearch,
  HelpCircle,
  Clock,
  ShieldCheck,
  Wallet,
  ArrowRight,
  Lock,
} from 'lucide-react';

export const FutureFeatures: React.FC = () => {
  const aiFeatures = [
    {
      id: 'ai-doubt-assistant',
      title: 'AI Doubt Assistant',
      description: 'Instant 24/7 first-principles breakdown. Translates your raw confusion (Soch) into rigorous conceptual steps (Samajh).',
      icon: Bot,
      status: 'Coming in v2.0',
    },
    {
      id: 'ai-study-plans',
      title: 'Personalized Study Plans',
      description: 'Adaptive study schedules calibrated against your specific college exam dates and weak syllabus topics.',
      icon: Calendar,
      status: 'Coming in v2.0',
    },
    {
      id: 'ai-notes-summarization',
      title: 'Notes Summarization',
      description: 'One-click conversion of 50-page lecture slides into concise 2-page formula cheat sheets and mindmaps.',
      icon: FileSearch,
      status: 'Coming in v2.0',
    },
    {
      id: 'ai-quiz-generation',
      title: 'Quiz Generation',
      description: 'Automatically generates multiple-choice practice drills and flashcards directly from your uploaded peer notes.',
      icon: HelpCircle,
      status: 'Coming in v2.0',
    },
  ];

  return (
    <section id="future-features-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          Product Roadmap & Preview
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight">
          What’s Coming to{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
            YuvaSetu Next
          </span>
        </h2>
        <p className="text-slate-300 text-base leading-relaxed">
          Here is an early look at upcoming features currently under active design and community feedback.
        </p>
      </div>

      {/* 1. VIDYA TOKENS PREVIEW (FUTURE FEATURE) */}
      <div
        id="vidya-tokens-preview-card"
        className="rounded-3xl bg-gradient-to-r from-[#0d1222] via-[#090e1c] to-[#0d1222] border border-amber-500/30 p-8 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-2xl font-black font-['Outfit'] text-white">Vidya Tokens</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Future Feature Preview
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Micro-value student wallet for specialized creator study packs</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Currently in Prototype Design</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              We believe students shouldn't have to purchase expensive monthly subscriptions for a single exam cheat sheet. With <strong>Vidya Tokens</strong>, you'll be able to unlock high-yield creator packs with micro-transactions starting at pocket-money prices.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Example Conversion Rate:</span>
                <span className="text-amber-400 font-extrabold text-sm">₹10 → 100 Vidya Tokens</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Users can use tokens to access premium content, while unused tokens remain permanently in their wallet with zero expiration.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> No forced auto-renewals
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-400" /> Permanent student wallet
              </span>
            </div>
          </div>

          {/* Interactive Visual Wallet Mockup */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#060810] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Preview Wallet Balance</span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">Demo UI</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-['Outfit'] text-amber-400">350</span>
              <span className="text-xs font-bold text-slate-400">Vidya Tokens (≈ ₹35)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span>Formula Sheet Unlock</span>
              <span className="font-bold text-amber-400">-15 Tokens</span>
            </div>
            <div className="text-[10px] text-slate-500 text-center italic">
              *Full payment integration will be launched in future platform phases.
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI FUTURE FEATURES PREVIEW */}
      <div id="ai-features-preview-card" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-2xl font-black font-['Outfit'] text-white">AI-Powered Learning Suite</h3>
            </div>
            <p className="text-xs text-slate-400">
              Next-generation intelligence trained specifically on first-principles conceptual pedagogy.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Coming in Future Versions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiFeatures.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                id={f.id}
                className="p-6 rounded-3xl bg-gradient-to-b from-[#0e1324] to-[#070914] border border-cyan-500/20 shadow-xl flex flex-col justify-between hover:border-cyan-500/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {f.status}
                    </span>
                  </div>
                  <h4 className="text-base font-black font-['Outfit'] text-white mt-4">{f.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">{f.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-bold text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Preview Architecture Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
