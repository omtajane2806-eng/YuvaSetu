import React, { useState } from 'react';
import { TokenPackage, PaymentRecord } from '../../types/token';
import { User } from '../../types/user';
import { paymentService } from '../../services/paymentService';
import { tokenService } from '../../services/tokenService';
import {
  Coins,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  ArrowRight,
  Lock,
  Sparkles,
} from 'lucide-react';

export interface TokenCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: TokenPackage | null;
  currentUser: User;
  onSuccess: (paymentRecord: PaymentRecord, tokensAdded: number) => void;
}

export const TokenCheckoutModal: React.FC<TokenCheckoutModalProps> = ({
  isOpen,
  onClose,
  pkg,
  currentUser,
  onSuccess,
}) => {
  const [step, setStep] = useState<'review' | 'processing' | 'success' | 'error'>('review');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState(`${currentUser.email.split('@')[0]}@okaxis`);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successRecord, setSuccessRecord] = useState<PaymentRecord | null>(null);

  if (!isOpen || !pkg) return null;

  const totalTokens = pkg.token_amount + (pkg.bonus_tokens || 0);

  const handleInitiateAndPay = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    setStep('processing');

    try {
      // 1. Create server-authoritative payment record
      const initResult = paymentService.createPayment(currentUser, pkg, `UPI / ${paymentMethod.toUpperCase()}`);
      if (!initResult.success || !initResult.paymentRecord) {
        throw new Error(initResult.errorMessage || 'Failed to initiate payment.');
      }

      // 2. Simulate realistic secure gateway verification latency
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // 3. Verify payment on server abstraction
      const verifyResult = paymentService.verifyPayment(initResult.paymentRecord.id, {
        paymentId: initResult.paymentRecord.id,
        providerPaymentId: `upi_ref_${Date.now()}_ok`,
      });

      if (!verifyResult.success || !verifyResult.paymentRecord) {
        throw new Error(verifyResult.error || 'Payment verification failed at gateway.');
      }

      // 4. Authoritatively credit tokens in the ledger
      const creditResult = tokenService.processVerifiedPayment(verifyResult.paymentRecord);
      if (!creditResult.success) {
        throw new Error(creditResult.error || 'Failed to credit tokens to ledger.');
      }

      setSuccessRecord(verifyResult.paymentRecord);
      setStep('success');
      onSuccess(verifyResult.paymentRecord, totalTokens);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetAndClose = () => {
    setStep('review');
    setErrorMessage('');
    setSuccessRecord(null);
    onClose();
  };

  return (
    <div
      id="token-checkout-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        id="token-checkout-modal-content"
        className="w-full max-w-lg rounded-2xl bg-[#0e1324] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">VidyaTokens Purchase</h3>
              <p className="text-xs text-slate-400">Official YuvaSetu Academic Credits</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on Step */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {step === 'review' && (
            <>
              {/* Package Summary Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-slate-900/90 border border-amber-500/30 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                      Selected Package
                    </span>
                    <h4 className="text-lg font-bold text-white">{pkg.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">₹{pkg.rupee_amount}</span>
                    <p className="text-[10px] text-slate-400">Inclusive of all taxes</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0a0d18] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-slate-200">Tokens Credited:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-amber-400">{pkg.token_amount} VT</span>
                    {pkg.bonus_tokens > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        +{pkg.bonus_tokens} Bonus
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Effective Value:</span>
                  <span className="font-semibold text-slate-200">
                    Total {totalTokens} VidyaTokens (1 INR ≈ 10 VT)
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Choose Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                      paymentMethod === 'upi'
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Instant UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                      paymentMethod === 'card'
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cards / Debit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                      paymentMethod === 'netbanking'
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* UPI ID Input if UPI is selected */}
              {paymentMethod === 'upi' && (
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <label className="text-xs font-medium text-slate-400">Virtual Payment Address (VPA / UPI ID)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="w-full px-3 py-2 rounded-lg bg-[#080c16] border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    Supports Google Pay, PhonePe, Paytm, BHIM & all Indian banking apps.
                  </p>
                </div>
              )}

              {/* Guarantees & Transparency Notice */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300">YuvaSetu Fair Learning Pledge:</span>{' '}
                  All core study materials remain completely free. Tokens are used exclusively for advanced optional masterclasses and rewarding student contributors.
                </div>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin flex items-center justify-center">
                <Coins className="w-6 h-6 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Verifying Transaction with Gateway...</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Authoritatively validating payment reference and preparing atomic ledger entry for {totalTokens} VT.
                </p>
              </div>
            </div>
          )}

          {step === 'success' && successRecord && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Purchase Successful!</h4>
                <p className="text-sm text-emerald-400 font-semibold">
                  +{totalTokens} VidyaTokens have been added to your wallet
                </p>
                <p className="text-xs text-slate-400 max-w-sm pt-1">
                  Payment Reference: <span className="font-mono text-slate-300">{successRecord.id}</span>
                </p>
              </div>

              <div className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Package:</span>
                  <span className="font-semibold text-white">{pkg.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Amount Paid:</span>
                  <span className="font-semibold text-white">₹{pkg.rupee_amount}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tokens Added:</span>
                  <span className="font-black text-amber-400">{totalTokens} VT</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Timestamp:</span>
                  <span className="font-mono text-slate-300">
                    {new Date(successRecord.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Payment Unsuccessful</h4>
                <p className="text-xs text-rose-300 max-w-sm">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
          {step === 'review' && (
            <>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInitiateAndPay}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <span>Pay ₹{pkg.rupee_amount} & Get {totalTokens} VT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 'processing' && (
            <div className="w-full text-center text-xs text-slate-400">
              Please do not refresh or close this window...
            </div>
          )}

          {step === 'success' && (
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
            >
              Done & Return to Wallet
            </button>
          )}

          {step === 'error' && (
            <>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setStep('review')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
