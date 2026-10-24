/**
 * Base abstract class for all Esperanto speech parts
 */
export abstract class Word {
  constructor(public readonly value: string) {}

  /**
   * Returns the part of speech type for this word
   */
  abstract getPartOfSpeech(): string;

  /**
   * Returns a string representation of the word
   */
  toString(): string {
    return this.value;
  }

  /**
   * Checks if this word equals another word
   */
  equals(other: Word): boolean {
    return this.value === other.value && this.constructor === other.constructor;
  }
}

/**
 * Represents an Esperanto noun (substantivo)
 * Nouns in Esperanto end with -o and can have -j (plural) and -n (accusative)
 */
export class Noun extends Word {
  getPartOfSpeech(): string {
    return 'Noun';
  }
}

/**
 * Represents an Esperanto verb (verbo)
 * Verbs have various endings: -i (infinitive), -as/-is/-os (indicative), -us (conditional), -u (imperative)
 */
export class Verb extends Word {
  getPartOfSpeech(): string {
    return 'Verb';
  }
}

/**
 * Represents an Esperanto adjective (adjektivo)
 * Adjectives end with -a and can have -j (plural) and -n (accusative)
 */
export class Adjective extends Word {
  getPartOfSpeech(): string {
    return 'Adjective';
  }
}

/**
 * Represents an Esperanto adverb (adverbo)
 * Adverbs typically end with -e, though some are irregular
 */
export class Adverb extends Word {
  getPartOfSpeech(): string {
    return 'Adverb';
  }
}

/**
 * Represents the Esperanto definite article "la"
 * Esperanto has only one article which is invariable
 */
export class Article extends Word {
  constructor(value: string) {
    super(value);
    if (value.toLowerCase() !== 'la') {
      throw new InvalidArticleError(
        `Invalid article: ${value}. Only "la" is valid.`
      );
    }
  }

  getPartOfSpeech(): string {
    return 'Article';
  }
}

/**
 * Error thrown when an invalid article is encountered
 */
export class InvalidArticleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidArticleError';
  }
}

/**
 * Represents an Esperanto conjunction (konjunkcio)
 * Words that connect clauses or phrases
 */
export class Conjunction extends Word {
  getPartOfSpeech(): string {
    return 'Conjunction';
  }
}

/**
 * Represents an Esperanto interjection (interjekcio)
 * Exclamatory words expressing emotion
 */
export class Interjection extends Word {
  getPartOfSpeech(): string {
    return 'Interjection';
  }
}

/**
 * Represents an Esperanto numeral (numeralo)
 * Numbers and numeric expressions
 */
export class Numeral extends Word {
  getPartOfSpeech(): string {
    return 'Numeral';
  }
}

/**
 * Represents an Esperanto preposition (prepozicio)
 * Words that show relationships between other words
 */
export class Preposition extends Word {
  getPartOfSpeech(): string {
    return 'Preposition';
  }
}

/**
 * Represents an Esperanto pronoun (pronomo)
 * Personal, possessive, demonstrative, and other pronouns
 */
export class Pronoun extends Word {
  getPartOfSpeech(): string {
    return 'Pronoun';
  }
}

/**
 * Represents an undefined/unrecognized word
 */
export class UndefinedWord extends Word {
  getPartOfSpeech(): string {
    return 'Undefined';
  }
}

/**
 * Factory function to create the appropriate Word instance based on part of speech
 */
export function createWord(value: string, partOfSpeech: string): Word {
  switch (partOfSpeech) {
    case 'Noun':
      return new Noun(value);
    case 'Verb':
      return new Verb(value);
    case 'Adjective':
      return new Adjective(value);
    case 'Adverb':
      return new Adverb(value);
    case 'Article':
      return new Article(value);
    case 'Conjunction':
      return new Conjunction(value);
    case 'Interjection':
      return new Interjection(value);
    case 'Numeral':
      return new Numeral(value);
    case 'Preposition':
      return new Preposition(value);
    case 'Pronoun':
      return new Pronoun(value);
    default:
      return new UndefinedWord(value);
  }
}
