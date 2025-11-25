/**
 * Comprehensive error type definitions for the Esperanto Translator extension
 */

/**
 * Error categories for better error classification
 */
export enum ErrorCategory {
  NETWORK = 'NETWORK',
  API = 'API',
  STORAGE = 'STORAGE',
  PARSING = 'PARSING',
  VALIDATION = 'VALIDATION',
  CACHE = 'CACHE',
  DOM = 'DOM',
  PERMISSION = 'PERMISSION',
  CONFIGURATION = 'CONFIGURATION',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  CRITICAL = 'CRITICAL', // Application cannot continue
  HIGH = 'HIGH', // Feature is broken
  MEDIUM = 'MEDIUM', // Degraded functionality
  LOW = 'LOW', // Minor issue, fallback available
  INFO = 'INFO', // Informational only
}

/**
 * Detailed error context for debugging
 */
export interface ErrorContext {
  timestamp: string;
  userAgent?: string;
  extensionVersion?: string;
  url?: string;
  tabId?: number;
  settings?: Record<string, unknown>;
  stackTrace?: string;
  additionalData?: Record<string, unknown>;
}

/**
 * Suggested actions for error recovery
 */
export interface ErrorRecoveryAction {
  label: string;
  action: 'retry' | 'reload' | 'configure' | 'contact' | 'ignore' | 'clearCache';
  description: string;
  autoExecutable?: boolean;
}

/**
 * Detailed error information
 */
export interface DetailedError {
  // Basic info
  code: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;

  // User-facing information
  userMessage: string;
  technicalDetails: string;

  // Context
  context: ErrorContext;

  // Recovery
  recoveryActions: ErrorRecoveryAction[];
  isRecoverable: boolean;

  // Original error
  originalError?: Error;
  originalMessage?: string;

  // Related documentation
  helpUrl?: string;
  relatedErrors?: string[];
}

/**
 * Error codes for specific error types
 */
export enum ErrorCode {
  // Network errors (NET_*)
  NET_NO_CONNECTION = 'NET_NO_CONNECTION',
  NET_TIMEOUT = 'NET_TIMEOUT',
  NET_DNS_FAILED = 'NET_DNS_FAILED',
  NET_CONNECTION_REFUSED = 'NET_CONNECTION_REFUSED',
  NET_SSL_ERROR = 'NET_SSL_ERROR',
  NET_CORS_ERROR = 'NET_CORS_ERROR',

  // API errors (API_*)
  API_KEY_INVALID = 'API_KEY_INVALID',
  API_KEY_MISSING = 'API_KEY_MISSING',
  API_QUOTA_EXCEEDED = 'API_QUOTA_EXCEEDED',
  API_RATE_LIMITED = 'API_RATE_LIMITED',
  API_UNAUTHORIZED = 'API_UNAUTHORIZED',
  API_SERVER_ERROR = 'API_SERVER_ERROR',
  API_BAD_REQUEST = 'API_BAD_REQUEST',
  API_LANGUAGE_NOT_SUPPORTED = 'API_LANGUAGE_NOT_SUPPORTED',
  API_TEXT_TOO_LONG = 'API_TEXT_TOO_LONG',
  API_RESPONSE_MALFORMED = 'API_RESPONSE_MALFORMED',

  // Storage errors (STOR_*)
  STOR_QUOTA_EXCEEDED = 'STOR_QUOTA_EXCEEDED',
  STOR_PERMISSION_DENIED = 'STOR_PERMISSION_DENIED',
  STOR_CORRUPTED_DATA = 'STOR_CORRUPTED_DATA',
  STOR_WRITE_FAILED = 'STOR_WRITE_FAILED',
  STOR_READ_FAILED = 'STOR_READ_FAILED',
  STOR_DB_VERSION_ERROR = 'STOR_DB_VERSION_ERROR',
  STOR_DB_BLOCKED = 'STOR_DB_BLOCKED',
  STOR_DB_NOT_FOUND = 'STOR_DB_NOT_FOUND',

  // Cache errors (CACHE_*)
  CACHE_INITIALIZATION_FAILED = 'CACHE_INITIALIZATION_FAILED',
  CACHE_WRITE_FAILED = 'CACHE_WRITE_FAILED',
  CACHE_READ_FAILED = 'CACHE_READ_FAILED',
  CACHE_CORRUPTED = 'CACHE_CORRUPTED',
  CACHE_SYNC_FAILED = 'CACHE_SYNC_FAILED',

  // Parsing errors (PARSE_*)
  PARSE_JSON_FAILED = 'PARSE_JSON_FAILED',
  PARSE_HTML_FAILED = 'PARSE_HTML_FAILED',
  PARSE_INVALID_SETTINGS = 'PARSE_INVALID_SETTINGS',
  PARSE_INVALID_RESPONSE = 'PARSE_INVALID_RESPONSE',

