import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { THEMES, DEFAULT_THEME } from '../constants/themes';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;

// Test component that uses the theme context
function TestComponent() {
  const { currentTheme, setTheme, themes, themeKeys } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{currentTheme}</div>
      <div data-testid="theme-name">{themes[currentTheme].name}</div>
      <button onClick={() => setTheme('vampireCrimson')}>
        Change to Vampire Crimson
      </button>
      <div data-testid="theme-keys">{themeKeys.join(',')}</div>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    // Clear CSS variables
    document.documentElement.style.cssText = '';
  });

  afterEach(() => {
    cleanup();
  });

  it('should provide default theme when no theme is saved', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme').textContent).toBe(DEFAULT_THEME);
  });

  it('should load saved theme from localStorage', () => {
    localStorage.setItem('theme', JSON.stringify('vampireCrimson'));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme').textContent).toBe('vampireCrimson');
    expect(screen.getByTestId('theme-name').textContent).toBe('Vampire Crimson');
  });

  it('should change theme and persist to localStorage', () => {
    const { container } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Change to Vampire Crimson');
    
    act(() => {
      button.click();
    });

    expect(screen.getByTestId('current-theme').textContent).toBe('vampireCrimson');
    
    const saved = JSON.parse(localStorage.getItem('theme'));
    expect(saved).toBe('vampireCrimson');
  });

  it('should apply theme colors to CSS variables', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const root = document.documentElement;
    const theme = THEMES[DEFAULT_THEME];

    expect(root.style.getPropertyValue('--color-primary')).toBe(theme.primary);
    expect(root.style.getPropertyValue('--color-secondary')).toBe(theme.secondary);
    expect(root.style.getPropertyValue('--color-accent')).toBe(theme.accent);
    expect(root.style.getPropertyValue('--color-background')).toBe(theme.background);
    expect(root.style.getPropertyValue('--color-text')).toBe(theme.text);
  });

  it('should update CSS variables when theme changes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Change to Vampire Crimson');
    
    act(() => {
      button.click();
    });

    const root = document.documentElement;
    const theme = THEMES.vampireCrimson;

    expect(root.style.getPropertyValue('--color-primary')).toBe(theme.primary);
    expect(root.style.getPropertyValue('--color-secondary')).toBe(theme.secondary);
    expect(root.style.getPropertyValue('--color-accent')).toBe(theme.accent);
    expect(root.style.getPropertyValue('--color-background')).toBe(theme.background);
    expect(root.style.getPropertyValue('--color-text')).toBe(theme.text);
  });

  it('should provide all theme keys', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeKeys = screen.getByTestId('theme-keys').textContent.split(',');
    expect(themeKeys).toContain('vampireCrimson');
    expect(themeKeys).toContain('witchForest');
    expect(themeKeys).toContain('hauntedMidnight');
    expect(themeKeys).toContain('graveyard');
  });

  it('should use default theme for invalid saved theme', () => {
    localStorage.setItem('theme', JSON.stringify('invalidTheme'));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme').textContent).toBe(DEFAULT_THEME);
  });

  it('should throw error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });
});
