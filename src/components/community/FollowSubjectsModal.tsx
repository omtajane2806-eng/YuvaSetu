import React, { useState } from 'react';
import { PLATFORM_SUBJECTS } from '../../data/subjectData';
import { communityService } from '../../services/communityService';
import { User } from '../../types/user';
import { BookOpen, Check, Plus, X, Sparkles, Filter } from 'lucide-react';

interface FollowSubjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onFollowsChanged: () => void;
}

export const FollowSubjectsModal: React.FC<FollowSubjectsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onFollowsChanged,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen || !currentUser) return null;

  const followedIds = communityService.getFollowedSubjectIds(currentUser.id);

  const handleToggle = (subjectId: string) => {
    communityService.toggleFollowSubject(currentUser, subjectId);
    onFollowsChanged();
  };

  const filteredSubjects = PLATFORM_SUBJECTS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#11162b] border border-cyan-500/30 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Manage Followed Subjects</h3>
            <p className="text-xs text-slate-400">
              Personalize your Community Feed by following verified engineering subjects.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subjects (e.g. DSA, DBMS, Operating Systems)..."
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500/50 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Subjects List */}
        <div className="overflow-y-auto pr-1 space-y-2.5 flex-1 max-h-96">
          {filteredSubjects.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No subjects matching "{search}"
            </div>
          ) : (
            filteredSubjects.map((subject) => {
              const isFollowed = followedIds.includes(subject.id);
              return (
                <div
                  key={subject.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    isFollowed
                      ? 'bg-cyan-500/10 border-cyan-500/40'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs bg-gradient-to-br ${
                        subject.color || 'from-cyan-500 to-blue-600'
                      } text-white shadow-md`}
                    >
                      {subject.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{subject.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{subject.description}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle(subject.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isFollowed
                        ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                    }`}
                  >
                    {isFollowed ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Following
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Follow
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-4">
          <span className="text-xs text-slate-400">
            Following <span className="text-cyan-400 font-bold">{followedIds.length}</span> of{' '}
            {PLATFORM_SUBJECTS.length} subjects
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-950/50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
