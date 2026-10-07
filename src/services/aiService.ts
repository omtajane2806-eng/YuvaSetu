import {
  AIConversation,
  AIMessage,
  AIContext,
  AISourceReference,
  StructuredAIContent,
  AIQuizQuestion,
  AIQuizAttempt,
  AIUsageRecord,
  AIFeedbackRecord,
  AdminAISettings,
  AIStatsOverview,
  AIQuestionDifficulty,
} from '../types/ai';
import { contentService } from './contentService';
import { activityService } from './activityService';
import { ContentItem } from '../types/content';

const AI_CONVERSATIONS_KEY = 'vidyasetu_ai_conversations_v2';
const AI_MESSAGES_KEY = 'vidyasetu_ai_messages_v2';
const AI_USAGE_KEY = 'vidyasetu_ai_usage_v2';
const AI_FEEDBACK_KEY = 'vidyasetu_ai_feedback_v2';
const AI_SETTINGS_KEY = 'vidyasetu_admin_ai_settings_v2';
const AI_QUIZ_ATTEMPTS_KEY = 'vidyasetu_ai_quiz_attempts_v2';

const DEFAULT_AI_SETTINGS: AdminAISettings = {
  aiEnabled: true,
  model: 'gemini-3.7-flash',
  maxResponseLength: 1200,
  sourceGroundedMode: true,
  generalKnowledgeFallback: true,
  usageLogging: true,
  educationSafetyEnforced: true,
  lastUpdated: new Date().toISOString(),
  updatedBy: 'Om Tajane (Admin)',
};

class AIService {
  // ==========================================
  // 1. ADMIN SETTINGS
  // ==========================================
  public getAdminSettings(): AdminAISettings {
    try {
      const data = localStorage.getItem(AI_SETTINGS_KEY);
      if (!data) {
        localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(DEFAULT_AI_SETTINGS));
        return DEFAULT_AI_SETTINGS;
      }
      return { ...DEFAULT_AI_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_AI_SETTINGS;
    }
  }

  public updateAdminSettings(settings: Partial<AdminAISettings>, adminName: string = 'Admin'): AdminAISettings {
    const current = this.getAdminSettings();
    const updated: AdminAISettings = {
      ...current,
      ...settings,
      lastUpdated: new Date().toISOString(),
      updatedBy: adminName,
    };
    try {
      localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save AI settings', e);
    }
    return updated;
  }

