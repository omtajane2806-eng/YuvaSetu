export interface Course {
  id: string;
  title: string;
  category: 'Physics' | 'Chemistry' | 'Mathematics' | 'Computer Science' | 'Foundations';
  targetExam: 'JEE Advanced' | 'NEET UG' | 'CBSE 12' | 'CBSE 10' | 'Coding Bridge';
  instructor: {
    name: string;
    role: string;
    avatar: string;
    rating: number;
    students: number;
  };
  thumbnail: string;
  accentColor: string;
  level: 'Conceptual Foundation' | 'Intermediate Bridge' | 'Advanced Mastery';
  duration: string;
  lessonsCount: number;
  rating: number;
  enrolledCount: number;
  description: string;
  tags: string[];
  modules: {
    id: string;
    title: string;
    duration: string;
    lessons: {
      id: string;
      title: string;
      duration: string;
      isCompleted?: boolean;
      type: 'video' | 'interactive_lab' | 'quiz' | 'formula_sheet';
    }[];
  }[];
}

export interface StudyRoom {
  id: string;
  name: string;
  subject: string;
  topic: string;
  hostName: string;
  hostAvatar: string;
  activeParticipants: number;
  maxParticipants: number;
  targetFocus: 'Deep Problem Solving' | 'Doubt Sprint' | 'Late Night Focus' | 'Formula Recall';
  tags: string[];
  isLive: boolean;
  pomodoroMinutes: number;
  currentPhase: 'Focus Work' | 'Quick Rest' | 'Doubt Discussion';
}

