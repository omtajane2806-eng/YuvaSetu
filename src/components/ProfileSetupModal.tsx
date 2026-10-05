import React, { useState } from 'react';
import { YuvaSetuLogo } from './YuvaSetuLogo';
import { AVAILABLE_SUBJECTS } from '../services/authService';
import { User, ProfileSetupData } from '../types/user';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Plus,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  Lightbulb,
} from 'lucide-react';

export interface ProfileSetupModalProps {
  user: User;
  onComplete: (setupData: ProfileSetupData) => void;
  onSkip?: () => void;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  user,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedLearning, setSelectedLearning] = useState<string[]>(
    user.learningSubjects.length > 0
      ? user.learningSubjects
      : ['Data Structures & Algorithms', 'Operating Systems']
  );
  const [selectedTeaching, setSelectedTeaching] = useState<string[]>(
    user.teachingSubjects.length > 0 ? user.teachingSubjects : ['Python Programming']
  );
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [bio, setBio] = useState(user.bio || '');

  const toggleLearningSubject = (subj: string) => {
    setSelectedLearning((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const toggleTeachingSubject = (subj: string) => {
    setSelectedTeaching((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const handleAddCustomSubject = (target: 'learning' | 'teaching') => {
    if (!customSubjectInput.trim()) return;
    const item = customSubjectInput.trim();
    if (target === 'learning') {
      if (!selectedLearning.includes(item)) {
        setSelectedLearning((prev) => [...prev, item]);
      }
    } else {
      if (!selectedTeaching.includes(item)) {
        setSelectedTeaching((prev) => [...prev, item]);
      }
    }
    setCustomSubjectInput('');
  };

  const handleFinish = () => {
    onComplete({
      learningSubjects: selectedLearning,
      teachingSubjects: selectedTeaching,
      bio: bio.trim() || undefined,
    });
  };

  return (
    <div
      id="yuvasetu-profile-setup-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="profile-setup-modal"
        className="w-full max-w-2xl bg-[#090d1c] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden my-8"
      >
        {/* Top Glow Ambient */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-l from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* Header with Logo */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <YuvaSetuLogo variant="icon" size="sm" />
            <div>
              <h2 className="text-lg sm:text-xl font-black font-['Outfit'] text-white">
                Personalize Your Learning Bridge
              </h2>
              <p className="text-xs text-slate-400">
                Welcome, <span className="text-cyan-400 font-bold">{user.name}</span> • {user.college}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              Step {step} of 2
            </span>
          </div>
        </div>

        {/* STEP 1: What do you want to learn? */}
        {step === 1 && (
          <div className="mt-6 space-y-5 animate-fadeIn">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                Target Learning Focus
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                What do you want to learn?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Select subjects to get personalized peer notes, PYQs, and doubt discussions recommended on your dashboard.
              </p>
            </div>

            {/* Subject Chips (Multi-select) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1 py-1 custom-scrollbar">
              {AVAILABLE_SUBJECTS.map((subj) => {
                const isSelected = selectedLearning.includes(subj);
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => toggleLearningSubject(subj)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-200 shadow-md shadow-cyan-950/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span className="truncate pr-2">{subj}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Subject Adder */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add other subject / exam (e.g., Computer Graphics)..."
                value={customSubjectInput}
                onChange={(e) => setCustomSubjectInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSubject('learning');
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => handleAddCustomSubject('learning')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-white text-xs font-bold text-slate-300 transition-all cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* Selected Count Indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span>{selectedLearning.length} subject(s) selected</span>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer"
              >
                <span>Continue to Teaching Strengths</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: What can you teach / explain? */}
        {step === 2 && (
          <div className="mt-6 space-y-5 animate-fadeIn">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                Contributor & Peer Guidance
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                What can you teach or explain?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Select topics you feel comfortable breaking down for peers. This helps match you with unanswered doubts and study groups.
              </p>
            </div>

            {/* Teaching Subject Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1 py-1 custom-scrollbar">
              {AVAILABLE_SUBJECTS.map((subj) => {
                const isSelected = selectedTeaching.includes(subj);
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => toggleTeachingSubject(subj)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-200 shadow-md shadow-amber-950/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span className="truncate pr-2">{subj}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Bio / Goal note */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Short Student Bio (Optional)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. 2nd Year Computer Science student at IIT Bombay. Loving Graph Theory and Operating Systems!"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>

              <div className="flex items-center gap-3">
                {onSkip && (
                  <button
                    type="button"
                    onClick={onSkip}
                    className="text-xs text-slate-400 hover:text-slate-200 underline"
                  >
                    Skip for now
                  </button>
                )}
                <button
                  id="finish-profile-setup-btn"
                  type="button"
                  onClick={handleFinish}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white text-xs font-black shadow-xl shadow-cyan-500/25 hover:opacity-95 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Complete Setup & Open Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
