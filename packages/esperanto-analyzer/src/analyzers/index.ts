/**
 * Esperanto Morphological Analyzers
 *
 * This module provides comprehensive morphological analysis for Esperanto text.
 * It includes individual analyzers for each part of speech as well as
 * coordinating analyzers for words and sentences.
 */

// Individual morphological analyzers
export * from './morphological';

// Main analyzer classes
export { MorphologicalAnalyzer } from './morphological-analyzer';
export {
  MorphologicalSentenceAnalyzer,
  type SentenceAnalysisOptions,
  type SentenceAnalysisResult,
} from './morphological-sentence-analyzer';

// Convenience exports for common use cases
export { ALL_MORPHOLOGICAL_ANALYZERS } from './morphological';
export type {
  MorphologicalAnalyzerClass,
  MorphologicalAnalyzerInstance,
} from './morphological';
