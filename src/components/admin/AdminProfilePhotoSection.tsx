import React, { useState } from 'react';
import { User } from '../../types/user';
import { UserInitialsBadge } from '../UserInitialsBadge';
import {
  Upload,
  Camera,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Laptop,
  Check,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { AdminProfilePhotoCropModal } from './AdminProfilePhotoCropModal';

export interface AdminProfilePhotoSectionProps {
  currentUser: User;
  onUpdateUser?: (updatedUser: User) => void;
  showToast?: (message: string) => void;
  className?: string;
}

export const AdminProfilePhotoSection: React.FC<AdminProfilePhotoSectionProps> = ({
  currentUser,
  onUpdateUser,
  showToast,
  className = '',
}) => {
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [userState, setUserState] = useState<User>(currentUser);

  // Sync state if currentUser prop updates
  React.useEffect(() => {
    setUserState(currentUser);
  }, [currentUser]);

  const hasPhoto = Boolean(userState.profileImage);

  // Handle Save Photo from Crop Modal
  const handleSavePhoto = async (fileOrBlob: File | Blob | string) => {
    setErrorNotice(null);
    setSuccessNotice(null);
    try {
      const result = await authService.uploadAdminProfilePhoto(
        userState.id,
        fileOrBlob,
        userState.role
      );

      setUserState(result.user);
      if (onUpdateUser) {
        onUpdateUser(result.user);
      }

      setSuccessNotice('Admin profile picture updated and persisted successfully.');
      if (showToast) {
        showToast('Admin profile picture uploaded successfully!');
      }
    } catch (err: any) {
      console.error('Failed to upload admin photo:', err);
      setErrorNotice(err?.message || 'Failed to upload admin photo. Please try again.');
      throw err;
    }
  };

  // Handle Remove Photo
  const handleRemovePhoto = async () => {
    if (!hasPhoto) return;

    if (!window.confirm('Are you sure you want to remove your admin profile photo? Your account will revert to the standard UserInitialsBadge.')) {
      return;
    }

    setIsRemoving(true);
    setErrorNotice(null);
    setSuccessNotice(null);

    try {
      const result = await authService.removeAdminProfilePhoto(userState.id, userState.role);
      setUserState(result.user);
      if (onUpdateUser) {
        onUpdateUser(result.user);
      }

      setSuccessNotice('Admin profile photo removed. Initials badge restored.');
      if (showToast) {
        showToast('Profile photo removed.');
      }
    } catch (err: any) {
      console.error('Failed to remove admin photo:', err);
      setErrorNotice(err?.message || 'Failed to remove admin photo.');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div
      id="admin-profile-settings-section"
      className={`space-y-6 ${className}`}
    >
      {/* 1. BREADCRUMB & HEADER (Admin Dashboard → Profile → Settings) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-1">
            <span className="text-cyan-400 font-semibold">Admin Dashboard</span>
            <span>→</span>
            <span className="text-slate-300 font-semibold">Profile</span>
            <span>→</span>
            <span className="text-rose-400 font-bold">Settings</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
            Profile Picture & Identity
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure your verified administrator profile photo across the YuvaSetu platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Sole Admin Privilege</span>
          </span>
        </div>
      </div>

      {/* 2. SUCCESS & ERROR ALERTS */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 text-xs font-semibold flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            className="text-emerald-300 hover:text-white text-xs underline cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorNotice && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/80 text-rose-200 text-xs font-semibold flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <button
            onClick={() => setErrorNotice(null)}
            className="text-rose-300 hover:text-white text-xs underline cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. PROFILE PICTURE CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c1228] via-[#0e1530] to-[#0a1024] border border-slate-700/80 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Left: Picture Preview & Metadata */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Current Profile Picture Preview (Circular Display) */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-rose-500/70 shadow-2xl bg-slate-900 ring-4 ring-rose-500/20 flex items-center justify-center">
                {hasPhoto ? (
                  <img
                    src={userState.profileImage}
                    alt={userState.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserInitialsBadge
                    name={userState.name}
                    role="admin"
                    size="xl"
                  />
                )}
              </div>

              {/* Online / Active Indicator */}
              <span
                className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-400 border-3 border-[#0c1228] shadow-md"
                title="Active Administrator"
              />
            </div>

            {/* Profile Info & Status */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-white">
                  {userState.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Lead Admin
                </span>
                {hasPhoto ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Custom Photo Active</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    UserInitialsBadge Active
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-mono text-cyan-400">{userState.email}</p>
                <p className="text-slate-400 text-[11px]">
                  Visible in: Admin Navbar, Admin Dashboard, Live Session Host Badges & System Announcements.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> Android & iPhone
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5 text-cyan-400" /> Windows & Mac
                </span>
                <span>•</span>
                <span>JPEG, PNG, WebP (Max 5 MB)</span>
              </div>
            </div>
          </div>

          {/* Right: Required Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            {!hasPhoto ? (
              /* 1. Upload Photo Button */
              <button
                type="button"
                id="btn-upload-admin-photo"
                onClick={() => setIsCropModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
            ) : (
              <>
                {/* 2. Change Photo Button */}
                <button
                  type="button"
                  id="btn-change-admin-photo"
                  onClick={() => setIsCropModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Change Photo</span>
                </button>

                {/* 3. Remove Photo Button */}
                <button
                  type="button"
                  id="btn-remove-admin-photo"
                  onClick={handleRemovePhoto}
                  disabled={isRemoving}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>{isRemoving ? 'Removing...' : 'Remove Photo'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 4. GUIDELINES & SECURITY POLICY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Cropping & Editing</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              When you upload, an interactive editor enables zooming, 90° rotation, and touch/mouse repositioning within a circular mask. You can cancel at any time before clicking &ldquo;Save Changes&rdquo;.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Student Privacy Safeguards (Exclusively Admin)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              In accordance with YuvaSetu privacy safeguards, profile picture uploads are strictly restricted to verified platform administrators. Student accounts exclusively use dynamic initials badges.
            </p>
          </div>
        </div>
      </div>

      {/* 5. CROP & REPOSITION MODAL */}
      <AdminProfilePhotoCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        adminName={userState.name}
        adminEmail={userState.email}
        currentProfileImage={userState.profileImage}
        onSavePhoto={handleSavePhoto}
      />
    </div>
  );
};
