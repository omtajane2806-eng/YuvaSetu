import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types/user';
import {
  AIAnalysisResult,
  StudentNoteSubmission,
  PublishingThresholds,
  DEFAULT_PUBLISHING_THRESHOLDS,
  PolishCategory,
} from '../../types/marketplace';
import { marketplaceService, FinalizePriceResponse } from '../../services/marketplaceService';
import { contentService } from '../../services/contentService';
import { StudentSetPriceModal } from './StudentSetPriceModal';
import { YuvaSetuLogo } from '../YuvaSetuLogo';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  RefreshCw,
  Coins,
  ArrowLeft,
  BookOpen,
  Info,
  DollarSign,
  Tag,
  GraduationCap,
  Layers,
  Globe,
  Sliders,
  CheckSquare,
  Square,
  Share2,
  ExternalLink,
  Award,
  Zap,
  HelpCircle,
  AlertOctagon,
  Copy,
  Search,
  ChevronDown,
  UserCheck,
} from 'lucide-react';

export interface StudentPublishNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onPublishedSuccess?: (note: any) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

// 5 Guided Steps for Student Notes Submission
type StepNumber = 1 | 2 | 3 | 4 | 5;

// Suggested free-form academic subjects (suggestions only, NOT restrictions)
const SUGGESTED_SUBJECTS = [
  'Data Structures & Algorithms',
  'Database Management Systems',
  'Artificial Intelligence',
  'Machine Learning',
  'Python',
  'Java',
  'Computer Networks',
  'Operating Systems',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'JEE Mains',
  'NEET',
  'MHT-CET',
  'Web Development',
  'Software Engineering',
  'Cloud Computing & DevOps',
  'Cybersecurity & Ethical Hacking',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Commerce & Accounting',
  'Economics & Management',
  'UPSC / MPSC Preparation',
  'CBSE / State Board',
  'Diploma / Polytechnic',
  'Other',
];

// Replaces strict engineering branches: Academic Category / Branch / Exam
const ACADEMIC_CATEGORIES = [
  'Computer Engineering',
  'Computer Science',
  'AI & Data Science',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics',
  'Electrical Engineering',
  'ENTC',
  'Engineering - All Branches',
  'Science',
  'Commerce',
  'Arts',
  'School',
  'Diploma',
  'Polytechnic',
  'JEE',
  'NEET',
  'MHT-CET',
  'Competitive Exam',
  'Not Applicable',
  'Other',
];

const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
  'First Year',
  'Second Year',
  'Third Year',
  'Final Year',
  'JEE Mains',
  'JEE Advanced',
  'NEET',
  'MHT-CET',
  'Class 10',
  'Class 11',
  'Class 12',
  'Diploma',
  'Polytechnic',
  'All Levels / Comprehensive',
  'Not Applicable',
  'Other',
];

const LANGUAGES = [
  'English',
  'Hindi',
  'Marathi',
  'Hinglish (English + Hindi)',
  'Bilingual',
  'Regional / Other',
];

const DIFFICULTY_LEVELS = [
  'Basic',
  'Beginner',
  'Intermediate',
  'Advanced',
];

