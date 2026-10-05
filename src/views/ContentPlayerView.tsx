import React, { useState } from 'react';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import { Course } from '../data/platformData';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Maximize2,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  Share2,
  Bookmark,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';

export interface ContentPlayerViewProps {
  course: Course;
  onNavigate: (view: string, payload?: any) => void;
}

export const ContentPlayerView: React.FC<ContentPlayerViewProps> = ({
  course,
  onNavigate,
}) => {
  const [activeLessonId, setActiveLessonId] = useState('les-1');
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'formula' | 'quiz'>('notes');
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const activeLesson =
    course.modules.flatMap((m) => m.lessons).find((l) => l.id === activeLessonId) ||
    course.modules[0].lessons[0];

  return (
    <div id="vidyasetu-content-player" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* TOP BREADCRUMB WITH OFFICIAL BRAND BADGE */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('explore')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Explore
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>{course.category}</span>
            <span>/</span>
            <span className="text-white font-semibold truncate max-w-xs">{course.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <YuvaSetuLogo variant="horizontal" size="xs" showTagline={true} />
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            Verified Curriculum
          </span>
        </div>
      </div>

      {/* MAIN VIDEO & CONTENT PLAYER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SIMULATED VIDEO PLAYER & LESSON DETAILS (Col 1-8) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Simulated Interactive Video Screen */}
          <div className="relative aspect-video w-full rounded-3xl bg-[#04060b] border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4 group">
            {/* Top Video Overlay Bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <YuvaSetuLogo variant="icon" size="xs" />
                <span className="text-xs font-bold text-white drop-shadow-md">
                  {activeLesson.title}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-cyan-300 border border-cyan-500/20">
                1080p 60fps
              </span>
            </div>

            {/* Video Center Animation / Diagram */}
            <div className="flex flex-col items-center justify-center text-center space-y-3 my-auto">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/60 animate-spin" style={{ animationDuration: '12s' }} />
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500/20 to-amber-500/20 flex items-center justify-center border border-cyan-500/40">
                  <Play className={`w-8 h-8 text-cyan-400 ${isPlaying ? 'opacity-80' : ''}`} />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white font-['Outfit']">
                  Interactive Concept Simulation: Torque & Angular Momentum
                </p>
                <p className="text-xs text-slate-400">
                  Visualizing Vector cross-product <span className="text-cyan-300 font-mono">τ = r × F</span>
                </p>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="z-10 bg-slate-950/80 backdrop-blur-md rounded-2xl p-3 border border-slate-800/80 space-y-2">
              {/* Progress Slider */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer">
                <div className="bg-gradient-to-r from-cyan-400 to-amber-400 h-full w-[45%] rounded-full" />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-cyan-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button className="text-slate-400 hover:text-white">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">12:45 / {activeLesson.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onNavigate('doubts')}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30 hover:bg-amber-500/20"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Ask Doubt at 12:45</span>
                  </button>
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  <Maximize2 className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Metadata & Instructor Strip */}
          <div className="p-6 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold font-['Outfit'] text-white">
                  {activeLesson.title}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Module 1 • Master Class by {course.instructor.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('study_rooms')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Study Room for this Topic
                </button>
              </div>
            </div>

            {/* Tabs: Notes, Formula, Checkpoint Quiz */}
            <div className="flex border-b border-slate-800 gap-4 pt-2 text-xs font-bold">
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-2 transition-colors border-b-2 ${
                  activeTab === 'notes' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Key Notes & Intuition ("Soch")
              </button>
              <button
                onClick={() => setActiveTab('formula')}
                className={`pb-2 transition-colors border-b-2 ${
                  activeTab === 'formula' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Formula Cheat Sheet ("Samajh")
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`pb-2 transition-colors border-b-2 ${
                  activeTab === 'quiz' ? 'border-rose-400 text-rose-400' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Instant Mastery Checkpoint
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'notes' && (
              <div className="text-xs text-slate-300 space-y-2 leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
                <p className="font-semibold text-white">1. Translatory vs Rotational Analogue:</p>
                <p>
                  Linear force F causes linear acceleration <span className="font-mono text-cyan-300">a</span> (F = ma).
                  Torque τ causes angular acceleration <span className="font-mono text-cyan-300">α</span> (τ = Iα).
                </p>
                <p className="font-semibold text-white pt-2">2. Center of Mass Frame Rule:</p>
                <p>
                  The equation <span className="font-mono text-amber-300">τ_cm = I_cm · α</span> is ALWAYS valid in the center of mass frame, even if the center of mass itself is accelerating!
                </p>
              </div>
            )}

            {activeTab === 'formula' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80 font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-cyan-400 block text-[10px]">Torque Vector Definition:</span>
                  <span className="text-white text-sm font-bold">\vec&#123;\tau&#125; = \vec&#123;r&#125; \times \vec&#123;F&#125;</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 block text-[10px]">Pure Rolling Constraint:</span>
                  <span className="text-white text-sm font-bold">v_&#123;cm&#125; = R\omega, \quad a_&#123;cm&#125; = R\alpha</span>
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80 text-xs">
                <p className="font-bold text-white">
                  Quick Checkpoint: What is the kinetic energy of a solid cylinder of mass M and radius R rolling without slipping with speed V?
                </p>
                <div className="space-y-2">
                  {[
                    { id: 1, text: '(1/2) M V²', correct: false },
                    { id: 2, text: '(3/4) M V²', correct: true },
                    { id: 3, text: '(7/10) M V²', correct: false },
                    { id: 4, text: '(1) M V²', correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setQuizSelected(opt.id);
                        setQuizAnswered(true);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        quizSelected === opt.id
                          ? opt.correct
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                            : 'bg-rose-950/60 border-rose-500 text-rose-300'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
                {quizAnswered && (
                  <p className="text-[11px] text-cyan-300 font-semibold pt-1">
                    ✓ Explanation: Total KE = KE_trans (1/2 M V²) + KE_rot (1/2 I ω² = 1/2 · 1/2 M R² · (V/R)² = 1/4 M V²) = 3/4 M V²!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SYLLABUS & LESSON PLAYLIST (Col 9-12) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-[#0c1020] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" /> Course Syllabus
              </span>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                2 Modules
              </span>
            </div>

            <div className="space-y-4">
              {course.modules.map((mod, modIdx) => (
                <div key={mod.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>{modIdx + 1}. {mod.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{mod.duration}</span>
                  </div>

                  <div className="space-y-1.5">
                    {mod.lessons.map((les) => (
                      <button
                        key={les.id}
                        onClick={() => setActiveLessonId(les.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs text-left transition-all ${
                          activeLessonId === les.id
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold'
                            : 'bg-slate-900/60 text-slate-300 border border-slate-800/80 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {les.isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-mono">{les.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
