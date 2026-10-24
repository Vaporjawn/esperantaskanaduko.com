# PHASE 2: TRANSLATION SERVICE INTEGRATION

**Phase Objective**: Build complete translation service module with LibreTranslate API integration, error handling, caching, and batch translation support

**Estimated Time**: 3-4 hours
**Total Tasks in Phase 2**: 55 tasks
**Completion**: 0/55 tasks complete (0%)

**Prerequisites**:
- ✅ Phase 1 Complete (Project setup with Vite + React + TypeScript + MUI)
- ✅ manifest.json configured
- ✅ Chrome extension structure established

---

## STEP 2.1: Create Translation Service Module Structure

**Step Objective**: Set up services directory and base translation service file with TypeScript interfaces

### Task 2.1.1: Create Services Directory Structure
- [ ] 2.1.1.1 **Navigate to src/ directory** in terminal
      ```powershell
      cd src
      ```
      - Verify you're in project root first with `pwd`
- [ ] 2.1.1.2 **Create services directory**
      ```powershell
      New-Item -Path "services" -ItemType Directory
      ```
      - This will hold all service modules
- [ ] 2.1.1.3 **Verify directory created**
      ```powershell
      ls
      ```
      - Confirm `services/` appears in list
- [ ] 2.1.1.4 **Navigate into services directory**
      ```powershell
      cd services
      ```
- [ ] 2.1.1.5 **Return to project root**
      ```powershell
      cd ../..
      ```
      - Should be back in esperanto-translator/

### Task 2.1.2: Create TranslationService.ts File
- [ ] 2.1.2.1 **Create TranslationService.ts file**
      ```powershell
      New-Item -Path "src/services/TranslationService.ts" -ItemType File
      ```
- [ ] 2.1.2.2 **Verify file created**
      - Check file exists in src/services/
      - Use `ls src/services` to confirm
- [ ] 2.1.2.3 **Open TranslationService.ts in VS Code**
      ```powershell
      code src/services/TranslationService.ts
      ```
      - File should open and be empty
- [ ] 2.1.2.4 **Verify VS Code opened file**
      - Tab should show "TranslationService.ts"
      - File should be empty, ready for code

### Task 2.1.3: Define TypeScript Interfaces for Translation
- [ ] 2.1.3.1 **Add file header comment**
      ```typescript
      /**
       * Translation Service Module
       * Handles all translation operations using LibreTranslate API
       * Supports Esperanto translation with caching and error handling
       */
      ```
- [ ] 2.1.3.2 **Create TranslationRequest interface**
      ```typescript
      interface TranslationRequest {
        text: string;           // Text to translate
        sourceLang: string;     // Source language code (e.g., 'en')
        targetLang: string;     // Target language code (e.g., 'eo')
      }
      ```
      - Documents expected input format
      - sourceLang and targetLang use ISO 639-1 codes
- [ ] 2.1.3.3 **Create TranslationResponse interface**
      ```typescript
      interface TranslationResponse {
        translatedText: string;  // Translated result
        detectedLanguage?: string; // Auto-detected source language
      }
      ```
      - Documents API response format
      - detectedLanguage is optional (?)
- [ ] 2.1.3.4 **Create TranslationError interface**
      ```typescript
      interface TranslationError {
        code: string;            // Error code (e.g., 'API_ERROR')
        message: string;         // Human-readable error message
        originalError?: Error;   // Original error object if available
      }
      ```
      - Standardizes error reporting
      - originalError preserved for debugging
- [ ] 2.1.3.5 **Create CacheEntry interface**
      ```typescript
      interface CacheEntry {
        translatedText: string;  // Cached translation
        timestamp: number;       // When cached (Unix timestamp)
        sourceLang: string;      // Original language
        targetLang: string;      // Target language
      }
      ```
      - Enables translation caching
      - timestamp for cache expiration
