import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { AchievementNotification, AchievementNotificationContainer } from './AchievementNotification';

describe('AchievementNotification', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders achievement details correctly', () => {
    const onDismiss = vi.fn();
    render(
      <AchievementNotification 
        achievementId="cursed-consistency" 
        onDismiss={onDismiss} 
      />
    );

    expect(screen.getByText('Achievement Unlocked!')).toBeTruthy();
    expect(screen.getByText('Cursed Consistency')).toBeTruthy();
    expect(screen.getByText('Study for 7 consecutive days')).toBeTruthy();
    expect(screen.getByText('🔥')).toBeTruthy();
  });

  it('auto-dismisses after 5 seconds', () => {
    const onDismiss = vi.fn();
    render(
      <AchievementNotification 
        achievementId="demon-discipline" 
        onDismiss={onDismiss} 
      />
    );

    expect(onDismiss).not.toHaveBeenCalled();

    // Fast-forward time by 5 seconds
    vi.advanceTimersByTime(5000);

    expect(onDismiss).toHaveBeenCalledWith('demon-discipline');
  });

  it('calls onDismiss when close button is clicked', () => {
    const onDismiss = vi.fn();
    render(
      <AchievementNotification 
        achievementId="witching-hour" 
        onDismiss={onDismiss} 
      />
    );

    const closeButton = screen.getByLabelText('Dismiss notification');
    closeButton.click();

    expect(onDismiss).toHaveBeenCalledWith('witching-hour');
  });

  it('returns null for invalid achievement ID', () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <AchievementNotification 
        achievementId="invalid-achievement" 
        onDismiss={onDismiss} 
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('has proper accessibility attributes', () => {
    const onDismiss = vi.fn();
    render(
      <AchievementNotification 
        achievementId="sleepy-survivor" 
        onDismiss={onDismiss} 
      />
    );

    const notification = screen.getByRole('alert');
    expect(notification.getAttribute('aria-live')).toBe('polite');
  });
});

describe('AchievementNotificationContainer', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders multiple notifications', () => {
    const onDismiss = vi.fn();
    render(
      <AchievementNotificationContainer 
        achievements={['cursed-consistency', 'demon-discipline']} 
        onDismiss={onDismiss} 
      />
    );

    expect(screen.getAllByText('Cursed Consistency')).toHaveLength(1);
    expect(screen.getAllByText('Demon of Discipline')).toHaveLength(1);
  });

  it('renders empty container when no achievements', () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <AchievementNotificationContainer 
        achievements={[]} 
        onDismiss={onDismiss} 
      />
    );

    expect(container.querySelector('.fixed')).toBeTruthy();
    expect(screen.queryByText('Achievement Unlocked!')).toBeNull();
  });

  it('handles default empty array for achievements prop', () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <AchievementNotificationContainer onDismiss={onDismiss} />
    );

    expect(container.querySelector('.fixed')).toBeTruthy();
  });
});
