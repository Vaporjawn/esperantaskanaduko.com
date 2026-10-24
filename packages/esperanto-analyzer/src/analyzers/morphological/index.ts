/**
 * Morphological Analyzers for Esperanto
 *
 * This module exports all the morphological analyzers for different parts of speech in Esperanto.
 * Each analyzer implements the BaseMorphologicalAnalyzer interface and provides specialized
 * pattern matching and analysis for their respective part of speech.
 */

export { BaseMorphologicalAnalyzer } from './base';

// Part of Speech Analyzers
export { NounMorphologicalAnalyzer } from './noun';
export { VerbMorphologicalAnalyzer } from './verb';
export { AdjectiveMorphologicalAnalyzer } from './adjective';
export { AdverbMorphologicalAnalyzer } from './adverb';
export { ArticleMorphologicalAnalyzer } from './article';
export { ConjunctionMorphologicalAnalyzer } from './conjunction';
export { InterjectionMorphologicalAnalyzer } from './interjection';
export { NumeralMorphologicalAnalyzer } from './numeral';
export { PrepositionMorphologicalAnalyzer } from './preposition';
export { PronounMorphologicalAnalyzer } from './pronoun';

// Import for array creation
import { NounMorphologicalAnalyzer } from './noun';
import { VerbMorphologicalAnalyzer } from './verb';
import { AdjectiveMorphologicalAnalyzer } from './adjective';
import { AdverbMorphologicalAnalyzer } from './adverb';
import { ArticleMorphologicalAnalyzer } from './article';
import { ConjunctionMorphologicalAnalyzer } from './conjunction';
import { InterjectionMorphologicalAnalyzer } from './interjection';
import { NumeralMorphologicalAnalyzer } from './numeral';
import { PrepositionMorphologicalAnalyzer } from './preposition';
import { PronounMorphologicalAnalyzer } from './pronoun';

// Analyzer array for iteration
export const ALL_MORPHOLOGICAL_ANALYZERS = [
  NounMorphologicalAnalyzer,
  VerbMorphologicalAnalyzer,
  AdjectiveMorphologicalAnalyzer,
  AdverbMorphologicalAnalyzer,
  ArticleMorphologicalAnalyzer,
  ConjunctionMorphologicalAnalyzer,
  InterjectionMorphologicalAnalyzer,
  NumeralMorphologicalAnalyzer,
  PrepositionMorphologicalAnalyzer,
  PronounMorphologicalAnalyzer,
] as const;

/**
 * Type representing all available morphological analyzer classes
 */
export type MorphologicalAnalyzerClass =
  (typeof ALL_MORPHOLOGICAL_ANALYZERS)[number];

/**
 * Type representing instances of morphological analyzers
 */
export type MorphologicalAnalyzerInstance =
  InstanceType<MorphologicalAnalyzerClass>;