- [ ] 2.1.3.6 **Verify all 4 interfaces defined**
      - [ ] TranslationRequest
      - [ ] TranslationResponse
      - [ ] TranslationError
      - [ ] CacheEntry
- [ ] 2.1.3.7 **Check TypeScript syntax**
      - No red squiggles in VS Code
      - Proper semicolons and formatting
- [ ] 2.1.3.8 **Save file**
      - Press Ctrl+S
      - Verify file saved

### Task 2.1.4: Define Translation Service Configuration
- [ ] 2.1.4.1 **Create TranslationConfig interface**
      ```typescript
      interface TranslationConfig {
        apiEndpoint: string;     // LibreTranslate API URL
        apiKey?: string;         // Optional API key for hosted instances
        timeout: number;         // Request timeout in milliseconds
        maxRetries: number;      // Max retry attempts on failure
        cacheEnabled: boolean;   // Enable/disable caching
        cacheTTL: number;        // Cache time-to-live in milliseconds
      }
      ```
- [ ] 2.1.4.2 **Create default configuration constant**
      ```typescript
      const DEFAULT_CONFIG: TranslationConfig = {
        apiEndpoint: 'https://libretranslate.com/translate',
        timeout: 10000,          // 10 seconds
        maxRetries: 3,           // Retry 3 times
        cacheEnabled: true,      // Enable caching by default
        cacheTTL: 86400000,      // 24 hours in milliseconds
      };
      ```
- [ ] 2.1.4.3 **Verify default values reasonable**
      - 10 second timeout appropriate for network requests
      - 3 retries balances reliability and speed
      - 24 hour cache reduces API calls
- [ ] 2.1.4.4 **Add configuration comments**
      - Explain why each default chosen
      - Note LibreTranslate free tier limits if any
- [ ] 2.1.4.5 **Save file**
      - Press Ctrl+S

### Task 2.1.5: Create Translation Service Class Structure
- [ ] 2.1.5.1 **Define TranslationService class**
      ```typescript
      export class TranslationService {
      ```
      - Note: export keyword makes it importable
- [ ] 2.1.5.2 **Add private config property**
      ```typescript
        private config: TranslationConfig;
      ```
      - Stores service configuration
- [ ] 2.1.5.3 **Add private cache property**
      ```typescript
        private cache: Map<string, CacheEntry>;
      ```
      - In-memory cache for translations
      - Map uses text as key for O(1) lookup
- [ ] 2.1.5.4 **Create constructor**
      ```typescript
        constructor(customConfig?: Partial<TranslationConfig>) {
          this.config = { ...DEFAULT_CONFIG, ...customConfig };
          this.cache = new Map();
        }
      ```
      - Accepts optional custom config
      - Merges with defaults using spread operator
      - Initializes empty cache
- [ ] 2.1.5.5 **Add constructor JSDoc comment**
      ```typescript
        /**
         * Initialize Translation Service
         * @param customConfig - Optional configuration overrides
         */
      ```
      - Documents constructor purpose
      - Shows parameter meaning
- [ ] 2.1.5.6 **Verify class structure valid**
      - Opening brace after class declaration
      - Properties and constructor properly indented
      - No TypeScript errors
- [ ] 2.1.5.7 **Save file**
      - Press Ctrl+S

---

## STEP 2.2: Implement Core Translation Method

**Step Objective**: Build main translate() method with API integration and error handling

### Task 2.2.1: Create Main Translate Method Signature
- [ ] 2.2.1.1 **Add translate method JSDoc**
      ```typescript
        /**
         * Translate text to Esperanto
         * @param text - Text to translate
         * @param sourceLang - Source language code (default: 'auto')
         * @returns Translated text
         * @throws TranslationError if translation fails
         */
      ```
- [ ] 2.2.1.2 **Define translate method**
      ```typescript
        async translate(
          text: string,
          sourceLang: string = 'auto'
        ): Promise<TranslationResponse> {
      ```
      - async keyword for API calls
      - Returns Promise<TranslationResponse>
      - sourceLang defaults to 'auto' for auto-detection
