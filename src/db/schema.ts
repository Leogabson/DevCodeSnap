/**
 * DevCodeSnap - Database Schema and Types (Dexie.js / IndexedDB)
 */

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  captureMethod?: string;
  collectionId: string | null;
  isFavorite?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Collection {
  id: string;
  name: string;
  normalizedName: string;
  description?: string;
  color?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Tag {
  id: string;
  name: string;
  normalizedName: string;
  color?: string;
  createdAt: number;
}

export interface SnippetTag {
  snippetId: string;
  tagId: string;
}

/**
 * Custom error thrown when a collection or tag name fails validation.
 */
export class InvalidNameError extends Error {
  constructor(message = 'Name cannot be empty or contain only whitespace') {
    super(message);
    this.name = 'InvalidNameError';
  }
}

/**
 * Normalizes a name for case-insensitive uniqueness checks.
 * Trims leading/trailing whitespace and converts to lower case.
 * Throws InvalidNameError if the resulting string is empty.
 */
export function normalizeName(name: string): string {
  if (typeof name !== 'string') {
    throw new InvalidNameError('Name must be a valid string');
  }

  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new InvalidNameError('Name cannot be empty or contain only whitespace');
  }

  return trimmed.toLowerCase();
}

/**
 * Validates and formats a display name and its normalized equivalent.
 */
export function validateAndFormatName(name: string): {
  name: string;
  normalizedName: string;
} {
  const normalized = normalizeName(name);
  return {
    name: name.trim(),
    normalizedName: normalized,
  };
}
