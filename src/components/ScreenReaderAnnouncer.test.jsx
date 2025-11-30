import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ScreenReaderAnnouncer, useScreenReaderAnnouncer } from './ScreenReaderAnnouncer';
import { renderHook, act } from '@testing-library/react';

describe('ScreenReaderAnnouncer', () => {
  it('should render with polite priority by default', () => {
    const { container } = render(<ScreenReaderAnnouncer message="Test message" />);
    const announcer = container.querySelector('[role="status"]');
    
    expect(announcer).toBeTruthy();
    expect(announcer.getAttribute('aria-live')).toBe('polite');
    expect(announcer.getAttribute('aria-atomic')).toBe('true');
  });

  it('should render with assertive priority when specified', () => {
    const { container } = render(<ScreenReaderAnnouncer message="Urgent message" priority="assertive" />);
    const announcer = container.querySelector('[role="status"]');
    
    expect(announcer.getAttribute('aria-live')).toBe('assertive');
  });

  it('should update announcement when message changes', async () => {
    const { container, rerender } = render(<ScreenReaderAnnouncer message="First message" />);
    const announcer = container.querySelector('[role="status"]');
    
    await waitFor(() => {
      expect(announcer.textContent).toBe('First message');
    });

    rerender(<ScreenReaderAnnouncer message="Second message" />);
    
    await waitFor(() => {
      expect(announcer.textContent).toBe('Second message');
    });
  });

  it('should have sr-only class for screen reader only content', () => {
    const { container } = render(<ScreenReaderAnnouncer message="Test" />);
    const announcer = container.querySelector('[role="status"]');
    
    expect(announcer.classList.contains('sr-only')).toBe(true);
  });
});

describe('useScreenReaderAnnouncer', () => {
  it('should provide announce function', () => {
    const { result } = renderHook(() => useScreenReaderAnnouncer());
    
    expect(result.current.announce).toBeDefined();
    expect(typeof result.current.announce).toBe('function');
  });

  it('should update announcement when announce is called', () => {
    const { result } = renderHook(() => useScreenReaderAnnouncer());
    
    act(() => {
      result.current.announce('Test announcement');
    });
    
    expect(result.current.announcement.message).toBe('Test announcement');
    expect(result.current.announcement.priority).toBe('polite');
  });

  it('should support custom priority', () => {
    const { result } = renderHook(() => useScreenReaderAnnouncer());
    
    act(() => {
      result.current.announce('Urgent announcement', 'assertive');
    });
    
    expect(result.current.announcement.message).toBe('Urgent announcement');
    expect(result.current.announcement.priority).toBe('assertive');
  });
});
