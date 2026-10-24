import type { PartOfSpeech, AnalysisOptions } from '../../types';
import { BaseMorphologicalAnalyzer } from './base';

/**
 * Morphological analyzer for the Esperanto article
 *
 * Esperanto has only one article: "la" (the)
 * - It is invariable (doesn't change for number, case, or gender)
 * - It's the only definite article in Esperanto
 * - There is no indefinite article in Esperanto
 */
export class ArticleMorphologicalAnalyzer extends BaseMorphologicalAnalyzer {
  public readonly name = 'ArticleMorphologicalAnalyzer';
  public readonly partOfSpeech: PartOfSpeech = 'Article';

  /**
   * Regex pattern for the Esperanto article
   * Only matches "la" (case insensitive)
   */
  protected readonly matchRegex = /^la$/iu;

  /**
   * Enhanced morphological analysis for articles
   */
  public override extractMorphology(word: string, options: AnalysisOptions) {
    const baseMorphology = super.extractMorphology(word, options);

    if (!this.match(word)) {
      throw new Error('Word does not match article pattern');
    }

    return {
      ...baseMorphology,
      // Articles don't have plural or accusative forms
      isPlural: false,
      isAccusative: false,
      // The article is always "la"
      root: 'la',
    };
  }

  /**
   * Articles don't have plural forms
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override checkPlural(_word: string): boolean {
    return false;
  }

  /**
   * Articles don't have accusative forms
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override checkAccusative(_word: string): boolean {
    return false;
  }

  /**
   * Additional validation specific to articles
   */
  protected override validateWord(word: string): void {
    super.validateWord(word);

    const normalizedWord = word.toLowerCase();
    if (normalizedWord !== 'la') {
      throw new Error('Invalid article: only "la" is valid in Esperanto');
    }
  }
}
