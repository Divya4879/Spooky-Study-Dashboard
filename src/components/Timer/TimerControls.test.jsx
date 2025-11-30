import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TimerControls } from './TimerControls';

describe('TimerControls', () => {
  let mockOnStart;
  let mockOnPause;
  let mockOnReset;

  beforeEach(() => {
    mockOnStart = vi.fn();
    mockOnPause = vi.fn();
    mockOnReset = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Button rendering', () => {
    it('should render Start button when timer is not active', () => {
      render(
        <TimerControls
          isActive={false}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      expect(screen.getByRole('button', { name: /start timer/i })).toBeTruthy();
      expect(screen.queryByRole('button', { name: /pause timer/i })).toBeNull();
    });

    it('should render Pause button when timer is active', () => {
      render(
        <TimerControls
          isActive={true}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      expect(screen.getByRole('button', { name: /pause timer/i })).toBeTruthy();
      expect(screen.queryByRole('button', { name: /start timer/i })).toBeNull();
    });

    it('should always render Reset button', () => {
      const { rerender } = render(
        <TimerControls
          isActive={false}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      expect(screen.getByRole('button', { name: /reset timer/i })).toBeTruthy();

      rerender(
        <TimerControls
          isActive={true}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      expect(screen.getByRole('button', { name: /reset timer/i })).toBeTruthy();
    });
  });

  describe('Button interactions', () => {
    it('should call onStart when Start button is clicked', () => {
      render(
        <TimerControls
          isActive={false}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /start timer/i }));
      expect(mockOnStart).toHaveBeenCalledTimes(1);
    });

    it('should call onPause when Pause button is clicked', () => {
      render(
        <TimerControls
          isActive={true}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /pause timer/i }));
      expect(mockOnPause).toHaveBeenCalledTimes(1);
    });

    it('should call onReset when Reset button is clicked', () => {
      render(
        <TimerControls
          isActive={false}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /reset timer/i }));
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard accessibility', () => {
    it('should call onStart when Enter key is pressed and timer is not active', () => {
      render(
        <TimerControls
          isActive={false}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      fireEvent.keyDown(window, { key: 'Enter' });
      expect(mockOnStart).toHaveBeenCalledTimes(1);
    });

    it('should call onPause when Enter key is pressed and timer is active', () => {
      render(
        <TimerControls
          isActive={true}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      fireEvent.keyDown(window, { key: 'Enter' });
      expect(mockOnPause).toHaveBeenCalledTimes(1);
    });

    it('should call onStart when Space bar is pressed and timer is not active', () => {
      render(
        <TimerControls
          isActive={false}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      fireEvent.keyDown(window, { key: ' ' });
      expect(mockOnStart).toHaveBeenCalledTimes(1);
    });

    it('should call onPause when Space bar is pressed and timer is active', () => {
      render(
        <TimerControls
          isActive={true}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      fireEvent.keyDown(window, { key: ' ' });
      expect(mockOnPause).toHaveBeenCalledTimes(1);
    });

    it('should not trigger keyboard shortcuts when focus is on a button', () => {
      render(
        <TimerControls
          isActive={false}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const startButton = screen.getByRole('button', { name: /start timer/i });
      fireEvent.keyDown(startButton, { key: 'Enter' });
      
      // Should not call onStart via keyboard handler (button's native behavior handles it)
      expect(mockOnStart).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility attributes', () => {
    it('should have proper ARIA labels on all buttons', () => {
      render(
        <TimerControls
          isActive={false}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const startButton = screen.getByRole('button', { name: /start timer/i });
      const resetButton = screen.getByRole('button', { name: /reset timer/i });
      
      expect(startButton.getAttribute('aria-label')).toBe('Start timer');
      expect(resetButton.getAttribute('aria-label')).toBe('Reset timer');
    });

    it('should have focus indicators (focus:ring classes)', () => {
      render(
        <TimerControls
          isActive={false}
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const startButton = screen.getByRole('button', { name: /start timer/i });
      expect(startButton.className).toContain('focus:ring');
    });
  });
});