export interface DoubtItem {
  id: string;
  studentName: string;
  avatar: string;
  subject: string;
  topic: string;
  question: string;
  timeAgo: string;
  status: 'Solved' | 'AI In-Progress' | 'Mentor Review';
  sochContext: string; // The initial mental block / intuition
  samajhDerivation: {
    stepTitle: string;
    explanation: string;
    formula?: string;
  }[];
  verifiedByMentor?: string;
  upvotes: number;
  repliesCount: number;
}

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-rotational-dynamics',
    title: 'Rotational Mechanics & Rigid Body Dynamics: From Intuition to JEE Mastery',
    category: 'Physics',
    targetExam: 'JEE Advanced',
    instructor: {
      name: 'Dr. Anand Ramanathan',
      role: 'Former IIT Professor & Physics Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      rating: 4.96,
      students: 42800,
    },
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
    accentColor: 'from-cyan-500 to-blue-600',
    level: 'Advanced Mastery',
    duration: '28 Hours • 42 Lectures',
    lessonsCount: 42,
    rating: 4.95,
    enrolledCount: 14200,
    description: 'Transform how you visualize Torque, Moment of Inertia tensors, and Rolling without Slipping. Connect fundamental intuitive physics (Soch) directly to mathematical rigor (Samajh).',
    tags: ['Mechanics', 'Torque & Angular Momentum', 'JEE Advanced', 'PYQs'],
    modules: [
      {
        id: 'mod-1',
        title: 'Core Intuition: Translatory vs Rotational Analogy',
        duration: '3h 15m',
        lessons: [
          { id: 'les-1', title: 'Why Things Spin: Torque as the Rotational Force', duration: '28m', isCompleted: true, type: 'video' },
          { id: 'les-2', title: 'Mass Distribution and Moment of Inertia (MOI)', duration: '34m', isCompleted: true, type: 'video' },
          { id: 'les-3', title: 'Interactive Lab: Parallel & Perpendicular Axes Theorems', duration: '22m', isCompleted: false, type: 'interactive_lab' },
        ],
      },
      {
        id: 'mod-2',
        title: 'Pure Rolling Motion & Energy Conservation',
        duration: '5h 40m',
        lessons: [
          { id: 'les-4', title: 'Instantaneous Center of Zero Velocity (ICOR)', duration: '40m', isCompleted: false, type: 'video' },
          { id: 'les-5', title: 'Friction in Pure Rolling: Friend or Foe?', duration: '32m', isCompleted: false, type: 'video' },
          { id: 'les-6', title: 'Conceptual Mastery Checkpoint Quiz', duration: '25m', isCompleted: false, type: 'quiz' },
        ],
      },
    ],
  },
  {
    id: 'course-organic-mechanisms',
    title: 'Visual Organic Reaction Mechanisms: Electron Flow & Synthesis Pathways',
    category: 'Chemistry',
    targetExam: 'NEET UG',
    instructor: {
      name: 'Prof. Ananya Sen',
      role: 'Master Organic Chemist & AIIMS Mentor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      rating: 4.92,
      students: 38400,
    },
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
    accentColor: 'from-amber-400 to-rose-500',
    level: 'Intermediate Bridge',
    duration: '22 Hours • 36 Lectures',
    lessonsCount: 36,
    rating: 4.91,
    enrolledCount: 18900,
    description: 'Stop rote-memorizing organic chemistry. Learn electrophile-nucleophile dynamics, carbocation rearrangements, and aromatic substitutions visually.',
    tags: ['Organic Chemistry', 'Reaction Mechanisms', 'NEET UG', 'Visual Electrophiles'],
    modules: [
      {
        id: 'mod-chem-1',
        title: 'Electron Density Mapping & Reactive Intermediates',
        duration: '4h 10m',
        lessons: [
          { id: 'les-c1', title: 'Curved Arrow Notation & Inductive/Resonance Effects', duration: '30m', isCompleted: true, type: 'video' },
          { id: 'les-c2', title: 'Carbocation Stabilities and 1,2-Hydride/Alkyl Shifts', duration: '38m', isCompleted: false, type: 'video' },
        ],
      },
    ],
  },
  {
    id: 'course-calculus-foundations',
    title: 'Differential & Integral Calculus: Visual Continuity to Multivariable Horizons',
    category: 'Mathematics',
    targetExam: 'JEE Advanced',
    instructor: {
      name: 'Er. Rajesh Kulkarni',
      role: 'Olympiad Gold Coach & Math Theorist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      rating: 4.98,
      students: 51200,
    },
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
    accentColor: 'from-emerald-400 to-teal-600',
    level: 'Advanced Mastery',
    duration: '34 Hours • 50 Lectures',
    lessonsCount: 50,
    rating: 4.97,
    enrolledCount: 22400,
    description: 'Master epsilon-delta continuity, L’Hôpital’s geometrically, Riemann Sum integration, and differential equations with intuitive visual graphs.',
    tags: ['Calculus', 'Limits & Derivatives', 'Definite Integrals', 'JEE Math'],
    modules: [
      {
        id: 'mod-m1',
        title: 'The Essence of Calculus & Derivative Intuition',
        duration: '4h 30m',
        lessons: [
          { id: 'les-m1', title: 'Geometric Tangents and Instantaneous Rate of Change', duration: '32m', isCompleted: true, type: 'video' },
          { id: 'les-m2', title: 'Mean Value Theorem & Rolle’s Theorem Unveiled', duration: '28m', isCompleted: true, type: 'video' },
        ],
      },
    ],
  },
  {
    id: 'course-python-ai-bridge',
    title: 'Algorithmic Thinking & Python AI Bridge: From Zero to Machine Learning',
    category: 'Computer Science',
    targetExam: 'Coding Bridge',
    instructor: {
      name: 'Neha Verma',
      role: 'AI Research Engineer & Educator',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      rating: 4.89,
      students: 29500,
    },
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    accentColor: 'from-purple-500 to-indigo-600',
    level: 'Conceptual Foundation',
    duration: '26 Hours • 38 Lectures',
    lessonsCount: 38,
    rating: 4.90,
    enrolledCount: 16500,
    description: 'Bridge computational logic and modern AI. Build real Python neural networks, NumPy matrix transforms, and interactive data projects from first principles.',
    tags: ['Python', 'Data Structures', 'Machine Learning', 'Problem Solving'],
    modules: [
      {
        id: 'mod-py-1',
        title: 'Computational Thinking & Data Architecture',
        duration: '3h 45m',
        lessons: [
          { id: 'les-py1', title: 'Memory Models, Variables & Pointer References', duration: '26m', isCompleted: true, type: 'video' },
          { id: 'les-py2', title: 'Building Your First Neural Node in 30 Lines', duration: '35m', isCompleted: false, type: 'video' },
        ],
      },
    ],
  },
];

export const INITIAL_STUDY_ROOMS: StudyRoom[] = [
  {
    id: 'room-1',
    name: 'JEE Advanced Mechanics Sprint 🎯',
    subject: 'Physics',
    topic: 'Conservation of Angular Momentum & Gyroscopic Precession',
    hostName: 'Aryan (AIR 142 Aspirant)',
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    activeParticipants: 84,
    maxParticipants: 100,
    targetFocus: 'Deep Problem Solving',
    tags: ['Rotational Dynamics', 'HC Verma / Irodov', 'Pomodoro 50/10'],
    isLive: true,
    pomodoroMinutes: 38,
    currentPhase: 'Focus Work',
  },
  {
    id: 'room-2',
    name: 'NEET 2026 Botany & Organic Reaction Drill 🧬',
    subject: 'Chemistry & Biology',
    topic: 'Biomolecules & Aldol Condensation Mechanisms',
    hostName: 'Dr. Priya & Student Circle',
    hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    activeParticipants: 112,
    maxParticipants: 150,
    targetFocus: 'Doubt Sprint',
    tags: ['NEET Biology', 'NCERT In-depth', 'Rapid Fire Quiz'],
    isLive: true,
    pomodoroMinutes: 14,
    currentPhase: 'Doubt Discussion',
  },
  {
    id: 'room-3',
    name: 'Late Night Calculus & Linear Algebra Silence Room 🌙',
    subject: 'Mathematics',
    topic: 'Definite Integrals & Differential Equations',
    hostName: 'Sameer K.',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    activeParticipants: 67,
    maxParticipants: 80,
    targetFocus: 'Late Night Focus',
    tags: ['Lofi Beats', 'Silent Work', 'Live Scratchpad'],
    isLive: true,
    pomodoroMinutes: 25,
    currentPhase: 'Focus Work',
  },
  {
    id: 'room-4',
    name: 'Class 10 CBSE Board Toppers Math Room ⚡',
    subject: 'Mathematics',
    topic: 'Triangles, Trigonometry & Surface Areas',
    hostName: 'Aditi Sharma',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    activeParticipants: 45,
    maxParticipants: 60,
    targetFocus: 'Formula Recall',
    tags: ['CBSE Class 10', 'Exemplar Problems', 'Peer Doubts'],
    isLive: true,
    pomodoroMinutes: 18,
    currentPhase: 'Focus Work',
  },
];

