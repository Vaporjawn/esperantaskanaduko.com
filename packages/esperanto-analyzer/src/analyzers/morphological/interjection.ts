import type { PartOfSpeech, AnalysisOptions } from '../../types';
import { BaseMorphologicalAnalyzer } from './base';

/**
 * Morphological analyzer for Esperanto interjections
 *
 * Esperanto interjections are exclamatory words that express emotions.
 * They are invariable and come from a predefined list.
 */
export class InterjectionMorphologicalAnalyzer extends BaseMorphologicalAnalyzer {
  public readonly name = 'InterjectionMorphologicalAnalyzer';
  public readonly partOfSpeech: PartOfSpeech = 'Interjection';

  /**
   * Since interjections have varied patterns, we use a simple match-all regex
   * and rely on the match method for actual matching
   */
  protected readonly matchRegex = /^.+$/;

  /**
   * List of Esperanto interjections
   */
  private static readonly INTERJECTIONS = [
    'aĥ!', // ah! (pain, regret)
    'aj!', // ouch!
    'ba!', // bah!
    'baf!', // bang!
    'baj!', // bye!
    'be!', // bah! (contempt)
    'bis!', // encore!
    'diable!', // darn!
    'ek!', // go! start!
    'fi!', // fie! (disgust)
    'fu!', // ugh!
    'ĝis!', // goodbye! (short form)
    'ha!', // ha!
    'ha lo!', // hello!
    'he!', // hey!
    'hej!', // hey! hi!
    'ho!', // oh!
    'ho ve!', // alas!
    'hoj!', // ahoy!
    'hola!', // hello!
    'hu!', // whew!
    'hup!', // hop!
    'hura!', // hurrah!
    'lo!', // look!
    'lu lu!', // lullaby
    'nu!', // well!
    'uf!', // oof!
    'up!', // up!
    'ŭa!', // wow!
    've!', // woe!
    'volapukaĵo!', // nonsense!
    'jen', // here is/are (can be interjection)
  ];

  /**
   * Override the match method to use our custom lookup logic
   */
  public override match(word: string): boolean {
    const normalizedWord = word.toLowerCase();
    return InterjectionMorphologicalAnalyzer.INTERJECTIONS.some(
      (interjection) => interjection.toLowerCase() === normalizedWord
    );
  }

  /**
   * Enhanced morphological analysis for interjections
   */
  public override extractMorphology(word: string, options: AnalysisOptions) {
    const baseMorphology = super.extractMorphology(word, options);

    if (!this.match(word)) {
      throw new Error('Word does not match interjection pattern');
    }

    const normalizedWord = word.toLowerCase();

    return {
      ...baseMorphology,
      // Interjections don't have plural or accusative forms
      isPlural: false,
      isAccusative: false,
      // Store the normalized form
      root: normalizedWord,
      // Indicate if it has exclamation mark
      hasExclamation: word.includes('!'),
      // Indicate if it's compound
      isCompound: normalizedWord.includes(' '),
    };
  }

  /**
   * Interjections don't have plural forms
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override checkPlural(_word: string): boolean {
    return false;
  }

  /**
   * Interjections don't have accusative forms
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override checkAccusative(_word: string): boolean {
    return false;
  }

  /**
   * Additional validation specific to interjections
   */
  protected override validateWord(word: string): void {
    // Allow spaces and exclamation marks for interjections
    if (!word || typeof word !== 'string') {
      throw new Error('Word must be a non-empty string');
    }

    if (word.trim() !== word) {
      throw new Error('Word cannot contain leading or trailing whitespace');
    }

    // Modified regex to allow spaces and exclamation marks in interjections
    if (!/^[a-zA-ZĉĝĵĥŝŭĈĜĴĤŜŬ\s!]+$/.test(word)) {
      throw new Error('Word contains invalid characters');
    }
  }
}
