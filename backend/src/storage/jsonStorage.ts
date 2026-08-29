import fs from 'fs';
import path from 'path';
import { CONFIG } from '../config';

export type EntityName = 
  | 'users'
  | 'projects'
  | 'memberships'
  | 'progress'
  | 'messages'
  | 'meetings'
  | 'documents'
  | 'links'
  | 'notifications'
  | 'activity';

/**
 * Generic Storage Repository for JSON persistent storage with atomic writes & backup recovery
 */
export class JsonStorage<T extends { id: string }> {
  private filePath: string;
  private backupPath: string;

  constructor(private entity: EntityName) {
    this.ensureDirectoryExists();
    this.filePath = path.join(CONFIG.DATA_DIR, `${this.entity}.json`);
    this.backupPath = path.join(CONFIG.DATA_DIR, `${this.entity}.json.bak`);
    this.ensureFileExists();
  }

  private ensureDirectoryExists(): void {
    if (!fs.existsSync(CONFIG.DATA_DIR)) {
      fs.mkdirSync(CONFIG.DATA_DIR, { recursive: true });
    }
  }

  private ensureFileExists(): void {
    this.ensureDirectoryExists();

    if (!fs.existsSync(this.filePath)) {
      // Check if backup exists to restore from
      if (fs.existsSync(this.backupPath)) {
        try {
          fs.copyFileSync(this.backupPath, this.filePath);
          console.log(`[JsonStorage] Restored ${this.entity}.json from backup file.`);
          return;
        } catch (err) {
          console.error(`[JsonStorage] Failed to restore ${this.entity}.json from backup:`, err);
        }
      }
      // Initialize with empty array
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  /**
   * Reads all items from the JSON file with backup auto-recovery
   */
  public getAll(): T[] {
    this.ensureFileExists();
    try {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      if (!content || !content.trim()) {
        return [];
      }
      return JSON.parse(content) as T[];
    } catch (error) {
      console.error(`[JsonStorage] Error reading primary ${this.entity}.json:`, error);
      
      // Attempt recovery from backup
      if (fs.existsSync(this.backupPath)) {
        try {
          const backupContent = fs.readFileSync(this.backupPath, 'utf-8');
          if (backupContent && backupContent.trim()) {
            const parsed = JSON.parse(backupContent) as T[];
            // Auto-heal primary file using backup content
            fs.writeFileSync(this.filePath, backupContent, 'utf-8');
            console.log(`[JsonStorage] Successfully recovered ${this.entity}.json from backup!`);
            return parsed;
          }
        } catch (backupErr) {
          console.error(`[JsonStorage] Backup read error on ${this.entity}.json.bak:`, backupErr);
        }
      }

      return [];
    }
  }

  /**
   * Safe atomic write operation with automatic backup creation
   */
  public saveAll(items: T[]): void {
    this.ensureDirectoryExists();
    const dataString = JSON.stringify(items, null, 2);

    // 1. Create a backup of existing valid file before writing new state
    if (fs.existsSync(this.filePath)) {
      try {
        const currentContent = fs.readFileSync(this.filePath, 'utf-8');
        if (currentContent && currentContent.trim()) {
          fs.writeFileSync(this.backupPath, currentContent, 'utf-8');
        }
      } catch (err) {
        console.warn(`[JsonStorage] Could not update backup for ${this.entity}:`, err);
      }
    }

    // 2. Perform atomic write using temporary file
    const tempPath = path.join(
      CONFIG.DATA_DIR,
      `${this.entity}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.tmp`
    );

    try {
      fs.writeFileSync(tempPath, dataString, 'utf-8');
      try {
        fs.renameSync(tempPath, this.filePath);
      } catch (renameErr) {
        // Fallback for cross-device mounts / permission locks on cloud containers
        fs.copyFileSync(tempPath, this.filePath);
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    } catch (error) {
      console.error(`[JsonStorage] Error saving to ${this.entity}.json:`, error);
      // Emergency direct write fallback
      fs.writeFileSync(this.filePath, dataString, 'utf-8');
    }
  }

  /**
   * Find item by ID
   */
  public getById(id: string): T | undefined {
    const items = this.getAll();
    return items.find((item) => item.id === id);
  }

  /**
   * Filter items matching a predicate function
   */
  public filter(predicate: (item: T) => boolean): T[] {
    const items = this.getAll();
    return items.filter(predicate);
  }

  /**
   * Insert a new record
   */
  public insert(item: T): T {
    const items = this.getAll();
    items.push(item);
    this.saveAll(items);
    return item;
  }

  /**
   * Update an existing record by ID
   */
  public update(id: string, updates: Partial<T>): T | undefined {
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;

    items[index] = { ...items[index], ...updates };
    this.saveAll(items);
    return items[index];
  }

  /**
   * Delete record by ID
   */
  public delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    this.saveAll(filtered);
    return true;
  }

  /**
   * Delete records matching a predicate
   */
  public deleteMany(predicate: (item: T) => boolean): number {
    const items = this.getAll();
    const initialCount = items.length;
    const filtered = items.filter((item) => !predicate(item));
    this.saveAll(filtered);
    return initialCount - filtered.length;
  }
}
