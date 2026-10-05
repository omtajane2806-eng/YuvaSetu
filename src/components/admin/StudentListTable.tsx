import React, { useState, useMemo } from 'react';
import { User, UserStatus } from '../../types/user';
import { UserInitialsBadge } from '../UserInitialsBadge';
import { activityService } from '../../services/activityService';
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit,
  Power,
  GraduationCap,
  Building,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export interface StudentListTableProps {
  students: User[];
  onViewStudent: (student: User) => void;
  onEditStudent: (student: User) => void;
  onToggleStatus: (student: User) => void;
  onAddStudent: () => void;
}

export const StudentListTable: React.FC<StudentListTableProps> = ({
  students,
  onViewStudent,
  onEditStudent,
  onToggleStatus,
  onAddStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');

  // Extract unique courses and years for filter dropdowns
  const availableCourses = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.course) set.add(s.course);
    });
    return Array.from(set);
  }, [students]);

  const availableYears = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.year) set.add(s.year);
    });
    return Array.from(set);
  }, [students]);

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Role filter check
      if (s.role !== 'student') return false;

      // Status filter
      if (statusFilter !== 'ALL') {
        const studentStatus = s.status || 'ACTIVE';
        if (studentStatus !== statusFilter) return false;
      }

      // Course filter
      if (courseFilter !== 'ALL' && s.course !== courseFilter) {
        return false;
      }

      // Year filter
      if (yearFilter !== 'ALL' && s.year !== yearFilter) {
        return false;
      }

      // Search query (name, email, college, branch)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.college && s.college.toLowerCase().includes(q)) ||
          (s.branch && s.branch.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [students, searchQuery, statusFilter, courseFilter, yearFilter]);

  const activeCount = useMemo(
    () => students.filter((s) => s.role === 'student' && s.status !== 'INACTIVE').length,
    [students]
  );
  const inactiveCount = useMemo(
    () => students.filter((s) => s.role === 'student' && s.status === 'INACTIVE').length,
    [students]
  );

  return (
    <div id="admin-student-management-section" className="space-y-4">
      {/* 1. CONTROLS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black font-['Outfit'] text-white">
              Student Directory & Learning Activity
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
              {filteredStudents.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Monitor verified student profiles, track learning milestones, and manage permissions.
          </p>
        </div>

        <button
          id="admin-add-student-btn"
          onClick={onAddStudent}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Student</span>
        </button>
      </div>

      {/* 2. SEARCH & FILTERS BAR */}
      <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            id="student-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, email, college..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            id="student-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition-all cursor-pointer font-medium"
          >
            <option value="ALL">All Account Statuses ({students.length})</option>
            <option value="ACTIVE">ACTIVE Students ({activeCount})</option>
            <option value="INACTIVE">INACTIVE Students ({inactiveCount})</option>
          </select>
        </div>

        {/* Course Filter */}
        <div>
          <select
            id="student-course-filter"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition-all cursor-pointer font-medium"
          >
            <option value="ALL">All Academic Courses</option>
            {availableCourses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <select
            id="student-year-filter"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition-all cursor-pointer font-medium"
          >
            <option value="ALL">All Academic Years</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. STUDENTS TABLE (ZERO PROFILE PICTURES - INITIALS ONLY) */}
      <div className="rounded-2xl bg-[#0b0f1e] border border-slate-800 overflow-hidden shadow-xl">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-300">No Students Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No registered students matched your current search filters. Try clearing your filters or adding a new student.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table id="admin-students-table" className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3.5 pl-4">Student Profile</th>
                  <th className="p-3.5">Institution & Course</th>
                  <th className="p-3.5">Branch & Year</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Registered</th>
                  <th className="p-3.5">Last Activity</th>
                  <th className="p-3.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((student) => {
                  const lastActive = activityService.getLastActivity(student.id);
                  const lastActiveText = lastActive
                    ? new Date(lastActive).toLocaleDateString()
                    : 'None yet';

                  return (
                    <tr
                      key={student.id}
                      id={`student-row-${student.id}`}
                      className="hover:bg-slate-900/50 transition-colors"
                    >
                      {/* Name & Initials Badge (ZERO PROFILE PICTURES) */}
                      <td className="p-3.5 pl-4">
                        <div className="flex items-center gap-3">
                          <UserInitialsBadge name={student.name} size="md" />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{student.name}</span>
                            </div>
                            <div className="text-[11px] font-mono text-cyan-300">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Institution & Course */}
                      <td className="p-3.5">
                        <div className="text-slate-200 font-medium">{student.college || '—'}</div>
                        <div className="text-[11px] text-slate-400">{student.course || 'B.Tech'}</div>
                      </td>

                      {/* Branch & Year */}
                      <td className="p-3.5">
                        <div className="text-slate-300">{student.branch || 'CSE'}</div>
                        <div className="text-[11px] text-slate-500">{student.year || '1st Year'}</div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            student.status === 'INACTIVE'
                              ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {student.status === 'INACTIVE' ? (
                            <XCircle className="w-3 h-3 text-rose-400" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          )}
                          <span>{student.status || 'ACTIVE'}</span>
                        </span>
                      </td>

                      {/* Registration Date */}
                      <td className="p-3.5 font-mono text-slate-400">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>

                      {/* Last Activity */}
                      <td className="p-3.5 font-mono text-slate-400">
                        {lastActiveText}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* View Detail Button */}
                          <button
                            id={`view-student-${student.id}`}
                            onClick={() => onViewStudent(student)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer"
                            title="View Learning Activity & Detailed History"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {/* Edit Button */}
                          <button
                            id={`edit-student-${student.id}`}
                            onClick={() => onEditStudent(student)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-purple-950/60 text-slate-400 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer"
                            title="Edit Student Information"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Deactivate / Activate Button */}
                          <button
                            id={`toggle-student-status-${student.id}`}
                            onClick={() => onToggleStatus(student)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              student.status === 'INACTIVE'
                                ? 'bg-slate-900 hover:bg-emerald-950/60 text-slate-400 hover:text-emerald-300 border-slate-800 hover:border-emerald-500/40'
                                : 'bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border-slate-800 hover:border-rose-500/40'
                            }`}
                            title={
                              student.status === 'INACTIVE'
                                ? 'Activate Student Account'
                                : 'Deactivate Student Account'
                            }
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
