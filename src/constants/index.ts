import type { ThemeMode } from '@/types';

export const APP_NAME = 'DevCodeSnap';
export const APP_TAGLINE = 'Local-First Code Snippet Studio';
export const APP_VERSION = '0.1.0';

export const DEFAULT_THEME: ThemeMode = 'dark';

export const MESSAGE_TYPES = {
  PING: 'DEVCODESNAP_PING',
  PONG: 'DEVCODESNAP_PONG',
  GET_STATUS: 'DEVCODESNAP_GET_STATUS',
} as const;