- [ ] 2.2.1.3 **Add input validation**
      ```typescript
          if (!text || text.trim().length === 0) {
            throw {
              code: 'EMPTY_TEXT',
              message: 'Cannot translate empty text',
            } as TranslationError;
          }
      ```
      - Prevents empty string translation
      - trim() removes whitespace
- [ ] 2.2.1.4 **Verify method signature correct**
      - async keyword present
      - Proper return type
      - Default parameter works

### Task 2.2.2: Implement Cache Check Logic
- [ ] 2.2.2.1 **Create cache key generator**
      ```typescript
          const cacheKey = `${sourceLang}:eo:${text}`;
      ```
      - Unique key per text/language combo
      - Format: "sourceLang:targetLang:text"
- [ ] 2.2.2.2 **Add cache check condition**
      ```typescript
          if (this.config.cacheEnabled) {
            const cached = this.cache.get(cacheKey);
      ```
      - Only check cache if enabled
- [ ] 2.2.2.3 **Implement cache freshness check**
      ```typescript
            if (cached) {
              const isExpired =
                Date.now() - cached.timestamp > this.config.cacheTTL;

              if (!isExpired) {
                return {
                  translatedText: cached.translatedText,
                  detectedLanguage: cached.sourceLang,
                };
              }
            }
          }
      ```
      - Check if cache entry exists
      - Calculate time elapsed since caching
      - Return cached value if still fresh
- [ ] 2.2.2.4 **Add cache hit logging (optional)**
      ```typescript
                console.log('Translation cache hit:', cacheKey);
      ```
      - Helps debug caching behavior
      - Remove in production if needed
- [ ] 2.2.2.5 **Verify cache logic complete**
      - Cache key generation works
      - Expiration calculation correct
      - Early return on cache hit

### Task 2.2.3: Build API Request Payload
- [ ] 2.2.3.1 **Create request body object**
      ```typescript
          const requestBody = {
            q: text,
            source: sourceLang,
            target: 'eo',  // Esperanto language code
            format: 'text',
          };
      ```
      - q = query text (LibreTranslate convention)
      - source = source language
      - target = always 'eo' for Esperanto
      - format = 'text' (not HTML)
- [ ] 2.2.3.2 **Add API key if configured**
      ```typescript
          if (this.config.apiKey) {
            requestBody.api_key = this.config.apiKey;
          }
      ```
      - Only add if using hosted LibreTranslate with auth
      - Free tier doesn't need key
- [ ] 2.2.3.3 **Verify request body structure**
      - All required fields present
      - Matches LibreTranslate API spec
      - Conditional API key works

### Task 2.2.4: Implement Fetch API Call with Timeout
- [ ] 2.2.4.1 **Create AbortController for timeout**
      ```typescript
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            this.config.timeout
          );
      ```
      - AbortController enables request cancellation
      - setTimeout triggers abort after timeout
- [ ] 2.2.4.2 **Implement try-catch block**
      ```typescript
          try {
      ```
- [ ] 2.2.4.3 **Make fetch request**
      ```typescript
            const response = await fetch(this.config.apiEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
              signal: controller.signal,
            });
      ```
      - POST method for translation
      - JSON content type
      - Stringify request body
      - signal for timeout abort
- [ ] 2.2.4.4 **Clear timeout on response**
      ```typescript
            clearTimeout(timeoutId);
      ```
      - Prevents abort after successful response
- [ ] 2.2.4.5 **Verify fetch implementation**
      - Correct HTTP method
      - Proper headers
      - Abort signal attached

### Task 2.2.5: Handle API Response
- [ ] 2.2.5.1 **Check response status**
      ```typescript
            if (!response.ok) {
              throw new Error(
                `API returned ${response.status}: ${response.statusText}`
              );
            }
      ```
      - response.ok is false for 4xx/5xx errors
      - Throw error with status code
