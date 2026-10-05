import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  FileText,
  Eye,
  ArrowRight,
  Download,
  Bookmark,
  Share2,
  Clock,
  Layers,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { UserInitialsBadge } from './UserInitialsBadge';

export interface LearningExperienceSectionProps {
  onExplore: () => void;
  onTryAI: () => void;
  onTryDoubts: () => void;
}

export const LearningExperienceSection: React.FC<LearningExperienceSectionProps> = ({
  onExplore,
  onTryAI,
  onTryDoubts,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'video' | 'ai' | 'doubts'>('notes');

  return (
    <section
      id="yuvasetu-learning-experience-section"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          The YuvaSetu Learning Experience
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight">
          Built for How Students{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
            Actually Study
          </span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          No bloated textbooks or endless filler videos. A fast, focused workspace designed for exam revision, conceptual clarity, and peer collaboration.
        </p>
      </div>

      {/* WORKSPACE PREVIEW CONTAINER */}
      <div className="mt-12 rounded-3xl bg-gradient-to-b from-[#0e1428] to-[#070914] border border-slate-800/90 shadow-2xl p-4 sm:p-8">
        {/* INTERACTIVE MODE TABS */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="exp-tab-notes"
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Peer Handnotes Reader</span>
            </button>

            <button
              id="exp-tab-video"
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>5-Min Concept Breakdown</span>
            </button>

            <button
              id="exp-tab-ai"
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Samajh Se Safalta AI Guide</span>
            </button>

            <button
              id="exp-tab-doubts"
              onClick={() => setActiveTab('doubts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'doubts'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Peer Doubt Thread</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300">Live Interactive Preview</span>
          </div>
        </div>

        {/* TAB 1: PEER HANDNOTES READER */}
        {activeTab === 'notes' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#090d1c] border border-slate-800/80 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <UserInitialsBadge name="Aryan Sharma" role="student" size="sm" />
                    <div>
                      <div className="text-xs font-bold text-white">Aryan Sharma • IIT Bombay</div>
                      <div className="text-[11px] text-slate-400">CS201: Data Structures & Algorithms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                      Semester 3 Topper Notes
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <h3 className="text-xl font-black font-['Outfit'] text-white">
                    Module 4: Dynamic Programming & Bellman-Ford Negative Cycle
                  </h3>
                  
                  {/* Handwritten aesthetic preview box */}
                  <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed space-y-3">
                    <div className="text-amber-400 font-bold">
                      // Intuition: Why Dijkstra fails on negative cycles
                    </div>
                    <p>
                      Dijkstra assumes that once a node u is marked visited, dist[u] is optimal. If an edge (u, v) with weight w &lt; 0 exists later, relaxation invalidates optimality.
                    </p>
                    <div className="p-3 rounded-lg bg-[#060913] border border-cyan-500/30 text-cyan-300">
                      <span className="font-bold text-white">Rule:</span> Run Bellman-Ford for |V| - 1 iterations. If any edge can still be relaxed in the |V|-th iteration, a negative cycle exists.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>38 Pages PDF</span>
                  <span>•</span>
                  <span>1,420 Downloads</span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">★ 4.96/5.0</span>
                </div>
                <button
                  onClick={onExplore}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Open Full PDF Handnotes</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#090d1c] border border-slate-800/80 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Why Students Love YuvaSetu Notes
                </h4>
                <ul className="mt-4 space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Syllabus-Aligned:</strong> Directly mapped to specific university exam schemes.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span><strong>Handwritten Intuition:</strong> Step-by-step diagrams and margin tips from peer toppers.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Solved PYQs:</strong> Past 5 years university questions integrated after each topic.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Reader Features</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Offline Cache</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Dark Mode</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Highlighting</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Formula Sheets</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 5-MIN CONCEPT BREAKDOWN */}
        {activeTab === 'video' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#090d1c] border border-slate-800/80 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <UserInitialsBadge name="Rohan Deshmukh" role="student" size="sm" />
                    <div>
                      <div className="text-xs font-bold text-white">Rohan Deshmukh • VJTI Mumbai</div>
                      <div className="text-[11px] text-slate-400">ME302: Fluid Mechanics & Turbomachinery</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                    6 Min Concept Video
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <h3 className="text-xl font-black font-['Outfit'] text-white">
                    Navier-Stokes Equation: Boundary Layer Derivation Without Memorization
                  </h3>

                  <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden group cursor-pointer" onClick={onExplore}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/90 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 fill-black ml-1" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                      <span className="font-bold">Peer Visual Breakdown • English + Hindi Intuition</span>
                      <span className="px-2 py-0.5 rounded bg-black/60 font-mono text-[11px]">06:42</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>Peer Verified Concept</span>
                  <span>•</span>
                  <span>3,890 Views</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">100% Exam Pass Feedback</span>
                </div>
                <button
                  onClick={onExplore}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Watch Concept Video</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#090d1c] border border-slate-800/80 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-amber-400" />
                  Short & Focused Video Format
                </h4>
                <ul className="mt-4 space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span><strong>Under 10 Minutes:</strong> Zero intros or tangents; straight to the mathematical intuition.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Visual Sketches:</strong> Direct tablet whiteboard demonstrations.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span><strong>Peer Language:</strong> Explained in relatable student vocabulary.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Available Subjects</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Calculus & DE</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">DSA & DBMS</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Thermodynamics</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Signals & Systems</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SOCH → SAMAJH AI GUIDE */}
        {activeTab === 'ai' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#090d1c] border border-indigo-500/30 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">YuvaSetu AI Learning Assistant</div>
                      <div className="text-[10px] text-indigo-300">"Samajh Se Safalta Tak" Socratic Breakdown</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-extrabold uppercase border border-emerald-500/30">
                    Active & Ready
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {/* User Query */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">Student Doubt:</span>
                    "Why do we need Virtual Memory if RAM is fast enough?"
                  </div>

                  {/* AI Socratic Response */}
                  <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Step 1: First-Principles Intuition</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Imagine every running program wanted to use address 0x0000. Without isolation, Program A would overwrite Program B's variables instantly.
                    </p>
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-[11px] pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Step 2: Core Concept Mastery (Samajh)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Virtual Memory creates the illusion that each process has a private, contiguous address space. The MMU (Memory Management Unit) translates virtual page numbers to physical frame numbers via page tables.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400">Zero hallucinations • Rooted in textbook curriculum</span>
                <button
                  onClick={onTryAI}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask YuvaSetu AI a Doubt</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#090d1c] border border-slate-800/80 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  Pedagogical Framework
                </h4>
                <ul className="mt-4 space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span><strong>Step-by-Step Logic:</strong> Never just gives the raw answer; teaches you the thinking pattern.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Formula Simplifier:</strong> Explains every variable and dimensional unit.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span><strong>Instant Quiz:</strong> Generates 3 quick check questions after explaining.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Protected Architecture</div>
                <p className="text-[11px] text-slate-400">
                  All AI reasoning is securely proxied through backend endpoints with strict token protection.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PEER DOUBT THREAD */}
        {activeTab === 'doubts' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#090d1c] border border-rose-500/30 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <UserInitialsBadge name="Ananya Gupta" role="student" size="sm" />
                    <div>
                      <div className="text-xs font-bold text-white">Ananya Gupta • DTU Delhi</div>
                      <div className="text-[11px] text-slate-400">Engineering Chemistry • Electrochemistry</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    Solved by Peer Mentor
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <h4 className="text-base font-bold text-white">
                    "How to determine the spontaneity of a redox cell using Nernst Equation when Q &gt; Keq?"
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold">
                      <UserInitialsBadge name="Pooja Sharma" role="student" size="xs" />
                      <span>Answered by Pooja Sharma (Peer Topper):</span>
                    </div>
                    <p className="leading-relaxed">
                      When Q &gt; Keq, E_cell becomes negative according to E = E° - (RT/nF)ln(Q). Since ΔG = -nFE_cell, a negative E_cell makes ΔG &gt; 0, which means the forward reaction is non-spontaneous and will shift in reverse!
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>Upvoted 48 times</span>
                  <span>•</span>
                  <span>Answered in 14 minutes</span>
                </div>
                <button
                  onClick={onTryDoubts}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ask a Question to Community</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#090d1c] border border-slate-800/80 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-rose-400" />
                  Fast & Supportive Doubt Solving
                </h4>
                <ul className="mt-4 space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span><strong>15-Min Avg Response:</strong> Active student peers across India help unblock you quickly.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span><strong>Earn While Helping:</strong> High-quality answers earn VidyaTokens and contributor badges.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span><strong>Subject Filters:</strong> Easily find past resolved doubts by course code.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Community Safety</div>
                <p className="text-[11px] text-slate-400">
                  Zero spam tolerance. Admin moderation and peer upvotes ensure strictly academic discussions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
