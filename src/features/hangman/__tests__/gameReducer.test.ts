import { createInitialState, hangmanReducer } from '../gameReducer';
import type { GameStats, HangmanState } from '../types';

const NO_STATS: GameStats = { games: 0, wins: 0, streak: 0 };

const start = (secret: string, maxMistakes = 6, stats: GameStats = NO_STATS): HangmanState =>
  createInitialState(secret, stats, maxMistakes);

const guessAll = (state: HangmanState, letters: string): HangmanState =>
  [...letters].reduce((s, letter) => hangmanReducer(s, { type: 'guess', letter }), state);

describe('hangmanReducer', () => {
  it('records a correct guess without adding a mistake', () => {
    const next = hangmanReducer(start('kato'), { type: 'guess', letter: 'k' });
    expect(next.guessed.has('k')).toBe(true);
    expect(next.wrong.size).toBe(0);
    expect(next.phase).toBe('playing');
  });

  it('records a wrong guess as a mistake', () => {
    const next = hangmanReducer(start('kato'), { type: 'guess', letter: 'z' });
    expect(next.wrong.has('z')).toBe(true);
    expect(next.guessed.size).toBe(0);
  });

  it('ignores a letter that was already tried', () => {
    const once = hangmanReducer(start('kato'), { type: 'guess', letter: 'z' });
    const twice = hangmanReducer(once, { type: 'guess', letter: 'z' });
    expect(twice).toBe(once);
  });

  it('is case-insensitive and treats decomposed diacritics like precomposed ones', () => {
    // "c" + U+0302 (combining circumflex) is the decomposed form of "ĉ"
    const next = hangmanReducer(start('ĉevalo'), { type: 'guess', letter: 'Ĉ' });
    expect(next.guessed.has('ĉ')).toBe(true);
  });

  it('wins once every letter is guessed and updates the stats', () => {
    const won = guessAll(start('kato'), 'kato');
    expect(won.phase).toBe('won');
    expect(won.stats).toEqual({ games: 1, wins: 1, streak: 1 });
  });

  it('loses after maxMistakes wrong guesses and resets the streak', () => {
    const lost = guessAll(start('kato', 3, { games: 4, wins: 3, streak: 3 }), 'xyz');
    expect(lost.phase).toBe('lost');
    expect(lost.stats).toEqual({ games: 5, wins: 3, streak: 0 });
  });

  it('ignores guesses once the game is over', () => {
    const won = guessAll(start('ab'), 'ab');
    const after = hangmanReducer(won, { type: 'guess', letter: 'z' });
    expect(after).toBe(won);
    expect(after.stats.games).toBe(1);
  });

  it('newGame keeps stats and settings but clears guesses', () => {
    const won = guessAll(start('ab', 4), 'ab');
    const fresh = hangmanReducer(won, { type: 'newGame', secret: 'hundo' });
    expect(fresh.secret).toBe('hundo');
    expect(fresh.phase).toBe('playing');
    expect(fresh.guessed.size + fresh.wrong.size).toBe(0);
    expect(fresh.maxMistakes).toBe(4);
    expect(fresh.stats).toEqual(won.stats);
  });
});
