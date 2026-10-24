/**
 * Esperanto language utilities for hangman game
 * Provides functions for handling Esperanto alphabet and x-notation
 */

/**
 * Complete Esperanto alphabet (28 letters)
 * Includes 6 special diacritical letters: ĉ, ĝ, ĥ, ĵ, ŝ, ŭ
 */
export const EO_LETTERS = [
  'a',
  'b',
  'c',
  'ĉ',
  'd',
  'e',
  'f',
  'g',
  'ĝ',
  'h',
  'ĥ',
  'i',
  'j',
  'ĵ',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'r',
  's',
  'ŝ',
  't',
  'u',
  'ŭ',
  'v',
  'z',
] as const;

/**
 * Type representing valid Esperanto letters
 */
export type EsperantoLetter = (typeof EO_LETTERS)[number];

/**
 * Normalize string to NFC form to ensure diacritics are stable
 * This is critical for consistent comparison of Esperanto characters
 *
 * @param str - String to normalize
 * @returns Normalized string in NFC form
 */
export const toNFC = (str: string): string => str.normalize('NFC');

/**
 * Check if a character is a valid Esperanto letter
 *
 * @param char - Character to check
 * @returns True if the character is a valid Esperanto letter
 */
export const isEoLetter = (char: string): boolean => {
  const normalized = toNFC(char);
  return EO_LETTERS.includes(normalized as EsperantoLetter);
};

/**
 * X-notation mapping for Esperanto diacritical letters
 * Maps base letter + 'x' to the corresponding diacritic
 * cx → ĉ, gx → ĝ, hx → ĥ, jx → ĵ, sx → ŝ, ux → ŭ
 */
const X_NOTATION_MAP: Record<string, string> = {
  c: 'ĉ',
  g: 'ĝ',
  h: 'ĥ',
  j: 'ĵ',
  s: 'ŝ',
  u: 'ŭ',
} as const;

/**
 * Convert x-notation to diacritic character
 * Returns the diacritic if prev+next forms valid x-notation, else null
 *
 * @param prev - Previous character (base letter)
 * @param next - Next character (should be 'x')
 * @returns Diacritic character if valid x-notation, otherwise null
 *
 * @example
 * fromXNotation('c', 'x') // returns 'ĉ'
 * fromXNotation('s', 'x') // returns 'ŝ'
 * fromXNotation('a', 'x') // returns null
 */
export function fromXNotation(prev: string, next: string): string | null {
  const prevLower = prev.toLowerCase();
  const nextLower = next.toLowerCase();

  if (nextLower !== 'x') {
    return null;
  }

  return X_NOTATION_MAP[prevLower] ?? null;
}

/**
 * Get set of unique letters in a word
 * Normalizes the word to NFC form before extracting letters
 *
 * @param word - Word to analyze
 * @returns Set of unique letters in the word
 *
 * @example
 * uniqueLetters('hundo') // returns Set(['h', 'u', 'n', 'd', 'o'])
 * uniqueLetters('bonan') // returns Set(['b', 'o', 'n', 'a'])
 */
export const uniqueLetters = (word: string): Set<string> => {
  return new Set([...toNFC(word)]);
};

/**
 * Check if all letters in a word have been guessed
 *
 * @param word - The secret word
 * @param guessedLetters - Set of letters that have been guessed
 * @returns True if all unique letters in the word have been guessed
 */
export const isWordComplete = (word: string, guessedLetters: Set<string>): boolean => {
  const wordLetters = uniqueLetters(word);
  return [...wordLetters].every(letter => guessedLetters.has(letter));
};
