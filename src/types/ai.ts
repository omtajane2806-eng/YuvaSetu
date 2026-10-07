export type AIModelType = 'gemini-3.7-flash' | 'gemini-3.1-pro-preview' | 'gemini-flash-latest';

export type AIQuestionDifficulty = 'easy' | 'medium' | 'hard';
export type AIQuestionType = 'mcq' | 'short_answer' | 'conceptual' | 'code';
export type AIOperationType =
  | 'chat'
  | 'explain'
  | 'summarize'
  | 'revision_notes'
  | 'quiz_generate'
  | 'quiz_evaluate'
  | 'explain_code'
  | 'explain_formula';

export interface AIContext {
  material_id: string;
  material_title: string;
  subject_id?: string;
  subject_name?: string;
  topic?: string;
  section_id?: string;
  section_title?: string;
  page_number?: number;
  source_text_reference?: string;
  contentType?: string;
  created_at: string;
}

export interface AISourceReference {
  materialId?: string;
  materialTitle?: string;
  subjectName?: string;
  section?: string;
  pageNumber?: number;
  snippet?: string;
  isGeneralKnowledge?: boolean;
  uncertaintyNotice?: string;
}

export interface StructuredAIContent {
  shortAnswer?: string;
  explanation?: string;
  keyConcepts?: string[];
  definitions?: Array<{ term: string; definition: string }>;
  example?: string;
  keyTakeaway?: string;
  examPoints?: string[];
  codeExplanation?: {
    codeSnippet?: string;
    whatItDoes?: string;
    stepByStepLogic?: string[];
    variables?: Array<{ name: string; purpose: string }>;
    timeComplexity?: string;
    spaceComplexity?: string;
    edgeCases?: string[];
  };
  formulaExplanation?: {
    formula?: string;
    variables?: Array<{ symbol: string; meaning: string }>;
    simpleExplanation?: string;
    example?: string;
    whenToUse?: string;
  };
  revisionNotes?: {
    topic?: string;
    importantConcepts?: string[];
    definitions?: Array<{ term: string; meaning: string }>;
    formulas?: string[];
    examples?: string[];
    commonMistakes?: string[];
    quickRevision?: string[];
  };
  suggestedFollowUps?: string[];
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  structured?: StructuredAIContent;
  sourceContext?: AISourceReference;
  feedback?: {
    helpful: boolean;
    reason?: string;
    timestamp: string;
  };
  created_at: string;
}

export interface AIConversation {
  id: string;
  student_id: string;
  student_name?: string;
  title: string;
  material_id?: string;
  material_title?: string;
  subject_name?: string;
  topic?: string;
  section_id?: string;
  page_number?: number;
  last_message_preview?: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface AIQuizQuestion {
  id: string;
  question: string;
  type: AIQuestionType;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: AIQuestionDifficulty;
  sourceReference?: string;
}

export interface AIQuizAttempt {
  id: string;
  student_id: string;
  student_name: string;
  material_id?: string;
  material_title?: string;
  topic: string;
  difficulty: AIQuestionDifficulty;
  questionCount: number;
  score: number;
  percentage: number;
  answers: Array<{
    questionId: string;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }>;
  weakTopics: string[];
  recommendedMaterials: Array<{
    id: string;
    title: string;
    subject_name: string;
    topic: string;
  }>;
  created_at: string;
}

export interface AIUsageRecord {
  id: string;
  student_id: string;
  conversation_id?: string;
  operation_type: AIOperationType;
  material_id?: string;
  material_title?: string;
  source_grounded: boolean;
  tokens_used?: number;
  created_at: string;
}

export interface AIFeedbackRecord {
  id: string;
  student_id: string;
  message_id: string;
  conversation_id: string;
  helpful: boolean;
  reason?: 'Incorrect' | 'Not Relevant' | 'Too Complicated' | 'Missing Information' | 'Other';
  comment?: string;
  created_at: string;
}

export interface AdminAISettings {
  aiEnabled: boolean;
  model: string;
  maxResponseLength: number;
  sourceGroundedMode: boolean;
  generalKnowledgeFallback: boolean;
  usageLogging: boolean;
  educationSafetyEnforced: boolean;
  lastUpdated: string;
  updatedBy: string;
}

export interface AIStatsOverview {
  totalQuestionsAsked: number;
  totalConversations: number;
  totalSummariesGenerated: number;
  totalQuizzesGenerated: number;
  totalQuizzesCompleted: number;
  totalSourceGroundedQueries: number;
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulRatePercent: number;
  averageQuizScorePercent: number;
  topSubjects: Array<{ subject: string; count: number }>;
  questionTypesBreakdown: Array<{ type: string; count: number; percentage: number }>;
  topMaterialsAskedAbout: Array<{ materialTitle: string; queryCount: number }>;
  identifiedWeakTopics: Array<{ topic: string; failedCount: number }>;
}