  // ==========================================
  // 2. CONVERSATION MANAGEMENT (STUDENT PRIVACY)
  // ==========================================
  private getStoredConversations(): AIConversation[] {
    try {
      const data = localStorage.getItem(AI_CONVERSATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveStoredConversations(convs: AIConversation[]): void {
    try {
      localStorage.setItem(AI_CONVERSATIONS_KEY, JSON.stringify(convs));
    } catch (e) {
      console.error('Failed to save AI conversations', e);
    }
  }

  private getStoredMessages(): AIMessage[] {
    try {
      const data = localStorage.getItem(AI_MESSAGES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveStoredMessages(msgs: AIMessage[]): void {
    try {
      localStorage.setItem(AI_MESSAGES_KEY, JSON.stringify(msgs));
    } catch (e) {
      console.error('Failed to save AI messages', e);
    }
  }

  // Strict Student-Scoped Conversations list
  public getStudentConversations(studentId: string): AIConversation[] {
    const all = this.getStoredConversations();
    return all
      .filter((c) => c.student_id === studentId)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  // Get single conversation with privacy check
  public getConversationById(conversationId: string, studentId: string): AIConversation | undefined {
    const all = this.getStoredConversations();
    const found = all.find((c) => c.id === conversationId);
    if (!found) return undefined;
    // Privacy check
    if (found.student_id !== studentId) {
      console.warn('Access denied: Conversation belongs to another student');
      return undefined;
    }
    return found;
  }

  // Create new conversation
  public createConversation(
    studentId: string,
    studentName: string,
    title: string,
    context?: AIContext
  ): AIConversation {
    const all = this.getStoredConversations();
    const newConv: AIConversation = {
      id: `ai-conv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      student_id: studentId,
      student_name: studentName,
      title: title || 'Educational Discussion',
      material_id: context?.material_id,
      material_title: context?.material_title,
      subject_name: context?.subject_name,
      topic: context?.topic,
      section_id: context?.section_id,
      page_number: context?.page_number,
      last_message_preview: '',
      message_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    all.unshift(newConv);
    this.saveStoredConversations(all);
    return newConv;
  }

  // Delete conversation (Student privacy enforced)
  public deleteConversation(conversationId: string, studentId: string): boolean {
    const all = this.getStoredConversations();
    const target = all.find((c) => c.id === conversationId);
    if (!target || target.student_id !== studentId) return false;

    const filtered = all.filter((c) => c.id !== conversationId);
    this.saveStoredConversations(filtered);

    // Also delete associated messages
    const allMsgs = this.getStoredMessages();
    const filteredMsgs = allMsgs.filter((m) => m.conversation_id !== conversationId);
    this.saveStoredMessages(filteredMsgs);

    return true;
  }

  // Get messages for a conversation (Student privacy enforced)
  public getMessages(conversationId: string, studentId: string): AIMessage[] {
    const conv = this.getConversationById(conversationId, studentId);
    if (!conv) return [];

    const all = this.getStoredMessages();
    return all
      .filter((m) => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  // Append user or assistant message
  public addMessage(
    conversationId: string,
    studentId: string,
    role: 'user' | 'assistant',
    content: string,
    structured?: StructuredAIContent,
    sourceContext?: AISourceReference
  ): AIMessage {
    const conv = this.getConversationById(conversationId, studentId);
    const newMsg: AIMessage = {
      id: `ai-msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      conversation_id: conversationId,
      role,
      content,
      structured,
      sourceContext,
      created_at: new Date().toISOString(),
    };

    const allMsgs = this.getStoredMessages();
    allMsgs.push(newMsg);
    this.saveStoredMessages(allMsgs);

    // Update conversation metadata
    if (conv) {
      const allConvs = this.getStoredConversations();
      const idx = allConvs.findIndex((c) => c.id === conversationId);
      if (idx !== -1) {
        allConvs[idx].updated_at = new Date().toISOString();
        allConvs[idx].message_count = (allConvs[idx].message_count || 0) + 1;
        allConvs[idx].last_message_preview = content.slice(0, 80);
        if (allConvs[idx].message_count <= 2 && role === 'user') {
          allConvs[idx].title = content.length > 40 ? `${content.slice(0, 40)}...` : content;
        }
        this.saveStoredConversations(allConvs);
      }
    }

    return newMsg;
  }

  // ==========================================
  // 3. SOURCE CHUNKING & RETRIEVAL ENGINE
  // ==========================================
  public retrieveSourceContext(
    materialId: string,
    query: string
  ): {
    found: boolean;
    reference?: AISourceReference;
    relevantChunk?: string;
    sectionTitle?: string;
    pageNumber?: number;
  } {
    const item = contentService.getContentById(materialId, true);
    if (!item) {
      return { found: false };
    }

    const q = query.toLowerCase();
    const searchTerms = q
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    // Case A: Real PDF Pages available (e.g. Searching and Sorting 40 pages, Hashing 25 pages)
    if (item.pdf_data && item.pdf_data.pages && item.pdf_data.pages.length > 0) {
      let bestPage = item.pdf_data.pages[0];
      let maxMatches = -1;

      for (const page of item.pdf_data.pages) {
        let matchCount = 0;
        const pageText = `${page.title} ${page.content} ${(page.keyPoints || []).join(' ')}`.toLowerCase();

        for (const term of searchTerms) {
          if (pageText.includes(term)) {
            matchCount += 2;
          }
        }
        if (page.title.toLowerCase().includes(q) || pageText.includes(q)) {
          matchCount += 10;
        }

        if (matchCount > maxMatches) {
          maxMatches = matchCount;
          bestPage = page;
        }
      }

      const hasRelevantContent = maxMatches > 0;
      return {
        found: hasRelevantContent,
        sectionTitle: bestPage.title,
        pageNumber: bestPage.pageNumber,
        relevantChunk: bestPage.content,
        reference: {
          materialId: item.id,
          materialTitle: item.title,
          subjectName: item.subject_name,
          section: bestPage.title,
          pageNumber: bestPage.pageNumber,
          snippet: bestPage.content.slice(0, 180) + '...',
          isGeneralKnowledge: !hasRelevantContent,
        },
      };
    }

    // Case B: Digital Notes or text content
    if (item.content_body) {
      const sections = item.content_body.split(/(?=\n##?\s)/g);
      let bestSection = sections[0] || item.content_body;
      let maxMatches = -1;

      for (const sec of sections) {
        let matchCount = 0;
        const secText = sec.toLowerCase();
        for (const term of searchTerms) {
          if (secText.includes(term)) matchCount += 1;
        }
        if (secText.includes(q)) matchCount += 5;

        if (matchCount > maxMatches) {
          maxMatches = matchCount;
          bestSection = sec;
        }
      }

      const lines = bestSection.trim().split('\n');
      const headerLine = lines[0].replace(/^#+\s*/, '');
      const hasRelevantContent = maxMatches > 0;

      return {
        found: hasRelevantContent,
        sectionTitle: headerLine || item.topic || item.title,
        relevantChunk: bestSection,
        reference: {
          materialId: item.id,
          materialTitle: item.title,
          subjectName: item.subject_name,
          section: headerLine || item.topic || 'Core Notes',
          snippet: bestSection.slice(0, 180) + '...',
          isGeneralKnowledge: !hasRelevantContent,
        },
      };
    }

    // Case C: Video without transcript/chapters
    if (item.content_type === 'video' && (!item.video_data?.chapters || item.video_data.chapters.length === 0) && !item.content_body) {
      return {
        found: false,
        reference: {
          materialId: item.id,
          materialTitle: item.title,
          subjectName: item.subject_name,
          uncertaintyNotice: 'AI assistance for this video requires a verified transcript.',
        },
      };
    }

    return {
      found: true,
      sectionTitle: item.topic || item.title,
      relevantChunk: item.description,
      reference: {
        materialId: item.id,
        materialTitle: item.title,
        subjectName: item.subject_name,
        section: item.topic || 'Overview',
        snippet: item.description,
        isGeneralKnowledge: false,
      },
    };
  }

  // ==========================================
  // 4. AI GENERATION: ANSWER QUESTION
  // ==========================================
  public async generateAnswer(
    query: string,
    studentId: string,
    studentName: string,
    studentEmail: string,
    conversationId: string,
    context?: AIContext,
    history: AIMessage[] = []
  ): Promise<{
    message: string;
    structured?: StructuredAIContent;
    sourceReference?: AISourceReference;
  }> {
    const settings = this.getAdminSettings();
    if (!settings.aiEnabled) {
      return {
        message: 'YuvaSetu AI is currently paused for maintenance by administrators. Please try again shortly.',
      };
    }

    const qLower = query.toLowerCase();

    // Safety check: Assignment / Plagiarism
    if (
      qLower.includes('assignment answer') ||
      qLower.includes('write my assignment') ||
      qLower.includes('submit directly') ||
      qLower.includes('cheat on exam')
    ) {
      return {
        message:
          'I can help you understand the core concepts or build a structured revision outline so you can confidently write your own original answers. Let’s break down the problem together!',
        structured: {
          shortAnswer: 'YuvaSetu encourages original learning and problem-solving (Samajh Se Safalta Tak).',
          keyTakeaway: 'Focus on understanding step-by-step logic and foundational principles rather than copying direct solutions.',
        },
      };
    }

    // 1. Check if we have source material context
    let sourceRef: AISourceReference | undefined = undefined;
    let relevantText = '';
    let isSourceGrounded = false;

    if (context && context.material_id) {
      const retrieval = this.retrieveSourceContext(context.material_id, query);
      if (retrieval.found && retrieval.reference) {
        sourceRef = retrieval.reference;
        relevantText = retrieval.relevantChunk || '';
        isSourceGrounded = true;
      } else {
        // Honest uncertainty
        if (settings.generalKnowledgeFallback) {
          sourceRef = {
            materialId: context.material_id,
            materialTitle: context.material_title,
            isGeneralKnowledge: true,
            uncertaintyNotice: `I couldn't find enough specific information about this topic in the selected material "${context.material_title}". Providing a general foundational explanation below:`,
          };
        } else {
          return {
            message: `I couldn't find enough information about this topic in the selected YuvaSetu study material ("${context.material_title}").`,
            sourceReference: {
              materialId: context.material_id,
              materialTitle: context.material_title,
              uncertaintyNotice: 'Topic not covered in selected source.',
            },
          };
        }
      }
    }

    // 2. Synthesize pedagogical response (Attempts server-side Gemini API proxy, falls back to pedagogical synthesis)
    let structuredResponse = this.synthesizeResponse(query, context, relevantText, isSourceGrounded);

    try {
      const baseApi = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const response = await fetch(`${baseApi}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          studentName,
          context,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.message) {
          // If server provided structured data or message, enhance the response
          if (data.source === 'gemini-3.7-flash') {
            structuredResponse = {
              explanation: data.message,
              keyTakeaway: 'Mastering the fundamental logic allows intuitive problem solving across variations.',
            };
          }
        }
      }
    } catch {
      // Graceful fallback to client-side pedagogical synthesis
    }

    // 3. Log usage and activity
    this.logUsage(
      studentId,
      conversationId,
      'chat',
      isSourceGrounded,
      context?.material_id,
      context?.material_title
    );

    activityService.logAIQuestionAsked(
      studentId,
      studentName,
      studentEmail,
      query,
      conversationId,
      context?.material_id,
      context?.material_title,
      context?.subject_name
    );

    activityService.logAIAnswerGenerated(
      studentId,
      studentName,
      studentEmail,
      conversationId,
      isSourceGrounded,
      context?.material_id,
      context?.material_title,
      context?.subject_name
    );

    return {
      message: structuredResponse.explanation || 'Here is your conceptual explanation from YuvaSetu AI:',
      structured: structuredResponse,
      sourceReference: sourceRef,
    };
  }

  // ==========================================
  // 5. SYNTHESIS ENGINE (STRUCTURED 4-TIER)
  // ==========================================
  private synthesizeResponse(
    query: string,
    context?: AIContext,
    sourceText?: string,
    isSourceGrounded: boolean = false
  ): StructuredAIContent {
    const q = query.toLowerCase();

    // Check specific topics
    if (q.includes('binary search')) {
      return {
        shortAnswer:
          'Binary Search is an efficient O(log n) searching algorithm that operates on sorted arrays by repeatedly dividing the search interval in half.',
        explanation:
          'Binary Search compares the target element with the middle element of the array. If the target equals the mid element, the index is returned. If the target is smaller, the search continues in the left half (`high = mid - 1`). If the target is larger, it continues in the right half (`low = mid + 1`).',
        keyConcepts: [
          'Precondition: Array must strictly be sorted in ascending or descending order.',
          'Divide and Conquer: Halves the search space on each comparison.',
          'Pointers: Maintained via `low`, `high`, and `mid = low + (high - low) / 2`.',
        ],
        definitions: [
          { term: 'Search Space', definition: 'The active range of indices `[low...high]` where the target might reside.' },
          { term: 'Mid Calculation', definition: '`mid = low + (high - low)/2` to prevent 32-bit integer overflow.' },
        ],
        example:
          'Given sorted array `[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]` and Target = 23:\n1. low=0, high=9 → mid=4 (val=16). 23 > 16, so low=5.\n2. low=5, high=9 → mid=7 (val=56). 23 < 56, so high=6.\n3. low=5, high=6 → mid=5 (val=23). 23 == 23 → Found at Index 5 in 3 steps!',
        keyTakeaway:
          'Time Complexity: Best Case O(1), Average & Worst Case O(log₂ n). Space Complexity: Iterative O(1), Recursive O(log n) call stack.',
        examPoints: [
          'Why binary search requires a sorted array: It relies on monotonicity to discard half the elements safely.',
          'Always mention the integer overflow safe formula `low + (high - low)/2` in semester exams.',
        ],
        suggestedFollowUps: [
          'Why does Binary Search need a sorted array?',
          'How does Binary Search compare to Linear Search in worst case?',
          'What is the recurrence relation for Binary Search?',
        ],
      };
    }

    if (q.includes('hashing') || q.includes('collision') || q.includes('linear probing')) {
      return {
        shortAnswer:
          'Hashing maps arbitrary keys to fixed-size array indices in O(1) average time using a hash function, with collision resolution mechanisms like Linear Probing and Chaining.',
        explanation:
          'When two distinct keys produce the same hash value `h(k1) == h(k2)`, a collision occurs. In Open Addressing (Linear Probing), the algorithm systematically probes consecutive slots `(h(k) + i) mod m` until an empty bucket is found.',
        keyConcepts: [
          'Hash Function: `h(k) = k mod m` where m is preferably a prime number.',
          'Load Factor (λ): Ratio of elements `n` to table size `m` (`λ = n/m`).',
          'Primary Clustering: In Linear Probing, long runs of occupied slots increase search times.',
        ],
        definitions: [
          { term: 'Synonym', definition: 'Two or more distinct keys that map to the exact same hash address.' },
          { term: 'Probe', definition: 'Each inspection or access of a hash table slot during search/insertion.' },
        ],
        example:
          'Table size m = 7. Insert keys 10, 17, 24:\n• 10 mod 7 = 3 → Stored at Index 3\n• 17 mod 7 = 3 (Collision!) → Probes Index 4 → Stored at Index 4\n• 24 mod 7 = 3 (Collision!) → Probes 4, then Index 5 → Stored at Index 5.',
        keyTakeaway:
          'Linear Probing is cache-friendly due to spatial locality, but suffers from primary clustering when load factor λ exceeds 0.7.',
        examPoints: [
          'Formula: `h(k, i) = (h(k) + i) mod m` for Linear Probing.',
          'Rehashing is triggered when load factor λ exceeds a threshold (commonly 0.75), doubling table size to a new prime.',
        ],
        suggestedFollowUps: [
          'What is the difference between Linear Probing and Quadratic Probing?',
          'How does Separate Chaining handle collisions?',
          'What is Rehashing and when is it triggered?',
        ],
      };
    }

    if (q.includes('merge sort') || q.includes('quick sort')) {
      return {
        shortAnswer:
          'Merge Sort (O(n log n) stable divide-and-conquer) splits arrays in halves and merges them, while Quick Sort (O(n log n) average, O(n²) worst in-place) partitions around a pivot.',
        explanation:
          'Merge Sort divides the array into two equal halves recursively until single-element arrays remain, then merges sorted subarrays in O(n) time per level across log n levels. Quick Sort chooses a pivot element and rearranges elements so smaller items are left and larger are right.',
        keyConcepts: [
          'Merge Sort: Divide step is O(1), Combine step is O(n). Guaranteed O(n log n) always.',
          'Quick Sort: Divide/Partition step is O(n), Combine step is O(1). In-place with O(log n) stack space.',
          'Stability: Merge Sort is stable; Quick Sort is unstable.',
        ],
        keyTakeaway:
          'Merge Sort is ideal for Linked Lists and external sorting; Quick Sort is faster in practice for arrays due to cache efficiency and smaller constant factors.',
        examPoints: [
          'Recurrence: Merge Sort `T(n) = 2T(n/2) + O(n)` → O(n log n).',
          'Quick Sort worst-case occurs when the array is already sorted or reverse sorted with end pivot: `T(n) = T(n-1) + O(n)` → O(n²).',
        ],
        suggestedFollowUps: [
          'Why is Merge Sort preferred for Linked Lists?',
          'How does randomized pivot prevent Quick Sort worst case?',
          'Can you trace Merge Sort step-by-step on `[38, 27, 43, 3, 9, 82, 10]`?',
        ],
      };
    }

    // Default contextual synthesis
    const topicLabel = context?.topic || context?.material_title || 'Core Subject Principles';
    return {
      shortAnswer: `Based on YuvaSetu ${topicLabel}: Here is the core explanation of "${query.replace(/^[?\s]+|[?\s]+$/g, '')}".`,
      explanation: sourceText
        ? `From the study material: ${sourceText.slice(0, 300)}...`
        : `This concept is anchored in the foundational principles of ${context?.subject_name || 'Engineering & Computer Science'}. Breaking it down into core steps ensures permanent conceptual understanding without rote memorization.`,
      keyConcepts: [
        `Anchor to First Principles: Understand the fundamental definitions and structural boundaries.`,
        `Mechanism: Trace how inputs transform step-by-step into output states.`,
        `Optimization: Assess time, space, and edge-case behaviors under peak loads.`,
      ],
      definitions: [
        { term: 'Core Entity', definition: 'The primary computational or mathematical structure involved.' },
        { term: 'Operational Invariant', definition: 'The condition that remains true across every iteration.' },
      ],
      keyTakeaway:
        'Focus on understanding why the algorithmic or mathematical principle works rather than memorizing formulas.',
      examPoints: [
        'Always write definition, state boundary conditions, and provide a small tracing example for full exam marks.',
      ],
      suggestedFollowUps: [
        'Can you summarize the key definitions for exams?',
        'Generate 5 practice quiz questions on this topic',
        'Create concise revision notes for this material',
      ],
    };
  }

  // ==========================================
  // 6. SUMMARIZE STUDY MATERIAL
  // ==========================================
  public async summarizeMaterial(
    materialId: string,
    studentId: string,
    studentName: string,
    studentEmail: string
  ): Promise<{
    title: string;
    summary: string;
    keyConcepts: string[];
    importantDefinitions: Array<{ term: string; definition: string }>;
    examPoints: string[];
  }> {
    const item = contentService.getContentById(materialId, true);
    const title = item ? item.title : 'Study Material';
    const subject = item ? item.subject_name : 'General';

    let summaryText = '';
    let concepts: string[] = [];
    let defs: Array<{ term: string; definition: string }> = [];
    let examPts: string[] = [];

    if (item && item.id.includes('searching-sorting')) {
      summaryText =
        'Comprehensive curriculum coverage of Search and Sort paradigms in Data Structures. Covers asymptotic growth notations (Big-O, Omega, Theta), sequential linear searches, logarithmic binary searches, comparison-based quadratic sorting (Selection, Bubble, Insertion), and logarithmic divide-and-conquer sorting (Merge Sort, Quick Sort) with full recurrence relations and stability classifications.';
      concepts = [
        'Asymptotic Analysis: Big-O represents upper bound (worst case), Omega represents lower bound (best case), Theta represents tight bound.',
        'Binary Search Monotonicity: Requires strictly ordered data; achieves O(log n) efficiency by discarding half the remaining search space per step.',
        'Sorting Classifications: Internal vs External sorting, In-place vs Out-of-place, Stable vs Unstable sorting.',
        'Divide and Conquer: Recursive partitioning into independent subproblems, solved and recombined (Merge Sort & Quick Sort).',
      ];
      defs = [
        { term: 'Linear Search', definition: 'Sequential scanning of elements from index 0 to n-1 with O(n) worst-case time.' },
        { term: 'Binary Search', definition: 'Divide-and-conquer search on sorted arrays comparing target with middle index in O(log n) time.' },
        { term: 'Stable Sort', definition: 'A sorting algorithm that preserves the relative order of duplicate keys (e.g. Merge Sort, Insertion Sort).' },
        { term: 'Pivot Element', definition: 'The chosen reference value in Quick Sort around which the array is partitioned.' },
      ];
      examPts = [
        'State recurrence relations: Merge Sort T(n) = 2T(n/2) + O(n) = O(n log n); Quick Sort Worst Case T(n) = T(n-1) + O(n) = O(n²).',
        'Compare Space Complexities: Selection/Bubble/Insertion = O(1); Quick Sort = O(log n); Merge Sort = O(n).',
        'Know the difference between In-place sorting vs Stable sorting with examples.',
      ];
    } else if (item && item.id.includes('hashing')) {
      summaryText =
        'Curriculum notes on Hash Tables, Hash Functions, and Collision Resolution. Explains O(1) direct access intuition, Hash Function design criteria (Division, Multiplication, Folding, Mid-Square), Load Factor metrics, and detailed comparisons between Open Addressing (Linear Probing, Quadratic Probing, Double Hashing) and Separate Chaining with dynamic Rehashing mechanisms.';
      concepts = [
        'Hash Function Mapping: Compresses large or string keys into valid table index ranges `0 <= h(k) < m`.',
        'Load Factor λ: Defined as `λ = n / m`. Determines average probe length and performance degradation.',
        'Open Addressing vs Chaining: Open addressing stores all elements inside table slots; Chaining maintains external linked lists.',
        'Rehashing: Dynamic resizing when load factor λ exceeds threshold, allocating a larger prime-sized table.',
      ];
      defs = [
        { term: 'Hash Table', definition: 'An associative data structure mapping keys to values using hash computations.' },
        { term: 'Collision', definition: 'Event when two different keys evaluate to the exact same hash address.' },
        { term: 'Linear Probing', definition: 'Open addressing probing sequence `h(k, i) = (h(k) + i) mod m` searching sequential slots.' },
        { term: 'Quadratic Probing', definition: 'Probing sequence `h(k, i) = (h(k) + c1*i + c2*i²) mod m` to eliminate primary clustering.' },
      ];
      examPts = [
        'Write the 3 primary collision resolution techniques: Separate Chaining, Linear Probing, Quadratic Probing, Double Hashing.',
        'Explain why table size `m` should be chosen as a Prime number (minimizes common factors with key distributions).',
        'Know the time complexity: O(1) Average Search/Insert/Delete; O(n) Worst-case when all keys collide into a single chain.',
      ];
    } else {
      summaryText = item?.description || 'Curriculum summary of key concepts, definitions, and exam points.';
      concepts = [
        'Core Mathematical & Algorithmic foundations.',
        'Step-by-step problem-solving workflow and boundary analysis.',
        'Practical real-world applications and system implementation trade-offs.',
      ];
      defs = [
        { term: item?.topic || 'Primary Entity', definition: 'The main concept explored throughout this study unit.' },
      ];
      examPts = ['Focus on definitions, diagrams, time/space complexity, and clean code examples.'];
    }

    // Log Activity
    activityService.logAISummaryGenerated(
      studentId,
      studentName,
      studentEmail,
      materialId,
      title,
      subject
    );

    return {
      title: `Curriculum Summary: ${title}`,
      summary: summaryText,
      keyConcepts: concepts,
      importantDefinitions: defs,
      examPoints: examPts,
    };
  }

  // ==========================================
  // 7. CREATE REVISION NOTES
  // ==========================================
  public async createRevisionNotes(
    materialId: string,
    studentId: string,
    studentName: string,
    studentEmail: string
  ): Promise<{
    topic: string;
    importantConcepts: string[];
    definitions: Array<{ term: string; meaning: string }>;
    formulas: string[];
    examples: string[];
    commonMistakes: string[];
    quickRevision: string[];
  }> {
    const item = contentService.getContentById(materialId, true);
    const topic = item?.topic || item?.title || 'Data Structures & Algorithms';

    if (materialId.includes('searching-sorting')) {
      return {
        topic: 'DSA Searching and Sorting (Quick Revision)',
        importantConcepts: [
          'Linear Search: Unsorted array, O(n) time, O(1) space.',
          'Binary Search: Sorted array, O(log n) time, O(1) space.',
          'Selection Sort: Finds minimum and places at start; O(n²) all cases; O(1) space; Unstable.',
          'Bubble Sort: Adjacent swaps; O(n²) worst, O(n) best if optimized with flag; Stable.',
          'Insertion Sort: Builds sorted subarray; O(n²) worst, O(n) best on nearly sorted; Stable.',
          'Merge Sort: Divide and conquer; O(n log n) all cases; O(n) auxiliary space; Stable.',
          'Quick Sort: Partition around pivot; O(n log n) average, O(n²) worst; In-place.',
        ],
        definitions: [
          { term: 'Monotonicity', meaning: 'A non-decreasing or non-increasing sequence property required for binary search.' },
          { term: 'In-Place Algorithm', meaning: 'Uses O(1) extra space beyond the input data representation.' },
          { term: 'Algorithm Stability', meaning: 'Maintains original relative order of items with identical key values.' },
        ],
        formulas: [
          'Binary Search Mid: mid = low + (high - low) / 2',
          'Merge Sort Recurrence: T(n) = 2T(n/2) + cn = O(n log n)',
          'Quick Sort Worst Case: T(n) = T(n-1) + cn = O(n²)',
          'Bubble/Selection comparisons: n(n - 1) / 2 = O(n²)',
        ],
        examples: [
          'Binary search on [3, 9, 14, 19, 25, 31, 42] searching 25: 1st mid=19, 2nd mid=31, 3rd mid=25 → Found in 3 comparisons!',
          'Merge sort divides [8, 4, 5, 1] into [8, 4] and [5, 1] → sorts to [4, 8] and [1, 5] → merges to [1, 4, 5, 8].',
        ],
        commonMistakes: [
          'Using (low + high) / 2 instead of low + (high - low) / 2 (causes 32-bit integer overflow in large arrays).',
          'Forgetting that Binary Search CANNOT run on unsorted arrays without prior O(n log n) sorting.',
          'Assuming Quick Sort is always O(n log n) — worst case is O(n²) when pivot creates 0 and n-1 partitions.',
        ],
        quickRevision: [
          'Fastest search on sorted array: Binary Search (O(log n)).',
          'Fastest general internal sort: Quick Sort (average O(n log n)).',
          'Guaranteed O(n log n) sort with stability: Merge Sort.',
          'Best sort for nearly sorted array: Insertion Sort (O(n)).',
        ],
      };
    }

    // Default revision notes
    return {
      topic: `${topic} — Revision Notes`,
      importantConcepts: [
        'Understand foundational definition and classification.',
        'Trace operational complexity under best, average, and worst conditions.',
        'Review edge cases: empty structures, single elements, duplicates, and boundaries.',
      ],
      definitions: [
        { term: 'Primary Definition', meaning: 'The standardized definition specified in university syllabus.' },
        { term: 'Asymptotic Constraint', meaning: 'Upper and lower performance envelope.' },
      ],
      formulas: ['Complexity: O(n log n) vs O(n) vs O(1)'],
      examples: ['Step 1: Input → Step 2: Intermediate state → Step 3: Verified output.'],
      commonMistakes: [
        'Ignoring boundary checks (off-by-one errors in loop conditions).',
        'Confusing average-case time with worst-case upper bound.',
      ],
      quickRevision: [
        'Master the core algorithm tracing before exams.',
        'Memorize complexity chart and space requirements.',
      ],
    };
  }

  // ==========================================
  // 8. PRACTICE QUESTIONS & QUIZ GENERATION
  // ==========================================
  public async generatePracticeQuestions(
    materialId: string | undefined,
    count: number = 5,
    difficulty: AIQuestionDifficulty = 'medium',
    topicParam?: string,
    studentId?: string,
    studentName?: string,
    studentEmail?: string
  ): Promise<AIQuizQuestion[]> {
    const item = materialId ? contentService.getContentById(materialId, true) : undefined;
    const topic = topicParam || item?.topic || item?.title || 'Data Structures & Algorithms';

    let pool: AIQuizQuestion[] = [];

    if (!materialId || materialId.includes('searching-sorting') || topic.toLowerCase().includes('search')) {
      pool = [
        {
          id: 'q-dsa-1',
          question: 'What is the worst-case time complexity of Binary Search on a sorted array of size n?',
          type: 'mcq',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
          correctAnswer: 'O(log n)',
          explanation: 'Binary Search halves the remaining search space on every comparison step, leading to log₂(n) levels and O(log n) worst-case time complexity.',
          topic: 'Binary Search',
          difficulty: 'easy',
          sourceReference: 'DSA Searching and Sorting (Page 21)',
        },
        {
          id: 'q-dsa-2',
          question: 'Which formula correctly prevents 32-bit integer overflow when calculating the midpoint index in Binary Search?',
          type: 'mcq',
          options: [
            'mid = (low + high) / 2',
            'mid = low + (high - low) / 2',
            'mid = (low * high) / 2',
            'mid = high - (low + high) / 2',
          ],
          correctAnswer: 'mid = low + (high - low) / 2',
          explanation: 'When low and high are large numbers near 2^31 - 1, `(low + high)` exceeds maximum integer range and becomes negative. `low + (high - low) / 2` avoids the overflow.',
          topic: 'Binary Search Implementation',
          difficulty: 'medium',
          sourceReference: 'DSA Searching and Sorting (Page 22)',
        },
        {
          id: 'q-dsa-3',
          question: 'Which of the following sorting algorithms is GUARANTEED to run in O(n log n) time in all cases (Best, Average, and Worst)?',
          type: 'mcq',
          options: ['Quick Sort', 'Merge Sort', 'Bubble Sort', 'Selection Sort'],
          correctAnswer: 'Merge Sort',
          explanation: 'Merge Sort always divides the array into two equal halves (log n levels) and performs O(n) merge work per level, guaranteeing O(n log n) time in all cases.',
          topic: 'Merge Sort',
          difficulty: 'medium',
          sourceReference: 'DSA Searching and Sorting (Page 34)',
        },
        {
          id: 'q-dsa-4',
          question: 'What is the worst-case time complexity of Quick Sort, and under what condition does it occur?',
          type: 'mcq',
          options: [
            'O(n log n) when the array is unsorted',
            'O(n²) when the array is already sorted and the pivot is chosen as the last element',
            'O(n) when all elements are identical',
            'O(log n) when the pivot divides the array equally',
          ],
          correctAnswer: 'O(n²) when the array is already sorted and the pivot is chosen as the last element',
          explanation: 'If the array is already sorted and the last element is chosen as pivot, the partition produces subproblems of size 0 and n-1, resulting in recurrence T(n) = T(n-1) + O(n) = O(n²).',
          topic: 'Quick Sort Partitioning',
          difficulty: 'hard',
          sourceReference: 'DSA Searching and Sorting (Page 37)',
        },
        {
          id: 'q-dsa-5',
          question: 'Which sorting algorithm is most efficient for an array that is ALREADY nearly sorted (only a few elements out of order)?',
          type: 'mcq',
          options: ['Selection Sort', 'Insertion Sort', 'Quick Sort', 'Radix Sort'],
          correctAnswer: 'Insertion Sort',
          explanation: 'Insertion Sort only needs O(n) time for nearly sorted arrays because elements require at most a constant number of shifts to reach their final positions.',
          topic: 'Insertion Sort',
          difficulty: 'easy',
          sourceReference: 'DSA Searching and Sorting (Page 30)',
        },
        {
          id: 'q-dsa-6',
          question: 'What is the auxiliary space complexity of standard Merge Sort on arrays?',
          type: 'mcq',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctAnswer: 'O(n)',
          explanation: 'Standard array Merge Sort requires an auxiliary array of size O(n) to merge the two sorted halves.',
          topic: 'Merge Sort Complexity',
          difficulty: 'medium',
          sourceReference: 'DSA Searching and Sorting (Page 35)',
        },
        {
          id: 'q-dsa-7',
          question: 'A sorting algorithm is called "STABLE" if it:',
          type: 'mcq',
          options: [
            'Does not require extra memory',
            'Maintains the relative order of elements with equal keys',
            'Has the same best and worst-case time complexity',
            'Sorts the array in place without recursion',
          ],
          correctAnswer: 'Maintains the relative order of elements with equal keys',
          explanation: 'Stability means that if two elements have identical keys (e.g. 5a and 5b), 5a will always appear before 5b in the sorted output if it appeared before 5b in the input.',
          topic: 'Sorting Stability',
          difficulty: 'easy',
          sourceReference: 'DSA Searching and Sorting (Page 26)',
        },
      ];
    } else if (materialId.includes('hashing') || topic.toLowerCase().includes('hash')) {
      pool = [
        {
          id: 'q-hash-1',
          question: 'What is the average-case time complexity for search, insert, and delete operations in a Hash Table?',
          type: 'mcq',
          options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
          correctAnswer: 'O(1)',
          explanation: 'With a uniform hash function and appropriate load factor, hash table lookups, insertions, and deletions execute in constant O(1) average time.',
          topic: 'Hash Table Basics',
          difficulty: 'easy',
          sourceReference: 'DSA Hashing (Page 1)',
        },
        {
          id: 'q-hash-2',
          question: 'How is the Load Factor (λ) of a Hash Table defined?',
          type: 'mcq',
          options: [
            'λ = Number of collisions / Table size',
            'λ = Number of elements stored (n) / Table size (m)',
            'λ = Table size (m) / Number of elements stored (n)',
            'λ = Number of probes / Total keys',
          ],
          correctAnswer: 'λ = Number of elements stored (n) / Table size (m)',
          explanation: 'The load factor λ = n/m represents the average number of elements stored per table slot.',
          topic: 'Load Factor',
          difficulty: 'easy',
          sourceReference: 'DSA Hashing (Page 4)',
        },
        {
          id: 'q-hash-3',
          question: 'What major drawback occurs in Open Addressing when using Linear Probing?',
          type: 'mcq',
          options: [
            'Secondary Clustering',
            'Primary Clustering (formation of long continuous occupied clusters)',
            'Infinite loop during insertion',
            'Memory fragmentation outside the table',
          ],
          correctAnswer: 'Primary Clustering (formation of long continuous occupied clusters)',
          explanation: 'Linear Probing searches consecutive slots `(h(k) + i) mod m`. As consecutive slots become occupied, any key hashing into that neighborhood creates even longer clusters.',
          topic: 'Linear Probing',
          difficulty: 'medium',
          sourceReference: 'DSA Hashing (Page 19)',
        },
        {
          id: 'q-hash-4',
          question: 'In Double Hashing, what is the formula for the probing sequence?',
          type: 'mcq',
          options: [
            'h(k, i) = (h1(k) + i * h2(k)) mod m',
            'h(k, i) = (h1(k) + i²) mod m',
            'h(k, i) = (h1(k) + h2(k)) mod m',
            'h(k, i) = (h1(k) * i) mod m',
          ],
          correctAnswer: 'h(k, i) = (h1(k) + i * h2(k)) mod m',
          explanation: 'Double Hashing uses a secondary hash function h2(k) to determine the step size for collision probes, preventing both primary and secondary clustering.',
          topic: 'Double Hashing',
          difficulty: 'hard',
          sourceReference: 'DSA Hashing (Page 23)',
        },
        {
          id: 'q-hash-5',
          question: 'What is Rehashing in hash tables?',
          type: 'mcq',
          options: [
            'Deleting all keys and resetting the table',
            'Allocating a larger table (usually ~2x prime size) and re-inserting all existing keys using a new hash function',
            'Sorting the keys before inserting',
            'Converting the hash table into a binary search tree',
          ],
          correctAnswer: 'Allocating a larger table (usually ~2x prime size) and re-inserting all existing keys using a new hash function',
          explanation: 'When the load factor exceeds a threshold (e.g. 0.75), Rehashing dynamically doubles table capacity to restore O(1) performance.',
          topic: 'Rehashing',
          difficulty: 'medium',
          sourceReference: 'DSA Hashing (Page 11)',
        },
      ];
    } else {
      // General CS questions
      pool = [
        {
          id: 'q-gen-1',
          question: `What is the primary objective of studying ${topic}?`,
          type: 'mcq',
          options: [
            'Optimizing resource allocation and execution efficiency',
            'Memorizing code without understanding',
            'Avoiding all data validation',
            'Ignoring memory constraints',
          ],
          correctAnswer: 'Optimizing resource allocation and execution efficiency',
          explanation: 'Understanding algorithmic and data foundations enables optimal design with minimal time and space overhead.',
          topic: topic,
          difficulty: 'easy',
        },
        {
          id: 'q-gen-2',
          question: 'Which notation characterizes the tightest bound (both upper and lower) of an algorithm?',
          type: 'mcq',
          options: ['Big-O (O)', 'Big-Omega (Ω)', 'Big-Theta (Θ)', 'Little-o (o)'],
          correctAnswer: 'Big-Theta (Θ)',
          explanation: 'Big-Theta indicates that the running time is bounded from above and below by the same order of growth.',
          topic: 'Asymptotic Analysis',
          difficulty: 'medium',
        },
      ];
    }

    // Filter by difficulty if needed or take requested count
    const selected = pool.slice(0, count);

    // Log Activity
    if (studentId && studentName && studentEmail) {
      activityService.logAIQuizGenerated(
        studentId,
        studentName,
        studentEmail,
        materialId,
        item?.title || topic,
        selected.length,
        difficulty,
        topic
      );
    }

    return selected;
  }

  // ==========================================
  // 9. EVALUATE QUIZ ATTEMPT
  // ==========================================
  public evaluateQuiz(
    studentId: string,
    studentName: string,
    studentEmail: string,
    materialId: string | undefined,
    materialTitle: string,
    topic: string,
    difficulty: AIQuestionDifficulty,
    questions: AIQuizQuestion[],
    userAnswers: Record<string, string>
  ): AIQuizAttempt {
    let score = 0;
    const weakTopicsSet = new Set<string>();

    const answersDetail = questions.map((q) => {
      const userAns = userAnswers[q.id] || '(No Answer)';
      const isCorrect = userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

      if (isCorrect) {
        score += 1;
      } else {
        weakTopicsSet.add(q.topic);
      }

      return {
        questionId: q.id,
        questionText: q.question,
        userAnswer: userAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const percentage = Math.round((score / questions.length) * 100);
    const weakTopics = Array.from(weakTopicsSet);

    // Recommend real published YuvaSetu materials based on weak topics
    const allMaterials = contentService.getAllContent(false);
    const recommendedMaterials = allMaterials
      .filter((m) => {
        if (materialId && m.id === materialId) return false;
        if (weakTopics.some((t) => m.title.toLowerCase().includes(t.toLowerCase()) || m.topic?.toLowerCase().includes(t.toLowerCase()))) {
          return true;
        }
        return m.subject_id === 'dsa' || m.topic === 'Searching and Sorting';
      })
      .slice(0, 3)
      .map((m) => ({
        id: m.id,
        title: m.title,
        subject_name: m.subject_name,
        topic: m.topic || 'General',
      }));

    const attempt: AIQuizAttempt = {
      id: `quiz-att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      student_id: studentId,
      student_name: studentName,
      material_id: materialId,
      material_title: materialTitle,
      topic,
      difficulty,
      questionCount: questions.length,
      score,
      percentage,
      answers: answersDetail,
      weakTopics,
      recommendedMaterials,
      created_at: new Date().toISOString(),
    };

    // Save attempt in localStorage
    try {
      const attemptsData = localStorage.getItem(AI_QUIZ_ATTEMPTS_KEY);
      const existing: AIQuizAttempt[] = attemptsData ? JSON.parse(attemptsData) : [];
      existing.unshift(attempt);
      localStorage.setItem(AI_QUIZ_ATTEMPTS_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to save quiz attempt', e);
    }

    // Log Activity
    activityService.logAIQuizCompleted(
      studentId,
      studentName,
      studentEmail,
      attempt.id,
      score,
      questions.length,
      materialTitle,
      topic
    );

    return attempt;
  }

  // ==========================================
  // 10. CODE EXPLANATION ENGINE
  // ==========================================
  public async explainCode(
    codeSnippet: string,
    materialId?: string
  ): Promise<StructuredAIContent['codeExplanation']> {
    const code = codeSnippet.trim();
    const isBinarySearch = code.toLowerCase().includes('binarysearch') || (code.includes('low') && code.includes('high') && code.includes('mid'));
    const isLinearProbing = code.toLowerCase().includes('hash') || code.toLowerCase().includes('probing');

    if (isBinarySearch) {
      return {
        codeSnippet: code,
        whatItDoes:
          'Performs an iterative Binary Search on a sorted array to locate the index of target key `x` in logarithmic O(log n) time.',
        stepByStepLogic: [
          '1. Initialize `low = 0` and `high = n - 1` spanning the complete array bounds.',
          '2. While `low <= high`, calculate safe midpoint: `mid = low + (high - low) / 2`.',
          '3. Check if `arr[mid] == x`: Return index `mid` immediately.',
          '4. If `arr[mid] < x`: Target must reside in the right subarray; set `low = mid + 1`.',
          '5. If `arr[mid] > x`: Target must reside in the left subarray; set `high = mid - 1`.',
          '6. If the while loop terminates without finding target, return `-1` (Element not present).',
        ],
        variables: [
          { name: 'low', purpose: 'Left boundary pointer of the active search window.' },
          { name: 'high', purpose: 'Right boundary pointer of the active search window.' },
          { name: 'mid', purpose: 'Current candidate index being compared against target.' },
          { name: 'x', purpose: 'The target element value being searched.' },
        ],
        timeComplexity: 'Best Case: O(1) (found at middle on step 1); Worst & Average Case: O(log₂ n).',
        spaceComplexity: 'O(1) Auxiliary Space (Iterative in-place pointer adjustments).',
        edgeCases: [
          'Target element is smaller than arr[0] (returns -1 after log n steps).',
          'Target element is larger than arr[n-1] (returns -1 after log n steps).',
          'Array with 1 element (verifies immediately in 1 step).',
          'Array contains duplicate values (returns any one valid matching index).',
        ],
      };
    }

    if (isLinearProbing) {
      return {
        codeSnippet: code,
        whatItDoes:
          'Implements Hash Table insertion with Linear Probing collision resolution: `index = (h(k) + i) mod m`.',
        stepByStepLogic: [
          '1. Compute initial primary hash index: `index = hash(key) % TABLE_SIZE`.',
          '2. Check if table[index] is empty (or marked deleted): Insert key immediately.',
          '3. If occupied (Collision), increment probe counter `i++` and test `(index + 1) % TABLE_SIZE`.',
          '4. Repeat until an open slot is found or table is fully scanned.',
        ],
        variables: [
          { name: 'key', purpose: 'Value or identifier being stored in the hash table.' },
          { name: 'index', purpose: 'Computed slot index within bounds `0 <= index < TABLE_SIZE`.' },
          { name: 'TABLE_SIZE', purpose: 'Prime integer capacity of the hash table.' },
        ],
        timeComplexity: 'O(1) Average insertion; O(n) Worst case when table is nearly full (Primary Clustering).',
        spaceComplexity: 'O(1) Auxiliary space per insertion.',
        edgeCases: ['Table full (overflow condition requiring dynamic Rehashing).', 'Duplicate key updates.'],
      };
    }

    return {
      codeSnippet: code,
      whatItDoes: 'Educational code routine executing algorithmic state transformations.',
      stepByStepLogic: [
        '1. Ingestion: Reads inputs and initializes working pointers.',
        '2. Transformation: Loops through data maintaining structural invariant.',
        '3. Termination: Returns final computed value or mutated structure.',
      ],
      variables: [{ name: 'input', purpose: 'Primary data parameter passed into routine.' }],
      timeComplexity: 'O(n) linear scan across input size.',
      spaceComplexity: 'O(1) auxiliary space.',
      edgeCases: ['Empty inputs, null pointers, single element arrays.'],
    };
  }

  // ==========================================
  // 11. FORMULA EXPLANATION ENGINE
  // ==========================================
  public explainFormula(formulaText: string): StructuredAIContent['formulaExplanation'] {
    const f = formulaText.trim();
    if (f.includes('mid') || f.includes('low') || f.includes('high')) {
      return {
        formula: 'mid = low + \\frac{high - low}{2}',
        variables: [
          { symbol: 'mid', meaning: 'The calculated midpoint index for array division.' },
          { symbol: 'low', meaning: 'The lower index bound of the search range.' },
          { symbol: 'high', meaning: 'The upper index bound of the search range.' },
        ],
        simpleExplanation:
          'Calculates the middle index between low and high safely without risking arithmetic overflow when low + high exceeds maximum 32-bit integer limits (2,147,483,647).',
        example:
          'If low = 1,000,000,000 and high = 2,000,000,000:\n• (low + high) = 3,000,000,000 (Over integers limit!)\n• low + (high - low)/2 = 1,000,000,000 + 500,000,000 = 1,500,000,000 (Safe and accurate).',
        whenToUse:
          'Always use this formula in all Binary Search, Merge Sort, and Divide-and-Conquer implementations.',
      };
    }

    if (f.includes('lambda') || f.includes('λ') || f.includes('n/m') || f.toLowerCase().includes('load factor')) {
      return {
        formula: '\\lambda = \\frac{n}{m}',
        variables: [
          { symbol: '\\lambda (Lambda)', meaning: 'Load Factor of the Hash Table.' },
          { symbol: 'n', meaning: 'Total number of occupied elements / stored keys.' },
          { symbol: 'm', meaning: 'Total number of available slots / table capacity.' },
        ],
        simpleExplanation:
          'Measures how full the hash table is. When λ approaches 1.0 in Open Addressing, collisions increase exponentially. A load factor of λ <= 0.75 is recommended.',
        example:
          'If a table has m = 100 slots and n = 70 keys are inserted, Load Factor λ = 70 / 100 = 0.70 (70% full).',
        whenToUse:
          'Used to decide when dynamic Rehashing is needed to maintain O(1) performance.',
      };
    }

    return {
      formula: f || 'T(n) = a T(n/b) + f(n)',
      variables: [
        { symbol: 'T(n)', meaning: 'Running time on a problem of size n.' },
        { symbol: 'a', meaning: 'Number of subproblems generated in recursion.' },
        { symbol: 'n/b', meaning: 'Size of each subproblem.' },
      ],
      simpleExplanation: 'Standard algorithmic formula describing computational growth and execution bounds.',
      example: 'Merge Sort: a = 2, b = 2, f(n) = O(n) → T(n) = 2T(n/2) + O(n) = O(n log n).',
      whenToUse: 'Used in Master Theorem analysis to solve divide-and-conquer recurrences.',
    };
  }

  // ==========================================
  // 12. USAGE TRACKING & ANALYTICS
  // ==========================================
  public logUsage(
    studentId: string,
    conversationId?: string,
    operation: AIUsageRecord['operation_type'] = 'chat',
    sourceGrounded: boolean = true,
    materialId?: string,
    materialTitle?: string,
    tokensUsed: number = 150
  ): void {
    const settings = this.getAdminSettings();
    if (!settings.usageLogging) return;

    try {
      const data = localStorage.getItem(AI_USAGE_KEY);
      const records: AIUsageRecord[] = data ? JSON.parse(data) : [];
      const record: AIUsageRecord = {
        id: `ai-use-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        student_id: studentId,
        conversation_id: conversationId,
        operation_type: operation,
        material_id: materialId,
        material_title: materialTitle,
        source_grounded: sourceGrounded,
        tokens_used: tokensUsed,
        created_at: new Date().toISOString(),
      };
      records.push(record);
      localStorage.setItem(AI_USAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to log AI usage', e);
    }
  }

  // Submit Feedback
  public submitFeedback(
    studentId: string,
    studentName: string,
    studentEmail: string,
    messageId: string,
    conversationId: string,
    helpful: boolean,
    reason?: AIFeedbackRecord['reason'],
    comment?: string
  ): void {
    try {
      const data = localStorage.getItem(AI_FEEDBACK_KEY);
      const records: AIFeedbackRecord[] = data ? JSON.parse(data) : [];
      const record: AIFeedbackRecord = {
        id: `ai-fb-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        student_id: studentId,
        message_id: messageId,
        conversation_id: conversationId,
        helpful,
        reason,
        comment,
        created_at: new Date().toISOString(),
      };
      records.push(record);
      localStorage.setItem(AI_FEEDBACK_KEY, JSON.stringify(records));

      // Update message feedback property
      const allMsgs = this.getStoredMessages();
      const msg = allMsgs.find((m) => m.id === messageId);
      if (msg) {
        msg.feedback = {
          helpful,
          reason,
          timestamp: new Date().toISOString(),
        };
        this.saveStoredMessages(allMsgs);
      }

      // Log in Activity event system
      activityService.logAIFeedback(
        studentId,
        studentName,
        studentEmail,
        messageId,
        helpful,
        reason
      );
    } catch (e) {
      console.error('Failed to save AI feedback', e);
    }
  }

  // Get aggregated stats for Admin Analytics (strictly real numbers)
  public getAIStatsOverview(): AIStatsOverview {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {
        totalQuestionsAsked: 0,
        totalConversations: 0,
        totalSummariesGenerated: 0,
        totalQuizzesGenerated: 0,
        totalQuizzesCompleted: 0,
        totalSourceGroundedQueries: 0,
        helpfulCount: 0,
        notHelpfulCount: 0,
        helpfulRatePercent: 100,
        averageQuizScorePercent: 0,
        topSubjects: [],
        questionTypesBreakdown: [],
        topMaterialsAskedAbout: [],
        identifiedWeakTopics: [],
      };
    }
    const convs = this.getStoredConversations();
    const msgs = this.getStoredMessages();
    const usageData = localStorage.getItem(AI_USAGE_KEY);
    const usages: AIUsageRecord[] = usageData ? JSON.parse(usageData) : [];

    const feedbackData = localStorage.getItem(AI_FEEDBACK_KEY);
    const feedbacks: AIFeedbackRecord[] = feedbackData ? JSON.parse(feedbackData) : [];

    const quizData = localStorage.getItem(AI_QUIZ_ATTEMPTS_KEY);
    const quizzes: AIQuizAttempt[] = quizData ? JSON.parse(quizData) : [];

    const userQuestions = msgs.filter((m) => m.role === 'user').length;
    const summariesGenerated = usages.filter((u) => u.operation_type === 'summarize').length;
    const quizzesGenerated = usages.filter((u) => u.operation_type === 'quiz_generate').length;
    const sourceGroundedQueries = usages.filter((u) => u.source_grounded).length;

    const helpfulCount = feedbacks.filter((f) => f.helpful).length;
    const notHelpfulCount = feedbacks.filter((f) => !f.helpful).length;
    const totalFeedbacks = helpfulCount + notHelpfulCount;
    const helpfulRatePercent =
      totalFeedbacks > 0 ? Math.round((helpfulCount / totalFeedbacks) * 100) : 100;

    let totalScore = 0;
    quizzes.forEach((q) => {
      totalScore += q.percentage;
    });
    const avgScore = quizzes.length > 0 ? Math.round(totalScore / quizzes.length) : 0;

    // Top subjects from conversations
    const subjectCounts: Record<string, number> = {};
    convs.forEach((c) => {
      const s = c.subject_name || 'Data Structures & Algorithms';
      subjectCounts[s] = (subjectCounts[s] || 0) + 1;
    });
    const topSubjects = Object.entries(subjectCounts)
      .map(([subject, count]) => ({ subject, count }))
      .sort((a, b) => b.count - a.count);

    // Question Types Breakdown
    const opCounts: Record<string, number> = {
      'concept explanation': 0,
      'code & debug': 0,
      'curriculum summary': summariesGenerated,
      'practice quiz': quizzes.length,
    };
    msgs.filter((m) => m.role === 'user').forEach((m) => {
      const text = m.content.toLowerCase();
      if (text.includes('code') || text.includes('error') || text.includes('bug') || text.includes('implement')) {
        opCounts['code & debug']++;
      } else {
        opCounts['concept explanation']++;
      }
    });
    const totalOps = Object.values(opCounts).reduce((a, b) => a + b, 0) || 1;
    const questionTypesBreakdown = Object.entries(opCounts).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / totalOps) * 100),
    }));

    // Top Grounded Study Materials Asked About
    const materialQueriesMap: Record<string, number> = {};
    convs.forEach((c) => {
      const title = c.material_title || (c.material_id ? `Study Material (${c.material_id})` : null);
      if (title) {
        materialQueriesMap[title] = (materialQueriesMap[title] || 0) + (c.message_count || 1);
      }
    });
    const topMaterialsAskedAbout = Object.entries(materialQueriesMap)
      .map(([materialTitle, queryCount]) => ({ materialTitle, queryCount }))
      .sort((a, b) => b.queryCount - a.queryCount)
      .slice(0, 5);

    // Identified Weak Topics from quiz misses
    const weakTopicMap: Record<string, number> = {};
    quizzes.forEach((q) => {
      if (q.percentage < 80 && q.topic) {
        weakTopicMap[q.topic] = (weakTopicMap[q.topic] || 0) + 1;
      }
    });
    const identifiedWeakTopics = Object.entries(weakTopicMap)
      .map(([topic, failedCount]) => ({ topic, failedCount }))
      .sort((a, b) => b.failedCount - a.failedCount)
      .slice(0, 5);

    return {
      totalQuestionsAsked: userQuestions,
      totalConversations: convs.length,
      totalSummariesGenerated: summariesGenerated,
      totalQuizzesGenerated: quizzesGenerated,
      totalQuizzesCompleted: quizzes.length,
      totalSourceGroundedQueries: sourceGroundedQueries,
      helpfulCount,
      notHelpfulCount,
      helpfulRatePercent,
      averageQuizScorePercent: avgScore,
      topSubjects,
      questionTypesBreakdown,
      topMaterialsAskedAbout,
      identifiedWeakTopics,
    };
  }
}

export const aiService = new AIService();
