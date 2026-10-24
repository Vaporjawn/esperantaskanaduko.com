import type { PartOfSpeech, AnalysisOptions } from '../../types';
import { BaseMorphologicalAnalyzer } from './base';

/**
 * Morphological analyzer for Esperanto conjunctions
 *
 * Esperanto conjunctions are words that connect clauses, phrases, or words.
 * They are typically invariable and come from a predefined list.
 */
export class ConjunctionMorphologicalAnalyzer extends BaseMorphologicalAnalyzer {
  public readonly name = 'ConjunctionMorphologicalAnalyzer';
  public readonly partOfSpeech: PartOfSpeech = 'Conjunction';

  /**
   * List of Esperanto conjunctions
   */
  private static readonly CONJUNCTIONS = [
    'antaŭ kiam', // before
    'antaŭ ol', // before
    'aŭ', // or
    'ĉar', // because
    'ĉu', // whether
    'k', // and (abbreviated)
    'kaj', // and
    'kaŭ', // and (alternative form)
    'ke', // that
    'kial', // why
    'kiam', // when
    'kie', // where
    'kiel', // how, as
    'kune kun', // together with
    'kvankam', // although
    'kvazaŭ', // as if
    'minus', // minus
    'nek', // neither
    'ol', // than
    'plus', // plus
    'se', // if
    'sed', // but
    'tial', // therefore
  ];

  /**
   * Regex pattern for Esperanto conjunctions
   * Matches any of the conjunctions in the list (case insensitive)
   */
  protected readonly matchRegex = new RegExp(
    `^(${ConjunctionMorphologicalAnalyzer.CONJUNCTIONS.join('|')})$`,
    'iu' // case insensitive + unicode
  );

  /**
   * Enhanced morphological analysis for conjunctions
   */
  public override extractMorphology(word: string, options: AnalysisOptions) {
    const baseMorphology = super.extractMorphology(word, options);

    if (!this.match(word)) {
      throw new Error('Word does not match conjunction pattern');
    }

    const normalizedWord = word.toLowerCase();

    return {
      ...baseMorphology,
      // Conjunctions don't have plural or accusative forms
      isPlural: false,
      isAccusative: false,
      // Store the normalized form
      root: normalizedWord,
      // Indicate if it's a compound conjunction
      isCompound: normalizedWord.includes(' '),
    };
  }

  /**
   * Conjunctions don't have plural forms
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override checkPlural(_word: string): boolean {
    return false;
  }

  /**
   * Conjunctions don't have accusative forms
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override checkAccusative(_word: string): boolean {
    return false;
  }

  /**
   * Additional validation specific to conjunctions
   */
  protected override validateWord(word: string): void {
    // Allow spaces for compound conjunctions
    if (!word || typeof word !== 'string') {
      throw new Error('Word must be a non-empty string');
    }

    if (word.trim() !== word) {
      throw new Error('Word cannot contain leading or trailing whitespace');
    }

    // Modified regex to allow spaces in compound conjunctions
    if (!/^[a-zA-ZĉĝĵĥŝŭĈĜĴĤŜŬ\s]+$/.test(word)) {
      throw new Error('Word contains invalid characters');
    }
  }
}