  // Validation errors (VAL_*)
  VAL_INVALID_LANGUAGE_CODE = 'VAL_INVALID_LANGUAGE_CODE',
  VAL_EMPTY_TEXT = 'VAL_EMPTY_TEXT',
  VAL_INVALID_URL = 'VAL_INVALID_URL',
  VAL_INVALID_DOMAIN = 'VAL_INVALID_DOMAIN',
  VAL_SETTINGS_SCHEMA = 'VAL_SETTINGS_SCHEMA',

  // DOM errors (DOM_*)
  DOM_NODE_NOT_FOUND = 'DOM_NODE_NOT_FOUND',
  DOM_TRAVERSAL_FAILED = 'DOM_TRAVERSAL_FAILED',
  DOM_MUTATION_FAILED = 'DOM_MUTATION_FAILED',
  DOM_INJECTION_BLOCKED = 'DOM_INJECTION_BLOCKED',
  DOM_READONLY_NODE = 'DOM_READONLY_NODE',

  // Permission errors (PERM_*)
  PERM_TAB_ACCESS_DENIED = 'PERM_TAB_ACCESS_DENIED',
  PERM_HOST_ACCESS_DENIED = 'PERM_HOST_ACCESS_DENIED',
  PERM_STORAGE_ACCESS_DENIED = 'PERM_STORAGE_ACCESS_DENIED',
  PERM_CONTEXT_MENU_DENIED = 'PERM_CONTEXT_MENU_DENIED',

  // Configuration errors (CFG_*)
  CFG_MISSING_API_KEY = 'CFG_MISSING_API_KEY',
  CFG_INVALID_SETTINGS = 'CFG_INVALID_SETTINGS',
  CFG_INITIALIZATION_FAILED = 'CFG_INITIALIZATION_FAILED',
  CFG_VERSION_MISMATCH = 'CFG_VERSION_MISMATCH',

