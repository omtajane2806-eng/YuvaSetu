import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Move,
  X,
  Check,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  ShieldCheck,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { UserInitialsBadge } from '../UserInitialsBadge';

export interface AdminProfilePhotoCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminName: string;
  adminEmail: string;
  currentProfileImage?: string;
  onSavePhoto: (fileOrBase64: File | Blob | string) => Promise<void>;
}

export const AdminProfilePhotoCropModal: React.FC<AdminProfilePhotoCropModalProps> = ({
  isOpen,
  onClose,
  adminName,
  adminEmail,
  currentProfileImage,
  onSavePhoto,
}) => {
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [selectedFileSize, setSelectedFileSize] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedImageSrc(null);
      setSelectedFileName('');
      setSelectedFileSize(0);
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setErrorMessage(null);
      setPreviewDataUrl(null);
      setIsSaving(false);
    }
  }, [isOpen]);

  // Handle standard HTML file input across mobile & desktop browsers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5 MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setErrorMessage(`Selected image is ${sizeMb} MB. The maximum allowed file size is 5.0 MB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate extension & MIME type (JPEG, PNG, WebP)
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!validExtensions.includes(ext || '') && !validMimes.includes(file.type)) {
      setErrorMessage('Invalid file format. YuvaSetu accepts only JPEG (.jpg, .jpeg), PNG (.png), and WebP (.webp) images.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFileName(file.name);
    setSelectedFileSize(file.size);
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImageSrc(result);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image from device. Please try selecting the file again.');
    };
    reader.readAsDataURL(file);
  };

  // Drag / Repositioning Handlers (Pointer events for universal Touch & Mouse support)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!selectedImageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if already released
    }
  };

  // Generate crisp circular crop on HTML5 canvas
  const generateCroppedBlob = useCallback(async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!imageRef.current) {
        return reject(new Error('Image element not ready.'));
      }

      const img = imageRef.current;
      const canvas = document.createElement('canvas');
      const size = 512; // Export standard high-res square
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Could not initialize canvas graphics context.'));
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Clear
      ctx.clearRect(0, 0, size, size);

      // Save context for transform
      ctx.save();

      // Move origin to center of canvas
      ctx.translate(size / 2, size / 2);

      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Viewport size in preview UI is 256x256
      const previewScale = size / 256;

      // Apply scale
      ctx.scale(zoom * previewScale, zoom * previewScale);

      // Apply pan offsets
      ctx.translate(position.x / previewScale, position.y / previewScale);

      // Draw image centered
      const drawWidth = img.naturalWidth;
      const drawHeight = img.naturalHeight;

      // Scale to fit nicely initially
      const baseScale = Math.min(256 / drawWidth, 256 / drawHeight);
      const scaledW = drawWidth * baseScale;
      const scaledH = drawHeight * baseScale;

      ctx.drawImage(img, -scaledW / 2, -scaledH / 2, scaledW, scaledH);

      ctx.restore();

      // Export as high-quality JPEG blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate cropped image data.'));
          }
        },
        'image/jpeg',
        0.92
      );
    });
  }, [position, rotation, zoom]);

  // Update live circular preview whenever zoom, position, or rotation change
  useEffect(() => {
    if (!selectedImageSrc) {
      setPreviewDataUrl(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const blob = await generateCroppedBlob();
        const url = URL.createObjectURL(blob);
        setPreviewDataUrl(url);
      } catch {
        // Fallback
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedImageSrc, generateCroppedBlob]);

  // Save changes handler
  const handleSave = async () => {
    if (!selectedImageSrc) {
      setErrorMessage('Please select an image file first.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const blob = await generateCroppedBlob();
      await onSavePhoto(blob);
      onClose();
    } catch (err: any) {
      console.error('Failed to save admin profile picture:', err);
      setErrorMessage(err?.message || 'Failed to save profile picture. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-admin-profile-photo-upload"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl my-6 rounded-3xl bg-[#0c1228] border border-slate-700/80 shadow-2xl p-5 sm:p-7 space-y-5 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40">
              <Camera className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
              Admin Governance & Security
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
            Admin Profile Picture
          </h3>
          <p className="text-xs text-slate-400">
            Upload, crop, and set your verified administrator photo across YuvaSetu.
          </p>
        </div>

        {/* Security / Admin Only Callout */}
        <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-center gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-rose-200 block text-[11px]">
              Platform Administrator Authentication
            </span>
            <span className="text-slate-300 text-[11px] block leading-relaxed">
              Photo uploads are strictly restricted to authenticated administrators. Student profiles utilize deterministic privacy initials badges.
            </span>
          </div>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/70 text-rose-200 text-xs font-semibold flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-300 hover:text-white text-xs underline cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Standard Cross-Platform File Picker (Hidden input triggered by native buttons) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
          className="hidden"
          id="admin-native-photo-file-input"
        />

        {/* CROP & EDIT VIEWPORT */}
        {selectedImageSrc ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
              {/* Left: Interactive Circular Crop Viewport */}
              <div className="flex flex-col items-center space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Move className="w-3 h-3 text-cyan-400" /> Pan & Position Image
                </span>

                <div
                  ref={viewportRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-rose-500/80 shadow-2xl bg-slate-900 cursor-grab active:cursor-grabbing touch-none select-none ring-4 ring-rose-500/20"
                >
                  {/* Circular Grid Guidelines */}
                  <div className="absolute inset-0 pointer-events-none border border-dashed border-white/20 rounded-full z-10" />
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                    <div className="w-full h-[1px] bg-white/15" />
                    <div className="h-full w-[1px] bg-white/15 absolute" />
                  </div>

                  {/* Render Image with transforms */}
                  <img
                    ref={imageRef}
                    src={selectedImageSrc}
                    alt="Upload Preview"
                    draggable={false}
                    className="absolute max-w-none transition-transform pointer-events-none"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${zoom}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-500">Drag to reposition photo</span>
              </div>

              {/* Right: Live UI Avatar Previews */}
              <div className="flex flex-col items-center sm:items-start justify-center space-y-3 w-full sm:w-auto sm:border-l sm:border-slate-800 sm:pl-6">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Live UI Previews
                </span>

                <div className="flex items-center gap-4">
                  {/* Large Navbar/Profile Preview */}
                  <div className="text-center space-y-1">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-rose-400 shadow-md mx-auto bg-slate-900">
                      {previewDataUrl ? (
                        <img src={previewDataUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserInitialsBadge name={adminName} role="admin" size="lg" />
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 block">Profile View</span>
                  </div>

                  {/* Medium Navbar Pill Preview */}
                  <div className="text-center space-y-1">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-rose-400/80 shadow-md mx-auto bg-slate-900">
                      {previewDataUrl ? (
                        <img src={previewDataUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserInitialsBadge name={adminName} role="admin" size="md" />
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 block">Navbar</span>
                  </div>
                </div>

                {/* File Metadata Chip */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 w-full space-y-0.5">
                  <div className="font-bold text-white truncate max-w-[180px]">{selectedFileName}</div>
                  <div className="text-[10px] text-cyan-400">
                    {(selectedFileSize / (1024 * 1024)).toFixed(2)} MB • Verified
                  </div>
                </div>

                {/* Choose Different File Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer w-full justify-center"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Choose Another Image</span>
                </button>
              </div>
            </div>

            {/* CONTROLS: ZOOM & ROTATE */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              {/* Zoom Slider */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.1).toFixed(2)))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>Zoom Level</span>
                    <span className="text-cyan-400 font-mono">{zoom.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.1).toFixed(2)))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Rotation & Reset Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev - 90) % 360)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>-90°</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>+90°</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setRotation(0);
                    setPosition({ x: 0, y: 0 });
                  }}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Reset Positioning
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* INITIAL PHOTO SELECTION / DRAG DROP AREA */
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-8 sm:p-10 rounded-3xl bg-slate-950/80 border-2 border-dashed border-slate-700 hover:border-cyan-500/70 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-4 group hover:bg-slate-900/50"
            >
              <div className="relative">
                {currentProfileImage ? (
                  <img
                    src={currentProfileImage}
                    alt={adminName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-rose-400 shadow-xl mx-auto"
                  />
                ) : (
                  <UserInitialsBadge name={adminName} role="admin" size="xl" />
                )}
                <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-cyan-500 text-slate-950 shadow-lg group-hover:scale-110 transition-transform">
                  <Upload className="w-4 h-4 font-black" />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Select Admin Profile Photo
                </h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Click to choose from your gallery or files (Android, iPhone/iPad, Windows, Mac).
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-[10px] font-bold text-slate-300 border border-slate-800">
                  JPEG / JPG
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-[10px] font-bold text-slate-300 border border-slate-800">
                  PNG
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-[10px] font-bold text-slate-300 border border-slate-800">
                  WebP
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                  Up to 5 MB
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MODAL ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          {selectedImageSrc ? (
            <button
              type="button"
              id="admin-profile-crop-save-btn"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-rose-950/50 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Persistent Storage...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              id="admin-profile-choose-photo-btn"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Photo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
