import React, { useState, useEffect } from 'react';
import { Course, StudyRoom, DoubtItem } from '../data/platformData';
import { YuvaSetuLogo } from './YuvaSetuLogo';
import {
  Search,
  X,
  BookOpen,
  Users,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  studyRooms: StudyRoom[];
  doubts: DoubtItem[];
  onNavigate: (view: string, payload?: any) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  courses,
  studyRooms,
  doubts,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Escape or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle handled by parent or opened
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase()) ||
    c.targetExam.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRooms = studyRooms.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.topic.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDoubts = doubts.filter((d) =>
    d.question.toLowerCase().includes(query.toLowerCase()) ||
    d.topic.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (view: string, payload?: any) => {
    onClose();
    onNavigate(view, payload);
  };

  return (
    <div
      id="yuvasetu-search-modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-2xl bg-[#0b0f1d] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search all YuvaSetu courses, live study rooms, or doubts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[400px] overflow-y-auto space-y-4 text-xs">
          {/* Courses Section */}
          {filteredCourses.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Courses & Masterclasses ({filteredCourses.length})
              </span>
              <div className="space-y-1.5">
                {filteredCourses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect('course_player', { courseId: c.id })}
                    className="w-full p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 text-left flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                        {c.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 shrink-0">
                      {c.targetExam}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Study Rooms Section */}
          {filteredRooms.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Live Study Rooms ({filteredRooms.length})
              </span>
              <div className="space-y-1.5">
                {filteredRooms.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect('study_rooms', { roomId: r.id })}
                    className="w-full p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-rose-500/40 text-left flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <Users className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-semibold text-slate-200 group-hover:text-rose-300 truncate">
                        {r.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40 shrink-0">
                      {r.activeParticipants} Live
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Doubts Section */}
          {filteredDoubts.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Conceptual Doubts ({filteredDoubts.length})
              </span>
              <div className="space-y-1.5">
                {filteredDoubts.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelect('doubts')}
                    className="w-full p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 text-left flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-semibold text-slate-200 group-hover:text-amber-300 truncate">
                        {d.question}
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 shrink-0">
                      {d.subject}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredCourses.length === 0 && filteredRooms.length === 0 && filteredDoubts.length === 0 && (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 text-cyan-400 mx-auto opacity-60" />
              <p>No results found for "{query}".</p>
              <button
                onClick={() => handleSelect('ai_tutor')}
                className="text-xs text-cyan-400 font-bold underline"
              >
                Ask Setu AI about "{query}" →
              </button>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <YuvaSetuLogo variant="horizontal" size="xs" showTagline={false} />
            <span>Search Engine</span>
          </div>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
