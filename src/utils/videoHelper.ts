/**
 * YuvaSetu Educational Video Helpers
 * Handles YouTube video ID parsing, canonical embed generation,
 * secure video file validation, and metadata formatting.
 */

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Extracts and strictly validates a canonical 11-character YouTube video ID
 * from all standard YouTube URL variations:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - https://m.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://youtube.com/live/dQw4w9WgXcQ
 * - Raw 11-char ID
 */
export function extractYouTubeVideoId(input: string | undefined | null): string | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Direct 11-char ID check
  if (YOUTUBE_ID_REGEX.test(trimmed)) {
    return trimmed;
  }

  try {
    // If input doesn't start with protocol, prepend https://
    const urlString = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();

    // 1. youtu.be/VIDEO_ID
    if (hostname === 'youtu.be' || hostname.endsWith('.youtu.be')) {
      const pathname = url.pathname.replace(/^\/+/, '');
      const candidate = pathname.split('/')[0]?.split('?')[0];
      if (candidate && YOUTUBE_ID_REGEX.test(candidate)) {
        return candidate;
      }
    }

    // 2. youtube.com variants
    if (hostname === 'youtube.com' || hostname.endsWith('.youtube.com') || hostname === 'youtube-nocookie.com' || hostname.endsWith('.youtube-nocookie.com')) {
      // /watch?v=VIDEO_ID
      const vParam = url.searchParams.get('v');
      if (vParam && YOUTUBE_ID_REGEX.test(vParam)) {
        return vParam;
      }

      // /shorts/VIDEO_ID, /embed/VIDEO_ID, /v/VIDEO_ID, /live/VIDEO_ID
      const pathParts = url.pathname.split('/').filter(Boolean);
      const prefix = pathParts[0]?.toLowerCase();
      if (prefix === 'shorts' || prefix === 'embed' || prefix === 'v' || prefix === 'live') {
        const candidate = pathParts[1]?.split('?')[0];
        if (candidate && YOUTUBE_ID_REGEX.test(candidate)) {
          return candidate;
        }
      }
    }
  } catch {
    // Fallback regex scan across the string
    const match = trimmed.match(
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts|live)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (match && match[1] && YOUTUBE_ID_REGEX.test(match[1])) {
      return match[1];
    }
  }

  return null;
}

/**
 * Builds standard privacy-enhanced YouTube embed URL (youtube-nocookie.com)
 */
export function buildYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;
}

/**
 * Builds canonical YouTube watch URL for external fallback
 */
export function buildYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Returns official YouTube video thumbnail URL
 */
export function getYouTubeThumbnail(videoId: string, quality: 'hq' | 'maxres' | 'default' = 'hq'): string {
  if (quality === 'maxres') {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Supported educational video upload MIME types & extensions
 */
export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];
export const ALLOWED_VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const MAX_VIDEO_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB limit

/**
 * Validates educational video file before upload
 */
export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'Please choose a video file to upload.' };
  }

  const nameLower = file.name.toLowerCase();
  const hasValidExt = ALLOWED_VIDEO_EXTENSIONS.some((ext) => nameLower.endsWith(ext));
  if (!hasValidExt) {
    return {
      valid: false,
      error: `Invalid file format (${file.name}). YuvaSetu supports MP4 (.mp4), WebM (.webm), and QuickTime (.mov) video formats.`,
    };
  }

  if (file.type && !ALLOWED_VIDEO_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid MIME type (${file.type}). Allowed formats: MP4, WebM, and MOV.`,
    };
  }

  if (file.size > MAX_VIDEO_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Video file is too large (${sizeMb} MB). Maximum supported file size is 100 MB. Please compress or provide a YouTube link.`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The selected video file is empty.' };
  }

  return { valid: true };
}

/**
 * Converts seconds into clean MM:SS or HH:MM:SS format
 */
export function formatSecondsToTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Normalizes duration string to human-readable format e.g. "18:45" or "25 mins"
 */
export function normalizeDurationLabel(duration: string | undefined): string {
  if (!duration || !duration.trim()) return '20 mins';
  const d = duration.trim();
  if (/^\d+$/.test(d)) {
    return `${d} mins`;
  }
  return d;
}
