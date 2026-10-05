import {
  DoubtItem,
  DoubtAnswer,
  DoubtReply,
  DoubtReport,
  DoubtStatus,
  DoubtContentType,
  DoubtReportReason,
  DoubtReportStatus,
  HelpfulVote,
  CreateDoubtDTO,
  CreateAnswerDTO,
  DoubtAttachment,
} from '../types/doubt';
import { User } from '../types/user';
import { activityService } from './activityService';
import { notificationService } from './notificationService';
import { contentService } from './contentService';
import { sessionRoomService } from './sessionRoomService';
import { tokenService } from './tokenService';
import { authService } from './authService';
import { PLATFORM_SUBJECTS, getSubjectById } from '../data/subjectData';

const DOUBTS_STORAGE_KEY = 'vidyasetu_doubts_v5';
const DOUBT_VOTES_STORAGE_KEY = 'vidyasetu_doubt_votes_v5';
const DOUBT_REPORTS_STORAGE_KEY = 'vidyasetu_doubt_reports_v5';

// Realistic pre-seeded doubts with verified academic answers
export const INITIAL_SEEDED_DOUBTS: DoubtItem[] = [
  {
    id: 'doubt-dsa-binary-search',
    student_id: 'user-student-aryan',
    student_name: 'Aryan Sharma',
    student_email: 'aryan@yuvasetu.com',
    title: 'How does binary search work on sorted arrays and why is it O(log N)?',
    description:
      'I understand the basic premise of checking the middle element, but I am confused about how the search range boundaries (low, high, mid) transition on each comparison without missing boundary elements or entering an infinite loop with (low + high) / 2 overflow.',
    subject_id: 'dsa',
    subject_name: 'Data Structures & Algorithms',
    topic: 'Searching & Complexity',
    tags: ['BinarySearch', 'Searching', 'TimeComplexity', 'Algorithms'],
    status: 'RESOLVED',
    answers_count: 1,
    has_accepted_answer: true,
    views: 142,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    attachments: [
      {
        id: 'att-1',
        doubt_id: 'doubt-dsa-binary-search',
        file_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
        file_name: 'Binary_Search_Boundary_Diagram.png',
        file_type: 'image',
        file_size: '480 KB',
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
    ],
    answers: [
      {
        id: 'ans-dsa-bs-1',
        doubt_id: 'doubt-dsa-binary-search',
        admin_id: 'user-admin-1',
        author_name: 'Om Tajane',
        author_role: 'YuvaSetu Admin / Academic Lead',
        author_email: 'omtajane2806@gmail.com',
        answer_text: `Here is a clear first-principles explanation of Binary Search:

### 1. Invariant & Search Space Halving
Binary Search operates strictly on a **monotonic (sorted) space**.
At each step, we calculate the middle index:
\`\`\`cpp
int mid = low + (high - low) / 2; // Prevents integer overflow of (low + high)
\`\`\`

### 2. Boundary Transitions:
- If \`arr[mid] == target\`: Found immediately at index \`mid\`.
- If \`arr[mid] < target\`: Because the array is sorted ascendingly, no element to the left of \`mid\` (including \`mid\`) can equal the target. Thus, we discard the entire left half by setting:
  \`low = mid + 1\`
- If \`arr[mid] > target\`: Similarly, no element to the right of \`mid\` can equal target, so we discard the right half by setting:
  \`high = mid - 1\`

### 3. Why is it $O(\\log N)$?
At each step, the search window of size $N$ is halved:
$N \\rightarrow N/2 \\rightarrow N/4 \\dots \\rightarrow 1$.
The number of divisions required to reach 1 is $\\log_2 N$. Hence, **Time Complexity = $O(\\log N)$** and **Space Complexity = $O(1)$** (iterative).`,
        helpful_count: 12,
        unhelpful_count: 0,
        is_accepted: true,
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        replies: [
          {
            id: 'rep-1',
            answer_id: 'ans-dsa-bs-1',
            user_id: 'user-student-aryan',
            user_name: 'Aryan Sharma',
            user_role: 'student',
            text: 'Thank you sir! The explanation of `low + (high - low)/2` integer overflow prevention was the exact detail I needed!',
            created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
          },
        ],
      },
    ],
  },
  {
    id: 'doubt-dsa-hashing-collision',
    student_id: 'user-student-priya',
    student_name: 'Priya Patel',
    student_email: 'priya@yuvasetu.com',
    title: 'How does Hashing Collision Resolution work: Chaining vs Open Addressing?',
    description:
      'When two keys map to the same hash table index (hash(k1) == hash(k2)), what is the trade-off between Separate Chaining using linked lists/trees versus Open Addressing using Linear/Quadratic Probing and Double Hashing?',
    subject_id: 'dsa',
    subject_name: 'Data Structures & Algorithms',
    topic: 'Hashing & Hash Tables',
    tags: ['Hashing', 'CollisionResolution', 'Chaining', 'OpenAddressing'],
    status: 'ANSWERED',
    answers_count: 1,
    has_accepted_answer: false,
    views: 98,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    answers: [
      {
        id: 'ans-hashing-1',
        doubt_id: 'doubt-dsa-hashing-collision',
        admin_id: 'user-admin-1',
        author_name: 'Om Tajane',
        author_role: 'YuvaSetu Admin / Academic Lead',
        author_email: 'omtajane2806@gmail.com',
        answer_text: `### Comparison of Collision Handling Strategies:

1. **Separate Chaining (Closed Addressing):**
   - Each hash bucket points to a linked list (or Red-Black Tree in modern Java HashMap once bucket size exceeds 8).
   - **Pros:** Table never gets completely "full"; simple deletion; forgiving with load factor $\\alpha > 1$.
   - **Cons:** Cache locality is poorer due to pointer chasing; extra memory overhead for node pointers.

2. **Open Addressing (Open Addressing / Closed Hashing):**
   - All elements are stored directly in the hash array.
   - **Linear Probing:** \`h(k, i) = (h'(k) + i) % m\`. Susceptible to *Primary Clustering*.
   - **Quadratic Probing:** \`h(k, i) = (h'(k) + c1*i + c2*i^2) % m\`. Reduces clustering.
   - **Double Hashing:** \`h(k, i) = (h1(k) + i * h2(k)) % m\`. Best distribution.
   - **Pros:** Excellent CPU cache performance; no pointer overhead.
   - **Cons:** Deletion requires tombstone markers; requires table resizing before $\\alpha \\ge 0.7$.`,
        helpful_count: 8,
        unhelpful_count: 0,
        is_accepted: false,
        created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
        replies: [],
      },
    ],
  },
  {
    id: 'doubt-os-context-switching',
    student_id: 'user-student-rohan',
    student_name: 'Rohan Mehta',
    student_email: 'rohan@yuvasetu.com',
    title: 'Difference between Process Context Switching and Thread Context Switching in OS?',
    description:
      'Why is thread context switching computationally cheaper than process context switching? Does thread switching also flush the CPU Translation Lookaside Buffer (TLB)?',
    subject_id: 'os',
    subject_name: 'Operating Systems',
    topic: 'Processes & Threads',
    tags: ['OS', 'ContextSwitching', 'Processes', 'Threads', 'TLB'],
    status: 'ANSWERED',
    answers_count: 1,
    has_accepted_answer: false,
    views: 76,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    answers: [
      {
        id: 'ans-os-ctx-1',
        doubt_id: 'doubt-os-context-switching',
        admin_id: 'user-admin-1',
        author_name: 'Om Tajane',
        author_role: 'YuvaSetu Admin / Academic Lead',
        author_email: 'omtajane2806@gmail.com',
        answer_text: `### Core Difference in Context Switching:

- **Process Context Switch:**
  - Involves switching virtual address spaces (updating CR3 register on x86 to the new page directory base).
  - Causes the **Translation Lookaside Buffer (TLB)** to be invalidated/flushed (unless PCID tags are used).
  - High cache miss penalty because L1/L2 caches now hold stale memory lines.
  
- **Thread Context Switch (Within Same Process):**
  - Threads share the same virtual address space (Code, Data, Heap, Open files).
  - Only CPU state registers (Program Counter, Stack Pointer, General registers) are saved and restored into the TCB.
  - **Memory page tables remain intact, so TLB is NOT flushed**, preserving hardware cache warmth.`,
        helpful_count: 6,
        unhelpful_count: 0,
        is_accepted: false,
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        replies: [],
      },
    ],
  },
  {
    id: 'doubt-cn-tcp-handshake',
    student_id: 'user-student-sneha',
    student_name: 'Sneha Gupta',
    student_email: 'sneha@yuvasetu.com',
    title: 'Why do we need a 3-way handshake in TCP instead of a 2-way handshake?',
    description:
      'Could a TCP connection be safely established using only SYN and SYN-ACK (2 packets)? What scenarios (such as delayed duplicate packets) fail under a 2-way handshake model?',
    subject_id: 'cn',
    subject_name: 'Computer Networks',
    topic: 'Transport Layer & TCP',
    tags: ['TCP', 'Handshake', 'Networking', 'SYN', 'ACK'],
    status: 'OPEN',
    answers_count: 0,
    has_accepted_answer: false,
    views: 45,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    answers: [],
  },
  {
    id: 'doubt-dbms-btree-vs-bplus',
    student_id: 'user-student-vikram',
    student_name: 'Vikram Joshi',
    student_email: 'vikram@yuvasetu.com',
    title: 'What is the primary advantage of B+ Trees over B-Trees for database disk indexes?',
    description:
      'I understand both are balanced search trees, but why do major relational databases (MySQL InnoDB, PostgreSQL) strictly choose B+ Trees for table indexing and range scans?',
    subject_id: 'dbms',
    subject_name: 'DBMS & SQL',
    topic: 'Indexing & Storage',
    tags: ['DBMS', 'Indexing', 'BTrees', 'BPlusTrees', 'SQL'],
    status: 'OPEN',
    answers_count: 0,
    has_accepted_answer: false,
    views: 52,
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    answers: [],
  },
];

const INITIAL_SEEDED_REPORTS: DoubtReport[] = [
  {
    id: 'report-demo-1',
    reporter_id: 'user-student-aryan',
    reporter_name: 'Aryan Sharma',
    content_type: 'question',
    content_id: 'doubt-dbms-btree-vs-bplus',
    doubt_id: 'doubt-dbms-btree-vs-bplus',
    doubt_title: 'What is the primary advantage of B+ Trees over B-Trees for database disk indexes?',
    reason: 'Duplicate',
    notes: 'A similar query might already be covered in Database Normalization notes.',
    status: 'OPEN',
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
];

class DoubtService {
  // Storage getter
  private getStoredDoubts(): DoubtItem[] {
    try {
      const data = localStorage.getItem(DOUBTS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(DOUBTS_STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_DOUBTS));
        return INITIAL_SEEDED_DOUBTS;
      }
      const parsed: DoubtItem[] = JSON.parse(data);
      if (!parsed || parsed.length === 0) {
        localStorage.setItem(DOUBTS_STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_DOUBTS));
        return INITIAL_SEEDED_DOUBTS;
      }
      return parsed;
    } catch {
      return INITIAL_SEEDED_DOUBTS;
    }
  }

  private saveStoredDoubts(doubts: DoubtItem[]): void {
    try {
      localStorage.setItem(DOUBTS_STORAGE_KEY, JSON.stringify(doubts));
    } catch (e) {
      console.error('Failed to save doubts to localStorage', e);
    }
  }

  private getStoredVotes(): HelpfulVote[] {
    try {
      const data = localStorage.getItem(DOUBT_VOTES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveStoredVotes(votes: HelpfulVote[]): void {
    try {
      localStorage.setItem(DOUBT_VOTES_STORAGE_KEY, JSON.stringify(votes));
    } catch (e) {
      console.error('Failed to save votes', e);
    }
  }

  private getStoredReports(): DoubtReport[] {
    try {
      const data = localStorage.getItem(DOUBT_REPORTS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(DOUBT_REPORTS_STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_REPORTS));
        return INITIAL_SEEDED_REPORTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SEEDED_REPORTS;
    }
  }

  private saveStoredReports(reports: DoubtReport[]): void {
    try {
      localStorage.setItem(DOUBT_REPORTS_STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save reports', e);
    }
  }

  // 1. Get All Doubts with Filters & Sorting
  public getAllDoubts(options?: {
    search?: string;
    subjectId?: string;
    topic?: string;
    status?: string;
    tab?: 'recent' | 'popular' | 'unanswered' | 'my_doubts';
    studentId?: string;
    sortBy?: 'recent' | 'answered' | 'helpful';
  }): DoubtItem[] {
    let doubts = this.getStoredDoubts();

    if (options?.studentId && options?.tab === 'my_doubts') {
      doubts = doubts.filter((d) => d.student_id === options.studentId);
    }

    if (options?.subjectId && options.subjectId !== 'All') {
      doubts = doubts.filter(
        (d) =>
          d.subject_id.toLowerCase() === options.subjectId!.toLowerCase() ||
          d.subject_name.toLowerCase() === options.subjectId!.toLowerCase()
      );
    }

    if (options?.topic && options.topic !== 'All') {
      doubts = doubts.filter((d) => d.topic?.toLowerCase().includes(options.topic!.toLowerCase()));
    }

    if (options?.status && options.status !== 'All') {
      doubts = doubts.filter((d) => d.status.toUpperCase() === options.status!.toUpperCase());
    }

    if (options?.tab === 'unanswered') {
      doubts = doubts.filter((d) => d.answers_count === 0 && d.status !== 'CLOSED');
    }

    if (options?.search && options.search.trim()) {
      const query = options.search.toLowerCase().trim();
      doubts = doubts.filter((d) => {
        const inTitle = d.title.toLowerCase().includes(query);
        const inDesc = d.description.toLowerCase().includes(query);
        const inSub = d.subject_name.toLowerCase().includes(query);
        const inTopic = d.topic?.toLowerCase().includes(query);
        const inTags = d.tags.some((t) => t.toLowerCase().includes(query));
        const inAuthor = d.student_name.toLowerCase().includes(query);
        return inTitle || inDesc || inSub || inTopic || inTags || inAuthor;
      });
    }

    // Sorting
    if (options?.tab === 'popular' || options?.sortBy === 'helpful') {
      doubts = doubts.sort((a, b) => {
        const aHelpful = a.answers?.reduce((acc, ans) => acc + ans.helpful_count, 0) || 0;
        const bHelpful = b.answers?.reduce((acc, ans) => acc + ans.helpful_count, 0) || 0;
        return bHelpful - aHelpful || b.views - a.views;
      });
    } else if (options?.sortBy === 'answered') {
      doubts = doubts.sort((a, b) => b.answers_count - a.answers_count);
    } else {
      // default: most recent
      doubts = doubts.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return doubts;
  }

  // 2. Get Single Doubt by ID
  public getDoubtById(doubtId: string, trackView: boolean = false, viewerUser?: User): DoubtItem | undefined {
    const doubts = this.getStoredDoubts();
    const found = doubts.find((d) => d.id === doubtId);
    if (!found) return undefined;

    if (trackView) {
      found.views = (found.views || 0) + 1;
      this.saveStoredDoubts(doubts);

      if (viewerUser) {
        activityService.logEvent({
          user_id: viewerUser.id,
          user_name: viewerUser.name,
          user_email: viewerUser.email,
          event_type: 'DOUBT_VIEWED',
          resource_type: 'doubt',
          resource_id: found.id,
          resource_title: found.title,
          metadata: {
            subject: found.subject_name,
            topic: found.topic,
          },
        });
      }
    }

    return found;
  }

  // 3. Create Doubt (Student)
  public createDoubt(studentUser: User, dto: CreateDoubtDTO): DoubtItem {
    if (!dto.title.trim() || !dto.description.trim() || !dto.subject_id) {
      throw new Error('Title, description, and subject are required to ask a doubt.');
    }

    const doubts = this.getStoredDoubts();
    const subjectObj = getSubjectById(dto.subject_id);
    const subjectName = subjectObj ? subjectObj.name : dto.subject_name || 'General';

    const attachments: DoubtAttachment[] = [];
    if (dto.attachment && dto.attachment.file_url) {
      attachments.push({
        id: `att-${Date.now()}`,
        file_url: dto.attachment.file_url,
        file_name: dto.attachment.file_name,
        file_type: dto.attachment.file_type,
        file_size: dto.attachment.file_size,
        created_at: new Date().toISOString(),
      });
    }

    const newDoubt: DoubtItem = {
      id: `doubt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      student_id: studentUser.id,
      student_name: studentUser.name,
      student_email: studentUser.email,
      title: dto.title.trim(),
      description: dto.description.trim(),
      subject_id: dto.subject_id,
      subject_name: subjectName,
      topic: dto.topic?.trim() || 'General Concept',
      tags: dto.tags && dto.tags.length > 0 ? dto.tags : [subjectName],
      status: 'OPEN',
      answers_count: 0,
      has_accepted_answer: false,
      views: 1,
      attachments: attachments.length > 0 ? attachments : undefined,
      answers: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    doubts.unshift(newDoubt);
    this.saveStoredDoubts(doubts);

    // Track activity
    activityService.logEvent({
      user_id: studentUser.id,
      user_name: studentUser.name,
      user_email: studentUser.email,
      event_type: 'DOUBT_CREATED',
      resource_type: 'doubt',
      resource_id: newDoubt.id,
      resource_title: newDoubt.title,
      metadata: {
        subject: newDoubt.subject_name,
        topic: newDoubt.topic,
      },
    });

    // Notify Admins
    notificationService.notifyNewDoubtForAdmins(
      newDoubt.id,
      newDoubt.title,
      studentUser.name,
      newDoubt.subject_name
    );

    return newDoubt;
  }

  // 4. Update Doubt (Student owner or Admin)
  public updateDoubt(
    doubtId: string,
    studentId: string,
    updates: Partial<CreateDoubtDTO>,
    isAdmin: boolean = false
  ): DoubtItem {
    const doubts = this.getStoredDoubts();
    const index = doubts.findIndex((d) => d.id === doubtId);
    if (index === -1) throw new Error('Doubt not found');

    const doubt = doubts[index];
    if (!isAdmin && doubt.student_id !== studentId) {
      throw new Error('You do not have permission to edit this doubt.');
    }

    if (updates.subject_id) {
      const subjectObj = getSubjectById(updates.subject_id);
      if (subjectObj) doubt.subject_name = subjectObj.name;
      doubt.subject_id = updates.subject_id;
    }

    if (updates.title) doubt.title = updates.title.trim();
    if (updates.description) doubt.description = updates.description.trim();
    if (updates.topic) doubt.topic = updates.topic.trim();
    if (updates.tags) doubt.tags = updates.tags;

    doubt.updated_at = new Date().toISOString();
    doubts[index] = doubt;
    this.saveStoredDoubts(doubts);
    return doubt;
  }

  // 5. Delete Doubt (Owner or Admin)
  public deleteDoubt(doubtId: string, requesterId: string, isAdmin: boolean = false): void {
    const doubts = this.getStoredDoubts();
    const doubt = doubts.find((d) => d.id === doubtId);
    if (!doubt) throw new Error('Doubt not found');

    if (!isAdmin && doubt.student_id !== requesterId) {
      throw new Error('You do not have permission to delete this doubt.');
    }

    const filtered = doubts.filter((d) => d.id !== doubtId);
    this.saveStoredDoubts(filtered);
  }

  // 6. Mark Doubt as Resolved (Student owner)
  public resolveDoubt(doubtId: string, studentId: string, isAdmin: boolean = false): DoubtItem {
    const doubts = this.getStoredDoubts();
    const index = doubts.findIndex((d) => d.id === doubtId);
    if (index === -1) throw new Error('Doubt not found');

    const doubt = doubts[index];
    if (!isAdmin && doubt.student_id !== studentId) {
      throw new Error('Only the author student can mark this doubt as resolved.');
    }

    doubt.status = 'RESOLVED';
    doubt.updated_at = new Date().toISOString();
    doubts[index] = doubt;
    this.saveStoredDoubts(doubts);

    activityService.logEvent({
      user_id: studentId,
      event_type: 'DOUBT_RESOLVED',
      resource_type: 'doubt',
      resource_id: doubt.id,
      resource_title: doubt.title,
    });

    return doubt;
  }

  // 7. Reopen Doubt (Admin or Student)
  public reopenDoubt(doubtId: string, requesterId: string, isAdmin: boolean = false): DoubtItem {
    const doubts = this.getStoredDoubts();
    const index = doubts.findIndex((d) => d.id === doubtId);
    if (index === -1) throw new Error('Doubt not found');

    const doubt = doubts[index];
    if (!isAdmin && doubt.student_id !== requesterId) {
      throw new Error('Unauthorized to reopen doubt.');
    }

    doubt.status = (doubt.answers && doubt.answers.length > 0) ? 'ANSWERED' : 'OPEN';
    doubt.closed_reason = undefined;
    doubt.updated_at = new Date().toISOString();
    doubts[index] = doubt;
    this.saveStoredDoubts(doubts);
    return doubt;
  }

  // 8. Close Doubt (Admin)
  public closeDoubt(doubtId: string, adminId: string, reason: string = 'Closed by platform administrator'): DoubtItem {
    const doubts = this.getStoredDoubts();
    const index = doubts.findIndex((d) => d.id === doubtId);
    if (index === -1) throw new Error('Doubt not found');

    const doubt = doubts[index];
    doubt.status = 'CLOSED';
    doubt.closed_reason = reason;
    doubt.updated_at = new Date().toISOString();
    doubts[index] = doubt;
    this.saveStoredDoubts(doubts);

    // Notify the student
    notificationService.notifyDoubtClosed(doubt.student_id, doubt.id, doubt.title, reason);

    return doubt;
  }

  // 9. Mark Doubt as Duplicate (Admin)
  public markDuplicate(doubtId: string, adminId: string, duplicateOfId?: string): DoubtItem {
    const doubts = this.getStoredDoubts();
    const index = doubts.findIndex((d) => d.id === doubtId);
    if (index === -1) throw new Error('Doubt not found');

    const doubt = doubts[index];
    doubt.status = 'CLOSED';
    doubt.is_duplicate = true;
    doubt.duplicate_of_id = duplicateOfId;
    doubt.closed_reason = duplicateOfId
      ? `Marked as duplicate of question #${duplicateOfId}`
      : 'Marked as duplicate of an existing academic question';
    doubt.updated_at = new Date().toISOString();
    doubts[index] = doubt;
    this.saveStoredDoubts(doubts);
    return doubt;
  }

  // 10. Add Answer (Admin only for MVP)
  public addAnswer(adminUser: User, doubtId: string, dto: CreateAnswerDTO): DoubtAnswer {
    if (!dto.answer_text.trim()) {
      throw new Error('Answer text cannot be empty.');
    }

    const doubts = this.getStoredDoubts();
    const index = doubts.findIndex((d) => d.id === doubtId);
    if (index === -1) throw new Error('Doubt not found');

    const doubt = doubts[index];

    const attachments: DoubtAttachment[] = [];
    if (dto.attachment && dto.attachment.file_url) {
      attachments.push({
        id: `att-ans-${Date.now()}`,
        doubt_id: doubtId,
        file_url: dto.attachment.file_url,
        file_name: dto.attachment.file_name,
        file_type: dto.attachment.file_type,
        file_size: dto.attachment.file_size,
        created_at: new Date().toISOString(),
      });
    }

    const newAnswer: DoubtAnswer = {
      id: `ans-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      doubt_id: doubtId,
      admin_id: adminUser.id,
      author_name: adminUser.name,
      author_role:
        adminUser.role === 'admin' ? 'YuvaSetu Admin / Academic Lead' : 'YuvaSetu Mentor',
      author_email: adminUser.email,
      answer_text: dto.answer_text.trim(),
      helpful_count: 0,
      unhelpful_count: 0,
      is_accepted: false,
      attachments: attachments.length > 0 ? attachments : undefined,
      replies: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!doubt.answers) doubt.answers = [];
    doubt.answers.push(newAnswer);
    doubt.answers_count = doubt.answers.length;
    if (doubt.status === 'OPEN') {
      doubt.status = 'ANSWERED';
    }
    doubt.updated_at = new Date().toISOString();

    doubts[index] = doubt;
    this.saveStoredDoubts(doubts);

    // Track activity
    activityService.logEvent({
      user_id: adminUser.id,
      user_name: adminUser.name,
      user_email: adminUser.email,
      event_type: 'ANSWER_CREATED',
      resource_type: 'answer',
      resource_id: newAnswer.id,
      resource_title: `Answer for "${doubt.title.substring(0, 40)}"`,
      metadata: {
        doubt_id: doubt.id,
        subject: doubt.subject_name,
      },
    });

    // Notify Student
    notificationService.notifyDoubtAnswered(
      doubt.student_id,
      doubt.id,
      doubt.title,
      adminUser.name
    );

    return newAnswer;
  }

  // 11. Accept Answer (Student who asked the doubt)
  public acceptAnswer(doubtId: string, answerId: string, studentId: string): DoubtItem {
    const doubts = this.getStoredDoubts();
    const index = doubts.findIndex((d) => d.id === doubtId);
    if (index === -1) throw new Error('Doubt not found');

    const doubt = doubts[index];
    if (doubt.student_id !== studentId) {
      throw new Error('Only the student who asked this doubt can mark an accepted answer.');
    }

    if (!doubt.answers || doubt.answers.length === 0) {
      throw new Error('No answers exist for this doubt.');
    }

    let acceptedAuthorId = '';
    // Mark the selected answer as accepted, and unmark all others
    doubt.answers = doubt.answers.map((ans) => {
      if (ans.id === answerId) {
        acceptedAuthorId = ans.admin_id;
        return { ...ans, is_accepted: true };
      }
      return { ...ans, is_accepted: false };
    });

    doubt.has_accepted_answer = true;
    doubt.status = 'RESOLVED';
    doubt.updated_at = new Date().toISOString();

    doubts[index] = doubt;
    this.saveStoredDoubts(doubts);

    // Track activity
    activityService.logEvent({
      user_id: studentId,
      event_type: 'ANSWER_ACCEPTED',
      resource_type: 'answer',
      resource_id: answerId,
      resource_title: `Accepted answer for "${doubt.title.substring(0, 40)}"`,
    });

    // Notify Answer author and reward VidyaTokens
    if (acceptedAuthorId) {
      notificationService.notifyAnswerAccepted(acceptedAuthorId, doubt.id, doubt.title);
      const answerAuthor = authService.getUserById(acceptedAuthorId);
      if (answerAuthor && answerAuthor.role !== 'admin') {
        tokenService.triggerRewardEvent(
          answerAuthor,
          'ACCEPTED_COMMUNITY_ANSWER',
          doubt.id,
          doubt.title
        );
      }
    }

    return doubt;
  }

  // 12. Delete Answer (Admin)
  public deleteAnswer(doubtId: string, answerId: string, adminId: string): void {
    const doubts = this.getStoredDoubts();
    const index = doubts.findIndex((d) => d.id === doubtId);
    if (index === -1) throw new Error('Doubt not found');

    const doubt = doubts[index];
    if (!doubt.answers) return;

    doubt.answers = doubt.answers.filter((a) => a.id !== answerId);
    doubt.answers_count = doubt.answers.length;
    doubt.has_accepted_answer = doubt.answers.some((a) => a.is_accepted);

    if (doubt.answers_count === 0 && doubt.status === 'ANSWERED') {
      doubt.status = 'OPEN';
    }

    doubt.updated_at = new Date().toISOString();
    doubts[index] = doubt;
    this.saveStoredDoubts(doubts);
  }

  // 13. Helpful / Not Helpful Voting
  public voteAnswerHelpful(
    answerId: string,
    userId: string,
    voteType: 'helpful' | 'not_helpful'
  ): { helpfulCount: number; unhelpfulCount: number; userVote: 'helpful' | 'not_helpful' | null } {
    const votes = this.getStoredVotes();
    const existingIndex = votes.findIndex((v) => v.answer_id === answerId && v.user_id === userId);

    let finalUserVote: 'helpful' | 'not_helpful' | null = voteType;

    if (existingIndex > -1) {
      if (votes[existingIndex].type === voteType) {
        // Toggle off (remove vote)
        votes.splice(existingIndex, 1);
        finalUserVote = null;
      } else {
        // Change vote
        votes[existingIndex].type = voteType;
      }
    } else {
      votes.push({
        id: `vote-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        answer_id: answerId,
        user_id: userId,
        type: voteType,
        created_at: new Date().toISOString(),
      });
    }

    this.saveStoredVotes(votes);

    // Recalculate helpful counts in doubt storage
    const helpfulCount = votes.filter((v) => v.answer_id === answerId && v.type === 'helpful').length;
    const unhelpfulCount = votes.filter((v) => v.answer_id === answerId && v.type === 'not_helpful').length;

    const doubts = this.getStoredDoubts();
    for (const d of doubts) {
      if (d.answers) {
        const targetAns = d.answers.find((a) => a.id === answerId);
        if (targetAns) {
          targetAns.helpful_count = helpfulCount;
          targetAns.unhelpful_count = unhelpfulCount;
          break;
        }
      }
    }
    this.saveStoredDoubts(doubts);

    return {
      helpfulCount,
      unhelpfulCount,
      userVote: finalUserVote,
    };
  }

  public getUserVote(answerId: string, userId?: string): 'helpful' | 'not_helpful' | null {
    if (!userId) return null;
    const votes = this.getStoredVotes();
    const found = votes.find((v) => v.answer_id === answerId && v.user_id === userId);
    return found ? found.type : null;
  }

  // 14. Add Reply to Answer
  public addReply(answerId: string, user: User, text: string): DoubtReply {
    if (!text.trim()) throw new Error('Reply cannot be empty.');

    const doubts = this.getStoredDoubts();
    let createdReply: DoubtReply | null = null;

    for (const d of doubts) {
      if (d.answers) {
        const targetAns = d.answers.find((a) => a.id === answerId);
        if (targetAns) {
          if (!targetAns.replies) targetAns.replies = [];
          createdReply = {
            id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            answer_id: answerId,
            user_id: user.id,
            user_name: user.name,
            user_role: user.role,
            text: text.trim(),
            created_at: new Date().toISOString(),
          };
          targetAns.replies.push(createdReply);
          d.updated_at = new Date().toISOString();
          break;
        }
      }
    }

    if (!createdReply) throw new Error('Answer not found.');
    this.saveStoredDoubts(doubts);
    return createdReply;
  }

  // 15. Reporting & Moderation
  public reportContent(
    reporterUser: User,
    dto: {
      contentType: DoubtContentType;
      contentId: string;
      doubtId: string;
      reason: DoubtReportReason;
      notes?: string;
    }
  ): DoubtReport {
    const reports = this.getStoredReports();
    const doubt = this.getDoubtById(dto.doubtId);

    const newReport: DoubtReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      reporter_id: reporterUser.id,
      reporter_name: reporterUser.name,
      content_type: dto.contentType,
      content_id: dto.contentId,
      doubt_id: dto.doubtId,
      doubt_title: doubt ? doubt.title : undefined,
      reason: dto.reason,
      notes: dto.notes?.trim(),
      status: 'OPEN',
      created_at: new Date().toISOString(),
    };

    reports.unshift(newReport);
    this.saveStoredReports(reports);

    // Track activity
    activityService.logEvent({
      user_id: reporterUser.id,
      user_name: reporterUser.name,
      event_type: 'DOUBT_REPORTED',
      resource_type: 'doubt',
      resource_id: dto.contentId,
      resource_title: `Reported ${dto.contentType} for reason: ${dto.reason}`,
    });

    // Notify Admins
    notificationService.notifyDoubtReportedForAdmins(
      newReport.id,
      dto.doubtId,
      doubt ? doubt.title : 'Academic Question',
      dto.reason
    );

    return newReport;
  }

  public getReports(statusFilter?: string): DoubtReport[] {
    const reports = this.getStoredReports();
    if (!statusFilter || statusFilter === 'ALL') return reports;
    return reports.filter((r) => r.status.toUpperCase() === statusFilter.toUpperCase());
  }

  public updateReportStatus(
    reportId: string,
    status: DoubtReportStatus,
    adminNotes?: string,
    actionTaken?: string
  ): DoubtReport {
    const reports = this.getStoredReports();
    const index = reports.findIndex((r) => r.id === reportId);
    if (index === -1) throw new Error('Report not found');

    const report = reports[index];
    report.status = status;
    report.resolved_at = status === 'RESOLVED' ? new Date().toISOString() : undefined;
    if (adminNotes) report.notes = (report.notes ? `${report.notes}\n[Admin note]: ` : '') + adminNotes;
    if (actionTaken) report.admin_action_taken = actionTaken;

    reports[index] = report;
    this.saveStoredReports(reports);
    return report;
  }

  // 16. Platform Metrics for Admin Dashboard
  public getDoubtMetrics(): {
    totalDoubts: number;
    openDoubts: number;
    unansweredDoubts: number;
    answeredDoubts: number;
    resolvedDoubts: number;
    closedDoubts: number;
    totalAnswers: number;
    totalReports: number;
    openReports: number;
  } {
    const doubts = this.getStoredDoubts();
    const reports = this.getStoredReports();

    const totalDoubts = doubts.length;
    const openDoubts = doubts.filter((d) => d.status === 'OPEN').length;
    const unansweredDoubts = doubts.filter((d) => d.answers_count === 0 && d.status !== 'CLOSED').length;
    const answeredDoubts = doubts.filter((d) => d.status === 'ANSWERED').length;
    const resolvedDoubts = doubts.filter((d) => d.status === 'RESOLVED').length;
    const closedDoubts = doubts.filter((d) => d.status === 'CLOSED').length;
    const totalAnswers = doubts.reduce((acc, curr) => acc + (curr.answers_count || 0), 0);
    const totalReports = reports.length;
    const openReports = reports.filter((r) => r.status === 'OPEN').length;

    return {
      totalDoubts,
      openDoubts,
      unansweredDoubts,
      answeredDoubts,
      resolvedDoubts,
      closedDoubts,
      totalAnswers,
      totalReports,
      openReports,
    };
  }

  // 17. Related Study Material (links to existing published notes/videos in the system)
  public getRelatedStudyMaterials(subjectId: string, topic?: string) {
    const allMaterials = contentService.getAllContent(false);
    return allMaterials.filter(
      (m) =>
        m.subject_id?.toLowerCase() === subjectId?.toLowerCase() ||
        (topic && m.topic && m.topic.toLowerCase().includes(topic.toLowerCase()))
    ).slice(0, 3);
  }

  // 18. Related Live Session
  public getRelatedLiveSessions(subjectId: string, subjectName?: string) {
    const sessions = sessionRoomService.getLiveSessions();
    return sessions.filter(
      (s) =>
        (s.status === 'LIVE' || s.status === 'SCHEDULED') &&
        (s.subject?.toLowerCase().includes(subjectId?.toLowerCase()) ||
          (subjectName && s.subject?.toLowerCase().includes(subjectName.toLowerCase())))
    ).slice(0, 2);
  }

  // 19. Get doubts asked by a specific student
  public getDoubtsByStudent(studentId: string): DoubtItem[] {
    return this.getAllDoubts().filter((d) => d.student_id === studentId);
  }
}

export const doubtService = new DoubtService();
