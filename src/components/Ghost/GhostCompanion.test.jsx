import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { GhostCompanion } from './GhostCompanion';
import { AppProvider } from '../../context/AppContext';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}));

describe('GhostCompanion', () => {
  afterEach(() => {
    cleanup();
  });

  const renderWithContext = (component) => {
    return render(
      <AppProvider>
        {component}
      </AppProvider>
    );
  };

  it('renders the ghost companion', () => {
    renderWithContext(<GhostCompanion />);
    
    // Should display ghost name (default is baby-ghost)
    expect(screen.getByText('Baby Ghost')).toBeTruthy();
  });

  it('displays the ghost description', () => {
    renderWithContext(<GhostCompanion />);
    
    expect(screen.getByText('A cute and innocent little ghost')).toBeTruthy();
  });

  it('shows idle status when timer is not active', () => {
    renderWithContext(<GhostCompanion />);
    
    expect(screen.getByText('Ready')).toBeTruthy();
  });

  it('displays the current emotion', () => {
    renderWithContext(<GhostCompanion />);
    
    // Default emotion is sleepy - text is split across elements
    expect(screen.getByText((content, element) => {
      return element.textContent === 'Feeling: sleepy';
    })).toBeTruthy();
  });
});
