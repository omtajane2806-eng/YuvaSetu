import React, { useState, useEffect } from 'react';
import { User, EditAdminFormData, UserStatus } from '../../types/user';
import { X, ShieldCheck, Check, AlertCircle, Shield } from 'lucide-react';

export interface EditAdminModalProps {
  isOpen: boolean;
  admin: User | null;
  onClose: () => void;
  onSubmit: (adminId: string, updates: EditAdminFormData) => void;
}

export const EditAdminModal: React.FC<EditAdminModalProps> = ({
  isOpen,
  admin,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<EditAdminFormData>({
    name: '',
    email: '',
    bio: '',
    college: '',
    course: '',
    branch: '',
    status: 'ACTIVE',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || '',
        email: admin.email || '',
        bio: admin.bio || '',
        college: admin.college || 'YuvaSetu Academic Lead',
        course: admin.course || 'Platform Administration',
        branch: admin.branch || 'Administrator',
        status: admin.status || 'ACTIVE',
      });
      setError(null);
    }
  }, [admin, isOpen]);

  if (!isOpen || !admin) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name?.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!formData.email?.trim()) {
      setError('Email address is required.');
      return;
    }

    try {
      onSubmit(admin.id, formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update administrator.');
    }
  };

  return (
    <div
      id="edit-admin-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div
        id="edit-admin-modal-container"
        className="w-full max-w-lg rounded-3xl bg-[#0b0f1e] border border-rose-500/30 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-['Outfit'] text-white">
                Edit Administrator
              </h3>
              <p className="text-xs text-slate-400">
                Update administrator credentials and responsibilities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-rose-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-rose-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Role Title / Lead</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. YuvaSetu Academic Lead"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-rose-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-rose-500 transition-all cursor-pointer font-bold"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Bio / Administrative Role</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-rose-500 transition-all"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Sole Admin Safety is enforced: the system will prevent deactivating the only active administrator.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-black shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Admin Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
