import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StoredFileMetadata {
  filename: string;
  originalName: string;
  sizeBytes: number;
  mimeType: string;
  url: string;
  storageProvider: 'local_disk' | 'durable_object_storage';
  sha256Hash: string;
  storedAt: string;
}

export interface IStorageProvider {
  save(buffer: Buffer, originalName: string, mimeType: string): Promise<StoredFileMetadata>;
  getStream(filename: string): fs.ReadStream | null;
  exists(filename: string): boolean;
  delete(filename: string): Promise<boolean>;
  computeHash(buffer: Buffer): string;
}

class LocalDiskStorageProvider implements IStorageProvider {
  private baseDir: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), 'data', 'uploads', 'notes');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  public computeHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  public async save(buffer: Buffer, originalName: string, mimeType: string): Promise<StoredFileMetadata> {
    const ext = path.extname(originalName).toLowerCase() || '.pdf';
    const safeBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const unique = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const filename = `${safeBase}_${unique}${ext}`;
    const targetPath = path.join(this.baseDir, filename);

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

  public getStream(filename: string): fs.ReadStream | null {
    const safeName = path.basename(filename);
    const targetPath = path.join(this.baseDir, safeName);
    if (!fs.existsSync(targetPath)) return null;
    return fs.createReadStream(targetPath);
  }

  public exists(filename: string): boolean {
    const safeName = path.basename(filename);
    const targetPath = path.join(this.baseDir, safeName);
    return fs.existsSync(targetPath);
  }

  public async delete(filename: string): Promise<boolean> {
    const safeName = path.basename(filename);
    const targetPath = path.join(this.baseDir, safeName);
    if (fs.existsSync(targetPath)) {
      await fs.promises.unlink(targetPath);
      return true;
    }
    return false;
  }
}

// Storage service abstraction singleton
export const storageService: IStorageProvider = new LocalDiskStorageProvider();
