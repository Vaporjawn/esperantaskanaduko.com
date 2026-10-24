import { useEffect, useRef } from 'react';
import { fromXNotation } from '../utils/eo';

/**
 * Custom hook for handling keyboard input with x-notation support
 *
 * @param onGuess - Callback function to handle letter guesses
 * @param enabled - Whether keyboard input is enabled
 */
export const useKeyboardInput = (onGuess: (letter: string) => void, enabled = true): void => {
  const prevKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      const key = event.key.toLowerCase();

      // Direct letter input (including diacritics if typed directly)
      if (key.length === 1 && /[a-zĉĝĥĵŝŭ]/i.test(key)) {
        onGuess(key);
        prevKeyRef.current = key;
        return;
      }

      // X-notation: previous base letter + 'x'
      if (prevKeyRef.current && key === 'x') {
        const diacritic = fromXNotation(prevKeyRef.current, 'x');
        if (diacritic) {
          onGuess(diacritic);
        }
        prevKeyRef.current = null;
        return;
      }

      // Update previous key for potential x-notation sequence
      if (key.length === 1) {
        prevKeyRef.current = key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onGuess, enabled]);
};
