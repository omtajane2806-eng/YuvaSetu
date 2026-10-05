import {
  ContentItem,
  CreateContentDTO,
  ContentFilterOptions,
  ContentType,
  AccessType,
  ContentCreator,
} from '../types/content';
import { SEEDED_DEMO_CONTENT } from '../data/demoContent';
import { getSubjectById } from '../data/subjectData';
import { notificationService } from './notificationService';
import { synthesizePagesForContent } from '../utils/downloadHelper';
import { apiGet, apiPost, apiPut, apiDelete } from './api';

const CONTENT_STORAGE_KEY = 'vidyasetu_learning_content_v3';
const SAVED_CONTENT_KEY = 'vidyasetu_saved_content_ids_v3';
const LIKED_CONTENT_KEY = 'vidyasetu_liked_content_ids_v3';
const VIEW_HISTORY_KEY = 'vidyasetu_viewed_content_history_v3';

class ContentService {
  // 1. Storage helpers
  private getStoredContent(): ContentItem[] {
    try {
      const data = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(SEEDED_DEMO_CONTENT));
        return SEEDED_DEMO_CONTENT;
      }
      const parsed: ContentItem[] = JSON.parse(data);
      // If empty for any reason, re-seed
      if (!parsed || parsed.length === 0) {
        localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(SEEDED_DEMO_CONTENT));
        return SEEDED_DEMO_CONTENT;
      }

      // Ensure all items have a status, topic, and PDF pages if missing
      const sanitized = parsed.map((item) => {
        const enrichedPdfData =
          item.content_type === 'pdf' && item.pdf_data
            ? {
                ...item.pdf_data,
                pages:
                  item.pdf_data.pages && item.pdf_data.pages.length > 0
                    ? item.pdf_data.pages
                    : synthesizePagesForContent(item),
              }
            : item.pdf_data;

        return {
          ...item,
          status: item.status || 'published',
          topic: item.topic || (item.tags && item.tags[0]) || 'General',
          access_type: item.access_type || (item.token_price && item.token_price > 0 ? 'TOKEN' : 'FREE'),
          token_price: item.token_price || 0,
          pdf_data: enrichedPdfData,
        };
      });

      return sanitized;
    } catch {
      return SEEDED_DEMO_CONTENT;
    }
  }

  private saveStoredContent(items: ContentItem[]): void {
    try {
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save learning content to localStorage', e);
    }
  }

  // 2. Fetch all content (Optionally including drafts)
  public getAllContent(includeDrafts: boolean = true): ContentItem[] {
    const all = this.getStoredContent();
    if (includeDrafts) return all;
    return all.filter((item) => item.status === 'published');
  }

  // 3. Fetch single item by ID
  public getContentById(id: string, allowDraft: boolean = true): ContentItem | undefined {
    const items = this.getStoredContent();
    const item = items.find((i) => i.id === id);
    if (!item) return undefined;
    if (!allowDraft && item.status !== 'published') {
      return undefined;
    }
    return item;
  }

  // 4. Search & Filter (Students only see published materials; Admin can see all)
  public searchAndFilter(options: ContentFilterOptions = {}): ContentItem[] {
    let items = this.getStoredContent();

    // Draft / Published filtering
    if (!options.includeDrafts && (!options.status || options.status === 'published')) {
      items = items.filter((item) => item.status === 'published');
    } else if (options.status === 'draft') {
      items = items.filter((item) => item.status === 'draft');
    } else if (options.status === 'published') {
      items = items.filter((item) => item.status === 'published');
    }

    const query = options.searchQuery?.trim().toLowerCase();
    if (query) {
      items = items.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        const subjectMatch =
          item.subject_name.toLowerCase().includes(query) ||
          item.subject_id.toLowerCase().includes(query);
        const topicMatch = item.topic ? item.topic.toLowerCase().includes(query) : false;
        const creatorMatch = item.creator.name.toLowerCase().includes(query);
        const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(query));
        const bodyMatch = item.content_body
          ? item.content_body.toLowerCase().includes(query)
          : false;

        return (
          titleMatch ||
          descMatch ||
          subjectMatch ||
          topicMatch ||
          creatorMatch ||
          tagMatch ||
          bodyMatch
        );
      });
    }

    // Subject Filter
    if (options.subjectId && options.subjectId !== 'all') {
      items = items.filter(
        (item) =>
          item.subject_id.toLowerCase() === options.subjectId!.toLowerCase() ||
          item.subject_name.toLowerCase() === options.subjectId!.toLowerCase()
      );
    }

    // Topic Filter
    if (options.topic && options.topic !== 'all') {
      items = items.filter((item) =>
        item.topic?.toLowerCase().includes(options.topic!.toLowerCase())
      );
    }

    // Content Type Filter
    if (options.contentType && options.contentType !== 'all') {
      items = items.filter((item) => item.content_type === options.contentType);
    }

    // Access Type Filter (Free vs Premium)
    if (options.accessType && options.accessType !== 'all') {
      items = items.filter((item) => item.access_type === options.accessType);
    }

    // Sort By
    if (options.sortBy === 'views') {
      items.sort((a, b) => b.views - a.views);
    } else if (options.sortBy === 'likes') {
      items.sort((a, b) => b.likes - a.likes);
    } else {
      // Default: 'recent'
      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return items;
  }

  // 5. Bookmark / Save System
  private getSavedMap(): Record<string, string[]> {
    try {
      const raw = localStorage.getItem(SAVED_CONTENT_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private setSavedMap(map: Record<string, string[]>): void {
    try {
      localStorage.setItem(SAVED_CONTENT_KEY, JSON.stringify(map));
    } catch (e) {
      console.error('Failed to save bookmark map', e);
    }
  }

  public isContentSaved(userId: string, contentId: string): boolean {
    if (!userId) return false;
    const map = this.getSavedMap();
    const userSaved = map[userId] || [];
    return userSaved.includes(contentId);
  }

  public toggleSave(userId: string, contentId: string): boolean {
    if (!userId) throw new Error('You must be logged in to save content');
    const map = this.getSavedMap();
    const userSaved = map[userId] || [];
    const exists = userSaved.includes(contentId);

    if (exists) {
      map[userId] = userSaved.filter((id) => id !== contentId);
      this.setSavedMap(map);
      return false; // Now unsaved
    } else {
      map[userId] = [contentId, ...userSaved];
      this.setSavedMap(map);
      return true; // Now saved
    }
  }

  public getSavedContent(userId: string): ContentItem[] {
    if (!userId) return [];
    const map = this.getSavedMap();
    const savedIds = map[userId] || [];
    const all = this.getStoredContent();
    return all.filter((item) => savedIds.includes(item.id) && item.status === 'published');
  }

  // 6. Like System (Guaranteed single like per user)
  private getLikedMap(): Record<string, string[]> {
    try {
      const raw = localStorage.getItem(LIKED_CONTENT_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private setLikedMap(map: Record<string, string[]>): void {
    try {
      localStorage.setItem(LIKED_CONTENT_KEY, JSON.stringify(map));
    } catch (e) {
      console.error('Failed to save liked map', e);
    }
  }

  public isContentLiked(userId: string, contentId: string): boolean {
    if (!userId) return false;
    const map = this.getLikedMap();
    const userLiked = map[userId] || [];
    return userLiked.includes(contentId);
  }

  public toggleLike(userId: string, contentId: string): { isLiked: boolean; likesCount: number } {
    if (!userId) throw new Error('You must be logged in to like content');
    const map = this.getLikedMap();
    const userLiked = map[userId] || [];
    const alreadyLiked = userLiked.includes(contentId);

    const items = this.getStoredContent();
    const index = items.findIndex((i) => i.id === contentId);
    if (index === -1) throw new Error('Content not found');

    let newCount = items[index].likes;

    if (alreadyLiked) {
      map[userId] = userLiked.filter((id) => id !== contentId);
      newCount = Math.max(0, newCount - 1);
      items[index].likes = newCount;
      this.setLikedMap(map);
      this.saveStoredContent(items);

      apiPost(`/api/materials/${contentId}/like`, { userId }).catch(() => {});
      return { isLiked: false, likesCount: newCount };
    } else {
      map[userId] = [contentId, ...userLiked];
      newCount = newCount + 1;
      items[index].likes = newCount;
      this.setLikedMap(map);
      this.saveStoredContent(items);

      apiPost(`/api/materials/${contentId}/like`, { userId }).catch(() => {});
      return { isLiked: true, likesCount: newCount };
    }
  }

  // 7. View Count Tracker
  public recordView(contentId: string, userId?: string): number {
    const items = this.getStoredContent();
    const index = items.findIndex((i) => i.id === contentId);
    if (index === -1) return 0;

    items[index].views = items[index].views + 1;
    this.saveStoredContent(items);

    apiGet(`/api/materials/${contentId}`).catch(() => {});

    // Save to user history if logged in
    if (userId) {
      try {
        const raw = localStorage.getItem(VIEW_HISTORY_KEY);
        const map: Record<string, { contentId: string; viewedAt: string }[]> = raw
          ? JSON.parse(raw)
          : {};
        const history = map[userId] || [];
        const filtered = history.filter((h) => h.contentId !== contentId);
        map[userId] = [{ contentId, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 15);
        localStorage.setItem(VIEW_HISTORY_KEY, JSON.stringify(map));
      } catch (e) {
        console.error('Failed to log view history', e);
      }
    }

    return items[index].views;
  }

  // 8. Get Recently Viewed items for a user
  public getRecentlyViewed(userId: string): ContentItem[] {
    if (!userId) return [];
    try {
      const raw = localStorage.getItem(VIEW_HISTORY_KEY);
      const map: Record<string, { contentId: string; viewedAt: string }[]> = raw
        ? JSON.parse(raw)
        : {};
      const history = map[userId] || [];
      const all = this.getStoredContent();
      const result: ContentItem[] = [];

      for (const h of history) {
        const item = all.find((i) => i.id === h.contentId);
        if (item && item.status === 'published') {
          result.push(item);
        }
      }
      return result;
    } catch {
      return [];
    }
  }

  // 9. ADMIN: Add Study Material
  public adminAddMaterial(
    adminUser: { id: string; name: string; avatar?: string },
    data: CreateContentDTO
  ): ContentItem {
    // Validation
    if (!data.title || data.title.trim().length < 3) {
      throw new Error('Please enter a descriptive material title (at least 3 characters).');
    }
    if (!data.description || data.description.trim().length < 8) {
      throw new Error('Please provide a helpful description (at least 8 characters).');
    }
    if (!data.subject_id) {
      throw new Error('Please select a subject category.');
    }
    if (!data.content_type) {
      throw new Error('Please select a content type.');
    }

    const subjectObj = getSubjectById(data.subject_id);
    const subjectName = subjectObj ? subjectObj.name : data.subject_id;
    const topic = data.topic?.trim() || data.title.trim();

    const defaultThumbnails = {
      note: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
      pdf: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      video: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    };

    const newId = `material-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const generatedPages =
      data.pages ||
      synthesizePagesForContent({
        id: newId,
        creator_id: adminUser.id,
        creator: {
          id: adminUser.id,
          name: adminUser.name,
          avatar: adminUser.avatar || '',
          role: 'Admin',
        },
        title: data.title.trim(),
        description: data.description.trim(),
        subject_id: data.subject_id,
        subject_name: subjectName,
        topic: topic,
        content_type: 'pdf',
        thumbnail: '',
        tags: [],
        access_type: 'FREE',
        price: 0,
        token_price: 0,
        views: 0,
        likes: 0,
        created_at: '',
        updated_at: '',
        status: 'published',
        content_body: data.content_body,
      });

    const newItem: ContentItem = {
      id: newId,
      creator_id: adminUser.id,
      created_by: `${adminUser.name} (Admin)`,
      creator: {
        id: adminUser.id,
        name: adminUser.name,
        avatar:
          adminUser.avatar ||
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=240',
        role: 'YuvaSetu Admin',
        college: 'YuvaSetu Academic Lead',
        reputation: 5000,
        followersCount: 3200,
      },
      title: data.title.trim(),
      description: data.description.trim(),
      subject_id: data.subject_id,
      subject_name: subjectName,
      topic: topic,
      content_type: data.content_type,
      thumbnail: data.thumbnail_url || defaultThumbnails[data.content_type],
      content_body: data.content_body,
      pdf_data:
        data.content_type === 'pdf'
          ? {
              fileName:
                data.file?.name ||
                data.file_name ||
                `${data.title.replace(/\s+/g, '_')}_Complete_Notes.pdf`,
              fileSize:
                data.file_size ||
                (data.file ? `${(data.file.size / (1024 * 1024)).toFixed(1)} MB` : '10.5 MB'),
              pageCount: data.page_count || generatedPages.length,
              downloadUrl: '#',
              fileDataUrl: data.file_data_url,
              fileType:
                data.file_type ||
                (data.file_name?.toLowerCase().endsWith('.docx') ? 'docx' : 'pdf'),
              pages: generatedPages,
              previewPages: generatedPages.map((p, idx) => `Page ${idx + 1}: ${p.heading || p.title}`),
            }
          : undefined,
      video_data:
        data.content_type === 'video'
          ? {
              duration: data.video_duration || '25 mins',
              videoUrl: data.video_url || '',
              isEmbed: true,
              resolution: '1080p',
              chapters: [
                { title: '00:00 - Introduction & Motivation', time: '00:00', seconds: 0 },
                { title: '08:00 - Step-by-Step Derivation', time: '08:00', seconds: 480 },
                { title: '18:30 - Real-World Applications & Exam Tips', time: '18:30', seconds: 1110 },
              ],
            }
          : undefined,
      tags:
        data.tags && data.tags.length > 0
          ? [...new Set([...data.tags, topic, 'Admin Published', 'Exam Notes'])]
          : [subjectName, topic, 'Admin Published'],
      access_type: data.access_type || (data.token_price && data.token_price > 0 ? 'TOKEN' : 'FREE'),
      price: 0,
      token_price: data.token_price || 0,
      views: 0,
      likes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isDemo: false,
      status: data.status || 'draft',
      is_admin_published: true,
    };

    const items = this.getStoredContent();
    items.unshift(newItem);
    this.saveStoredContent(items);

    if (newItem.status === 'published') {
      notificationService.notifyNewStudyMaterial(newItem.id, newItem.title, newItem.subject_name);
    }

    // SQLite Backend Sync
    apiPost('/api/materials', {
      title: newItem.title,
      description: newItem.description,
      subject: newItem.subject_name,
      type: newItem.content_type,
      thumbnail: newItem.thumbnail,
      fileUrl: newItem.pdf_data?.fileDataUrl || newItem.video_data?.videoUrl || '#',
      uploadedBy: adminUser.id,
      authorName: adminUser.name,
      pageCount: newItem.pdf_data?.pageCount,
      duration: newItem.video_data?.duration,
      tags: newItem.tags,
      published: newItem.status === 'published',
    }).catch((err) => console.warn('SQLite add material sync:', err?.message));

    return newItem;
  }

  // 10. ADMIN: Update Study Material
  public adminUpdateMaterial(id: string, updates: Partial<ContentItem>): ContentItem {
    const items = this.getStoredContent();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Study material not found.');

    const current = items[index];
    const subjectName = updates.subject_id
      ? getSubjectById(updates.subject_id)?.name || current.subject_name
      : current.subject_name;

    const updated: ContentItem = {
      ...current,
      ...updates,
      subject_name: subjectName,
      updated_at: new Date().toISOString(),
    };

    items[index] = updated;
    this.saveStoredContent(items);

    // SQLite Backend Sync
    apiPut(`/api/materials/${id}`, {
      title: updated.title,
      description: updated.description,
      subject: updated.subject_name,
      type: updated.content_type,
      thumbnail: updated.thumbnail,
      published: updated.status === 'published',
      tags: updated.tags,
    }).catch((err) => console.warn('SQLite update material sync:', err?.message));

    return updated;
  }

  // 11. ADMIN: Toggle Publish/Unpublish Status
  public adminTogglePublish(id: string): { status: 'published' | 'draft'; item: ContentItem } {
    const items = this.getStoredContent();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Study material not found.');

    const newStatus = items[index].status === 'published' ? 'draft' : 'published';
    items[index].status = newStatus;
    items[index].updated_at = new Date().toISOString();

    this.saveStoredContent(items);

    if (newStatus === 'published') {
      notificationService.notifyNewStudyMaterial(
        items[index].id,
        items[index].title,
        items[index].subject_name
      );
    }

    // SQLite Backend Sync
    apiPut(`/api/materials/${id}`, {
      published: newStatus === 'published',
    }).catch((err) => console.warn('SQLite toggle material publish sync:', err?.message));

    return { status: newStatus, item: items[index] };
  }

  // 12. ADMIN: Delete Study Material
  public adminDeleteMaterial(id: string): boolean {
    const items = this.getStoredContent();
    const exists = items.some((i) => i.id === id);
    if (!exists) throw new Error('Study material not found.');

    const filtered = items.filter((i) => i.id !== id);
    this.saveStoredContent(filtered);

    // SQLite Backend Sync
    apiDelete(`/api/materials/${id}`).catch((err) => console.warn('SQLite delete material sync:', err?.message));

    return true;
  }

  // Synchronize materials from SQLite backend into local storage
  public async syncMaterialsFromBackend(): Promise<ContentItem[]> {
    try {
      const resp = await apiGet<{ materials: any[] }>('/api/materials?includeUnpublished=true');
      if (resp && Array.isArray(resp.materials) && resp.materials.length > 0) {
        const stored = this.getStoredContent();
        const updated = [...stored];

        for (const m of resp.materials) {
          const existingIdx = updated.findIndex((x) => x.id === m.id || x.title.toLowerCase() === m.title.toLowerCase());
          const mapped: ContentItem = {
            id: m.id,
            creator_id: m.uploadedBy || 'admin-1',
            created_by: m.authorName || 'Platform Administrator',
            creator: {
              id: m.uploadedBy || 'admin-1',
              name: m.authorName || 'Platform Administrator',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=240',
              role: 'YuvaSetu Admin',
              college: m.authorCollege || 'YuvaSetu Academic Lead',
              reputation: 5000,
              followersCount: 3200,
            },
            title: m.title,
            description: m.description || '',
            subject_id: m.subject?.toLowerCase().replace(/\s+/g, '-') || 'general',
            subject_name: m.subject || 'Engineering',
            topic: m.subject || 'General',
            content_type: (m.type as ContentType) || 'pdf',
            thumbnail: m.thumbnail || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
            tags: m.tags || [],
            access_type: 'FREE',
            price: 0,
            token_price: 0,
            views: m.views || 0,
            likes: m.likes || 0,
            created_at: m.createdAt || new Date().toISOString(),
            updated_at: m.updatedAt || new Date().toISOString(),
            isDemo: false,
            status: m.published ? 'published' : 'draft',
            is_admin_published: true,
          };

          if (existingIdx !== -1) {
            updated[existingIdx] = { ...updated[existingIdx], ...mapped, pdf_data: updated[existingIdx].pdf_data || mapped.pdf_data };
          } else {
            updated.push(mapped);
          }
        }

        this.saveStoredContent(updated);
        return updated;
      }
    } catch {
      // Return local cache on network error
    }
    return this.getStoredContent();
  }

  // 13. ADMIN: Get Platform Content & Study Material Stats
  public adminGetStats(): {
    totalMaterials: number;
    notesCount: number;
    pdfsCount: number;
    videosCount: number;
    publishedCount: number;
    unpublishedCount: number;
    totalViews: number;
    totalLikes: number;
  } {
    const items = this.getStoredContent();
    const totalMaterials = items.length;
    const notesCount = items.filter((i) => i.content_type === 'note').length;
    const pdfsCount = items.filter((i) => i.content_type === 'pdf').length;
    const videosCount = items.filter((i) => i.content_type === 'video').length;
    const publishedCount = items.filter((i) => i.status === 'published').length;
    const unpublishedCount = items.filter((i) => i.status === 'draft').length;
    const totalViews = items.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalLikes = items.reduce((acc, curr) => acc + (curr.likes || 0), 0);

    return {
      totalMaterials,
      notesCount,
      pdfsCount,
      videosCount,
      publishedCount,
      unpublishedCount,
      totalViews,
      totalLikes,
    };
  }

  // 14. Deprecated Student Upload (Architecture preserved for future creator enablement)
  public uploadContent(
    userId: string,
    creator: ContentCreator,
    data: CreateContentDTO
  ): ContentItem {
    // When called, routes into standard content creator model
    return this.adminAddMaterial(
      { id: userId, name: creator.name, avatar: creator.avatar },
      data
    );
  }

  // 15. User uploaded content
  public getUserUploadedContent(userId: string): ContentItem[] {
    if (!userId) return [];
    const items = this.getStoredContent();
    return items.filter((item) => item.creator_id === userId);
  }

  // 16. Edit Content
  public editContent(
    userId: string,
    contentId: string,
    updates: Partial<ContentItem>
  ): ContentItem {
    return this.adminUpdateMaterial(contentId, updates);
  }

  // 17. Delete Content
  public deleteContent(userId: string, contentId: string): boolean {
    return this.adminDeleteMaterial(contentId);
  }

  // 18. Recommended Content
  public getRecommendedContent(userSubjects: string[], limit: number = 4): ContentItem[] {
    const all = this.getStoredContent().filter((i) => i.status === 'published');
    if (!userSubjects || userSubjects.length === 0) {
      return all.slice(0, limit);
    }

    const lowerSubjects = userSubjects.map((s) => s.toLowerCase());
    const matched = all.filter((item) => {
      const sId = item.subject_id.toLowerCase();
      const sName = item.subject_name.toLowerCase();
      return lowerSubjects.some(
        (target) => target.includes(sId) || target.includes(sName) || sName.includes(target)
      );
    });

    const others = all.filter((item) => !matched.includes(item));
    return [...matched, ...others].slice(0, limit);
  }

  // 19. Recent Content
  public getRecentContent(limit: number = 6): ContentItem[] {
    const all = this.getStoredContent().filter((i) => i.status === 'published');
    return [...all]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  // 20. Continue Learning
  public getContinueLearning(userId: string): ContentItem[] {
    const all = this.getStoredContent().filter((i) => i.status === 'published');
    if (!userId) return all.slice(0, 2);

    const recent = this.getRecentlyViewed(userId);
    if (recent.length > 0) return recent.slice(0, 3);

    const saved = this.getSavedContent(userId);
    if (saved.length > 0) return saved.slice(0, 3);

    return all.slice(0, 3);
  }
}

export const contentService = new ContentService();
