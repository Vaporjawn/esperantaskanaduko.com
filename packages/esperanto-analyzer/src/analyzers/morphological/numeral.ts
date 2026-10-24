import type { PartOfSpeech, AnalysisOptions } from '../../types';
import { BaseMorphologicalAnalyzer } from './base';

/**
 * Morphological analyzer for Esperanto numerals
 *
 * Esperanto numerals include:
 * - Basic numbers: unu, du, tri, kvar, kvin, ses, sep, ok, naŭ, dek
 * - Compound numbers: dek unu, dudek, tricent, etc.
 * - Ordinal forms with -a ending: unua, dua, tria, etc.
 * - Multiplicative forms with -obl: duoble, trioble, etc.
 * - Fractional forms with -on: duono, triono, etc.
 * - Collective forms with -op: duope, triope, etc.
 */
export class NumeralMorphologicalAnalyzer extends BaseMorphologicalAnalyzer {
  public readonly name = 'NumeralMorphologicalAnalyzer';
  public readonly partOfSpeech: PartOfSpeech = 'Numeral';

  /**
   * Basic Esperanto number roots
   */
  private static readonly BASIC_NUMBERS = [
    'nul', // zero
    'unu', // one
    'du', // two
    'tri', // three
    'kvar', // four
    'kvin', // five
    'ses', // six
    'sep', // seven
    'ok', // eight
    'naŭ', // nine
    'dek', // ten
    'cent', // hundred
    'mil', // thousand
    'milion', // million
    'miliard', // billion
  ];

  /**
   * Special number words
   */
  private static readonly SPECIAL_NUMBERS = [
    'ambaŭ', // both
    'paro', // pair
    'duopo', // duo
    'trio', // trio
    'kvarteto', // quartet
    'dekumo', // decimal
    'pecento', // percent
    'promilo', // per mill
  ];

  /**
   * Regex pattern for Esperanto numerals
   * Matches:
   * - Basic numbers with various endings
   * - Compound numbers
   * - Special number words
   */
  protected readonly matchRegex = new RegExp(
    `^((${NumeralMorphologicalAnalyzer.BASIC_NUMBERS.join('|')})+` +
      `(a(j?n?)|e|on(j?n?)|obl[ae](j?n?)|op[ae](j?n?))?|` +
      `${NumeralMorphologicalAnalyzer.SPECIAL_NUMBERS.join('|')}(j?n?)?)$`,
    'iu'
  );

  /**
   * Enhanced morphological analysis for numerals
   */
  public override extractMorphology(word: string, options: AnalysisOptions) {
    const baseMorphology = super.extractMorphology(word, options);

    if (!this.match(word)) {
      throw new Error('Word does not match numeral pattern');
    }

    const numeralType = this.getNumeralType(word);
    const root = this.extractNumeralRoot(word);

    return {
      ...baseMorphology,
      root,
      numeralType,
      isOrdinal: this.isOrdinal(word),
      isAdverbial: this.isAdverbial(word),
      isFractional: this.isFractional(word),
      isMultiplicative: this.isMultiplicative(word),
      isCollective: this.isCollective(word),
      isCompound: this.isCompoundNumber(root),
    };
  }

  /**
   * Extract the root of a numeral
   */
  private extractNumeralRoot(word: string): string {
    const lowercaseWord = word.toLowerCase();

    // Remove common endings to find root
    const patterns = [
      /a(j?n?)$/, // ordinal endings
      /e$/, // adverbial ending
      /on(j?n?)$/, // fractional endings
      /obl[ae](j?n?)$/, // multiplicative endings
      /op[ae](j?n?)$/, // collective endings
      /(j?n?)$/, // just plural/accusative
    ];

    for (const pattern of patterns) {
      const match = lowercaseWord.match(pattern);
      if (match) {
        return lowercaseWord.substring(
          0,
          lowercaseWord.length - match[0].length
        );
      }
    }

    return lowercaseWord;
  }

  /**
   * Determine the type of numeral
   */
  private getNumeralType(
    word: string
  ):
    | 'cardinal'
    | 'ordinal'
    | 'adverbial'
    | 'fractional'
    | 'multiplicative'
    | 'collective'
    | 'special' {
    if (this.isOrdinal(word)) return 'ordinal';
    if (this.isAdverbial(word)) return 'adverbial';
    if (this.isFractional(word)) return 'fractional';
    if (this.isMultiplicative(word)) return 'multiplicative';
    if (this.isCollective(word)) return 'collective';
    if (this.isSpecialNumber(word)) return 'special';
    return 'cardinal';
  }

  /**
   * Check if the numeral is ordinal (ends with -a)
   */
  private isOrdinal(word: string): boolean {
    return /a(j?n?)$/.test(word.toLowerCase());
  }

  /**
   * Check if the numeral is adverbial (ends with -e)
   */
  private isAdverbial(word: string): boolean {
    const root = this.extractNumeralRoot(word);
    return (
      word.toLowerCase().endsWith('e') &&
      NumeralMorphologicalAnalyzer.BASIC_NUMBERS.includes(root)
    );
  }

  /**
   * Check if the numeral is fractional (ends with -on)
   */
  private isFractional(word: string): boolean {
    return /on(j?n?)$/.test(word.toLowerCase());
  }

  /**
   * Check if the numeral is multiplicative (ends with -obl)
   */
  private isMultiplicative(word: string): boolean {
    return /obl[ae](j?n?)$/.test(word.toLowerCase());
  }

  /**
   * Check if the numeral is collective (ends with -op)
   */
  private isCollective(word: string): boolean {
    return /op[ae](j?n?)$/.test(word.toLowerCase());
  }

  /**
   * Check if the numeral is a special number word
   */
  private isSpecialNumber(word: string): boolean {
    const root = this.extractNumeralRoot(word);
    return NumeralMorphologicalAnalyzer.SPECIAL_NUMBERS.includes(root);
  }

  /**
   * Check if the numeral is compound (contains multiple number roots)
   */
  private isCompoundNumber(root: string): boolean {
    const numbers = NumeralMorphologicalAnalyzer.BASIC_NUMBERS;
    let foundCount = 0;

    for (const number of numbers) {
      if (root.includes(number) && number !== root) {
        foundCount++;
      }
    }

    return foundCount > 1;
  }

  /**
   * Numerals can have plural forms (especially ordinals and some special forms)
   */
  protected override checkPlural(word: string): boolean {
    return /j/.test(word.toLowerCase());
  }

  /**
   * Numerals can have accusative forms
   */
  protected override checkAccusative(word: string): boolean {
    return /n$/.test(word.toLowerCase());
  }
}
