export type PublishingEligibilityStatus = 'AUTO_PUBLISH' | 'REVIEW_REQUIRED' | 'REJECTED';

export type NoteListingStatus =
  | 'DRAFT'
  | 'UPLOADING'
  | 'PROCESSING'
  | 'AI_ANALYZING'
  | 'AI_ANALYZED'
  | 'READY_FOR_REVIEW'
  | 'PRICE_SELECTED'
  | 'ELIGIBILITY_CHECK'
  | 'AWAITING_STUDENT_PRICE'
  | 'PUBLISHED'
  | 'REVIEW_REQUIRED'
  | 'DUPLICATE_DETECTED'
  | 'DUPLICATE'
  | 'REJECTED'
  | 'AI_FAILED';

export type PolishCategory = 'BASIC' | 'PREMIUM' | 'DELUXE';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface EducationalValidity {
  status: 'VALID' | 'INVALID' | 'UNCERTAIN';
  reason: string;
}

export interface DuplicateAnalysis {
  status: 'UNIQUE' | 'POSSIBLE_DUPLICATE' | 'DUPLICATE';
  similarityScore: number;
  reason: string;
}

export interface QualityScores {
  relevance: number;
  completeness: number;
  structure: number;
  readability: number;
  educationalValue: number;
  accuracyConfidence: number;
  overall: number;
}

export interface QualityFeedback {
  strengths: string[];
  improvements: string[];
  improvementRequired: boolean;
}

export interface CategoryRecommendation {
  category: PolishCategory;
  reason: string;
}

export interface PricingRecommendation {
  recommendedPrice: number;
  minimumSuggestedPrice: number;
  maximumSuggestedPrice: number;
  reason: string;
}

export interface RiskAssessment {
  copyrightRisk: RiskLevel;
  prohibitedContentRisk: RiskLevel;
}

export interface PublishingThresholds {
  minimumOverallQualityScore: number; // default: 70
  minimumRelevanceScore: number;      // default: 70
  minimumCompletenessScore: number;   // default: 60
  minimumAIConfidence: number;        // default: 75
  allowedCopyrightRisk: RiskLevel[];  // ['LOW']
  allowedOriginalityRisk: RiskLevel[]; // ['LOW']
  minimumPriceINR: number;            // default: 5
  maximumPriceINR: number;            // default: 499
  defaultCurrency: string;            // 'INR'
}

export const DEFAULT_PUBLISHING_THRESHOLDS: PublishingThresholds = {
  minimumOverallQualityScore: 70,
  minimumRelevanceScore: 70,
  minimumCompletenessScore: 60,
  minimumAIConfidence: 75,
  allowedCopyrightRisk: ['LOW'],
  allowedOriginalityRisk: ['LOW'],
  minimumPriceINR: 5,
  maximumPriceINR: 499,
  defaultCurrency: 'INR',
};

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  similarityScore: number; // 0 - 100
  duplicateStatus: 'UNIQUE' | 'PARTIAL_OVERLAP' | 'DUPLICATE_DETECTED';
  matchedMaterialTitle?: string;
  matchedMaterialId?: string;
  matchedStudentName?: string;
  reason: string;
}

export interface AIImprovementAnalysis {
  strengths: string[];             // What is good
  needsImprovement: string[];      // What needs improvement
  missing: string[];               // What is missing
  noImprovementRequired: string[]; // What should not be changed
}

export interface AIAnalysisResult {
  // Security & reading
  fileSafe: boolean;
  pdfReadable: boolean;
  pageCount: number;
  fileSha256?: string;

  // Academic & category
  detectedSubject: string;
  detectedSubjectId: string;
  detectedCategory: string; // e.g. "Lecture Notes", "Formula Sheet", "Exam Preparation", "Lab Manual", "Derivations"
  academicCategory: string; // Replaces engineering branch: e.g. "Engineering", "Science", "Commerce", "Arts", "School Education", "Competitive Exams", "JEE Mains", "MHT-CET", "UPSC", "NEET", "Other"
  academicLevel: string;    // e.g. "Undergraduate", "High School", "Diploma", "Postgraduate"
  semesterSuggestion?: string;