- [ ] 2.2.5.2 **Parse JSON response**
      ```typescript
            const data = await response.json();
      ```
      - Assumes API returns JSON
- [ ] 2.2.5.3 **Extract translated text**
      ```typescript
            const translatedText = data.translatedText;
      ```
      - LibreTranslate returns translatedText field
- [ ] 2.2.5.4 **Validate response has translation**
      ```typescript
            if (!translatedText) {
              throw new Error('API response missing translatedText field');
            }
      ```
      - Ensures we got actual translation
- [ ] 2.2.5.5 **Save to cache**
      ```typescript
            if (this.config.cacheEnabled) {
              this.cache.set(cacheKey, {
                translatedText,
                timestamp: Date.now(),
                sourceLang: data.detectedLanguage?.language || sourceLang,
                targetLang: 'eo',
              });
            }
      ```
      - Store in cache for future use
      - Record current timestamp
- [ ] 2.2.5.6 **Return successful response**
      ```typescript
            return {
              translatedText,
              detectedLanguage: data.detectedLanguage?.language,
            };
      ```
      - Return TranslationResponse interface
- [ ] 2.2.5.7 **Verify response handling complete**
      - Status check works
      - JSON parsing safe
      - Cache update correct
      - Return type matches interface

### Task 2.2.6: Implement Error Handling
- [ ] 2.2.6.1 **Add catch block**
      ```typescript
          } catch (error) {
      ```
- [ ] 2.2.6.2 **Handle abort timeout**
      ```typescript
            if (error.name === 'AbortError') {
              throw {
                code: 'TIMEOUT',
                message: `Translation request timed out after ${this.config.timeout}ms`,
                originalError: error,
              } as TranslationError;
            }
      ```
      - Detect AbortController timeout
      - Provide clear timeout message
- [ ] 2.2.6.3 **Handle network errors**
      ```typescript
            if (error instanceof TypeError) {
              throw {
                code: 'NETWORK_ERROR',
                message: 'Network error - check internet connection',
                originalError: error,
              } as TranslationError;
            }
      ```
      - TypeError usually means network failure
- [ ] 2.2.6.4 **Handle generic errors**
      ```typescript
            throw {
              code: 'API_ERROR',
              message: error.message || 'Unknown translation error',
              originalError: error,
            } as TranslationError;
          }
      ```
      - Catch-all for other errors
      - Preserve original error for debugging
- [ ] 2.2.6.5 **Add finally block**
      ```typescript
          } finally {
            clearTimeout(timeoutId);
          }
      ```
      - Ensure timeout always cleared
      - Prevents memory leaks
- [ ] 2.2.6.6 **Close translate method**
      ```typescript
        }
      ```
- [ ] 2.2.6.7 **Verify error handling comprehensive**
      - Timeout handled
      - Network errors caught
      - Generic fallback exists
      - Cleanup in finally block

---

## STEP 2.3: Implement Batch Translation Support

**Step Objective**: Add method for translating multiple text segments efficiently

### Task 2.3.1: Create Batch Translation Method
- [ ] 2.3.1.1 **Add batchTranslate JSDoc**
      ```typescript
        /**
         * Translate multiple text segments
         * @param texts - Array of text strings to translate
         * @param sourceLang - Source language (default: 'auto')
         * @returns Array of translated texts in same order
         */
      ```
- [ ] 2.3.1.2 **Define batchTranslate method**
      ```typescript
        async batchTranslate(
          texts: string[],
          sourceLang: string = 'auto'
        ): Promise<string[]> {
      ```
      - Takes array of strings
      - Returns array of translations
- [ ] 2.3.1.3 **Validate input array**
      ```typescript
          if (!Array.isArray(texts) || texts.length === 0) {
            return [];
          }
      ```
      - Return empty array for invalid input
      - Prevents errors
