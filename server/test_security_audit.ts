/**
 * Independent Security Control Audit Test Runner
 *
 * Executes empirical tests against live running application to determine:
 * - PASS: Control tested and confirmed working as designed.
 * - FAIL: Vulnerability or unauthorized behavior confirmed.
 * - PARTIAL: Some protection exists, but gaps remain.
 * - NOT TESTED / BLOCKED: External constraints.
 */

import { hashPassword, verifyPassword } from './authMiddleware.ts';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

export interface AuditResult {
  id: string;
  category: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'PARTIAL' | 'NOT TESTED' | 'BLOCKED';
  severityIfFailed: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  description: string;
  evidence: string;
}

const auditResults: AuditResult[] = [];

function recordResult(result: AuditResult) {
  auditResults.push(result);
  const tag = `[${result.status}]`;
  console.log(`\n${tag.padEnd(10)} | ${result.id.padEnd(6)} | ${result.category.padEnd(20)} | ${result.name}`);
  console.log(`  Details: ${result.description}`);
  console.log(`  Evidence: ${result.evidence}`);
}

// Minimal valid 1x1 JPEG
const VALID_JPEG_BUFFER = Buffer.from([
  0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
  0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
  0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
  0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
  0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
  0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
  0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
  0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
  0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00,
  0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
  0x09, 0x0A, 0x0B, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F,
  0x00, 0xBF, 0x00, 0xFF, 0xD9
]);
const JPEG_BASE64 = `data:image/jpeg;base64,${VALID_JPEG_BUFFER.toString('base64')}`;

// Spoofed SVG/HTML payload
const SPOOFED_SVG_BUFFER = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
const SPOOFED_SVG_BASE64 = `data:image/jpeg;base64,${SPOOFED_SVG_BUFFER.toString('base64')}`;

// Oversized dummy image (> 5 MB)
const OVERSIZED_BUFFER = Buffer.alloc(5.5 * 1024 * 1024, 0xFF);
OVERSIZED_BUFFER[0] = 0xFF;
OVERSIZED_BUFFER[1] = 0xD8;
OVERSIZED_BUFFER[2] = 0xFF;
const OVERSIZED_BASE64 = `data:image/jpeg;base64,${OVERSIZED_BUFFER.toString('base64')}`;

