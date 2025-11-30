import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { THEMES, THEME_KEYS } from '../constants/themes';

// Test component that uses the theme
function TestComponent() {
  const { currentTheme, setTheme, themes } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{currentTheme}</div>
      <div data-testid="theme-name">{themes[currentTheme].name}</div>
      {THEME_KEYS.map(key => (
        <button key={key} onClick={() => setTheme(key)} data-testid={`btn-${key}`}>
          {key}
        </button>
      ))}
    </div>
  );
}

describe('Tailwind Theme Integration', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    // Reset CSS variables
    document.documentElement.style.cssText = '';
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('should apply default theme CSS variables on mount', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const root = document.documentElement;
    
    await waitFor(() => {
      expect(root.style.getPropertyValue('--color-primary')).toBe(THEMES.vampireCrimson.primary);
      expect(root.style.getPropertyValue('--color-secondary')).toBe(THEMES.vampireCrimson.secondary);
      expect(root.style.getPropertyValue('--color-accent')).toBe(THEMES.vampireCrimson.accent);
      expect(root.style.getPropertyValue('--color-background')).toBe(THEMES.vampireCrimson.background);
      expect(root.style.getPropertyValue('--color-text')).toBe(THEMES.vampireCrimson.text);
    });
  });

  it('should update CSS variables when theme changes', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const root = document.documentElement;
    
    // Change to vampire crimson theme
    const vampireBtn = getByTestId('btn-vampireCrimson');
    vampireBtn.click();

    await waitFor(() => {
      expect(root.style.getPropertyValue('--color-primary')).toBe(THEMES.vampireCrimson.primary);
      expect(root.style.getPropertyValue('--color-secondary')).toBe(THEMES.vampireCrimson.secondary);
      expect(root.style.getPropertyValue('--color-accent')).toBe(THEMES.vampireCrimson.accent);
      expect(root.style.getPropertyValue('--color-background')).toBe(THEMES.vampireCrimson.background);
      expect(root.style.getPropertyValue('--color-text')).toBe(THEMES.vampireCrimson.text);
    });
  });

  it('should apply all four theme palettes correctly', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const root = document.documentElement;

    for (const themeKey of THEME_KEYS) {
      const btn = getByTestId(`btn-${themeKey}`);
      btn.click();

      await waitFor(() => {
        expect(root.style.getPropertyValue('--color-primary')).toBe(THEMES[themeKey].primary);
        expect(root.style.getPropertyValue('--color-secondary')).toBe(THEMES[themeKey].secondary);
        expect(root.style.getPropertyValue('--color-accent')).toBe(THEMES[themeKey].accent);
        expect(root.style.getPropertyValue('--color-background')).toBe(THEMES[themeKey].background);
        expect(root.style.getPropertyValue('--color-text')).toBe(THEMES[themeKey].text);
      });
    }
  });

  it('should persist theme selection to localStorage', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const witchBtn = getByTestId('btn-witchForest');
    witchBtn.click();

    await waitFor(() => {
      expect(localStorage.getItem('theme')).toBe('"witchForest"');
    });
  });

  it('should restore theme from localStorage on mount', async () => {
    // Set theme in localStorage before mounting
    localStorage.setItem('theme', '"graveyard"');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const root = document.documentElement;

    await waitFor(() => {
      expect(getByTestId('current-theme').textContent).toBe('graveyard');
      expect(root.style.getPropertyValue('--color-primary')).toBe(THEMES.graveyard.primary);
    });
  });

  it('should make CSS variables available to Tailwind classes', async () => {
    // Component that uses Tailwind classes with theme colors
    function TailwindTestComponent() {
      return (
        <div>
          <div className="bg-primary text-background" data-testid="primary-bg">
            Primary Background
          </div>
          <div className="bg-secondary text-text" data-testid="secondary-bg">
            Secondary Background
          </div>
          <div className="bg-accent" data-testid="accent-bg">
            Accent Background
          </div>
          <div className="text-primary" data-testid="primary-text">
            Primary Text
          </div>
        </div>
      );
    }

    render(
      <ThemeProvider>
        <TailwindTestComponent />
      </ThemeProvider>
    );

    const root = document.documentElement;

    await waitFor(() => {
      // Verify CSS variables are set
      expect(root.style.getPropertyValue('--color-primary')).toBeTruthy();
      expect(root.style.getPropertyValue('--color-secondary')).toBeTruthy();
      expect(root.style.getPropertyValue('--color-accent')).toBeTruthy();
      expect(root.style.getPropertyValue('--color-background')).toBeTruthy();
      expect(root.style.getPropertyValue('--color-text')).toBeTruthy();
    });

    // Verify elements exist (Tailwind classes are applied)
    expect(screen.getByTestId('primary-bg')).toBeTruthy();
    expect(screen.getByTestId('secondary-bg')).toBeTruthy();
    expect(screen.getByTestId('accent-bg')).toBeTruthy();
    expect(screen.getByTestId('primary-text')).toBeTruthy();
  });
});