- [ ] 2.3.1.4 **Filter out empty strings**
      ```typescript
          const validTexts = texts.filter(t => t && t.trim().length > 0);
      ```
      - Remove empty/whitespace-only items
- [ ] 2.3.1.5 **Verify method setup**
      - Signature correct
      - Input validation present

### Task 2.3.2: Implement Parallel Translation with Promise.all
- [ ] 2.3.2.1 **Create translation promises array**
      ```typescript
          const translationPromises = validTexts.map(text =>
            this.translate(text, sourceLang)
              .then(result => result.translatedText)
              .catch(error => {
                console.error('Batch translation error:', error);
                return text; // Return original on error
              })
          );
      ```
      - Map each text to translation promise
      - Extract translatedText from response
      - Fallback to original text on error
- [ ] 2.3.2.2 **Await all translations**
      ```typescript
          const results = await Promise.all(translationPromises);
          return results;
      ```
      - Wait for all translations to complete
      - Runs in parallel for speed
- [ ] 2.3.2.3 **Close method**
      ```typescript
        }
      ```
- [ ] 2.3.2.4 **Verify batch logic**
      - Parallel execution works
      - Error handling preserves original text
      - Array order maintained

### Task 2.3.3: Add Rate Limiting Helper (Optional but Recommended)
- [ ] 2.3.3.1 **Create delay utility function**
      ```typescript
        private delay(ms: number): Promise<void> {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
      ```
      - Simple promise-based delay
      - Useful for rate limiting
- [ ] 2.3.3.2 **Create rate-limited batch method**
      ```typescript
        /**
         * Batch translate with rate limiting
         * @param texts - Text array
         * @param sourceLang - Source language
         * @param delayMs - Delay between requests in milliseconds
         */
        async batchTranslateWithDelay(
          texts: string[],
          sourceLang: string = 'auto',
          delayMs: number = 100
        ): Promise<string[]> {
      ```
- [ ] 2.3.3.3 **Implement sequential translation with delay**
      ```typescript
          const results: string[] = [];

          for (const text of texts) {
            try {
              const result = await this.translate(text, sourceLang);
              results.push(result.translatedText);
              await this.delay(delayMs);
            } catch (error) {
              console.error('Rate-limited translation error:', error);
              results.push(text);
            }
          }

          return results;
        }
      ```
      - Translates one at a time
      - Adds delay between requests
      - Respects API rate limits
- [ ] 2.3.3.4 **Verify rate limiting works**
      - Delay function correct
      - Sequential execution with delays

---

## STEP 2.4: Implement Retry Logic and Error Recovery

**Step Objective**: Add automatic retry mechanism for failed translation requests

### Task 2.4.1: Create Retry Wrapper Method
- [ ] 2.4.1.1 **Add translateWithRetry JSDoc**
      ```typescript
        /**
         * Translate with automatic retry on failure
         * @param text - Text to translate
         * @param sourceLang - Source language
         * @param retryCount - Current retry attempt (internal)
         * @returns Translation response
         */
      ```
- [ ] 2.4.1.2 **Define translateWithRetry method**
      ```typescript
        private async translateWithRetry(
          text: string,
          sourceLang: string = 'auto',
          retryCount: number = 0
        ): Promise<TranslationResponse> {
      ```
      - Private method (internal use)
      - Tracks retry count
- [ ] 2.4.1.3 **Implement try-catch with retry**
      ```typescript
          try {
            return await this.translate(text, sourceLang);
          } catch (error) {
            if (retryCount < this.config.maxRetries) {
              console.log(`Retry ${retryCount + 1}/${this.config.maxRetries}`);
              await this.delay(1000 * (retryCount + 1)); // Exponential backoff
              return this.translateWithRetry(text, sourceLang, retryCount + 1);
            }
            throw error; // Max retries exceeded
          }
        }
      ```
      - Try translation
      - On failure, check retry count
      - Use exponential backoff (1s, 2s, 3s)
      - Recursive call with incremented count
      - Throw error if max retries reached
