/**
 * DevCodeSnap - Core Type Definitions (Phase 1)
 */

export type ThemeMode = 'dark' | 'light' | 'system';

export interface ExtensionInfo {
  name: string;
  version: string;
  status: 'active' | 'inactive' | 'ready';
}

export interface ExtensionMessage<T = unknown> {
  type: string;
  payload?: T;
  timestamp: number;
}
