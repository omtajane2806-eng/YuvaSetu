import React from 'react';
import { Calendar, Clock, ChevronDown } from 'lucide-react';
import { DateRangeFilter, DateRangePreset } from '../../types/analytics';

interface DateRangeSelectorProps {
  value: DateRangeFilter;
  onChange: (filter: DateRangeFilter) => void;
  className?: string;
}

const PRESETS: { id: DateRangePreset; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '90d', label: 'Last 90 Days' },
  { id: 'all', label: 'All Time' },
  { id: 'custom', label: 'Custom Range' },
];

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const handlePresetSelect = (preset: DateRangePreset) => {
    if (preset === 'custom') {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
      onChange({
        preset: 'custom',
        startDate: value.startDate || thirtyDaysAgo.toISOString().split('T')[0],
        endDate: value.endDate || now.toISOString().split('T')[0],
      });
    } else {
      onChange({ preset });
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      preset: 'custom',
      startDate: e.target.value,
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      preset: 'custom',
      endDate: e.target.value,
    });
  };

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
        {PRESETS.map((p) => {
          const isActive = value.preset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePresetSelect(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Custom Date Pickers when 'custom' is active */}
      {value.preset === 'custom' && (
        <div className="flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-slate-900/90 border border-cyan-500/40 animate-fadeIn text-xs">
          <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">From:</span>
            <input
              type="date"
              value={value.startDate || ''}
              onChange={handleStartDateChange}
              className="bg-slate-800/80 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
          <span className="text-slate-500 font-mono">-</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">To:</span>
            <input
              type="date"
              value={value.endDate || ''}
              onChange={handleEndDateChange}
              className="bg-slate-800/80 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};