- [ ] 2.4.1.4 **Verify retry logic**
      - Exponential backoff implemented
      - Max retries respected
      - Error thrown after max retries

### Task 2.4.2: Update Public API to Use Retry
- [ ] 2.4.2.1 **Create new public translate method**
      ```typescript
        /**
         * Translate text (public API with retry)
         */
        async translateText(
          text: string,
          sourceLang: string = 'auto'
        ): Promise<TranslationResponse> {
          return this.translateWithRetry(text, sourceLang);
        }
      ```
      - Public method delegates to retry wrapper
      - Cleaner API for consumers
- [ ] 2.4.2.2 **Rename original translate to internal**
      - Change `async translate(` to `private async translateInternal(`
      - Update all internal calls to use translateInternal
- [ ] 2.4.2.3 **Update translateWithRetry to call translateInternal**
      ```typescript
          return await this.translateInternal(text, sourceLang);
      ```
- [ ] 2.4.2.4 **Verify public API separation**
      - translateText is public
      - translateInternal is private
      - Retry wrapper works correctly

---

## STEP 2.5: Add Utility Methods and Cache Management

**Step Objective**: Implement cache clearing, language detection, and service health check

### Task 2.5.1: Implement Cache Management Methods
- [ ] 2.5.1.1 **Create clearCache method**
      ```typescript
        /**
         * Clear all cached translations
         */
        clearCache(): void {
          this.cache.clear();
          console.log('Translation cache cleared');
        }
      ```
- [ ] 2.5.1.2 **Create getCacheSize method**
      ```typescript
        /**
         * Get number of cached translations
         */
        getCacheSize(): number {
          return this.cache.size;
        }
      ```
- [ ] 2.5.1.3 **Create getCacheStats method**
      ```typescript
        /**
         * Get cache statistics
         */
        getCacheStats(): {
          size: number;
          oldestEntry: number | null;
          newestEntry: number | null;
        } {
          if (this.cache.size === 0) {
            return { size: 0, oldestEntry: null, newestEntry: null };
          }

          const timestamps = Array.from(this.cache.values())
            .map(entry => entry.timestamp);

          return {
            size: this.cache.size,
            oldestEntry: Math.min(...timestamps),
            newestEntry: Math.max(...timestamps),
          };
        }
      ```
- [ ] 2.5.1.4 **Verify cache methods work**
      - clearCache empties Map
      - getCacheSize returns correct count
      - getCacheStats calculates timestamps

### Task 2.5.2: Implement Language Detection Method
- [ ] 2.5.2.1 **Create detectLanguage method**
      ```typescript
        /**
         * Detect language of given text
         * Uses LibreTranslate's detection endpoint
         */
        async detectLanguage(text: string): Promise<string> {
          const response = await fetch('https://libretranslate.com/detect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: text }),
          });

          if (!response.ok) {
            throw new Error('Language detection failed');
          }

          const data = await response.json();
          return data[0]?.language || 'unknown';
        }
      ```
- [ ] 2.5.2.2 **Add error handling**
      ```typescript
        async detectLanguage(text: string): Promise<string> {
          try {
            // ... fetch code ...
          } catch (error) {
            console.error('Language detection error:', error);
            return 'unknown';
          }
        }
      ```
- [ ] 2.5.2.3 **Verify detection works**
      - Correct endpoint used
      - Error handling present
      - Returns language code or 'unknown'

### Task 2.5.3: Create Service Health Check
- [ ] 2.5.3.1 **Implement checkHealth method**
      ```typescript
        /**
         * Check if translation API is accessible
         */
        async checkHealth(): Promise<boolean> {
          try {
            const response = await fetch(this.config.apiEndpoint, {
              method: 'HEAD',
              signal: AbortSignal.timeout(5000),
            });
            return response.ok;
          } catch {
            return false;
          }
        }
      ```
      - HEAD request for lightweight check
      - 5 second timeout
      - Returns true if API reachable