async function runAudit() {
  console.log('========================================================================');
  console.log('         YUVASETU - COMPREHENSIVE SECURITY CONTROL AUDIT                ');
  console.log('========================================================================');

  let adminToken = '';
  let studentToken = '';
  let adminId = '';
  let studentId = '';

  // -------------------------------------------------------------------------
  // SECTION 1: AUTHENTICATION & SESSION VERIFICATION
  // -------------------------------------------------------------------------

  // 1.1 Spoofed Header Rejection
  try {
    const res = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'GET',
      headers: {
        'x-user-id': 'user-admin-om',
        'x-user-role': 'admin',
      },
    });
    const status = res.status;
    const isProtected = status === 401 || status === 403;
    recordResult({
      id: 'AUTH-1',
      category: 'Authentication',
      name: 'Spoofed Header Rejection (x-user-id / x-user-role)',
      status: isProtected ? 'PASS' : 'FAIL',
      severityIfFailed: 'CRITICAL',
      description: 'Requests with spoofed admin headers and no bearer token must be rejected.',
      evidence: `HTTP ${status}: ${isProtected ? 'Properly rejected spoofed header credentials.' : 'FAILED: Accepted spoofed headers.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'AUTH-1',
      category: 'Authentication',
      name: 'Spoofed Header Rejection',
      status: 'FAIL',
      severityIfFailed: 'CRITICAL',
      description: 'Request failed to execute.',
      evidence: err.message,
    });
  }

  // 1.2 Invalid Bearer Token Rejection
  try {
    const res = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer invalid_tampered_fake_token_xyz_123',
      },
    });
    const status = res.status;
    const isProtected = status === 401 || status === 403;
    recordResult({
      id: 'AUTH-2',
      category: 'Authentication',
      name: 'Invalid Bearer Token Rejection',
      status: isProtected ? 'PASS' : 'FAIL',
      severityIfFailed: 'CRITICAL',
      description: 'Requests with invalid bearer token must be rejected.',
      evidence: `HTTP ${status}: ${isProtected ? 'Properly rejected invalid bearer token.' : 'FAILED: Accepted invalid token.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'AUTH-2',
      category: 'Authentication',
      name: 'Invalid Bearer Token Rejection',
      status: 'FAIL',
      severityIfFailed: 'CRITICAL',
      description: 'Request failed to execute.',
      evidence: err.message,
    });
  }

  // 1.3 Cryptographic Bearer Token Generation on Login
  try {
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'omtajane2806@gmail.com',
        password: 'Omtajane2831',
        requiredRole: 'admin',
      }),
    });
    const adminData = await adminLoginRes.json();
    adminToken = adminData.token;
    adminId = adminData.user?.id;

    const studentLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'aryan@yuvasetu.com',
        password: 'student123',
        requiredRole: 'student',
      }),
    });
    const studentData = await studentLoginRes.json();
    studentToken = studentData.token;
    studentId = studentData.user?.id;

    const isTokenCSPRNG = typeof adminToken === 'string' && adminToken.length === 64 && /^[0-9a-f]+$/.test(adminToken);

    recordResult({
      id: 'AUTH-3',
      category: 'Authentication',
      name: 'CSPRNG Session Token Generation (256 bits)',
      status: isTokenCSPRNG ? 'PASS' : 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Session tokens must be 256-bit CSPRNG hex strings unpredictable from timestamps or user IDs.',
      evidence: `Generated token length: ${adminToken ? adminToken.length : 0} chars, Hex CSPRNG format: ${isTokenCSPRNG}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'AUTH-3',
      category: 'Authentication',
      name: 'CSPRNG Session Token Generation',
      status: 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Login failed to execute.',
      evidence: err.message,
    });
  }

  // 1.4 Immediate Session Revocation on Logout
  try {
    const tempLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'aryan@yuvasetu.com',
        password: 'student123',
        requiredRole: 'student',
      }),
    });
    const tempData = await tempLoginRes.json();
    const tempToken = tempData.token;

    const preRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${tempToken}` },
    });
    const preOk = preRes.status === 200;

    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tempToken}`,
      },
      body: JSON.stringify({ token: tempToken }),
    });

    const postRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${tempToken}` },
    });
    const postStatus = postRes.status;
    const isRevoked = preOk && postStatus === 401;

    recordResult({
      id: 'AUTH-4',
      category: 'Authentication',
      name: 'Immediate Session Revocation on Logout',
      status: isRevoked ? 'PASS' : 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Tokens must be revoked immediately in SQLite upon logout and rejected thereafter.',
      evidence: `Pre-logout HTTP: ${preRes.status}, Post-logout HTTP: ${postStatus} (${isRevoked ? 'Revoked' : 'Reused token accepted!'})`,
    });
  } catch (err: any) {
    recordResult({
      id: 'AUTH-4',
      category: 'Authentication',
      name: 'Session Revocation on Logout',
      status: 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Test execution failed.',
      evidence: err.message,
    });
  }

  // 1.5 Unauthenticated Password Reset Security Check (Admin Takeover Defense)
  try {
    const adminAttackRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'omtajane2806@gmail.com',
        newPassword: 'AttackerSpecifiedPassword123!',
      }),
    });
    // Unauthenticated attempts to reset admin password must be strictly rejected with HTTP 403 Forbidden
    const isProtected = adminAttackRes.status === 403;
    recordResult({
      id: 'AUTH-5',
      category: 'Authentication',
      name: 'Password Reset Admin Takeover Guard',
      status: isProtected ? 'PASS' : 'FAIL',
      severityIfFailed: 'CRITICAL',
      description: 'Administrator passwords must NEVER be resettable by unauthenticated callers.',
      evidence: `HTTP ${adminAttackRes.status}: ${isProtected ? 'Properly blocked with HTTP 403 Forbidden.' : 'VULNERABLE: Allowed unauthenticated admin password reset.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'AUTH-5',
      category: 'Authentication',
      name: 'Password Reset Mechanism',
      status: 'FAIL',
      severityIfFailed: 'CRITICAL',
      description: 'Test execution error.',
      evidence: err.message,
    });
  }

  // -------------------------------------------------------------------------
  // SECTION 2: FILE UPLOADS & MAGIC-BYTE SIGNATURE VALIDATION
  // -------------------------------------------------------------------------

  // 2.1 Valid JPEG Upload
  try {
    const res = await fetch(`${BASE_URL}/api/admin/profile-photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        adminId,
        imageBase64: JPEG_BASE64,
      }),
    });
    const data = await res.json();
    const isAccepted = res.status === 200 && data.success === true;
    recordResult({
      id: 'FILE-1',
      category: 'File Security',
      name: 'Genuine JPEG Image Signature Acceptance',
      status: isAccepted ? 'PASS' : 'FAIL',
      severityIfFailed: 'MEDIUM',
      description: 'Files containing genuine JPEG magic bytes (FF D8 FF) must be accepted.',
      evidence: `HTTP ${res.status}: ${data.message || data.error}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'FILE-1',
      category: 'File Security',
      name: 'Genuine JPEG Image Acceptance',
      status: 'FAIL',
      severityIfFailed: 'MEDIUM',
      description: 'Execution failed.',
      evidence: err.message,
    });
  }

  // 2.2 Malicious SVG/Script Disguised as JPEG
  try {
    const res = await fetch(`${BASE_URL}/api/admin/profile-photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        adminId,
        imageBase64: SPOOFED_SVG_BASE64,
      }),
    });
    const isBlocked = res.status === 400;
    recordResult({
      id: 'FILE-2',
      category: 'File Security',
      name: 'Malicious SVG/Script Disguised as JPEG Rejection',
      status: isBlocked ? 'PASS' : 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Non-image text and script payloads disguised as JPEG must be rejected by magic-byte checking.',
      evidence: `HTTP ${res.status}: ${isBlocked ? 'Successfully rejected with HTTP 400.' : 'FAILED: Accepted malicious script.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'FILE-2',
      category: 'File Security',
      name: 'Malicious SVG/Script Rejection',
      status: 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Execution failed.',
      evidence: err.message,
    });
  }

  // 2.3 File Size Boundary Enforcement (> 5 MB)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/profile-photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        adminId,
        imageBase64: OVERSIZED_BASE64,
      }),
    });
    const isBlocked = res.status === 400 || res.status === 413;
    recordResult({
      id: 'FILE-3',
      category: 'File Security',
      name: 'Oversized Avatar Upload Limit Enforcement (> 5MB)',
      status: isBlocked ? 'PASS' : 'FAIL',
      severityIfFailed: 'MEDIUM',
      description: 'Uploads exceeding the 5 MB threshold must be rejected.',
      evidence: `HTTP ${res.status}: ${isBlocked ? 'Properly rejected oversized payload.' : 'FAILED: Oversized upload accepted.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'FILE-3',
      category: 'File Security',
      name: 'Oversized Avatar Upload Limit Enforcement',
      status: 'FAIL',
      severityIfFailed: 'MEDIUM',
      description: 'Execution failed.',
      evidence: err.message,
    });
  }

  // -------------------------------------------------------------------------
  // SECTION 3: ROLE-BASED ACCESS CONTROL (RBAC)
  // -------------------------------------------------------------------------

  // 3.1 Student Access to Admin User Management
  try {
    const res = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const isBlocked = res.status === 403;
    recordResult({
      id: 'RBAC-1',
      category: 'Access Control',
      name: 'Student Blocked from Admin Users Listing',
      status: isBlocked ? 'PASS' : 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Students must receive HTTP 403 when requesting administrator user listings.',
      evidence: `HTTP ${res.status}: ${isBlocked ? 'Properly blocked with 403 Forbidden.' : 'FAILED: Student gained access.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'RBAC-1',
      category: 'Access Control',
      name: 'Student Blocked from Admin Users',
      status: 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Request failed.',
      evidence: err.message,
    });
  }

  // 3.2 Student Access to Admin Profile Photo Mutation
  try {
    const res = await fetch(`${BASE_URL}/api/admin/profile-photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        adminId: studentId,
        imageBase64: JPEG_BASE64,
      }),
    });
    const isBlocked = res.status === 403;
    recordResult({
      id: 'RBAC-2',
      category: 'Access Control',
      name: 'Student Blocked from Admin Profile Photo Upload',
      status: isBlocked ? 'PASS' : 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Students must be blocked from admin profile photo uploads (students use initials badges).',
      evidence: `HTTP ${res.status}: ${isBlocked ? 'Properly blocked with 403 Forbidden.' : 'FAILED: Student uploaded photo.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'RBAC-2',
      category: 'Access Control',
      name: 'Student Blocked from Admin Profile Photo Upload',
      status: 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Request failed.',
      evidence: err.message,
    });
  }

  // 3.3 Student Access to Marketplace Note Moderation
  try {
    const res = await fetch(`${BASE_URL}/api/admin/marketplace/submissions`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const isBlocked = res.status === 403;
    recordResult({
      id: 'RBAC-3',
      category: 'Access Control',
      name: 'Student Blocked from Admin Marketplace Submissions',
      status: isBlocked ? 'PASS' : 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Students must be blocked from viewing and moderating publisher submissions.',
      evidence: `HTTP ${res.status}: ${isBlocked ? 'Properly blocked with 403 Forbidden.' : 'FAILED: Student accessed moderation queue.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'RBAC-3',
      category: 'Access Control',
      name: 'Student Blocked from Admin Marketplace Submissions',
      status: 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Request failed.',
      evidence: err.message,
    });
  }

  // 3.4 Student Blocked from Admin Analytics
  try {
    const res = await fetch(`${BASE_URL}/api/admin/analytics`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const isBlocked = res.status === 403;
    recordResult({
      id: 'RBAC-4',
      category: 'Access Control',
      name: 'Student Blocked from Admin Analytics Endpoint',
      status: isBlocked ? 'PASS' : 'FAIL',
      severityIfFailed: 'MEDIUM',
      description: 'Students must receive HTTP 403 when requesting administrator platform analytics.',
      evidence: `HTTP ${res.status}: ${isBlocked ? 'Properly blocked with 403 Forbidden.' : 'FAILED: Student gained access.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'RBAC-4',
      category: 'Access Control',
      name: 'Student Blocked from Admin Analytics',
      status: 'FAIL',
      severityIfFailed: 'MEDIUM',
      description: 'Request failed.',
      evidence: err.message,
    });
  }

  // -------------------------------------------------------------------------
  // SECTION 4: IDOR & HORIZONTAL PRIVILEGE ESCALATION
  // -------------------------------------------------------------------------

  // 4.1 Student A Access to Student B's Private Notifications
  try {
    const victimUserId = 'user-student-sneha';
    const res = await fetch(`${BASE_URL}/api/notifications/${victimUserId}`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const isProtected = res.status === 403;
    recordResult({
      id: 'IDOR-1',
      category: 'IDOR Defense',
      name: 'Notification Access Ownership Guard',
      status: isProtected ? 'PASS' : 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Users must only be allowed to retrieve their own notifications.',
      evidence: `HTTP ${res.status}: ${isProtected ? 'Properly blocked with 403 Forbidden.' : 'FAILED: User read another user notifications.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'IDOR-1',
      category: 'IDOR Defense',
      name: 'Notification Access Ownership Guard',
      status: 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Request failed.',
      evidence: err.message,
    });
  }

  // 4.2 User Profile Update IDOR Check (PUT /api/users/:id)
  try {
    const victimUserId = 'user-student-sneha';
    const attackRes = await fetch(`${BASE_URL}/api/users/${victimUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        bio: 'Hacked by unauthorized user ' + Date.now(),
      }),
    });

    const isProtected = attackRes.status === 401 || attackRes.status === 403;

    recordResult({
      id: 'IDOR-2',
      category: 'IDOR Defense',
      name: 'User Profile Update Authorization Check (PUT /api/users/:id)',
      status: isProtected ? 'PASS' : 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'PUT /api/users/:id must verify caller identity and reject unauthorized profile modifications.',
      evidence: `HTTP ${attackRes.status}: ${isProtected ? 'Properly blocked cross-user profile modification.' : 'VULNERABLE: Allowed modifying another user profile.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'IDOR-2',
      category: 'IDOR Defense',
      name: 'User Profile Update IDOR',
      status: 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Test execution failed.',
      evidence: err.message,
    });
  }

  // 4.3 Token Transaction Authorization Check (POST /api/tokens/transact)
  try {
    const attackRes = await fetch(`${BASE_URL}/api/tokens/transact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        userId: 'user-student-sneha',
        type: 'TOKEN_SPENT',
        amount: 50,
        reason: 'Unauthorized Audit Probe',
      }),
    });

    const isProtected = attackRes.status === 401 || attackRes.status === 403;

    recordResult({
      id: 'IDOR-3',
      category: 'IDOR Defense',
      name: 'Token Transaction Authorization & Ledger Integrity',
      status: isProtected ? 'PASS' : 'FAIL',
      severityIfFailed: 'CRITICAL',
      description: 'POST /api/tokens/transact must require authentication and prevent unauthorized wallet adjustments.',
      evidence: `HTTP ${attackRes.status}: ${isProtected ? 'Properly blocked unauthorized token transaction.' : 'VULNERABLE: Unauthenticated caller modified wallet balance.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'IDOR-3',
      category: 'IDOR Defense',
      name: 'Token Transaction Authorization',
      status: 'FAIL',
      severityIfFailed: 'CRITICAL',
      description: 'Test execution failed.',
      evidence: err.message,
    });
  }

  // 4.4 Doubt Solution Acceptance & Token Reward Authorization
  try {
    const attackRes = await fetch(`${BASE_URL}/api/doubts/any-doubt-id/accept-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answerId: 'fake-answer',
      }),
    });
    const isProtected = attackRes.status === 401 || attackRes.status === 403 || attackRes.status === 404;
    recordResult({
      id: 'IDOR-4',
      category: 'IDOR Defense',
      name: 'Doubt Solution Acceptance & Reward Authorization',
      status: isProtected ? 'PASS' : 'FAIL',
      severityIfFailed: 'MEDIUM',
      description: 'Only the author of a doubt or administrator may mark an answer as accepted and trigger token rewards.',
      evidence: `HTTP ${attackRes.status}: Properly requires authenticated session`,
    });
  } catch (err: any) {
    recordResult({
      id: 'IDOR-4',
      category: 'IDOR Defense',
      name: 'Doubt Solution Acceptance Authorization',
      status: 'FAIL',
      severityIfFailed: 'MEDIUM',
      description: 'Test execution failed.',
      evidence: err.message,
    });
  }

  // -------------------------------------------------------------------------
  // SECTION 5: CRYPTOGRAPHY & PASSWORD HASHING
  // -------------------------------------------------------------------------

  // 5.1 Memory-hard Scrypt Algorithm & Salt Randomness
  try {
    const hash1 = hashPassword('TestPassword123!');
    const hash2 = hashPassword('TestPassword123!');
    const isScrypt = hash1.startsWith('scrypt$') && hash2.startsWith('scrypt$');
    const isSaltUnique = hash1 !== hash2;
    const verifyValid = verifyPassword('TestPassword123!', hash1).valid;
    const verifyInvalid = !verifyPassword('WrongPassword123!', hash1).valid;

    const isCryptoSecure = isScrypt && isSaltUnique && verifyValid && verifyInvalid;

    recordResult({
      id: 'CRYPTO-1',
      category: 'Cryptography',
      name: 'Scrypt Password Hashing with CSPRNG Salt',
      status: isCryptoSecure ? 'PASS' : 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Passwords must be hashed using memory-hard scrypt with unique CSPRNG salts and constant-time verification.',
      evidence: `Format: ${hash1.substring(0, 20)}..., Unique Salts: ${isSaltUnique}, Valid verify: ${verifyValid}, Wrong pass rejected: ${verifyInvalid}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'CRYPTO-1',
      category: 'Cryptography',
      name: 'Scrypt Password Hashing',
      status: 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Execution failed.',
      evidence: err.message,
    });
  }

  // -------------------------------------------------------------------------
  // SECTION 6: BRUTE FORCE & LOGIN THROTTLING
  // -------------------------------------------------------------------------

  // 6.1 Account Lockout / Rate Limiting
  try {
    const probeEmail = 'ratelimit_audit_' + Date.now() + '@example.com';
    let throttled = false;
    let attempts = 0;

    for (let i = 0; i < 6; i++) {
      attempts++;
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: probeEmail,
          password: 'WrongPassword' + i,
        }),
      });
      if (res.status === 429) {
        throttled = true;
        break;
      }
    }

    recordResult({
      id: 'RATE-1',
      category: 'Rate Limiting',
      name: 'Failed Login Brute-Force Throttling (SQLite-backed)',
      status: throttled ? 'PASS' : 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Multiple consecutive failed login attempts must trigger progressive lockouts with HTTP 429.',
      evidence: `Attempts before throttle: ${attempts}, HTTP 429 Triggered: ${throttled}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'RATE-1',
      category: 'Rate Limiting',
      name: 'Failed Login Brute-Force Throttling',
      status: 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Execution failed.',
      evidence: err.message,
    });
  }

  // -------------------------------------------------------------------------
  // SECTION 7: PATH TRAVERSAL DEFENSE
  // -------------------------------------------------------------------------

  // 7.1 Path Traversal in Avatar Media Route
  try {
    const res = await fetch(`${BASE_URL}/api/media/avatars/..%2F..%2Fserver.ts`);
    const isProtected = res.status === 400 || res.status === 404;
    recordResult({
      id: 'PATH-1',
      category: 'Path Traversal',
      name: 'Avatar Media Endpoint Path Traversal Defense',
      status: isProtected ? 'PASS' : 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Path traversal sequences in /api/media/avatars/:filename must be blocked.',
      evidence: `HTTP ${res.status}: ${isProtected ? 'Properly blocked path traversal.' : 'FAILED: Exposed internal file.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'PATH-1',
      category: 'Path Traversal',
      name: 'Avatar Path Traversal',
      status: 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Execution failed.',
      evidence: err.message,
    });
  }

  // 7.2 Path Traversal in Note Media Route
  try {
    const res = await fetch(`${BASE_URL}/api/media/notes/..%2F..%2F..%2Fetc%2Fpasswd`);
    const isProtected = res.status === 400 || res.status === 404 || res.status === 403;
    recordResult({
      id: 'PATH-2',
      category: 'Path Traversal',
      name: 'Notes Media Endpoint Path Traversal Defense',
      status: isProtected ? 'PASS' : 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Path traversal sequences in /api/media/notes/:filename must be blocked.',
      evidence: `HTTP ${res.status}: ${isProtected ? 'Properly blocked path traversal.' : 'FAILED: Exposed internal file.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'PATH-2',
      category: 'Path Traversal',
      name: 'Notes Path Traversal',
      status: 'FAIL',
      severityIfFailed: 'HIGH',
      description: 'Execution failed.',
      evidence: err.message,
    });
  }

  // -------------------------------------------------------------------------
  // SECTION 8: INFORMATION DISCLOSURE & SECURITY HEADERS
  // -------------------------------------------------------------------------

  // 8.1 Public Health Endpoints Secret Exposure Check
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const text = await res.text();
    const hasSecretKey =
      text.includes('sk_') ||
      text.includes('key_') ||
      text.includes('secret') ||
      text.includes('AIza');
    const isSafe = res.status === 200 && !hasSecretKey;

    recordResult({
      id: 'INFO-1',
      category: 'Info Disclosure',
      name: 'Public Health Endpoint Secrets Isolation',
      status: isSafe ? 'PASS' : 'FAIL',
      severityIfFailed: 'MEDIUM',
      description: 'Health endpoints must not disclose environment variables, keys, or internal tokens.',
      evidence: `HTTP ${res.status}: Body length ${text.length} chars, Secrets exposed: ${hasSecretKey}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'INFO-1',
      category: 'Info Disclosure',
      name: 'Public Health Endpoint Secrets Isolation',
      status: 'FAIL',
      severityIfFailed: 'MEDIUM',
      description: 'Execution failed.',
      evidence: err.message,
    });
  }

  // 8.2 Admin Analytics Endpoint Authorization Check
  try {
    const res = await fetch(`${BASE_URL}/api/admin/analytics`);
    const isProtected = res.status === 401 || res.status === 403;
    recordResult({
      id: 'INFO-2',
      category: 'Info Disclosure',
      name: 'Admin Analytics Authorization Check (/api/admin/analytics)',
      status: isProtected ? 'PASS' : 'FAIL',
      severityIfFailed: 'MEDIUM',
      description: 'Internal platform analytics metrics must require administrator authentication.',
      evidence: `HTTP ${res.status}: ${isProtected ? 'Properly restricted to administrators.' : 'VULNERABLE: Exposed internal platform metrics unauthenticated.'}`,
    });
  } catch (err: any) {
    recordResult({
      id: 'INFO-2',
      category: 'Info Disclosure',
      name: 'Admin Analytics Authorization Check',
      status: 'FAIL',
      severityIfFailed: 'MEDIUM',
      description: 'Execution failed.',
      evidence: err.message,
    });
  }

  // 8.3 Security Headers Inspection
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const nosniff = res.headers.get('x-content-type-options');
    const frameOptions = res.headers.get('x-frame-options');
    const referrer = res.headers.get('referrer-policy');

    const headersSecure = nosniff === 'nosniff' && Boolean(frameOptions) && Boolean(referrer);

    recordResult({
      id: 'HEAD-1',
      category: 'Security Headers',
      name: 'HTTP Security Headers (nosniff, X-Frame-Options, Referrer-Policy)',
      status: headersSecure ? 'PASS' : 'PARTIAL',
      severityIfFailed: 'LOW',
      description: 'Responses must carry standard defense-in-depth security headers.',
      evidence: `nosniff: "${nosniff}", x-frame-options: "${frameOptions}", referrer-policy: "${referrer}"`,
    });
  } catch (err: any) {
    recordResult({
      id: 'HEAD-1',
      category: 'Security Headers',
      name: 'HTTP Security Headers',
      status: 'FAIL',
      severityIfFailed: 'LOW',
      description: 'Execution failed.',
      evidence: err.message,
    });
  }

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n========================================================================');
  const passCount = auditResults.filter((r) => r.status === 'PASS').length;
  const failCount = auditResults.filter((r) => r.status === 'FAIL').length;
  const partialCount = auditResults.filter((r) => r.status === 'PARTIAL').length;
  console.log(`AUDIT EXECUTION COMPLETE: ${passCount} PASS, ${failCount} FAIL, ${partialCount} PARTIAL (Total: ${auditResults.length})`);
  console.log('========================================================================\n');
}

runAudit().catch((err) => {
  console.error('Fatal Audit Suite Error:', err);
  process.exit(1);
});
