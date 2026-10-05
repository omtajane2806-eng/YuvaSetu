import crypto from 'crypto';
import type { Database } from 'sql.js';
import { queryOne, execute, saveDatabase } from './db.ts';

// Simple, secure salted hash for local database authentication
export function hashPassword(password: string): string {
  const salt = 'yuvasetu_salt_2026';
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

export function seedInitialData(db: Database): void {
  const isProduction = process.env.NODE_ENV === 'production';
  // In development, demo students and test seeds are enabled by default.
  // In production, demo students, fake activities, and test accounts are strictly disabled unless explicitly enabled via ENABLE_DEMO_SEED=true.
  const enableDemoSeed = process.env.ENABLE_DEMO_SEED === 'true' || (!isProduction && process.env.ENABLE_DEMO_SEED !== 'false');

  // Check if any admin user exists in the database
  const existingAdmin = queryOne(db, `SELECT id, email FROM users WHERE role = 'admin' LIMIT 1`);

  if (!existingAdmin) {
    // If running in production with designated bootstrap environment variables
    const initialEmail = (process.env.ADMIN_INITIAL_EMAIL || 'omtajane2806@gmail.com').trim().toLowerCase();
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Omtajane2831';
    const initialName = process.env.ADMIN_INITIAL_NAME || 'Om Tajane';

    console.log(`[YuvaSetu Security] Bootstrapping primary platform administrator: ${initialEmail}`);

    const adminId = 'user-admin-om';
    const now = new Date().toISOString();
    execute(
      db,
      `INSERT INTO users (id, name, email, password_hash, role, college, course, branch, year, subjects, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'admin', 'YuvaSetu Academic Lead', 'Platform Administration & Engineering', 'Lead Administrator', 'Lead Administrator', ?, 'ACTIVE', ?, ?)`,
      [
        adminId,
        initialName,
        initialEmail,
        hashPassword(initialPassword),
        JSON.stringify(['Computer Science', 'Data Structures', 'System Design']),
        now,
        now,
      ]
    );

    execute(
      db,
      `INSERT OR IGNORE INTO token_wallets (user_id, balance, updated_at) VALUES (?, 1000, ?)`,
      [adminId, now]
    );
  }

  // Development & Testing Administrators (Om Tajane & Ranjan Zambare)
  if (!isProduction || enableDemoSeed) {
    const defaultAdmins = [
      {
        id: 'user-admin-om',
        name: 'Om Tajane',
        email: 'omtajane2806@gmail.com',
        password_hash: hashPassword('Omtajane2831'),
        role: 'admin',
        college: 'YuvaSetu Academic Lead',
        course: 'Platform Administration & Engineering',
        branch: 'Lead Administrator',
        year: 'Lead Administrator',
        subjects: JSON.stringify(['Computer Science', 'Data Structures', 'System Design']),
        status: 'ACTIVE',
        created_at: '2025-08-01T10:00:00.000Z',
        updated_at: new Date().toISOString(),
      },
      {
        id: 'user-admin-om-alias',
        name: 'Om Tajane',
        email: 'ontajane2806@gmail.com',
        password_hash: hashPassword('Omtajane2831'),
        role: 'admin',
        college: 'YuvaSetu Academic Lead',
        course: 'Platform Administration & Engineering',
        branch: 'Lead Administrator',
        year: 'Lead Administrator',
        subjects: JSON.stringify(['Computer Science', 'Data Structures', 'System Design']),
        status: 'ACTIVE',
        created_at: '2025-08-01T10:00:00.000Z',
        updated_at: new Date().toISOString(),
      },
      {
        id: 'user-admin-ranjan',
        name: 'Ranjan Zambare',
        email: 'ranjanzambare9119@gmail.com',
        password_hash: hashPassword('admin123'),
        role: 'admin',
        college: 'YuvaSetu Academic Lead',
        course: 'Platform Administration & Curriculum',
        branch: 'Administrator',
        year: 'Administrator',
        subjects: JSON.stringify(['DBMS', 'Operating Systems', 'Web Development']),
        status: 'ACTIVE',
        created_at: '2026-02-01T10:00:00.000Z',
        updated_at: new Date().toISOString(),
      },
    ];

    for (const admin of defaultAdmins) {
      const existing = queryOne(db, `SELECT id FROM users WHERE LOWER(email) = LOWER(?)`, [admin.email]);
      if (!existing) {
        execute(
          db,
          `INSERT INTO users (id, name, email, password_hash, role, college, course, branch, year, subjects, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            admin.id,
            admin.name,
            admin.email,
            admin.password_hash,
            admin.role,
            admin.college,
            admin.course,
            admin.branch,
            admin.year,
            admin.subjects,
            admin.status,
            admin.created_at,
            admin.updated_at,
          ]
        );
      }

      execute(
        db,
        `INSERT OR IGNORE INTO token_wallets (user_id, balance, updated_at) VALUES (?, 1000, ?)`,
        [admin.id, new Date().toISOString()]
      );
    }
  }

  // Seed default students ONLY in development / non-production mode
  if (enableDemoSeed) {
    const defaultStudents = [
      {
        id: 'user-student-aryan',
        name: 'Aryan Sharma',
        email: 'aryan@yuvasetu.com',
        college: 'IIT Bombay',
        course: 'B.Tech',
        branch: 'Computer Science',
        year: '2nd Year',
        subjects: JSON.stringify(['Data Structures & Algorithms', 'Operating Systems', 'AI & Machine Learning']),
      },
      {
        id: 'user-student-aditi',
        name: 'Aditi Sen',
        email: 'aditi@yuvasetu.com',
        college: 'BITS Pilani',
        course: 'B.Tech',
        branch: 'Electronics & Communication',
        year: '3rd Year',
        subjects: JSON.stringify(['DBMS & SQL', 'Digital Logic & Computer Org']),
      },
      {
        id: 'user-student-rohit',
        name: 'Rohit Kulkarni',
        email: 'rohit@yuvasetu.com',
        college: 'COEP Tech Pune',
        course: 'B.Tech',
        branch: 'Mechanical Engineering',
        year: '1st Year',
        subjects: JSON.stringify(['Engineering Physics & Mechanics', 'Engineering Mathematics']),
      },
      {
        id: 'user-student-sneha',
        name: 'Sneha Patil',
        email: 'sneha@yuvasetu.com',
        college: 'VJTI Mumbai',
        course: 'B.Tech',
        branch: 'Information Technology',
        year: '4th Year',
        subjects: JSON.stringify(['Computer Networks', 'Operating Systems']),
      },
      {
        id: 'user-student-tanmay',
        name: 'Tanmay Deshmukh',
        email: 'tanmay@yuvasetu.com',
        college: 'NIT Surathkal',
        course: 'B.Tech',
        branch: 'Electrical & Electronics',
        year: '2nd Year',
        subjects: JSON.stringify(['Electrical Circuits & Systems']),
      },
    ];

    const studentDefaultHash = hashPassword('password123');
    const nowStr = new Date().toISOString();
    for (const s of defaultStudents) {
      const existing = queryOne(db, `SELECT id FROM users WHERE LOWER(email) = LOWER(?)`, [s.email]);
      if (!existing) {
        execute(
          db,
          `INSERT INTO users (id, name, email, password_hash, role, college, course, branch, year, subjects, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, 'student', ?, ?, ?, ?, ?, 'ACTIVE', ?, ?)`,
          [s.id, s.name, s.email, studentDefaultHash, s.college, s.course, s.branch, s.year, s.subjects, nowStr, nowStr]
        );
      }
      execute(
        db,
        `INSERT OR IGNORE INTO token_wallets (user_id, balance, updated_at) VALUES (?, 100, ?)`,
        [s.id, nowStr]
      );
    }
  }

  // Check if initial educational study materials exist
  const existingMaterials = queryOne(db, `SELECT id FROM study_materials LIMIT 1`);
  if (!existingMaterials) {
    console.log('Seeding legitimate initial educational study materials (DSA & Core Engineering)...');

    const initialMaterials = [
      {
        id: 'mat-dsa-01',
        title: 'Data Structures & Algorithms - Complete Handwritten Masterclass Notes',
        description:
          'Comprehensive, classroom-tested handwritten notes covering asymptotic analysis (Big-O, Omega, Theta), Arrays, Linked Lists, Stacks, Queues, Binary Search Trees, AVL Trees, Heaps, and Graph Traversals (BFS/DFS) with clear diagrams and complexity proofs.',
        subject: 'Data Structures & Algorithms',
        course_code: 'CS201',
        semester: 'Semester 3',
        type: 'notes',
        file_url: 'internal://dsa-masterclass-pdf',
        thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc790c66ac5?w=600&auto=format&fit=crop&q=80',
        uploaded_by: 'user-admin-om',
        author_name: 'Om Tajane',
        author_college: 'YuvaSetu Academic Lead',
        published: 1,
        downloads: 0,
        views: 0,
        likes: 0,
        page_count: 84,
        duration: null,
        tags: JSON.stringify(['DSA', 'Arrays', 'Trees', 'Graphs', 'Big-O', 'Algorithms']),
        created_at: '2026-02-10T10:00:00.000Z',
        updated_at: '2026-02-10T10:00:00.000Z',
      },
      {
        id: 'mat-dbms-02',
        title: 'Database Management Systems - SQL, Relational Algebra & Normalization',
        description:
          'In-depth study notes focusing on ER Modeling, Relational Algebra, SQL queries (Joins, Subqueries, Aggregations), B+ Trees indexing, Transaction Processing (ACID), and Normal Forms (1NF through BCNF) with solved university examination questions.',
        subject: 'DBMS & SQL',
        course_code: 'CS202',
        semester: 'Semester 4',
        type: 'notes',
        file_url: 'internal://dbms-guide-pdf',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
        uploaded_by: 'user-admin-ranjan',
        author_name: 'Ranjan Zambare',
        author_college: 'YuvaSetu Academic Lead',
        published: 1,
        downloads: 0,
        views: 0,
        likes: 0,
        page_count: 72,
        duration: null,
        tags: JSON.stringify(['DBMS', 'SQL', 'Normalization', 'Transactions', 'ACID']),
        created_at: '2026-02-15T12:00:00.000Z',
        updated_at: '2026-02-15T12:00:00.000Z',
      },
      {
        id: 'mat-os-03',
        title: 'Operating Systems - Process Scheduling, Concurrency & Memory Management',
        description:
          'Structured engineering notes explaining CPU scheduling algorithms, Deadlocks (Banker’s algorithm), Semaphores & Mutex, Virtual Memory, Paging, and Page Replacement Algorithms with clear step-by-step numerical examples.',
        subject: 'Operating Systems',
        course_code: 'CS203',
        semester: 'Semester 4',
        type: 'notes',
        file_url: 'internal://os-concurrency-pdf',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        uploaded_by: 'user-admin-om',
        author_name: 'Om Tajane',
        author_college: 'YuvaSetu Academic Lead',
        published: 1,
        downloads: 0,
        views: 0,
        likes: 0,
        page_count: 65,
        duration: null,
        tags: JSON.stringify(['OS', 'Scheduling', 'Deadlocks', 'Paging', 'Virtual Memory']),
        created_at: '2026-02-20T14:30:00.000Z',
        updated_at: '2026-02-20T14:30:00.000Z',
      },
      {
        id: 'mat-dsa-cheatsheet-04',
        title: 'DSA Time & Space Complexity Quick Revision Cheatsheet',
        description:
          '2-page condensed formula sheet summarizing average and worst-case time/space complexities for sorting algorithms, graph algorithms, and data structure operations for quick test revision.',
        subject: 'Data Structures & Algorithms',
        course_code: 'CS201',
        semester: 'Semester 3',
        type: 'cheatsheet',
        file_url: 'internal://dsa-cheatsheet-pdf',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
        uploaded_by: 'user-admin-om',
        author_name: 'Om Tajane',
        author_college: 'YuvaSetu Academic Lead',
        published: 1,
        downloads: 0,
        views: 0,
        likes: 0,
        page_count: 2,
        duration: null,
        tags: JSON.stringify(['Cheatsheet', 'Big-O', 'Algorithms', 'Revision']),
        created_at: '2026-02-22T09:00:00.000Z',
        updated_at: '2026-02-22T09:00:00.000Z',
      },
    ];

    for (const mat of initialMaterials) {
      execute(
        db,
        `INSERT INTO study_materials (
          id, title, description, subject, course_code, semester, type,
          file_url, thumbnail, uploaded_by, author_name, author_college,
          published, downloads, views, likes, page_count, duration, tags,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mat.id,
          mat.title,
          mat.description,
          mat.subject,
          mat.course_code,
          mat.semester,
          mat.type,
          mat.file_url,
          mat.thumbnail,
          mat.uploaded_by,
          mat.author_name,
          mat.author_college,
          mat.published,
          mat.downloads,
          mat.views,
          mat.likes,
          mat.page_count,
          mat.duration,
          mat.tags,
          mat.created_at,
          mat.updated_at,
        ]
      );
    }
  }

  // Check if study room exists
  const existingRooms = queryOne(db, `SELECT id FROM study_rooms LIMIT 1`);
  if (!existingRooms) {
    execute(
      db,
      `INSERT INTO study_rooms (id, name, subject, description, room_url, capacity, status, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'room-dsa-quiet-focus',
        'DSA & Competitive Coding Room',
        'Data Structures & Algorithms',
        'Silent peer focus & algorithm problem-solving space for engineering students.',
        'https://meet.google.com/new',
        50,
        'ACTIVE',
        'user-admin-om',
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    );
  }

  saveDatabase();
}
