/**
 * Core game types for the Esperanto hangman game (Pendumulo).
 */

/**
 * Game phase enumeration
 * - 'playing': Game is in progress
 * - 'won': Player has successfully guessed the word
 * - 'lost': Player has run out of guesses
 */
export type GamePhase = 'playing' | 'won' | 'lost';

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

/**
 * Complete state of one hangman session, as held by the game reducer.
 */
export interface HangmanState {
  /** The secret word to be guessed (NFC-normalised) */
  secret: string;
  /** Letters guessed correctly */
  guessed: ReadonlySet<string>;
  /** Letters guessed incorrectly */
  wrong: ReadonlySet<string>;
  /** Maximum number of mistakes allowed before the game is lost */
  maxMistakes: number;
  /** Current phase of the game */
  phase: GamePhase;
  /** Statistics across games (persisted by the hook) */
  stats: GameStats;
}

/**
 * Actions understood by the game reducer.
 */
export type HangmanAction = { type: 'guess'; letter: string } | { type: 'newGame'; secret: string };
