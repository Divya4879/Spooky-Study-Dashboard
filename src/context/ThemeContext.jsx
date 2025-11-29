import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEMES, DEFAULT_THEME, THEME_KEYS } from '../constants/themes';
import { saveToStorage, loadFromStorage } from '../utils/storage';

/**
 * ThemeContext provides theme management functionality across the application
 * Handles theme selection, persistence, and CSS variable application
 */
const ThemeContext = createContext(undefined);

/**
 * Custom hook to access theme context
 * @returns {Object} Theme context value with currentTheme, setTheme, and themes
 * @throws {Error} If used outside of ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * ThemeProvider component that manages theme state and persistence
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ThemeProvider({ children }) {
  // Load theme from localStorage or use default
  const [currentTheme, setCurrentThemeState] = useState(() => {
    const savedTheme = loadFromStorage('theme', DEFAULT_THEME);
    // Validate that the saved theme exists
    return THEME_KEYS.includes(savedTheme) ? savedTheme : DEFAULT_THEME;
  });

  /**
   * Sets the current theme and persists to localStorage
   * @param {string} themeKey - The key of the theme to apply
   */
  const setTheme = (themeKey) => {
    if (!THEME_KEYS.includes(themeKey)) {
      console.warn(`Invalid theme key: ${themeKey}. Using default theme.`);
      themeKey = DEFAULT_THEME;
    }
    
    setCurrentThemeState(themeKey);
    saveToStorage('theme', themeKey);
  };

  /**
   * Apply theme colors to CSS variables whenever the theme changes
   */
  useEffect(() => {
    const theme = THEMES[currentTheme];
    const root = document.documentElement;

    // Apply each color as a CSS custom property
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-text', theme.text);
  }, [currentTheme]);

  const value = {
    currentTheme,
    setTheme,
    themes: THEMES,
    themeKeys: THEME_KEYS,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
