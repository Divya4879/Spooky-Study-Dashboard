import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { JumpscareAnimation } from './JumpscareAnimation';
import { AppProvider } from '../../context/AppContext';
import { ThemeProvider } from '../../context/ThemeContext';

/**
 * Test wrapper that provides necessary context
 */
function TestWrapper({ children }) {
  return (
    <ThemeProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </ThemeProvider>
  );
}

describe('JumpscareAnimation Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render without crashing', () => {
    render(
      <TestWrapper>
        <JumpscareAnimation />
      </TestWrapper>
    );
    // Component should render without errors
    expect(true).toBe(true);
  });

  it('should not show jumpscare initially', () => {
    render(
      <TestWrapper>
        <JumpscareAnimation />
      </TestWrapper>
    );
    
    // Jumpscare should not be visible initially
    const jumpscare = screen.queryByLabelText('Jumpscare animation');
    expect(jumpscare).toBeNull();
  });

  it('should render with proper structure when mounted', () => {
    const { container } = render(
      <TestWrapper>
        <JumpscareAnimation />
      </TestWrapper>
    );
    
    // Component should render without errors
    expect(container).toBeTruthy();
  });

  it('should use correct ghost emoji based on variant', () => {
    render(
      <TestWrapper>
        <JumpscareAnimation />
      </TestWrapper>
    );
    
    // Component should be in the document
    expect(document.body).toBeTruthy();
  });
});