export const INITIAL_DOUBTS: DoubtItem[] = [
  {
    id: 'doubt-1',
    studentName: 'Rohan Gupta',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    subject: 'Physics',
    topic: 'Rotational Equilibrium on Inclined Surfaces',
    question: 'Why does friction act uphill when a cylinder rolls down an incline, but can act downhill if torque is applied to the axle?',
    timeAgo: '12 mins ago',
    status: 'Solved',
    sochContext: 'Intuitive Conflict: Usually we think friction always opposes overall linear motion (downhill). But in rolling, friction creates the rotational torque required to match angular acceleration (a = R·α).',
    samajhDerivation: [
      {
        stepTitle: 'Step 1: The Linear Force Equilibrium',
        explanation: 'Gravity pulls the center of mass with force mg·sin(θ) down the incline. If no friction exists, the cylinder merely slides down without rotation.',
        formula: 'F_net = mg\\sin(\\theta) - f_s = ma_{cm}',
      },
      {
        stepTitle: 'Step 2: The Torque Around Center of Mass',
        explanation: 'Static friction f_s acts at the contact point uphill, exerting a clockwise torque τ = f_s · R about the center of mass.',
        formula: '\\tau = f_s \\cdot R = I_{cm} \\alpha = \\left(\\frac{1}{2}mR^2\\right) \\left(\\frac{a_{cm}}{R}\\right)',
      },
      {
        stepTitle: 'Step 3: Synthesis ("Samajh" Breakthrough)',
        explanation: 'Solving the coupled equations gives a_cm = 2/3 g sin(θ) and static friction f_s = 1/3 mg sin(θ) pointing uphill. When external axle torque exceeds acceleration demand, friction flips downhill to prevent slipping!',
        formula: 'f_s = \\frac{mg\\sin(\\theta)}{1 + \\frac{I_{cm}}{mR^2}}',
      },
    ],
    verifiedByMentor: 'Dr. Anand Ramanathan (IIT Lead Mentor)',
    upvotes: 42,
    repliesCount: 6,
  },
  {
    id: 'doubt-2',
    studentName: 'Meera Iyer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
    subject: 'Chemistry',
    topic: 'Aldol Condensation Stereochemistry',
    question: 'How do we predict whether E-enone or Z-enone forms preferentially during the dehydration step of an aldol condensation?',
    timeAgo: '28 mins ago',
    status: 'Solved',
    sochContext: 'Thermodynamic vs Kinetic control: Look at 1,3-allylic strain and orbital overlap between the carbonyl π-system and the newly formed alkene.',
    samajhDerivation: [
      {
        stepTitle: 'Step 1: E1cB Elimination Mechanism',
        explanation: 'The alpha proton is deprotonated first by base to form a stable enolate carbanion intermediate before hydroxide leaves.',
      },
      {
        stepTitle: 'Step 2: Minimizing Bulky Group Steric Hindrance',
        explanation: 'The E-isomer places the larger substituent trans to the carbonyl, minimizing gauche repulsion and achieving maximal conjugated co-planarity.',
        formula: '\\Delta G^{\\circ}_{E} < \\Delta G^{\\circ}_{Z} \\implies \\text{Major product is } (E)\\text{-enone}',
      },
    ],
    verifiedByMentor: 'Prof. Ananya Sen',
    upvotes: 29,
    repliesCount: 4,
  },
];

export interface PeerResource {
  id: string;
  title: string;
  subject: string;
  courseCode: string;
  authorName: string;
  authorCollege: string;
  authorAvatar?: string;
  resourceType: 'notes' | 'video' | 'cheatsheet' | 'pyq_solutions';
  pageCount?: number;
  duration?: string;
  downloads: number;
  likes: number;
  rating: number;
  verifiedByPeerToppers: boolean;
  semester: string;
  tags: string[];
  description: string;
  previewUrl?: string;
}