  // Unknown/Generic
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Pre-defined error templates for common scenarios
 */
export const ERROR_TEMPLATES: Record<ErrorCode, Omit<DetailedError, 'context'>> = {
  // Network errors
  [ErrorCode.NET_NO_CONNECTION]: {
    code: ErrorCode.NET_NO_CONNECTION,
    message: 'No internet connection detected',
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Unable to connect to the internet. Please check your connection and try again.',
    technicalDetails: 'Network request failed with ERR_INTERNET_DISCONNECTED. The device appears to be offline.',
    recoveryActions: [
      {
        label: 'Retry',
        action: 'retry',
        description: 'Try the translation again',
        autoExecutable: true,
      },
      {
        label: 'Use Offline Cache',
        action: 'ignore',
        description: 'Continue with cached translations if available',
        autoExecutable: true,
      },
    ],
    isRecoverable: true,
    helpUrl: 'https://github.com/Vaporjawn/esperanto-translator/wiki/troubleshooting#network-issues',
  },

  [ErrorCode.NET_TIMEOUT]: {
    code: ErrorCode.NET_TIMEOUT,
    message: 'Request timed out',
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'The translation request took too long. Please try again.',
    technicalDetails: 'HTTP request exceeded the 30-second timeout limit. This may indicate slow network or API performance.',
    recoveryActions: [
      {
        label: 'Retry',
        action: 'retry',
        description: 'Try the request again',
        autoExecutable: true,
      },
      {
        label: 'Check Network',
        action: 'ignore',
        description: 'Verify your internet connection speed',
      },
    ],
    isRecoverable: true,
  },

  // API errors
  [ErrorCode.API_KEY_INVALID]: {
    code: ErrorCode.API_KEY_INVALID,
    message: 'Invalid API key',
    category: ErrorCategory.API,
    severity: ErrorSeverity.CRITICAL,
    userMessage: 'Your Google Translate API key is invalid. Please check your settings and enter a valid key.',
    technicalDetails: 'Google Cloud Translation API returned 400 Bad Request with "API key not valid" error. The provided key does not match any active project.',
    recoveryActions: [
      {
        label: 'Configure API Key',
        action: 'configure',
        description: 'Open settings to update your API key',
        autoExecutable: true,
      },
      {
        label: 'View Setup Guide',
        action: 'contact',
        description: 'Learn how to obtain a valid API key',
      },
    ],
    isRecoverable: true,
    helpUrl: 'https://github.com/Vaporjawn/esperanto-translator/wiki/setup#api-key-configuration',
  },

  [ErrorCode.API_QUOTA_EXCEEDED]: {
    code: ErrorCode.API_QUOTA_EXCEEDED,
    message: 'API quota exceeded',
    category: ErrorCategory.API,
    severity: ErrorSeverity.HIGH,
    userMessage: 'You have exceeded your Google Translate API quota. Translation requests will resume when your quota resets.',
    technicalDetails: 'Google Cloud Translation API returned 429 Too Many Requests. Daily/monthly character limit has been reached for the current billing period.',
    recoveryActions: [
      {
        label: 'Use Cache',
        action: 'ignore',
        description: 'Continue with cached translations only',
        autoExecutable: true,
      },
      {
        label: 'Check Quota',
        action: 'contact',
        description: 'View your quota usage in Google Cloud Console',
      },
      {
        label: 'Upgrade Plan',
        action: 'contact',
        description: 'Increase your API quota limit',
      },
    ],
    isRecoverable: false,
    helpUrl: 'https://github.com/Vaporjawn/esperanto-translator/wiki/api-quota',
  },

  [ErrorCode.API_RATE_LIMITED]: {
    code: ErrorCode.API_RATE_LIMITED,
    message: 'Rate limit exceeded',
    category: ErrorCategory.API,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'You are making too many translation requests. Please wait a moment and try again.',
    technicalDetails: 'Google Cloud Translation API rate limiter triggered. Current rate: exceeded 100 requests per 100 seconds. Retry after 30 seconds.',
    recoveryActions: [
      {
        label: 'Wait and Retry',
        action: 'retry',
        description: 'Automatically retry after cooldown period',
        autoExecutable: true,
      },
      {
        label: 'Reduce Translation Speed',
        action: 'configure',
        description: 'Adjust settings to batch translations',
      },
    ],
    isRecoverable: true,
  },

  [ErrorCode.API_SERVER_ERROR]: {
    code: ErrorCode.API_SERVER_ERROR,
    message: 'Translation API server error',
    category: ErrorCategory.API,
    severity: ErrorSeverity.HIGH,
    userMessage: 'The translation service is experiencing issues. Please try again later.',
    technicalDetails: 'Google Cloud Translation API returned 500 Internal Server Error. This indicates a problem with the translation service infrastructure.',
    recoveryActions: [
      {
        label: 'Retry',
        action: 'retry',
        description: 'Attempt the request again',
        autoExecutable: true,
      },
      {
        label: 'Check Status',
        action: 'contact',
        description: 'View Google Cloud status page',
      },
    ],
    isRecoverable: true,
    helpUrl: 'https://status.cloud.google.com/',
  },

  // Storage errors
  [ErrorCode.STOR_QUOTA_EXCEEDED]: {
    code: ErrorCode.STOR_QUOTA_EXCEEDED,
    message: 'Storage quota exceeded',
    category: ErrorCategory.STORAGE,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'The extension has run out of storage space. Please clear your cache to continue.',
    technicalDetails: 'Chrome storage quota (10MB for sync, 100MB for IndexedDB) has been exceeded. Current usage: 98% of available space.',
    recoveryActions: [
      {
        label: 'Clear Cache',
        action: 'clearCache',
        description: 'Remove cached translations',
        autoExecutable: true,
      },
      {
        label: 'Clear History',
        action: 'configure',
        description: 'Delete translation history',
      },
    ],
    isRecoverable: true,
  },

  [ErrorCode.STOR_DB_BLOCKED]: {
    code: ErrorCode.STOR_DB_BLOCKED,
    message: 'IndexedDB blocked',
    category: ErrorCategory.STORAGE,
    severity: ErrorSeverity.HIGH,
    userMessage: 'The browser is blocking database access. This usually happens when you have the extension open in multiple tabs.',
    technicalDetails: 'IndexedDB open() operation blocked by another connection. Database version change request pending from another tab.',
    recoveryActions: [
      {
        label: 'Close Other Tabs',
        action: 'reload',
        description: 'Close extension popup/settings in other tabs',
      },
      {
        label: 'Reload Extension',
        action: 'reload',
        description: 'Reload the extension to reset connections',
      },
    ],
    isRecoverable: true,
  },

  // Cache errors
  [ErrorCode.CACHE_INITIALIZATION_FAILED]: {
    code: ErrorCode.CACHE_INITIALIZATION_FAILED,
    message: 'Cache initialization failed',
    category: ErrorCategory.CACHE,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Unable to initialize the translation cache. Translations will work but may be slower.',
    technicalDetails: 'Failed to initialize LRU cache or IndexedDB. Error: Could not create database schema. The extension will continue without caching.',
    recoveryActions: [
      {
        label: 'Continue Without Cache',
        action: 'ignore',
        description: 'Use the extension without caching',
        autoExecutable: true,
      },
      {
        label: 'Reload Extension',
        action: 'reload',
        description: 'Try reinitializing the cache',
      },
    ],
    isRecoverable: true,
  },

  [ErrorCode.CACHE_CORRUPTED]: {
    code: ErrorCode.CACHE_CORRUPTED,
    message: 'Cache data corrupted',
    category: ErrorCategory.CACHE,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Your translation cache is corrupted. It will be cleared automatically.',
    technicalDetails: 'Cache validation failed: invalid entry format or missing required fields. The cache contains malformed data that cannot be safely used.',
    recoveryActions: [
      {
        label: 'Clear and Rebuild',
        action: 'clearCache',
        description: 'Clear corrupted cache and start fresh',
        autoExecutable: true,
      },
    ],
    isRecoverable: true,
  },

  // Parsing errors
  [ErrorCode.PARSE_JSON_FAILED]: {
    code: ErrorCode.PARSE_JSON_FAILED,
    message: 'JSON parsing failed',
    category: ErrorCategory.PARSING,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Received invalid data from the translation service. Please try again.',
    technicalDetails: 'JSON.parse() threw SyntaxError: Unexpected token at position 42. The API response is not valid JSON.',
    recoveryActions: [
      {
        label: 'Retry',
        action: 'retry',
        description: 'Request the translation again',
        autoExecutable: true,
      },
      {
        label: 'Report Issue',
        action: 'contact',
        description: 'Report this parsing error',
      },
    ],
    isRecoverable: true,
  },

  [ErrorCode.PARSE_INVALID_SETTINGS]: {
    code: ErrorCode.PARSE_INVALID_SETTINGS,
    message: 'Invalid settings format',
    category: ErrorCategory.PARSING,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Your settings file is corrupted. Default settings will be used.',
    technicalDetails: 'Settings schema validation failed: missing required fields "autoTranslate", "translationQuality". The saved settings do not match the expected format.',
    recoveryActions: [
      {
        label: 'Reset to Defaults',
        action: 'configure',
        description: 'Use default settings',
        autoExecutable: true,
      },
      {
        label: 'Reconfigure',
        action: 'configure',
        description: 'Set up your preferences again',
      },
    ],
    isRecoverable: true,
  },

  // Validation errors
  [ErrorCode.VAL_INVALID_LANGUAGE_CODE]: {
    code: ErrorCode.VAL_INVALID_LANGUAGE_CODE,
    message: 'Invalid language code',
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'The specified language is not supported. Using Esperanto as default.',
    technicalDetails: 'Language code "xyz" does not match ISO 639-1 format and is not in the supported languages list. Valid codes: en, eo, es, fr, de, etc.',
    recoveryActions: [
      {
        label: 'Use Default',
        action: 'ignore',
        description: 'Translate to Esperanto',
        autoExecutable: true,
      },
      {
        label: 'View Supported Languages',
        action: 'contact',
        description: 'See list of available languages',
      },
    ],
    isRecoverable: true,
  },

  [ErrorCode.VAL_EMPTY_TEXT]: {
    code: ErrorCode.VAL_EMPTY_TEXT,
    message: 'No text to translate',
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'There is no text selected or the selected text is empty.',
    technicalDetails: 'Translation request contains empty or whitespace-only text. Minimum text length: 1 character.',
    recoveryActions: [
      {
        label: 'Select Text',
        action: 'ignore',
        description: 'Select some text to translate',
      },
    ],
    isRecoverable: true,
  },

  // DOM errors
  [ErrorCode.DOM_NODE_NOT_FOUND]: {
    code: ErrorCode.DOM_NODE_NOT_FOUND,
    message: 'DOM node not found',
    category: ErrorCategory.DOM,
    severity: ErrorSeverity.LOW,
    userMessage: 'Some elements on the page could not be translated. The page structure may have changed.',
    technicalDetails: 'TreeWalker could not locate text nodes. The DOM may have been modified by JavaScript after initial page load.',
    recoveryActions: [
      {
        label: 'Retry Translation',
        action: 'retry',
        description: 'Try translating the page again',
        autoExecutable: true,
      },
      {
        label: 'Refresh Page',
        action: 'reload',
        description: 'Reload and try again',
      },
    ],
    isRecoverable: true,
  },

  [ErrorCode.DOM_INJECTION_BLOCKED]: {
    code: ErrorCode.DOM_INJECTION_BLOCKED,
    message: 'Content injection blocked',
    category: ErrorCategory.DOM,
    severity: ErrorSeverity.HIGH,
    userMessage: 'This website blocks content modifications. Translation may not work properly.',
    technicalDetails: 'Content Security Policy (CSP) violation: script-src directive blocks inline script execution. The page has strict security headers.',
    recoveryActions: [
      {
        label: 'Try Selection Translation',
        action: 'ignore',
        description: 'Use right-click to translate selected text',
      },
      {
        label: 'View Blocked Sites',
        action: 'contact',
        description: 'See list of known incompatible sites',
      },
    ],
    isRecoverable: false,
    helpUrl: 'https://github.com/Vaporjawn/esperanto-translator/wiki/csp-blocked-sites',
  },

  // Permission errors
  [ErrorCode.PERM_TAB_ACCESS_DENIED]: {
    code: ErrorCode.PERM_TAB_ACCESS_DENIED,
    message: 'Tab access denied',
    category: ErrorCategory.PERMISSION,
    severity: ErrorSeverity.HIGH,
    userMessage: 'The extension does not have permission to access this tab.',
    technicalDetails: 'chrome.tabs.sendMessage() failed with "Cannot access chrome:// URLs" or similar permission error. The current tab URL is restricted.',
    recoveryActions: [
      {
        label: 'Review Permissions',
        action: 'configure',
        description: 'Check extension permissions',
      },
      {
        label: 'Visit Supported Page',
        action: 'ignore',
        description: 'Try on a different website',
      },
    ],
    isRecoverable: false,
    relatedErrors: [ErrorCode.PERM_HOST_ACCESS_DENIED],
  },

  [ErrorCode.PERM_HOST_ACCESS_DENIED]: {
    code: ErrorCode.PERM_HOST_ACCESS_DENIED,
    message: 'Host access denied',
    category: ErrorCategory.PERMISSION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'The extension needs permission to access this website. Please grant access in the extension settings.',
    technicalDetails: 'Host permissions required but not granted for current URL. User needs to approve "access your data on [hostname]".',
    recoveryActions: [
      {
        label: 'Grant Permission',
        action: 'configure',
        description: 'Allow access to this site',
        autoExecutable: false,
      },
    ],
    isRecoverable: true,
  },

  // Configuration errors
  [ErrorCode.CFG_MISSING_API_KEY]: {
    code: ErrorCode.CFG_MISSING_API_KEY,
    message: 'API key not configured',
    category: ErrorCategory.CONFIGURATION,
    severity: ErrorSeverity.CRITICAL,
    userMessage: 'You need to configure your Google Translate API key before using this extension.',
    technicalDetails: 'No API key found in environment variables (VITE_GOOGLE_TRANSLATE_API_KEY) or extension settings. Translation service cannot initialize.',
    recoveryActions: [
      {
        label: 'Configure Now',
        action: 'configure',
        description: 'Open settings and add your API key',
        autoExecutable: true,
      },
      {
        label: 'Setup Guide',
        action: 'contact',
        description: 'Learn how to get an API key',
      },
    ],
    isRecoverable: true,
    helpUrl: 'https://github.com/Vaporjawn/esperanto-translator/wiki/setup',
  },

  // Unknown error fallback
  [ErrorCode.UNKNOWN_ERROR]: {
    code: ErrorCode.UNKNOWN_ERROR,
    message: 'An unexpected error occurred',
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Something went wrong. Please try again or report this issue if it persists.',
    technicalDetails: 'Unhandled exception caught in error boundary. No specific error handler matched this error type.',
    recoveryActions: [
      {
        label: 'Retry',
        action: 'retry',
        description: 'Try the operation again',
        autoExecutable: true,
      },
      {
        label: 'Reload Extension',
        action: 'reload',
        description: 'Reload the extension',
      },
      {
        label: 'Report Bug',
        action: 'contact',
        description: 'File a bug report with details',
      },
    ],
    isRecoverable: true,
    helpUrl: 'https://github.com/Vaporjawn/esperanto-translator/issues/new',
  },

  // Additional error templates (compact definitions)
  [ErrorCode.NET_DNS_FAILED]: {
    code: ErrorCode.NET_DNS_FAILED,
    message: 'DNS resolution failed',
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Cannot reach the translation service. Please check your DNS settings.',
    technicalDetails: 'DNS lookup failed for translation.googleapis.com. ERR_NAME_NOT_RESOLVED.',
    recoveryActions: [{ label: 'Retry', action: 'retry', description: 'Try again', autoExecutable: true }],
    isRecoverable: true,
  },

  [ErrorCode.NET_CONNECTION_REFUSED]: {
    code: ErrorCode.NET_CONNECTION_REFUSED,
    message: 'Connection refused',
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    userMessage: 'The translation service refused the connection. Please try again later.',
    technicalDetails: 'TCP connection to googleapis.com port 443 refused. ERR_CONNECTION_REFUSED.',
    recoveryActions: [{ label: 'Retry', action: 'retry', description: 'Try again', autoExecutable: true }],
    isRecoverable: true,
  },

  [ErrorCode.NET_SSL_ERROR]: {
    code: ErrorCode.NET_SSL_ERROR,
    message: 'SSL certificate error',
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Secure connection failed. This may indicate a network security issue.',
    technicalDetails: 'SSL/TLS handshake failed. Certificate validation error or protocol mismatch.',
    recoveryActions: [{ label: 'Check Date/Time', action: 'ignore', description: 'Verify system clock is correct' }],
    isRecoverable: false,
  },

  [ErrorCode.NET_CORS_ERROR]: {
    code: ErrorCode.NET_CORS_ERROR,
    message: 'CORS policy error',
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Cross-origin request blocked. This should not happen in extensions.',
    technicalDetails: 'CORS preflight failed. Access-Control-Allow-Origin header missing or invalid.',
    recoveryActions: [{ label: 'Report Bug', action: 'contact', description: 'This should not occur' }],
    isRecoverable: false,
  },

  [ErrorCode.API_KEY_MISSING]: {
    code: ErrorCode.API_KEY_MISSING,
    message: 'API key not provided',
    category: ErrorCategory.API,
    severity: ErrorSeverity.CRITICAL,
    userMessage: 'API key is required but was not provided.',
    technicalDetails: 'API key field is empty or null. Cannot make translation requests.',
    recoveryActions: [{ label: 'Configure', action: 'configure', description: 'Add API key', autoExecutable: true }],
    isRecoverable: true,
  },

  [ErrorCode.API_UNAUTHORIZED]: {
    code: ErrorCode.API_UNAUTHORIZED,
    message: 'Unauthorized API request',
    category: ErrorCategory.API,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Authentication failed. Please check your API key.',
    technicalDetails: 'HTTP 401 Unauthorized. API key may be revoked or project disabled.',
    recoveryActions: [{ label: 'Update Key', action: 'configure', description: 'Enter new API key' }],
    isRecoverable: true,
  },

  [ErrorCode.API_BAD_REQUEST]: {
    code: ErrorCode.API_BAD_REQUEST,
    message: 'Bad API request',
    category: ErrorCategory.API,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'The translation request was invalid. Please try different text.',
    technicalDetails: 'HTTP 400 Bad Request. Request parameters do not meet API requirements.',
    recoveryActions: [{ label: 'Retry', action: 'retry', description: 'Try again' }],
    isRecoverable: true,
  },

  [ErrorCode.API_LANGUAGE_NOT_SUPPORTED]: {
    code: ErrorCode.API_LANGUAGE_NOT_SUPPORTED,
    message: 'Language not supported',
    category: ErrorCategory.API,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'The selected language pair is not supported by the translation service.',
    technicalDetails: 'API returned language support error. Source or target language unavailable.',
    recoveryActions: [{ label: 'Use Default', action: 'ignore', description: 'Use Esperanto' }],
    isRecoverable: true,
  },

  [ErrorCode.API_TEXT_TOO_LONG]: {
    code: ErrorCode.API_TEXT_TOO_LONG,
    message: 'Text exceeds maximum length',
    category: ErrorCategory.API,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'The text is too long to translate. Please select a smaller section.',
    technicalDetails: 'Text length exceeds API limit of 30,000 characters per request.',
    recoveryActions: [{ label: 'Split Text', action: 'ignore', description: 'Select smaller portion' }],
    isRecoverable: true,
  },

  [ErrorCode.API_RESPONSE_MALFORMED]: {
    code: ErrorCode.API_RESPONSE_MALFORMED,
    message: 'Malformed API response',
    category: ErrorCategory.API,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Received unexpected data from translation service.',
    technicalDetails: 'API response structure does not match expected schema. Missing required fields.',
    recoveryActions: [{ label: 'Retry', action: 'retry', description: 'Try again' }],
    isRecoverable: true,
  },

  [ErrorCode.STOR_PERMISSION_DENIED]: {
    code: ErrorCode.STOR_PERMISSION_DENIED,
    message: 'Storage permission denied',
    category: ErrorCategory.STORAGE,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Cannot save settings. Storage permission is required.',
    technicalDetails: 'chrome.storage API access denied. Storage permission not granted.',
    recoveryActions: [{ label: 'Grant Permission', action: 'configure', description: 'Allow storage access' }],
    isRecoverable: true,
  },

  [ErrorCode.STOR_CORRUPTED_DATA]: {
    code: ErrorCode.STOR_CORRUPTED_DATA,
    message: 'Corrupted storage data',
    category: ErrorCategory.STORAGE,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Saved data is corrupted. Settings will be reset.',
    technicalDetails: 'Storage data validation failed. Data structure incompatible with current version.',
    recoveryActions: [{ label: 'Reset', action: 'configure', description: 'Clear and restart' }],
    isRecoverable: true,
  },

  [ErrorCode.STOR_WRITE_FAILED]: {
    code: ErrorCode.STOR_WRITE_FAILED,
    message: 'Failed to write to storage',
    category: ErrorCategory.STORAGE,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Cannot save changes. Storage may be full.',
    technicalDetails: 'chrome.storage.set() operation failed. Possible quota or permission issue.',
    recoveryActions: [{ label: 'Clear Cache', action: 'clearCache', description: 'Free up space' }],
    isRecoverable: true,
  },

  [ErrorCode.STOR_READ_FAILED]: {
    code: ErrorCode.STOR_READ_FAILED,
    message: 'Failed to read from storage',
    category: ErrorCategory.STORAGE,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Cannot load settings. Using defaults.',
    technicalDetails: 'chrome.storage.get() operation failed or returned null.',
    recoveryActions: [{ label: 'Use Defaults', action: 'ignore', description: 'Continue with defaults' }],
    isRecoverable: true,
  },

  [ErrorCode.STOR_DB_VERSION_ERROR]: {
    code: ErrorCode.STOR_DB_VERSION_ERROR,
    message: 'Database version mismatch',
    category: ErrorCategory.STORAGE,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Database needs to be upgraded. This may clear cached data.',
    technicalDetails: 'IndexedDB version conflict. Stored version older than required schema.',
    recoveryActions: [{ label: 'Upgrade', action: 'reload', description: 'Upgrade database' }],
    isRecoverable: true,
  },

  [ErrorCode.STOR_DB_NOT_FOUND]: {
    code: ErrorCode.STOR_DB_NOT_FOUND,
    message: 'Database not found',
    category: ErrorCategory.STORAGE,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Cache database missing. It will be created automatically.',
    technicalDetails: 'IndexedDB named "EsperantoTranslatorCache" does not exist.',
    recoveryActions: [{ label: 'Create', action: 'ignore', description: 'Initialize new database', autoExecutable: true }],
    isRecoverable: true,
  },

  [ErrorCode.CACHE_WRITE_FAILED]: {
    code: ErrorCode.CACHE_WRITE_FAILED,
    message: 'Cache write failed',
    category: ErrorCategory.CACHE,
    severity: ErrorSeverity.LOW,
    userMessage: 'Translation was successful but could not be cached.',
    technicalDetails: 'Failed to write to LRU cache or IndexedDB. Cache may be full or corrupted.',
    recoveryActions: [{ label: 'Continue', action: 'ignore', description: 'Translation still works' }],
    isRecoverable: true,
  },

  [ErrorCode.CACHE_READ_FAILED]: {
    code: ErrorCode.CACHE_READ_FAILED,
    message: 'Cache read failed',
    category: ErrorCategory.CACHE,
    severity: ErrorSeverity.LOW,
    userMessage: 'Cannot read from cache. New translation will be requested.',
    technicalDetails: 'Cache lookup failed with read error. Falling back to API request.',
    recoveryActions: [{ label: 'Continue', action: 'ignore', description: 'Fetch new translation' }],
    isRecoverable: true,
  },

  [ErrorCode.CACHE_SYNC_FAILED]: {
    code: ErrorCode.CACHE_SYNC_FAILED,
    message: 'Cache synchronization failed',
    category: ErrorCategory.CACHE,
    severity: ErrorSeverity.LOW,
    userMessage: 'Memory cache and offline cache are out of sync.',
    technicalDetails: 'Sync operation between memory LRU and IndexedDB failed. Caches may be inconsistent.',
    recoveryActions: [{ label: 'Rebuild Cache', action: 'clearCache', description: 'Clear and resync' }],
    isRecoverable: true,
  },

  [ErrorCode.PARSE_HTML_FAILED]: {
    code: ErrorCode.PARSE_HTML_FAILED,
    message: 'HTML parsing failed',
    category: ErrorCategory.PARSING,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Cannot parse page structure. Some text may not be translated.',
    technicalDetails: 'DOMParser.parseFromString() threw exception. Invalid HTML structure.',
    recoveryActions: [{ label: 'Continue', action: 'ignore', description: 'Translate available content' }],
    isRecoverable: true,
  },

  [ErrorCode.PARSE_INVALID_RESPONSE]: {
    code: ErrorCode.PARSE_INVALID_RESPONSE,
    message: 'Invalid API response format',
    category: ErrorCategory.PARSING,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Translation service returned unexpected format.',
    technicalDetails: 'API response does not match expected schema. Missing "data.translations" field.',
    recoveryActions: [{ label: 'Retry', action: 'retry', description: 'Request again' }],
    isRecoverable: true,
  },

  [ErrorCode.VAL_INVALID_URL]: {
    code: ErrorCode.VAL_INVALID_URL,
    message: 'Invalid URL',
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'The provided URL is not valid.',
    technicalDetails: 'URL validation failed. Does not match URL pattern or protocol not supported.',
    recoveryActions: [{ label: 'Correct URL', action: 'ignore', description: 'Enter valid URL' }],
    isRecoverable: true,
  },

  [ErrorCode.VAL_INVALID_DOMAIN]: {
    code: ErrorCode.VAL_INVALID_DOMAIN,
    message: 'Invalid domain',
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'The domain format is invalid.',
    technicalDetails: 'Domain validation failed. Must be valid hostname format.',
    recoveryActions: [{ label: 'Correct Format', action: 'ignore', description: 'Use valid domain' }],
    isRecoverable: true,
  },

  [ErrorCode.VAL_SETTINGS_SCHEMA]: {
    code: ErrorCode.VAL_SETTINGS_SCHEMA,
    message: 'Invalid settings schema',
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Settings format is invalid. Using defaults.',
    technicalDetails: 'Settings object failed JSON schema validation. Missing or invalid fields.',
    recoveryActions: [{ label: 'Reset', action: 'configure', description: 'Restore default settings' }],
    isRecoverable: true,
  },

  [ErrorCode.DOM_TRAVERSAL_FAILED]: {
    code: ErrorCode.DOM_TRAVERSAL_FAILED,
    message: 'DOM traversal failed',
    category: ErrorCategory.DOM,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Cannot navigate page structure. Translation may be incomplete.',
    technicalDetails: 'TreeWalker.nextNode() threw exception. DOM structure may be corrupted.',
    recoveryActions: [{ label: 'Retry', action: 'retry', description: 'Try translation again' }],
    isRecoverable: true,
  },

  [ErrorCode.DOM_MUTATION_FAILED]: {
    code: ErrorCode.DOM_MUTATION_FAILED,
    message: 'DOM modification failed',
    category: ErrorCategory.DOM,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Cannot modify page content. Translation blocked.',
    technicalDetails: 'Node.textContent assignment threw SecurityError or readonly exception.',
    recoveryActions: [{ label: 'Try Different Method', action: 'ignore', description: 'Use selection translation' }],
    isRecoverable: false,
  },

  [ErrorCode.DOM_READONLY_NODE]: {
    code: ErrorCode.DOM_READONLY_NODE,
    message: 'Cannot modify readonly element',
    category: ErrorCategory.DOM,
    severity: ErrorSeverity.LOW,
    userMessage: 'Some elements are readonly and cannot be translated.',
    technicalDetails: 'Attempted to modify readonly DOM node or protected element.',
    recoveryActions: [{ label: 'Skip Element', action: 'ignore', description: 'Continue with others' }],
    isRecoverable: true,
  },

  [ErrorCode.PERM_STORAGE_ACCESS_DENIED]: {
    code: ErrorCode.PERM_STORAGE_ACCESS_DENIED,
    message: 'Storage access denied',
    category: ErrorCategory.PERMISSION,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Extension needs storage permission to save settings.',
    technicalDetails: 'chrome.storage permission missing from manifest or denied by user.',
    recoveryActions: [{ label: 'Grant Permission', action: 'configure', description: 'Allow storage' }],
    isRecoverable: true,
  },

  [ErrorCode.PERM_CONTEXT_MENU_DENIED]: {
    code: ErrorCode.PERM_CONTEXT_MENU_DENIED,
    message: 'Context menu access denied',
    category: ErrorCategory.PERMISSION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Right-click translation unavailable. Missing context menu permission.',
    technicalDetails: 'chrome.contextMenus permission not granted. Cannot create menu items.',
    recoveryActions: [{ label: 'Use Button', action: 'ignore', description: 'Use popup translation' }],
    isRecoverable: false,
  },

  [ErrorCode.CFG_INVALID_SETTINGS]: {
    code: ErrorCode.CFG_INVALID_SETTINGS,
    message: 'Invalid configuration',
    category: ErrorCategory.CONFIGURATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Configuration is invalid. Using default settings.',
    technicalDetails: 'Settings validation failed. One or more config values out of acceptable range.',
    recoveryActions: [{ label: 'Reset', action: 'configure', description: 'Use defaults' }],
    isRecoverable: true,
  },

  [ErrorCode.CFG_INITIALIZATION_FAILED]: {
    code: ErrorCode.CFG_INITIALIZATION_FAILED,
    message: 'Initialization failed',
    category: ErrorCategory.CONFIGURATION,
    severity: ErrorSeverity.CRITICAL,
    userMessage: 'Extension failed to initialize. Please reload the extension.',
    technicalDetails: 'Service initialization sequence failed. Critical component unavailable.',
    recoveryActions: [{ label: 'Reload Extension', action: 'reload', description: 'Restart extension' }],
    isRecoverable: true,
  },

  [ErrorCode.CFG_VERSION_MISMATCH]: {
    code: ErrorCode.CFG_VERSION_MISMATCH,
    message: 'Version mismatch detected',
    category: ErrorCategory.CONFIGURATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Extension was updated. Some settings may be reset.',
    technicalDetails: 'Stored config version (1.0) does not match current version (2.0). Migration required.',
    recoveryActions: [{ label: 'Migrate', action: 'reload', description: 'Update configuration' }],
    isRecoverable: true,
  },
};
