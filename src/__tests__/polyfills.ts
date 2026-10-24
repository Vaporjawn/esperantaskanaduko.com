/**
 * Runs before every test file (jest `setupFiles`).
 *
 * react-router 7 reads TextEncoder at import time, but jest's jsdom environment
 * does not expose Node's implementation, so any suite importing react-router-dom
 * would fail with "TextEncoder is not defined".
 */
import { TextDecoder, TextEncoder } from 'util';

Object.assign(globalThis, { TextEncoder, TextDecoder });