export const mockPeerResources: PeerResource[] = [
  {
    id: 'peer-res-1',
    title: 'Data Structures & Algorithms: Complete Graph Theory & DP Handnotes',
    subject: 'Computer Science',
    courseCode: 'CS201',
    authorName: 'Aryan Sharma',
    authorCollege: 'IIT Bombay, CSE Batch of 25',
    resourceType: 'notes',
    pageCount: 38,
    downloads: 1420,
    likes: 289,
    rating: 4.95,
    verifiedByPeerToppers: true,
    semester: 'Semester 3',
    tags: ['Graph Algorithms', 'Dynamic Programming', 'Dijkstra', 'Handwritten', 'Exam Ready'],
    description: 'Color-coded visual mindmaps, Dijkstra derivations, 0/1 Knapsack variations with edge cases, and previous 5-year mid-sem exam problems solved.',
  },
  {
    id: 'peer-res-2',
    title: '5-Min Topic Breakdown: Navier-Stokes & Boundary Layer Intuition',
    subject: 'Mechanical Engineering',
    courseCode: 'ME302',
    authorName: 'Rohan Deshmukh',
    authorCollege: 'VJTI Mumbai, Sem 5',
    resourceType: 'video',
    duration: '6m 42s',
    downloads: 840,
    likes: 195,
    rating: 4.9,
    verifiedByPeerToppers: true,
    semester: 'Semester 4',
    tags: ['Fluid Mechanics', 'Navier Stokes', 'Concept Video', 'Exam Rush'],
    description: 'Quick conceptual derivation without confusing differential calculus overload. Explains why pressure gradient balances viscous drag.',
  },
  {
    id: 'peer-res-3',
    title: 'Engineering Mathematics III: Laplace & Fourier Transforms Cheat Sheet',
    subject: 'Applied Mathematics',
    courseCode: 'MA202',
    authorName: 'Pooja Kulkarni',
    authorCollege: 'COEP Pune',
    resourceType: 'cheatsheet',
    pageCount: 6,
    downloads: 2190,
    likes: 430,
    rating: 5.0,
    verifiedByPeerToppers: true,
    semester: 'Semester 3',
    tags: ['Transforms', 'Formula Sheet', 'Cheat Sheet', 'Fast Revision'],
    description: 'Every transform formula, convolution theorem shortcuts, inverse tables, and step-by-step PDE wave/heat equation templates on 6 dense pages.',
  },
  {
    id: 'peer-res-4',
    title: 'Digital Electronics & Verilog: Karnaugh Maps & State Machine Design',
    subject: 'Electrical & ECE',
    courseCode: 'EC204',
    authorName: 'Ananya Sen',
    authorCollege: 'DTU Delhi',
    resourceType: 'notes',
    pageCount: 29,
    downloads: 1120,
    likes: 214,
    rating: 4.88,
    verifiedByPeerToppers: true,
    semester: 'Semester 3',
    tags: ['Verilog HDL', 'FSM', 'Sequential Logic', 'Topper Notes'],
    description: 'Clean Moore vs Mealy state diagrams, timing glitch solutions, and synthesized Verilog code blocks with line-by-line comments.',
  },
  {
    id: 'peer-res-5',
    title: 'Operating Systems: Semaphores, Deadlocks & Virtual Memory Video Primer',
    subject: 'Computer Science',
    courseCode: 'CS304',
    authorName: 'Kabir Verma',
    authorCollege: 'BITS Pilani',
    resourceType: 'video',
    duration: '8m 15s',
    downloads: 980,
    likes: 182,
    rating: 4.92,
    verifiedByPeerToppers: true,
    semester: 'Semester 5',
    tags: ['Operating Systems', 'Deadlock Detection', 'Page Replacement', 'Visualized'],
    description: 'Animated visual walkthrough of Banker’s algorithm, critical section mutex lock implementation, and LRU page fault calculations.',
  },
  {
    id: 'peer-res-6',
    title: 'Database Management: 1NF to BCNF Normalization & SQL Triggers Pack',
    subject: 'Information Technology',
    courseCode: 'IT205',
    authorName: 'Shruti Nair',
    authorCollege: 'NIT Trichy',
    resourceType: 'pyq_solutions',
    pageCount: 22,
    downloads: 1670,
    likes: 312,
    rating: 4.96,
    verifiedByPeerToppers: true,
    semester: 'Semester 4',
    tags: ['DBMS', 'Normalization', 'SQL Queries', 'Solved PYQs'],
    description: 'Step-by-step lossless join decompositions, dependency preserving proofs, and 50 most frequently tested university exam SQL queries.',
  },
];

