import React from 'react';
import { AIConversation } from '../../types/ai';
import { aiService } from '../../services/aiService';
import { MessageSquare, Trash2, Calendar, BookOpen, Clock, ArrowRight, X, Plus } from 'lucide-react';

interface AIHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  activeConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onNewChat: () => void;
}

export const AIHistoryDrawer: React.FC<AIHistoryDrawerProps> = ({
  isOpen,
  onClose,
  studentId,
  activeConversationId,
  onSelectConversation,
  onNewChat,
}) => {
  const conversations = aiService.getStudentConversations(studentId);

  if (!isOpen) return null;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation? This action cannot be undone.')) {
      aiService.deleteConversation(id, studentId);
      if (activeConversationId === id) {
        onNewChat();
      }
    }
  };

  return (
    <div
      id="yuvasetu-ai-history-drawer"
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-md h-full bg-[#0b0f1e] border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
        {/* HEADER */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm sm:text-base font-black font-['Outfit'] text-white">
                Conversation History
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Start New Learning Chat</span>
          </button>
        </div>

        {/* CONVERSATION LIST */}
        <div className="py-4 space-y-2.5 overflow-y-auto flex-1 my-2 pr-1">
          {conversations.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-bold text-slate-400">No past conversations yet</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Ask a question about your study materials to start your conceptual revision history.
              </p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              const dateLabel = new Date(conv.updated_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isActive
                      ? 'bg-cyan-500/15 border-cyan-400/80 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{conv.title}</p>
                    {conv.material_title && (
                      <div className="flex items-center gap-1 text-[10px] text-cyan-400">
                        <BookOpen className="w-3 h-3 shrink-0" />
                        <span className="truncate">{conv.material_title}</span>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-500">{dateLabel}</p>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, conv.id)}
                    title="Delete conversation"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-3 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500">
            Conversations are strictly private to your YuvaSetu student profile.
          </p>
        </div>
      </div>
    </div>
  );
};
