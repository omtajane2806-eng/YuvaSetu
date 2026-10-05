import {
  CommunityDiscussion,
  CommunityReply,
  CommunityReport,
  SubjectFollow,
  DiscussionHelpful,
  ReplyHelpful,
  CreateDiscussionDTO,
  EditDiscussionDTO,
  CreateReplyDTO,
  CommunityFilterOptions,
  CommunityMetricsSummary,
  CommunityReportStatus,
  DiscussionCategory,
  DiscussionStatus,
  ReplyStatus,
} from '../types/community';
import { User } from '../types/user';
import { activityService } from './activityService';
import { notificationService } from './notificationService';
import { tokenService } from './tokenService';
import { PLATFORM_SUBJECTS } from '../data/subjectData';

const DISCUSSIONS_STORAGE_KEY = 'vidyasetu_community_discussions_v2';
const REPLIES_STORAGE_KEY = 'vidyasetu_community_replies_v2';
const DISC_HELPFUL_STORAGE_KEY = 'vidyasetu_community_helpful_disc_v2';
const REPLY_HELPFUL_STORAGE_KEY = 'vidyasetu_community_helpful_reply_v2';
const SUBJECT_FOLLOWS_STORAGE_KEY = 'vidyasetu_subject_follows_v2';
const REPORTS_STORAGE_KEY = 'vidyasetu_community_reports_v2';

