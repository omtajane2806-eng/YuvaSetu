import { ContentItem } from '../types/content';
import {
  DSA_SEARCHING_SORTING_PAGES,
  DSA_HASHING_PAGES,
} from './dsaRealPdfData';

export const SEEDED_DEMO_CONTENT: ContentItem[] = [
  // 1. REAL DSA PDF 1: DSA Searching and Sorting (40 Pages)
  {
    id: 'material-dsa-searching-sorting',
    creator_id: 'user-admin-om',
    created_by: 'Om Tajane (YuvaSetu Admin)',
    creator: {
      id: 'user-admin-om',
      name: 'Om Tajane',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240',
      role: 'YuvaSetu Admin',
      college: 'YuvaSetu Academic Lead',
      reputation: 5000,
      followersCount: 3200,
    },
    title: 'DSA Searching and Sorting',
    description:
      'Complete 40-page curriculum handwritten notes covering Data Structures fundamentals, Space & Time complexity, Big-O / Omega / Theta notations, Linear Search, Binary Search, Selection Sort, Bubble Sort, Insertion Sort, Merge Sort, Quick Sort, and Radix Sort with step-by-step algorithms and tracing.',
    subject_id: 'dsa',
    subject_name: 'Data Structures & Algorithms',
    topic: 'Searching and Sorting',
    content_type: 'pdf',
    thumbnail:
      'https://images.unsplash.com/photo-1516116211227-bbc06bfb8e5c?auto=format&fit=crop&q=80&w=600',
    pdf_data: {
      fileName: 'DSA_Searching_and_Sorting_40Pages_Complete.pdf',
      fileSize: '14.2 MB',
      pageCount: 40,
      downloadUrl: '#',
      pages: DSA_SEARCHING_SORTING_PAGES,
      previewPages: [
        'Page 1: Unit I Introduction of Data Structures (Data, Information, Knowledge, Logical model)',
        'Page 2: Need & Classification (Primitive vs Non-Primitive, Linear vs Non-Linear)',
        'Page 11: Linear Search Frequency Step Count (O(n))',
        'Page 21: Binary Search Algorithm & Mid Calculation (O(log n))',
        'Page 25: Selection Sort & Comparison-based Sorting Overview',
        'Page 28: Bubble Sort Passes & Complexity',
        'Page 30: Insertion Sort Incremental Method',
        'Page 34: Merge Sort Divide & Conquer Tree Splitting',
        'Page 37: Quick Sort Partitioning & Pivot Tracing',
        'Page 39: Radix Sort LSD/MSD Integer Sorting',
      ],
    },
    tags: [
      'Data Structures',
      'Algorithms',
      'DSA',
      'Searching and Sorting',
      'Searching',
      'Sorting',
      'Linear Search',
      'Binary Search',
      'Selection Sort',
      'Bubble Sort',
      'Insertion Sort',
      'Merge Sort',
      'Quick Sort',
      'Radix Sort',
      'Asymptotic Notation',
      'Big-O',
      'Admin Published',
      'Semester Exams',
    ],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 890,
    likes: 145,
    created_at: '2026-02-05T09:00:00Z',
    updated_at: '2026-02-05T09:00:00Z',
    isDemo: false,
    status: 'published',
    is_admin_published: true,
  },

  // 2. REAL DSA PDF 2: DSA Hashing (25 Pages)
  {
    id: 'material-dsa-hashing',
    creator_id: 'user-admin-om',
    created_by: 'Om Tajane (YuvaSetu Admin)',
    creator: {
      id: 'user-admin-om',
      name: 'Om Tajane',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240',
      role: 'YuvaSetu Admin',
      college: 'YuvaSetu Academic Lead',
      reputation: 5000,
      followersCount: 3200,
    },
    title: 'DSA Hashing',
    description:
      'Complete 25-page curriculum handwritten notes covering Hashing introduction, Hash Table mechanics, Collision, Probe, Synonym, Overflow, Load Factor (λ), Hash Functions (Division, Multiplication, Folding, Mid-Square, Universal), Rehashing, Extendable Hashing, Collision Resolution (Separate Chaining vs Open Addressing: Linear Probing, Quadratic Probing, Double Hashing), and Skip Lists.',
    subject_id: 'dsa',
    subject_name: 'Data Structures & Algorithms',
    topic: 'Hashing',
    content_type: 'pdf',
    thumbnail:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
    pdf_data: {
      fileName: 'DSA_Hashing_25Pages_Complete_Notes.pdf',
      fileSize: '9.8 MB',
      pageCount: 25,
      downloadUrl: '#',
      pages: DSA_HASHING_PAGES,
      previewPages: [
        'Page 1: Unit I Hashing Overview (O(1) access intuition & Student records need)',
        'Page 2: Hash Table Structure & Key to Index Mapping',
        'Page 4: Perfect Hash Function & Load Factor λ = n/m',
        'Page 5: Division Method h(k) = k mod m',
        'Page 6: Multiplication Method & Knuth Golden Ratio Multiplier',
        'Page 11: Rehashing & Dynamic Hash Table Resizing (O(n))',
        'Page 12: Extendable Hashing (Global Depth, Local Depth, Directory Doubling)',
        'Page 17: Separate Chaining vs Open Addressing Overview',
        'Page 19: Linear Probing with Table Insertions & Step Tracing',
        'Page 22: Quadratic Probing & Primary Clustering Avoidance',
        'Page 23: Double Hashing h(k, i) = (h1(k) + i*h2(k)) mod m',
        'Page 24: Skip List Probabilistic Data Structure & Redis Applications',
      ],
    },
    tags: [
      'Data Structures',
      'Algorithms',
      'DSA',
      'Hashing',
      'Hash Table',
      'Hash Function',
      'Collision Resolution',
      'Linear Probing',
      'Quadratic Probing',
      'Double Hashing',
      'Rehashing',
      'Extendable Hashing',
      'Skip List',
      'Load Factor',
      'Admin Published',
      'Exam Notes',
    ],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 740,
    likes: 128,
    created_at: '2026-02-06T11:30:00Z',
    updated_at: '2026-02-06T11:30:00Z',
    isDemo: false,
    status: 'published',
    is_admin_published: true,
  },

  // DBMS 1: Normalization Complete Notes
  {
    id: 'content-dbms-normalization',
    creator_id: 'user-creator-rohan',
    creator: {
      id: 'user-creator-rohan',
      name: 'Rohan Rokade',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=240',
      role: 'Student Creator',
      college: 'COEP Technological University',
      reputation: 340,
      followersCount: 52,
    },
    title: 'DBMS Normalization — Complete Notes',
    description: 'Master 1NF, 2NF, 3NF, and BCNF step-by-step with real-world functional dependency tables, anomaly identification, and lossless join decomposition examples.',
    subject_id: 'dbms',
    subject_name: 'DBMS & SQL',
    content_type: 'note',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=600',
    tags: ['DBMS', 'Normalization', '1NF', '2NF', '3NF', 'BCNF', 'GATE CSE', 'Semester Exams'],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 245,
    likes: 32,
    created_at: '2026-02-10T14:30:00Z',
    updated_at: '2026-02-10T14:30:00Z',
    isDemo: true,
    status: 'published',
    content_body: `
# Database Normalization: From Intuition to Exam Mastery

> **Author**: Rohan Rokade (COEP Tech) • **Subject**: DBMS & SQL • **Reading Time**: 12 mins

---

## 1. What is Normalization and Why Do We Need It?

Normalization is the systematic process of organizing data in a relational database to:
1. **Eliminate Redundant Data** (e.g., storing the student's department head name in every enrollment record).
2. **Prevent Modification Anomalies**:
   - **Insertion Anomaly**: Inability to record new data without creating redundant dummy fields.
   - **Deletion Anomaly**: Unintentional loss of secondary data when a primary record is deleted.
   - **Update Anomaly**: Data inconsistency caused by updating information in one row but missing another row.

---

## 2. Functional Dependency (FD) Primer

A functional dependency is a constraint between two sets of attributes in a relation:
$$\\alpha \\rightarrow \\beta$$
*(Read: attribute $\\alpha$ functionally determines attribute $\\beta$)*

*Example*: In a Student relation, \`StudentID -> {Name, Email, Branch}\`.

---

## 3. The Normal Forms Hierarchy

\`\`\`text
Unnormalized Form (UNF)
        ↓  (Remove multi-valued & repeating attributes)
First Normal Form (1NF)
        ↓  (Remove Partial Functional Dependencies)
Second Normal Form (2NF)
        ↓  (Remove Transitive Functional Dependencies)
Third Normal Form (3NF)
        ↓  (Every determinant must be a Super Key)
Boyce-Codd Normal Form (BCNF)
\`\`\`

---

### Step 1: First Normal Form (1NF)
* **Rule**: Each attribute of a relation must contain only **atomic (indivisible) values**, and each record must be unique.
* **Bad Schema**: \`Student(ID, Name, Subjects: ["Math", "DBMS", "OS"])\`
* **1NF Schema**: Split multi-valued cells into distinct rows with a single subject per row.

---

### Step 2: Second Normal Form (2NF)
* **Rule**: Must be in 1NF **AND** no non-prime attribute should depend on a proper subset of any candidate key (No **Partial Dependencies**).
* **When to Check**: Only relevant if the Candidate Key is **composite** (consists of $\\ge 2$ columns).
* **Fix**: Decompose the relation so that attributes depending on part of the key move to their own relation.

---

### Step 3: Third Normal Form (3NF)
* **Rule**: Must be in 2NF **AND** for every non-trivial functional dependency $X \\rightarrow Y$, either:
  1. $X$ is a **Super Key**, OR
  2. $Y$ is a **Prime Attribute** (part of some candidate key).
* **Intuition**: "Every non-key attribute must provide a fact about the key, the whole key, and nothing but the key."

---

### Step 4: Boyce-Codd Normal Form (BCNF)
* **Rule**: For every non-trivial dependency $X \\rightarrow Y$, $X$ **MUST BE** a **Super Key**.
* BCNF is stricter than 3NF because it removes the exception for prime attributes on the right-hand side.

---

## 4. Summary Comparison Table

| Normal Form | Target Anomaly Removed | Key Condition |
| :--- | :--- | :--- |
| **1NF** | Multi-valued attributes | Atomic cell values only |
| **2NF** | Partial dependencies | Non-prime attributes depend on full Candidate Key |
| **3NF** | Transitive dependencies | In $X \\rightarrow Y$, $X$ is Super Key OR $Y$ is Prime |
| **BCNF** | Overlapping Candidate Keys | In $X \\rightarrow Y$, $X$ MUST be Super Key |

---

## 5. Quick Exam Practice Tips
- **Tip 1**: Always find all Candidate Keys of the relation before checking normal form conditions.
- **Tip 2**: For 2NF, check if any non-prime attribute depends on just one attribute of a multi-attribute key.
- **Tip 3**: Lossless Join Property is guaranteed in 3NF and BCNF decompositions.
`,
  },

  // DBMS 2: SQL JOINs Explained
  {
    id: 'content-dbms-sql-joins',
    creator_id: 'user-creator-anand',
    creator: {
      id: 'user-creator-anand',
      name: 'Dr. Anand Ramanathan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240',
      role: 'Former IIT Faculty & Mentor',
      college: 'YuvaSetu Academic Lead',
      reputation: 1850,
      followersCount: 1420,
    },
    title: 'SQL JOINs Explained: Inner, Left, Right & Full Outer',
    description: 'Visual intuition and exact Venn diagrams for understanding SQL relational joins, ON vs WHERE clauses, NULL handling, and query performance tips.',
    subject_id: 'dbms',
    subject_name: 'DBMS & SQL',
    content_type: 'note',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
    tags: ['SQL', 'JOINs', 'DBMS', 'Inner Join', 'Left Join', 'Query Optimization'],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 312,
    likes: 48,
    created_at: '2026-02-12T10:15:00Z',
    updated_at: '2026-02-12T10:15:00Z',
    isDemo: true,
    status: 'published',
    content_body: `
# SQL JOINs: Visual & Practical Guide

## 1. The 4 Fundamental JOIN Types

### 1. INNER JOIN
Returns only records that have matching values in both tables.

\`\`\`sql
SELECT students.name, courses.title
FROM students
INNER JOIN courses ON students.course_id = courses.id;
\`\`\`

### 2. LEFT (OUTER) JOIN
Returns all records from the left table, plus matched records from the right table. If no match exists, NULL is filled.

\`\`\`sql
SELECT students.name, submissions.score
FROM students
LEFT JOIN submissions ON students.id = submissions.student_id;
\`\`\`

### 3. RIGHT (OUTER) JOIN
Returns all records from the right table, plus matched records from the left table.

### 4. FULL OUTER JOIN
Returns all records when there is a match in either left or right table records.

---

## 2. Common Pitfall: ON vs WHERE in Outer Joins
- Conditions inside \`ON\` filter during the join operation.
- Conditions inside \`WHERE\` filter *after* the join has been generated, which can unintentionally convert a LEFT JOIN into an INNER JOIN if you filter out NULL rows!
`,
  },

  // DBMS 3: ER Diagram Quick Guide (PDF)
  {
    id: 'content-dbms-er-diagram',
    creator_id: 'user-student-aryan',
    creator: {
      id: 'user-student-aryan',
      name: 'Aryan Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=240',
      role: 'Student Creator',
      college: 'IIT Bombay',
      reputation: 240,
      followersCount: 38,
    },
    title: 'ER Diagram Quick Guide & Relational Schema Mapping',
    description: 'High-yield PDF cheat sheet illustrating Entity-Relationship notation (Chen & Crow’s Foot), cardinality ratios (1:1, 1:N, M:N), weak entity conversion, and primary key rules.',
    subject_id: 'dbms',
    subject_name: 'DBMS & SQL',
    content_type: 'pdf',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
    pdf_data: {
      fileName: 'DBMS_ER_Diagram_Mapping_Guide_v2.pdf',
      fileSize: '3.4 MB',
      pageCount: 8,
      downloadUrl: '#',
      previewPages: [
        'Page 1: ER Notation Symbols (Rectangles, Ellipses, Diamonds, Double lines)',
        'Page 2: Cardinality & Participation Constraints (Total vs Partial)',
        'Page 3: Weak Entities & Identifying Relationships',
        'Page 4: Step-by-step ER to Relational Table Conversion Rules',
      ],
    },
    tags: ['ER Diagrams', 'DBMS', 'Relational Schema', 'PDF Notes', 'Design Patterns'],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 189,
    likes: 27,
    created_at: '2026-02-14T09:00:00Z',
    updated_at: '2026-02-14T09:00:00Z',
    isDemo: true,
    status: 'published',
  },

  // DBMS 4: Indexing & B+ Trees (Video)
  {
    id: 'content-dbms-bplus-trees',
    creator_id: 'user-creator-anand',
    creator: {
      id: 'user-creator-anand',
      name: 'Dr. Anand Ramanathan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240',
      role: 'Former IIT Faculty & Mentor',
      college: 'YuvaSetu Academic Lead',
      reputation: 1850,
      followersCount: 1420,
    },
    title: 'Indexing & B+ Trees in Databases Masterclass',
    description: 'Visual walkthrough of database disk block storage, dense vs sparse indexes, B+ Tree node splitting, and logarithmic lookups for high-throughput queries.',
    subject_id: 'dbms',
    subject_name: 'DBMS & SQL',
    content_type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    semester: 'Semester 4',
    branch: 'Computer Science & Engineering',
    faculty_name: 'Prof. Om Tajane',
    difficulty: 'Intermediate',
    language: 'English',
    video_data: {
      videoSource: 'youtube',
      youtubeVideoId: 'aZjYr87r1b8',
      videoUrl: 'https://www.youtube.com/watch?v=aZjYr87r1b8',
      embedUrl: 'https://www.youtube-nocookie.com/embed/aZjYr87r1b8',
      duration: '42 mins',
      isEmbed: true,
      resolution: '1080p 60fps',
      difficulty: 'Intermediate',
      language: 'English',
      semester: 'Semester 4',
      branch: 'Computer Science & Engineering',
      facultyName: 'Prof. Om Tajane',
      chapters: [
        { title: '00:00 - Why Linear Scans Fail at Scale', time: '00:00', seconds: 0 },
        { title: '08:30 - Clustered vs Non-Clustered Indexes', time: '08:30', seconds: 510 },
        { title: '19:15 - B+ Tree Insertion & Node Splitting', time: '19:15', seconds: 1155 },
        { title: '32:40 - Range Queries with Leaf Node Linked Lists', time: '32:40', seconds: 1960 },
      ],
    },
    tags: ['B+ Trees', 'Database Indexing', 'SQL Performance', 'Storage Engine', 'Video Lecture'],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 520,
    likes: 89,
    created_at: '2026-02-15T11:00:00Z',
    updated_at: '2026-02-15T11:00:00Z',
    isDemo: true,
    status: 'published',
  },

  // DSA 1: Binary Trees Revision Notes
  {
    id: 'content-dsa-binary-trees',
    creator_id: 'user-student-aryan',
    creator: {
      id: 'user-student-aryan',
      name: 'Aryan Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=240',
      role: 'Student Creator',
      college: 'IIT Bombay',
      reputation: 240,
      followersCount: 38,
    },
    title: 'Binary Trees & BST — Revision Notes',
    description: 'Crisp handwritten-style summary covering Tree Traversals (Inorder, Preorder, Postorder, Level-Order), Height calculation, Diameter of Tree, and BST validation.',
    subject_id: 'dsa',
    subject_name: 'Data Structures & Algorithms',
    content_type: 'note',
    thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc06bfb8e5c?auto=format&fit=crop&q=80&w=600',
    tags: ['Data Structures', 'Binary Trees', 'BST', 'Algorithms', 'Traversals', 'LeetCode'],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 430,
    likes: 64,
    created_at: '2026-02-11T16:00:00Z',
    updated_at: '2026-02-11T16:00:00Z',
    isDemo: true,
    status: 'published',
    content_body: `
# Binary Trees & Binary Search Trees (BST): Essential Revision

## 1. Core Properties
- **Max nodes at level $L$**: $2^L$ (where root is level 0).
- **Max nodes in tree of height $H$**: $2^{H+1} - 1$.
- **Min height for $N$ nodes**: $\\lceil \\log_2(N+1) \\rceil - 1$.

---

## 2. Tree Traversals Cheat Sheet

| Traversal | Order of Visit | Typical Use Case |
| :--- | :--- | :--- |
| **Inorder** | Left $\\rightarrow$ Root $\\rightarrow$ Right | Gives sorted order in BST |
| **Preorder** | Root $\\rightarrow$ Left $\\rightarrow$ Right | Serialization / Copying a tree |
| **Postorder** | Left $\\rightarrow$ Right $\\rightarrow$ Root | Deletion of tree / Bottom-up calculation |
| **Level Order** | Breadth-First (Queue) | Shortest path in unweighted tree |

---

## 3. Height of a Binary Tree (Clean Recursive Implementation)

\`\`\`python
def max_depth(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
\`\`\`

---

## 4. Validating a Binary Search Tree (BST)

\`\`\`python
def is_valid_bst(root: Optional[TreeNode], min_val=float('-inf'), max_val=float('inf')) -> bool:
    if not root:
        return True
    if not (min_val < root.val < max_val):
        return False
    return is_valid_bst(root.left, min_val, root.val) and is_valid_bst(root.right, root.val, max_val)
\`\`\`
`,
  },

  // DSA 2: Stack and Queue Explained
  {
    id: 'content-dsa-stack-queue',
    creator_id: 'user-creator-rohan',
    creator: {
      id: 'user-creator-rohan',
      name: 'Rohan Rokade',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=240',
      role: 'Student Creator',
      college: 'COEP Technological University',
      reputation: 340,
      followersCount: 52,
    },
    title: 'Stack and Queue Explained: LIFO vs FIFO & Real-world Applications',
    description: 'Detailed analysis of Stack & Queue ADTs, array vs linked list backing stores, monotonic stacks, infix-to-postfix conversion, and BFS queues.',
    subject_id: 'dsa',
    subject_name: 'Data Structures & Algorithms',
    content_type: 'note',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
    tags: ['Stack', 'Queue', 'LIFO', 'FIFO', 'Monotonic Stack', 'DSA'],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 298,
    likes: 39,
    created_at: '2026-02-13T12:00:00Z',
    updated_at: '2026-02-13T12:00:00Z',
    isDemo: true,
    status: 'published',
    content_body: `
# Stack (LIFO) & Queue (FIFO) Architecture

## 1. Stack: Last In, First Out
- **Operations**: \`push()\`, \`pop()\`, \`peek()\` all in $O(1)$ time complexity.
- **Top Classic Problems**:
  1. Valid Parentheses Checking using a character stack.
  2. Next Greater Element using a **Monotonic Decreasing Stack**.
  3. Expression Evaluation (Reverse Polish Notation).

## 2. Queue: First In, First Out
- **Operations**: \`enqueue()\`, \`dequeue()\`, \`front()\` in $O(1)$ time complexity.
- **Variations**:
  - Circular Queue (avoids memory wastage in fixed arrays)
  - Deque (Double Ended Queue)
  - Priority Queue (Backed by Min/Max Heap)
`,
  },

  // DSA 3: Linked List Basics (PDF)
  {
    id: 'content-dsa-linked-list-pdf',
    creator_id: 'user-student-priya',
    creator: {
      id: 'user-student-priya',
      name: 'Priya Nair',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=240',
      role: 'Student Creator',
      college: 'BITS Pilani',
      reputation: 410,
      followersCount: 65,
    },
    title: 'Linked List Basics & Two-Pointer Techniques Handout',
    description: 'Illustrated PDF guide breaking down Singly, Doubly, and Circular Linked Lists with Floyd’s Cycle Detection (Hare & Tortoise), reversing in-place, and merging sorted lists.',
    subject_id: 'dsa',
    subject_name: 'Data Structures & Algorithms',
    content_type: 'pdf',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
    pdf_data: {
      fileName: 'LinkedList_TwoPointers_MasterHandout.pdf',
      fileSize: '2.8 MB',
      pageCount: 6,
      downloadUrl: '#',
      previewPages: [
        'Page 1: Memory Layout vs Contiguous Arrays',
        'Page 2: Node Pointer Manipulation & Edge Cases',
        'Page 3: Floyd Cycle Detection Derivation & Fast-Slow Pointer',
        'Page 4: In-Place Linked List Reversal Algorithm',
      ],
    },
    tags: ['Linked List', 'Two Pointer', 'Floyd Cycle', 'PDF', 'DSA Practice'],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 340,
    likes: 51,
    created_at: '2026-02-16T15:00:00Z',
    updated_at: '2026-02-16T15:00:00Z',
    isDemo: true,
    status: 'published',
  },

  // Python 1: Python Functions & Scopes
  {
    id: 'content-python-functions',
    creator_id: 'user-student-aryan',
    creator: {
      id: 'user-student-aryan',
      name: 'Aryan Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=240',
      role: 'Student Creator',
      college: 'IIT Bombay',
      reputation: 240,
      followersCount: 38,
    },
    title: 'Python Functions, Lambdas & Scope — Quick Notes',
    description: 'Concise review of *args, **kwargs, default argument traps, LEGB variable scoping rules, closures, and first-class functional programming in Python 3.',
    subject_id: 'python',
    subject_name: 'Python Programming',
    content_type: 'note',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=600',
    tags: ['Python', 'Functions', 'Lambdas', 'LEGB Scope', 'Pythonic Code'],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 210,
    likes: 31,
    created_at: '2026-02-17T08:30:00Z',
    updated_at: '2026-02-17T08:30:00Z',
    isDemo: true,
    status: 'published',
    content_body: `
# Python Functions & Scoping Principles

## 1. The LEGB Scope Resolution Rule
When Python looks up a variable name, it checks in this strict order:
1. **L**ocal: Inside the current function.
2. **E**nclosing: In any outer enclosing defs (closures).
3. **G**lobal: Module-level variables.
4. **B**uilt-in: Python's pre-defined names like \`len\`, \`range\`, \`print\`.

\`\`\`python
x = "global"

def outer():
    x = "enclosing"
    def inner():
        nonlocal x
        x = "modified enclosing"
    inner()
    return x
\`\`\`

---

## 2. *args and **kwargs Demystified
- \`*args\`: Collects positional arguments into a **tuple**.
- \`**kwargs\`: Collects keyword arguments into a **dict**.
`,
  },

  // Python 2: Python OOP Explained
  {
    id: 'content-python-oop',
    creator_id: 'user-student-priya',
    creator: {
      id: 'user-student-priya',
      name: 'Priya Nair',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=240',
      role: 'Student Creator',
      college: 'BITS Pilani',
      reputation: 410,
      followersCount: 65,
    },
    title: 'Python OOP Explained: Classes, Inheritance & Dunder Methods',
    description: 'Intuitive guide to Object-Oriented Programming in Python: __init__, __str__, __repr__, super(), multiple inheritance, Method Resolution Order (MRO), and encapsulation.',
    subject_id: 'python',
    subject_name: 'Python Programming',
    content_type: 'note',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    tags: ['Python', 'OOP', 'Classes', 'Inheritance', 'Dunder Methods', 'Design Patterns'],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 375,
    likes: 54,
    created_at: '2026-02-18T10:00:00Z',
    updated_at: '2026-02-18T10:00:00Z',
    isDemo: true,
    status: 'published',
    content_body: `
# Object-Oriented Programming (OOP) in Python

## 1. The Power of Dunder (Magic) Methods

\`\`\`python
class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other: 'Vector') -> 'Vector':
        return Vector(self.x + other.x, self.y + other.y)

    def __repr__(self) -> str:
        return f"Vector({self.x}, {self.y})"

v1 = Vector(2, 3)
v2 = Vector(4, 1)
print(v1 + v2)  # Vector(6, 4)
\`\`\`

## 2. Method Resolution Order (MRO)
Python uses the **C3 Linearization Algorithm** to resolve method calls across complex multiple inheritance hierarchies. You can inspect it anytime using \`ClassName.__mro__\`.
`,
  },

  // OS 1: Process Scheduling Algorithms
  {
    id: 'content-os-process-scheduling',
    creator_id: 'user-creator-rohan',
    creator: {
      id: 'user-creator-rohan',
      name: 'Rohan Rokade',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=240',
      role: 'Student Creator',
      college: 'COEP Technological University',
      reputation: 340,
      followersCount: 52,
    },
    title: 'Operating Systems: Process Scheduling Algorithms Compared',
    description: 'Complete breakdown with Gantt charts: FCFS, Shortest Job First (SJF / SRTF), Priority Scheduling, and Round Robin (RR) with optimal time-quantum calculation.',
    subject_id: 'os',
    subject_name: 'Operating Systems',
    content_type: 'note',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    tags: ['Operating Systems', 'Process Scheduling', 'Round Robin', 'SJF', 'Gantt Chart', 'OS'],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 280,
    likes: 42,
    created_at: '2026-02-18T14:20:00Z',
    updated_at: '2026-02-18T14:20:00Z',
    isDemo: true,
    status: 'published',
    content_body: `
# CPU Process Scheduling Algorithms

## 1. Key Evaluation Metrics
- **Turnaround Time (TAT)** = Completion Time - Arrival Time
- **Waiting Time (WT)** = Turnaround Time - Burst Time
- **Response Time (RT)** = First CPU Allocation Time - Arrival Time

---

## 2. Algorithms Comparison Summary

| Algorithm | Preemptive? | Starvation Possible? | Optimal For |
| :--- | :--- | :--- | :--- |
| **FCFS** | No | No (Convoy Effect) | Simple Batch Systems |
| **SJF / SRTF** | Preemptive variant (SRTF) | Yes (Long jobs starve) | Minimum Average Waiting Time |
| **Priority** | Both variants | Yes (Low priority) | Real-time & Kernel priority tasks |
| **Round Robin** | Yes (Time Quantum) | No | Interactive Time-sharing Systems |
`,
  },

  // CN 1: OSI vs TCP/IP Model
  {
    id: 'content-cn-osi-tcp',
    creator_id: 'user-student-aryan',
    creator: {
      id: 'user-student-aryan',
      name: 'Aryan Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=240',
      role: 'Student Creator',
      college: 'IIT Bombay',
      reputation: 240,
      followersCount: 38,
    },
    title: 'Computer Networks: OSI 7 Layers vs TCP/IP Model Breakdown',
    description: 'Intuitive protocol stack mapping from Physical to Application layer, data encapsulation (Segments, Packets, Frames, Bits), and port number cheat sheet.',
    subject_id: 'cn',
    subject_name: 'Computer Networks',
    content_type: 'note',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
    tags: ['Computer Networks', 'OSI Model', 'TCP/IP', 'Networking', 'Protocols'],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 310,
    likes: 45,
    created_at: '2026-02-19T09:00:00Z',
    updated_at: '2026-02-19T09:00:00Z',
    isDemo: true,
    status: 'published',
    content_body: `
# OSI 7-Layer Model & Protocol Architecture

## 1. The 7 Layers (Mnemonic: Please Do Not Throw Sausage Pizza Away)
1. **Physical**: Transmits raw bits over cables/radio.
2. **Data Link**: Frames, MAC Addressing, Error Detection (CRC).
3. **Network**: Packets, Logical IP Addressing, Routing (OSPF, BGP).
4. **Transport**: Segments, Port numbers, End-to-End Reliability (TCP vs UDP).
5. **Session**: Manages dialogs and connection states.
6. **Presentation**: Data formatting, Encryption (TLS/SSL), Compression.
7. **Application**: HTTP, DNS, SMTP, SSH, WebSockets.
`,
  },

  // AI/ML 1: Neural Networks from Scratch (Video)
  {
    id: 'content-aiml-neural-networks',
    creator_id: 'user-creator-anand',
    creator: {
      id: 'user-creator-anand',
      name: 'Dr. Anand Ramanathan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240',
      role: 'Former IIT Faculty & Mentor',
      college: 'YuvaSetu Academic Lead',
      reputation: 1850,
      followersCount: 1420,
    },
    title: 'Neural Networks from Scratch — Mathematical Intuition',
    description: 'Step-by-step vector calculus behind Forward Propagation, Cross-Entropy Loss, Matrix Gradients, and Backpropagation with chain rule visualization.',
    subject_id: 'aiml',
    subject_name: 'AI & Machine Learning',
    content_type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600',
    semester: 'Semester 6',
    branch: 'Artificial Intelligence & Data Science',
    faculty_name: 'Dr. Neha Kulkarni',
    difficulty: 'Advanced',
    language: 'English',
    video_data: {
      videoSource: 'youtube',
      youtubeVideoId: 'aircAruvnKk',
      videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
      embedUrl: 'https://www.youtube-nocookie.com/embed/aircAruvnKk',
      duration: '38 mins',
      isEmbed: true,
      resolution: '1080p 60fps',
      difficulty: 'Advanced',
      language: 'English',
      semester: 'Semester 6',
      branch: 'Artificial Intelligence & Data Science',
      facultyName: 'Dr. Neha Kulkarni',
      chapters: [
        { title: '00:00 - Perceptrons & Linear Classifiers', time: '00:00', seconds: 0 },
        { title: '11:20 - Activation Functions (ReLU vs Sigmoid vs GELU)', time: '11:20', seconds: 680 },
        { title: '22:45 - The Chain Rule & Error Gradient Flow', time: '22:45', seconds: 1365 },
        { title: '32:10 - Gradient Descent Optimizers (Adam vs SGD)', time: '32:10', seconds: 1930 },
      ],
    },
    tags: ['Machine Learning', 'Neural Networks', 'Backpropagation', 'Deep Learning', 'Video Lecture'],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 640,
    likes: 112,
    created_at: '2026-02-19T12:00:00Z',
    updated_at: '2026-02-19T12:00:00Z',
    isDemo: true,
    status: 'published',
  },

  // 12. TOKEN-GATED ADVANCED MASTERCLASS 1: Advanced Binary Search Trees & AVL Rotations (50 VT)
  {
    id: 'material-dsa-advanced-trees',
    creator_id: 'user-admin-om',
    created_by: 'Om Tajane (YuvaSetu Admin)',
    creator: {
      id: 'user-admin-om',
      name: 'Om Tajane',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240',
      role: 'YuvaSetu Admin',
      college: 'YuvaSetu Academic Lead',
      reputation: 5000,
      followersCount: 3200,
    },
    title: 'Advanced Binary Search Trees & AVL Rotations Masterclass',
    description:
      'Curated advanced monograph on self-balancing BSTs, AVL Tree LL/RR/LR/RL rotation mathematical proofs, Red-Black tree coloring rules, and B+ Tree indexing used in relational storage engines.',
    subject_id: 'dsa',
    subject_name: 'Data Structures & Algorithms',
    topic: 'Advanced Trees & Balanced Structures',
    content_type: 'note',
    thumbnail:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    content_body: `# Advanced Binary Search Trees & AVL Rotations Masterclass

## 1. The Balance Factor Metric
In standard BSTs, worst-case insertions result in degenerate linked lists with $O(N)$ lookup. An **AVL Tree** enforces the strict height-balance invariant:

$$\\text{Balance Factor } BF(v) = \\text{height}(\\text{left}(v)) - \\text{height}(\\text{right}(v)) \\in \\{-1, 0, 1\\}$$

### Key Invariants:
- **Left-Heavy**: $BF(v) = +2$
- **Right-Heavy**: $BF(v) = -2$

---

## 2. The Four Fundamental Rotations

### 1. Left-Left (LL) Single Rotation
Triggered when an insertion occurs in the left subtree of the left child.
\`\`\`text
       z                             y
      / \\                          /   \\
     y   T4   Rotate Right(z)     x     z
    / \\       -------------->    / \\   / \\
   x   T3                       T1 T2 T3 T4
  / \\
 T1  T2
\`\`\`

### 2. Right-Right (RR) Single Rotation
Symmetrical to LL rotation: performed by executing a Single Left Rotation on the unbalanced node $z$.

### 3. Left-Right (LR) Double Rotation
First perform Left Rotation on the left child $y$, then Right Rotation on $z$.

### 4. Right-Left (RL) Double Rotation
First perform Right Rotation on the right child $y$, then Left Rotation on $z$.

---

## 3. Asymptotic Verification
- **Search Time**: Strict $O(\\log N)$ because maximum tree height never exceeds $1.44 \\log_2 N$.
- **Insertion**: $O(\\log N)$ search + $O(1)$ constant rotation.
- **Deletion**: $O(\\log N)$ search + at most $O(\\log N)$ recursive rebalancing steps.
`,
    tags: ['Data Structures', 'Trees', 'AVL Tree', 'Advanced DSA', 'Exam Masterclass', 'Competitive Programming'],
    access_type: 'TOKEN',
    price: 0,
    token_price: 50,
    views: 420,
    likes: 98,
    created_at: '2026-02-18T10:00:00Z',
    updated_at: '2026-02-18T10:00:00Z',
    isDemo: false,
    status: 'published',
    is_admin_published: true,
  },

  // 13. TOKEN-GATED ADVANCED MASTERCLASS 2: Production Distributed System Design Blueprint (100 VT)
  {
    id: 'material-system-design-blueprint',
    creator_id: 'user-admin-om',
    created_by: 'Om Tajane (YuvaSetu Admin)',
    creator: {
      id: 'user-admin-om',
      name: 'Om Tajane',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240',
      role: 'YuvaSetu Admin',
      college: 'YuvaSetu Academic Lead',
      reputation: 5000,
      followersCount: 3200,
    },
    title: 'Production Distributed System Design Blueprint & Architecture Playbook',
    description:
      'In-depth architectural guide covering Sharding vs Partitioning, CAP Theorem trade-offs, Consistent Hashing Rings with Virtual Nodes, Raft Consensus protocol state transitions, and distributed cache invalidation strategies.',
    subject_id: 'os',
    subject_name: 'Operating Systems',
    topic: 'Distributed Systems & Architecture',
    content_type: 'note',
    thumbnail:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
    content_body: `# Production Distributed System Design Blueprint

## 1. Consistent Hashing with Virtual Nodes
Standard modulo hashing $hash(key) \\pmod N$ invalidates nearly $100\\%$ of keys when server nodes are added or removed.

### The Ring Topology Solution:
1. Map both servers and data keys to a $2^{32} - 1$ integer hash ring.
2. Store each key on the first server encountered moving clockwise.
3. Use **Virtual Nodes** (e.g. 150 vnodes per physical host) to guarantee uniform distribution and eliminate hot spots.

---

## 2. Distributed Consensus: Raft vs Paxos
Raft decomposes consensus into three independent sub-problems:
- **Leader Election**: Randomized election timers ($150\\text{ms} - 300\\text{ms}$) prevent split votes.
- **Log Replication**: Two-phase commit across quorum $(\\lfloor N/2 \\rfloor + 1)$.
- **Safety Invariant**: If a leader commits a log entry, that entry is guaranteed present in all future leader terms.
`,
    tags: ['System Design', 'Distributed Systems', 'Architecture', 'Interview Prep', 'Advanced'],
    access_type: 'TOKEN',
    price: 0,
    token_price: 100,
    views: 310,
    likes: 84,
    created_at: '2026-02-17T14:00:00Z',
    updated_at: '2026-02-17T14:00:00Z',
    isDemo: false,
    status: 'published',
    is_admin_published: true,
  },

  // 6. EDUCATIONAL VIDEO 1: YuvaSetu Uploaded Video (DSA Hashing & Collision Handling)
  {
    id: 'material-video-dsa-hashing',
    creator_id: 'user-admin-om',
    created_by: 'Om Tajane (YuvaSetu Admin)',
    creator: {
      id: 'user-admin-om',
      name: 'Om Tajane',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240',
      role: 'YuvaSetu Admin',
      college: 'YuvaSetu Academic Lead',
      reputation: 5000,
      followersCount: 3200,
    },
    title: 'Data Structures - Hashing & Collision Handling',
    description:
      'In-depth recorded lecture explaining Hash Table fundamentals, Hash Functions (Division, Multiplication, Mid-Square), Load Factor (λ), and Collision resolution strategies including Separate Chaining and Open Addressing (Linear Probing, Quadratic Probing, Double Hashing) with step-by-step memory visualizations.',
    subject_id: 'dsa',
    subject_name: 'Data Structures & Algorithms',
    topic: 'Hashing & Collision Handling',
    semester: 'Semester 3',
    branch: 'Computer Science & Engineering',
    faculty_name: 'Prof. Om Tajane',
    difficulty: 'Intermediate',
    language: 'English',
    content_type: 'video',
    thumbnail:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    video_data: {
      videoSource: 'upload',
      videoUrl: '/api/media/videos/dsa_hashing_collision_handling.mp4',
      duration: '18:45',
      durationSeconds: 1125,
      fileName: 'DSA_Hashing_and_Collision_Handling_HD.mp4',
      fileSize: '42.8 MB',
      mimeType: 'video/mp4',
      resolution: '1080p 60fps',
      difficulty: 'Intermediate',
      language: 'English',
      semester: 'Semester 3',
      branch: 'Computer Science & Engineering',
      facultyName: 'Prof. Om Tajane',
      chapters: [
        { title: '00:00 - Introduction & Hash Table Motivation', time: '00:00', seconds: 0 },
        { title: '04:15 - Collision Phenomenon & Load Factor', time: '04:15', seconds: 255 },
        { title: '09:30 - Open Addressing vs Separate Chaining', time: '09:30', seconds: 570 },
        { title: '14:50 - Double Hashing & Exam Complexity Proofs', time: '14:50', seconds: 890 },
      ],
    },
    tags: [
      'Data Structures',
      'Algorithms',
      'DSA',
      'Hashing',
      'Collision Handling',
      'Hash Tables',
      'Open Addressing',
      'Chaining',
      'Video Lecture',
      'YuvaSetu Uploaded Video',
      'Semester 3',
    ],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 640,
    likes: 98,
    created_at: '2026-02-18T10:00:00Z',
    updated_at: '2026-02-18T10:00:00Z',
    isDemo: false,
    status: 'published',
    is_admin_published: true,
  },

  // 7. EDUCATIONAL VIDEO 2: YouTube Embedded Video (Operating Systems Process Scheduling)
  {
    id: 'material-video-os-scheduling',
    creator_id: 'user-admin-om',
    created_by: 'Om Tajane (YuvaSetu Admin)',
    creator: {
      id: 'user-admin-om',
      name: 'Om Tajane',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240',
      role: 'YuvaSetu Admin',
      college: 'YuvaSetu Academic Lead',
      reputation: 5000,
      followersCount: 3200,
    },
    title: 'Operating Systems - CPU Process Scheduling & Algorithms',
    description:
      'Curriculum masterclass covering Preemptive vs Non-Preemptive CPU Scheduling algorithms: First-Come First-Served (FCFS), Shortest Job First (SJF), Shortest Remaining Time First (SRTF), Priority Scheduling, and Round Robin (RR) with Gantt charts, Average Waiting Time, and Turnaround Time equations.',
    subject_id: 'os',
    subject_name: 'Operating Systems',
    topic: 'CPU Process Scheduling',
    semester: 'Semester 4',
    branch: 'Computer Science & Information Technology',
    faculty_name: 'Prof. Alok Verma',
    difficulty: 'Beginner',
    language: 'English',
    content_type: 'video',
    thumbnail: 'https://img.youtube.com/vi/2h3eWaEx8SA/hqdefault.jpg',
    video_data: {
      videoSource: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=2h3eWaEx8SA',
      youtubeVideoId: '2h3eWaEx8SA',
      embedUrl: 'https://www.youtube-nocookie.com/embed/2h3eWaEx8SA?rel=0&modestbranding=1&enablejsapi=1',
      duration: '24:15',
      durationSeconds: 1455,
      resolution: '1080p HD',
      difficulty: 'Beginner',
      language: 'English',
      semester: 'Semester 4',
      branch: 'Computer Science & Information Technology',
      facultyName: 'Prof. Alok Verma',
      chapters: [
        { title: '00:00 - Process State Lifecycle & CPU Burst', time: '00:00', seconds: 0 },
        { title: '06:20 - FCFS & Convoy Effect Analysis', time: '06:20', seconds: 380 },
        { title: '12:45 - SJF & Preemptive SRTF Calculation', time: '12:45', seconds: 765 },
        { title: '18:10 - Round Robin Time Quantum Selection & Starvation', time: '18:10', seconds: 1090 },
      ],
    },
    tags: [
      'Operating Systems',
      'OS',
      'CPU Scheduling',
      'Process Management',
      'Gantt Chart',
      'Round Robin',
      'SJF',
      'FCFS',
      'YouTube Video',
      'Video Lecture',
      'Semester 4',
    ],
    access_type: 'FREE',
    price: 0,
    token_price: 0,
    views: 820,
    likes: 132,
    created_at: '2026-02-19T11:00:00Z',
    updated_at: '2026-02-19T11:00:00Z',
    isDemo: false,
    status: 'published',
    is_admin_published: true,
  },
];
