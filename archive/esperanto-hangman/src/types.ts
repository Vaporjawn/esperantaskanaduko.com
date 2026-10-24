/**
 * Core game types for Esperanto Hangman
 */

/**
 * Represents a single letter in the Esperanto alphabet
 * Includes standard letters and special diacritical characters
 */
export type Letter = string;

/**
 * Game phase enumeration
 * - 'playing': Game is in progress
 * - 'won': Player has successfully guessed the word
 * - 'lost': Player has run out of guesses
 */
export type GamePhase = 'playing' | 'won' | 'lost';

/**
 * Complete game state interface
 */
export interface GameState {
  /** The secret word to be guessed */
  secret: string;
  /** Set of correctly guessed letters */
  guessed: Set<string>;
  /** Set of incorrectly guessed letters */
  wrong: Set<string>;
  /** Maximum number of mistakes allowed before game over */
  maxMistakes: number;
  /** Current phase of the game */
  phase: GamePhase;
}

/**
 * Game statistics tracked across sessions
 */
export interface GameStats {
  /** Total number of games played */
  games: number;
  /** Total number of games won */
  wins: number;
  /** Current win streak */
  streak: number;
}

/**
 * Game settings and configuration
 */
export interface GameSettings {
  /** Maximum number of mistakes allowed */
  maxMistakes: number;
  /** Whether hints are enabled */
  allowHints: boolean;
}