- [ ] 2.5.3.2 **Verify health check**
      - Quick timeout
      - Returns boolean
      - Doesn't throw errors

### Task 2.5.4: Export TranslationService Class
- [ ] 2.5.4.1 **Verify export statement**
      - Class has `export` keyword:
      ```typescript
      export class TranslationService {
      ```
- [ ] 2.5.4.2 **Add default export**
      ```typescript
      export default TranslationService;
      ```
      - Allows both named and default imports
- [ ] 2.5.4.3 **Close class**
      ```typescript
      }
      ```
      - Ensure closing brace present

### Task 2.5.5: Create Service Instance Export
- [ ] 2.5.5.1 **Create singleton instance**
      ```typescript
      /**
       * Default singleton instance
       */
      export const translationService = new TranslationService();
      ```
      - Shared instance across app
      - Uses default config
- [ ] 2.5.5.2 **Add usage comment**
      ```typescript
      /**
       * Usage:
       * import { translationService } from './services/TranslationService';
       * const result = await translationService.translateText('Hello');
       */
      ```
- [ ] 2.5.5.3 **Save file**
      - Press Ctrl+S

---

## STEP 2.6: Testing and Validation

**Step Objective**: Test translation service with manual tests and verify all methods work

### Task 2.6.1: Create Test File
- [ ] 2.6.1.1 **Create test directory** (if not exists)
      ```powershell
      New-Item -Path "src/services/__tests__" -ItemType Directory -Force
      ```
- [ ] 2.6.1.2 **Create test file**
      ```powershell
      New-Item -Path "src/services/__tests__/TranslationService.test.ts" -ItemType File
      ```
- [ ] 2.6.1.3 **Open test file**
      ```powershell
      code src/services/__tests__/TranslationService.test.ts
      ```

### Task 2.6.2: Write Basic Translation Tests
- [ ] 2.6.2.1 **Add test imports**
      ```typescript
      import { TranslationService } from '../TranslationService';
      ```
- [ ] 2.6.2.2 **Create test instance**
      ```typescript
      const service = new TranslationService();
      ```
- [ ] 2.6.2.3 **Test basic translation (manual)**
      ```typescript
      async function testBasicTranslation() {
        console.log('Testing basic translation...');
        const result = await service.translateText('Hello world');
        console.log('Result:', result);
        console.assert(result.translatedText.length > 0, 'Translation should not be empty');
      }
      ```
- [ ] 2.6.2.4 **Test empty text handling**
      ```typescript
      async function testEmptyText() {
        console.log('Testing empty text...');
        try {
          await service.translateText('');
          console.error('Should have thrown error');
        } catch (error) {
          console.log('Correctly threw error:', error.code);
        }
      }
      ```
- [ ] 2.6.2.5 **Test caching**
      ```typescript
      async function testCaching() {
        console.log('Testing cache...');
        service.clearCache();

        const text = 'Cache test';
        await service.translateText(text);
        console.log('Cache size after first call:', service.getCacheSize());

        await service.translateText(text);
        console.log('Cache size after second call:', service.getCacheSize());
        console.assert(service.getCacheSize() === 1, 'Should have 1 cached entry');
      }
      ```
- [ ] 2.6.2.6 **Create test runner**
      ```typescript
      async function runTests() {
        await testBasicTranslation();
        await testEmptyText();
        await testCaching();
        console.log('All tests passed!');
      }

      runTests().catch(console.error);
      ```
- [ ] 2.6.2.7 **Save test file**

### Task 2.6.3: Run Manual Tests
- [ ] 2.6.3.1 **Compile TypeScript**
      ```powershell
      npx tsc --noEmit
      ```
      - Check for compilation errors
