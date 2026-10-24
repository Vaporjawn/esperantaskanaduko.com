import type { PartOfSpeech, AnalysisOptions } from '../../types';
import { BaseMorphologicalAnalyzer } from './base';

/**
 * Morphological analyzer for Esperanto pronouns
 *
 * Esperanto pronouns include:
 * - Personal pronouns: mi, vi, li, ŝi, ĝi, ni, ili
 * - Possessive pronouns: mia, via, lia, ŝia, ĝia, nia, ilia
 * - Demonstrative pronouns: tiu, ĉi tiu, tio, ĉio, etc.
 * - Relative pronouns: kiu, kio, etc.
 * - Indefinite pronouns: iu, io, etc.
 * - Correlative pronouns: all the correlative system
 */
export class PronounMorphologicalAnalyzer extends BaseMorphologicalAnalyzer {
  public readonly name = 'PronounMorphologicalAnalyzer';
  public readonly partOfSpeech: PartOfSpeech = 'Pronoun';

  /**
   * Personal pronouns
   */
  private static readonly PERSONAL_PRONOUNS = [
    'mi', // I
    'vi', // you
    'li', // he
    'ŝi', // she
    'ĝi', // it
    'ni', // we
    'ili', // they
    'oni', // one (impersonal)
    'si', // reflexive pronoun
  ];

  /**
   * Possessive pronouns (with -a ending)
   */
  private static readonly POSSESSIVE_ROOTS = [
    'mi', // my
    'vi', // your
    'li', // his
    'ŝi', // her
    'ĝi', // its
    'ni', // our
    'ili', // their
    'oni', // one's
    'si', // reflexive possessive
  ];

  /**
   * Correlative system beginnings
   */
  private static readonly CORRELATIVE_BEGINNINGS = [
    'ki', // interrogative/relative (who, what, which)
    'ti', // demonstrative (that)
    'i', // indefinite (some)
    'ĉi', // universal (every, all)
    'neni', // negative (no, none)
  ];

  /**
   * Correlative system endings
   */
  private static readonly CORRELATIVE_ENDINGS = [
    'u', // individual (-o can be added: kiu, kiuo)
    'o', // thing
    'a', // quality/kind
    'e', // place/manner
    'al', // reason
    'am', // time
    'om', // quantity
    'el', // manner
  ];

  /**
   * Special pronouns
   */
  private static readonly SPECIAL_PRONOUNS = [
    'ĉi', // this (when used alone)
    'mem', // self (emphatic)
    'sama', // same
    'tia', // such
    'tial', // therefore
    'tiam', // then
    'tie', // there
    'tiel', // thus, so
    'tiom', // so much/many
  ];

  /**
   * Generate all possible correlative forms
   */
  private static generateCorrelatives(): string[] {
    const correlatives: string[] = [];

    for (const beginning of PronounMorphologicalAnalyzer.CORRELATIVE_BEGINNINGS) {
      for (const ending of PronounMorphologicalAnalyzer.CORRELATIVE_ENDINGS) {
        correlatives.push(beginning + ending);
        // Add -o ending for 'u' forms (kiu -> kiuo)
        if (ending === 'u') {
          correlatives.push(beginning + ending + 'o');
        }
      }
    }

    return correlatives;
  }

  /**
   * Regex pattern for Esperanto pronouns
   */
  protected readonly matchRegex = new RegExp(
    `^(` +
      // Personal pronouns (with optional accusative)
      `(${PronounMorphologicalAnalyzer.PERSONAL_PRONOUNS.join('|')})(n?)|` +
      // Possessive pronouns (with agreement endings)
      `(${PronounMorphologicalAnalyzer.POSSESSIVE_ROOTS.join('|')})a(j?n?)|` +
      // Correlatives (with optional agreement for 'a' endings)
      `(${PronounMorphologicalAnalyzer.generateCorrelatives().join('|')})(j?n?)|` +
      // Special pronouns (with optional agreement)
      `(${PronounMorphologicalAnalyzer.SPECIAL_PRONOUNS.join('|')})(j?n?)|` +
      // Compound forms like "ĉi tiu", "ĉi tie", etc.
      `ĉi\\s+(ti[uoael]|ti[ao]m|tiel)(j?n?)` +
      `)$`,
    'iu'
  );

  /**
   * Enhanced morphological analysis for pronouns
   */
  public override extractMorphology(word: string, options: AnalysisOptions) {
    const baseMorphology = super.extractMorphology(word, options);

    if (!this.match(word)) {
      throw new Error('Word does not match pronoun pattern');
    }

    const pronounType = this.getPronounType(word);
    const root = this.extractPronounRoot(word);

    return {
      ...baseMorphology,
      root,
      pronounType,
      isPersonal: this.isPersonal(word),
      isPossessive: this.isPossessive(word),
      isCorrelative: this.isCorrelative(word),
      isReflexive: this.isReflexive(word),
      isCompound: word.includes(' ') || word.includes('ĉi'),
      correlativeFunction: this.getCorrelativeFunction(word),
    };
  }

