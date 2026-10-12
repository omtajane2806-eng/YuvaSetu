import {
  AIAnalysisResult,
  PublishingThresholds,
  DEFAULT_PUBLISHING_THRESHOLDS,
  StudentNoteSubmission,
} from '../types/marketplace';
import { apiGet, apiPost, apiPut } from './api';

export interface UploadAndAnalyzeParams {
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentCollege?: string;
  file: File;
  subjectHint?: string;
  titleHint?: string;
  extractedText?: string;
  topic?: string;
  semester?: string;
  branch?: string;
  language?: string;
  difficultyLevel?: string;
}

export interface UploadAndAnalyzeResponse {
  submissionId: string;
  submission: StudentNoteSubmission;
  aiAnalysis: AIAnalysisResult;
}

export interface FinalizePriceParams {
  submissionId: string;
  studentId: string;
  studentPrice: number;
  currency?: string;
  rightsDeclarationAccepted: boolean;
  listingInfoAccepted: boolean;
  customTitle?: string;
  customDescription?: string;
  customSubjectId?: string;
  customSubjectName?: string;
}

export interface FinalizePriceResponse {
  success: boolean;
  autoPublished: boolean;
  status: 'PUBLISHED' | 'REVIEW_REQUIRED' | 'REJECTED';
  message: string;
  reviewReason?: string;
  note: {
    id: string;
    title: string;
    studentSelectedPrice: number;
    aiRecommendedPrice: number;
    status: string;
    publishedAt?: string;
    materialId?: string;
  };
}

class MarketplaceService {
  // 1. Get platform publishing thresholds
  public async getThresholds(): Promise<PublishingThresholds> {
    try {
      const resp = await apiGet<{ success: boolean; thresholds: PublishingThresholds }>('/api/marketplace/thresholds');
      if (resp && resp.thresholds) {
        return resp.thresholds;
      }
    } catch (err) {
      console.warn('Failed to fetch thresholds from server, using defaults:', err);
    }
    return DEFAULT_PUBLISHING_THRESHOLDS;
  }

