/**
 * DevCodeSnap - Content Script (Manifest V3)
 * Phase 1: Isolated script foundation for DOM interaction and page messaging.
 */

import { APP_NAME, APP_VERSION, MESSAGE_TYPES } from '@/constants';
import type { ExtensionMessage } from '@/types';

// Safely log initialization
console.info(`[${APP_NAME}] Content script initialized (v${APP_VERSION})`);

// Listen for messages from background worker or popup
chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    if (message?.type === MESSAGE_TYPES.PING) {
      sendResponse({
        type: MESSAGE_TYPES.PONG,
        source: 'content-script',
        app: APP_NAME,
        version: APP_VERSION,
        url: window.location.href,
      });
      return true;
    }

    return false;
  }
);
