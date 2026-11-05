/**
 * DevCodeSnap - Database Domain Errors
 */

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class EntityNotFoundError extends DatabaseError {
  readonly entityName: string;
  readonly entityId: string;

  constructor(entityName: string, entityId: string) {
    super(`${entityName} with id "${entityId}" was not found.`);
    this.name = 'EntityNotFoundError';
    this.entityName = entityName;
    this.entityId = entityId;
  }
}

export class DuplicateNameError extends DatabaseError {
  readonly entityName: string;
  readonly entityValue: string;

  constructor(entityName: string, entityValue: string) {
    super(`${entityName} with name "${entityValue}" already exists.`);
    this.name = 'DuplicateNameError';
    this.entityName = entityName;
    this.entityValue = entityValue;
  }
}

export class ValidationError extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
