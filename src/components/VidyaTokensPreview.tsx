import React from 'react';
import { Coins, ShieldCheck, Wallet, ArrowRight, Sparkles, CheckCircle2, Award, Zap } from 'lucide-react';

export interface VidyaTokensPreviewProps {
  onExploreWallet?: () => void;
}

export const VidyaTokensPreview: React.FC<VidyaTokensPreviewProps> = ({ onExploreWallet }) => {
  return (
    <section id="vidya-tokens-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-r from-[#0d1222] via-[#090e1c] to-[#0d1222] border border-amber-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background lights */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">VidyaTokens System</h3>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40">
                  Student Micro-Economy
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Transparent student micro-reward system that values your contributions and unlocks curated study packs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Free Core Learning</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-8 relative z-10">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              YuvaSetu operates on a transparent, pocket-friendly token economy designed specifically for Indian college students. Earn tokens by answering peer doubts and uploading quality notes, or purchase micro-packs for specialized exam materials.
            </p>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-orange-500/20 space-y-4">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-300">Predictable Pocket-Friendly Conversion:</span>
                <span className="text-orange-400 font-extrabold text-base">₹10 → 100 VidyaTokens (VT)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spend only what you need for a specific formula sheet or verified solution, and retain your remaining tokens in your permanent student wallet for future exam cycles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#060810] border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">100 Purchased</div>
                  <div className="text-sm font-black text-orange-400 mt-0.5">+100 VT</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">₹10 Spent</div>
                </div>
                <div className="p-3 rounded-xl bg-[#060810] border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">50 Spent</div>
                  <div className="text-sm font-black text-rose-400 mt-0.5">-50 VT</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Exam PYQ Pack</div>
                </div>
                <div className="p-3 rounded-xl bg-[#060810] border border-orange-500/30 text-center">
                  <div className="text-[10px] text-orange-400/80 font-bold uppercase">50 Retained</div>
                  <div className="text-sm font-black text-emerald-400 mt-0.5">50 in Wallet</div>
                  <div className="text-[10px] text-emerald-400/80 mt-0.5">Never Expires</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No recurring subscription lock-ins
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-orange-400" /> Wallet balance never expires
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" /> Earn VT by helping fellow students
              </span>
            </div>
          </div>

          {/* Interactive Visual Wallet Mockup */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#060810] border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-orange-400" />
                VidyaTokens Wallet
              </span>
              <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50 font-bold">
                Active Balance
              </span>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400">Available Token Balance</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-['Outfit'] text-orange-400">250</span>
                <span className="text-xs font-bold text-slate-400">VidyaTokens (≈ ₹25)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-slate-300">
                <span className="truncate max-w-[200px]">Engg Mathematics Formula Pack</span>
                <span className="font-bold text-rose-400">-25 VT</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-slate-300">
                <span className="truncate max-w-[200px]">Answered Doubt: Laplace Transform</span>
                <span className="font-bold text-emerald-400">+15 VT</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-slate-300">
                <span className="truncate max-w-[200px]">Uploaded Handwritten DSA Notes</span>
                <span className="font-bold text-emerald-400">+50 VT</span>
              </div>
            </div>

            {onExploreWallet && (
              <button
                onClick={onExploreWallet}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                <span>View Full Token Wallet Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