export const StudentPublishNoteModal: React.FC<StudentPublishNoteModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPublishedSuccess,
  onNavigate,
}) => {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);

  // STEP 1: Basic Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [academicSubject, setAcademicSubject] = useState('');
  const [subjectSearchFilter, setSubjectSearchFilter] = useState('');
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [academicCategory, setAcademicCategory] = useState('Engineering - All Branches');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [semester, setSemester] = useState('First Year');
  const [customSemesterInput, setCustomSemesterInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [difficultyLevel, setDifficultyLevel] = useState('Intermediate');
  const [estimatedReadTime, setEstimatedReadTime] = useState('30 mins');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['HandwrittenNotes', 'ExamPrep']);

  // STEP 2: Notes Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(100);

  // STEP 3: AI Analysis progress
  const [analysisProgressStep, setAnalysisProgressStep] = useState<number>(0);
  const [submission, setSubmission] = useState<StudentNoteSubmission | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [thresholds, setThresholds] = useState<PublishingThresholds>(DEFAULT_PUBLISHING_THRESHOLDS);

  // STEP 4: Review & Student Price Selection
  const [studentPrice, setStudentPrice] = useState<number>(10);
  const [rightsDeclarationAccepted, setRightsDeclarationAccepted] = useState(false);
  const [listingInfoAccepted, setListingInfoAccepted] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState<string | null>(null);

  // Automatic Price-Confirmation Popup state
  const [isPriceConfirmationPopupOpen, setIsPriceConfirmationPopupOpen] = useState(false);
  const hasAutoOpenedPriceModalRef = useRef<string | null>(null);

  // STEP 5: Final Result
  const [publishResult, setPublishResult] = useState<FinalizePriceResponse | null>(null);

  const pipelineSteps = [
    'PDF uploaded & validated',
    'Reading notes & extracting document structure',
    'Checking educational validity & syllabus alignment',
    'Checking duplicate content & similarity across existing materials',
    'Evaluating quality, completeness & accuracy scores',
    'Determining polish category (Basic / Premium / Deluxe)',
    'Calculating recommended price & suggested range',
    'Analysis complete',
  ];

  useEffect(() => {
    if (isOpen) {
      marketplaceService.getThresholds().then(setThresholds).catch(() => {});
      setIsPriceConfirmationPopupOpen(false);
      hasAutoOpenedPriceModalRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Add tag
  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((x) => x !== t));
  };

  // File handling
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setUploadError(null);
    const lower = file.name.toLowerCase();
    const isPdf = lower.endsWith('.pdf') || file.type === 'application/pdf';
    const isDoc = lower.endsWith('.docx') || lower.endsWith('.doc') || lower.endsWith('.txt');

    if (!isPdf && !isDoc) {
      setUploadError('Please select a valid PDF file (.pdf) or Word document (.docx).');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File size exceeds the 50MB platform limit.');
      return;
    }

    setSelectedFile(file);
    setUploadProgress(100);
    if (!title.trim()) {
      const generated = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
      setTitle(generated.charAt(0).toUpperCase() + generated.slice(1));
    }
  };

  // Transition from Step 2 to Step 3 (Trigger AI pipeline)
  const handleStartAnalysis = async () => {
    if (!selectedFile) {
      setUploadError('Please select a PDF document first.');
      return;
    }

    setUploadError(null);
    setCurrentStep(3);
    setAnalysisProgressStep(0);

    // Visual step progression animation
    const interval = setInterval(() => {
      setAnalysisProgressStep((prev) => {
        if (prev < pipelineSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const finalSubject = academicSubject.trim() || 'General';
      const finalCategory = customCategoryInput.trim() || academicCategory;
      const finalSemester = customSemesterInput.trim() || semester;

      const res = await marketplaceService.uploadAndAnalyze({
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        studentCollege: currentUser.college || 'Student',
        file: selectedFile,
        subjectHint: finalSubject,
        titleHint: title.trim() || undefined,
        topic: topic.trim() || undefined,
        branch: finalCategory, // forwarded as academic category
        semester: finalSemester,
        language: language,
        difficultyLevel: difficultyLevel,
      });

      clearInterval(interval);
      setAnalysisProgressStep(pipelineSteps.length);
      const submissionData = {
        ...res.submission,
        aiAnalysis: res.aiAnalysis,
        aiRecommendedPrice: res.aiAnalysis.priceRecommendation?.recommendedPrice ?? 25,
      };
      setSubmission(submissionData);
      setAiAnalysis(res.aiAnalysis);

      // Pre-fill Step 4 inputs with AI recommendations & user inputs
      const recommendedPrice = res.aiAnalysis.priceRecommendation?.recommendedPrice ?? 25;
      setStudentPrice(recommendedPrice);
      setCustomTitle(title.trim() || res.aiAnalysis.suggestedTitle);
      setCustomDescription(description.trim() || res.aiAnalysis.suggestedDescription);

      // AUTOMATICALLY OPEN PRICE CONFIRMATION MODAL & DISPLAY STEP 4
      setIsPriceConfirmationPopupOpen(true);
      setTimeout(() => {
        setCurrentStep(4);
      }, 400);
    } catch (err: any) {
      clearInterval(interval);
      setUploadError(err?.message || 'AI pipeline screening encountered an error. Please try again.');
      setCurrentStep(2);
    }
  };

  // Student retries AI analysis on safe staged file
  const handleRetryAnalysis = async () => {
    if (!selectedFile && !submission) {
      setUploadError('Please select a PDF document first.');
      return;
    }

    setUploadError(null);
    setCurrentStep(3);
    setAnalysisProgressStep(0);

    const interval = setInterval(() => {
      setAnalysisProgressStep((prev) => {
        if (prev < pipelineSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      let res: any;
      if (submission?.id) {
        res = await marketplaceService.retryAnalysis(submission.id, currentUser.id);
      } else {
        const finalSubject = academicSubject.trim() || 'General';
        const finalCategory = customCategoryInput.trim() || academicCategory;
        const finalSemester = customSemesterInput.trim() || semester;

        res = await marketplaceService.uploadAndAnalyze({
          studentId: currentUser.id,
          studentName: currentUser.name,
          studentEmail: currentUser.email,
          studentCollege: currentUser.college || 'Student',
          file: selectedFile!,
          subjectHint: finalSubject,
          titleHint: title.trim() || undefined,
          topic: topic.trim() || undefined,
          branch: finalCategory,
          semester: finalSemester,
          language: language,
          difficultyLevel: difficultyLevel,
        });
      }

      clearInterval(interval);
      setAnalysisProgressStep(pipelineSteps.length);
      const submissionData = {
        ...(res.submission || submission),
        aiAnalysis: res.aiAnalysis,
        aiRecommendedPrice: res.aiAnalysis.priceRecommendation?.recommendedPrice ?? 25,
      };
      setSubmission(submissionData);
      setAiAnalysis(res.aiAnalysis);

      const recommendedPrice = res.aiAnalysis.priceRecommendation?.recommendedPrice ?? 25;
      setStudentPrice(recommendedPrice);
      setCustomTitle(title.trim() || res.aiAnalysis.suggestedTitle);
      setCustomDescription(description.trim() || res.aiAnalysis.suggestedDescription);

      // AUTOMATICALLY OPEN PRICE CONFIRMATION MODAL & DISPLAY STEP 4
      setIsPriceConfirmationPopupOpen(true);
      setTimeout(() => {
        setCurrentStep(4);
      }, 400);
    } catch (err: any) {
      clearInterval(interval);
      setUploadError(err?.message || 'AI analysis could not be completed. Please retry.');
      setCurrentStep(2);
    }
  };

  // Step 4 -> Step 5 Final Publish
  const handleFinalizePriceAndPublish = async () => {
    if (!submission || !aiAnalysis) return;
    setFinalizeError(null);

    if (!rightsDeclarationAccepted) {
      setFinalizeError('Please accept the Upload Rights Declaration before publishing.');
      return;
    }
    if (!listingInfoAccepted) {
      setFinalizeError('Please verify and accept the listing details.');
      return;
    }

    if (studentPrice < thresholds.minimumPriceINR) {
      setFinalizeError(`Selling price must be at least ₹${thresholds.minimumPriceINR}.`);
      return;
    }
    if (studentPrice > thresholds.maximumPriceINR) {
      setFinalizeError(`Selling price cannot exceed ₹${thresholds.maximumPriceINR}.`);
      return;
    }

    try {
      setIsFinalizing(true);
      const finalSubject = academicSubject.trim() || 'General';
      const resp = await marketplaceService.finalizePriceAndPublish({
        submissionId: submission.id,
        studentId: currentUser.id,
        studentPrice: Number(studentPrice),
        currency: 'INR',
        rightsDeclarationAccepted,
        listingInfoAccepted,
        customTitle: customTitle.trim() || undefined,
        customDescription: customDescription.trim() || undefined,
        customSubjectName: finalSubject,
      });

      setPublishResult(resp);
      setCurrentStep(5);

      // If auto-published, register into client-side cache as well
      if (resp.autoPublished && resp.note) {
        contentService.addPublishedNote({
          id: resp.note.materialId || `mat-student-${submission.id}`,
          title: resp.note.title,
          description: customDescription || submission.description || '',
          subject_name: finalSubject,
          subject_id: 'notes',
          content_type: 'pdf',
          status: 'published',
          author_name: currentUser.name,
          author_college: currentUser.college || 'Student Creator',
          views: 0,
          likes: 0,
          downloads: 0,
          created_at: new Date().toISOString(),
          tags: tags,
          metadata: {
            sellingPriceINR: resp.note.studentSelectedPrice,
            polishCategory: aiAnalysis.polishCategory,
            qualityScore: aiAnalysis.overallQualityScore,
          },
        });
      }

      if (onPublishedSuccess) {
        onPublishedSuccess(resp.note);
      }
    } catch (err: any) {
      setFinalizeError(err?.message || 'Automatic publishing check failed. Please check inputs.');
    } finally {
      setIsFinalizing(false);
    }
  };

  const getPolishTierBadge = (tier?: PolishCategory) => {
    switch (tier) {
      case 'DELUXE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 border border-amber-500/50 text-amber-300 shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Deluxe Tier
          </span>
        );
      case 'PREMIUM':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Premium Tier
          </span>
        );
      case 'BASIC':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-700 text-slate-300">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            Basic Tier
          </span>
        );
    }
  };

  const getDuplicateBadge = (dup: any) => {
    if (!dup) return null;
    if (dup.isDuplicate) {
      return (
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs">
          <Copy className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-black uppercase tracking-wider text-[10px] text-amber-300">
              Potential Duplicate Detected ({dup.similarityScore}% Overlap)
            </span>
            <p className="mt-0.5 text-amber-200/90 leading-relaxed">
              {dup.reason || 'Very similar material already exists on YuvaSetu. This will be queued for rapid administrator review.'}
            </p>
          </div>
        </div>
      );
    }
    if (dup.duplicateStatus === 'PARTIAL_OVERLAP') {
      return (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Topical concepts align with existing syllabus, presenting distinct student explanations.</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Content verified as original student notes. No duplicate found on YuvaSetu.</span>
      </div>
    );
  };

  const studentEarnings = Math.round(studentPrice * 0.85);
  const platformFee = Math.round(studentPrice * 0.15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-[#0a0e1c] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <YuvaSetuLogo variant="symbol-only" size="xs" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-['Outfit'] flex items-center gap-2">
                Add Study Material
                <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/60">
                  AI Validation & Auto-Publishing
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Share educational notes with fellow students • Instant automatic publishing upon passing quality criteria
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* GUIDED 5-STEP INDICATOR */}
        <div className="grid grid-cols-5 border-b border-slate-800/80 bg-slate-950/60 text-center text-[10px] sm:text-[11px] font-bold">
          <div
            className={`py-2.5 px-1 border-r border-slate-800/60 transition-colors ${
              currentStep === 1
                ? 'text-cyan-400 bg-cyan-950/30'
                : currentStep > 1
                ? 'text-emerald-400'
                : 'text-slate-500'
            }`}
          >
            1. Basic Details
          </div>
          <div
            className={`py-2.5 px-1 border-r border-slate-800/60 transition-colors ${
              currentStep === 2
                ? 'text-cyan-400 bg-cyan-950/30'
                : currentStep > 2
                ? 'text-emerald-400'
                : 'text-slate-500'
            }`}
          >
            2. Upload PDF
          </div>
          <div
            className={`py-2.5 px-1 border-r border-slate-800/60 transition-colors ${
              currentStep === 3
                ? 'text-cyan-400 bg-cyan-950/30'
                : currentStep > 3
                ? 'text-emerald-400'
                : 'text-slate-500'
            }`}
          >
            3. AI Analysis
          </div>
          <div
            className={`py-2.5 px-1 border-r border-slate-800/60 transition-colors ${
              currentStep === 4
                ? 'text-cyan-400 bg-cyan-950/30'
                : currentStep > 4
                ? 'text-emerald-400'
                : 'text-slate-500'
            }`}
          >
            4. Review & Price
          </div>
          <div
            className={`py-2.5 px-1 transition-colors ${
              currentStep === 5 ? 'text-emerald-400 bg-emerald-950/30 font-black' : 'text-slate-500'
            }`}
          >
            5. Auto-Publish
          </div>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* ============================================================ */}
          {/* STEP 1: BASIC DETAILS */}
          {/* ============================================================ */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
                <p className="font-bold flex items-center gap-1.5 text-white">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  Step 1: Enter your note's basic details
                </p>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Academic subjects and categories are completely free-form across Engineering, Science, Commerce, Arts, School & Competitive Exams.
                </p>
              </div>

              {/* Material Title */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Material Title <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='e.g. "Complete DSA Hashing Notes"'
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-semibold"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    You choose the primary title. AI may also recommend helpful title suggestions after reviewing the content.
                  </p>
                </div>

                {/* Free-form Academic Subject (Searchable Combobox) */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      Academic Subject
                    </label>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      Optional • Searchable • Free-Form
                    </span>
                  </div>

                  <div className="relative">
                    <div className="relative flex items-center">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        value={academicSubject}
                        onChange={(e) => {
                          setAcademicSubject(e.target.value);
                          setSubjectSearchFilter(e.target.value);
                          setIsSubjectDropdownOpen(true);
                        }}
                        onFocus={() => {
                          setSubjectSearchFilter(academicSubject);
                          setIsSubjectDropdownOpen(true);
                        }}
                        placeholder="Search or type any subject (e.g. Indian History, NEET, DSA, UPSC)..."
                        className="w-full pl-9 pr-16 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium"
                      />
                      {academicSubject && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAcademicSubject('');
                            setSubjectSearchFilter('');
                          }}
                          className="absolute right-8 text-slate-400 hover:text-white text-xs p-1 cursor-pointer"
                          title="Clear subject"
                        >
                          ✕
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                        className="absolute right-2 px-2 py-1 text-slate-400 hover:text-white text-xs cursor-pointer"
                        title="Toggle suggestions list"
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSubjectDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                      </button>
                    </div>

                    {/* Autocomplete Dropdown List */}
                    {isSubjectDropdownOpen && (
                      <div className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1 text-xs">
                        <div className="px-3 py-1.5 text-[10px] text-slate-400 font-bold uppercase border-b border-slate-800 flex justify-between items-center">
                          <span>Suggestions ({SUGGESTED_SUBJECTS.filter((s) => s.toLowerCase().includes((subjectSearchFilter || academicSubject).toLowerCase().trim())).length})</span>
                          <button
                            type="button"
                            onClick={() => setIsSubjectDropdownOpen(false)}
                            className="text-slate-400 hover:text-white cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                        {SUGGESTED_SUBJECTS.filter((s) => s.toLowerCase().includes((subjectSearchFilter || academicSubject).toLowerCase().trim())).length > 0 ? (
                          SUGGESTED_SUBJECTS.filter((s) => s.toLowerCase().includes((subjectSearchFilter || academicSubject).toLowerCase().trim())).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setAcademicSubject(s === 'Other' ? '' : s);
                                setIsSubjectDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-cyan-950/60 hover:text-cyan-300 transition-colors flex items-center justify-between cursor-pointer ${
                                academicSubject === s ? 'text-cyan-400 font-bold bg-cyan-950/40' : 'text-slate-300'
                              }`}
                            >
                              <span>{s}</span>
                              {academicSubject === s && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-3 text-center">
                            <p className="text-slate-300 text-xs font-semibold">Custom Subject: "{academicSubject}"</p>
                            <p className="text-[11px] text-cyan-400 mt-0.5">Your custom subject will be used.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">Select a subject or type your own. Optional.</p>
                </div>

                {/* Topic / Sub-unit & Academic Category / Branch / Exam */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Topic / Sub-Unit <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Trees & Graphs, Chapter 3, Organic Chemistry..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {['Hashing', 'Linear Probing', 'Regression', 'Thermodynamics', 'Organic Chemistry', 'Normalization'].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setTopic(item)}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                        >
                          + {item}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">e.g. Trees & Graphs, Chapter 3, Organic Chemistry. Optional.</p>
                  </div>

                  {/* Academic Category / Branch / Exam */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Academic Category / Branch / Exam <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="space-y-1.5">
                      <select
                        value={academicCategory}
                        onChange={(e) => {
                          setAcademicCategory(e.target.value);
                          if (e.target.value !== 'Other') {
                            setCustomCategoryInput('');
                          }
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                      >
                        {ACADEMIC_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      {academicCategory === 'Other' && (
                        <input
                          type="text"
                          value={customCategoryInput}
                          onChange={(e) => setCustomCategoryInput(e.target.value)}
                          placeholder="Type your category / branch / exam..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Faculty / Creator Name (Read-only for authenticated student) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Faculty / Creator</span>
                  </label>
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span className="font-bold">{currentUser?.name || 'Student Creator'}</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-800/60">
                      Authenticated Student (Read-Only)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Automatically assigned to your verified account. The backend derives the creator from your authenticated session.
                  </p>
                </div>

                {/* Description / Overview */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Overview & Description <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of concepts, theorems, formulas, or syllabus topics covered..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Semester / Academic Year, Estimated Read Time, Language, Difficulty */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Academic Level / Semester <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => {
                        setSemester(e.target.value);
                        if (e.target.value !== 'Other') setCustomSemesterInput('');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      {SEMESTERS.map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                    {semester === 'Other' && (
                      <input
                        type="text"
                        value={customSemesterInput}
                        onChange={(e) => setCustomSemesterInput(e.target.value)}
                        placeholder="Type level / year / exam..."
                        className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Estimated Read Time</label>
                    <select
                      value={estimatedReadTime}
                      onChange={(e) => setEstimatedReadTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      {['15 mins', '30 mins', '45 mins', '1 hour', '2 hours', 'Full Unit/Course'].map((rt) => (
                        <option key={rt} value={rt}>
                          {rt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Difficulty Level</label>
                    <select
                      value={difficultyLevel}
                      onChange={(e) => setDifficultyLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      {DIFFICULTY_LEVELS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tags / Keywords <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add tag and press Enter..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:text-white"
                    >
                      Add Tag
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-300 text-[11px]"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-rose-400 font-bold ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 cursor-pointer"
                >
                  <span>Next: Upload PDF</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: UPLOAD PDF */}
          {/* ============================================================ */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
                <p className="font-bold flex items-center gap-1.5 text-white">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  Step 2: Upload your notes file
                </p>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  The actual content of your PDF will be verified for educational validity, originality, structure, and deduplication.
                </p>
              </div>

              {/* Drag and drop upload zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => {
                  const input = document.getElementById('step2-pdf-upload-input');
                  if (input) input.click();
                }}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
                  dragOver
                    ? 'border-cyan-400 bg-cyan-950/30'
                    : selectedFile
                    ? 'border-emerald-500/60 bg-emerald-950/10'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                }`}
              >
                <input
                  id="step2-pdf-upload-input"
                  type="file"
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                />

                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{selectedFile.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB •{' '}
                        <span className="text-emerald-400 font-bold">[Uploaded Successfully]</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-1">
                      <span className="text-[11px] text-cyan-400 font-semibold underline">
                        Click to change file
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="text-[11px] text-rose-400 hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        Click or drag & drop your study notes PDF here
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports PDF up to 50MB (handwritten notes, formula sheets, problem derivations)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected File Details */}
              {selectedFile && (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>File Name:</span>
                    <span className="font-bold text-white">{selectedFile.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>File Size:</span>
                    <span className="font-mono text-cyan-300">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Subject / Category:</span>
                    <span className="text-white font-semibold">
                      {academicSubject || 'General'} • {customCategoryInput.trim() || academicCategory}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Upload Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready for AI Analysis
                    </span>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={!selectedFile}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
                    selectedFile
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20 hover:brightness-110 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze Notes Content
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: AI CONTENT ANALYSIS */}
          {/* ============================================================ */}
          {currentStep === 3 && (
            <div className="py-6 text-center space-y-6 animate-fadeIn">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <div className="absolute inset-3 rounded-full bg-cyan-950/50 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-white font-['Outfit']">
                  YuvaSetu is analyzing your notes...
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Inspecting document content, headings, readability, duplicate similarity across existing materials, and computing pricing guidance...
                </p>
              </div>

              {/* Progress checklist */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-2.5">
                {pipelineSteps.map((step, idx) => {
                  const isDone = idx < analysisProgressStep;
                  const isCurrent = idx === analysisProgressStep;
                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-2.5 text-xs transition-colors ${
                        isDone
                          ? 'text-emerald-400'
                          : isCurrent
                          ? 'text-cyan-400 font-bold'
                          : 'text-slate-500'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                      )}
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: REVIEW ANALYSIS + FINAL PRICE */}
          {/* ============================================================ */}
          {currentStep === 4 && aiAnalysis && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header: Note Submission Audit & AI Analysis */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1428] border border-cyan-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-cyan-400 uppercase font-black tracking-wider block">
                      NOTE SUBMISSION AUDIT & AI ANALYSIS
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      {aiAnalysis.suggestedTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Uploaded by <strong className="text-slate-200">{currentUser?.name || 'Student Creator'}</strong> ({currentUser?.email || ''})
                    </p>
                  </div>
                  <div className="self-start sm:self-auto flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800/60">
                      {academicSubject || aiAnalysis.detectedSubject} • {customCategoryInput.trim() || academicCategory}
                    </span>
                    {getPolishTierBadge(aiAnalysis.polishCategory)}
                  </div>
                </div>

                {/* Academic Metadata Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Level / Semester:</span>
                    <span className="font-semibold text-white">{customSemesterInput.trim() || semester}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Topic / Sub-Unit:</span>
                    <span className="font-semibold text-white">{topic || aiAnalysis.keyTopics?.[0] || 'Comprehensive'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Pages:</span>
                    <span className="font-mono font-bold text-cyan-300">{aiAnalysis.pageCount} pages</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Language:</span>
                    <span className="font-semibold text-white">{language}</span>
                  </div>
                </div>
              </div>

              {/* 1. Educational Validity & Duplicate Screening Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Educational Validity */}
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      Educational Validity
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      aiAnalysis.isEducational
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    }`}>
                      {aiAnalysis.isEducational ? 'VALID' : 'INVALID'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {aiAnalysis.educationalValidity?.reason || 'Verified as authentic student educational material covering academic syllabus concepts.'}
                  </p>
                </div>

                {/* Duplicate / Similarity Check */}
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      Duplicate & Similarity Check
                    </span>
                    {getDuplicateBadge(aiAnalysis.duplicateDetection)}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {aiAnalysis.duplicateDetection.reason}
                  </p>
                  <p className="text-[10px] text-slate-400 italic">
                    Note: Sharing the same topic or subject is normal and allowed; only substantially identical content is flagged.
                  </p>
                </div>
              </div>

              {/* 2. Quality Scores Grid (0 - 100) */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Content Quality Evaluation
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Thresholds Configured by Platform
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Overall Quality</p>
                    <p className="text-lg font-black text-white mt-0.5">
                      {aiAnalysis.overallQualityScore}
                      <span className="text-xs text-slate-400 font-normal">/100</span>
                    </p>
                    <p className="text-[10px] text-slate-400">Min: {thresholds.minimumOverallQualityScore}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Relevance</p>
                    <p className="text-lg font-black text-white mt-0.5">
                      {aiAnalysis.relevanceScore}
                      <span className="text-xs text-slate-400 font-normal">/100</span>
                    </p>
                    <p className="text-[10px] text-slate-400">Min: {thresholds.minimumRelevanceScore}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Completeness</p>
                    <p className="text-lg font-black text-white mt-0.5">
                      {aiAnalysis.completenessScore}
                      <span className="text-xs text-slate-400 font-normal">/100</span>
                    </p>
                    <p className="text-[10px] text-slate-400">Min: {thresholds.minimumCompletenessScore}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">AI Confidence</p>
                    <p className="text-lg font-black text-white mt-0.5">{aiAnalysis.aiConfidence}%</p>
                    <p className="text-[10px] text-slate-400">Min: {thresholds.minimumAIConfidence}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-center pt-1">
                  <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                    <span className="text-slate-400 block text-[10px]">Structure:</span>
                    <span className="font-bold text-white">{aiAnalysis.structureScore}/100</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                    <span className="text-slate-400 block text-[10px]">Readability:</span>
                    <span className="font-bold text-white">{aiAnalysis.readabilityScore}/100</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                    <span className="text-slate-400 block text-[10px]">Educational:</span>
                    <span className="font-bold text-white">{aiAnalysis.educationalValueScore}/100</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                    <span className="text-slate-400 block text-[10px]">Accuracy Conf:</span>
                    <span className="font-bold text-white">{aiAnalysis.accuracyConfidenceScore}/100</span>
                  </div>
                </div>
              </div>

              {/* 2. AI Improvement Analysis (What is good, What needs improvement, Missing) */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  AI Content Improvement Analysis
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Strengths */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> What Is Good (Strengths)
                    </span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {aiAnalysis.improvementAnalysis.strengths.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Needs Improvement */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> What Needs Improvement
                    </span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {aiAnalysis.improvementAnalysis.needsImprovement.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Missing Elements */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> What Is Missing (Optional Additions)
                    </span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {aiAnalysis.improvementAnalysis.missing.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 mt-0.5">+</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* No Improvement Required */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Keep As-Is (Well Done)
                    </span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {aiAnalysis.improvementAnalysis.noImprovementRequired.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-blue-400 mt-0.5">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. AI PRICE RECOMMENDATION vs STUDENT FINAL PRICE */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/30 via-slate-900 to-blue-950/30 border-2 border-cyan-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-400" />
                      Set Your Selling Price
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      AI only recommends the price. You make the final decision.
                    </p>
                  </div>
                </div>

                {/* AI Recommendation Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                      AI Recommended Price
                    </span>
                    <p className="text-xl font-black text-white">
                      ₹{aiAnalysis.priceRecommendation.recommendedPrice}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {aiAnalysis.priceRecommendation.rationale}
                    </p>
                  </div>

                  <div className="space-y-0.5 sm:border-l sm:border-slate-800 sm:pl-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Suggested Range
                    </span>
                    <p className="text-xl font-black text-slate-200">
                      ₹{aiAnalysis.priceRecommendation.suggestedMin} – ₹
                      {aiAnalysis.priceRecommendation.suggestedMax}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      You are free to choose any price from ₹{thresholds.minimumPriceINR} to ₹
                      {thresholds.maximumPriceINR}.
                    </p>
                  </div>
                </div>

                {/* Student Final Price Selection */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-amber-400">
                      YOUR FINAL SELLING PRICE (₹ INR)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Platform bounds: ₹{thresholds.minimumPriceINR} – ₹{thresholds.maximumPriceINR}
                    </span>
                  </div>

                  {/* 3 Tier Presets: Basic, Premium, Deluxe */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setStudentPrice(10)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        studentPrice === 10
                          ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Basic Tier</span>
                        {studentPrice === 10 && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <p className="text-lg font-black text-white mt-1">₹10</p>
                      <p className="text-[10px] text-slate-400">Quick concept summaries & formulas</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentPrice(aiAnalysis.priceRecommendation.recommendedPrice || 25)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        studentPrice === (aiAnalysis.priceRecommendation.recommendedPrice || 25)
                          ? 'border-amber-400 bg-amber-950/40 shadow-lg shadow-amber-500/20'
                          : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          Premium Tier (AI Rec)
                        </span>
                        {studentPrice === (aiAnalysis.priceRecommendation.recommendedPrice || 25) && (
                          <Check className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </div>
                      <p className="text-lg font-black text-white mt-1">
                        ₹{aiAnalysis.priceRecommendation.recommendedPrice || 25}
                      </p>
                      <p className="text-[10px] text-slate-400">Comprehensive unit & exam notes</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStudentPrice(49)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        studentPrice === 49
                          ? 'border-purple-400 bg-purple-950/60 shadow-lg shadow-purple-500/20'
                          : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Deluxe Tier</span>
                        {studentPrice === 49 && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <p className="text-lg font-black text-white mt-1">₹49</p>
                      <p className="text-[10px] text-slate-400">Full master derivations & question sets</p>
                    </button>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400">Or pick preset:</span>
                    {[10, 15, 25, 29, 39, 49, 79].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setStudentPrice(amt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          studentPrice === amt
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={thresholds.minimumPriceINR}
                      max={thresholds.maximumPriceINR}
                      step="1"
                      value={studentPrice}
                      onChange={(e) => setStudentPrice(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-lg font-black focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                  </div>

                  {/* Earnings Preview */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Your Earnings (85%)
                      </span>
                      <p className="text-sm font-black text-emerald-400">₹{studentEarnings}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Platform Fee (15%)
                      </span>
                      <p className="text-sm font-semibold text-slate-400">₹{platformFee}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Rights Declaration & Confirmation Checkboxes */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rightsDeclarationAccepted}
                    onChange={(e) => setRightsDeclarationAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                  />
                  <span className="text-slate-300">
                    <strong className="text-white">Upload Rights Declaration:</strong> I affirm that this document consists of my educational notes, does not infringe on copyright, and contains no leaked examination material.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={listingInfoAccepted}
                    onChange={(e) => setListingInfoAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-cyan-500 focus:ring-0 bg-slate-950 border-slate-700"
                  />
                  <span className="text-slate-300">
                    <strong className="text-white">Confirm Listing Details:</strong> I have reviewed the title, subject, and my selected final selling price of ₹{studentPrice}.
                  </span>
                </label>
              </div>

              {finalizeError && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{finalizeError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPriceConfirmationPopupOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-900/60 transition-colors cursor-pointer"
                  >
                    <Coins className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Open Price Popup</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalizePriceAndPublish}
                  disabled={isFinalizing || !rightsDeclarationAccepted || !listingInfoAccepted}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
                    !isFinalizing && rightsDeclarationAccepted && listingInfoAccepted
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20 hover:brightness-110 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isFinalizing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Evaluating & Publishing...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Confirm & Submit (₹{studentPrice})
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

          {/* ============================================================ */}
          {/* STEP 5: FINAL RESULT */}
          {/* ============================================================ */}
          {currentStep === 5 && publishResult && (
            <div className="py-6 text-center space-y-6 animate-fadeIn">
              {publishResult.autoPublished ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white font-['Outfit']">
                      Your material has been published successfully! 🎉
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Your notes passed all automated validation criteria and are now live in Study Materials for peer students.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 max-w-md mx-auto text-left space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Title:</span>
                      <span className="font-bold text-white text-right">{publishResult.note.title}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Final Price:</span>
                      <span className="font-black text-emerald-400">
                        ₹{publishResult.note.studentSelectedPrice}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Quality Tier:</span>
                      <span className="text-cyan-300 font-bold">{aiAnalysis?.polishCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Publication Status:</span>
                      <span className="font-bold text-emerald-400 uppercase tracking-wider">
                        PUBLISHED
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white font-['Outfit']">
                      Submission Queued for Review
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      {publishResult.reviewReason ||
                        'Because some automated metrics did not pass the auto-publish threshold, your submission has been safely routed to the administrator review queue.'}
                    </p>
                  </div>
                </>
              )}

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onNavigate) onNavigate('explore');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  Browse Study Materials
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AUTOMATIC NOTE SUBMISSION AUDIT & AI ANALYSIS / PRICE CONFIRMATION MODAL */}
      {isPriceConfirmationPopupOpen && submission && (
        <StudentSetPriceModal
          isOpen={isPriceConfirmationPopupOpen}
          onClose={() => {
            setIsPriceConfirmationPopupOpen(false);
          }}
          submission={submission}
          currentUser={currentUser}
          onSuccess={(publishedNote) => {
            setIsPriceConfirmationPopupOpen(false);
            if (onPublishedSuccess) {
              onPublishedSuccess(publishedNote);
            }
            setCurrentStep(5);
            setPublishResult({
              status: 'PUBLISHED',
              autoPublished: true,
              aiRecommendedPrice: submission.aiRecommendedPrice || 25,
              finalPrice: publishedNote.studentSelectedPrice || studentPrice,
              message: 'Your notes have been successfully analyzed and published on YuvaSetu.',
              note: publishedNote,
            });
          }}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
