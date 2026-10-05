import React, { useState } from 'react';
import { YuvaSetuLogo } from './YuvaSetuLogo';
import { LegalPolicyModal, LegalTab } from './LegalPolicyModal';
import {
  Sparkles,
  ShieldCheck,
  Send,
  Heart,
  ExternalLink,
  BookOpen,
  Users,
  HelpCircle,
  Video,
  Award,
} from 'lucide-react';

export interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<LegalTab>('privacy');

  const openLegalModal = (tab: LegalTab) => {
    setActiveLegalTab(tab);
    setLegalModalOpen(true);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  return (
    <footer
      id="yuvasetu-global-footer"
      className="w-full bg-[#05070d] border-t border-slate-800/90 pt-16 pb-12 text-slate-400"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP BRAND HEADER ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Logo & Mission (Col 1-5) */}
          <div className="lg:col-span-5 space-y-4">
            <YuvaSetuLogo
              id="footer-brand-logo"
              variant="footer"
              size="lg"
              showTagline={true}
              onClick={() => onNavigate('landing')}
              className="cursor-pointer"
            />
            <p className="text-slate-300 text-sm leading-relaxed max-w-md pt-2">
              YuvaSetu is India's dedicated academic learning platform. We guide students from deep conceptual understanding
              (<span className="text-cyan-400 font-semibold">Samajh</span>) to tangible academic and career success
              (<span className="text-orange-400 font-semibold">Safalta</span>).
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-[11px] font-bold text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Unified Learning Ecosystem
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/50 text-[11px] font-bold text-amber-300">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Verified Mentors
              </span>
            </div>
          </div>

          {/* QUICK LINKS & BRIDGES (Col 6-12) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
            {/* Main Navigation */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Navigation
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    id="footer-link-home"
                    onClick={() => {
                      onNavigate('landing');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-cyan-400 transition-colors text-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-explore"
                    onClick={() => onNavigate('explore')}
                    className="hover:text-cyan-400 transition-colors text-left"
                  >
                    Explore Notes & Videos
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-how-it-works"
                    onClick={() => {
                      onNavigate('landing');
                      setTimeout(() => {
                        const el = document.getElementById('how-it-works-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="hover:text-cyan-400 transition-colors text-left"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-community"
                    onClick={() => {
                      onNavigate('landing');
                      setTimeout(() => {
                        const el = document.getElementById('community-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="hover:text-cyan-400 transition-colors text-left"
                  >
                    Community
                  </button>
                </li>
              </ul>
            </div>

            {/* Platform & Organization */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" /> YuvaSetu
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    id="footer-link-about"
                    onClick={() => {
                      onNavigate('landing');
                      setTimeout(() => {
                        const el = document.getElementById('yuvasetu-problem-solution-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-docs"
                    onClick={() => {
                      onNavigate('documentation');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 text-cyan-300 font-bold transition-colors text-left flex items-center gap-1.5"
                  >
                    <span>Product & IP Docs</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-950 border border-cyan-700/60 text-cyan-400 font-mono">NEW</span>
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-contact"
                    onClick={() => {
                      onNavigate('documentation');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    Contact & Ownership
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-contact"
                    onClick={() => openLegalModal('contact')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    Contact & Grievance
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-privacy"
                    onClick={() => openLegalModal('privacy')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-terms"
                    onClick={() => openLegalModal('terms')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-community"
                    onClick={() => openLegalModal('community')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    Community Guidelines
                  </button>
                </li>
                <li>
                  <button
                    id="footer-link-content-policy"
                    onClick={() => openLegalModal('content')}
                    className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                  >
                    Content & Copyright
                  </button>
                </li>
              </ul>
            </div>

            {/* Newsletter & Updates */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Stay Connected
              </h4>
              <p className="text-[11px] text-slate-400 mb-3">
                Weekly conceptual deep-dives and live exam masterclass alerts.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter student / mentor email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-yuva-primary w-full py-2 text-xs font-bold transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>Subscribe to Updates</span>
                </button>
                {isSubscribed && (
                  <p className="text-[11px] text-emerald-400 font-semibold text-center animate-fadeIn">
                    ✓ Welcome to the YuvaSetu Academic Circle!
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM BRAND BAR & COPYRIGHT */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-black font-['Outfit'] text-white">YuvaSetu</span>
            <span>•</span>
            <span className="italic font-medium text-slate-300">Samajh Se Safalta Tak</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} YuvaSetu. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Unified Official Brand Identity
            </span>
            <span>•</span>
            <button
              onClick={() => openLegalModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => openLegalModal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => openLegalModal('content')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Content Policy
            </button>
          </div>
        </div>
      </div>

      {/* Legal & Policy Center Modal */}
      <LegalPolicyModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={activeLegalTab}
      />
    </footer>
  );
};
