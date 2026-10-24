import type { PartOfSpeech, AnalysisOptions } from '../../types';
import { BaseMorphologicalAnalyzer } from './base';

/**
 * Morphological analyzer for Esperanto prepositions
 *
 * Esperanto prepositions are words that show relationships between other words.
 * They are invariable and come from a predefined list.
 * Some prepositions can be combined with other words or used as prefixes.
 */
export class PrepositionMorphologicalAnalyzer extends BaseMorphologicalAnalyzer {
  public readonly name = 'PrepositionMorphologicalAnalyzer';
  public readonly partOfSpeech: PartOfSpeech = 'Preposition';

  /**
   * List of Esperanto prepositions
   */
  private static readonly PREPOSITIONS = [
    'al', // to, towards
    'anstataŭ', // instead of
    'antaŭ', // before, in front of
    'apud', // beside, near
    'ce', // at, by (archaic, use ĉe)
    'ĉe', // at, by
    'ĉirkaŭ', // around
    'da', // of (quantity)
    'de', // of, from
    'dum', // during, while
    'ekster', // outside of
    'el', // out of, from
    'en', // in
    'estas', // (sometimes used prepositionally)
    'for', // away
    'ĝis', // until, up to
    'inter', // between, among
    'je', // (universal preposition)
    'kontraŭ', // against
    'krom', // except, besides
    'kun', // with
    'laŭ', // according to, along
    'malgraŭ', // despite
    'per', // by means of, with
    'po', // at the rate of
    'por', // for
    'post', // after
    'preter', // past, by
    'pri', // about, concerning
    'pro', // because of
    'sen', // without
    'sub', // under
    'super', // above, over
    'sur', // on
    'tra', // through
    'trans', // across
    'ĉu', // whether (sometimes prepositional)
  ];

  /**
   * Compound prepositions (multiple words)
   */
  private static readonly COMPOUND_PREPOSITIONS = [
    'anstataŭ ol', // instead of
    "dank' al", // thanks to
    'danke al', // thanks to
    'kune kun', // together with
    'rilate al', // in relation to
    'spite al', // in spite of
    'nome pri', // namely about
    'koncerne pri', // concerning
  ];

  /**
   * Regex pattern for Esperanto prepositions
   * Matches any of the prepositions in the list (case insensitive)
   */
  protected readonly matchRegex = new RegExp(
    `^(${[
      ...PrepositionMorphologicalAnalyzer.PREPOSITIONS,
      ...PrepositionMorphologicalAnalyzer.COMPOUND_PREPOSITIONS,
    ].join('|')})$`,
    'iu' // case insensitive + unicode
  );

  /**
   * Enhanced morphological analysis for prepositions
   */
  public override extractMorphology(word: string, options: AnalysisOptions) {
    const baseMorphology = super.extractMorphology(word, options);

    if (!this.match(word)) {
      throw new Error('Word does not match preposition pattern');
    }

    const normalizedWord = word.toLowerCase();

    return {
      ...baseMorphology,
      // Prepositions don't have plural or accusative forms
      isPlural: false,
      isAccusative: false,
      // Store the normalized form as root
      root: normalizedWord,
      // Indicate if it's compound
      isCompound: this.isCompoundPreposition(normalizedWord),
      // Indicate if it's universal preposition 'je'
      isUniversal: normalizedWord === 'je',
      // Indicate if it's archaic
      isArchaic: normalizedWord === 'ce',
      // Semantic category
      semanticCategory: this.getSemanticCategory(normalizedWord),
    };
  }

  /**
   * Check if the preposition is compound (multiple words)
   */
  private isCompoundPreposition(word: string): boolean {
    return PrepositionMorphologicalAnalyzer.COMPOUND_PREPOSITIONS.includes(
      word
    );
  }

  /**
   * Get the semantic category of the preposition
   */
  private getSemanticCategory(word: string): string {
    // Spatial prepositions
    if (
      [
        'al',
        'antaŭ',
        'apud',
        'ĉe',
        'ĉirkaŭ',
        'ekster',
        'el',
        'en',
        'inter',
        'kontraŭ',
        'post',
        'preter',
        'sub',
        'super',
        'sur',
        'tra',
        'trans',
      ].includes(word)
    ) {
      return 'spatial';
    }

    // Temporal prepositions
    if (['antaŭ', 'dum', 'ĝis', 'post'].includes(word)) {
      return 'temporal';
    }

    // Instrumental/manner prepositions
    if (['per', 'kun', 'sen', 'laŭ'].includes(word)) {
      return 'instrumental';
    }

    // Causal prepositions
    if (['pro', 'malgraŭ', 'anstataŭ'].includes(word)) {
      return 'causal';
    }

    // Relational prepositions
    if (['de', 'da', 'pri', 'por', 'krom'].includes(word)) {
      return 'relational';
    }

    // Universal or other
    if (word === 'je') {
      return 'universal';
    }

    return 'other';
  }

  /**
   * Prepositions don't have plural forms
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override checkPlural(_word: string): boolean {
    return false;
  }

  /**
   * Prepositions don't have accusative forms
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override checkAccusative(_word: string): boolean {
    return false;
  }

  /**
   * Additional validation specific to prepositions
   */
  protected override validateWord(word: string): void {
    // Allow spaces and apostrophes for compound prepositions
    if (!word || typeof word !== 'string') {
      throw new Error('Word must be a non-empty string');
    }

    if (word.trim() !== word) {
      throw new Error('Word cannot contain leading or trailing whitespace');
    }

    // Modified regex to allow spaces and apostrophes in compound prepositions
    if (!/^[a-zA-ZĉĝĵĥŝŭĈĜĴĤŜŬ\s']+$/.test(word)) {
      throw new Error('Word contains invalid characters');
    }
  }
}
