import { useCallback, useEffect, useReducer } from 'react';
import { createInitialState, hangmanReducer } from './gameReducer';
import { loadSettings, loadStats, saveStats } from './storage';
import { pickRandomWord } from './words';
import type { HangmanState } from './types';

/** Value returned by {@link useHangman}. */
export interface UseHangman extends HangmanState {
  /** Guess one letter (diacritics and case are normalised). */
  guess: (letter: string) => void;
  /** Start a new game with a different random word. */
  newGame: () => void;
}

/**
 * Game state for the Pendumulo (Esperanto hangman) page.
 *
 * Statistics are loaded from, and saved to, localStorage.
 */
export const useHangman = (): UseHangman => {
  const [state, dispatch] = useReducer(hangmanReducer, undefined, () =>
    createInitialState(pickRandomWord(), loadStats(), loadSettings().maxMistakes)
  );

  useEffect(() => {
    // Nothing to remember before the first finished game.
    if (state.stats.games > 0) saveStats(state.stats);
  }, [state.stats]);

  const guess = useCallback((letter: string) => dispatch({ type: 'guess', letter }), []);
  const newGame = useCallback(() => dispatch({ type: 'newGame', secret: pickRandomWord() }), []);

  return { ...state, guess, newGame };
};
