import { toNFC, isWordComplete } from './eo';
import type { GamePhase, GameStats, HangmanAction, HangmanState } from './types';

/**
 * Update game stats after a win.
 */
const updateStatsForWin = (stats: GameStats): GameStats => ({
  games: stats.games + 1,
  wins: stats.wins + 1,
  streak: stats.streak + 1,
});

/**
 * Update game stats after a loss.
 */
const updateStatsForLoss = (stats: GameStats): GameStats => ({
  games: stats.games + 1,
  wins: stats.wins,
  streak: 0,
});

/**
 * Determine the game phase from the guessed letters and the mistake count.
 */
export const determineGamePhase = (
  secret: string,
  guessedLetters: ReadonlySet<string>,
  wrongCount: number,
  maxMistakes: number
): GamePhase => {
  if (isWordComplete(secret, guessedLetters)) {
    return 'won';
  }

  if (wrongCount >= maxMistakes) {
    return 'lost';
  }

  return 'playing';
};

/**
 * Build the state for a fresh game.
 *
 * @param secret - The word to guess
 * @param stats - Statistics carried over from earlier games
 * @param maxMistakes - Number of mistakes that loses the game
 */
export const createInitialState = (secret: string, stats: GameStats, maxMistakes: number): HangmanState => ({
  secret,
  guessed: new Set(),
  wrong: new Set(),
  maxMistakes,
  phase: 'playing',
  stats,
});

/**
 * Pure reducer for the hangman game.
 *
 * - `guess` ignores input once the game is over or when the letter was already tried.
 * - `newGame` keeps the statistics and settings but replaces the secret word.
 */
export const hangmanReducer = (state: HangmanState, action: HangmanAction): HangmanState => {
  switch (action.type) {
    case 'newGame':
      return createInitialState(toNFC(action.secret), state.stats, state.maxMistakes);

    case 'guess': {
      const letter = toNFC(action.letter.toLowerCase());
      if (state.phase !== 'playing') return state;
      if (state.guessed.has(letter) || state.wrong.has(letter)) return state;

      const guessed = new Set(state.guessed);
      const wrong = new Set(state.wrong);
      if (state.secret.includes(letter)) {
        guessed.add(letter);
      } else {
        wrong.add(letter);
      }

      const phase = determineGamePhase(state.secret, guessed, wrong.size, state.maxMistakes);
      let { stats } = state;
      if (phase === 'won') stats = updateStatsForWin(stats);
      if (phase === 'lost') stats = updateStatsForLoss(stats);

      return { ...state, guessed, wrong, phase, stats };
    }

    default:
      return state;
  }
};
