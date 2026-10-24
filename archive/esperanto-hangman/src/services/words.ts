import wordsData from '../data/words-eo.json';
import { toNFC } from '../utils/eo';
import { FALLBACK_WORDS } from '../constants/game';

/**
 * Validate and load words from JSON data
 * @returns Array of normalized Esperanto words
 */
const loadWords = (): string[] => {
  const words = Array.isArray(wordsData) && wordsData.length > 0 ? wordsData : [...FALLBACK_WORDS];

  // Normalize all words to NFC form for consistent diacritic handling
  return words.map(word => toNFC(word));
};

/**
 * Cached word list for efficient access
 */
const WORD_LIST = loadWords();

/**
 * Pick a random word from the word list
 * @returns A random normalized Esperanto word
 */
export const pickRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex];
};

/**
 * Get the total number of available words
 * @returns Number of words in the word list
 */
export const getWordCount = (): number => {
  return WORD_LIST.length;
};

/**
 * Check if a word exists in the word list
 * @param word - Word to check
 * @returns True if the word exists in the list
 */
export const isValidWord = (word: string): boolean => {
  return WORD_LIST.includes(toNFC(word));
};