  // Polish / Quality Tier
  polishCategory: PolishCategory; // BASIC | PREMIUM | DELUXE

  // Metadata generation
  suggestedTitle: string;
  suggestedDescription: string;
  generatedTags: string[];
  keyTopics: string[];

  // Scores (0 - 100)
  overallQualityScore: number;
  relevanceScore: number;
  completenessScore: number;
  structureScore: number;
  readabilityScore: number;
  educationalValueScore: number;
  accuracyConfidenceScore: number;
  aiConfidence: number;

  // Duplicate Content Detection
  duplicateDetection: DuplicateDetectionResult;

  // AI Improvement Feedback
  improvementAnalysis: AIImprovementAnalysis;

  // Risk assessments
  isEducational: boolean;
  copyrightRisk: RiskLevel;
  copyrightRiskReason: string;
  originalityRisk: RiskLevel;
  originalityRiskReason: string;
  prohibitedContentRisk: RiskLevel;
  leakedExamRisk: RiskLevel;
  malwareRisk: RiskLevel;

  // Pricing recommendations (AI ONLY RECOMMENDS, STUDENT MAKES FINAL DECISION)
  priceRecommendation: {
    recommendedPrice: number; // e.g. 10 or 49
    suggestedMin: number;      // e.g. 5 or 29
    suggestedMax: number;      // e.g. 20 or 79
    currency: string;          // 'INR'
    rationale: string;
  };

  // Part 22 Exact Structured AI Response Fields
  educationalValidity: EducationalValidity;
  duplicateAnalysis: DuplicateAnalysis;
  qualityScores: QualityScores;
  qualityFeedback: QualityFeedback;
  categoryRecommendation: CategoryRecommendation;
  pricing: PricingRecommendation;
  riskAssessment: RiskAssessment;
  confidence: number;
  estimatedStudyTime?: string;

  // Structured publishing recommendation
  publishingEligibility: {
    eligible: boolean;
    status: PublishingEligibilityStatus;
    reason: string;
    conditionChecklist: {
      fileSafe: boolean;
      pdfReadable: boolean;
      educationalContent: boolean;
      categoryRelevance: boolean;
      qualityScorePass: boolean;
      completenessPass: boolean;
      copyrightRiskLow: boolean;
      originalityRiskLow: boolean;
      noLeakedExamMaterial: boolean;
      noProhibitedContent: boolean;
      noDuplicateContent: boolean;
      confidencePass: boolean;
    };
  };

  analyzedAt: string;
}

export interface StudentNoteSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentCollege?: string;

  // Uploaded document
  fileName: string;
  fileSize: string;
  fileSizeBytes: number;
  fileUrl: string;
  fileSha256?: string;
  pageCount: number;

  // Listing info
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  topic?: string;
  category: string;
  academicCategory?: string; // Replaces engineering branch
  semester?: string;
  language?: string;
  difficulty?: string;
  tags: string[];

  // Polish Category: BASIC | PREMIUM | DELUXE
  polishCategory?: PolishCategory;

  // AI Pipeline output
  aiAnalysis?: AIAnalysisResult;
  aiRecommendedPrice?: number;
  suggestedMinPrice?: number;
  suggestedMaxPrice?: number;

  // Student choices
  studentSelectedPrice?: number;
  rightsDeclarationAccepted: boolean;
  listingInfoAccepted: boolean;

  // Final published & review fields
  status: NoteListingStatus;
  publishingEligibilityStatus?: PublishingEligibilityStatus;
  publishedAt?: string;
  reviewReason?: string;
  rejectionReason?: string;

  // Analytics
  purchasesCount: number;
  viewsCount: number;
  ratingsCount: number;
  ratingAverage: number;

  createdAt: string;
  updatedAt: string;
}
