import React from 'react';
import { ShieldAlert, Compass, ArrowLeft, LogIn, RefreshCw, Home } from 'lucide-react';
import { YuvaSetuLogo } from './YuvaSetuLogo';

export type ErrorStateType = '404' | 'unauthorized' | 'forbidden' | 'network' | 'server';

interface ErrorStateCardProps {
  type?: ErrorStateType;
  title?: string;
  message?: string;
  onNavigate: (view: string, payload?: any) => void;
  onRetry?: () => void;
}

export const ErrorStateCard: React.FC<ErrorStateCardProps> = ({
  type = '404',
  title,
  message,
  onNavigate,
  onRetry,
}) => {
  const getDetails = () => {
    switch (type) {
      case 'unauthorized':
      case 'forbidden':
        return {
          icon: ShieldAlert,
          iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          defaultTitle: 'Authorization Required',
          defaultMessage:
            'This academic portal or administrative dashboard requires verified permissions. Please log in with an authorized account to continue.',
          primaryAction: () => onNavigate('login'),
          primaryLabel: 'Log In with Credentials',
          primaryIcon: LogIn,
          secondaryAction: () => onNavigate('landing'),
          secondaryLabel: 'Return to Home',
          secondaryIcon: Home,
        };
      case 'network':
      case 'server':
        return {
          icon: RefreshCw,
          iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          defaultTitle: 'Connection Interrupted',
          defaultMessage:
            'Unable to reach the YuvaSetu server. Please verify your internet connection or try refreshing the request.',
          primaryAction: onRetry || (() => window.location.reload()),
          primaryLabel: 'Try Again',
          primaryIcon: RefreshCw,
          secondaryAction: () => onNavigate('landing'),
          secondaryLabel: 'Return to Home',
          secondaryIcon: Home,
        };
      case '404':
      default:
        return {
          icon: Compass,
          iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
          defaultTitle: 'Page Not Found',
          defaultMessage:
            'The academic resource or view you are looking for does not exist or has been relocated.',
          primaryAction: () => onNavigate('explore'),
          primaryLabel: 'Explore Study Materials',
          primaryIcon: Compass,
          secondaryAction: () => onNavigate('landing'),
          secondaryLabel: 'Return to Home',
          secondaryIcon: Home,
        };
    }
  };

  const details = getDetails();
  const Icon = details.icon;
  const PrimaryIcon = details.primaryIcon;
  const SecondaryIcon = details.secondaryIcon;

  return (
    <div
      id="yuvasetu-error-state"
      className="min-h-[60vh] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="max-w-md w-full bg-[#0b0f1e] border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-fadeIn">
        <div className="flex justify-center">
          <YuvaSetuLogo variant="icon" size="md" />
        </div>

        <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border ${details.iconColor}`}>
          <Icon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
            {title || details.defaultTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {message || details.defaultMessage}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={details.primaryAction}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PrimaryIcon className="w-4 h-4" />
            <span>{details.primaryLabel}</span>
          </button>

          <button
            onClick={details.secondaryAction}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <SecondaryIcon className="w-4 h-4" />
            <span>{details.secondaryLabel}</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
          YuvaSetu • Samajh Se Safalta Tak
        </div>
      </div>
    </div>
  );
};
