import React, { useState } from 'react';
import { User } from '../types/user';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import { AVAILABLE_SUBJECTS } from '../services/authService';
import { UserInitialsBadge } from '../components/UserInitialsBadge';
import {
  User as UserIcon,
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  Award,
  Users,
  FileText,
  HelpCircle,
  DollarSign,
  Edit3,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Plus,
  X,
  ExternalLink,
  ChevronRight,
  Share2,
  Mail,
  LogOut,
} from 'lucide-react';

export interface ProfileViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onNavigate: (view: string, payload?: any) => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onNavigate,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user.name,
    college: user.college,
    course: user.course,
    branch: user.branch,
    year: user.year,
    bio: user.bio,
    learningSubjects: [...user.learningSubjects],
    teachingSubjects: [...user.teachingSubjects],
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      ...editFormData,
    };
    onUpdateUser(updated);
    setIsEditing(false);
  };

  const toggleLearningSubject = (subj: string) => {
    setEditFormData((prev) => ({
      ...prev,
      learningSubjects: prev.learningSubjects.includes(subj)
        ? prev.learningSubjects.filter((s) => s !== subj)
        : [...prev.learningSubjects, subj],
    }));
  };

  const toggleTeachingSubject = (subj: string) => {
    setEditFormData((prev) => ({
      ...prev,
      teachingSubjects: prev.teachingSubjects.includes(subj)
        ? prev.teachingSubjects.filter((s) => s !== subj)
        : [...prev.teachingSubjects, subj],
    }));
  };

  const formatJoinedDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return 'August 2026';
    }
  };

  return (
    <div id="vidyasetu-profile-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. HERO PROFILE CARD (Text & Initials Badge only, ZERO photos) */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d1428] via-[#080c1a] to-[#0e1224] border border-cyan-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Initials Badge */}
            <div className="relative">
              <UserInitialsBadge
                name={user.name}
                role={user.role}
                size="lg"
                showOnlineDot={true}
              />
            </div>

            {/* Core User Identity */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
                  {user.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {user.plan} Student Plan
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 capitalize">
                  {user.role}
                </span>
                {user.status && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    user.status === 'ACTIVE'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  }`}>
                    {user.status}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="flex items-center gap-1 text-cyan-400 font-mono">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  {user.college || 'Institution'}
                </span>
                <span>•</span>
                <span>{user.course} ({user.branch})</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{user.year}</span>
              </div>

              <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Joined YuvaSetu in {formatJoinedDate(user.createdAt)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {user.role === 'admin' && (
              <button
                id="open-admin-from-profile-btn"
                onClick={() => onNavigate('admin')}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-300 hover:bg-rose-900/60 hover:text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-rose-950/40"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Admin Portal</span>
              </button>
            )}

            <button
              id="edit-profile-btn"
              onClick={() => setIsEditing(true)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-cyan-500/50 font-bold text-xs transition-all cursor-pointer shadow-sm"
            >
              <Edit3 className="w-4 h-4 text-cyan-400" />
              <span>Edit Profile</span>
            </button>

            <button
              id="open-dashboard-from-profile-btn"
              onClick={() => onNavigate(user.role === 'admin' ? 'admin' : 'dashboard')}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer"
            >
              <span>{user.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {onLogout && (
              <button
                id="profile-logout-btn"
                onClick={onLogout}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
                title="Log out of account"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Bio summary */}
        {user.bio && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-slate-950/40 p-4 rounded-2xl border border-slate-800/50">
            "{user.bio}"
          </div>
        )}
      </div>

      {/* 2. REPUTATION & METRICS STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'Reputation',
            value: `${user.reputation} pts`,
            sub: user.role === 'admin' ? 'Platform Lead' : 'Starter Contributor',
            icon: Award,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20',
          },
          {
            label: 'Followers',
            value: user.followersCount,
            sub: 'Student Network',
            icon: Users,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10 border-cyan-500/20',
          },
          {
            label: 'Content Uploaded',
            value: `${user.contentUploadedCount} Notes`,
            sub: 'Peer Study Guides',
            icon: FileText,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/20',
          },
          {
            label: 'Helpful Answers',
            value: `${user.helpfulAnswersCount} Doubts`,
            sub: 'Soch Se Samajh',
            icon: HelpCircle,
            color: 'text-rose-400',
            bg: 'bg-rose-500/10 border-rose-500/20',
          },
          {
            label: 'Account Status',
            value: user.status || 'ACTIVE',
            sub: 'YuvaSetu Verified',
            icon: CheckCircle2,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${stat.bg} flex flex-col justify-between space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <div className="text-xl font-black font-['Outfit'] text-white">
                  {stat.value}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">{stat.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. LEARNING & TEACHING PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pillar A: What I am Learning */}
        <div className="p-6 rounded-3xl bg-[#0c1020] border border-cyan-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black font-['Outfit'] text-white">
                  Subjects I'm Learning
                </h3>
                <p className="text-xs text-slate-400">Curated recommendations & peer notes</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {user.learningSubjects && user.learningSubjects.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {user.learningSubjects.map((subj) => (
                <div
                  key={subj}
                  className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs font-bold hover:border-cyan-500 transition-all cursor-pointer"
                  onClick={() => onNavigate('explore')}
                  title="Click to find peer notes for this subject"
                >
                  <span>{subj}</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-400">No learning subjects selected yet.</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30"
              >
                Choose Subjects
              </button>
            </div>
          )}
        </div>

        {/* Pillar B: What I Can Teach / Help With */}
        <div className="p-6 rounded-3xl bg-[#0c1020] border border-amber-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black font-['Outfit'] text-white">
                  Subjects I Can Teach
                </h3>
                <p className="text-xs text-slate-400">Help peers & earn contributor reputation</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {user.teachingSubjects && user.teachingSubjects.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {user.teachingSubjects.map((subj) => (
                <div
                  key={subj}
                  className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-bold hover:border-amber-500 transition-all cursor-pointer"
                  onClick={() => onNavigate('doubts')}
                  title="Click to answer peer doubts for this subject"
                >
                  <span>{subj}</span>
                  <HelpCircle className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-400">Share your strengths with fellow students.</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold hover:bg-amber-500/30"
              >
                Add Strengths
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. USER PLAN & MONETIZATION READINESS SECTION */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Account Tier: Free Student Membership</h4>
          </div>
          <p className="text-xs text-slate-400">
            Enjoy unlimited access to curriculum study materials, peer doubts, focus study rooms, and live sessions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 border border-slate-700 font-bold">
            Status: Active & 100% Free
          </span>
        </div>
      </div>

      {/* EDIT PROFILE MODAL (Zero photo upload, clean text only) */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#090d1c] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black font-['Outfit'] text-white mb-4">
              Edit Profile Information
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">College / Institution</label>
                  <input
                    type="text"
                    required
                    value={editFormData.college}
                    onChange={(e) => setEditFormData({ ...editFormData, college: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Degree / Course</label>
                  <input
                    type="text"
                    required
                    value={editFormData.course}
                    onChange={(e) => setEditFormData({ ...editFormData, course: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Branch / Major</label>
                  <input
                    type="text"
                    required
                    value={editFormData.branch}
                    onChange={(e) => setEditFormData({ ...editFormData, branch: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Year of Study</label>
                  <select
                    value={editFormData.year}
                    onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Faculty / Educator">Faculty / Educator</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">Bio</label>
                  <textarea
                    rows={2}
                    value={editFormData.bio}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
              </div>

              {/* Learning Subjects Multi-select */}
              <div>
                <label className="text-xs font-bold text-cyan-300 block mb-1.5">
                  Subjects You Want to Learn (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800">
                  {AVAILABLE_SUBJECTS.map((subj) => (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleLearningSubject(subj)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        editFormData.learningSubjects.includes(subj)
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teaching Subjects Multi-select */}
              <div>
                <label className="text-xs font-bold text-amber-300 block mb-1.5">
                  Subjects You Can Teach / Explain (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800">
                  {AVAILABLE_SUBJECTS.map((subj) => (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleTeachingSubject(subj)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        editFormData.teachingSubjects.includes(subj)
                          ? 'bg-amber-500 text-black'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-black text-white shadow-md hover:opacity-95 cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

