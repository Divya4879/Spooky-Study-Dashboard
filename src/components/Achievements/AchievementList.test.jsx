import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AchievementList } from './AchievementList';
import * as AppContextModule from '../../context/AppContext';

// Mock the AppContext to provide controlled test data
vi.mock('../../context/AppContext', async () => {
  const actual = await vi.importActual('../../context/AppContext');
  return {
    ...actual,
    useAppContext: vi.fn()
  };
});

describe('AchievementList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all five achievements', () => {
    const useAppContext = vi.spyOn(AppContextModule, 'useAppContext');
    
    useAppContext.mockReturnValue({
      achievements: {
        achievementState: {
          'cursed-consistency': { unlocked: false, unlockedAt: null },
          'demon-discipline': { unlocked: false, unlockedAt: null },
          'witching-hour': { unlocked: false, unlockedAt: null },
          'sleepy-survivor': { unlocked: false, unlockedAt: null },
          'mischievous-master': { unlocked: false, unlockedAt: null }
        }
      }
    });

    render(<AchievementList />);

    // Check that all achievement names are rendered
    expect(screen.getByText('Cursed Consistency')).toBeTruthy();
    expect(screen.getByText('Demon of Discipline')).toBeTruthy();
    expect(screen.getByText('Witching Hour Warrior')).toBeTruthy();
    expect(screen.getByText('Sleepy Survivor')).toBeTruthy();
    expect(screen.getByText('Mischievous Master')).toBeTruthy();
  });

  it('should display locked state for locked achievements', () => {
    const useAppContext = vi.spyOn(AppContextModule, 'useAppContext');
    
    useAppContext.mockReturnValue({
      achievements: {
        achievementState: {
          'cursed-consistency': { unlocked: false, unlockedAt: null },
          'demon-discipline': { unlocked: false, unlockedAt: null },
          'witching-hour': { unlocked: false, unlockedAt: null },
          'sleepy-survivor': { unlocked: false, unlockedAt: null },
          'mischievous-master': { unlocked: false, unlockedAt: null }
        }
      }
    });

    render(<AchievementList />);

    // Check for "Keep studying to unlock!" message (appears for each locked achievement)
    const lockedMessages = screen.getAllByText('Keep studying to unlock!');
    expect(lockedMessages.length).toBeGreaterThanOrEqual(5);
  });

  it('should display unlocked state with timestamp for unlocked achievements', () => {
    const useAppContext = vi.spyOn(AppContextModule, 'useAppContext');
    
    const unlockDate = new Date('2024-01-15T10:30:00Z').toISOString();
    
    useAppContext.mockReturnValue({
      achievements: {
        achievementState: {
          'cursed-consistency': { unlocked: true, unlockedAt: unlockDate },
          'demon-discipline': { unlocked: false, unlockedAt: null },
          'witching-hour': { unlocked: false, unlockedAt: null },
          'sleepy-survivor': { unlocked: false, unlockedAt: null },
          'mischievous-master': { unlocked: false, unlockedAt: null }
        }
      }
    });

    render(<AchievementList />);

    // Check that unlocked achievement shows unlock date
    expect(screen.getByText(/Unlocked/)).toBeTruthy();
    
    // Check that locked achievements still show locked message
    const lockedMessages = screen.getAllByText('Keep studying to unlock!');
    expect(lockedMessages.length).toBeGreaterThanOrEqual(4);
  });

  it('should display achievement descriptions', () => {
    const useAppContext = vi.spyOn(AppContextModule, 'useAppContext');
    
    useAppContext.mockReturnValue({
      achievements: {
        achievementState: {
          'cursed-consistency': { unlocked: false, unlockedAt: null },
          'demon-discipline': { unlocked: false, unlockedAt: null },
          'witching-hour': { unlocked: false, unlockedAt: null },
          'sleepy-survivor': { unlocked: false, unlockedAt: null },
          'mischievous-master': { unlocked: false, unlockedAt: null }
        }
      }
    });

    render(<AchievementList />);

    // Check that descriptions are rendered (use getAllByText since they may appear multiple times)
    expect(screen.getAllByText('Study for 7 consecutive days').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Complete 10+ sessions in 7 days').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Study between midnight and 3 AM').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Complete 3 sessions with sleepy ghost').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Experience 5 jumpscares').length).toBeGreaterThan(0);
  });

  it('should display summary stats showing unlocked count', () => {
    const useAppContext = vi.spyOn(AppContextModule, 'useAppContext');
    
    useAppContext.mockReturnValue({
      achievements: {
        achievementState: {
          'cursed-consistency': { unlocked: true, unlockedAt: new Date().toISOString() },
          'demon-discipline': { unlocked: true, unlockedAt: new Date().toISOString() },
          'witching-hour': { unlocked: false, unlockedAt: null },
          'sleepy-survivor': { unlocked: false, unlockedAt: null },
          'mischievous-master': { unlocked: false, unlockedAt: null }
        }
      }
    });

    const { container } = render(<AchievementList />);
    
    // Verify the summary section exists and contains correct information
    const summaryText = container.textContent;
    expect(summaryText).toContain('2');
    expect(summaryText).toContain('of');
    expect(summaryText).toContain('5');
    expect(summaryText).toContain('achievements unlocked');
  });
});
