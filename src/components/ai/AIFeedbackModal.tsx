import React, { useState } from 'react';
import { AIFeedbackRecord } from '../../types/ai';
import { aiService } from '../../services/aiService';
import { User } from '../../types/user';
import { ThumbsDown, ThumbsUp, X, Check } from 'lucide-react';

interface AIFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  conversationId: string;
  isHelpful: boolean;
  currentUser: User | null;
}

export const AIFeedbackModal: React.FC<AIFeedbackModalProps> = ({
  isOpen,
  onClose,
  messageId,
  conversationId,
  isHelpful,
  currentUser,
}) => {
  const [reason, setReason] = useState<AIFeedbackRecord['reason']>('Incorrect');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    aiService.submitFeedback(
      currentUser.id,
      currentUser.name,
      currentUser.email,
      messageId,
      conversationId,
      isHelpful,
      reason,
      comment
    );

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  const negativeReasons: Array<AIFeedbackRecord['reason']> = [
    'Incorrect',
    'Not Relevant',
    'Too Complicated',
    'Missing Information',
    'Other',
  ];

  return (
    <div
      id="yuvasetu-ai-feedback-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-[#0b0f1e] border border-slate-800 shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {isHelpful ? (
              <ThumbsUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <ThumbsDown className="w-4 h-4 text-red-400" />
            )}
            <h3 className="text-sm font-bold text-white">
              {isHelpful ? 'Feedback: Helpful Answer' : 'Feedback: How can we improve?'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">Thank you for your feedback!</p>
            <p className="text-xs text-slate-400">
              Your feedback helps YuvaSetu maintain accurate and grounded conceptual explanations.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            {!isHelpful && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  What was the issue with this response?
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as AIFeedbackRecord['reason'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {negativeReasons.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share any specific feedback about formulas, code, or clarity..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-400 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
