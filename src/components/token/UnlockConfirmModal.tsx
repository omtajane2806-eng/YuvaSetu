import React, { useState } from 'react';
import { User } from '../../types/user';
import { tokenService } from '../../services/tokenService';
import {
  Coins,
  Lock,
  Unlock,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  ShoppingBag,
} from 'lucide-react';

export interface UnlockConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string;
  resourceTitle: string;
  resourceType?: 'material' | 'course' | 'pack' | 'feature';
  tokenPrice: number;
  currentUser: User;
  onUnlockSuccess: () => void;
  onNavigateToBuy: () => void;
  onNavigateToEarn: () => void;
}

export const UnlockConfirmModal: React.FC<UnlockConfirmModalProps> = ({
  isOpen,
  onClose,
  resourceId,
  resourceTitle,
  resourceType = 'material',
  tokenPrice,
  currentUser,
  onUnlockSuccess,
  onNavigateToBuy,
  onNavigateToEarn,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentBalance = tokenService.getUserBalance(currentUser.id);
  const hasEnough = currentBalance >= tokenPrice;
  const remainingBalance = currentBalance - tokenPrice;

  const handleConfirmUnlock = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      // Simulate quick secure atomic validation
      await new Promise((res) => setTimeout(res, 400));

      const targetType = (resourceType || 'material') as 'material' | 'course' | 'pack' | 'feature';
      const result = tokenService.spendTokensToUnlock(
        currentUser,
        targetType,
        resourceId,
        resourceTitle,
        tokenPrice
      );

      if (!result.success) {
        setErrorMsg(result.error || 'Failed to unlock resource.');
        return;
      }

      setIsSuccess(true);
      onUnlockSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetAndClose = () => {
    setErrorMsg('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      id="unlock-confirm-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        id="unlock-confirm-modal-content"
        className="w-full max-w-md rounded-2xl bg-[#0e1324] border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Unlock Academic Resource</h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {!isSuccess ? (
            <>
              {/* Resource Preview Card */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[10px] font-black tracking-wider uppercase text-cyan-400">
                  Premium Masterclass
                </span>
                <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                  {resourceTitle}
                </h4>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400">Required Tokens:</span>
                  <span className="font-black text-amber-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    {tokenPrice} VT
                  </span>
                </div>
              </div>

              {/* Balance Summary Card */}
              <div className="p-3 rounded-xl bg-[#080c18] border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Your Current Balance:</span>
                  <span className="font-bold text-slate-200">{currentBalance} VT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Deduction:</span>
                  <span className="font-bold text-rose-400">-{tokenPrice} VT</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Balance After Unlock:</span>
                  <span
                    className={`font-black ${
                      hasEnough ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {hasEnough ? `${remainingBalance} VT` : 'Insufficient'}
                  </span>
                </div>
              </div>

              {/* Insufficient Balance warning & quick CTA */}
              {!hasEnough && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2.5">
                  <div className="flex items-start gap-2 text-xs text-rose-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <span>
                      You need <strong className="text-white">{tokenPrice - currentBalance} more VT</strong> to unlock this resource.
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        handleResetAndClose();
                        onNavigateToBuy();
                      }}
                      className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy Tokens</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleResetAndClose();
                        onNavigateToEarn();
                      }}
                      className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Learn & Earn</span>
                    </button>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {errorMsg}
                </div>
              )}
            </>
          ) : (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">Resource Unlocked!</h4>
              <p className="text-xs text-slate-300 max-w-xs">
                "{resourceTitle}" is now permanently unlocked in your account.
              </p>
              <div className="pt-2 text-xs text-slate-400">
                New Wallet Balance:{' '}
                <strong className="text-amber-400">
                  {tokenService.getUserBalance(currentUser.id)} VT
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          {!isSuccess ? (
            <>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              {hasEnough && (
                <button
                  type="button"
                  onClick={handleConfirmUnlock}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Unlocking...' : `Confirm Unlock (${tokenPrice} VT)`}</span>
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
            >
              Open Material Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
