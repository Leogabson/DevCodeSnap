/**
 * DevCodeSnap - Background Service Worker (Manifest V3)
 * Phase 1: Lifecycle management and message dispatching foundation.
 */

import { APP_NAME, APP_VERSION, MESSAGE_TYPES } from '@/constants';
import type { ExtensionMessage } from '@/types';

// Handle extension installation and updates
chrome.runtime.onInstalled.addListener((details) => {
  console.info(
    `[${APP_NAME}] Extension installed/updated:`,
    details.reason,
    `v${APP_VERSION}`
  );
});

// Extension communication channel
chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    if (message?.type === MESSAGE_TYPES.PING) {
      sendResponse({
        type: MESSAGE_TYPES.PONG,
        app: APP_NAME,
        version: APP_VERSION,
        timestamp: Date.now(),
      });
      return true;
    }

    if (message?.type === MESSAGE_TYPES.GET_STATUS) {
      sendResponse({
        status: 'ready',
        app: APP_NAME,
        version: APP_VERSION,
      });
      return true;
    }

    return false;
  }
);
