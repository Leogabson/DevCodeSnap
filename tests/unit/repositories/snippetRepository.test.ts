import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  DevCodeSnapDatabase,
  SnippetRepository,
  ValidationError,
  EntityNotFoundError,
  type Collection,
  type Tag,
  normalizeName,
} from '@/db';

describe('SnippetRepository (Phase 2.2.1)', () => {
  let db: DevCodeSnapDatabase;
  let repository: SnippetRepository;
  const testDbName = 'TestSnippetRepoDB_' + Math.random().toString(36).substring(2, 9);

  beforeEach(async () => {
    db = new DevCodeSnapDatabase(testDbName);
    await db.initialize();
    repository = new SnippetRepository(db);
  });

  afterEach(async () => {
    if (db && db.isOpen()) {
      await db.delete();
      db.close();
    }
  });

  describe('create()', () => {
    it('creates a snippet with required fields and generates id, timestamps, and defaults', async () => {
      const beforeTime = Date.now();
      const snippet = await repository.create({
        title: 'Quick Sort Implementation',
        code: '  function quickSort(arr) {\n    return arr;\n  }  ',
        language: 'typescript',
        captureMethod: 'manual',
      });

      expect(snippet.id).toBeDefined();
      expect(typeof snippet.id).toBe('string');
      expect(snippet.title).toBe('Quick Sort Implementation');
      // Original code content formatting must be preserved exactly
      expect(snippet.code).toBe('  function quickSort(arr) {\n    return arr;\n  }  ');
      expect(snippet.language).toBe('typescript');
      expect(snippet.captureMethod).toBe('manual');
      expect(snippet.collectionId).toBeNull();
      expect(snippet.isFavorite).toBe(false);
      expect(snippet.createdAt).toBeGreaterThanOrEqual(beforeTime);
      expect(snippet.updatedAt).toBe(snippet.createdAt);

      const inDb = await db.snippets.get(snippet.id);
      expect(inDb).toEqual(snippet);
    });

    it('creates a snippet with optional fields and custom collection', async () => {
      const collection: Collection = {
        id: 'col-algo',
        name: 'Algorithms',
        normalizedName: normalizeName('Algorithms'),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await db.collections.add(collection);

      const snippet = await repository.create({
        title: 'Binary Search',
        code: 'const bs = () => {};',
        language: 'javascript',
        captureMethod: 'selection',
        description: 'Searches sorted arrays',
        sourceUrl: 'https://developer.mozilla.org',
        sourceTitle: 'MDN Web Docs',
        collectionId: 'col-algo',
        isFavorite: true,
      });

      expect(snippet.description).toBe('Searches sorted arrays');
      expect(snippet.sourceUrl).toBe('https://developer.mozilla.org');
      expect(snippet.sourceTitle).toBe('MDN Web Docs');
      expect(snippet.collectionId).toBe('col-algo');
      expect(snippet.isFavorite).toBe(true);
    });

    it('creates a snippet with initial tags atomically', async () => {
      const tag1: Tag = {
        id: 'tag-react',
        name: 'React',
        normalizedName: 'react',
        createdAt: Date.now(),
      };
      const tag2: Tag = {
        id: 'tag-hooks',
        name: 'Hooks',
        normalizedName: 'hooks',
        createdAt: Date.now(),
      };
      await db.tags.bulkAdd([tag1, tag2]);

      const snippet = await repository.create({
        title: 'useDebounce Hook',
        code: 'export function useDebounce() {}',
        language: 'typescript',
        captureMethod: 'shortcut',
        tagIds: ['tag-react', 'tag-hooks', 'tag-react'], // with duplicate to test deduplication
      });

      const tags = await repository.getTagsForSnippet(snippet.id);
      expect(tags).toHaveLength(2);
      expect(tags.map((t) => t.id).sort()).toEqual(['tag-hooks', 'tag-react']);

      const relations = await db.snippetTags
        .where('snippetId')
        .equals(snippet.id)
        .toArray();
      expect(relations).toHaveLength(2);
    });

    it('throws ValidationError for empty or missing required fields', async () => {
      await expect(
        repository.create({
          title: '   ',
          code: 'console.log(1)',
          language: 'javascript',
          captureMethod: 'manual',
        })
      ).rejects.toThrow(ValidationError);

      await expect(
        repository.create({
          title: 'Title',
          code: '   ',
          language: 'javascript',
          captureMethod: 'manual',
        })
      ).rejects.toThrow(ValidationError);

      await expect(
        repository.create({
          title: 'Title',
          code: 'console.log(1)',
          language: '   ',
          captureMethod: 'manual',
        })
      ).rejects.toThrow(ValidationError);

      await expect(
        repository.create({
          title: 'Title',
          code: 'console.log(1)',
          language: 'javascript',
          captureMethod: '   ',
        })
      ).rejects.toThrow(ValidationError);
    });

    it('throws EntityNotFoundError when referencing a non-existent collection', async () => {
      await expect(
        repository.create({
          title: 'Invalid Collection Snippet',
          code: 'console.log("no-col")',
          language: 'typescript',
          captureMethod: 'manual',
          collectionId: 'non-existent-collection-id',
        })
      ).rejects.toThrow(EntityNotFoundError);
    });

    it('throws EntityNotFoundError when referencing a non-existent tag', async () => {
      const validTag: Tag = {
        id: 'tag-valid',
        name: 'Valid',
        normalizedName: 'valid',
        createdAt: Date.now(),
      };
      await db.tags.add(validTag);

      await expect(
        repository.create({
          title: 'Invalid Tag Snippet',
          code: 'console.log("invalid tag")',
          language: 'typescript',
          captureMethod: 'manual',
          tagIds: ['tag-valid', 'non-existent-tag-id'],
        })
      ).rejects.toThrow(EntityNotFoundError);
    });

    it('rolls back snippet creation when tag verification fails', async () => {
      const initialSnippetCount = await db.snippets.count();

      await expect(
        repository.create({
          title: 'Rollback Test',
          code: 'console.log("rollback")',
          language: 'typescript',
          captureMethod: 'manual',
          tagIds: ['missing-tag'],
        })
      ).rejects.toThrow(EntityNotFoundError);

      const afterCount = await db.snippets.count();
      expect(afterCount).toBe(initialSnippetCount);
    });
  });

  describe('getById() and getAll()', () => {
    it('returns snippet by id or undefined when not found', async () => {
      const snippet = await repository.create({
        title: 'Snippet 1',
        code: 'code 1',
        language: 'python',
        captureMethod: 'manual',
      });

      const found = await repository.getById(snippet.id);
      expect(found).toEqual(snippet);

      const notFound = await repository.getById('non-existent-id');
      expect(notFound).toBeUndefined();
    });

    it('returns all snippets in the database', async () => {
      await repository.create({
        title: 'Snippet A',
        code: 'code A',
        language: 'python',
        captureMethod: 'manual',
      });
      await repository.create({
        title: 'Snippet B',
        code: 'code B',
        language: 'go',
        captureMethod: 'manual',
      });

      const all = await repository.getAll();
      expect(all).toHaveLength(2);
      expect(all.map((s) => s.title).sort()).toEqual(['Snippet A', 'Snippet B']);
    });
  });

  describe('getByCollectionId()', () => {
    it('retrieves snippets by collectionId and uncategorized snippets when collectionId is null', async () => {
      const collection: Collection = {
        id: 'col-web',
        name: 'Web',
        normalizedName: 'web',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await db.collections.add(collection);

      await repository.create({
        title: 'HTML Boilerplate',
        code: '<!DOCTYPE html>',
        language: 'html',
        captureMethod: 'manual',
        collectionId: 'col-web',
      });

      await repository.create({
        title: 'CSS Reset',
        code: '* { box-sizing: border-box; }',
        language: 'css',
        captureMethod: 'manual',
        collectionId: 'col-web',
      });

      await repository.create({
        title: 'Quick Scratchpad',
        code: 'test()',
        language: 'javascript',
        captureMethod: 'manual',
        collectionId: null,
      });

      const webSnippets = await repository.getByCollectionId('col-web');
      expect(webSnippets).toHaveLength(2);
      expect(webSnippets.map((s) => s.title).sort()).toEqual([
        'CSS Reset',
        'HTML Boilerplate',
      ]);

      const uncategorized = await repository.getByCollectionId(null);
      expect(uncategorized).toHaveLength(1);
      expect(uncategorized[0].title).toBe('Quick Scratchpad');
    });
  });

  describe('getFavorites()', () => {
    it('retrieves only snippets marked as favorite', async () => {
      await repository.create({
        title: 'Favorite Snippet',
        code: 'fav()',
        language: 'typescript',
        captureMethod: 'manual',
        isFavorite: true,
      });

      await repository.create({
        title: 'Regular Snippet',
        code: 'reg()',
        language: 'typescript',
        captureMethod: 'manual',
        isFavorite: false,
      });

      const favorites = await repository.getFavorites();
      expect(favorites).toHaveLength(1);
      expect(favorites[0].title).toBe('Favorite Snippet');
    });
  });

  describe('update()', () => {
    it('updates specified fields, preserves unspecified fields, and updates updatedAt', async () => {
      const original = await repository.create({
        title: 'Original Title',
        code: '  const a = 1;  ',
        language: 'javascript',
        captureMethod: 'manual',
        description: 'Original description',
        isFavorite: false,
      });

      // Small delay to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 5));

      const updated = await repository.update(original.id, {
        title: 'Updated Title',
        isFavorite: true,
      });

      expect(updated.id).toBe(original.id);
      expect(updated.title).toBe('Updated Title');
      expect(updated.code).toBe('  const a = 1;  '); // unchanged
      expect(updated.language).toBe('javascript'); // unchanged
      expect(updated.description).toBe('Original description'); // unchanged
      expect(updated.captureMethod).toBe('manual'); // unchanged
      expect(updated.isFavorite).toBe(true);
      expect(updated.createdAt).toBe(original.createdAt);
      expect(updated.updatedAt).toBeGreaterThan(original.updatedAt);
    });

    it('throws EntityNotFoundError when updating non-existent snippet', async () => {
      await expect(
        repository.update('non-existent-snippet', { title: 'New Title' })
      ).rejects.toThrow(EntityNotFoundError);
    });

    it('throws ValidationError when update fields contain empty strings or whitespace', async () => {
      const snippet = await repository.create({
        title: 'Valid Title',
        code: 'valid code',
        language: 'typescript',
        captureMethod: 'manual',
      });

      await expect(repository.update(snippet.id, { title: '   ' })).rejects.toThrow(
        ValidationError
      );
      await expect(repository.update(snippet.id, { code: '   ' })).rejects.toThrow(
        ValidationError
      );
      await expect(repository.update(snippet.id, { language: '   ' })).rejects.toThrow(
        ValidationError
      );
    });

    it('throws EntityNotFoundError when updating to non-existent collectionId', async () => {
      const snippet = await repository.create({
        title: 'Snippet for Col Update',
        code: 'code()',
        language: 'rust',
        captureMethod: 'manual',
      });

      await expect(
        repository.update(snippet.id, { collectionId: 'missing-col-id' })
      ).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('delete() and cascade cleanup', () => {
    it('deletes snippet and removes all associated snippetTag records atomically', async () => {
      const tag: Tag = {
        id: 'tag-del',
        name: 'DeleteTest',
        normalizedName: 'deletetest',
        createdAt: Date.now(),
      };
      await db.tags.add(tag);

      const snippet = await repository.create({
        title: 'To Be Deleted',
        code: 'deleteMe()',
        language: 'typescript',
        captureMethod: 'manual',
        tagIds: ['tag-del'],
      });

      const initialRelations = await db.snippetTags
        .where('snippetId')
        .equals(snippet.id)
        .toArray();
      expect(initialRelations).toHaveLength(1);

      await repository.delete(snippet.id);

      const foundSnippet = await repository.getById(snippet.id);
      expect(foundSnippet).toBeUndefined();

      const remainingRelations = await db.snippetTags
        .where('snippetId')
        .equals(snippet.id)
        .toArray();
      expect(remainingRelations).toHaveLength(0);

      // The tag itself must remain untouched
      const foundTag = await db.tags.get('tag-del');
      expect(foundTag).toBeDefined();
    });
  });

  describe('Tag Relationship Operations', () => {
    it('retrieves tags for a snippet', async () => {
      const tagA: Tag = {
        id: 't-a',
        name: 'Alpha',
        normalizedName: 'alpha',
        createdAt: Date.now(),
      };
      const tagB: Tag = {
        id: 't-b',
        name: 'Beta',
        normalizedName: 'beta',
        createdAt: Date.now(),
      };
      await db.tags.bulkAdd([tagA, tagB]);

      const snippet = await repository.create({
        title: 'Tags Test',
        code: 'test()',
        language: 'typescript',
        captureMethod: 'manual',
        tagIds: ['t-a', 't-b'],
      });

      const tags = await repository.getTagsForSnippet(snippet.id);
      expect(tags).toHaveLength(2);
      expect(tags.map((t) => t.name).sort()).toEqual(['Alpha', 'Beta']);
    });

    it('returns empty array when snippet has no tags', async () => {
      const snippet = await repository.create({
        title: 'No Tags',
        code: 'no()',
        language: 'typescript',
        captureMethod: 'manual',
      });

      const tags = await repository.getTagsForSnippet(snippet.id);
      expect(tags).toEqual([]);
    });

    it('replaces snippet tags atomically with setSnippetTags', async () => {
      const tag1: Tag = {
        id: 't-1',
        name: 'Tag 1',
        normalizedName: 'tag 1',
        createdAt: Date.now(),
      };
      const tag2: Tag = {
        id: 't-2',
        name: 'Tag 2',
        normalizedName: 'tag 2',
        createdAt: Date.now(),
      };
      const tag3: Tag = {
        id: 't-3',
        name: 'Tag 3',
        normalizedName: 'tag 3',
        createdAt: Date.now(),
      };
      await db.tags.bulkAdd([tag1, tag2, tag3]);

      const snippet = await repository.create({
        title: 'Replace Tags Test',
        code: 'replace()',
        language: 'typescript',
        captureMethod: 'manual',
        tagIds: ['t-1', 't-2'],
      });

      await repository.setSnippetTags(snippet.id, ['t-2', 't-3']);

      const updatedTags = await repository.getTagsForSnippet(snippet.id);
      expect(updatedTags.map((t) => t.id).sort()).toEqual(['t-2', 't-3']);

      // Clear all tags by passing empty array
      await repository.setSnippetTags(snippet.id, []);
      const emptyTags = await repository.getTagsForSnippet(snippet.id);
      expect(emptyTags).toEqual([]);
    });

    it('throws EntityNotFoundError in setSnippetTags if snippet does not exist', async () => {
      await expect(
        repository.setSnippetTags('non-existent-snippet', ['t-1'])
      ).rejects.toThrow(EntityNotFoundError);
    });

    it('rolls back setSnippetTags if any tag does not exist', async () => {
      const tag1: Tag = {
        id: 't-keep',
        name: 'Keep',
        normalizedName: 'keep',
        createdAt: Date.now(),
      };
      await db.tags.add(tag1);

      const snippet = await repository.create({
        title: 'Rollback Replace Test',
        code: 'rollback()',
        language: 'typescript',
        captureMethod: 'manual',
        tagIds: ['t-keep'],
      });

      await expect(
        repository.setSnippetTags(snippet.id, ['t-keep', 'missing-tag-id'])
      ).rejects.toThrow(EntityNotFoundError);

      // Existing tag association should remain untouched due to transaction rollback
      const currentTags = await repository.getTagsForSnippet(snippet.id);
      expect(currentTags.map((t) => t.id)).toEqual(['t-keep']);
    });

    it('adds a tag to snippet and ignores duplicate addition safely', async () => {
      const tag: Tag = {
        id: 't-add',
        name: 'AddMe',
        normalizedName: 'addme',
        createdAt: Date.now(),
      };
      await db.tags.add(tag);

      const snippet = await repository.create({
        title: 'Add Tag Test',
        code: 'addTag()',
        language: 'typescript',
        captureMethod: 'manual',
      });

      await repository.addTagToSnippet(snippet.id, 't-add');
      const tags1 = await repository.getTagsForSnippet(snippet.id);
      expect(tags1).toHaveLength(1);

      // Duplicate add should be idempotent and not throw
      await repository.addTagToSnippet(snippet.id, 't-add');
      const tags2 = await repository.getTagsForSnippet(snippet.id);
      expect(tags2).toHaveLength(1);
    });

    it('throws EntityNotFoundError in addTagToSnippet when snippet or tag is missing', async () => {
      const tag: Tag = {
        id: 't-exists',
        name: 'Exists',
        normalizedName: 'exists',
        createdAt: Date.now(),
      };
      await db.tags.add(tag);

      const snippet = await repository.create({
        title: 'Missing Tag Test',
        code: 'test()',
        language: 'typescript',
        captureMethod: 'manual',
      });

      await expect(
        repository.addTagToSnippet('missing-snippet-id', 't-exists')
      ).rejects.toThrow(EntityNotFoundError);

      await expect(
        repository.addTagToSnippet(snippet.id, 'missing-tag-id')
      ).rejects.toThrow(EntityNotFoundError);
    });

    it('removes tag association cleanly with removeTagFromSnippet', async () => {
      const tag: Tag = {
        id: 't-rem',
        name: 'RemoveMe',
        normalizedName: 'removeme',
        createdAt: Date.now(),
      };
      await db.tags.add(tag);

      const snippet = await repository.create({
        title: 'Remove Tag Test',
        code: 'removeTag()',
        language: 'typescript',
        captureMethod: 'manual',
        tagIds: ['t-rem'],
      });

      expect(await repository.getTagsForSnippet(snippet.id)).toHaveLength(1);

      await repository.removeTagFromSnippet(snippet.id, 't-rem');
      expect(await repository.getTagsForSnippet(snippet.id)).toHaveLength(0);

      // Deleting again does not throw
      await expect(
        repository.removeTagFromSnippet(snippet.id, 't-rem')
      ).resolves.toBeUndefined();
    });
  });
});
