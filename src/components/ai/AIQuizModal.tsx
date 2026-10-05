import React, { useState } from 'react';
import { AIQuizQuestion, AIQuizAttempt, AIQuestionDifficulty } from '../../types/ai';
import { aiService } from '../../services/aiService';
import { User } from '../../types/user';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Award,
  Sparkles,
  Layers,
  X,
  Check,
} from 'lucide-react';

interface AIQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialId?: string;
  materialTitle?: string;
  topic?: string;
  currentUser: User | null;
  onNavigateToMaterial?: (materialId: string) => void;
}

export const AIQuizModal: React.FC<AIQuizModalProps> = ({
  isOpen,
  onClose,
  materialId,
  materialTitle = 'Data Structures & Algorithms',
  topic = 'General Practice',
  currentUser,
  onNavigateToMaterial,
}) => {
  const [stage, setStage] = useState<'config' | 'active' | 'results'>('config');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<AIQuestionDifficulty>('medium');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<AIQuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [attemptResult, setAttemptResult] = useState<AIQuizAttempt | null>(null);

  if (!isOpen) return null;

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const generated = await aiService.generatePracticeQuestions(
        materialId,
        questionCount,
        difficulty,
        topic,
        currentUser?.id,
        currentUser?.name,
        currentUser?.email
      );
      setQuestions(generated);
      setCurrentIdx(0);
      setSelectedAnswers({});
      setAttemptResult(null);
      setStage('active');
    } catch (e) {
      console.error('Failed to generate quiz', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!currentUser) return;
    const attempt = aiService.evaluateQuiz(
      currentUser.id,
      currentUser.name,
      currentUser.email,
      materialId,
      materialTitle,
      topic,
      difficulty,
      questions,
      selectedAnswers
    );
    setAttemptResult(attempt);
    setStage('results');
  };

  const handleReset = () => {
    setStage('config');
    setQuestions([]);
    setSelectedAnswers({});
    setAttemptResult(null);
  };

  return (
    <div
      id="vidyasetu-ai-quiz-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0b0f1e] border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* TOP BAR */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-['Outfit'] text-white">
                YuvaSetu AI Interactive Quiz
              </h2>
              <p className="text-xs text-slate-400">
                {materialTitle ? `Grounded in: ${materialTitle}` : 'Conceptual Practice Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STAGE 1: CONFIGURATION */}
        {stage === 'config' && (
          <div className="py-6 space-y-6 overflow-y-auto flex-1">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                      questionCount === cnt
                        ? 'bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['easy', 'medium', 'hard'] as AIQuestionDifficulty[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-3 rounded-2xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                      difficulty === lvl
                        ? 'bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Source-Grounded Verification</span>
              </div>
              <p>
                Every question is derived from authentic university syllabus notes with detailed step-by-step
                explanations and weak area diagnostics.
              </p>
            </div>

            <button
              onClick={handleStartQuiz}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Generating Practice Quiz...</span>
              ) : (
                <>
                  <span>Start Practice Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* STAGE 2: ACTIVE QUIZ */}
        {stage === 'active' && questions.length > 0 && (
          <div className="py-6 space-y-6 overflow-y-auto flex-1">
            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Question <strong className="text-white">{currentIdx + 1}</strong> of {questions.length}
                </span>
                <span className="capitalize font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-400">
                  {questions[currentIdx].topic}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {questions[currentIdx].question}
              </p>

              {/* Options */}
              <div className="space-y-2.5">
                {(questions[currentIdx].options || []).map((opt, oIdx) => {
                  const isSelected = selectedAnswers[questions[currentIdx].id] === opt;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(questions[currentIdx].id, opt)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                          isSelected ? 'border-cyan-400 bg-cyan-500 text-white' : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((p) => Math.min(questions.length - 1, p + 1))}
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-400 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <span>Submit Quiz</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STAGE 3: RESULTS */}
        {stage === 'results' && attemptResult && (
          <div className="py-6 space-y-6 overflow-y-auto flex-1">
            {/* Score Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1426] to-[#121c38] border border-cyan-500/30 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-black text-2xl font-['Outfit']">
                {attemptResult.score}/{attemptResult.questionCount}
              </div>
              <div>
                <h3 className="text-xl font-black font-['Outfit'] text-white">
                  Score: {attemptResult.percentage}%
                </h3>
                <p className="text-xs text-slate-300">
                  {attemptResult.percentage >= 80
                    ? 'Outstanding conceptual understanding! Keep building.'
                    : attemptResult.percentage >= 50
                    ? 'Good effort! Review the weak topics below to master every derivation.'
                    : 'Review the study material notes and retry for solid retention.'}
                </p>
              </div>
            </div>

            {/* Weak Topics Analysis */}
            {attemptResult.weakTopics.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <HelpCircle className="w-4 h-4" />
                  <span>Identified Topics for Revision</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {attemptResult.weakTopics.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 text-xs font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Answer Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question Breakdown & Explanations
              </h4>
              <div className="space-y-3">
                {attemptResult.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      ans.isCorrect
                        ? 'bg-emerald-500/5 border-emerald-500/30'
                        : 'bg-red-500/5 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-white">
                        {idx + 1}. {ans.questionText}
                      </span>
                      {ans.isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400 font-bold shrink-0">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>
                    <div className="text-slate-300">
                      <span>Your Answer: </span>
                      <strong className={ans.isCorrect ? 'text-emerald-300' : 'text-red-300'}>
                        {ans.userAnswer}
                      </strong>
                    </div>
                    {!ans.isCorrect && (
                      <div className="text-slate-300">
                        <span>Correct Answer: </span>
                        <strong className="text-emerald-300">{ans.correctAnswer}</strong>
                      </div>
                    )}
                    <div className="p-2.5 rounded-xl bg-slate-900/90 text-slate-300 text-[11px] leading-relaxed">
                      <strong className="text-cyan-400">Explanation: </strong>
                      {ans.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Materials */}
            {attemptResult.recommendedMaterials.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Recommended YuvaSetu Study Materials
                </h4>
                <div className="space-y-2">
                  {attemptResult.recommendedMaterials.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => {
                        onClose();
                        if (onNavigateToMaterial) onNavigateToMaterial(rec.id);
                      }}
                      className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between gap-3 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        <div>
                          <p className="text-xs font-bold text-white">{rec.title}</p>
                          <p className="text-[10px] text-slate-400">{rec.subject_name}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-cyan-400 font-bold flex items-center gap-1">
                        Open <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-400 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