const INITIAL_DISCUSSIONS: CommunityDiscussion[] = [
  {
    id: 'disc-dp-tabulation-memo',
    author_id: 'student-rohit-sharma',
    author_name: 'Rohit Sharma',
    author_role: 'student',
    author_email: 'rohit.sharma@pict.edu',
    title: 'Dynamic Programming: When should I prefer Tabulation (Bottom-Up) over Memoization (Top-Down)?',
    content:
      'I am preparing for semester exams and technical interviews on Dynamic Programming. While memoization is often more intuitive with recursion, does tabulation always provide better space complexity and avoid call stack overflow in deep recursion trees? What are the standard thumb rules to decide?',
    subject_id: 'dsa',
    subject_name: 'Data Structures & Algorithms',
    topic: 'Dynamic Programming & Recursion',
    tags: ['DSA', 'Dynamic Programming', 'Memoization', 'Tabulation', 'Interview Prep'],
    discussion_type: 'CONCEPT DISCUSSION',
    status: 'OPEN',
    replies_count: 3,
    helpful_count: 14,
    has_accepted_answer: true,
    accepted_reply_id: 'reply-dp-tabulation-1',
    views: 184,
    is_trending: true,
    created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'disc-dbms-b-trees',
    author_id: 'student-ananya-iyer',
    author_name: 'Ananya Iyer',
    author_role: 'student',
    author_email: 'ananya.iyer@coep.ac.in',
    title: 'Why do relational databases use B+ Trees instead of Binary Search Trees for disk-based indexing?',
    content:
      'Can someone provide an intuitive mathematical explanation of why B+ trees minimize disk I/O operations compared to AVL or standard Red-Black Trees? Also, how does the sequential linked list at leaf nodes benefit range queries like SELECT * FROM Students WHERE age BETWEEN 18 AND 22?',
    subject_id: 'dbms',
    subject_name: 'DBMS & SQL',
    topic: 'B+ Tree Indexing & Disk Storage',
    tags: ['DBMS', 'Indexing', 'B+ Trees', 'Database Internals'],
    discussion_type: 'CONCEPT DISCUSSION',
    status: 'OPEN',
    replies_count: 2,
    helpful_count: 18,
    has_accepted_answer: true,
    accepted_reply_id: 'reply-dbms-b-trees-1',
    views: 230,
    is_trending: true,
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
  },
  {
    id: 'disc-os-virtual-memory-tlb',
    author_id: 'student-arjun-patel',
    author_name: 'Arjun Patel',
    author_role: 'student',
    author_email: 'arjun.patel@vjti.ac.in',
    title: 'Page Replacement Algorithms: Belady’s Anomaly in FIFO vs Optimal and LRU',
    content:
      'We studied Belady’s anomaly where allocating more page frames causes more page faults in FIFO. Does LRU ever suffer from Belady’s anomaly? What property (Stack Algorithms) mathematically guarantees that LRU and OPT are immune?',
    subject_id: 'os',
    subject_name: 'Operating Systems',
    topic: 'Virtual Memory & Page Replacement',
    tags: ['Operating Systems', 'Virtual Memory', 'Beladys Anomaly', 'LRU'],
    discussion_type: 'CONCEPT DISCUSSION',
    status: 'OPEN',
    replies_count: 2,
    helpful_count: 9,
    has_accepted_answer: false,
    views: 142,
    is_trending: false,
    created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
  },
  {
    id: 'disc-cn-tcp-congestion',
    author_id: 'student-sneha-kulkarni',
    author_name: 'Sneha Kulkarni',
    author_role: 'student',
    author_email: 'sneha.k@iitb.ac.in',
    title: 'TCP Reno vs TCP CUBIC: Why did Linux switch default congestion control?',
    content:
      'In computer networks class we are analyzing how TCP congestion windows behave during packet drops. TCP Reno drops `cwnd` by half (AIMD), but in high-bandwidth long-delay networks (BDP), CUBIC uses a cubic function of elapsed time. Has anyone benchmarked these in actual network simulations?',
    subject_id: 'cn',
    subject_name: 'Computer Networks',
    topic: 'TCP Congestion Control & Transport Layer',
    tags: ['Computer Networks', 'TCP', 'Congestion Control', 'Transport Layer'],
    discussion_type: 'GENERAL DISCUSSION',
    status: 'OPEN',
    replies_count: 1,
    helpful_count: 11,
    has_accepted_answer: false,
    views: 118,
    is_trending: false,
    created_at: new Date(Date.now() - 84 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
  },
  {
    id: 'disc-gate-prep-roadmap',
    author_id: 'student-priya-sharma',
    author_name: 'Priya Sharma',
    author_role: 'student',
    author_email: 'priya.sharma@pict.edu',
    title: 'GATE CSE 2027: How should 2nd and 3rd year students balance core university exams with standard GATE prep?',
    content:
      'Starting preparation for GATE Computer Science. Which subjects carry the highest return on time invested? Should we complete Discrete Math and Engineering Math first or start parallelly with DSA and Operating Systems?',
    subject_id: 'dsa',
    subject_name: 'Data Structures & Algorithms',
    topic: 'Exam Strategy & Syllabus Planning',
    tags: ['GATE CSE', 'Study Strategy', 'Core Engineering', 'Time Management'],
    discussion_type: 'EXAM PREPARATION',
    status: 'OPEN',
    replies_count: 4,
    helpful_count: 22,
    has_accepted_answer: true,
    accepted_reply_id: 'reply-gate-prep-1',
    views: 310,
    is_trending: true,
    created_at: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
  },
  {
    id: 'disc-react-server-components',
    author_id: 'student-tanmay-deshmukh',
    author_name: 'Tanmay Deshmukh',
    author_role: 'student',
    author_email: 'tanmay.deshmukh@vit.edu',
    title: 'React Server Components vs Traditional SSR: Mental model for stateful web apps',
    content:
      'When building modern full-stack web applications, what is the core architectural difference between classic getServerSideProps / SSR and true React Server Components streaming? Let’s share real production architectural experiences.',
    subject_id: 'webdev',
    subject_name: 'Web Development',
    topic: 'React Architecture & Server Components',
    tags: ['WebDev', 'React', 'Full Stack', 'Architecture'],
    discussion_type: 'PROJECT DISCUSSION',
    status: 'OPEN',
    replies_count: 1,
    helpful_count: 7,
    has_accepted_answer: false,
    views: 95,
    is_trending: false,
    created_at: new Date(Date.now() - 110 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 70 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_REPLIES: CommunityReply[] = [
  {
    id: 'reply-dp-tabulation-1',
    discussion_id: 'disc-dp-tabulation-memo',
    author_id: 'user-admin-om',
    author_name: 'Om Tajane',
    author_role: 'admin',
    author_email: 'omtajane2806@gmail.com',
    content:
      'Great question Rohit! Here is the clear academic rule of thumb:\n\n1. **Recursion Depth & Overhead**: Top-down (Memoization) incurs stack frame overhead `O(N)` which can hit maximum call stack limits (StackOverflow) in deep transitions (e.g. `N > 10,000`). Tabulation allocates an iterative table in heap memory, avoiding recursion stack limits entirely.\n2. **Subproblem Coverage**: If you only need to compute a small subset of subproblem states to reach the answer, Memoization is faster because it only computes reachable states on-demand. Tabulation computes all table entries systematically.\n3. **Space Optimization**: Tabulation allows state compression (e.g. keeping only the previous 1 or 2 rows/variables like in Fibonacci or 0/1 Knapsack), reducing space from `O(N*W)` down to `O(W)`. Memoization cannot easily compress state space without the call graph.',
    helpful_count: 16,
    is_accepted: true,
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
  },
  {
    id: 'reply-dp-tabulation-2',
    discussion_id: 'disc-dp-tabulation-memo',
    parent_reply_id: 'reply-dp-tabulation-1',
    author_id: 'student-ananya-iyer',
    author_name: 'Ananya Iyer',
    author_role: 'student',
    author_email: 'ananya.iyer@coep.ac.in',
    content:
      'Adding to this: in competitive programming or strict memory bounds, tabulation with a 1D rolling array is almost always the winner because of CPU cache locality. Contiguous memory access is much faster than scattered recursive function calls.',
    helpful_count: 8,
    is_accepted: false,
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'reply-dp-tabulation-3',
    discussion_id: 'disc-dp-tabulation-memo',
    author_id: 'student-rohit-sharma',
    author_name: 'Rohit Sharma',
    author_role: 'student',
    author_email: 'rohit.sharma@pict.edu',
    content:
      'Thank you Om and Ananya! The explanation on state compression and call stack overhead clarifies why textbook solutions often emphasize converting memoized solutions into bottom-up tables.',
    helpful_count: 4,
    is_accepted: false,
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  },
  {
    id: 'reply-dbms-b-trees-1',
    discussion_id: 'disc-dbms-b-trees',
    author_id: 'student-priya-sharma',
    author_name: 'Priya Sharma',
    author_role: 'student',
    author_email: 'priya.sharma@pict.edu',
    content:
      'The primary reason is **High Fan-out (Branching Factor)**. Disk reads/writes operate in fixed 4KB or 8KB pages (blocks). In a binary search tree, each node holds 1 key and 2 pointers; traversing height `h` requires `h` random disk I/O operations (which are slow mechanical/bus operations).\n\nIn a B+ Tree with degree `M=100`, a single page holds ~100 keys. A tree with height 3 can index 1,000,000 records with only 3 disk reads. Furthermore, all data records are stored exclusively in leaf nodes linked as a doubly linked list, which allows sequential range scans without backtracking up the tree.',
    helpful_count: 14,
    is_accepted: true,
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
  {
    id: 'reply-dbms-b-trees-2',
    discussion_id: 'disc-dbms-b-trees',
    author_id: 'user-admin-om',
    author_name: 'Om Tajane',
    author_role: 'admin',
    author_email: 'omtajane2806@gmail.com',
    content:
      'Spot-on explanation! You can also check the official YuvaSetu DBMS study notes on "Database Indexing & B+ Trees" under Study Materials for diagrammatic node-split step walkthroughs.',
    helpful_count: 9,
    is_accepted: false,
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
  },
  {
    id: 'reply-gate-prep-1',
    discussion_id: 'disc-gate-prep-roadmap',
    author_id: 'user-admin-om',
    author_name: 'Om Tajane',
    author_role: 'admin',
    author_email: 'omtajane2806@gmail.com',
    content:
      'For GATE CSE preparation while managing semester college exams:\n\n1. **Phase 1 (High Return Core)**: Engineering Mathematics (Linear Algebra & Calculus) + Discrete Mathematics (Set Theory, Graph Theory, Combinatorics). These form 15% guaranteed marks and build the foundation for Algorithms.\n2. **Phase 2 (Systems & Programming)**: Data Structures & Algorithms, Operating Systems, and DBMS. These overlap heavily with 3rd-year university syllabus.\n3. **Phase 3 (Theory)**: Theory of Computation (TOC) and Compiler Design.\n\nDedicate 2 hours daily during semester days and join our scheduled YuvaSetu Study Rooms in the evening for disciplined group revision.',
    helpful_count: 20,
    is_accepted: true,
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 80 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 80 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_SUBJECT_FOLLOWS: SubjectFollow[] = [
  {
    id: 'sf-1',
    user_id: 'student-rohit-sharma',
    subject_id: 'dsa',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sf-2',
    user_id: 'student-rohit-sharma',
    subject_id: 'dbms',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sf-3',
    user_id: 'student-ananya-iyer',
    subject_id: 'os',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sf-4',
    user_id: 'student-priya-sharma',
    subject_id: 'dsa',
    created_at: new Date().toISOString(),
  },
];

const INITIAL_REPORTS: CommunityReport[] = [];

class CommunityService {
  // Get stored discussions
  private getStoredDiscussions(): CommunityDiscussion[] {
    const raw = localStorage.getItem(DISCUSSIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DISCUSSIONS_STORAGE_KEY, JSON.stringify(INITIAL_DISCUSSIONS));
      return INITIAL_DISCUSSIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DISCUSSIONS;
    }
  }

  private saveDiscussions(discussions: CommunityDiscussion[]): void {
    localStorage.setItem(DISCUSSIONS_STORAGE_KEY, JSON.stringify(discussions));
  }

  // Get stored replies
  private getStoredReplies(): CommunityReply[] {
    const raw = localStorage.getItem(REPLIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REPLIES_STORAGE_KEY, JSON.stringify(INITIAL_REPLIES));
      return INITIAL_REPLIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_REPLIES;
    }
  }

  private saveReplies(replies: CommunityReply[]): void {
    localStorage.setItem(REPLIES_STORAGE_KEY, JSON.stringify(replies));
  }

  // Helpful votes for discussions
  private getStoredDiscHelpful(): DiscussionHelpful[] {
    const raw = localStorage.getItem(DISC_HELPFUL_STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private saveDiscHelpful(records: DiscussionHelpful[]): void {
    localStorage.setItem(DISC_HELPFUL_STORAGE_KEY, JSON.stringify(records));
  }

  // Helpful votes for replies
  private getStoredReplyHelpful(): ReplyHelpful[] {
    const raw = localStorage.getItem(REPLY_HELPFUL_STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private saveReplyHelpful(records: ReplyHelpful[]): void {
    localStorage.setItem(REPLY_HELPFUL_STORAGE_KEY, JSON.stringify(records));
  }

  // Followed subjects
  private getStoredSubjectFollows(): SubjectFollow[] {
    const raw = localStorage.getItem(SUBJECT_FOLLOWS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SUBJECT_FOLLOWS_STORAGE_KEY, JSON.stringify(INITIAL_SUBJECT_FOLLOWS));
      return INITIAL_SUBJECT_FOLLOWS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SUBJECT_FOLLOWS;
    }
  }

  private saveSubjectFollows(records: SubjectFollow[]): void {
    localStorage.setItem(SUBJECT_FOLLOWS_STORAGE_KEY, JSON.stringify(records));
  }

  // Reports
  private getStoredReports(): CommunityReport[] {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!raw) return INITIAL_REPORTS;
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_REPORTS;
    }
  }

  private saveReports(reports: CommunityReport[]): void {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  }

  // ==========================================
  // DISCUSSIONS CRUD & QUERYING
  // ==========================================

  public getDiscussions(
    options: CommunityFilterOptions = {},
    currentUserId?: string
  ): CommunityDiscussion[] {
    let discussions = this.getStoredDiscussions().filter((d) => d.status !== 'REMOVED');

    // Filter by search query
    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      discussions = discussions.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.content.toLowerCase().includes(q) ||
          d.subject_name.toLowerCase().includes(q) ||
          d.topic.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          d.author_name.toLowerCase().includes(q)
      );
    }

    // Filter by subject ID
    if (options.subjectId && options.subjectId !== 'ALL') {
      discussions = discussions.filter((d) => d.subject_id === options.subjectId);
    }

    // Filter by topic
    if (options.topic && options.topic !== 'ALL') {
      discussions = discussions.filter((d) => d.topic.toLowerCase() === options.topic?.toLowerCase());
    }

    // Filter by discussion type
    if (options.discussionType && options.discussionType !== 'ALL') {
      discussions = discussions.filter((d) => d.discussion_type === options.discussionType);
    }

    // Filter by status
    if (options.status && options.status !== 'ALL') {
      discussions = discussions.filter((d) => d.status === options.status);
    }

    // Filter by followed subjects
    if (options.onlyFollowing && currentUserId) {
      const followedSubjectIds = this.getFollowedSubjectIds(currentUserId);
      discussions = discussions.filter((d) => followedSubjectIds.includes(d.subject_id));
    }

    // Filter by current user's discussions
    if (options.onlyMyDiscussions && currentUserId) {
      discussions = discussions.filter((d) => d.author_id === currentUserId);
    }

    // Sorting
    switch (options.sortBy) {
      case 'helpful':
        discussions.sort((a, b) => b.helpful_count - a.helpful_count);
        break;
      case 'discussed':
        discussions.sort((a, b) => b.replies_count - a.replies_count);
        break;
      case 'trending':
        // Trending score: helpful * 2 + replies * 3 + views / 10
        discussions.sort((a, b) => {
          const scoreA = a.helpful_count * 2 + a.replies_count * 3 + (a.views || 0) * 0.1;
          const scoreB = b.helpful_count * 2 + b.replies_count * 3 + (b.views || 0) * 0.1;
          return scoreB - scoreA;
        });
        break;
      case 'recent':
      default:
        discussions.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return discussions;
  }

  public getDiscussionById(id: string, incrementView: boolean = false): CommunityDiscussion | null {
    const discussions = this.getStoredDiscussions();
    const index = discussions.findIndex((d) => d.id === id && d.status !== 'REMOVED');
    if (index === -1) return null;

    if (incrementView) {
      discussions[index].views = (discussions[index].views || 0) + 1;
      this.saveDiscussions(discussions);
    }

    const disc = { ...discussions[index] };
    disc.replies = this.getReplies(disc.id);
    return disc;
  }

  public createDiscussion(author: User, dto: CreateDiscussionDTO): CommunityDiscussion {
    const discussions = this.getStoredDiscussions();

    // Auto find subject name if not provided
    const subjectItem = PLATFORM_SUBJECTS.find((s) => s.id === dto.subject_id);
    const subjectName = dto.subject_name || subjectItem?.name || 'General Engineering';

    const newDisc: CommunityDiscussion = {
      id: `disc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      author_id: author.id,
      author_name: author.name,
      author_role: author.role === 'admin' ? 'admin' : 'student',
      author_email: author.email,
      title: dto.title.trim(),
      content: dto.content.trim(),
      subject_id: dto.subject_id,
      subject_name: subjectName,
      topic: dto.topic.trim() || 'General Topic',
      tags: dto.tags && dto.tags.length > 0 ? dto.tags : [subjectName],
      discussion_type: dto.discussion_type || 'GENERAL DISCUSSION',
      status: 'OPEN',
      replies_count: 0,
      helpful_count: 0,
      has_accepted_answer: false,
      views: 1,
      attachments: dto.attachment
        ? [
            {
              id: `att-${Date.now()}`,
              file_name: dto.attachment.file_name,
              file_url: dto.attachment.file_url,
              file_type: dto.attachment.file_type,
              file_size: dto.attachment.file_size,
              created_at: new Date().toISOString(),
            },
          ]
        : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    discussions.unshift(newDisc);
    this.saveDiscussions(discussions);

    // Activity Log
    activityService.logDiscussionCreated(
      author.id,
      author.name,
      author.email,
      newDisc.id,
      newDisc.title,
      newDisc.subject_name,
      newDisc.topic,
      newDisc.discussion_type
    );

    return newDisc;
  }

  public editDiscussion(id: string, userId: string, dto: EditDiscussionDTO): CommunityDiscussion {
    const discussions = this.getStoredDiscussions();
    const index = discussions.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Discussion not found');

    const disc = discussions[index];
    if (disc.author_id !== userId) {
      throw new Error('Unauthorized to edit this discussion');
    }

    const subjectItem = PLATFORM_SUBJECTS.find((s) => s.id === dto.subject_id);
    const subjectName = dto.subject_name || subjectItem?.name || disc.subject_name;

    disc.title = dto.title.trim();
    disc.content = dto.content.trim();
    disc.subject_id = dto.subject_id;
    disc.subject_name = subjectName;
    disc.topic = dto.topic.trim();
    disc.tags = dto.tags;
    disc.discussion_type = dto.discussion_type;
    disc.updated_at = new Date().toISOString();

    discussions[index] = disc;
    this.saveDiscussions(discussions);
    return disc;
  }

  public deleteDiscussion(id: string, user: User): boolean {
    const discussions = this.getStoredDiscussions();
    const index = discussions.findIndex((d) => d.id === id);
    if (index === -1) return false;

    const disc = discussions[index];
    const isAdmin = user.role === 'admin';
    if (!isAdmin && disc.author_id !== user.id) {
      throw new Error('Unauthorized to delete this discussion');
    }

    // Mark as removed
    discussions[index].status = 'REMOVED';
    discussions[index].updated_at = new Date().toISOString();
    this.saveDiscussions(discussions);

    if (isAdmin && disc.author_id !== user.id) {
      notificationService.notifyCommunityModerated(
        disc.author_id,
        disc.id,
        disc.title,
        'removed',
        'Violated community guidelines or was marked by moderation.'
      );
    }

    return true;
  }

  public closeDiscussion(id: string, admin: User, reason: string = 'Topic closed by admin moderation.'): boolean {
    if (admin.role !== 'admin') throw new Error('Only admins can close discussions.');
    const discussions = this.getStoredDiscussions();
    const index = discussions.findIndex((d) => d.id === id);
    if (index === -1) return false;

    discussions[index].status = 'CLOSED';
    discussions[index].closed_reason = reason;
    discussions[index].updated_at = new Date().toISOString();
    this.saveDiscussions(discussions);

    // Notify author
    notificationService.notifyCommunityModerated(
      discussions[index].author_id,
      discussions[index].id,
      discussions[index].title,
      'closed',
      reason
    );

    return true;
  }

  public reopenDiscussion(id: string, admin: User): boolean {
    if (admin.role !== 'admin') throw new Error('Only admins can reopen discussions.');
    const discussions = this.getStoredDiscussions();
    const index = discussions.findIndex((d) => d.id === id);
    if (index === -1) return false;

    discussions[index].status = 'OPEN';
    discussions[index].closed_reason = undefined;
    discussions[index].updated_at = new Date().toISOString();
    this.saveDiscussions(discussions);
    return true;
  }

  // ==========================================
  // REPLIES & THREADED DISCUSSIONS
  // ==========================================

  public getReplies(discussionId: string): CommunityReply[] {
    const allReplies = this.getStoredReplies().filter(
      (r) => r.discussion_id === discussionId && r.status !== 'REMOVED'
    );

    // Group into 2-level threaded structure (Parent replies and Child replies)
    const parentReplies = allReplies.filter((r) => !r.parent_reply_id);
    const childReplies = allReplies.filter((r) => !!r.parent_reply_id);

    // Sort parent replies: Accepted reply first, then by helpful_count desc, then recent
    parentReplies.sort((a, b) => {
      if (a.is_accepted && !b.is_accepted) return -1;
      if (!a.is_accepted && b.is_accepted) return 1;
      if (b.helpful_count !== a.helpful_count) return b.helpful_count - a.helpful_count;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    return parentReplies.map((parent) => ({
      ...parent,
      replies: childReplies
        .filter((child) => child.parent_reply_id === parent.id)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
    }));
  }

  public createReply(author: User, discussionId: string, dto: CreateReplyDTO): CommunityReply {
    const discussions = this.getStoredDiscussions();
    const discIndex = discussions.findIndex((d) => d.id === discussionId);
    if (discIndex === -1) throw new Error('Discussion not found');

    const disc = discussions[discIndex];
    if (disc.status === 'CLOSED') {
      throw new Error('This discussion has been closed and cannot accept new replies.');
    }

    const replies = this.getStoredReplies();
    const newReply: CommunityReply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      discussion_id: discussionId,
      parent_reply_id: dto.parent_reply_id,
      author_id: author.id,
      author_name: author.name,
      author_role: author.role === 'admin' ? 'admin' : 'student',
      author_email: author.email,
      content: dto.content.trim(),
      helpful_count: 0,
      is_accepted: false,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    replies.push(newReply);
    this.saveReplies(replies);

    // Increment reply count on discussion
    discussions[discIndex].replies_count = (discussions[discIndex].replies_count || 0) + 1;
    discussions[discIndex].updated_at = new Date().toISOString();
    this.saveDiscussions(discussions);

    // Activity Log
    activityService.logDiscussionReplied(
      author.id,
      author.name,
      author.email,
      newReply.id,
      disc.id,
      disc.title,
      disc.subject_name
    );

    // Notify discussion author if not replying to oneself
    if (disc.author_id !== author.id) {
      notificationService.notifyCommunityReplied(
        disc.author_id,
        disc.id,
        disc.title,
        author.name
      );
    }

    return newReply;
  }

  public deleteReply(replyId: string, user: User): boolean {
    const replies = this.getStoredReplies();
    const index = replies.findIndex((r) => r.id === replyId);
    if (index === -1) return false;

    const reply = replies[index];
    const isAdmin = user.role === 'admin';
    if (!isAdmin && reply.author_id !== user.id) {
      throw new Error('Unauthorized to delete this reply');
    }

    replies[index].status = 'REMOVED';
    replies[index].updated_at = new Date().toISOString();
    this.saveReplies(replies);

    // Update reply count in discussion
    const discussions = this.getStoredDiscussions();
    const discIndex = discussions.findIndex((d) => d.id === reply.discussion_id);
    if (discIndex !== -1) {
      discussions[discIndex].replies_count = Math.max(
        0,
        (discussions[discIndex].replies_count || 1) - 1
      );
      if (discussions[discIndex].accepted_reply_id === replyId) {
        discussions[discIndex].has_accepted_answer = false;
        discussions[discIndex].accepted_reply_id = undefined;
      }
      this.saveDiscussions(discussions);
    }

    return true;
  }

  // ==========================================
  // HELPFUL REACTIONS & ACCEPTED ANSWER
  // ==========================================

  public toggleHelpfulDiscussion(discussionId: string, user: User): { helpful: boolean; count: number } {
    const helpfulList = this.getStoredDiscHelpful();
    const existingIndex = helpfulList.findIndex(
      (h) => h.discussion_id === discussionId && h.user_id === user.id
    );

    const discussions = this.getStoredDiscussions();
    const discIndex = discussions.findIndex((d) => d.id === discussionId);
    if (discIndex === -1) throw new Error('Discussion not found');

    let helpful = false;
    if (existingIndex > -1) {
      // Remove helpful vote
      helpfulList.splice(existingIndex, 1);
      discussions[discIndex].helpful_count = Math.max(0, discussions[discIndex].helpful_count - 1);
      helpful = false;
    } else {
      // Add helpful vote
      helpfulList.push({
        id: `h-disc-${Date.now()}`,
        discussion_id: discussionId,
        user_id: user.id,
        created_at: new Date().toISOString(),
      });
      discussions[discIndex].helpful_count = (discussions[discIndex].helpful_count || 0) + 1;
      helpful = true;

      // Activity log
      activityService.logDiscussionHelpful(
        user.id,
        user.name,
        user.email,
        discussionId,
        discussions[discIndex].title,
        discussions[discIndex].subject_name
      );

      // Notify author if not self
      if (discussions[discIndex].author_id !== user.id) {
        notificationService.notifyCommunityHelpful(
          discussions[discIndex].author_id,
          discussionId,
          discussions[discIndex].title,
          user.name
        );
      }
    }

    this.saveDiscHelpful(helpfulList);
    this.saveDiscussions(discussions);

    return { helpful, count: discussions[discIndex].helpful_count };
  }

  public isDiscussionHelpful(discussionId: string, userId?: string): boolean {
    if (!userId) return false;
    const helpfulList = this.getStoredDiscHelpful();
    return helpfulList.some((h) => h.discussion_id === discussionId && h.user_id === userId);
  }

  public toggleHelpfulReply(replyId: string, user: User): { helpful: boolean; count: number } {
    const helpfulList = this.getStoredReplyHelpful();
    const existingIndex = helpfulList.findIndex(
      (h) => h.reply_id === replyId && h.user_id === user.id
    );

    const replies = this.getStoredReplies();
    const replyIndex = replies.findIndex((r) => r.id === replyId);
    if (replyIndex === -1) throw new Error('Reply not found');

    let helpful = false;
    if (existingIndex > -1) {
      helpfulList.splice(existingIndex, 1);
      replies[replyIndex].helpful_count = Math.max(0, replies[replyIndex].helpful_count - 1);
      helpful = false;
    } else {
      helpfulList.push({
        id: `h-rep-${Date.now()}`,
        reply_id: replyId,
        user_id: user.id,
        created_at: new Date().toISOString(),
      });
      replies[replyIndex].helpful_count = (replies[replyIndex].helpful_count || 0) + 1;
      helpful = true;
    }

    this.saveReplyHelpful(helpfulList);
    this.saveReplies(replies);

    return { helpful, count: replies[replyIndex].helpful_count };
  }

  public isReplyHelpful(replyId: string, userId?: string): boolean {
    if (!userId) return false;
    const helpfulList = this.getStoredReplyHelpful();
    return helpfulList.some((h) => h.reply_id === replyId && h.user_id === userId);
  }

  public toggleAcceptedAnswer(
    discussionId: string,
    replyId: string,
    user: User
  ): { isAccepted: boolean } {
    const discussions = this.getStoredDiscussions();
    const discIndex = discussions.findIndex((d) => d.id === discussionId);
    if (discIndex === -1) throw new Error('Discussion not found');

    const disc = discussions[discIndex];
    const isAuthor = disc.author_id === user.id;
    const isAdmin = user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      throw new Error('Only the discussion author or an Admin can mark an accepted solution.');
    }

    const replies = this.getStoredReplies();
    const replyIndex = replies.findIndex((r) => r.id === replyId && r.discussion_id === discussionId);
    if (replyIndex === -1) throw new Error('Reply not found');

    const currentlyAccepted = replies[replyIndex].is_accepted;

    // Reset all replies on this discussion
    replies.forEach((r) => {
      if (r.discussion_id === discussionId) {
        r.is_accepted = false;
      }
    });

    let newState = false;
    if (!currentlyAccepted) {
      replies[replyIndex].is_accepted = true;
      discussions[discIndex].has_accepted_answer = true;
      discussions[discIndex].accepted_reply_id = replyId;
      newState = true;

      // Activity log
      activityService.logCommunityAnswerAccepted(
        user.id,
        user.name,
        user.email,
        replyId,
        disc.id,
        disc.title
      );

      // Notify reply author
      if (replies[replyIndex].author_id !== user.id) {
        notificationService.notifyCommunityReplyAccepted(
          replies[replyIndex].author_id,
          disc.id,
          disc.title
        );

        // Learn & Earn Contributor Reward
        tokenService.triggerRewardEvent(
          {
            id: replies[replyIndex].author_id,
            name: replies[replyIndex].author_name,
            email: replies[replyIndex].author_email || '',
            role: replies[replyIndex].author_role as any,
          } as User,
          'ACCEPTED_COMMUNITY_ANSWER',
          replyId,
          disc.title
        );
      }
    } else {
      discussions[discIndex].has_accepted_answer = false;
      discussions[discIndex].accepted_reply_id = undefined;
      newState = false;
    }

    discussions[discIndex].updated_at = new Date().toISOString();

    this.saveReplies(replies);
    this.saveDiscussions(discussions);

    return { isAccepted: newState };
  }

  // ==========================================
  // SUBJECT FOLLOWING
  // ==========================================

  public getFollowedSubjectIds(userId: string): string[] {
    const follows = this.getStoredSubjectFollows();
    return follows.filter((f) => f.user_id === userId).map((f) => f.subject_id);
  }

  public isFollowingSubject(userId: string, subjectId: string): boolean {
    const follows = this.getStoredSubjectFollows();
    return follows.some((f) => f.user_id === userId && f.subject_id === subjectId);
  }

  public toggleFollowSubject(user: User, subjectId: string): boolean {
    const follows = this.getStoredSubjectFollows();
    const existingIndex = follows.findIndex(
      (f) => f.user_id === user.id && f.subject_id === subjectId
    );

    const subjectItem = PLATFORM_SUBJECTS.find((s) => s.id === subjectId);
    const subjectName = subjectItem?.name || subjectId;

    let isFollowing = false;
    if (existingIndex > -1) {
      follows.splice(existingIndex, 1);
      isFollowing = false;
    } else {
      follows.push({
        id: `sf-${Date.now()}`,
        user_id: user.id,
        subject_id: subjectId,
        created_at: new Date().toISOString(),
      });
      isFollowing = true;

      activityService.logSubjectFollowed(
        user.id,
        user.name,
        user.email,
        subjectId,
        subjectName
      );
    }

    this.saveSubjectFollows(follows);
    return isFollowing;
  }

  // ==========================================
  // COMMUNITY REPORTING & MODERATION
  // ==========================================

  public reportContent(
    reporter: User,
    data: {
      contentType: 'discussion' | 'reply';
      contentId: string;
      discussionId: string;
      discussionTitle?: string;
      contentSnippet?: string;
      reason: any;
      notes?: string;
    }
  ): CommunityReport {
    const reports = this.getStoredReports();
    const newReport: CommunityReport = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      reporter_id: reporter.id,
      reporter_name: reporter.name,
      reporter_email: reporter.email,
      content_type: data.contentType,
      content_id: data.contentId,
      discussion_id: data.discussionId,
      discussion_title: data.discussionTitle,
      content_snippet: data.contentSnippet,
      reason: data.reason,
      notes: data.notes,
      status: 'OPEN',
      created_at: new Date().toISOString(),
    };

    reports.unshift(newReport);
    this.saveReports(reports);

    // Activity log
    activityService.logDiscussionReported(
      reporter.id,
      reporter.name,
      reporter.email,
      data.discussionId,
      data.discussionTitle || 'Reported item',
      data.reason
    );

    // Notify admins
    notificationService.notifyCommunityReportedForAdmins(
      newReport.id,
      data.discussionId,
      data.discussionTitle || 'Community item',
      data.reason
    );

    return newReport;
  }

  public getReports(statusFilter?: CommunityReportStatus | 'ALL'): CommunityReport[] {
    let reports = this.getStoredReports();
    if (statusFilter && statusFilter !== 'ALL') {
      reports = reports.filter((r) => r.status === statusFilter);
    }
    return reports.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public updateReportStatus(
    reportId: string,
    status: CommunityReportStatus,
    adminActionTaken?: string
  ): CommunityReport | null {
    const reports = this.getStoredReports();
    const index = reports.findIndex((r) => r.id === reportId);
    if (index === -1) return null;

    reports[index].status = status;
    reports[index].resolved_at = status === 'RESOLVED' || status === 'DISMISSED' ? new Date().toISOString() : undefined;
    reports[index].admin_action_taken = adminActionTaken;

    this.saveReports(reports);
    return reports[index];
  }

  // ==========================================
  // METRICS & ANALYTICS
  // ==========================================

  public getCommunityMetrics(): CommunityMetricsSummary {
    const discussions = this.getStoredDiscussions();
    const activeDiscussions = discussions.filter((d) => d.status !== 'REMOVED');
    const replies = this.getStoredReplies().filter((r) => r.status !== 'REMOVED');
    const reports = this.getStoredReports();

    const oneDayAgo = Date.now() - 24 * 3600 * 1000;
    const newDiscussions = activeDiscussions.filter(
      (d) => new Date(d.created_at).getTime() > oneDayAgo
    ).length;

    const totalHelpful = activeDiscussions.reduce((sum, d) => sum + (d.helpful_count || 0), 0);
    const acceptedCount = activeDiscussions.filter((d) => d.has_accepted_answer).length;
    const closedCount = activeDiscussions.filter((d) => d.status === 'CLOSED').length;
    const openReports = reports.filter((r) => r.status === 'OPEN').length;

    // Group by Subject
    const subjectMap: Record<string, { name: string; count: number }> = {};
    activeDiscussions.forEach((d) => {
      if (!subjectMap[d.subject_id]) {
        subjectMap[d.subject_id] = { name: d.subject_name, count: 0 };
      }
      subjectMap[d.subject_id].count++;
    });

    const mostDiscussedSubjects = Object.keys(subjectMap)
      .map((id) => ({
        subjectId: id,
        subjectName: subjectMap[id].name,
        count: subjectMap[id].count,
      }))
      .sort((a, b) => b.count - a.count);

    // Group by Topic
    const topicMap: Record<string, { topic: string; subjectName: string; count: number }> = {};
    activeDiscussions.forEach((d) => {
      const key = `${d.subject_name}::${d.topic}`;
      if (!topicMap[key]) {
        topicMap[key] = { topic: d.topic, subjectName: d.subject_name, count: 0 };
      }
      topicMap[key].count++;
    });

    const mostActiveTopics = Object.values(topicMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Most helpful discussions
    const mostHelpfulDiscussions = [...activeDiscussions]
      .sort((a, b) => b.helpful_count - a.helpful_count)
      .slice(0, 5)
      .map((d) => ({
        id: d.id,
        title: d.title,
        subjectName: d.subject_name,
        helpfulCount: d.helpful_count,
        repliesCount: d.replies_count,
      }));

    return {
      totalDiscussions: activeDiscussions.length,
      newDiscussions,
      totalReplies: replies.length,
      helpfulReactions: totalHelpful,
      acceptedAnswers: acceptedCount,
      reportedDiscussions: openReports,
      closedDiscussions: closedCount,
      activeDiscussions: activeDiscussions.filter((d) => d.status === 'OPEN').length,
      mostDiscussedSubjects,
      mostActiveTopics,
      mostHelpfulDiscussions,
    };
  }

  public getPopularTopics(): Array<{ topic: string; count: number; subjectId: string; subjectName: string }> {
    const discussions = this.getStoredDiscussions().filter((d) => d.status === 'OPEN');
    const map: Record<string, { topic: string; count: number; subjectId: string; subjectName: string }> = {};

    discussions.forEach((d) => {
      const key = `${d.subject_id}::${d.topic}`;
      if (!map[key]) {
        map[key] = { topic: d.topic, count: 0, subjectId: d.subject_id, subjectName: d.subject_name };
      }
      map[key].count++;
    });

    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 10);
  }
}

export const communityService = new CommunityService();
