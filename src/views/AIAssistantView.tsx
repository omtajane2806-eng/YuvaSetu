import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types/user';
import { AIContext, AIMessage, AIConversation, AISourceReference } from '../types/ai';
import { aiService } from '../services/aiService';
import { contentService } from '../services/contentService';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import { AIQuizModal } from '../components/ai/AIQuizModal';
import { AISummaryModal } from '../components/ai/AISummaryModal';
import { AIRevisionNotesModal } from '../components/ai/AIRevisionNotesModal';
import { AICodeExplainModal } from '../components/ai/AICodeExplainModal';
import { AIFormulaModal } from '../components/ai/AIFormulaModal';
import { AIFeedbackModal } from '../components/ai/AIFeedbackModal';
import { AIHistoryDrawer } from '../components/ai/AIHistoryDrawer';
import {
  Sparkles,
  Send,
  BookOpen,
  HelpCircle,
  Clock,
  RotateCcw,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Layers,
  FileText,
  Code2,
  Sigma,
  Award,
  ChevronRight,
  X,
  ExternalLink,
  Plus,
  ArrowRight,
  Info,
  ShieldCheck,
  CornerDownRight,
  AlertCircle,
} from 'lucide-react';

export interface AIAssistantViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
  initialMaterialId?: string;
  initialTopic?: string;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  currentUser,
  onNavigate,
  initialMaterialId,
  initialTopic,
}) => {
  // Active Context State
  const [activeContext, setActiveContext] = useState<AIContext | null>(null);

  // Conversation State
  const [activeConversation, setActiveConversation] = useState<AIConversation | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals & Drawers
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionData, setRevisionData] = useState<any>(null);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [feedbackModalState, setFeedbackModalState] = useState<{
    open: boolean;
    messageId: string;
    isHelpful: boolean;
  }>({
    open: false,
    messageId: '',
    isHelpful: true,
  });

  // Source inspection popover
  const [selectedSourceRef, setSelectedSourceRef] = useState<AISourceReference | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Available study materials for context switcher
  const allMaterials = contentService.getAllContent(false);

  // 1. INITIALIZE CONTEXT AND CONVERSATION ON MOUNT
  useEffect(() => {
    const studentId = currentUser?.id || 'user-student-aryan';
    const studentName = currentUser?.name || 'Aryan Sharma';

    // If material passed via props or navigation payload
    if (initialMaterialId) {
      const mat = contentService.getContentById(initialMaterialId, true);
      if (mat) {
        const ctx: AIContext = {
          material_id: mat.id,
          material_title: mat.title,
          subject_id: mat.subject_id,
          subject_name: mat.subject_name,
          topic: mat.topic || initialTopic || mat.title,
          contentType: mat.content_type,
          created_at: new Date().toISOString(),
        };
        setActiveContext(ctx);

        // Start or retrieve conversation for this material
        const conv = aiService.createConversation(
          studentId,
          studentName,
          `Discussion on ${mat.title}`,
          ctx
        );
        setActiveConversation(conv);
        loadWelcomeMessage(conv.id, studentId, mat.title);
        return;
      }
    }

    // Default: Check past conversations or create initial
    const pastConvs = aiService.getStudentConversations(studentId);
    if (pastConvs.length > 0) {
      const latest = pastConvs[0];
      setActiveConversation(latest);
      if (latest.material_id) {
        const mat = contentService.getContentById(latest.material_id, true);
        if (mat) {
          setActiveContext({
            material_id: mat.id,
            material_title: mat.title,
            subject_id: mat.subject_id,
            subject_name: mat.subject_name,
            topic: mat.topic || mat.title,
            contentType: mat.content_type,
            created_at: new Date().toISOString(),
          });
        }
      }
      const existingMsgs = aiService.getMessages(latest.id, studentId);
      setMessages(existingMsgs);
    } else {
      // Create first default conversation grounded in DSA Searching and Sorting
      const defaultMat = allMaterials.find((m) => m.id.includes('searching-sorting')) || allMaterials[0];
      let ctx: AIContext | undefined = undefined;
      if (defaultMat) {
        ctx = {
          material_id: defaultMat.id,
          material_title: defaultMat.title,
          subject_id: defaultMat.subject_id,
          subject_name: defaultMat.subject_name,
          topic: defaultMat.topic || defaultMat.title,
          contentType: defaultMat.content_type,
          created_at: new Date().toISOString(),
        };
        setActiveContext(ctx);
      }

      const newConv = aiService.createConversation(
        studentId,
        studentName,
        defaultMat ? `Learning ${defaultMat.title}` : 'Conceptual Learning Session',
        ctx
      );
      setActiveConversation(newConv);
      loadWelcomeMessage(newConv.id, studentId, defaultMat?.title);
    }
  }, [initialMaterialId, currentUser?.id]);

  const loadWelcomeMessage = (convId: string, studentId: string, materialName?: string) => {
    const welcome = aiService.addMessage(
      convId,
      studentId,
      'assistant',
      materialName
        ? `Namaste! I am your YuvaSetu AI Learning Assistant, grounded in your study material: "${materialName}". Ask me any confusing concept, formula derivation, or algorithmic paradox to understand it from first principles ("Samajh Se Safalta Tak").`
        : `Namaste! I am your YuvaSetu AI Learning Assistant. You can attach any YuvaSetu study material to ask source-grounded questions, generate quizzes, or build revision notes.`,
      {
        shortAnswer: 'Understand better. Revise smarter.',
        keyConcepts: [
          'Source-Grounded: Prioritizes YuvaSetu handwritten notes, code, and curriculum.',
          'Step-by-Step Logic: Clear conceptual tracing without rote memorization.',
          'Exam Clarity: Structured definitions, formulas, and practice quizzes.',
        ],
        suggestedFollowUps: [
          'Explain this topic simply',
          'Summarize this section',
          'What are the key formulas and complexities?',
          'Generate 5 practice questions',
        ],
      },
      materialName
        ? {
            materialTitle: materialName,
            isGeneralKnowledge: false,
          }
        : undefined
    );
    setMessages([welcome]);
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle Switch Conversation
  const handleSelectConversation = (conversationId: string) => {
    const studentId = currentUser?.id || 'user-student-aryan';
    const conv = aiService.getConversationById(conversationId, studentId);
    if (!conv) return;

    setActiveConversation(conv);
    if (conv.material_id) {
      const mat = contentService.getContentById(conv.material_id, true);
      if (mat) {
        setActiveContext({
          material_id: mat.id,
          material_title: mat.title,
          subject_id: mat.subject_id,
          subject_name: mat.subject_name,
          topic: mat.topic || mat.title,
          contentType: mat.content_type,
          created_at: new Date().toISOString(),
        });
      } else {
        setActiveContext(null);
      }
    } else {
      setActiveContext(null);
    }
    const msgs = aiService.getMessages(conversationId, studentId);
    setMessages(msgs);
  };

  // Handle Start New Chat
  const handleStartNewChat = () => {
    const studentId = currentUser?.id || 'user-student-aryan';
    const studentName = currentUser?.name || 'Aryan Sharma';
    const newConv = aiService.createConversation(
      studentId,
      studentName,
      activeContext ? `Learning ${activeContext.material_title}` : 'New Conceptual Discussion',
      activeContext || undefined
    );
    setActiveConversation(newConv);
    loadWelcomeMessage(newConv.id, studentId, activeContext?.material_title);
  };

  // Handle Clear Conversation
  const handleClearConversation = () => {
    if (!activeConversation) return;
    const studentId = currentUser?.id || 'user-student-aryan';
    if (window.confirm('Clear all messages in this conversation?')) {
      handleStartNewChat();
    }
  };

  // Handle Context Material Select
  const handleSetMaterialContext = (materialId: string) => {
    if (materialId === 'none') {
      setActiveContext(null);
      return;
    }
    const mat = contentService.getContentById(materialId, true);
    if (!mat) return;
    const ctx: AIContext = {
      material_id: mat.id,
      material_title: mat.title,
      subject_id: mat.subject_id,
      subject_name: mat.subject_name,
      topic: mat.topic || mat.title,
      contentType: mat.content_type,
      created_at: new Date().toISOString(),
    };
    setActiveContext(ctx);
  };

  // Handle Send Query
  const handleSend = async (queryText?: string) => {
    const text = queryText || query;
    if (!text.trim() || isThinking || !activeConversation) return;

    const studentId = currentUser?.id || 'user-student-aryan';
    const studentName = currentUser?.name || 'Aryan Sharma';
    const studentEmail = currentUser?.email || 'aryan@yuvasetu.com';

    // 1. Add user message
    const userMsg = aiService.addMessage(activeConversation.id, studentId, 'user', text);
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsThinking(true);

    try {
      // 2. Generate response via AIService
      const result = await aiService.generateAnswer(
        text,
        studentId,
        studentName,
        studentEmail,
        activeConversation.id,
        activeContext || undefined,
        messages
      );

      // 3. Save assistant message
      const assistantMsg = aiService.addMessage(
        activeConversation.id,
        studentId,
        'assistant',
        result.message,
        result.structured,
        result.sourceReference
      );

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error('Error generating AI answer', e);
    } finally {
      setIsThinking(false);
    }
  };

  // Action: Summarize
  const handleOpenSummarize = async () => {
    if (!activeContext?.material_id) {
      alert('Please attach a study material to generate a curriculum summary.');
      return;
    }
    const studentId = currentUser?.id || 'user-student-aryan';
    const studentName = currentUser?.name || 'Aryan Sharma';
    const studentEmail = currentUser?.email || 'aryan@yuvasetu.com';

    setIsThinking(true);
    try {
      const data = await aiService.summarizeMaterial(
        activeContext.material_id,
        studentId,
        studentName,
        studentEmail
      );
      setSummaryData(data);
      setSummaryModalOpen(true);
    } finally {
      setIsThinking(false);
    }
  };

  // Action: Revision Notes
  const handleOpenRevisionNotes = async () => {
    if (!activeContext?.material_id) {
      alert('Please attach a study material to generate structured revision notes.');
      return;
    }
    const studentId = currentUser?.id || 'user-student-aryan';
    const studentName = currentUser?.name || 'Aryan Sharma';
    const studentEmail = currentUser?.email || 'aryan@yuvasetu.com';

    setIsThinking(true);
    try {
      const data = await aiService.createRevisionNotes(
        activeContext.material_id,
        studentId,
        studentName,
        studentEmail
      );
      setRevisionData(data);
      setRevisionModalOpen(true);
    } finally {
      setIsThinking(false);
    }
  };

  // Action: Copy Text
  const handleCopyMessage = (msgId: string, content: string, structured?: any) => {
    let fullText = content;
    if (structured) {
      if (structured.shortAnswer) fullText += `\n\n${structured.shortAnswer}`;
      if (structured.explanation) fullText += `\n\n${structured.explanation}`;
      if (structured.keyConcepts) fullText += `\n\nKey Concepts:\n${structured.keyConcepts.join('\n')}`;
      if (structured.example) fullText += `\n\nExample:\n${structured.example}`;
      if (structured.keyTakeaway) fullText += `\n\nTakeaway:\n${structured.keyTakeaway}`;
    }
    navigator.clipboard.writeText(fullText);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Dynamic Suggested Prompts based on context
  const getSuggestedPrompts = () => {
    if (activeContext?.material_title.includes('Searching') || activeContext?.topic?.includes('Search')) {
      return [
        'Explain Binary Search from first principles',
        'Compare Merge Sort vs Quick Sort in worst-case',
        'Why does Binary Search require a sorted array?',
        'Give me the key exam formulas and recurrence relations',
      ];
    }
    if (activeContext?.material_title.includes('Hashing') || activeContext?.topic?.includes('Hash')) {
      return [
        'How does Linear Probing resolve collisions?',
        'What is Load Factor λ and when is Rehashing triggered?',
        'Compare Separate Chaining vs Open Addressing',
        'Explain Double Hashing formula step-by-step',
      ];
    }
    return [
      'Explain this topic simply with an intuitive analogy',
      'What are the 3 most important points for exams?',
      'Summarize this section into revision points',
      'Create 5 practice questions on this topic',
    ];
  };

  return (
    <div id="vidyasetu-ai-learning-assistant" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* 1. TOP BRAND BANNER WITH "SOCH SE SAMAJH TAK" (NO USER PHOTOS) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#090d1c] to-[#140e26] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <YuvaSetuLogo variant="icon" size="sm" />
              <h1 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                YuvaSetu AI Learning Assistant
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-cyan-300 font-medium">
              Understand better. Revise smarter. • <span className="text-slate-400 font-normal">"Samajh Se Safalta Tak" Pedagogy</span>
            </p>
          </div>
        </div>

        {/* History & New Chat Buttons */}
        <div className="flex items-center gap-2.5 relative z-10">
          <button
            id="ai-history-btn"
            onClick={() => setHistoryDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>History</span>
          </button>
          <button
            id="ai-new-chat-btn"
            onClick={handleStartNewChat}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* 2. CONTEXT MANAGEMENT BAR */}
      <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Learning Context:</span>
          </span>

          {activeContext ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
              <span>{activeContext.material_title}</span>
              <button
                onClick={() => setActiveContext(null)}
                title="Remove Context (Switch to General Mode)"
                className="p-0.5 rounded-full hover:bg-cyan-500/20 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-medium">
              General Concept Mode (No Material Attached)
            </span>
          )}
        </div>

        {/* Quick Context Switcher Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-[11px] text-slate-400 shrink-0">Attach Study Material:</label>
          <select
            value={activeContext?.material_id || 'none'}
            onChange={(e) => handleSetMaterialContext(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="none">None (General Knowledge)</option>
            {allMaterials.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {mat.title} ({mat.subject_name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. QUICK ACTION BUTTONS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <button
          id="action-summarize-btn"
          onClick={handleOpenSummarize}
          className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-left space-y-1 transition-all cursor-pointer group"
        >
          <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="block text-xs font-bold text-white">Summarize</span>
          <span className="block text-[10px] text-slate-400">Curriculum notes</span>
        </button>

        <button
          id="action-revision-notes-btn"
          onClick={handleOpenRevisionNotes}
          className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 text-left space-y-1 transition-all cursor-pointer group"
        >
          <BookOpen className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="block text-xs font-bold text-white">Revision Notes</span>
          <span className="block text-[10px] text-slate-400">Definitions & traps</span>
        </button>

        <button
          id="action-start-quiz-btn"
          onClick={() => setQuizModalOpen(true)}
          className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 text-left space-y-1 transition-all cursor-pointer group"
        >
          <Award className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="block text-xs font-bold text-white">Start Quiz</span>
          <span className="block text-[10px] text-slate-400">Interactive test</span>
        </button>

        <button
          id="action-practice-questions-btn"
          onClick={() => handleSend('Generate 5 practice questions with step-by-step explanations')}
          className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 text-left space-y-1 transition-all cursor-pointer group"
        >
          <HelpCircle className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="block text-xs font-bold text-white">Practice Qs</span>
          <span className="block text-[10px] text-slate-400">5 Exam problems</span>
        </button>

        <button
          id="action-explain-code-btn"
          onClick={() => setCodeModalOpen(true)}
          className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 text-left space-y-1 transition-all cursor-pointer group"
        >
          <Code2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="block text-xs font-bold text-white">Explain Code</span>
          <span className="block text-[10px] text-slate-400">Complexity & trace</span>
        </button>

        <button
          id="action-explain-formula-btn"
          onClick={() => setFormulaModalOpen(true)}
          className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 text-left space-y-1 transition-all cursor-pointer group"
        >
          <Sigma className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          <span className="block text-xs font-bold text-white">Explain Formula</span>
          <span className="block text-[10px] text-slate-400">Variables & proofs</span>
        </button>
      </div>

      {/* 4. MAIN CHAT STREAM CONTAINER */}
      <div className="rounded-3xl bg-[#080b18] border border-slate-800 shadow-2xl flex flex-col h-[600px] overflow-hidden">
        {/* Chat Stream Header */}
        <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#0b0f1e]/80">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-200">
              {activeConversation?.title || 'Learning Discussion'}
            </span>
          </div>

          <button
            onClick={handleClearConversation}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isCopied = copiedId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col space-y-2 ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Identity Header: ZERO PROFILE PICTURE RULE (Text labels only) */}
                <div className="flex items-center gap-2 px-1">
                  {isUser ? (
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">
                      Student
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-cyan-500/30">
                        YuvaSetu AI
                      </span>
                      {msg.sourceContext && (
                        <span className="text-[10px] text-slate-400">
                          {msg.sourceContext.isGeneralKnowledge
                            ? '• General Explanation'
                            : `• Grounded in ${msg.sourceContext.materialTitle}`}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Message Bubble Card */}
                <div
                  className={`max-w-3xl rounded-3xl p-5 text-xs sm:text-sm leading-relaxed space-y-4 shadow-lg ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm'
                      : 'bg-[#0e1428] border border-slate-800 text-slate-200 rounded-tl-sm'
                  }`}
                >
                  {/* Source Reference Banner if available */}
                  {!isUser && msg.sourceContext && !msg.sourceContext.isGeneralKnowledge && (
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="truncate">
                          Source: <strong>{msg.sourceContext.materialTitle}</strong>
                          {msg.sourceContext.pageNumber && (
                            <span className="text-cyan-300"> • Page {msg.sourceContext.pageNumber}</span>
                          )}
                          {msg.sourceContext.section && (
                            <span className="text-cyan-300"> • Section: {msg.sourceContext.section}</span>
                          )}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedSourceRef(msg.sourceContext || null)}
                        className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 shrink-0 underline cursor-pointer"
                      >
                        View Snippet
                      </button>
                    </div>
                  )}

                  {/* Uncertainty / General Notice if applicable */}
                  {!isUser && msg.sourceContext?.uncertaintyNotice && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{msg.sourceContext.uncertaintyNotice}</span>
                    </div>
                  )}

                  {/* Text Body */}
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Structured Pedagogical Breakdown if attached */}
                  {msg.structured && (
                    <div className="space-y-3 pt-2 border-t border-slate-800/80">
                      {msg.structured.shortAnswer && (
                        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                          <span className="font-bold text-cyan-400 text-xs block mb-1">
                            Core Takeaway:
                          </span>
                          <p className="text-slate-200 text-xs leading-relaxed">
                            {msg.structured.shortAnswer}
                          </p>
                        </div>
                      )}

                      {msg.structured.keyConcepts && msg.structured.keyConcepts.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="font-bold text-slate-300 text-xs uppercase tracking-wider block">
                            Key Principles
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs leading-relaxed">
                            {msg.structured.keyConcepts.map((kc, kIdx) => (
                              <li key={kIdx}>{kc}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.structured.definitions && msg.structured.definitions.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {msg.structured.definitions.map((def, dIdx) => (
                            <div
                              key={dIdx}
                              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
                            >
                              <strong className="text-cyan-300">{def.term}: </strong>
                              <span className="text-slate-300">{def.definition}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.structured.example && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                          <span className="font-bold text-emerald-400 block">Worked Example:</span>
                          <p className="text-slate-300 whitespace-pre-line font-mono text-[11px]">
                            {msg.structured.example}
                          </p>
                        </div>
                      )}

                      {msg.structured.examPoints && msg.structured.examPoints.length > 0 && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                          <span className="font-bold text-amber-300 block">Exam Key Points:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                            {msg.structured.examPoints.map((ep, eIdx) => (
                              <li key={eIdx}>{ep}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Clickable Follow-up Chips */}
                      {msg.structured.suggestedFollowUps && (
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[11px] font-bold text-slate-400">
                            Suggested Follow-ups:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.structured.suggestedFollowUps.map((fu, fIdx) => (
                              <button
                                key={fIdx}
                                onClick={() => handleSend(fu)}
                                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-cyan-300 text-left transition-all cursor-pointer flex items-center gap-1"
                              >
                                <CornerDownRight className="w-3 h-3 text-cyan-400 shrink-0" />
                                <span>{fu}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Action Strip */}
                  {!isUser && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content, msg.structured)}
                          className="px-2 py-1 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white flex items-center gap-1 transition-all cursor-pointer"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[11px]">{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() =>
                            setFeedbackModalState({
                              open: true,
                              messageId: msg.id,
                              isHelpful: true,
                            })
                          }
                          className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-all cursor-pointer"
                          title="Mark Helpful"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() =>
                            setFeedbackModalState({
                              open: true,
                              messageId: msg.id,
                              isHelpful: false,
                            })
                          }
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                          title="Mark Not Helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] text-slate-500">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking Loading State */}
          {isThinking && (
            <div className="flex flex-col items-start space-y-2 animate-fadeIn">
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider border border-cyan-500/30">
                YuvaSetu AI
              </span>
              <div className="p-4 rounded-3xl bg-[#0e1428] border border-slate-800 text-cyan-400 flex items-center gap-3 shadow-lg">
                <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <span className="text-xs font-medium text-slate-300">
                  YuvaSetu AI is thinking & retrieving verified curriculum context...
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Prompts Strip */}
        <div className="px-6 py-2.5 bg-[#0b0f1e]/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Prompts:</span>
          {getSuggestedPrompts().map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-all cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#070a14] border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="ai-query-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                activeContext
                  ? `Ask anything about ${activeContext.material_title}...`
                  : 'Ask any engineering concept, formula derivation, or syllabus problem...'
              }
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
            />
            <button
              id="ai-send-btn"
              type="submit"
              disabled={!query.trim() || isThinking}
              className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 5. MODALS & SUBCOMPONENTS */}
      <AIQuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        materialId={activeContext?.material_id}
        materialTitle={activeContext?.material_title}
        topic={activeContext?.topic}
        currentUser={currentUser}
        onNavigateToMaterial={(id) => onNavigate('content_details', { contentId: id })}
      />

      <AISummaryModal
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        summaryData={summaryData}
      />

      <AIRevisionNotesModal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        revisionData={revisionData}
      />

      <AICodeExplainModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        materialId={activeContext?.material_id}
      />

      <AIFormulaModal
        isOpen={formulaModalOpen}
        onClose={() => setFormulaModalOpen(false)}
      />

      <AIFeedbackModal
        isOpen={feedbackModalState.open}
        onClose={() => setFeedbackModalState((p) => ({ ...p, open: false }))}
        messageId={feedbackModalState.messageId}
        conversationId={activeConversation?.id || ''}
        isHelpful={feedbackModalState.isHelpful}
        currentUser={currentUser}
      />

      <AIHistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        studentId={currentUser?.id || 'user-student-aryan'}
        activeConversationId={activeConversation?.id}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleStartNewChat}
      />

      {/* Snippet Viewer Modal */}
      {selectedSourceRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#0b0f1e] border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Source Context Snippet</h3>
              </div>
              <button
                onClick={() => setSelectedSourceRef(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <p className="text-slate-400">
                <strong>Material:</strong> {selectedSourceRef.materialTitle}
              </p>
              {selectedSourceRef.section && (
                <p className="text-slate-400">
                  <strong>Section:</strong> {selectedSourceRef.section}
                </p>
              )}
              {selectedSourceRef.pageNumber && (
                <p className="text-slate-400">
                  <strong>Page Number:</strong> {selectedSourceRef.pageNumber}
                </p>
              )}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed font-mono text-[11px] whitespace-pre-wrap">
                {selectedSourceRef.snippet}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedSourceRef(null)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
