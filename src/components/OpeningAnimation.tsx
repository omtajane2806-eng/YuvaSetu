import React, { useState, useEffect } from 'react';
import { YuvaSetuLogo } from './YuvaSetuLogo';
import { Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';

export interface OpeningAnimationProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({
  onComplete,
  forcePlay = false,
}) => {
  const [phase, setPhase] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Subtle web audio harmonic chime
  const playHarmonicChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Root harmonic chord: C4, E4, G4, C5 (Educational dawn motif)
      const frequencies = [261.63, 329.63, 392.0, 523.25];
      const now = ctx.currentTime;

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.12 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.3);
      });
    } catch {
      // Audio autoplay gracefully suppressed
    }
  };

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    // Check if previously played in this session unless forcePlay is set
    if (!forcePlay && sessionStorage.getItem('yuvasetu_intro_played')) {
      onComplete();
      return;
    }

    // Trigger subtle chime after brief pause
    const chimeTimer = setTimeout(() => {
      if (soundEnabled) {
        playHarmonicChime();
      }
    }, 400);

    // Timeline phases:
    // 0: Initial black & glowing ambient core (0ms)
    // 1: Pathway & Bridge cables draw out (400ms)
    // 2: Open Book pages & Wisdom motif spread (1000ms)
    // 3: Graduation cap & Sunburst rays resolve into official logo (1600ms)
    // 4: Tagline "Samajh Se Safalta Tak" blooms (2200ms)
    // 5: Complete and transition out (2800ms)

    const timer1 = setTimeout(() => setPhase(1), 400);
    const timer2 = setTimeout(() => setPhase(2), 1000);
    const timer3 = setTimeout(() => setPhase(3), 1600);
    const timer4 = setTimeout(() => setPhase(4), 2200);
    const timer5 = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        sessionStorage.setItem('yuvasetu_intro_played', 'true');
        onComplete();
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(chimeTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [forcePlay, onComplete, soundEnabled]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      sessionStorage.setItem('yuvasetu_intro_played', 'true');
      onComplete();
    }, 200);
  };

  return (
    <div
      id="yuvasetu-opening-animation-overlay"
      className={`fixed inset-0 z-[100] bg-[#050711] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-orange-600/20 via-sky-600/20 to-indigo-600/20 blur-3xl pointer-events-none animate-pulse" />

      {/* Skip Button Top-Right */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          id="skip-intro-btn"
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer backdrop-blur-md"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Assembly Stage */}
      <div className="relative flex flex-col items-center justify-center max-w-lg mx-auto text-center px-6">
        {/* Animated Glow Halo */}
        <div
          className={`absolute -inset-8 rounded-full bg-gradient-to-r from-orange-500/20 via-sky-500/25 to-blue-500/20 blur-2xl transition-all duration-1000 ${
            phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        />

        {/* Center Assembling Logo */}
        <div
          className={`relative z-10 transition-all duration-700 transform ${
            phase >= 3
              ? 'opacity-100 scale-100 translate-y-0'
              : phase >= 2
              ? 'opacity-80 scale-95 translate-y-2'
              : phase >= 1
              ? 'opacity-50 scale-90 translate-y-4'
              : 'opacity-0 scale-75 translate-y-6'
          }`}
        >
          <YuvaSetuLogo variant="full" size="2xl" showTagline={false} />
        </div>

        {/* Dynamic Concept Sequence Tags: Pathway -> Wisdom -> Success */}
        <div className="relative z-10 h-8 mt-5 flex items-center justify-center">
          {phase === 1 && (
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-orange-400 animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
              <span>Connecting Learners • The Bridge</span>
            </div>
          )}
          {phase === 2 && (
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-sky-400 animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
              <span>Peer Wisdom & Quality Materials</span>
            </div>
          )}
          {phase >= 3 && (
            <div
              className={`transition-all duration-700 text-center space-y-2 ${
                phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              {/* Tagline "Samajh Se Safalta Tak" */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-xl">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400 bg-clip-text text-transparent">
                  Samajh Se Safalta Tak
                </span>
                <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar at bottom */}
        <div className="w-48 h-1 bg-slate-800 rounded-full mt-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-sky-500 rounded-full transition-all duration-300 ease-out"
            style={{
              width:
                phase === 0
                  ? '15%'
                  : phase === 1
                  ? '35%'
                  : phase === 2
                  ? '65%'
                  : phase === 3
                  ? '85%'
                  : '100%',
            }}
          />
        </div>
      </div>
    </div>
  );
};
