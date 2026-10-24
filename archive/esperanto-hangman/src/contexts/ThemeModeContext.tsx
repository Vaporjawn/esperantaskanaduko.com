import { createContext, useContext } from 'react';
import type { PaletteMode } from '@mui/material';

interface ThemeModeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
  setThemeMode: (mode: PaletteMode) => void;
}

export const ThemeModeContext = createContext<ThemeModeContextType | null>(null);

/**
 * Custom hook for accessing theme mode context
 * Must be used within ThemeModeProvider
 */
export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return context;
};
