import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  DevCodeSnapDatabase,
  normalizeName,
  validateAndFormatName,
  InvalidNameError,
  type Snippet,
  type Collection,
  type Tag,
  type SnippetTag,
} from '@/db';

describe('DevCodeSnap Database Foundation (Dexie / IndexedDB)', () => {
  let db: DevCodeSnapDatabase;
  const testDbName = 'TestDevCodeSnapDB';

  beforeEach(async () => {
    db = new DevCodeSnapDatabase(testDbName);
    await db.initialize();
  });

  afterEach(async () => {
    if (db && db.isOpen()) {
      await db.delete();
      db.close();
    }
  });

  describe('Database Initialization & Schema', () => {
    it('initializes the database with schema version 1 and all four tables', () => {
      expect(db.isOpen()).toBe(true);
      expect(db.verno).toBe(1);
      expect(db.snippets).toBeDefined();
      expect(db.collections).toBeDefined();
      expect(db.tags).toBeDefined();
      expect(db.snippetTags).toBeDefined();
    });

    it('reopens the database without losing existing records', async () => {
      const collection: Collection = {
        id: 'col-persist-1',
        name: 'Algorithms',
        normalizedName: normalizeName('Algorithms'),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await db.collections.add(collection);
      db.close();

      // Reopen database with same name
      const reopenedDb = new DevCodeSnapDatabase(testDbName);
      await reopenedDb.initialize();

      const retrieved = await reopenedDb.collections.get('col-persist-1');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Algorithms');
      expect(retrieved?.normalizedName).toBe('algorithms');

      await reopenedDb.delete();
      reopenedDb.close();
    });
  });

  describe('Record Creation and Retrieval Across All Tables', () => {
    it('creates and retrieves a snippet with all fields', async () => {
      const now = Date.now();
      const snippet: Snippet = {
        id: 'snip-1',
        title: 'Binary Search',
        code: 'function binarySearch() {}',
        language: 'typescript',
        description: 'Standard binary search implementation',
        sourceUrl: 'https://example.com/algo',
        collectionId: 'col-1',
        isFavorite: true,
        createdAt: now,
        updatedAt: now,
      };

      await db.snippets.add(snippet);
      const retrieved = await db.snippets.get('snip-1');

      expect(retrieved).toEqual(snippet);
      expect(retrieved?.title).toBe('Binary Search');
      expect(retrieved?.collectionId).toBe('col-1');
    });

    it('allows snippets with nullable collectionId', async () => {
      const now = Date.now();
      const uncategorizedSnippet: Snippet = {
        id: 'snip-uncategorized',
        title: 'Quick Scratch Note',
        code: 'console.log("scratch");',
        language: 'javascript',
        collectionId: null,
        createdAt: now,
        updatedAt: now,
      };

      await db.snippets.add(uncategorizedSnippet);
      const retrieved = await db.snippets.get('snip-uncategorized');

      expect(retrieved).toBeDefined();
      expect(retrieved?.collectionId).toBeNull();
    });

    it('creates and retrieves collections and tags', async () => {
      const now = Date.now();
      const collection: Collection = {
        id: 'col-react',
        name: 'React Helpers',
        normalizedName: normalizeName('React Helpers'),
        description: 'Custom hooks and utilities',
        color: '#8b5cf6',
        createdAt: now,
        updatedAt: now,
      };

      const tag: Tag = {
        id: 'tag-frontend',
        name: 'Frontend',
        normalizedName: normalizeName('Frontend'),
        color: '#3b82f6',
        createdAt: now,
      };

      await db.collections.add(collection);
      await db.tags.add(tag);

      const retrievedCol = await db.collections.get('col-react');
      const retrievedTag = await db.tags.get('tag-frontend');

      expect(retrievedCol?.name).toBe('React Helpers');
      expect(retrievedCol?.normalizedName).toBe('react helpers');
      expect(retrievedTag?.name).toBe('Frontend');
      expect(retrievedTag?.normalizedName).toBe('frontend');
    });

    it('creates and retrieves snippetTags using composite primary key [snippetId+tagId]', async () => {
      const snippetTag: SnippetTag = {
        snippetId: 'snip-100',
        tagId: 'tag-200',
      };

      await db.snippetTags.add(snippetTag);

      // Retrieve via composite primary key
      const retrieved = await db.snippetTags.get(['snip-100', 'tag-200']);
      expect(retrieved).toBeDefined();
      expect(retrieved?.snippetId).toBe('snip-100');
      expect(retrieved?.tagId).toBe('tag-200');

      // Re-adding the identical composite key must fail due to primary key conflict
      await expect(db.snippetTags.add(snippetTag)).rejects.toThrow();
    });
  });

  describe('Uniqueness and Name Normalization Behavior', () => {
    it('enforces case-insensitive uniqueness on collection normalizedName', async () => {
      const now = Date.now();
      const col1: Collection = {
        id: 'col-1',
        name: 'Web Dev',
        normalizedName: normalizeName('Web Dev'),
        createdAt: now,
        updatedAt: now,
      };

      await db.collections.add(col1);

      // Attempt adding a collection with different casing ('web dev')
      const col2: Collection = {
        id: 'col-2',
        name: 'web dev',
        normalizedName: normalizeName('web dev'),
        createdAt: now,
        updatedAt: now,
      };

      await expect(db.collections.add(col2)).rejects.toThrow();
    });

    it('enforces case-insensitive uniqueness on tag normalizedName', async () => {
      const now = Date.now();
      const tag1: Tag = {
        id: 'tag-1',
        name: 'TypeScript',
        normalizedName: normalizeName('TypeScript'),
        createdAt: now,
      };

      await db.tags.add(tag1);

      // Attempt adding a tag with different casing ('TYPESCRIPT')
      const tag2: Tag = {
        id: 'tag-2',
        name: 'TYPESCRIPT',
        normalizedName: normalizeName('TYPESCRIPT'),
        createdAt: now,
      };

      await expect(db.tags.add(tag2)).rejects.toThrow();
    });

    it('normalizes names by trimming whitespace and lowercasing', () => {
      expect(normalizeName('  React Native  ')).toBe('react native');
      expect(normalizeName('GRAPHQL')).toBe('graphql');
    });

    it('rejects empty or whitespace-only names', () => {
      expect(() => normalizeName('')).toThrow(InvalidNameError);
      expect(() => normalizeName('   ')).toThrow(InvalidNameError);
      // @ts-expect-error Testing non-string input runtime check
      expect(() => normalizeName(null)).toThrow(InvalidNameError);
    });

    it('validateAndFormatName formats display name and normalized key', () => {
      const result = validateAndFormatName('  Utilities & Hooks  ');
      expect(result.name).toBe('Utilities & Hooks');
      expect(result.normalizedName).toBe('utilities & hooks');
    });
  });

  describe('Index Availability and Relationship Lookups', () => {
    it('allows indexed lookups by collectionId', async () => {
      const now = Date.now();
      await db.snippets.bulkAdd([
        {
          id: 's1',
          title: 'S1',
          code: '1',
          language: 'ts',
          collectionId: 'target-col',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 's2',
          title: 'S2',
          code: '2',
          language: 'ts',
          collectionId: 'target-col',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 's3',
          title: 'S3',
          code: '3',
          language: 'ts',
          collectionId: 'other-col',
          createdAt: now,
          updatedAt: now,
        },
      ]);

      const matched = await db.snippets
        .where('collectionId')
        .equals('target-col')
        .toArray();
      expect(matched).toHaveLength(2);
      expect(matched.map((s) => s.id).sort()).toEqual(['s1', 's2']);
    });

    it('allows indexed relationship queries on snippetTags', async () => {
      await db.snippetTags.bulkAdd([
        { snippetId: 'snip-A', tagId: 'tag-1' },
        { snippetId: 'snip-A', tagId: 'tag-2' },
        { snippetId: 'snip-B', tagId: 'tag-1' },
      ]);

      // Query all tags for snippet-A
      const tagsForA = await db.snippetTags.where('snippetId').equals('snip-A').toArray();
      expect(tagsForA).toHaveLength(2);
      expect(tagsForA.map((st) => st.tagId).sort()).toEqual(['tag-1', 'tag-2']);

      // Query all snippets for tag-1
      const snippetsForTag1 = await db.snippetTags
        .where('tagId')
        .equals('tag-1')
        .toArray();
      expect(snippetsForTag1).toHaveLength(2);
      expect(snippetsForTag1.map((st) => st.snippetId).sort()).toEqual([
        'snip-A',
        'snip-B',
      ]);
    });
  });
});
