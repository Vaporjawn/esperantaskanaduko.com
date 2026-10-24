import type {
  PartOfSpeech,
  MorphologicalFeatures,
  AnalysisOptions,
} from '../../types';
import { BaseMorphologicalAnalyzer } from './base';

/**
 * Morphological analyzer for Esperanto adjectives
 *
 * Esperanto adjectives:
 * - End with -a in singular nominative
 * - Can add -j for plural agreement
 * - Can add -n for accusative agreement
 * - Pattern: root + a + (j) + (n)
 *
 * Examples:
 * - bela (beautiful) - singular nominative
 * - belaj (beautiful) - plural nominative
 * - belan (beautiful) - singular accusative
 * - belajn (beautiful) - plural accusative
 */
export class AdjectiveMorphologicalAnalyzer extends BaseMorphologicalAnalyzer {
  public readonly name = 'AdjectiveMorphologicalAnalyzer';
  public readonly partOfSpeech: PartOfSpeech = 'Adjective';

  /**
   * Regex pattern for Esperanto adjectives
   * Matches: root (2+ letters) + 'a' + optional 'j' + optional 'n'
   */
  protected readonly matchRegex = /^[a-zA-ZĉĝĵĥŝŭĈĜĴĤŜŬ]{2,}a(j?n?)$/u;

  /**
   * Enhanced morphological analysis for adjectives
   */
  public override extractMorphology(
    word: string,
    options: AnalysisOptions
  ): MorphologicalFeatures {
    const baseMorphology = super.extractMorphology(word, options);

    if (!this.match(word)) {
      throw new Error('Word does not match adjective pattern');
    }

    const root = this.extractRoot(word);
    const agreement = {
      plural: baseMorphology.isPlural,
      accusative: baseMorphology.isAccusative,
    };

    return {
      ...baseMorphology,
      agreement,
      root,
    };
  }

  /**
   * Extract the root of the adjective by removing morphological endings
   */
  private extractRoot(word: string): string {
    let root = word.toLowerCase();

    // Remove accusative ending
    if (root.endsWith('n')) {
      root = root.slice(0, -1);
    }

    // Remove plural ending
    if (root.endsWith('j')) {
      root = root.slice(0, -1);
    }

    // Remove adjective ending 'a'
    if (root.endsWith('a')) {
      root = root.slice(0, -1);
    }

    return root;
  }

  /**
   * Additional validation specific to adjectives
   */
  protected override validateWord(word: string): void {
    super.validateWord(word);

    // Ensure minimum length for valid adjective
    if (word.length < 3) {
      throw new Error('Adjective must be at least 3 characters long');
    }

    // Check that it follows basic adjective pattern
    if (!word.toLowerCase().includes('a')) {
      throw new Error('Invalid adjective: must contain the vowel "a"');
    }
  }
}
