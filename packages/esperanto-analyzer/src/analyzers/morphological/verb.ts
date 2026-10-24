import type {
  PartOfSpeech,
  MorphologicalFeatures,
  VerbTense,
  VerbMood,
  AnalysisOptions,
} from '../../types';
import { BaseMorphologicalAnalyzer } from './base';

/**
 * Morphological analyzer for Esperanto verbs
 *
 * Esperanto verbs have complex morphology:
 * - Infinitive: -i (esti, havi, fari)
 * - Present: -as (estas, havas, faras)
 * - Past: -is (estis, havis, faris)
 * - Future: -os (estos, havos, faros)
 * - Conditional: -us (estus, havus, farus)
 * - Imperative: -u (estu, havu, faru)
 * - Participles: -ant-, -int-, -ont- + a/e endings
 */
export class VerbMorphologicalAnalyzer extends BaseMorphologicalAnalyzer {
  public readonly name = 'VerbMorphologicalAnalyzer';
  public readonly partOfSpeech: PartOfSpeech = 'Verb';

  /**
   * Verb endings for different tenses and moods
   */
  private static readonly VERB_ENDINGS = [
    'i', // infinitive
    'as', // present indicative
    'is', // past indicative
    'os', // future indicative
    'us', // conditional
    'u', // imperative
  ];

  /**
   * Participle endings that can take accusative and plural
   */
  private static readonly PARTICIPLE_ENDINGS = [
    'anta',
    'ante',
    'antaj',
    'antajn',
    'antan', // present active participle
    'inta',
    'inte',
    'intaj',
    'intajn',
    'intan', // past active participle
    'onta',
    'onte',
    'ontaj',
    'ontajn',
    'ontan', // future active participle
    'ata',
    'ate',
    'ataj',
    'atajn',
    'atan', // present passive participle
    'ita',
    'ite',
    'itaj',
    'itajn',
    'itan', // past passive participle
    'ota',
    'ote',
    'otaj',
    'otajn',
    'otan', // future passive participle
  ];

  /**
   * All possible verb endings combined
   */
  private static readonly ALL_ENDINGS = [
    ...VerbMorphologicalAnalyzer.VERB_ENDINGS,
    ...VerbMorphologicalAnalyzer.PARTICIPLE_ENDINGS,
  ];

  /**
   * Complex regex pattern for Esperanto verbs
   * Matches root + verb endings OR root + participle endings
   */
  protected readonly matchRegex = new RegExp(
    `^[a-zA-ZĉĝĵĥŝŭĈĜĴĤŜŬ]{2,}(${VerbMorphologicalAnalyzer.ALL_ENDINGS.join('|')})$`,
    'u'
  );

  /**
   * Enhanced morphological analysis for verbs
   */
  public override extractMorphology(
    word: string,
    options: AnalysisOptions
  ): MorphologicalFeatures {
    const baseMorphology = super.extractMorphology(word, options);

    if (!this.match(word)) {
      throw new Error('Word does not match verb pattern');
    }

    const tense = this.extractTense(word);
    const mood = this.extractMood(word);
    const root = this.extractRoot(word);

    return {
      ...baseMorphology,
      tense,
      mood,
      root,
    };
  }

  /**
   * Extract tense information from verb
   */
  private extractTense(word: string): VerbTense {
    const normalizedWord = word.toLowerCase();

    // Check for infinitive
    if (normalizedWord.endsWith('i')) {
      return 'infinitive';
    }

    // Check for conditional
    if (normalizedWord.endsWith('us')) {
      return 'conditional';
    }

    // Check for indicative tenses
    if (
      normalizedWord.endsWith('as') ||
      this.isParticiple(normalizedWord, 'ant')
    ) {
      return 'present';
    }

    if (
      normalizedWord.endsWith('is') ||
      this.isParticiple(normalizedWord, 'int')
    ) {
      return 'past';
    }

    if (
      normalizedWord.endsWith('os') ||
      this.isParticiple(normalizedWord, 'ont')
    ) {
      return 'future';
    }

    // Default fallback
    return 'present';
  }

  /**
   * Extract mood information from verb
   */
  private extractMood(word: string): VerbMood {
    const normalizedWord = word.toLowerCase();

    // Check for infinitive mood
    if (normalizedWord.endsWith('i')) {
      return 'infinitive';
    }

    // Check for conditional mood
    if (normalizedWord.endsWith('us')) {
      return 'conditional';
    }

    // Check for imperative mood
    if (normalizedWord.endsWith('u')) {
      return 'imperative';
    }

    // Check for participle mood
    if (this.isParticiple(normalizedWord)) {
      return 'participle';
    }

    // Default to indicative mood (for -as, -is, -os endings)
    return 'indicative';
  }

  /**
   * Check if word is a participle
   */
  private isParticiple(word: string, tenseMarker?: string): boolean {
    const participlePatterns = tenseMarker
      ? [
          `${tenseMarker}a`,
          `${tenseMarker}e`,
          `${tenseMarker}aj`,
          `${tenseMarker}ajn`,
          `${tenseMarker}an`,
        ]
      : VerbMorphologicalAnalyzer.PARTICIPLE_ENDINGS;

    return participlePatterns.some((pattern) => word.endsWith(pattern));
  }

  /**
   * Extract the root of the verb by removing morphological endings
   */
  private extractRoot(word: string): string {
    const normalizedWord = word.toLowerCase();

    // Try to match each possible ending and remove it
    for (const ending of VerbMorphologicalAnalyzer.ALL_ENDINGS) {
      if (normalizedWord.endsWith(ending)) {
        return normalizedWord.slice(0, -ending.length);
      }
    }

    // If no ending matches, return the word as-is (shouldn't happen if regex matched)
    return normalizedWord;
  }

  /**
   * Check for plural in participles
   */
  protected override checkPlural(word: string): boolean {
    const normalizedWord = word.toLowerCase();

    // For participles, check if it ends with 'aj' or 'ajn'
    if (this.isParticiple(normalizedWord)) {
      return normalizedWord.endsWith('aj') || normalizedWord.endsWith('ajn');
    }

    // Regular verbs don't have plural
    return false;
  }

  /**
   * Check for accusative in participles
   */
  protected override checkAccusative(word: string): boolean {
    const normalizedWord = word.toLowerCase();

    // For participles, check if it ends with 'n'
    if (this.isParticiple(normalizedWord)) {
      return normalizedWord.endsWith('n');
    }

    // Regular verbs don't have accusative
    return false;
  }

  /**
   * Additional validation specific to verbs
   */
  protected override validateWord(word: string): void {
    super.validateWord(word);

    // Ensure minimum length for valid verb
    if (word.length < 3) {
      throw new Error('Verb must be at least 3 characters long');
    }
  }
}
