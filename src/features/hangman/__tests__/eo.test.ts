import { EO_LETTERS, fromXNotation, isEoLetter, isWordComplete, uniqueLetters } from '../eo';
import wordList from '../words-eo.json';

describe('Esperanto letter helpers', () => {
  it('knows the 28 letters of the alphabet', () => {
    expect(EO_LETTERS).toHaveLength(28);
    expect(isEoLetter('ŭ')).toBe(true);
    expect(isEoLetter('q')).toBe(false);
    expect(isEoLetter('w')).toBe(false);
  });

  it.each([
    ['c', 'ĉ'],
    ['g', 'ĝ'],
    ['h', 'ĥ'],
    ['j', 'ĵ'],
    ['s', 'ŝ'],
    ['u', 'ŭ'],
    ['S', 'ŝ'],
  ])('x-notation %sx gives %s', (base, expected) => {
    expect(fromXNotation(base, 'x')).toBe(expected);
  });

  it('rejects x-notation that is not a diacritic pair', () => {
    expect(fromXNotation('a', 'x')).toBeNull();
    expect(fromXNotation('c', 'y')).toBeNull();
  });

  it('computes unique letters and word completion', () => {
    expect([...uniqueLetters('kato')].sort()).toEqual(['a', 'k', 'o', 't']);
    expect(isWordComplete('kato', new Set(['k', 'a', 't']))).toBe(false);
    expect(isWordComplete('kato', new Set(['k', 'a', 't', 'o']))).toBe(true);
  });

  it('only contains guessable words made of Esperanto letters', () => {
    expect(wordList.length).toBeGreaterThan(100);
    for (const word of wordList) {
      expect([...word.normalize('NFC')].every(isEoLetter)).toBe(true);
    }
  });
});
