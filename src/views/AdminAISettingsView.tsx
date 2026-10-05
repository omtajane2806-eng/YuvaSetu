import React, { useState } from 'react';
import { AdminAISettings, AIStatsOverview } from '../types/ai';
import { aiService } from '../services/aiService';
import { User } from '../types/user';
import {
  Sparkles,
  Bot,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Save,
  RotateCcw,
  Zap,
  Activity,
  Layers,
  HelpCircle,
  Clock,
  Award,
  BookOpen,
} from 'lucide-react';

interface AdminAISettingsViewProps {
  currentUser: User | null;
  onNavigate: (view: string, payload?: any) => void;
}

export const AdminAISettingsView: React.FC<AdminAISettingsViewProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [settings, setSettings] = useState<AdminAISettings>(() => aiService.getAdminSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const stats: AIStatsOverview = aiService.getAIStatsOverview();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = aiService.updateAdminSettings(
      settings,
      currentUser?.name || 'Om Tajane (Admin)'
    );
    setSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all AI settings to default values?')) {
      const reset = aiService.updateAdminSettings(
        {
          aiEnabled: true,
          model: 'gemini-3.7-flash',
          maxResponseLength: 1200,
          sourceGroundedMode: true,
          generalKnowledgeFallback: true,
          usageLogging: true,
          educationSafetyEnforced: true,
        },
        currentUser?.name || 'Admin'
      );
      setSettings(reset);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div
      id="vidyasetu-admin-ai-settings"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn"
    >
      {/* TOP HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#090d1c] to-[#1e1430] border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider">
                Admin Exclusive
              </span>
              <h1 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                AI Learning Assistant Settings & Control
              </h1>
            </div>
            <p className="text-xs text-slate-300">
              Configure models, safety boundaries, source-grounding rules, and monitor platform AI usage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('admin_analytics')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Analytics</span>
          </button>
        </div>
      </div>

      {/* REAL USAGE TELEMETRY OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400">Total Questions</span>
          <p className="text-xl font-black text-white font-mono">{stats.totalQuestionsAsked}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400">Conversations</span>
          <p className="text-xl font-black text-cyan-400 font-mono">{stats.totalConversations}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400">Summaries</span>
          <p className="text-xl font-black text-purple-400 font-mono">{stats.totalSummariesGenerated}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400">Quizzes Taken</span>
          <p className="text-xl font-black text-emerald-400 font-mono">{stats.totalQuizzesCompleted}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400">Avg Quiz Score</span>
          <p className="text-xl font-black text-amber-400 font-mono">{stats.averageQuizScorePercent}%</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0b0f1e] border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400">Helpful Rating</span>
          <p className="text-xl font-black text-blue-400 font-mono">{stats.helpfulRatePercent}%</p>
        </div>
      </div>

      {/* SETTINGS FORM */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0f1e] border border-slate-800 space-y-6 shadow-xl">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>AI Engine & Operational Controls</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Global Toggle */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">AI Learning Assistant</span>
                  <span className="text-[11px] text-slate-400">
                    Enable or disable AI Assistant access across all student views.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.aiEnabled}
                  onChange={(e) => setSettings({ ...settings, aiEnabled: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Model Selector */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white block">Primary AI Model</label>
              <select
                value={settings.model}
                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="gemini-3.7-flash">Gemini 3.7 Flash (Fast, High Quality - Recommended)</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep Complex Reasoning)</option>
                <option value="gemini-flash-latest">Gemini Flash Latest</option>
              </select>
            </div>

            {/* Source-Grounded Mode */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Strict Source-Grounded Mode</span>
                  <span className="text-[11px] text-slate-400">
                    Prioritize YuvaSetu curriculum notes and real PDF pages as primary context.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.sourceGroundedMode}
                  onChange={(e) => setSettings({ ...settings, sourceGroundedMode: e.target.checked })}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* General Knowledge Fallback */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">General Knowledge Fallback</span>
                  <span className="text-[11px] text-slate-400">
                    If topic is not found in attached material, provide general foundational explanation.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.generalKnowledgeFallback}
                  onChange={(e) =>
                    setSettings({ ...settings, generalKnowledgeFallback: e.target.checked })
                  }
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Max Response Length */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white">Max Response Tokens / Words</label>
                <span className="font-mono text-xs text-cyan-400">{settings.maxResponseLength}</span>
              </div>
              <input
                type="range"
                min={400}
                max={2500}
                step={100}
                value={settings.maxResponseLength}
                onChange={(e) => setSettings({ ...settings, maxResponseLength: Number(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Educational Safety */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Educational Safety Enforcement</span>
                  <span className="text-[11px] text-slate-400">
                    Prevent direct assignment completion; steer students toward conceptual outlines.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.educationSafetyEnforced}
                  onChange={(e) =>
                    setSettings({ ...settings, educationSafetyEnforced: e.target.checked })
                  }
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Audit Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <span>
              Last updated: <strong>{new Date(settings.lastUpdated).toLocaleString()}</strong> by{' '}
              <strong className="text-cyan-400">{settings.updatedBy}</strong>
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-400 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savedSuccess ? 'Settings Saved!' : 'Save AI Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
