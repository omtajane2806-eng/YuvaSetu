import React, { useState, useEffect } from 'react';
import { User } from '../types/user';
import { ContentItem } from '../types/content';
import { contentService } from '../services/contentService';
import { YuvaSetuLogo } from '../components/YuvaSetuLogo';
import {
  Upload,
  FileText,
  FileCode,
  Video,
  Eye,
  Heart,
  Calendar,
  Trash2,
  Edit3,
  ExternalLink,
  Plus,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export interface MyContentViewProps {
  currentUser: User;
  onNavigate: (view: string, payload?: any) => void;
}

export const MyContentView: React.FC<MyContentViewProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [myItems, setMyItems] = useState<ContentItem[]>(() =>
    contentService.getUserUploadedContent(currentUser.id)
  );

  // Edit modal states
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const refreshList = () => {
    setMyItems(contentService.getUserUploadedContent(currentUser.id));
  };

  const handleStartEdit = (item: ContentItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      contentService.editContent(currentUser.id, editingItem.id, {
        title: editTitle,
        description: editDescription,
      });
      setEditingItem(null);
      refreshList();
      setActionSuccess('Resource updated successfully!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Failed to update resource.');
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;

    try {
      contentService.deleteContent(currentUser.id, deletingId);
      setDeletingId(null);
      refreshList();
      setActionSuccess('Resource deleted successfully.');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Failed to delete resource.');
    }
  };

  const totalViews = myItems.reduce((acc, curr) => acc + curr.views, 0);
  const totalLikes = myItems.reduce((acc, curr) => acc + curr.likes, 0);

  const typeIcons = {
    note: <FileText className="w-3.5 h-3.5" />,
    pdf: <FileCode className="w-3.5 h-3.5" />,
    video: <Video className="w-3.5 h-3.5" />,
  };

  return (
    <div id="yuvasetu-my-content-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <YuvaSetuLogo variant="icon" size="sm" />
            <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
              My Uploaded Content
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your peer notes, PDF sheets, and lectures contributed to the YuvaSetu academic bridge.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="my-content-upload-btn"
            onClick={() => onNavigate('upload_content')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Upload New Resource</span>
          </button>
        </div>
      </div>

      {/* 2. SUCCESS TOAST */}
      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 3. METRICS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0a0e1c] border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-slate-400">Total Uploads</span>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{myItems.length}</div>
          <span className="text-[10px] text-cyan-400 font-semibold">100% Free Peer Resources</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a0e1c] border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-slate-400">Student Views</span>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">{totalViews}</div>
          <span className="text-[10px] text-slate-400 font-semibold">Across all uploaded items</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a0e1c] border border-slate-800 space-y-1">
          <span className="text-[11px] font-black uppercase text-slate-400">Peer Likes</span>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">{totalLikes}</div>
          <span className="text-[10px] text-slate-400 font-semibold">Community appreciation</span>
        </div>
      </div>

      {/* 4. CONTENT LIST / TABLE */}
      {myItems.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-[#090d1a] border border-slate-800 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">You haven't uploaded any content yet</h3>
            <p className="text-xs text-slate-400">
              Share handwritten notes, PDF formula sheets, or video lessons to help peer students bridge their learning.
            </p>
          </div>
          <button
            onClick={() => onNavigate('upload_content')}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-black shadow-md cursor-pointer"
          >
            + Upload Your First Resource
          </button>
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0a0e1c] border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0e1428] border-b border-slate-800 text-[10px] uppercase font-black tracking-wider text-slate-400">
                <tr>
                  <th className="p-4 sm:p-5">Resource</th>
                  <th className="p-4 sm:p-5">Type</th>
                  <th className="p-4 sm:p-5">Subject</th>
                  <th className="p-4 sm:p-5">Views / Likes</th>
                  <th className="p-4 sm:p-5">Uploaded Date</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {myItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-12 h-10 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div className="max-w-xs sm:max-w-sm">
                          <p className="font-bold text-white line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 sm:p-5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 font-semibold uppercase text-[10px]">
                        {typeIcons[item.content_type]}
                        <span>{item.content_type}</span>
                      </span>
                    </td>

                    <td className="p-4 sm:p-5">
                      <span className="text-cyan-400 font-semibold">{item.subject_name}</span>
                    </td>

                    <td className="p-4 sm:p-5 font-mono">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{item.views}</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          <span>{item.likes}</span>
                        </span>
                      </div>
                    </td>

                    <td className="p-4 sm:p-5 text-slate-400 font-mono text-[11px]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-4 sm:p-5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        FREE
                      </span>
                    </td>

                    <td className="p-4 sm:p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`open-my-content-${item.id}`}
                          onClick={() => onNavigate('content_details', { contentId: item.id })}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                          title="Open Resource"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          id={`edit-my-content-${item.id}`}
                          onClick={() => handleStartEdit(item)}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                          title="Edit Resource"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          id={`delete-my-content-${item.id}`}
                          onClick={() => setDeletingId(item.id)}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 hover:border-rose-800 transition-colors"
                          title="Delete Resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#0c1020] border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Resource</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#0c1020] border border-rose-800/60 p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Delete this resource?</h3>
              <p className="text-xs text-slate-400">
                This action cannot be undone. This resource will be permanently removed from Explore and search.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Yes, Delete Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