  // 2. Admin: Update platform publishing thresholds
  public async updateThresholds(thresholds: Partial<PublishingThresholds>, adminId: string = 'admin'): Promise<PublishingThresholds> {
    const resp = await fetch('/api/admin/marketplace/thresholds', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'admin',
        'x-user-id': adminId,
      },
      body: JSON.stringify(thresholds),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update thresholds.');
    }
    const data = await resp.json();
    return data.thresholds;
  }

  // 3. Upload PDF and trigger complete 8-stage AI analysis pipeline
  public async uploadAndAnalyze(params: UploadAndAnalyzeParams): Promise<{
    submissionId: string;
    submission: StudentNoteSubmission;
    aiAnalysis: AIAnalysisResult;
  }> {
    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('studentId', params.studentId);
    formData.append('studentName', params.studentName);
    if (params.studentEmail) formData.append('studentEmail', params.studentEmail);
    if (params.studentCollege) formData.append('studentCollege', params.studentCollege);
    if (params.subjectHint) formData.append('subject', params.subjectHint);
    if (params.titleHint) formData.append('title', params.titleHint);
    if (params.topic) formData.append('topic', params.topic);
    if (params.semester) formData.append('semester', params.semester);
    if (params.branch) formData.append('branch', params.branch);
    if (params.language) formData.append('language', params.language);
    if (params.difficultyLevel) formData.append('difficultyLevel', params.difficultyLevel);
    if (params.extractedText) formData.append('extractedText', params.extractedText);

    const resp = await fetch('/api/marketplace/notes/upload-and-analyze', {
      method: 'POST',
      headers: {
        'x-user-id': params.studentId,
      },
      body: formData,
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Failed to upload and analyze note.');
    }

    const data = await resp.json();
    if (data.success === false && data.error === 'AI_ANALYSIS_FAILED') {
      const err: any = new Error(data.message || 'AI analysis could not be completed.');
      err.submissionId = data.submissionId;
      err.canRetry = true;
      throw err;
    }

    return {
      submissionId: data.submissionId,
      submission: data.submission,
      aiAnalysis: data.submission.aiAnalysis,
    };
  }

  // 3.B Student retries AI analysis for a safely staged submission
  public async retryAnalysis(submissionId: string, studentId: string): Promise<UploadAndAnalyzeResponse> {
    const resp = await fetch(`/api/marketplace/notes/${submissionId}/retry-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': studentId,
      },
      body: JSON.stringify({ studentId }),
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData.message || errData.error || 'Failed to retry AI analysis.');
    }

    const data = await resp.json();
    return {
      submissionId: data.submissionId,
      submission: data.submission,
      aiAnalysis: data.submission.aiAnalysis,
    };
  }

  // 4. Student submits final selling price & declaration -> Server automatic eligibility check and publish
  public async finalizePriceAndPublish(params: FinalizePriceParams): Promise<FinalizePriceResponse> {
    const resp = await fetch(`/api/marketplace/notes/${params.submissionId}/finalize-price-and-publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': params.studentId,
      },
      body: JSON.stringify({
        studentId: params.studentId,
        studentPrice: params.studentPrice,
        currency: params.currency || 'INR',
        rightsDeclarationAccepted: params.rightsDeclarationAccepted,
        listingInfoAccepted: params.listingInfoAccepted,
        customTitle: params.customTitle,
        customDescription: params.customDescription,
        customSubjectId: params.customSubjectId,
        customSubjectName: params.customSubjectName,
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to finalize price and publish.');
    }

    return await resp.json();
  }

  // 5. Get Submission details
  public async getSubmission(id: string): Promise<StudentNoteSubmission> {
    const resp = await apiGet<{ success: boolean; submission: StudentNoteSubmission }>(`/api/marketplace/notes/${id}`);
    return resp.submission;
  }

  // 6. Get student's notes / published notes
  public async getNotes(filter?: { studentId?: string; status?: string; subject?: string; search?: string }): Promise<StudentNoteSubmission[]> {
    const params = new URLSearchParams();
    if (filter?.studentId) params.append('studentId', filter.studentId);
    if (filter?.status) params.append('status', filter.status);
    if (filter?.subject) params.append('subject', filter.subject);
    if (filter?.search) params.append('search', filter.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const resp = await apiGet<{ success: boolean; notes: StudentNoteSubmission[] }>(`/api/marketplace/notes${query}`);
    return resp.notes || [];
  }

  // 7. Admin Submissions review queue
  public async getAdminSubmissions(status?: string, adminId?: string): Promise<StudentNoteSubmission[]> {
    const query = status ? `?status=${status}` : '';
    const resp = await fetch(`/api/admin/marketplace/submissions${query}`, {
      method: 'GET',
      headers: {
        'x-user-role': 'admin',
        'x-user-id': adminId || 'admin',
      },
    });

    if (!resp.ok) {
      return [];
    }
    const data = await resp.json();
    return data.submissions || [];
  }

  // 8. Admin moderate submission
  public async moderateSubmission(
    id: string,
    action: 'APPROVE_PUBLISH' | 'REJECT',
    reason?: string,
    adminId?: string
  ): Promise<boolean> {
    const resp = await fetch(`/api/admin/marketplace/submissions/${id}/moderate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'admin',
        'x-user-id': adminId || 'admin',
      },
      body: JSON.stringify({ action, reason }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to moderate submission.');
    }
    const data = await resp.json();
    return data.success;
  }

  public async getAllSubmissions(adminId?: string): Promise<StudentNoteSubmission[]> {
    return this.getAdminSubmissions(undefined, adminId);
  }

  public async adminApproveSubmission(id: string, adminId?: string): Promise<boolean> {
    return this.moderateSubmission(id, 'APPROVE_PUBLISH', undefined, adminId);
  }
}

export const marketplaceService = new MarketplaceService();
