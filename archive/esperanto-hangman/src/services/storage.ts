import type { GameStats, GameSettings } from '../types';
import { STORAGE_KEYS, GAME_CONFIG } from '../constants/game';

/**
 * Default game statistics
 */
const DEFAULT_STATS: GameStats = {
  games: 0,
  wins: 0,
  streak: 0,
};

/**
 * Default game settings
 */
const DEFAULT_SETTINGS: GameSettings = {
  maxMistakes: GAME_CONFIG.MAX_MISTAKES,
  allowHints: GAME_CONFIG.ALLOW_HINTS,
};

/**
 * Load stats from localStorage with error handling
 * @returns GameStats object or default stats if loading fails
 */
export const loadStats = (): GameStats => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        games: parsed.games ?? DEFAULT_STATS.games,
        wins: parsed.wins ?? DEFAULT_STATS.wins,
        streak: parsed.streak ?? DEFAULT_STATS.streak,
      };
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
  return { ...DEFAULT_STATS };
};

/**
 * Save stats to localStorage with error handling
 * @param stats - GameStats object to save
 */
export const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
};

/**
 * Load settings from localStorage with error handling
 * @returns GameSettings object or default settings if loading fails
 */
export const loadSettings = (): GameSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        maxMistakes: parsed.maxMistakes ?? DEFAULT_SETTINGS.maxMistakes,
        allowHints: parsed.allowHints ?? DEFAULT_SETTINGS.allowHints,
      };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return { ...DEFAULT_SETTINGS };
};

/**
 * Save settings to localStorage with error handling
 * @param settings - GameSettings object to save
 */
export const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

/**
 * Clear all stored data (useful for testing or reset)
 */
export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
};