  /**
   * Extract the root of a pronoun
   */
  private extractPronounRoot(word: string): string {
    const lowercaseWord = word.toLowerCase().trim();

    // Handle compound forms with ĉi
    if (lowercaseWord.startsWith('ĉi ')) {
      return lowercaseWord.substring(3); // Remove "ĉi "
    }

    // Remove endings to find root
    const patterns = [
      /a(j?n?)$/, // possessive endings
      /n$/, // accusative ending
      /(j?n?)$/, // plural/accusative endings for correlatives
    ];

    for (const pattern of patterns) {
      const match = lowercaseWord.match(pattern);
      if (match && match[0].length < lowercaseWord.length) {
        return lowercaseWord.substring(
          0,
          lowercaseWord.length - match[0].length
        );
      }
    }

    return lowercaseWord;
  }

  /**
   * Determine the type of pronoun
   */
  private getPronounType(
    word: string
  ):
    | 'personal'
    | 'possessive'
    | 'demonstrative'
    | 'interrogative'
    | 'relative'
    | 'indefinite'
    | 'universal'
    | 'negative'
    | 'reflexive'
    | 'special' {
    if (this.isPersonal(word)) return 'personal';
    if (this.isPossessive(word)) return 'possessive';
    if (this.isReflexive(word)) return 'reflexive';

    const root = this.extractPronounRoot(word);

    if (root.startsWith('ti')) return 'demonstrative';
    if (root.startsWith('ki'))
      return word.includes('?') ? 'interrogative' : 'relative';
    if (root.startsWith('i') && !root.startsWith('ili')) return 'indefinite';
    if (root.startsWith('ĉi')) return 'universal';
    if (root.startsWith('neni')) return 'negative';

    return 'special';
  }

  /**
   * Check if the pronoun is personal
   */
  private isPersonal(word: string): boolean {
    const root = this.extractPronounRoot(word);
    return PronounMorphologicalAnalyzer.PERSONAL_PRONOUNS.includes(root);
  }

  /**
   * Check if the pronoun is possessive
   */
  private isPossessive(word: string): boolean {
    return (
      /[a-ząęėįšųūž]a(j?n?)$/.test(word.toLowerCase()) &&
      PronounMorphologicalAnalyzer.POSSESSIVE_ROOTS.some((root) =>
        word.toLowerCase().startsWith(root + 'a')
      )
    );
  }

  /**
   * Check if the pronoun is correlative
   */
  private isCorrelative(word: string): boolean {
    const root = this.extractPronounRoot(word);
    return PronounMorphologicalAnalyzer.generateCorrelatives().includes(root);
  }

  /**
   * Check if the pronoun is reflexive
   */
  private isReflexive(word: string): boolean {
    const root = this.extractPronounRoot(word);
    return root === 'si' || root.startsWith('si');
  }

  /**
   * Get the correlative function
   */
  private getCorrelativeFunction(word: string): string | null {
    const root = this.extractPronounRoot(word);

    if (!this.isCorrelative(word)) return null;

    if (root.endsWith('u') || root.endsWith('uo')) return 'individual';
    if (root.endsWith('o')) return 'thing';
    if (root.endsWith('a')) return 'quality';
    if (root.endsWith('e')) return 'place/manner';
    if (root.endsWith('al')) return 'reason';
    if (root.endsWith('am')) return 'time';
    if (root.endsWith('om')) return 'quantity';
    if (root.endsWith('el')) return 'manner';

    return null;
  }

  /**
   * Pronouns can have plural forms (especially correlatives and possessives)
   */
  protected override checkPlural(word: string): boolean {
    return /j/.test(word.toLowerCase());
  }

  /**
   * Pronouns can have accusative forms
   */
  protected override checkAccusative(word: string): boolean {
    return /n$/.test(word.toLowerCase());
  }

  /**
   * Additional validation specific to pronouns
   */
  protected override validateWord(word: string): void {
    // Allow spaces for compound pronouns like "ĉi tiu"
    if (!word || typeof word !== 'string') {
      throw new Error('Word must be a non-empty string');
    }

    if (word.trim() !== word) {
      throw new Error('Word cannot contain leading or trailing whitespace');
    }

    // Modified regex to allow spaces in compound pronouns
    if (!/^[a-zA-ZĉĝĵĥŝŭĈĜĴĤŜŬ\s]+$/.test(word)) {
      throw new Error('Word contains invalid characters');
    }
  }
}
