import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ThemePalette } from './ThemePalette';
import { ThemeProvider } from '../../context/ThemeContext';
import { THEME_KEYS } from '../../constants/themes';

describe('ThemePalette', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    cleanup();
  });

  it('renders all four theme options', () => {
    render(
      <ThemeProvider>
        <ThemePalette />
      </ThemeProvider>
    );

    // Check that all four themes are rendered
    expect(screen.getByText('Vampire Crimson')).toBeTruthy();
    expect(screen.getByText('Witch Forest')).toBeTruthy();
    expect(screen.getByText('Haunted Midnight')).toBeTruthy();
    expect(screen.getByText('Graveyard')).toBeTruthy();
  });

  it('highlights the active theme', () => {
    render(
      <ThemeProvider>
        <ThemePalette />
      </ThemeProvider>
    );

    // Default theme should be vampireCrimson
    const vampireButton = screen.getByLabelText('Select Vampire Crimson theme');
    expect(vampireButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('changes theme when a theme button is clicked', () => {
    render(
      <ThemeProvider>
        <ThemePalette />
      </ThemeProvider>
    );

    // Click on Witch Forest theme
    const witchButton = screen.getByLabelText('Select Witch Forest theme');
    fireEvent.click(witchButton);

    // Witch Forest should now be active
    expect(witchButton.getAttribute('aria-pressed')).toBe('true');
    
    // Vampire Crimson should no longer be active
    const vampireButton = screen.getByLabelText('Select Vampire Crimson theme');
    expect(vampireButton.getAttribute('aria-pressed')).toBe('false');
  });

  it('displays color preview swatches for each theme', () => {
    render(
      <ThemeProvider>
        <ThemePalette />
      </ThemeProvider>
    );

    // Each theme button should have 3 color swatches
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(THEME_KEYS.length);
    
    buttons.forEach(button => {
      const swatches = button.querySelectorAll('.w-5.h-5.rounded-full');
      expect(swatches).toHaveLength(3);
    });
  });

  it('persists theme selection to localStorage', () => {
    render(
      <ThemeProvider>
        <ThemePalette />
      </ThemeProvider>
    );

    // Click on Witch Forest theme
    const witchButton = screen.getByLabelText('Select Witch Forest theme');
    fireEvent.click(witchButton);

    // Check that theme was saved to localStorage
    const savedTheme = localStorage.getItem('theme');
    expect(savedTheme).toBe('"witchForest"');
  });

  it('has proper accessibility attributes', () => {
    render(
      <ThemeProvider>
        <ThemePalette />
      </ThemeProvider>
    );

    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      // Each button should have aria-label
      expect(button.getAttribute('aria-label')).toBeTruthy();
      // Each button should have aria-pressed
      expect(button.getAttribute('aria-pressed')).toBeTruthy();
    });
  });
});
