/** @type {import('jest').Config} */
module.exports = {
  // Use jsdom so DOM APIs are available during tests
  testEnvironment: 'jest-environment-jsdom',

  // Where to find tests
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}'],

  // Transform .ts/.tsx via Babel
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },

  // Import extensions Jest should resolve
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Module name mappings
  moduleNameMapper: {
    // ── Path aliases (mirror tsconfig.json and vite.config.ts) ───────────────
    // More-specific aliases must be listed BEFORE the general @/ catch-all.
    '^@esperanto-analyzer$': '<rootDir>/packages/esperanto-analyzer/src/index.ts',
    '^@contexts/(.*)$':   '<rootDir>/src/contexts/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@frontend/(.*)$':   '<rootDir>/src/frontend/$1',
    '^@pages/(.*)$':      '<rootDir>/src/frontend/pages/$1',
    '^@theme/(.*)$':      '<rootDir>/src/theme/$1',
    '^@hooks/(.*)$':      '<rootDir>/src/hooks/$1',
    '^@utils/(.*)$':      '<rootDir>/src/utils/$1',
    '^@i18n/(.*)$':       '<rootDir>/src/i18n/$1',
    '^@backend/(.*)$':    '<rootDir>/src/backend/$1',
    '^@/(.*)$':           '<rootDir>/src/$1',
    // ── Static asset stubs ────────────────────────────────────────────────────
    // CSS / style imports → identity-obj-proxy (returns className strings)
    '\\.css$': 'identity-obj-proxy',
    // Static file imports → stub
    '\\.(png|jpg|jpeg|gif|svg|webp|ico)$': '<rootDir>/src/__mocks__/fileMock.cjs',
  },

  // Run after each test environment is set up (but before test files):
  // 1. @testing-library/jest-dom — adds toBeInTheDocument, etc.
  // 2. Our setup.ts — global mocks for firebase, i18next, react-helmet-async
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/src/__tests__/setup.ts',
  ],

  // Alias — keep consistent with vite.config.ts aliases added later
  // (currently no aliases, so this is a no-op placeholder)
  // modulePaths: ['<rootDir>/src'],

  // Collect coverage from source files only
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],

  // Show verbose output
  verbose: true,
};
