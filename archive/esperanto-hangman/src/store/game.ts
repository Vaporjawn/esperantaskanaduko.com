import { create } from 'zustand';
import { toNFC, isWordComplete } from '../utils/eo';
import { loadStats, saveStats, loadSettings } from '../services/storage';
import { pickRandomWord } from '../services/words';
import type { GamePhase, GameStats } from '../types';

/**
 * Game state interface
 */
interface GameState {
  secret: string;
  guessed: Set<string>;
  wrong: Set<string>;
  maxMistakes: number;
  phase: GamePhase;
  stats: GameStats;

  // Actions
  newGame: () => void;
  guess: (letter: string) => void;
}

/**
 * Update game stats after win
 */
const updateStatsForWin = (currentStats: GameStats): GameStats => ({
  games: currentStats.games + 1,
  wins: currentStats.wins + 1,
  streak: currentStats.streak + 1,
});

/**
 * Update game stats after loss
 */
const updateStatsForLoss = (currentStats: GameStats): GameStats => ({
  games: currentStats.games + 1,
  wins: currentStats.wins,
  streak: 0,
});

/**
 * Determine the new game phase based on guessed letters and wrong count
 */
const determineGamePhase = (
  secret: string,
  guessedLetters: Set<string>,
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
 * Main game store using Zustand
 */
export const useGame = create<GameState>((set, get) => {
  const settings = loadSettings();

  return {
    secret: pickRandomWord(),
    guessed: new Set(),
    wrong: new Set(),
    maxMistakes: settings.maxMistakes,
    phase: 'playing',
    stats: loadStats(),

    newGame: () => {
      set({
        secret: pickRandomWord(),
        guessed: new Set(),
        wrong: new Set(),
        phase: 'playing',
      });
    },

    guess: (raw: string) => {
      const letter = toNFC(raw.toLowerCase());
      const { secret, guessed, wrong, maxMistakes, phase, stats } = get();

      // Ignore if game is over or letter already guessed
      if (phase !== 'playing') return;
      if (guessed.has(letter) || wrong.has(letter)) return;

      const nextGuessed = new Set(guessed);
      const nextWrong = new Set(wrong);

      // Check if letter is in secret word
      if (secret.includes(letter)) {
        nextGuessed.add(letter);
      } else {
        nextWrong.add(letter);
      }

      // Determine new phase using helper function
      const nextPhase = determineGamePhase(secret, nextGuessed, nextWrong.size, maxMistakes);

      // Update stats if game ended
      if (nextPhase === 'won') {
        const newStats = updateStatsForWin(stats);
        saveStats(newStats);
        set({ stats: newStats });
      } else if (nextPhase === 'lost') {
        const newStats = updateStatsForLoss(stats);
        saveStats(newStats);
        set({ stats: newStats });
      }

      set({
        guessed: nextGuessed,
        wrong: nextWrong,
        phase: nextPhase,
      });
    },
  };
});
