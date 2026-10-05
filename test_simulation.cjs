const http = require('http');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, raw });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runEndToEndSimulation() {
  console.log('=== STARTING YUVASETU LAUNCH SIMULATION ===');

  // 1. Student Auth
  const loginRes = await request('POST', '/auth/login', {
    email: 'aryan@yuvasetu.com',
    password: 'password123'
  });
  console.log('1. Student Login:', loginRes.status, loginRes.data?.user?.name || 'Failed');
  const student = loginRes.data?.user;

  // 2. Admin Auth
  const adminLogin = await request('POST', '/auth/login', {
    email: 'omtajane2806@gmail.com',
    password: 'Omtajane2831'
  });
  console.log('2. Admin Login:', adminLogin.status, adminLogin.data?.user?.name || 'Failed');
  const admin = adminLogin.data?.user;

  // 3. Student Creates Doubt
  const doubtRes = await request('POST', '/doubts', {
    title: 'How does Path Compression optimize Disjoint Set Union (DSU)?',
    description: 'Can someone explain the amortized O(alpha(n)) time complexity with path compression and union by rank?',
    subject_id: 'sub-dsa',
    subject_name: 'Data Structures & Algorithms',
    tags: ['DSU', 'Graphs', 'Amortized'],
    student_id: student.id,
    student_name: student.name,
    student_email: student.email,
    student_college: student.college
  });
  console.log('3. Student Doubt Created:', doubtRes.status, 'ID:', doubtRes.data?.doubt?.id || 'Failed');
  const doubtId = doubtRes.data?.doubt?.id;

  // 4. Admin Answers Doubt
  if (doubtId) {
    const answerRes = await request('POST', `/doubts/${doubtId}/answers`, {
      content: 'Path compression flattens the tree structure during find operations so nodes point directly to the root, making subsequent lookups nearly instantaneous O(alpha(n)).',
      responder_id: admin.id,
      responder_name: admin.name,
      responder_role: 'admin',
      responder_college: admin.college
    });
    console.log('4. Admin Answered Doubt:', answerRes.status, 'Answer ID:', answerRes.data?.answer?.id || 'Failed');
    const answerId = answerRes.data?.answer?.id;

    // 5. Student Accepts Answer
    if (answerId) {
      const acceptRes = await request('POST', `/doubts/${doubtId}/accept-answer`, {
        answerId: answerId
      });
      console.log('5. Student Accepted Answer:', acceptRes.status, acceptRes.data?.success ? 'SUCCESS' : 'FAILED');
    }
  }

  // 6. Material Download & Activity
  const matDownload = await request('POST', '/materials/mat-dsa-01/download', {
    userId: student.id,
    userName: student.name
  });
  console.log('6. Student Downloaded Material:', matDownload.status, 'New Downloads:', matDownload.data?.downloads);

  // 7. Admin Schedules Live Session
  const sessionRes = await request('POST', '/sessions', {
    title: 'Mastering Dynamic Programming: Memoization to Tabulation',
    subject: 'Data Structures & Algorithms',
    description: 'Live interactive coding and whiteboard proofs for 1D/2D DP problems.',
    instructor: 'Om Tajane',
    instructor_title: 'YuvaSetu Academic Lead',
    date: '2026-10-15',
    start_time: '18:00',
    end_time: '19:30',
    duration_minutes: 90,
    platform: 'google_meet',
    meeting_url: 'https://meet.google.com/yuv-aset-live',
    created_by: admin.id
  });
  console.log('7. Admin Created Live Session:', sessionRes.status, 'ID:', sessionRes.data?.session?.id || 'Failed');
  const sessionId = sessionRes.data?.session?.id;

  // 8. Student Joins Live Session
  if (sessionId) {
    const joinRes = await request('POST', `/sessions/${sessionId}/join`, {
      userId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentCollege: student.college
    });
    console.log('8. Student Joined Live Session:', joinRes.status, joinRes.data?.success ? 'PARTICIPATION RECORDED' : 'FAILED');
  }

  // 9. Community Post & Discussion
  const postRes = await request('POST', '/community/posts', {
    title: 'Best strategy to balance OS, DBMS, and DSA during 4th semester?',
    content: 'Fellow students, how many hours per week do you allocate between theory subjects and competitive coding practice?',
    category: 'STUDY_STRATEGY',
    subject: 'Computer Science',
    tags: ['Strategy', 'Semester4', 'Exams'],
    author_id: student.id,
    author_name: student.name,
    author_college: student.college
  });
  console.log('9. Community Post Created:', postRes.status, 'Post ID:', postRes.data?.post?.id || 'Failed');
  const postId = postRes.data?.post?.id;

  if (postId) {
    const replyRes = await request('POST', `/community/posts/${postId}/replies`, {
      content: 'I recommend allocating mornings for core theory (OS/DBMS concepts) and evenings for hands-on problem solving in our YuvaSetu study rooms.',
      author_id: admin.id,
      author_name: admin.name,
      author_college: admin.college,
      author_role: 'admin'
    });
    console.log('10. Reply Posted in Community:', replyRes.status, replyRes.data?.reply?.id ? 'SUCCESS' : 'FAILED');
  }

  // 11. VidyaTokens Transaction Ledger Check
  const tokenRes = await request('POST', '/tokens/transaction', {
    userId: student.id,
    type: 'TOKEN_EARNED',
    amount: 25,
    reason: 'Active participation in live study sprint',
    referenceType: 'LIVE_SESSION',
    referenceId: sessionId || 'session-demo'
  });
  console.log('11. VidyaTokens Credited to Student:', tokenRes.status, 'New Balance:', tokenRes.data?.newBalance);

  // 12. Admin Analytics Aggregation
  const analyticsRes = await request('GET', '/admin/analytics');
  console.log('12. Admin Analytics Summary:', analyticsRes.status, {
    totalStudents: analyticsRes.data?.summary?.totalStudents,
    totalMaterials: analyticsRes.data?.summary?.totalMaterials,
    totalDownloads: analyticsRes.data?.summary?.totalDownloads,
    totalDoubts: analyticsRes.data?.summary?.totalDoubts,
    totalSessions: analyticsRes.data?.summary?.totalSessions,
    totalDiscussions: analyticsRes.data?.summary?.totalDiscussions
  });

  console.log('=== END-TO-END SIMULATION COMPLETE ===');
}

runEndToEndSimulation().catch(console.error);
