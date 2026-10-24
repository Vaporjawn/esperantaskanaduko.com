/**
 * Game configuration constants
 */

export const GAME_CONFIG = {
  /** Maximum number of wrong guesses allowed */
  MAX_MISTAKES: 6,
  /** Whether hints are allowed in the game */
  ALLOW_HINTS: false,
} as const;

/**
 * LocalStorage keys for persisting game data
 */
export const STORAGE_KEYS = {
  /** Key for storing game statistics */
  STATS: 'ehm-stats',
  /** Key for storing game settings */
  SETTINGS: 'ehm-settings',
} as const;

/**
 * Fallback words used when JSON fails to load
 */
export const FALLBACK_WORDS = [
  'hundo',
  'kato',
  'domo',
  'libro',
  'akvo',
  'pano',
  'sunos',
  'nokto',
  'amiko',
  'varma',
] as const;

/**
 * Keyboard layout rows for Esperanto alphabet
 */
export const KEYBOARD_ROWS = [
  ['a', 'b', 'c', 'ĉ', 'd', 'e', 'f', 'g', 'ĝ', 'h'],
  ['ĥ', 'i', 'j', 'ĵ', 'k', 'l', 'm', 'n', 'o', 'p'],
  ['r', 's', 'ŝ', 't', 'u', 'ŭ', 'v', 'z'],
] as const;

/**
 * SVG dimensions for hangman figure
 */
export const HANGMAN_SVG = {
  WIDTH: 200,
  HEIGHT: 250,
  MIN_HEIGHT: 300,
} as const;
