import React, { useState } from 'react';
import { Shield, FileText, Users, AlertTriangle, Mail, X, CheckCircle2 } from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'community' | 'content' | 'contact';

interface LegalPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalPolicyModal: React.FC<LegalPolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                YuvaSetu Legal & Policy Center
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Pre-Deployment Draft
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official policies and operational guidelines for YuvaSetu platform users.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/80 px-4 overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'terms'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Terms of Use
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'community'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Community Guidelines
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'content'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Content Policy & Copyright
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'contact'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            Contact & Grievance
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 flex-1 leading-relaxed">
          {/* Legal Status Notice */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Notice to Stakeholders & Users:</p>
              <p className="text-amber-300/90 text-[11px] mt-0.5">
                These documentation placeholders reflect the operational architecture and intended legal policies of YuvaSetu. 
                Formal legal counsel review and territorial compliance ratification will be finalized prior to live commercial deployment.
              </p>
            </div>
          </div>

          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1">1. Information YuvaSetu Collects</h3>
                <p className="text-xs text-slate-400">
                  YuvaSetu collects only necessary data required to facilitate student learning, peer collaboration, and academic progress tracking:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                  <li><strong>Account Identity:</strong> Student/Admin name, institutional email address, hashed authentication credentials.</li>
                  <li><strong>Academic Profile:</strong> College name, engineering branch, course, academic semester/year, and enrolled subjects.</li>
                  <li><strong>Learning Interactions:</strong> Curated materials viewed/downloaded, doubts submitted, peer answers posted, and live sessions attended.</li>
                  <li><strong>VidyaTokens Ledger:</strong> Double-entry logs of tokens earned via peer help and spent on academic material unlocks.</li>
                  <li><strong>Avatar & Privacy:</strong> YuvaSetu uses name-based initials and system-generated avatars; external personal profile photos are never scraped or publicly exposed.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">2. Purpose of Data Processing</h3>
                <p className="text-xs text-slate-400">
                  User data is processed strictly for pedagogical continuity: personalizing syllabus recommendations, enabling interactive study rooms, tracking revision streaks, preventing platform abuse, and auditing administrative actions.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">3. Data Retention & Deletion</h3>
                <p className="text-xs text-slate-400">
                  Students may request account deletion or data export via platform administrators. Upon verified account termination, identifying personal details are expunged from the active user table, while anonymized academic ledger records remain for cryptographic integrity.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF USE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1">1. Acceptance of Terms</h3>
                <p className="text-xs text-slate-400">
                  By registering or logging into YuvaSetu (&ldquo;Platform&rdquo;), users agree to adhere to these Terms of Use and platform honor codes.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">2. User Roles & Access Boundaries</h3>
                <p className="text-xs text-slate-400">
                  The platform recognizes strictly defined roles: <strong>Student</strong> and <strong>Platform Administrator</strong>. 
                  Students are granted personal, non-exclusive access to browse materials, submit doubts, participate in study rooms, and accumulate non-monetary VidyaTokens. 
                  Administrative access is restricted to verified educational leads.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">3. VidyaTokens Policy</h3>
                <p className="text-xs text-slate-400">
                  VidyaTokens (VT) are internal, non-monetary academic motivation credits designed to incentivize consistent study habits and peer assistance. 
                  VidyaTokens cannot be exchanged for cash, traded outside the platform, or transferred between arbitrary external wallets.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">4. Prohibited Activities</h3>
                <p className="text-xs text-slate-400">
                  Users agree never to: (a) attempt unauthorized access to administrative endpoints; (b) share account credentials; 
                  (c) upload malicious code, commercial spam, or non-academic materials; or (d) scrape platform databases.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNITY GUIDELINES */}
          {activeTab === 'community' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1">1. Academic Respect & Peer Support</h3>
                <p className="text-xs text-slate-400">
                  YuvaSetu is an academic haven for engineering and university students. Discussions in doubt forums, study rooms, and community threads must remain supportive, respectful, and constructive.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">2. Anti-Harassment & Zero-Bullying Policy</h3>
                <p className="text-xs text-slate-400">
                  Hate speech, personal insults, discriminatory remarks based on caste, gender, religion, or institution, and academic humiliation are strictly prohibited and will result in immediate account suspension.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">3. Academic Integrity & Anti-Cheating</h3>
                <p className="text-xs text-slate-400">
                  YuvaSetu promotes conceptual mastery (&ldquo;Samajh Se Safalta Tak&rdquo;). Asking or providing live exam answers during active examinations, soliciting direct assignment fraud, or uploading leaked test papers violates the core honor code.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CONTENT POLICY */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1">1. Content Categorization</h3>
                <p className="text-xs text-slate-400">
                  Platform content consists of: (a) Curated educational handouts created by verified administrators; (b) Peer question/answer contributions posted by students; and (c) Pedagogical summaries synthesized by the AI learning assistant.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">2. Intellectual Property & Copyright Protection</h3>
                <p className="text-xs text-slate-400">
                  All educational notes and question banks uploaded to YuvaSetu must be original works, legitimately licensed, or published with permission. 
                  YuvaSetu respects intellectual property rights and adheres to swift notice-and-takedown procedures.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">3. Takedown & Copyright Notice Procedure</h3>
                <p className="text-xs text-slate-400">
                  If any copyright owner or academic institution believes material hosted on the platform infringes upon their rights, they may send a formal takedown request to our designated grievance contact with evidence of ownership and the exact resource URL.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT & GRIEVANCE */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Official Contact & Support Channels</h3>
                <p className="text-xs text-slate-400 mb-3">
                  For platform inquiries, institutional partnerships, copyright notices, or account assistance:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                    <p className="text-slate-400 font-medium">Academic & Operational Lead</p>
                    <p className="text-white font-bold mt-1">Om Tajane</p>
                    <p className="text-cyan-400 text-[11px] mt-0.5">omtajane2806@gmail.com</p>
                  </div>
                  <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl">
                    <p className="text-slate-400 font-medium">Platform Administration & Curriculum</p>
                    <p className="text-white font-bold mt-1">Ranjan Zambare</p>
                    <p className="text-cyan-400 text-[11px] mt-0.5">ranjanzambare9119@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl text-xs space-y-1">
                <p className="font-semibold text-white">General Inquiries & Feedback</p>
                <p className="text-slate-400 text-[11px]">
                  Institutional support email: <span className="text-cyan-300 font-mono">support@yuvasetu.edu</span> (Production placeholder)
                </p>
                <p className="text-slate-400 text-[11px]">
                  Grievance Officer: Designated Academic Review Board, YuvaSetu Foundation.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>YuvaSetu • Samajh Se Safalta Tak</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
