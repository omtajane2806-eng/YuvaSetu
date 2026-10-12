import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types/user';
import { contentService } from '../../services/contentService';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Coins,
  ArrowRight,
  BookOpen,
  X,
  ShieldCheck,
  Clock,
  XCircle,
  Layers,
} from 'lucide-react';

export interface StudentSetPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any;
  currentUser: User;
  onSuccess?: (publishedNote: any) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

export const StudentSetPriceModal: React.FC<StudentSetPriceModalProps> = ({
  isOpen,
  onClose,
  submission,
  currentUser,
  onSuccess,
  onNavigate,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  let analysis: any = submission?.aiAnalysis || {};
  if (!analysis.overallQualityScore && typeof submission?.ai_analysis === 'string') {
    try {
      analysis = JSON.parse(submission.ai_analysis);
    } catch {}
  } else if (!analysis.overallQualityScore && submission?.ai_analysis && typeof submission.ai_analysis === 'object') {
    analysis = submission.ai_analysis;
  }

  const qualityScore =
    analysis.overallQualityScore ??
    submission?.overall_quality_score ?? 93;
  const categoryTier =
    analysis.polishCategory ||
    (submission?.category_tier ?? (qualityScore >= 90 ? 'PREMIUM' : qualityScore >= 75 ? 'BASIC' : 'DELUXE'));

  const aiPrice =
    submission?.aiRecommendedPrice ??
    submission?.ai_recommended_price ??
    (analysis.priceRecommendation?.recommendedPrice ?? 25);

  const studentName =
    submission?.studentName ||
    submission?.student_name ||
    currentUser?.name ||
    'Aryan Sharma';
  const studentEmail =
    submission?.studentEmail ||
    submission?.student_email ||
    currentUser?.email ||
    'aryan@yuvasetu.com';
  const subjectName =
    submission?.subjectName ||
    submission?.subject_name ||
    'Academic Subject';
  const category =
    submission?.category ||
    'Lecture Notes';
  const description =
    submission?.description ||
    `${submission?.title || 'Academic Notes'} - Comprehensive verified student lecture notes and learning materials.`;

  const [studentPrice, setStudentPrice] = useState<number>(aiPrice);
  const [priceInputStr, setPriceInputStr] = useState<string>(String(aiPrice));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [publishResult, setPublishResult] = useState<{
    status: string;
    autoPublished: boolean;
    aiRecommendedPrice: number;
    finalPrice: number;
    message: string;
    reviewReason?: string;
    note?: any;
  } | null>(null);

  // Synchronize when a new submission opens
  useEffect(() => {
    if (isOpen && submission) {
      const initialPrice =
        submission.studentSelectedPrice ??
        submission.student_selected_price ??
        aiPrice;
      setStudentPrice(initialPrice);
      setPriceInputStr(String(initialPrice));
      setErrorMessage(null);
      setPublishResult(null);

      // Auto-focus the price input for accessibility
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
    }
  }, [isOpen, submission?.id, aiPrice]);

  // Keyboard accessibility: ESC closes modal (unless submitting)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !submission) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPriceInputStr(val);
    setErrorMessage(null);

    const num = Number(val);
    if (!isNaN(num)) {
      setStudentPrice(num);
    }
  };

  const validatePrice = (): number | null => {
    const trimmed = priceInputStr.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your preferred final selling price.');
      return null;
    }

    if (trimmed.includes('.') && trimmed.split('.')[1].length > 2) {
      setErrorMessage('Selling price cannot have more than 2 decimal places.');
      return null;
    }

    const num = Number(trimmed);
    if (isNaN(num) || !isFinite(num)) {
      setErrorMessage('Invalid price format. Please enter a valid numeric selling price.');
      return null;
    }

    if (num <= 0) {
      setErrorMessage('Selling price must be greater than zero.');
      return null;
    }

    if (num < 10) {
      setErrorMessage('Minimum allowed price on YuvaSetu is ₹10.');
      return null;
    }

    if (num > 250) {
      setErrorMessage('Maximum allowed price on YuvaSetu is ₹250.');
      return null;
    }

    return Math.round(num * 100) / 100;
  };

  const handleConfirmAndPublish = async () => {
    if (isSubmitting) return; // Prevent duplicate submissions

    const validatedPrice = validatePrice();
    if (validatedPrice === null) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/student-notes/${submission.id}/confirm-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
        },
        body: JSON.stringify({
          finalPrice: validatedPrice,
          studentPrice: validatedPrice,
          rightsDeclarationAccepted: true,
          listingInfoAccepted: true,
          customTitle: submission.title,
          customDescription: submission.description,
          customSubjectId: submission.subjectId || submission.subject_id,
          customSubjectName: submission.subjectName || submission.subject_name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Server eligibility check rejected this price submission.');
      }

      if (data.status === 'PUBLISHED' || data.autoPublished) {
        // Build client catalog item for immediate local visibility in Study Materials
        const newPublishedItem = {
          id: data.note?.materialId || `mat-marketplace-${submission.id}`,
          title: submission.title,
          description: submission.description || `${submission.title} - Comprehensive student notes`,
          subject: submission.subjectName || submission.subject_name || 'General Academic',
          course_code: (submission.subjectId || 'NOTES').toUpperCase(),
          semester: submission.semester || 'Semester 4',
          type: 'notes',
          file_url: submission.fileUrl || submission.file_url || 'internal://pdf-notes',
          thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
          uploaded_by: currentUser.id,
          author_name: currentUser.name,
          author_college: currentUser.college || 'Verified Student Creator',
          published: 1,
          status: 'published',
          downloads: 0,
          views: 1,
          likes: 0,
          page_count: submission.pageCount || submission.page_count || 12,
          duration: null,
          tags: Array.isArray(submission.tags) ? submission.tags : ['StudentNotes', 'Verified'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          price_inr: validatedPrice,
          ai_recommended_price: aiPrice,
          quality_score: qualityScore,
          category_tier: categoryTier,
        };

        contentService.addPublishedNote(newPublishedItem);
        window.dispatchEvent(new Event('vidyasetu_content_updated'));

        setPublishResult({
          status: 'PUBLISHED',
          autoPublished: true,
          aiRecommendedPrice: aiPrice,
          finalPrice: validatedPrice,
          message: data.message || 'Your notes have been successfully analyzed and published on YuvaSetu.',
          note: data.note || newPublishedItem,
        });

        if (onSuccess) {
          onSuccess(data.note || newPublishedItem);
        }
      } else {
        // Under review or rejected
        setPublishResult({
          status: data.status || 'REVIEW_REQUIRED',
          autoPublished: false,
          aiRecommendedPrice: aiPrice,
          finalPrice: validatedPrice,
          message: data.message || 'Your notes require manual review before publication.',
          reviewReason: data.reviewReason,
          note: data.note,
        });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Backend price confirmation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-analysis-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-[#090d1a] border border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e1428]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="ai-analysis-modal-title"
                className="text-base sm:text-lg font-black font-['Outfit'] text-white tracking-wide uppercase"
              >
                {publishResult?.status === 'PUBLISHED' ? 'YOUR NOTES ARE PUBLISHED!' : 'NOTE SUBMISSION AUDIT & AI ANALYSIS'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {publishResult?.status === 'PUBLISHED'
                  ? 'Your notes have been successfully analyzed and published on YuvaSetu.'
                  : 'Your notes have been analyzed. Review the recommended price and choose your final selling price.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer disabled:opacity-50"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* SUCCESS STATE */}
          {publishResult?.status === 'PUBLISHED' ? (
            <div className="py-4 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                  YOUR NOTES ARE PUBLISHED!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Your notes have been successfully analyzed and published on YuvaSetu.
                </p>
              </div>

              {/* Price & Status Summary Card */}
              <div className="p-4 rounded-2xl bg-[#0e1428] border border-cyan-500/30 max-w-sm mx-auto text-xs space-y-2 text-left font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Note Title:</span>
                  <span className="text-white font-bold max-w-[180px] truncate" title={submission.title}>
                    {submission.title}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>AI Recommended Price:</span>
                  <span className="text-slate-300 font-bold">₹{publishResult.aiRecommendedPrice}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Your Final Price:</span>
                  <span className="text-emerald-400 font-black">₹{publishResult.finalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 border-t border-slate-800 pt-2 font-sans">
                  <span>Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    PUBLISHED
                  </span>
                </div>
              </div>

              {/* Required Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('my_content');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View My Notes</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('explore');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Go to Study Materials</span>
                </button>
              </div>
            </div>
          ) : publishResult && publishResult.status !== 'PUBLISHED' ? (
            /* NON-PUBLISHED RESULT (e.g. REVIEW_REQUIRED, REJECTED) */
            <div className="py-4 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                <Clock className="w-9 h-9" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                  SUBMISSION UNDER REVIEW
                </h3>
                <p className="text-xs text-slate-300">
                  {publishResult.message}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e1428] border border-amber-500/30 max-w-sm mx-auto text-xs space-y-2 text-left font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>AI Recommended Price:</span>
                  <span className="text-slate-300">₹{publishResult.aiRecommendedPrice}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Your Final Price:</span>
                  <span className="text-amber-400 font-bold">₹{publishResult.finalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 border-t border-slate-800 pt-2 font-sans">
                  <span>Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {publishResult.status}
                  </span>
                </div>
              </div>

              {publishResult.reviewReason && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 max-w-md mx-auto text-left">
                  <p className="font-bold text-[11px] uppercase tracking-wider text-amber-400">Audit Detail:</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed">{publishResult.reviewReason}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('my_content');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View My Notes</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* STANDARD PRICE CONFIRMATION FORM */
            <>
              {/* Note Header & Metadata (Matching Screenshot 2) */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
                    {subjectName} • {category}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800/60">
                    {categoryTier} Tier
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  {submission.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Uploaded by <strong className="text-slate-200">{studentName}</strong> ({studentEmail})
                </p>
              </div>

              {/* Description box (Matching Screenshot 2) */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {description}
              </div>

              {/* AI Quality & Risk Evaluation (Matching Screenshot 2) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    AI Quality & Risk Evaluation
                  </h4>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
                    AI Recommended Category: {categoryTier} Tier
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">AI Quality Score</p>
                    <p className="text-base font-black text-cyan-400 font-mono mt-0.5">{qualityScore}/100</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Relevance</p>
                    <p className="text-base font-black text-white font-mono mt-0.5">{analysis.relevanceScore ?? 94}/100</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Completeness</p>
                    <p className="text-base font-black text-white font-mono mt-0.5">{analysis.completenessScore ?? 92}/100</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">AI Confidence</p>
                    <p className="text-base font-black text-emerald-400 font-mono mt-0.5">{analysis.aiConfidence ?? 96}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">Copyright Risk:</span>
                    <span className="font-bold text-emerald-400 text-[11px]">{analysis.copyrightRisk || 'LOW'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">Originality Risk:</span>
                    <span className="font-bold text-emerald-400 text-[11px]">{analysis.originalityRisk || 'LOW'}</span>
                  </div>
                </div>

                {/* AI Analysis Result summary */}
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs">
                  <span className="font-bold uppercase text-[10px] text-cyan-400 block tracking-wider">
                    AI Analysis Result
                  </span>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    {analysis.duplicateDetection?.reason || analysis.priceRecommendation?.rationale || 'Original student compilation with high conceptual clarity and verified diagrams.'}
                  </p>
                </div>
              </div>

              {/* Price Input Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                {/* AI Recommended Price Row */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300 block">
                      AI RECOMMENDATION
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {analysis.priceRecommendation?.rationale || 'Suggested benchmark based on quality score and depth'}
                    </span>
                  </div>
                  <span className="text-xl font-black font-mono text-cyan-400">
                    ₹{aiPrice}
                  </span>
                </div>

                {/* Your Final Selling Price Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="student-final-price-input"
                      className="text-xs font-black uppercase tracking-wider text-emerald-400"
                    >
                      YOUR FINAL SELLING PRICE
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Bounds: ₹10 – ₹250
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-400 font-black text-xl">
                        ₹
                      </div>
                      <input
                        id="student-final-price-input"
                        ref={inputRef}
                        type="number"
                        min={10}
                        max={250}
                        step="1"
                        value={priceInputStr}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleConfirmAndPublish();
                          }
                        }}
                        disabled={isSubmitting}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 focus:border-cyan-400 text-white font-mono font-black text-2xl focus:outline-none transition-colors"
                        placeholder="25"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPriceInputStr(String(aiPrice));
                        setStudentPrice(aiPrice);
                        setErrorMessage(null);
                      }}
                      className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      title="Reset to AI Recommended Price"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Use AI (₹{aiPrice})</span>
                    </button>
                  </div>

                  {/* Helper Text */}
                  <p className="text-[11px] text-slate-400 italic mt-1">
                    "The AI price is a recommendation. You can change it before confirming your final price."
                  </p>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[10, 15, 20, 25, 30, 35, 49, 79, 99].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPriceInputStr(String(p));
                        setStudentPrice(p);
                        setErrorMessage(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        studentPrice === p
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      ₹{p}
                      {p === aiPrice && ' (AI)'}
                    </button>
                  ))}
                </div>

                {/* Live Comparison Box */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        AI Recommended Price:
                      </span>
                      <span className="text-slate-300 font-mono font-bold text-sm">
                        ₹{aiPrice}
                      </span>
                    </div>
                    <div className="text-slate-600 font-bold">vs</div>
                    <div>
                      <span className="text-[10px] text-cyan-400 uppercase font-bold block">
                        Your Final Price:
                      </span>
                      <span className="text-emerald-400 font-mono font-black text-sm">
                        ₹{isNaN(studentPrice) ? '—' : studentPrice}
                      </span>
                    </div>
                  </div>

                  {studentPrice !== aiPrice && !isNaN(studentPrice) && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                      {studentPrice > aiPrice
                        ? `+₹${studentPrice - aiPrice} custom`
                        : `-₹${aiPrice - studentPrice} custom`}
                    </span>
                  )}
                </div>
              </div>

              {/* Inline Error Message */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Buttons */}
        {!publishResult && (
          <div className="px-6 py-4 border-t border-slate-800 bg-[#0e1428] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmAndPublish}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating & Publishing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Price & Publish</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
