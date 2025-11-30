import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { GhostSelector } from './GhostSelector';
import { AppProvider } from '../../context/AppContext';
import { ThemeProvider } from '../../context/ThemeContext';

describe('GhostSelector', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    cleanup();
  });

  const renderWithProviders = () => {
    return render(
      <ThemeProvider>
        <AppProvider>
          <GhostSelector />
        </AppProvider>
      </ThemeProvider>
    );
  };

  it('renders all five ghost variants', () => {
    renderWithProviders();
    
    // Check that all ghost names are displayed
    expect(screen.getByText('Baby Ghost')).toBeTruthy();
    expect(screen.getByText('Witch Ghost')).toBeTruthy();
    expect(screen.getByText('Vampire')).toBeTruthy();
    expect(screen.getByText('Werewolf')).toBeTruthy();
    expect(screen.getByText('Angel')).toBeTruthy();
  });

  it('displays the heading', () => {
    renderWithProviders();
    expect(screen.getByText('Choose Your Ghost Companion')).toBeTruthy();
  });

  it('highlights the active ghost variant', () => {
    renderWithProviders();
    
    const babyGhostButton = screen.getByLabelText('Select Baby Ghost ghost companion');
    expect(babyGhostButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('changes ghost variant when a ghost button is clicked', () => {
    renderWithProviders();
    
    // Click on Vampire ghost
    const vampireButton = screen.getByLabelText('Select Vampire ghost companion');
    fireEvent.click(vampireButton);

    // Vampire should now be active
    expect(vampireButton.getAttribute('aria-pressed')).toBe('true');
    
    // Baby Ghost should no longer be active
    const babyGhostButton = screen.getByLabelText('Select Baby Ghost ghost companion');
    expect(babyGhostButton.getAttribute('aria-pressed')).toBe('false');
  });

  it('renders ghost descriptions', () => {
    renderWithProviders();
    
    expect(screen.getByText('A cute and innocent little ghost')).toBeTruthy();
    expect(screen.getByText('A spooky ghost with magical powers')).toBeTruthy();
    expect(screen.getByText('A sophisticated creature of the night')).toBeTruthy();
    expect(screen.getByText('A fierce and loyal companion')).toBeTruthy();
    expect(screen.getByText('A heavenly guardian watching over you')).toBeTruthy();
  });

  it('persists ghost variant selection to localStorage', () => {
    renderWithProviders();
    
    // Click on Werewolf ghost
    const werewolfButton = screen.getByLabelText('Select Werewolf ghost companion');
    fireEvent.click(werewolfButton);

    // Check that ghost variant was saved to localStorage
    const savedPreferences = JSON.parse(localStorage.getItem('preferences'));
    expect(savedPreferences.ghostVariant).toBe('werewolf');
  });

  it('has proper accessibility attributes', () => {
    renderWithProviders();

    const buttons = screen.getAllByRole('button');
    
    // Should have 5 ghost buttons
    expect(buttons.length).toBeGreaterThanOrEqual(5);
    
    // Each ghost button should have aria-label and aria-pressed
    const ghostButtons = buttons.filter(btn => 
      btn.getAttribute('aria-label')?.includes('ghost companion')
    );
    
    expect(ghostButtons).toHaveLength(5);
    
    ghostButtons.forEach(button => {
      expect(button.getAttribute('aria-label')).toBeTruthy();
      expect(button.getAttribute('aria-pressed')).toBeTruthy();
    });
  });
});
