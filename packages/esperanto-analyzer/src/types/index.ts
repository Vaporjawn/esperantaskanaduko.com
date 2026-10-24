/**
 * Parts of speech in Esperanto
 */
export type PartOfSpeech =
  | 'Noun' // Substantivo (dog-o, kat-o)
  | 'Verb' // Verbo (est-as, kur-i)
  | 'Adjective' // Adjektivo (bel-a, grand-a)
  | 'Adverb' // Adverbo (rapid-e, nun)
  | 'Pronoun' // Pronomo (mi, vi, kiu)
  | 'Preposition' // Prepozicio (en, sur, de)
  | 'Conjunction' // Konjunkcio (kaj, sed, ĉar)
  | 'Interjection' // Interjekcio (ho!, ĝis!)
  | 'Article' // Artikolo (la)
  | 'Numeral' // Numeralo (unu, du, tri)
  | 'Unknown' // Unknown/unrecognized words
  | 'Undefined'; // Undefined/error state

/**
 * Represents the result of morphological analysis for a single word
 */
export interface AnalysisResult {
  /** The word that was analyzed */
  readonly word: string;
  /** The part of speech identified for this word */
  readonly partOfSpeech: PartOfSpeech;
  /** Additional morphological information (e.g., plural, accusative) */
  morphology?: MorphologicalFeatures | undefined;
  /** The word instance (for compatibility) */
  readonly wordInstance: unknown;
  /** Analysis confidence score (0-1) */
  confidence?: number | undefined;
  /** Alternative analyses for ambiguous words */
  readonly alternatives?: readonly AnalysisResult[];
  /** The analyzer that was used for this result */
  analyzer?: string | undefined;
}

/**
 * Morphological features that can be identified in Esperanto words
 */
export interface MorphologicalFeatures {
  /** Whether the word is in plural form */
  readonly isPlural: boolean;
  /** Whether the word is in accusative case */
  readonly isAccusative: boolean;
  /** For verbs: tense information */
  readonly tense?: VerbTense;
  /** For verbs: mood information */
  readonly mood?: VerbMood;
  /** For pronouns: whether it's possessive */
  readonly isPossessive?: boolean;
  /** For adjectives/pronouns: agreement markers */
  readonly agreement?: AgreementMarkers;
  /** The root of the word */
  readonly root?: string;
}

/**
 * Verb tenses in Esperanto
 */
export type VerbTense =
  | 'present'
  | 'past'
  | 'future'
  | 'conditional'
  | 'infinitive';

/**
 * Verb moods in Esperanto
 */
export type VerbMood =
  | 'indicative'
  | 'imperative'
  | 'conditional'
  | 'infinitive'
  | 'participle';

/**
 * Agreement markers for adjectives and pronouns
 */
export interface AgreementMarkers {
  /** Plural agreement */
  readonly plural: boolean;
  /** Accusative agreement */
  readonly accusative: boolean;
}

/**
 * Simple analysis result format (compatible with Python version)
 */
export type SimpleResult = [string, PartOfSpeech];

/**
 * Configuration options for morphological analysis
 */
export interface AnalysisOptions {
  /** Whether to include detailed morphological features */
  readonly includeFeatures?: boolean;
  /** Whether to use strict mode (only exact matches) */
  readonly strictMode?: boolean;
  /** Custom analyzers to use (if not provided, uses default set) */
  readonly customAnalyzers?: readonly string[];
  /** Whether to enable performance optimizations */
  readonly optimized?: boolean;
}

/**
 * Interface for morphological analyzers
 */
export interface MorphologicalAnalyzer {
  /** The name of this analyzer */
  readonly name: string;
  /** The part of speech this analyzer identifies */
  readonly partOfSpeech: PartOfSpeech;
  /** Check if a word matches this analyzer's pattern */
  match(word: string): boolean;
  /** Analyze a word and return detailed results */
  analyze(word: string, options?: AnalysisOptions): AnalysisResult | null;
  /** Extract morphological features from a word */
  extractMorphology(
    word: string,
    options?: AnalysisOptions
  ): MorphologicalFeatures;
}

/**
 * Error types that can occur during analysis
 */
export class EsperantoAnalysisError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly word?: string
  ) {
    super(message);
    this.name = 'EsperantoAnalysisError';
  }
}

/**
 * Validation error for invalid input
 */
export class ValidationError extends EsperantoAnalysisError {
  constructor(message: string, word?: string) {
    super(message, 'VALIDATION_ERROR', word);
    this.name = 'ValidationError';
  }
}

/**
 * Performance metrics for analysis operations
 */
export interface PerformanceMetrics {
  /** Total analysis time in milliseconds */
  readonly totalTime: number;
  /** Number of words analyzed */
  readonly wordCount: number;
  /** Average time per word in milliseconds */
  readonly averageTimePerWord: number;
  /** Number of successful analyses */
  readonly successCount: number;
  /** Number of failed analyses */
  readonly failureCount: number;
}
