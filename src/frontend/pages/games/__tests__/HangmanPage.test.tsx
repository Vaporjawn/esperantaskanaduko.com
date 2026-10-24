import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HangmanPage from '../HangmanPage';

jest.mock('../../../../features/hangman/words', () => ({
  pickRandomWord: jest.fn(() => 'kato'),
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <HangmanPage />
    </MemoryRouter>
  );

const slots = () => screen.getByRole('group', { name: 'Word to guess' }).children;

describe('HangmanPage', () => {
  beforeEach(() => localStorage.clear());

  it('starts with a blank slot per letter and a 28-letter keyboard', () => {
    renderPage();
    expect(slots()).toHaveLength(4);
    const keyboard = screen.getByRole('group', { name: 'Esperanto keyboard' });
    expect(keyboard.querySelectorAll('button')).toHaveLength(28);
  });

  it('reveals a letter when it is clicked on the on-screen keyboard', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'letter k' }));
    expect(screen.getByRole('img', { name: 'letter k' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'letter k' })).toBeDisabled();
  });

  it('accepts typed letters and counts wrong ones', () => {
    renderPage();
    act(() => {
      fireEvent.keyDown(window, { key: 'z' });
    });
    expect(screen.getByRole('button', { name: 'letter z' })).toBeDisabled();
    expect(screen.getByRole('img', { name: /Hangman with/ })).toBeInTheDocument();
  });

  it('shows the win message and saves stats once the word is complete', () => {
    renderPage();
    for (const letter of 'kato') {
      fireEvent.click(screen.getByRole('button', { name: `letter ${letter}` }));
    }
    expect(screen.getByText('🎉 You won!')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('ehm-stats') ?? '{}')).toEqual({ games: 1, wins: 1, streak: 1 });
  });

  it('reveals the word after six mistakes', () => {
    renderPage();
    for (const letter of 'bcdefg') {
      fireEvent.click(screen.getByRole('button', { name: `letter ${letter}` }));
    }
    expect(screen.getByText('kato')).toBeInTheDocument();
    expect(screen.getByText(/You lost/)).toBeInTheDocument();
  });
});
