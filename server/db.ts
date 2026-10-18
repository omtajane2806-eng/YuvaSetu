import fs from 'fs';
import path from 'path';
import initSqlJs, { type Database } from 'sql.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'yuvasetu.sqlite');

let dbInstance: Database | null = null;
let saveTimeout: NodeJS.Timeout | null = null;

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function saveDatabase(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to persist SQLite database to disk:', err);
  }
}

// Debounced save to reduce IO under rapid writes while persisting safely
export function queueSaveDatabase(): void {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveDatabase();
    saveTimeout = null;
  }, 100);
}

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(fileBuffer);
      console.log('Loaded existing YuvaSetu SQLite database from disk.');
    } catch (err) {
      console.warn('Could not read existing DB file, creating fresh database:', err);
      dbInstance = new SQL.Database();
    }
  } else {
    console.log('Initializing fresh YuvaSetu SQLite database.');
    dbInstance = new SQL.Database();
  }

  // Initialize all schemas and tables
  initTables(dbInstance);
  saveDatabase();

  return dbInstance;
}

function initTables(db: Database): void {
  db.run('PRAGMA foreign_keys = ON;');

  // 1. Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      firebase_uid TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      role TEXT NOT NULL CHECK(role IN ('student', 'admin')),
      college TEXT,
      course TEXT,
      branch TEXT,
      year TEXT,
      subjects TEXT,
      status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_login_at TEXT
    );
  `);

  // 2. Study Materials table
  db.run(`
    CREATE TABLE IF NOT EXISTS study_materials (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      subject TEXT NOT NULL,
      course_code TEXT,
      semester TEXT,
      type TEXT NOT NULL CHECK(type IN ('notes', 'video', 'cheatsheet', 'pyq_solutions')),
      file_url TEXT,
      thumbnail TEXT,
      uploaded_by TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_college TEXT,
      published INTEGER NOT NULL DEFAULT 1,
      downloads INTEGER NOT NULL DEFAULT 0,
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      page_count INTEGER,
      duration TEXT,
      tags TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Migrate columns for study_materials if missing (supporting video sources & rich taxonomy)
  try {
    const materialCols = queryAll(db, `PRAGMA table_info(study_materials);`).map((c: any) => c.name);
    const newCols = [
      { name: 'video_source', type: 'TEXT' },
      { name: 'youtube_video_id', type: 'TEXT' },
      { name: 'video_mime_type', type: 'TEXT' },
      { name: 'video_size', type: 'TEXT' },
      { name: 'difficulty', type: 'TEXT' },
      { name: 'branch', type: 'TEXT' },
      { name: 'language', type: 'TEXT' },
      { name: 'faculty_name', type: 'TEXT' },
      { name: 'metadata', type: 'TEXT' },
      { name: 'price_inr', type: 'REAL DEFAULT 0' },
      { name: 'ai_recommended_price', type: 'REAL DEFAULT 0' },
      { name: 'quality_score', type: 'INTEGER DEFAULT 0' },
      { name: 'category_tier', type: 'TEXT DEFAULT "BASIC"' },
      { name: 'topic', type: 'TEXT' },
      { name: 'academic_level', type: 'TEXT' },
      { name: 'academic_category', type: 'TEXT' },
    ];
    for (const col of newCols) {
      if (!materialCols.includes(col.name)) {
        db.run(`ALTER TABLE study_materials ADD COLUMN ${col.name} ${col.type};`);
      }
    }
  } catch (err) {
    console.warn('Migration warning for study_materials columns:', err);
  }

  // 3. Live Sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS live_sessions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT,
      scheduled_start TEXT NOT NULL,
      scheduled_end TEXT NOT NULL,
      platform TEXT NOT NULL,
      meeting_url TEXT NOT NULL,
      created_by TEXT NOT NULL,
      instructor_name TEXT,
      instructor_college TEXT,
      status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK(status IN ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  try {
    db.run(`ALTER TABLE live_sessions ADD COLUMN host_email TEXT`);
  } catch (_e) {}
  try {
    db.run(`ALTER TABLE live_sessions ADD COLUMN duration TEXT`);
  } catch (_e) {}
  try {
    db.run(`ALTER TABLE live_sessions ADD COLUMN audience TEXT`);
  } catch (_e) {}
  try {
    db.run(`ALTER TABLE live_sessions ADD COLUMN topic TEXT`);
  } catch (_e) {}
  try {
    db.run(`ALTER TABLE live_sessions ADD COLUMN meeting_password TEXT`);
  } catch (_e) {}

  // 4. Session Participation table
  db.run(`
    CREATE TABLE IF NOT EXISTS session_participations (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      student_name TEXT,
      joined_at TEXT NOT NULL,
      left_at TEXT,
      FOREIGN KEY (session_id) REFERENCES live_sessions(id) ON DELETE CASCADE
    );
  `);

  // 5. Study Rooms table
  db.run(`
    CREATE TABLE IF NOT EXISTS study_rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT,
      room_url TEXT NOT NULL,
      capacity INTEGER NOT NULL DEFAULT 50,
      status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'ARCHIVED')),
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 6. Study Room Participation table
  db.run(`
    CREATE TABLE IF NOT EXISTS study_room_participations (
      id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      student_name TEXT,
      joined_at TEXT NOT NULL,
      FOREIGN KEY (room_id) REFERENCES study_rooms(id) ON DELETE CASCADE
    );
  `);

  // 7. Doubts table
  db.run(`
    CREATE TABLE IF NOT EXISTS doubts (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      title TEXT NOT NULL,
      question TEXT NOT NULL,
      subject TEXT NOT NULL,
      tags TEXT,
      status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN', 'ANSWERED', 'CLOSED')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 8. Answers table
  db.run(`
    CREATE TABLE IF NOT EXISTS answers (
      id TEXT PRIMARY KEY,
      doubt_id TEXT NOT NULL,
      responder_id TEXT NOT NULL,
      responder_name TEXT NOT NULL,
      responder_role TEXT NOT NULL,
      answer TEXT NOT NULL,
      is_accepted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (doubt_id) REFERENCES doubts(id) ON DELETE CASCADE
    );
  `);

  // 9. Community Posts table
  db.run(`
    CREATE TABLE IF NOT EXISTS community_posts (
      id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_role TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      subject TEXT,
      category TEXT,
      likes INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'MODERATED', 'REMOVED')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 10. Community Replies table
  db.run(`
    CREATE TABLE IF NOT EXISTS community_replies (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE
    );
  `);

  // 11. Notifications table
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      related_entity_id TEXT,
      related_entity_type TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // 12. Activity Audit Log table
  db.run(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT,
      user_email TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // 13. Saved and Liked items table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_interactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      interaction_type TEXT NOT NULL CHECK(interaction_type IN ('SAVED', 'LIKED')),
      entity_type TEXT NOT NULL CHECK(entity_type IN ('material', 'post', 'doubt')),
      entity_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, interaction_type, entity_type, entity_id)
    );
  `);

  // 14. VidyaTokens Wallets table
  db.run(`
    CREATE TABLE IF NOT EXISTS token_wallets (
      user_id TEXT PRIMARY KEY,
      balance INTEGER NOT NULL DEFAULT 100 CHECK(balance >= 0),
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 15. VidyaTokens Transactions Ledger (Double-Entry, Immutably Logged)
  db.run(`
    CREATE TABLE IF NOT EXISTS token_transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('TOKEN_EARNED', 'TOKEN_SPENT', 'TOKEN_REFUND', 'ADMIN_ADJUSTMENT')),
      amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      reference_type TEXT,
      reference_id TEXT,
      balance_after INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 16. Student Note Submissions (Marketplace with AI validation & Auto-Publishing)
  db.run(`
    CREATE TABLE IF NOT EXISTS student_note_submissions (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      student_email TEXT,
      student_college TEXT,
      file_name TEXT NOT NULL,
      file_size TEXT,
      file_size_bytes INTEGER,
      file_url TEXT NOT NULL,
      page_count INTEGER NOT NULL DEFAULT 1,
      title TEXT NOT NULL,
      description TEXT,
      subject_id TEXT NOT NULL,
      subject_name TEXT NOT NULL,
      category TEXT,
      semester TEXT,
      branch TEXT,
      tags TEXT,
      ai_analysis TEXT,
      ai_recommended_price REAL,
      suggested_min_price REAL,
      suggested_max_price REAL,
      student_selected_price REAL,
      rights_declaration_accepted INTEGER NOT NULL DEFAULT 0,
      listing_info_accepted INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'DRAFT',
      publishing_eligibility_status TEXT,
      published_at TEXT,
      review_reason TEXT,
      rejection_reason TEXT,
      purchases_count INTEGER NOT NULL DEFAULT 0,
      views_count INTEGER NOT NULL DEFAULT 0,
      ratings_count INTEGER NOT NULL DEFAULT 0,
      rating_average REAL NOT NULL DEFAULT 0.0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 17. Marketplace Publishing Thresholds Table
  db.run(`
    CREATE TABLE IF NOT EXISTS marketplace_thresholds (
      id TEXT PRIMARY KEY,
      minimum_overall_quality_score INTEGER NOT NULL DEFAULT 70,
      minimum_relevance_score INTEGER NOT NULL DEFAULT 70,
      minimum_completeness_score INTEGER NOT NULL DEFAULT 60,
      minimum_ai_confidence INTEGER NOT NULL DEFAULT 75,
      allowed_copyright_risk TEXT NOT NULL DEFAULT '["LOW"]',
      allowed_originality_risk TEXT NOT NULL DEFAULT '["LOW"]',
      minimum_price_inr REAL NOT NULL DEFAULT 10,
      maximum_price_inr REAL NOT NULL DEFAULT 499,
      default_currency TEXT NOT NULL DEFAULT 'INR',
      updated_at TEXT NOT NULL,
      updated_by TEXT
    );
  `);

  // Initialize default threshold row if empty
  const existingThreshold = queryOne(db, `SELECT id FROM marketplace_thresholds WHERE id = 'default'`);
  if (!existingThreshold) {
    db.run(`
      INSERT INTO marketplace_thresholds (
        id, minimum_overall_quality_score, minimum_relevance_score, minimum_completeness_score,
        minimum_ai_confidence, allowed_copyright_risk, allowed_originality_risk,
        minimum_price_inr, maximum_price_inr, default_currency, updated_at, updated_by
      ) VALUES (
        'default', 70, 70, 60, 75, '["LOW"]', '["LOW"]', 10, 499, 'INR', ?, 'system'
      );
    `, [new Date().toISOString()]);
  }

  // Create fast indexes for queries
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_materials_subject ON study_materials(subject);
    CREATE INDEX IF NOT EXISTS idx_sessions_status ON live_sessions(status);
    CREATE INDEX IF NOT EXISTS idx_doubts_student ON doubts(student_id);
    CREATE INDEX IF NOT EXISTS idx_answers_doubt ON answers(doubt_id);
    CREATE INDEX IF NOT EXISTS idx_community_post ON community_replies(post_id);
    CREATE INDEX IF NOT EXISTS idx_notifs_user ON notifications(user_id, is_read);
    CREATE INDEX IF NOT EXISTS idx_activity_action ON activity_logs(action);
    CREATE INDEX IF NOT EXISTS idx_token_tx_user ON token_transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_note_submissions_student ON student_note_submissions(student_id);
    CREATE INDEX IF NOT EXISTS idx_note_submissions_status ON student_note_submissions(status);
  `);
}

// Helper query wrappers for sql.js
export function queryAll<T = any>(db: Database, sql: string, params: any[] = []): T[] {
  const stmt = db.prepare(sql);
  try {
    if (params.length > 0) {
      stmt.bind(params);
    }
    const results: T[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as T);
    }
    return results;
  } finally {
    stmt.free();
  }
}

export function queryOne<T = any>(db: Database, sql: string, params: any[] = []): T | null {
  const all = queryAll<T>(db, sql, params);
  return all.length > 0 ? all[0] : null;
}

export function execute(db: Database, sql: string, params: any[] = []): void {
  const stmt = db.prepare(sql);
  try {
    stmt.run(params);
    queueSaveDatabase();
  } finally {
    stmt.free();
  }
}
