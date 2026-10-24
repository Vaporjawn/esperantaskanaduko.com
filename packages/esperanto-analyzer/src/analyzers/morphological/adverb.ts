import type { PartOfSpeech, AnalysisOptions } from '../../types';
import { BaseMorphologicalAnalyzer } from './base';

/**
 * Morphological analyzer for Espera  /**
 * Extract morphological features from the adverbbs
 *
 * Esperanto adverbs:
 * - Regular adverbs end with -e (bele, rapide, bone)
 * - Special irregular adverbs from a predefined list
 * - Adverbs are invariable (no plural or accusative forms)
 */
export class AdverbMorphologicalAnalyzer extends BaseMorphologicalAnalyzer {
  public readonly name = 'AdverbMorphologicalAnalyzer';
  public readonly partOfSpeech: PartOfSpeech = 'Adverb';

  /**
   * List of special Esperanto adverbs that don't follow the -e pattern
   */
  private static readonly SPECIAL_ADVERBS = [
    'nun', // now
    'tuj', // immediately
    'jam', // already
    'ankoraŭ', // still, yet
    'baldaŭ', // soon
    'hieraŭ', // yesterday
    'hodiaŭ', // today
    'morgaŭ', // tomorrow
    'tre', // very
    'pli', // more
    'plej', // most
    'tro', // too (much)
    'nur', // only
    'eĉ', // even
    'preskaŭ', // almost
    'apenaŭ', // barely
    'ĉirkaŭ', // around, approximately
    'jen', // here is/are
    'for', // away
    'hejm', // home, homeward
    'eksteren', // outside
    'supren', // upward
    'malsupren', // downward
    'antaŭen', // forward
    'malantaŭen', // backward
    'dekstren', // rightward
    'maldekstren', // leftward
    'ien', // somewhere (direction)
    'nien', // nowhere (direction)
    'tien', // thither
    'ĉien', // everywhere (direction)
  ];

  /**
   * Check if a word contains only valid Esperanto characters
   */
  private hasValidEsperantoCharacters(word: string): boolean {
    const esperantoChars = /^[a-zĉĝĵĥŝŭ]+$/u;
    return esperantoChars.test(word.toLowerCase());
  }

  /**
   * Check if word follows basic Esperanto phonotactics and patterns
   * Esperanto doesn't have: some letter combinations common in English
   */
  private hasValidEsperantoPhonology(word: string): boolean {
    const normalizedWord = word.toLowerCase();

    // Must be at least 3 characters + 'e' ending for regular adverbs
    if (normalizedWord.length < 4) {
      return false;
    }

    // Check for invalid characters
    if (/[qwxy]/.test(normalizedWord)) {
      return false;
    }

    // Common English patterns that are rare/invalid in Esperanto
    const englishPatterns = [
      /ouse$/, // -ouse ending (house, mouse, etc.)
      /tion/, // -tion endings (common in English, rare in Esperanto)
      /^th/, // th- beginnings (the, that, etc.)
      /ght/, // -ght- combinations (night, light, etc.)
      /ple$/, // -ple endings (simple, apple, etc.)
      /ble$/, // -ble endings (table, double, etc.)
      /[^aeiouĉĝĵĥŝŭ]{3,}/, // 3+ consonants in a row (rare in Esperanto)
    ];

    for (const pattern of englishPatterns) {
      if (pattern.test(normalizedWord)) {
        return false;
      }
    }

    // Check for double consonants (not typical in simple Esperanto adverbs)
    const doubleConsonants = /([bcdfghjklmnpqrstvwxyz])\1/;
    if (doubleConsonants.test(normalizedWord)) {
      return false;
    }

    return true;
  }

  /**
   * Combined regex for all adverbs (regular + special)
   */
  protected readonly matchRegex = new RegExp(
    `^(${AdverbMorphologicalAnalyzer.SPECIAL_ADVERBS.join('|')}|[a-zĉĝĵĥŝŭ]{2,}e)$`,
    'iu' // case insensitive + unicode
  );

  /**
   * Override match method to add phonological validation
   */
  public override match(word: string): boolean {
    if (!super.match(word)) {
      return false;
    }

    // Special adverbs are always valid
    if (this.isSpecialAdverb(word)) {
      return true;
    }

    // For regular adverbs, check Esperanto phonology
    return (
      this.hasValidEsperantoCharacters(word) &&
      this.hasValidEsperantoPhonology(word)
    );
  }

  /**
   * Check if word is a special adverb
   */
  private isSpecialAdverb(word: string): boolean {
    const normalizedWord = word.toLowerCase();
    return AdverbMorphologicalAnalyzer.SPECIAL_ADVERBS.includes(normalizedWord);
  }

  /**
   * Enhanced morphological analysis for adverbs
   */
  public override extractMorphology(word: string, options: AnalysisOptions) {
    const baseMorphology = super.extractMorphology(word, options);

    if (!this.match(word)) {
      throw new Error('Word does not match adverb pattern');
    }

    const isSpecial = this.isSpecialAdverb(word);
    const root = this.extractRoot(word);

    return {
      ...baseMorphology,
      isSpecial,
      root,
      // Adverbs don't have plural or accusative forms
      isPlural: false,
      isAccusative: false,
    };
  }

  /**
   * Extract the root of the adverb
   */
  private extractRoot(word: string): string {
    const normalizedWord = word.toLowerCase();

    // Special adverbs don't have a clear root pattern
    if (this.isSpecialAdverb(normalizedWord)) {
      return normalizedWord;
    }

    // Regular adverbs: remove the -e ending
    if (normalizedWord.endsWith('e')) {
      return normalizedWord.slice(0, -1);
    }

    return normalizedWord;
  }

  /**
   * Adverbs don't have plural forms
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override checkPlural(_word: string): boolean {
    return false;
  }

  /**
   * Adverbs don't have accusative forms
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override checkAccusative(_word: string): boolean {
    return false;
  }

  /**
   * Additional validation specific to adverbs
   */
  protected override validateWord(word: string): void {
    super.validateWord(word);

    // Ensure minimum length
    if (word.length < 2) {
      throw new Error('Adverb must be at least 2 characters long');
    }
  }
}
