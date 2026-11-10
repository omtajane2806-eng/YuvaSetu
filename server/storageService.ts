import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export interface StoredMediaMetadata {
  filename: string;
  originalName: string;
  sizeBytes: number;
  mimeType: string;
  url: string;
  storageProvider: 'cloudinary' | 's3' | 'local_disk';
  isPersistentCloud: boolean;
  sha256Hash: string;
  storedAt: string;
  warning?: string;
  duration?: string;
  width?: number;
  height?: number;
}

export interface StoredFileMetadata {
  filename: string;
  originalName: string;
  sizeBytes: number;
  mimeType: string;
  url: string;
  storageProvider: 'local_disk' | 'durable_object_storage' | 'cloudinary' | 's3';
  sha256Hash: string;
  storedAt: string;
}

export interface StorageStatusInfo {
  activeProvider: 'cloudinary' | 's3' | 'local_disk';
  isPersistentCloud: boolean;
  isProduction: boolean;
  configured: {
    cloudinary: boolean;
    s3: boolean;
    localDisk: boolean;
  };
  details: {
    cloudinaryCloudName?: string;
    s3Bucket?: string;
    s3Region?: string;
    localStoragePath: string;
  };
  notice: string;
}

// ----------------------------------------------------------------------------
// Unified Storage Service for YuvaSetu Academic Platform
// Supports Cloudinary, AWS S3 / S3-compatible, and local disk
// ----------------------------------------------------------------------------

export class StorageService {
  private baseDataDir: string;
  private notesDir: string;
  private videosDir: string;
  private avatarsDir: string;
  private s3Client: S3Client | null = null;
  private isProductionMode: boolean;

  constructor() {
    this.isProductionMode =
      process.env.NODE_ENV === 'production' ||
      process.env.RENDER === 'true' ||
      (typeof __filename !== 'undefined' && __filename.includes('dist'));

    this.baseDataDir = process.env.DATA_DIR
      ? path.resolve(process.env.DATA_DIR)
      : path.join(process.cwd(), 'data');

    this.notesDir = path.join(this.baseDataDir, 'uploads', 'notes');
    this.videosDir = path.join(this.baseDataDir, 'uploads', 'videos');
    this.avatarsDir = path.join(this.baseDataDir, 'uploads', 'avatars');

    if (!fs.existsSync(this.notesDir)) {
      fs.mkdirSync(this.notesDir, { recursive: true });
    }
    if (!fs.existsSync(this.videosDir)) {
      fs.mkdirSync(this.videosDir, { recursive: true });
    }
    if (!fs.existsSync(this.avatarsDir)) {
      fs.mkdirSync(this.avatarsDir, { recursive: true });
    }

    this.initCloudinary();
    this.initS3();
  }

  private initCloudinary(): void {
    if (process.env.CLOUDINARY_URL) {
      // Cloudinary SDK automatically parses CLOUDINARY_URL
      return;
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
    }
  }

  private initS3(): void {
    const accessKeyId =
      process.env.AWS_ACCESS_KEY_ID ||
      process.env.S3_ACCESS_KEY_ID ||
      process.env.STORAGE_ACCESS_KEY_ID;
    const secretAccessKey =
      process.env.AWS_SECRET_ACCESS_KEY ||
      process.env.S3_SECRET_ACCESS_KEY ||
      process.env.STORAGE_SECRET_ACCESS_KEY;
    const region =
      process.env.AWS_REGION ||
      process.env.S3_REGION ||
      process.env.STORAGE_REGION ||
      'us-east-1';
    const endpoint = process.env.AWS_ENDPOINT || process.env.S3_ENDPOINT;

    if (accessKeyId && secretAccessKey) {
      try {
        this.s3Client = new S3Client({
          region,
          endpoint: endpoint || undefined,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });
      } catch (err) {
        console.warn('Failed to initialize S3 Client:', err);
        this.s3Client = null;
      }
    }
  }

  public computeHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  public isPersistentCloud(): boolean {
    return this.getStatus().isPersistentCloud;
  }

  public getProviderName(): string {
    return this.getStatus().activeProvider;
  }

  public getStatus(): StorageStatusInfo {
    const hasCloudinary = Boolean(
      process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET)
    );

    const s3Bucket =
      process.env.AWS_BUCKET_NAME ||
      process.env.S3_BUCKET_NAME ||
      process.env.STORAGE_BUCKET_NAME;

    const hasS3 = Boolean(this.s3Client && s3Bucket);

    let activeProvider: 'cloudinary' | 's3' | 'local_disk' = 'local_disk';
    if (hasCloudinary) {
      activeProvider = 'cloudinary';
    } else if (hasS3) {
      activeProvider = 's3';
    }

