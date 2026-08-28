import fs from 'fs';
import path from 'path';
import { CONFIG } from '../config';

const DATA_DIR = CONFIG.DATA_DIR;

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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
 * Generic Storage Repository for JSON persistent storage
 */
export class JsonStorage<T extends { id: string }> {
  private filePath: string;

  constructor(private entity: EntityName) {
    this.filePath = path.join(DATA_DIR, `${this.entity}.json`);
    this.ensureFileExists();
  }

  private ensureFileExists(): void {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  /**
   * Reads all items from the JSON file
   */
  public getAll(): T[] {
    try {
      this.ensureFileExists();
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content || '[]') as T[];
    } catch (error) {
      console.error(`Error reading ${this.entity}.json:`, error);
      return [];
    }
  }

  /**
   * Safe atomic write operation
   */
  public saveAll(items: T[]): void {
    try {
      const tempPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(items, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (error) {
      console.error(`Error saving to ${this.entity}.json:`, error);
      // Fallback direct write
      fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2), 'utf-8');
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
