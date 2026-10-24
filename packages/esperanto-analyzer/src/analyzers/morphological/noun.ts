import type { PartOfSpeech, AnalysisOptions } from '../../types';
import { BaseMorphologicalAnalyzer } from './base';

/**
 * Morphological analyzer for Esperanto nouns
 *
 * Esperanto nouns:
 * - End with -o in singular nominative
 * - Can add -j for plural
 * - Can add -n for accusative case
 * - Pattern: root + o + (j) + (n)
 *
 * Examples:
 * - hundo (dog) - singular nominative
 * - hundoj (dogs) - plural nominative
 * - hundon (dog) - singular accusative
 * - hundojn (dogs) - plural accusative
 */
export class NounMorphologicalAnalyzer extends BaseMorphologicalAnalyzer {
  public readonly name = 'NounMorphologicalAnalyzer';
  public readonly partOfSpeech: PartOfSpeech = 'Noun';

  /**
   * Regex pattern for Esperanto nouns
   * Matches: root (2+ letters) + 'o' + optional 'j' + optional 'n'
   * Uses Unicode flag to support Esperanto special characters
   */
  protected readonly matchRegex = /^[a-zA-ZĉĝĵĥŝŭĈĜĴĤŜŬ]{2,}o(j?n?)$/u;

  /**
   * Enhanced morphological analysis for nouns
   */
  public override extractMorphology(word: string, options: AnalysisOptions) {
    const baseMorphology = super.extractMorphology(word, options);

    // Validate that it's actually a noun
    if (!this.match(word)) {
      throw new Error('Word does not match noun pattern');
    }

    // Extract the root by removing noun endings
    const root = this.extractRoot(word);

    return {
      ...baseMorphology,
      // Additional noun-specific features could be added here
      root,
    };
  }

  /**
   * Extract the root of the noun by removing morphological endings
   */
  private extractRoot(word: string): string {
    let root = word;

    // Remove accusative ending
    if (root.endsWith('n')) {
      root = root.slice(0, -1);
    }

    // Remove plural ending
    if (root.endsWith('j')) {
      root = root.slice(0, -1);
    }

    // Remove noun ending 'o'
    if (root.endsWith('o')) {
      root = root.slice(0, -1);
    }

    return root;
  }

  /**
   * Additional validation specific to nouns
   */
  protected override validateWord(word: string): void {
    super.validateWord(word);

    // Ensure minimum length for valid noun
    if (word.length < 3) {
      throw new Error('Noun must be at least 3 characters long');
    }

    // Check that it follows basic noun pattern
    if (!word.includes('o')) {
      throw new Error('Invalid noun: must contain the vowel "o"');
    }
  }
}
