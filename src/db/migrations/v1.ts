/**
 * DevCodeSnap - Database Schema Version 1
 * Defines the initial table structures and indexes for IndexedDB/Dexie.
 */

export const V1_STORES = {
  snippets: 'id, collectionId, language, isFavorite, createdAt, updatedAt',
  collections: 'id, &normalizedName, createdAt, updatedAt',
  tags: 'id, &normalizedName, createdAt',
  snippetTags: '[snippetId+tagId], snippetId, tagId',
} as const;
