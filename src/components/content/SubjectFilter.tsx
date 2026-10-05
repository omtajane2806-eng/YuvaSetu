import React from 'react';
import { SubjectItem } from '../../types/content';
import { Layers } from 'lucide-react';

export interface SubjectFilterProps {
  subjects: SubjectItem[];
  selectedSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  className?: string;
}

export const SubjectFilter: React.FC<SubjectFilterProps> = ({
  subjects,
  selectedSubjectId,
  onSelectSubject,
  className = '',
}) => {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {/* Horizontal scroll container with hidden scrollbar for sleek touch experience */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar py-1">
        <button
          id="subject-filter-all"
          onClick={() => onSelectSubject('all')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedSubjectId === 'all'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40'
              : 'bg-[#0c1020] text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Subjects</span>
        </button>

        {subjects.map((subject) => {
          const isSelected = selectedSubjectId === subject.id || selectedSubjectId === subject.name;
          return (
            <button
              key={subject.id}
              id={`subject-filter-${subject.id}`}
              onClick={() => onSelectSubject(subject.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40'
                  : 'bg-[#0c1020] text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {subject.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
