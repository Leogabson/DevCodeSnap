import { db as defaultDb, type DevCodeSnapDatabase } from '../database';
import type { Snippet, Tag, SnippetTag } from '../schema';
import { EntityNotFoundError, ValidationError } from '../errors';

export interface CreateSnippetInput {
  title: string;
  code: string;
  language: string;
  captureMethod: string;
  description?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  collectionId?: string | null;
  isFavorite?: boolean;
  tagIds?: string[];
}

export interface UpdateSnippetInput {
  title?: string;
  code?: string;
  language?: string;
  description?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  collectionId?: string | null;
  isFavorite?: boolean;
}

export class SnippetRepository {
  private readonly db: DevCodeSnapDatabase;

  constructor(db?: DevCodeSnapDatabase) {
    this.db = db ?? defaultDb;
  }

  async create(input: CreateSnippetInput): Promise<Snippet> {
    if (
      !input.title ||
      typeof input.title !== 'string' ||
      input.title.trim().length === 0
    ) {
      throw new ValidationError(
        'Title is required and cannot be empty or contain only whitespace'
      );
    }
    if (!input.code || typeof input.code !== 'string' || input.code.trim().length === 0) {
      throw new ValidationError(
        'Code is required and cannot be empty or contain only whitespace'
      );
    }
    if (
      !input.language ||
      typeof input.language !== 'string' ||
      input.language.trim().length === 0
    ) {
      throw new ValidationError(
        'Language is required and cannot be empty or contain only whitespace'
      );
    }
    if (
      !input.captureMethod ||
      typeof input.captureMethod !== 'string' ||
      input.captureMethod.trim().length === 0
    ) {
      throw new ValidationError(
        'Capture method is required and cannot be empty or contain only whitespace'
      );
    }

    return await this.db.transaction(
      'rw',
      [this.db.snippets, this.db.collections, this.db.tags, this.db.snippetTags],
      async () => {
        if (input.collectionId !== undefined && input.collectionId !== null) {
          const col = await this.db.collections.get(input.collectionId);
          if (!col) {
            throw new EntityNotFoundError('Collection', input.collectionId);
          }
        }

        const uniqueTagIds = input.tagIds ? Array.from(new Set(input.tagIds)) : [];
        for (const tagId of uniqueTagIds) {
          const tag = await this.db.tags.get(tagId);
          if (!tag) {
            throw new EntityNotFoundError('Tag', tagId);
          }
        }

        const id = crypto.randomUUID();
        const now = Date.now();
        const snippet: Snippet = {
          id,
          title: input.title.trim(),
          code: input.code,
          language: input.language.trim(),
          captureMethod: input.captureMethod.trim(),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.sourceUrl !== undefined && { sourceUrl: input.sourceUrl }),
          ...(input.sourceTitle !== undefined && { sourceTitle: input.sourceTitle }),
          collectionId: input.collectionId ?? null,
          isFavorite: input.isFavorite ?? false,
          createdAt: now,
          updatedAt: now,
        };

        await this.db.snippets.add(snippet);

        if (uniqueTagIds.length > 0) {
          const relations: SnippetTag[] = uniqueTagIds.map((tagId) => ({
            snippetId: id,
            tagId,
          }));
          await this.db.snippetTags.bulkAdd(relations);
        }

        return snippet;
      }
    );
  }

  async getById(id: string): Promise<Snippet | undefined> {
    return this.db.snippets.get(id);
  }

  async getAll(): Promise<Snippet[]> {
    return this.db.snippets.toArray();
  }

  async getByCollectionId(collectionId: string | null): Promise<Snippet[]> {
    if (collectionId === null) {
      return this.db.snippets
        .filter((snippet) => snippet.collectionId === null)
        .toArray();
    }
    return this.db.snippets.where('collectionId').equals(collectionId).toArray();
  }

  async getFavorites(): Promise<Snippet[]> {
    return this.db.snippets.filter((snippet) => Boolean(snippet.isFavorite)).toArray();
  }

  async update(id: string, input: UpdateSnippetInput): Promise<Snippet> {
    if (input.title !== undefined) {
      if (typeof input.title !== 'string' || input.title.trim().length === 0) {
        throw new ValidationError('Title cannot be empty or contain only whitespace');
      }
    }
    if (input.code !== undefined) {
      if (typeof input.code !== 'string' || input.code.trim().length === 0) {
        throw new ValidationError('Code cannot be empty or contain only whitespace');
      }
    }
    if (input.language !== undefined) {
      if (typeof input.language !== 'string' || input.language.trim().length === 0) {
        throw new ValidationError('Language cannot be empty or contain only whitespace');
      }
    }

    return await this.db.transaction(
      'rw',
      [this.db.snippets, this.db.collections],
      async () => {
        const existing = await this.db.snippets.get(id);
        if (!existing) {
          throw new EntityNotFoundError('Snippet', id);
        }

        if (input.collectionId !== undefined && input.collectionId !== null) {
          const col = await this.db.collections.get(input.collectionId);
          if (!col) {
            throw new EntityNotFoundError('Collection', input.collectionId);
          }
        }

        const updated: Snippet = {
          ...existing,
          ...(input.title !== undefined && { title: input.title.trim() }),
          ...(input.code !== undefined && { code: input.code }),
          ...(input.language !== undefined && { language: input.language.trim() }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.sourceUrl !== undefined && { sourceUrl: input.sourceUrl }),
          ...(input.sourceTitle !== undefined && { sourceTitle: input.sourceTitle }),
          ...(input.collectionId !== undefined && { collectionId: input.collectionId }),
          ...(input.isFavorite !== undefined && { isFavorite: input.isFavorite }),
          updatedAt: Date.now(),
        };

        await this.db.snippets.put(updated);
        return updated;
      }
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.transaction('rw', [this.db.snippets, this.db.snippetTags], async () => {
      await this.db.snippetTags.where('snippetId').equals(id).delete();
      await this.db.snippets.delete(id);
    });
  }

  async getTagsForSnippet(snippetId: string): Promise<Tag[]> {
    const relations = await this.db.snippetTags
      .where('snippetId')
      .equals(snippetId)
      .toArray();
    if (relations.length === 0) {
      return [];
    }
    const tagIds = relations.map((r) => r.tagId);
    return this.db.tags.where('id').anyOf(tagIds).toArray();
  }

  async setSnippetTags(snippetId: string, tagIds: string[]): Promise<void> {
    await this.db.transaction(
      'rw',
      [this.db.snippets, this.db.tags, this.db.snippetTags],
      async () => {
        const snippet = await this.db.snippets.get(snippetId);
        if (!snippet) {
          throw new EntityNotFoundError('Snippet', snippetId);
        }

        const uniqueTagIds = Array.from(new Set(tagIds));
        for (const tagId of uniqueTagIds) {
          const tag = await this.db.tags.get(tagId);
          if (!tag) {
            throw new EntityNotFoundError('Tag', tagId);
          }
        }

        await this.db.snippetTags.where('snippetId').equals(snippetId).delete();

        if (uniqueTagIds.length > 0) {
          const relations: SnippetTag[] = uniqueTagIds.map((tagId) => ({
            snippetId,
            tagId,
          }));
          await this.db.snippetTags.bulkAdd(relations);
        }
      }
    );
  }

  async addTagToSnippet(snippetId: string, tagId: string): Promise<void> {
    await this.db.transaction(
      'rw',
      [this.db.snippets, this.db.tags, this.db.snippetTags],
      async () => {
        const snippet = await this.db.snippets.get(snippetId);
        if (!snippet) {
          throw new EntityNotFoundError('Snippet', snippetId);
        }

        const tag = await this.db.tags.get(tagId);
        if (!tag) {
          throw new EntityNotFoundError('Tag', tagId);
        }

        const existing = await this.db.snippetTags.get([snippetId, tagId]);
        if (!existing) {
          await this.db.snippetTags.add({ snippetId, tagId });
        }
      }
    );
  }

  async removeTagFromSnippet(snippetId: string, tagId: string): Promise<void> {
    await this.db.snippetTags.delete([snippetId, tagId]);
  }
}
