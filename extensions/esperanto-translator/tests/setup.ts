// Vitest setup file
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock chrome API
global.chrome = {
  runtime: {
    sendMessage: async () => ({ success: true }),
    onMessage: {
      addListener: () => {},
    },
  },
  tabs: {
    query: async () => [{ id: 1 }],
    sendMessage: async () => ({ success: true }),
  },
  storage: {
    sync: {
      get: async () => ({}),
      set: async () => {},
    },
  },
  contextMenus: {
    create: () => {},
    onClicked: {
      addListener: () => {},
    },
  },
  commands: {
    onCommand: {
      addListener: () => {},
    },
  },
} as any;