    const isPersistentCloud = activeProvider !== 'local_disk';

    let notice = 'Storage operational.';
    if (isPersistentCloud) {
      notice = `Persistent cloud object storage is active via ${activeProvider.toUpperCase()}. Uploaded videos and study media are durable across redeployments.`;
    } else if (this.isProductionMode) {
      notice =
        'Notice: Persistent cloud storage (Cloudinary or AWS S3) is not configured in Render environment variables. Uploaded files will be stored on local disk, which is ephemeral across Render restarts and deploys. Set CLOUDINARY_URL or AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY/AWS_BUCKET_NAME in Render Environment Variables for permanent durability.';
    } else {
      notice = 'Development local disk storage active (/data/uploads).';
    }

    return {
      activeProvider,
      isPersistentCloud,
      isProduction: this.isProductionMode,
      configured: {
        cloudinary: hasCloudinary,
        s3: hasS3,
        localDisk: true,
      },
      details: {
        cloudinaryCloudName: (() => {
          if (process.env.CLOUDINARY_CLOUD_NAME) return process.env.CLOUDINARY_CLOUD_NAME;
          if (process.env.CLOUDINARY_URL) {
            try {
              const parsed = new URL(process.env.CLOUDINARY_URL);
              return parsed.hostname || 'Configured via CLOUDINARY_URL';
            } catch {
              return 'Configured via CLOUDINARY_URL';
            }
          }
          return undefined;
        })(),
        s3Bucket: s3Bucket || undefined,
        s3Region: process.env.AWS_REGION || process.env.S3_REGION || undefined,
        localStoragePath: path.join(process.cwd(), 'data', 'uploads'),
      },
      notice,
    };
  }

  /**
   * Save educational video with automatic persistence hierarchy:
   * 1. Cloudinary (if configured)
   * 2. AWS S3 / S3-compatible (if configured)
   * 3. Local disk storage with production ephemeral warning
   */
  public async saveVideo(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<StoredMediaMetadata> {
    const ext = path.extname(originalName).toLowerCase() || '.mp4';
    const safeBase = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    const uniqueId = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const filename = `${safeBase}_${uniqueId}${ext}`;
    const sha256Hash = this.computeHash(buffer);

    // 1. Try Cloudinary
    const hasCloudinary = Boolean(
      process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET)
    );

    if (hasCloudinary) {
      try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'video',
              folder: 'yuvasetu/videos',
              public_id: `${safeBase}_${uniqueId}`,
              overwrite: true,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(buffer);
        });

        if (uploadResult && uploadResult.secure_url) {
          return {
            filename: `${uploadResult.public_id}.${uploadResult.format || 'mp4'}`,
            originalName,
            sizeBytes: uploadResult.bytes || buffer.length,
            mimeType: uploadResult.format ? `video/${uploadResult.format}` : mimeType,
            url: uploadResult.secure_url,
            storageProvider: 'cloudinary',
            isPersistentCloud: true,
            sha256Hash,
            storedAt: new Date().toISOString(),
            duration: uploadResult.duration ? `${Math.round(uploadResult.duration)}s` : undefined,
            width: uploadResult.width,
            height: uploadResult.height,
          };
        }
      } catch (err: any) {
        console.error('Cloudinary video upload failed, falling back:', err?.message || err);
      }
    }

    // 2. Try S3 / S3-compatible
    const s3Bucket =
      process.env.AWS_BUCKET_NAME ||
      process.env.S3_BUCKET_NAME ||
      process.env.STORAGE_BUCKET_NAME;

    if (this.s3Client && s3Bucket) {
      try {
        const key = `videos/${filename}`;
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: s3Bucket,
            Key: key,
            Body: buffer,
            ContentType: mimeType || 'video/mp4',
            CacheControl: 'public, max-age=31536000',
          })
        );

        const region =
          process.env.AWS_REGION ||
          process.env.S3_REGION ||
          process.env.STORAGE_REGION ||
          'us-east-1';
        const customEndpoint = process.env.AWS_ENDPOINT || process.env.S3_ENDPOINT;

        let s3Url = '';
        if (customEndpoint) {
          const endpointClean = customEndpoint.replace(/\/$/, '');
          s3Url = `${endpointClean}/${s3Bucket}/${key}`;
        } else {
          s3Url = `https://${s3Bucket}.s3.${region}.amazonaws.com/${key}`;
        }

        return {
          filename,
          originalName,
          sizeBytes: buffer.length,
          mimeType,
          url: s3Url,
          storageProvider: 's3',
          isPersistentCloud: true,
          sha256Hash,
          storedAt: new Date().toISOString(),
        };
      } catch (err: any) {
        console.error('S3 video upload failed, falling back:', err?.message || err);
      }
    }

    // 3. Fallback: Save to Local Disk (/data/uploads/videos)
    const targetPath = path.join(this.videosDir, filename);
    await fs.promises.writeFile(targetPath, buffer);

    let warning: string | undefined = undefined;
    if (this.isProductionMode) {
      warning =
        'Render Warning: Video stored on local container disk. Cloudinary or AWS S3 is not configured in Render environment variables; files will not persist across container redeploys.';
    }

    return {
      filename,
      originalName,
      sizeBytes: buffer.length,
      mimeType,
      url: `/api/media/videos/${filename}`,
      storageProvider: 'local_disk',
      isPersistentCloud: false,
      sha256Hash,
      storedAt: new Date().toISOString(),
      warning,
    };
  }

  /**
   * Save student PDF note / document
   */
  public async save(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<StoredFileMetadata> {
    const ext = path.extname(originalName).toLowerCase() || '.pdf';
    const safeBase = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 60);
    const unique = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const filename = `${safeBase}_${unique}${ext}`;
    const targetPath = path.join(this.notesDir, filename);

    await fs.promises.writeFile(targetPath, buffer);
    const sha256Hash = this.computeHash(buffer);

    return {
      filename,
      originalName,
      sizeBytes: buffer.length,
      mimeType,
      url: `/api/media/notes/${filename}`,
      storageProvider: 'local_disk',
      sha256Hash,
      storedAt: new Date().toISOString(),
    };
  }

  /**
   * Save Admin Profile Photo with automatic persistence hierarchy:
   * 1. Cloudinary (if configured)
   * 2. AWS S3 / S3-compatible (if configured)
   * 3. Local disk storage (/data/uploads/avatars)
   */
  public async saveAvatar(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    adminId: string
  ): Promise<StoredMediaMetadata> {
    const rawExt = path.extname(originalName).toLowerCase();
    const ext = ['.jpg', '.jpeg', '.png', '.webp'].includes(rawExt)
      ? rawExt
      : mimeType === 'image/png'
      ? '.png'
      : mimeType === 'image/webp'
      ? '.webp'
      : '.jpg';

    const safeAdminId = adminId.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 32);
    const uniqueId = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const filename = `admin_avatar_${safeAdminId}_${uniqueId}${ext}`;
    const sha256Hash = this.computeHash(buffer);

    // 1. Try Cloudinary
    const hasCloudinary = Boolean(
      process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET)
    );

    if (hasCloudinary) {
      try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'yuvasetu/avatars',
              public_id: `admin_avatar_${safeAdminId}_${uniqueId}`,
              overwrite: true,
              transformation: [
                { width: 512, height: 512, crop: 'fill', gravity: 'face' },
                { quality: 'auto:good' },
              ],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(buffer);
        });

        if (uploadResult && uploadResult.secure_url) {
          return {
            filename: `${uploadResult.public_id}.${uploadResult.format || 'jpg'}`,
            originalName,
            sizeBytes: uploadResult.bytes || buffer.length,
            mimeType: uploadResult.format ? `image/${uploadResult.format}` : mimeType,
            url: uploadResult.secure_url,
            storageProvider: 'cloudinary',
            isPersistentCloud: true,
            sha256Hash,
            storedAt: new Date().toISOString(),
            width: uploadResult.width,
            height: uploadResult.height,
          };
        }
      } catch (err: any) {
        console.error('Cloudinary avatar upload failed, falling back:', err?.message || err);
      }
    }

    // 2. Try AWS S3 / S3-compatible
    const s3Bucket =
      process.env.AWS_BUCKET_NAME ||
      process.env.S3_BUCKET_NAME ||
      process.env.STORAGE_BUCKET_NAME;

    if (this.s3Client && s3Bucket) {
      try {
        const key = `avatars/${filename}`;
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: s3Bucket,
            Key: key,
            Body: buffer,
            ContentType: mimeType || 'image/jpeg',
            CacheControl: 'public, max-age=31536000',
          })
        );

        const region =
          process.env.AWS_REGION ||
          process.env.S3_REGION ||
          process.env.STORAGE_REGION ||
          'us-east-1';
        const customEndpoint = process.env.AWS_ENDPOINT || process.env.S3_ENDPOINT;

        let s3Url = '';
        if (customEndpoint) {
          const endpointClean = customEndpoint.replace(/\/$/, '');
          s3Url = `${endpointClean}/${s3Bucket}/${key}`;
        } else {
          s3Url = `https://${s3Bucket}.s3.${region}.amazonaws.com/${key}`;
        }

        return {
          filename,
          originalName,
          sizeBytes: buffer.length,
          mimeType,
          url: s3Url,
          storageProvider: 's3',
          isPersistentCloud: true,
          sha256Hash,
          storedAt: new Date().toISOString(),
        };
      } catch (err: any) {
        console.error('S3 avatar upload failed, falling back:', err?.message || err);
      }
    }

    // 3. Fallback: Save to Local Disk (/data/uploads/avatars)
    const targetPath = path.join(this.avatarsDir, filename);
    await fs.promises.writeFile(targetPath, buffer);

    return {
      filename,
      originalName,
      sizeBytes: buffer.length,
      mimeType,
      url: `/api/media/avatars/${filename}`,
      storageProvider: 'local_disk',
      isPersistentCloud: false,
      sha256Hash,
      storedAt: new Date().toISOString(),
    };
  }

  /**
   * Safely delete replaced or removed avatar from cloud or local disk
   */
  public async deleteAvatar(avatarUrlOrFilename: string): Promise<boolean> {
    if (!avatarUrlOrFilename) return false;

    try {
      // Local media path
      if (avatarUrlOrFilename.includes('/api/media/avatars/')) {
        const parts = avatarUrlOrFilename.split('/api/media/avatars/');
        const filename = path.basename(parts[1]);
        const targetPath = path.join(this.avatarsDir, filename);
        if (fs.existsSync(targetPath)) {
          await fs.promises.unlink(targetPath);
          return true;
        }
      }

      // Cloudinary URL
      if (avatarUrlOrFilename.includes('res.cloudinary.com')) {
        try {
          const match = avatarUrlOrFilename.match(/yuvasetu\/avatars\/([^./?#]+)/);
          if (match && match[0]) {
            await cloudinary.uploader.destroy(match[0], { resource_type: 'image' });
            return true;
          }
        } catch (cErr) {
          console.warn('Failed to delete old avatar from Cloudinary:', cErr);
        }
      }

      // S3 URL
      const s3Bucket =
        process.env.AWS_BUCKET_NAME ||
        process.env.S3_BUCKET_NAME ||
        process.env.STORAGE_BUCKET_NAME;

      if (this.s3Client && s3Bucket && avatarUrlOrFilename.includes(s3Bucket)) {
        try {
          const match = avatarUrlOrFilename.match(/avatars\/([^?#]+)/);
          if (match && match[0]) {
            await this.s3Client.send(
              new DeleteObjectCommand({
                Bucket: s3Bucket,
                Key: match[0],
              })
            );
            return true;
          }
        } catch (s3Err) {
          console.warn('Failed to delete old avatar from S3:', s3Err);
        }
      }

      // Raw filename fallback
      const safeName = path.basename(avatarUrlOrFilename);
      const targetPath = path.join(this.avatarsDir, safeName);
      if (fs.existsSync(targetPath)) {
        await fs.promises.unlink(targetPath);
        return true;
      }
    } catch (err) {
      console.warn('Error during avatar deletion:', err);
    }

    return false;
  }

  public getStream(
    filename: string,
    subfolder: 'notes' | 'videos' | 'avatars' = 'notes'
  ): fs.ReadStream | null {
    const safeName = path.basename(filename);
    const dir =
      subfolder === 'videos'
        ? this.videosDir
        : subfolder === 'avatars'
        ? this.avatarsDir
        : this.notesDir;
    const targetPath = path.join(dir, safeName);
    if (!fs.existsSync(targetPath)) return null;
    return fs.createReadStream(targetPath);
  }

  public exists(
    filename: string,
    subfolder: 'notes' | 'videos' | 'avatars' = 'notes'
  ): boolean {
    const safeName = path.basename(filename);
    const dir =
      subfolder === 'videos'
        ? this.videosDir
        : subfolder === 'avatars'
        ? this.avatarsDir
        : this.notesDir;
    const targetPath = path.join(dir, safeName);
    return fs.existsSync(targetPath);
  }

  public async delete(
    filename: string,
    subfolder: 'notes' | 'videos' | 'avatars' = 'notes'
  ): Promise<boolean> {
    const safeName = path.basename(filename);
    const dir =
      subfolder === 'videos'
        ? this.videosDir
        : subfolder === 'avatars'
        ? this.avatarsDir
        : this.notesDir;
    const targetPath = path.join(dir, safeName);
    if (fs.existsSync(targetPath)) {
      await fs.promises.unlink(targetPath);
      return true;
    }
    return false;
  }
}

// Global Singleton Export
export const storageService = new StorageService();
