import type {
  AnalysisResult,
  AnalysisOptions,
  MorphologicalAnalyzer,
  PartOfSpeech,
  MorphologicalFeatures,
} from '../../types';
import { createWord } from '../../speech';

/**
 * Abstract base class for all morphological analyzers
 */
export abstract class BaseMorphologicalAnalyzer
  implements MorphologicalAnalyzer
{
  /** Regular expression pattern for matching words */
  protected abstract readonly matchRegex: RegExp;

  /** The name of this analyzer */
  public abstract readonly name: string;

  /** The part of speech this analyzer identifies */
  public abstract readonly partOfSpeech: PartOfSpeech;

  /**
   * Check if a word matches this analyzer's pattern
   */
  match(word: string): boolean {
    return this.matchRegex.test(word);
  }

  /**
   * Analyze a word and return detailed results
   */
  analyze(
    word: string,
    options: AnalysisOptions = this.getDefaultOptions()
  ): AnalysisResult | null {
    if (!this.match(word)) {
      return null;
    }

    try {
      const morphology = this.extractMorphology(word, options);
      const wordInstance = this.createWordInstance(word);

      return {
        word,
        partOfSpeech: this.partOfSpeech,
        morphology,
        wordInstance,
        confidence: 1,
        alternatives: [],
        analyzer: this.name,
      };
    } catch (error) {
      return {
        word,
        partOfSpeech: 'Undefined',
        morphology: this.getEmptyMorphology(),
        wordInstance: null,
        confidence: 0,
        alternatives: [],
        analyzer: this.name,
      };
    }
  }

  /**
   * Extract morphological features from a word
   * Subclasses should override this method for specific analysis
   */
  extractMorphology(
    word: string,
    options: AnalysisOptions = {}
  ): MorphologicalFeatures {
    const features = this.getEmptyMorphology();

    if (options && !options.includeFeatures) {
      return features;
    }

    // Basic morphological analysis common to most Esperanto words
    const isPlural = this.checkPlural(word);
    const isAccusative = this.checkAccusative(word);

    return {
      ...features,
      isPlural,
      isAccusative,
    };
  }

  /**
   * Check if a word is in plural form (ends with 'j' before case endings)
   */
  protected checkPlural(word: string): boolean {
    // Remove accusative ending if present
    const baseWord = word.endsWith('n') ? word.slice(0, -1) : word;
    return baseWord.endsWith('j');
  }

  /**
   * Check if a word is in accusative case (ends with 'n')
   */
  protected checkAccusative(word: string): boolean {
    return word.endsWith('n');
  }

  /**
   * Get default analysis options
   */
  protected getDefaultOptions(): AnalysisOptions {
    return {
      includeFeatures: true,
      strictMode: false,
      optimized: true,
    };
  }

  /**
   * Get empty morphological features object
   */
  protected getEmptyMorphology(): MorphologicalFeatures {
    return {
      isPlural: false,
      isAccusative: false,
    };
  }

  /**
   * Create a Word instance for this part of speech
   */
  protected createWordInstance(value: string) {
    return createWord(value, this.partOfSpeech);
  }

  /**
   * Validate input word
   */
  protected validateWord(word: string): void {
    if (!word || typeof word !== 'string') {
      throw new Error('Word must be a non-empty string');
    }

    if (word.trim() !== word) {
      throw new Error('Word cannot contain leading or trailing whitespace');
    }

    if (!/^[a-zA-ZĉĝĵĥŝŭĈĜĴĤŜŬ]+$/.test(word)) {
      throw new Error('Word contains invalid characters');
    }
  }

  /**
   * Normalize word case for analysis
   */
  protected normalizeWord(word: string): string {
    return word.toLowerCase();
  }
}