- [ ] 2.6.3.2 **Add test script to package.json**
      ```json
      "scripts": {
        "test:translation": "tsx src/services/__tests__/TranslationService.test.ts"
      }
      ```
- [ ] 2.6.3.3 **Install tsx if needed**
      ```powershell
      npm install --save-dev tsx
      ```
      - TypeScript executor for Node
- [ ] 2.6.3.4 **Run tests**
      ```powershell
      npm run test:translation
      ```
- [ ] 2.6.3.5 **Verify test output**
      - Basic translation returns Esperanto text
      - Empty text throws EMPTY_TEXT error
      - Cache size increases correctly
- [ ] 2.6.3.6 **Check for errors**
      - No unhandled promise rejections
      - All assertions pass

### Task 2.6.4: Test Batch Translation
- [ ] 2.6.4.1 **Add batch test to test file**
      ```typescript
      async function testBatchTranslation() {
        console.log('Testing batch translation...');
        const texts = ['Hello', 'Goodbye', 'Thank you'];
        const results = await service.batchTranslate(texts);

        console.log('Batch results:', results);
        console.assert(results.length === 3, 'Should have 3 results');
        console.assert(results.every(r => r.length > 0), 'All results should have content');
      }
      ```
- [ ] 2.6.4.2 **Add to test runner**
      ```typescript
      await testBatchTranslation();
      ```
- [ ] 2.6.4.3 **Run tests again**
      ```powershell
      npm run test:translation
      ```
- [ ] 2.6.4.4 **Verify batch works**
      - Returns 3 translations
      - All in Esperanto

### Task 2.6.5: Final Validation Checklist
- [ ] 2.6.5.1 **Verify all methods implemented**:
      - [ ] translateText() - public translation method
      - [ ] batchTranslate() - parallel batch translation
      - [ ] batchTranslateWithDelay() - rate-limited batch
      - [ ] clearCache() - cache management
      - [ ] getCacheSize() - cache stats
      - [ ] getCacheStats() - detailed stats
      - [ ] detectLanguage() - language detection
      - [ ] checkHealth() - API health check
- [ ] 2.6.5.2 **Verify all interfaces defined**:
      - [ ] TranslationRequest
      - [ ] TranslationResponse
      - [ ] TranslationError
      - [ ] CacheEntry
      - [ ] TranslationConfig
- [ ] 2.6.5.3 **Check TypeScript compilation**
      ```powershell
      npx tsc --noEmit
      ```
      - Should complete with no errors
- [ ] 2.6.5.4 **Verify exports**
      - Class is exported
      - Singleton instance exported
      - Can import in other files
- [ ] 2.6.5.5 **Test error handling**
      - Empty text throws error
      - Network errors caught
      - Timeout errors handled
- [ ] 2.6.5.6 **Document API usage**
      - Add README section on translation service
      - Document method signatures
      - Provide code examples
- [ ] 2.6.5.7 **Git commit (if using version control)**
      ```powershell
      git add src/services/
      git commit -m "feat: implement translation service with LibreTranslate API"
      ```
- [ ] 2.6.5.8 **Ready for Phase 3**
      - ✅ ALL PHASE 2 TASKS COMPLETE (55/55)
      - Translation service fully functional
      - Can proceed to background worker integration

---

## 📊 PHASE 2 PROGRESS TRACKING

**Overall Completion**: 0/55 tasks (0%)

### Step Breakdown:
- [ ] Step 2.1: Service Structure (15 tasks, 0%)
- [ ] Step 2.2: Core Translation (20 tasks, 0%)
- [ ] Step 2.3: Batch Translation (8 tasks, 0%)
- [ ] Step 2.4: Retry Logic (4 tasks, 0%)
- [ ] Step 2.5: Utilities (13 tasks, 0%)
- [ ] Step 2.6: Testing (15 tasks, 0%)

---

**Next File**: PHASE-03-BACKGROUND-SERVICE-WORKER.instructions.md
