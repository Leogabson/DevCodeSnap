import Dexie, { type Table, type DexieOptions } from 'dexie';
import type { Snippet, Collection, Tag, SnippetTag } from './schema';
import { V1_STORES } from './migrations/v1';

export const DEFAULT_DB_NAME = 'DevCodeSnapDB';

/**
 * DevCodeSnap Dexie Database Class
 * Local-first client database managing snippets, collections, tags, and composite associations.
 */
export class DevCodeSnapDatabase extends Dexie {
  snippets!: Table<Snippet, string>;
  collections!: Table<Collection, string>;
  tags!: Table<Tag, string>;
  snippetTags!: Table<SnippetTag, [string, string]>;

  constructor(dbName: string = DEFAULT_DB_NAME, options?: DexieOptions) {
    super(dbName, options);

    // Version 1 Schema Migration
    this.version(1).stores(V1_STORES);
  }

  /**
   * Safe database initialization verifying schema opening.
   * Catches and reports opening failures without swallowing them.
   */
  async initialize(): Promise<this> {
    try {
      if (!this.isOpen()) {
        await this.open();
      }
      return this;
    } catch (error) {
      console.error(
        `[DevCodeSnapDatabase] Failed to initialize database "${this.name}":`,
        error
      );
      throw error;
    }
  }
}

/**
 * Singleton database instance for the application runtime.
 */
export const db = new DevCodeSnapDatabase();
