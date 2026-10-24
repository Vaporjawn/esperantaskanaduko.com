/**
 * Global test setup — automatically imported via jest.config.cjs setupFilesAfterEnv.
 *
 * Provides @testing-library/jest-dom matchers (toBeInTheDocument, etc.)
 * and sets up common mocks that every test file needs.
 *
 * NOTE: No JSX here — this is a plain .ts file. JSX lives in .tsx test files.
 */

// ─── Mock: react-helmet-async ─────────────────────────────────────────────────
// Return null from Helmet (don't render head content into the body) and
// pass through children from HelmetProvider so the rest of the tree renders.
jest.mock('react-helmet-async', () => ({
  Helmet: () => null,
  HelmetProvider: ({ children }: { children: unknown }) => children,
}));

// ─── Mock: react-i18next ──────────────────────────────────────────────────────
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    // Mirrors i18next's fallback behaviour: a string second argument or an
    // options object's `defaultValue` is returned, with {{placeholders}} filled
    // from the options; otherwise the key itself.
    t: (key: string, fallback?: string | Record<string, unknown>) => {
      if (typeof fallback === 'string') return fallback;
      const template = fallback?.defaultValue;
      if (typeof template !== 'string') return key;
      return template.replace(/\{\{(\w+)\}\}/g, (_match, name: string) => String(fallback?.[name] ?? ''));
    },
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
      resolvedLanguage: 'en',
    },
  }),
  Trans: ({ children }: { children: unknown }) => children,
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

// ─── Mock: Firebase config ────────────────────────────────────────────────────
jest.mock('../backend/firebase/firebaseConfig', () => ({
  default: {
    apiKey: 'test-api-key',
    authDomain: 'test.firebaseapp.com',
    projectId: 'test-project',
    storageBucket: 'test.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abcdef',
  },
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((_auth: unknown, callback: (user: null) => void) => {
    callback(null); // simulate no logged-in user
    return jest.fn(); // unsubscribe
  }),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(() => ({})),
}));

// ─── Mock: firebase/analytics ────────────────────────────────────────────────
// analytics.ts guards calls with process.env.NODE_ENV === 'production', so
// these fns should never be called in tests, but mocking the module prevents
// Babel from choking on Firebase Analytics' ESM-only internals.
jest.mock('firebase/analytics', () => ({
  getAnalytics: jest.fn(() => ({})),
  isSupported: jest.fn(() => Promise.resolve(false)),
  logEvent: jest.fn(),
}));

// ─── Mock: @sentry/react ─────────────────────────────────────────────────────
// Sentry.init() is called in main.tsx (never in Jest scope). The only export
// used by app code during tests is captureException (via ErrorBoundary).
jest.mock('@sentry/react', () => ({
  captureException: jest.fn(),
}));

// ─── Mock: react-router-dom (partial) ────────────────────────────────────────
// Keep the real MemoryRouter/Routes/Route — only stub the hooks.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/', search: '', hash: '' }),
}));
