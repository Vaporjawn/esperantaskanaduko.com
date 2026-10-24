/**
 * Esperanto Analyzer
 *
 * A comprehensive TypeScript library for morphological analysis of Esperanto text.
 * This library provides tools to analyze individual words, sentences, and larger texts,
 * identifying parts of speech, morphological features, and grammatical structures.
 *
 * @version 2.0.0
 * @author GitHub Copilot (Modernized from original Python implementation)
 * @license MIT
 */

// Core types
export type * from './types';

// Speech part classes
export * from './speech';

// All analyzer classes and functionality
export * from './analyzers';

// Convenience exports for most common use cases
export { MorphologicalAnalyzer } from './analyzers/morphological-analyzer';
export { MorphologicalSentenceAnalyzer } from './analyzers/morphological-sentence-analyzer';

// Quick analysis functions for simple use cases
import { MorphologicalAnalyzer } from './analyzers/morphological-analyzer';
import { MorphologicalSentenceAnalyzer } from './analyzers/morphological-sentence-analyzer';
import type { AnalysisResult } from './types';
import type { SentenceAnalysisResult } from './analyzers/morphological-sentence-analyzer';

// Global analyzer instances for convenience functions
let _wordAnalyzer: MorphologicalAnalyzer | null = null;
let _sentenceAnalyzer: MorphologicalSentenceAnalyzer | null = null;

/**
 * Get or create the global word analyzer instance
 */
function getWordAnalyzer(): MorphologicalAnalyzer {
  if (!_wordAnalyzer) {
    _wordAnalyzer = new MorphologicalAnalyzer();
  }
  return _wordAnalyzer;
}

/**
 * Get or create the global sentence analyzer instance
 */
function getSentenceAnalyzer(): MorphologicalSentenceAnalyzer {
  if (!_sentenceAnalyzer) {
    _sentenceAnalyzer = new MorphologicalSentenceAnalyzer();
  }
  return _sentenceAnalyzer;
}

/**
 * Analyze a single Esperanto word
 *
 * @param word - The word to analyze
 * @returns Analysis result with part of speech, morphology, and confidence
 *
 * @example
 * ```typescript
 * import { analyzeWord } from 'esperanto-analyzer';
 *
 * const result = analyzeWord('knaboj');
 * console.log(result.partOfSpeech); // 'Noun'
 * console.log(result.morphology.isPlural); // true
 * ```
 */
export function analyzeWord(word: string): AnalysisResult {
  return getWordAnalyzer().analyze(word);
}

/**
 * Analyze an Esperanto sentence
 *
 * @param sentence - The sentence to analyze
 * @returns Analysis result with word-by-word breakdown and statistics
 *
 * @example
 * ```typescript
 * import { analyzeSentence } from 'esperanto-analyzer';
 *
 * const result = analyzeSentence('Mi amas la belan hundon.');
 * console.log(result.statistics.totalWords); // 5
 * console.log(result.words[0].partOfSpeech); // 'Pronoun'
 * ```
 */
export function analyzeSentence(sentence: string): SentenceAnalysisResult {
  return getSentenceAnalyzer().analyzeSentence(sentence);
}

/**
 * Check if a word is valid Esperanto
 *
 * @param word - The word to check
 * @returns true if the word can be analyzed as Esperanto
 *
 * @example
 * ```typescript
 * import { isEsperantoWord } from 'esperanto-analyzer';
 *
 * console.log(isEsperantoWord('domo')); // true
 * console.log(isEsperantoWord('house')); // false
 * ```
 */
export function isEsperantoWord(word: string): boolean {
  return getWordAnalyzer().canAnalyze(word);
}

/**
 * Check if a sentence is valid Esperanto
 *
 * @param sentence - The sentence to check
 * @param threshold - Minimum percentage of words that must be analyzable (default: 0.8)
 * @returns true if the sentence meets the threshold
 *
 * @example
 * ```typescript
 * import { isEsperantoSentence } from 'esperanto-analyzer';
 *
 * console.log(isEsperantoSentence('Mi estas feliĉa.')); // true
 * console.log(isEsperantoSentence('I am happy.')); // false
 * ```
 */
export function isEsperantoSentence(
  sentence: string,
  threshold: number = 0.8
): boolean {
  return getSentenceAnalyzer().isValidEsperanto(sentence, threshold);
}

/**
 * Get all possible analyses for a word (handles ambiguous cases)
 *
 * @param word - The word to analyze
 * @returns Array of all possible analysis results
 *
 * @example
 * ```typescript
 * import { analyzeWordAll } from 'esperanto-analyzer';
 *
 * const results = analyzeWordAll('bela');
 * // May return multiple results if the word could be different parts of speech
 * ```
 */
export function analyzeWordAll(word: string): AnalysisResult[] {
  return getWordAnalyzer().analyzeAll(word);
}

/**
 * Get a summary of parts of speech in a sentence
 *
 * @param sentence - The sentence to analyze
 * @returns Object with counts of each part of speech
 *
 * @example
 * ```typescript
 * import { getPartOfSpeechSummary } from 'esperanto-analyzer';
 *
 * const summary = getPartOfSpeechSummary('Mi amas la belan hundon.');
 * console.log(summary); // { Pronoun: 1, Verb: 1, Article: 1, Adjective: 1, Noun: 1 }
 * ```
 */
export function getPartOfSpeechSummary(
  sentence: string
): Record<string, number> {
  return getSentenceAnalyzer().getSummary(sentence);
}

/**
 * Library version and metadata
 */
export const VERSION = '2.0.0';
export const LIBRARY_NAME = 'esperanto-analyzer';
export const SUPPORTED_LANGUAGE = 'Esperanto';

/**
 * Default export for CommonJS compatibility
 */
export default {
  analyzeWord,
  analyzeSentence,
  isEsperantoWord,
  isEsperantoSentence,
  analyzeWordAll,
  getPartOfSpeechSummary,
  MorphologicalAnalyzer,
  MorphologicalSentenceAnalyzer,
  VERSION,
  LIBRARY_NAME,
  SUPPORTED_LANGUAGE,
};
