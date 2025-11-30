/**
 * Tests for achievement utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { checkAchievementCondition, checkAchievements, getNewlyUnlockedAchievements } from './achievements.js';
import { ACHIEVEMENTS } from '../constants/achievements.js';
import * as fc from 'fast-check';

describe('Achievement Utilities', () => {
  it('should check all achievement conditions and return updated state', () => {
    const appData = {
      sessionHistory: [
        {
          startTime: new Date('2024-01-01T01:00:00').toISOString(),
          duration: 45,
          completed: true,
          ghostEmotion: 'sleepy',
        },
        {
          startTime: new Date('2024-01-02T10:00:00').toISOString(),
          duration: 30,
          completed: true,
          ghostEmotion: 'sleepy',
        },
        {
          startTime: new Date('2024-01-03T10:00:00').toISOString(),
          duration: 30,
          completed: true,
          ghostEmotion: 'sleepy',
        },
      ],
      mischiefCount: 5,
    };

    const result = checkAchievements(appData);

    // Should unlock Witching Hour Warrior (session between 00:00-03:00)
    expect(result['witching-hour'].unlocked).toBe(true);
    
    // Should unlock Sleepy Survivor (3 sessions with sleepy ghost)
    expect(result['sleepy-survivor'].unlocked).toBe(true);
    
    // Should unlock Mischievous Master (mischief count >= 5)
    expect(result['mischievous-master'].unlocked).toBe(true);
    
    // Should not unlock Cursed Consistency (only 3 consecutive days, need 7)
    expect(result['cursed-consistency'].unlocked).toBe(false);
    
    // Should not unlock Demon of Discipline (only 3 sessions, need 10 in 7 days)
    expect(result['demon-discipline'].unlocked).toBe(false);
  });

  it('should detect newly unlocked achievements', () => {
    const oldState = {
      'witching-hour': { unlocked: false, unlockedAt: null },
      'sleepy-survivor': { unlocked: false, unlockedAt: null },
    };

    const newState = {
      'witching-hour': { unlocked: true, unlockedAt: '2024-01-01T00:00:00Z' },
      'sleepy-survivor': { unlocked: false, unlockedAt: null },
    };

    const newlyUnlocked = getNewlyUnlockedAchievements(oldState, newState);

    expect(newlyUnlocked).toEqual(['witching-hour']);
  });

  it('should not re-unlock already unlocked achievements', () => {
    const appData = {
      sessionHistory: [
        {
          startTime: new Date('2024-01-01T01:00:00').toISOString(),
          duration: 45,
          completed: true,
          ghostEmotion: 'sleepy',
        },
      ],
      mischiefCount: 5,
    };

    const currentState = {
      'witching-hour': { unlocked: true, unlockedAt: '2024-01-01T00:00:00Z' },
    };

    const result = checkAchievements(appData, currentState);

    // Should remain unlocked with same timestamp
    expect(result['witching-hour'].unlocked).toBe(true);
    expect(result['witching-hour'].unlockedAt).toBe('2024-01-01T00:00:00Z');
  });
});

// Property-Based Tests

describe('Property-Based Tests', () => {
  // Clean up localStorage before and after each test
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  /**
   * Feature: spooky-study-dashboard, Property 12: Cursed Consistency achievement
   * Validates: Requirements 6.1
   * 
   * For any session history with at least one completed session on each of 7 consecutive days,
   * the "Cursed Consistency" achievement should be unlocked.
   */
  it('Property 12: Cursed Consistency achievement - should unlock for 7 consecutive days', () => {
    fc.assert(
      fc.property(
        // Generator for number of consecutive days (7-14)
        fc.integer({ min: 7, max: 14 }),
        // Generator for session durations (25-90 minutes)
        fc.array(fc.integer({ min: 25, max: 90 }), { minLength: 7, maxLength: 14 }),
        // Generator for ghost emotions
        fc.array(fc.constantFrom('sleepy', 'mischievous'), { minLength: 7, maxLength: 14 }),
        (numDays, durations, emotions) => {
          // Create session history with exactly one session per day for consecutive days
          const sessionHistory = [];
          const baseDate = new Date('2024-01-01T10:00:00Z');
          
          for (let i = 0; i < numDays; i++) {
            const sessionDate = new Date(baseDate);
            sessionDate.setDate(sessionDate.getDate() + i);
            
            sessionHistory.push({
              startTime: sessionDate.toISOString(),
              duration: durations[i % durations.length],
              completed: true,
              ghostEmotion: emotions[i % emotions.length],
            });
          }
          
          const appData = {
            sessionHistory,
            mischiefCount: 0,
          };
          
          const result = checkAchievements(appData);
          
          // If we have at least 7 consecutive days with completed sessions,
          // the Cursed Consistency achievement should be unlocked
          expect(result['cursed-consistency'].unlocked).toBe(true);
          expect(result['cursed-consistency'].unlockedAt).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: spooky-study-dashboard, Property 13: Demon of Discipline achievement
   * Validates: Requirements 6.2
   * 
   * For any session history, if there are 10 or more completed sessions within any 7-day period,
   * the "Demon of Discipline" achievement should be unlocked.
   */
  it('Property 13: Demon of Discipline achievement - should unlock for 10+ sessions in 7 days', () => {
    fc.assert(
      fc.property(
        // Generator for number of sessions (10-20 to ensure we meet the threshold)
        fc.integer({ min: 10, max: 20 }),
        // Generator for session durations (25-90 minutes)
        fc.array(fc.integer({ min: 25, max: 90 }), { minLength: 10, maxLength: 20 }),
        // Generator for ghost emotions
        fc.array(fc.constantFrom('sleepy', 'mischievous'), { minLength: 10, maxLength: 20 }),
        (numSessions, durations, emotions) => {
          // Create session history with sessions spread within the last 7 days from now
          const sessionHistory = [];
          const now = new Date();
          
          for (let i = 0; i < numSessions; i++) {
            const sessionDate = new Date(now);
            // Spread sessions within the last 6 days (0-6 days ago)
            const daysAgo = Math.floor((i / numSessions) * 6);
            sessionDate.setDate(sessionDate.getDate() - daysAgo);
            sessionDate.setHours(10 + (i % 12), 0, 0, 0); // Vary hours to avoid conflicts
            
            sessionHistory.push({
              startTime: sessionDate.toISOString(),
              duration: durations[i % durations.length],
              completed: true,
              ghostEmotion: emotions[i % emotions.length],
            });
          }
          
          const appData = {
            sessionHistory,
            mischiefCount: 0,
          };
          
          const result = checkAchievements(appData);
          
          // If we have 10 or more completed sessions within the last 7 days,
          // the Demon of Discipline achievement should be unlocked
          expect(result['demon-discipline'].unlocked).toBe(true);
          expect(result['demon-discipline'].unlockedAt).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: spooky-study-dashboard, Property 14: Witching Hour Warrior achievement
   * Validates: Requirements 6.3
   * 
   * For any session history, if there is at least one completed session with start time between 00:00 and 03:00,
   * the "Witching Hour Warrior" achievement should be unlocked.
   */
  it('Property 14: Witching Hour Warrior achievement - should unlock for sessions between midnight and 3 AM', () => {
    fc.assert(
      fc.property(
        // Generator for number of sessions (1-10)
        fc.integer({ min: 1, max: 10 }),
        // Generator for session durations (25-90 minutes)
        fc.array(fc.integer({ min: 25, max: 90 }), { minLength: 1, maxLength: 10 }),
        // Generator for ghost emotions
        fc.array(fc.constantFrom('sleepy', 'mischievous'), { minLength: 1, maxLength: 10 }),
        // Generator for hour in witching hour range (0-2, since endHour is exclusive)
        fc.integer({ min: 0, max: 2 }),
        // Generator for minutes (0-59)
        fc.integer({ min: 0, max: 59 }),
        (numSessions, durations, emotions, witchingHour, witchingMinute) => {
          // Create session history with at least one session in the witching hour (00:00-03:00)
          const sessionHistory = [];
          const baseDate = new Date('2024-01-01');
          
          // First session is in the witching hour
          const witchingSession = new Date(baseDate);
          witchingSession.setHours(witchingHour, witchingMinute, 0, 0);
          
          sessionHistory.push({
            startTime: witchingSession.toISOString(),
            duration: durations[0],
            completed: true,
            ghostEmotion: emotions[0],
          });
          
          // Add additional sessions at random times (not in witching hour)
          for (let i = 1; i < numSessions; i++) {
            const sessionDate = new Date(baseDate);
            sessionDate.setDate(sessionDate.getDate() + i);
            // Set to a time outside witching hour (10 AM + offset)
            sessionDate.setHours(10 + (i % 12), 0, 0, 0);
            
            sessionHistory.push({
              startTime: sessionDate.toISOString(),
              duration: durations[i % durations.length],
              completed: true,
              ghostEmotion: emotions[i % emotions.length],
            });
          }
          
          const appData = {
            sessionHistory,
            mischiefCount: 0,
          };
          
          const result = checkAchievements(appData);
          
          // If we have at least one completed session between 00:00 and 03:00,
          // the Witching Hour Warrior achievement should be unlocked
          expect(result['witching-hour'].unlocked).toBe(true);
          expect(result['witching-hour'].unlockedAt).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: spooky-study-dashboard, Property 15: Sleepy Survivor achievement
   * Validates: Requirements 6.4
   * 
   * For any session history, if there are 3 or more completed sessions with ghost emotion 'sleepy',
   * the "Sleepy Survivor" achievement should be unlocked.
   */
  it('Property 15: Sleepy Survivor achievement - should unlock for 3+ sessions with sleepy ghost', () => {
    fc.assert(
      fc.property(
        // Generator for number of sleepy sessions (3-10 to ensure we meet the threshold)
        fc.integer({ min: 3, max: 10 }),
        // Generator for number of additional non-sleepy sessions (0-5)
        fc.integer({ min: 0, max: 5 }),
        // Generator for session durations (25-90 minutes)
        fc.array(fc.integer({ min: 25, max: 90 }), { minLength: 3, maxLength: 15 }),
        (numSleepySessions, numOtherSessions, durations) => {
          // Create session history with at least 3 sessions with 'sleepy' emotion
          const sessionHistory = [];
          const baseDate = new Date('2024-01-01T10:00:00Z');
          
          // Add sleepy sessions
          for (let i = 0; i < numSleepySessions; i++) {
            const sessionDate = new Date(baseDate);
            sessionDate.setDate(sessionDate.getDate() + i);
            
            sessionHistory.push({
              startTime: sessionDate.toISOString(),
              duration: durations[i % durations.length],
              completed: true,
              ghostEmotion: 'sleepy',
            });
          }
          
          // Add additional sessions with 'mischievous' emotion
          for (let i = 0; i < numOtherSessions; i++) {
            const sessionDate = new Date(baseDate);
            sessionDate.setDate(sessionDate.getDate() + numSleepySessions + i);
            
            sessionHistory.push({
              startTime: sessionDate.toISOString(),
              duration: durations[(numSleepySessions + i) % durations.length],
              completed: true,
              ghostEmotion: 'mischievous',
            });
          }
          
          const appData = {
            sessionHistory,
            mischiefCount: 0,
          };
          
          const result = checkAchievements(appData);
          
          // If we have 3 or more completed sessions with 'sleepy' emotion,
          // the Sleepy Survivor achievement should be unlocked
          expect(result['sleepy-survivor'].unlocked).toBe(true);
          expect(result['sleepy-survivor'].unlockedAt).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: spooky-study-dashboard, Property 16: Mischievous Master achievement
   * Validates: Requirements 6.5
   * 
   * For any mischief counter value, if the counter is greater than or equal to 5,
   * the "Mischievous Master" achievement should be unlocked.
   */
  it('Property 16: Mischievous Master achievement - should unlock for mischief count >= 5', () => {
    fc.assert(
      fc.property(
        // Generator for mischief count (5-20 to ensure we meet the threshold)
        fc.integer({ min: 5, max: 20 }),
        // Generator for number of sessions (0-10, can be empty)
        fc.integer({ min: 0, max: 10 }),
        // Generator for session durations (25-90 minutes)
        fc.array(fc.integer({ min: 25, max: 90 }), { minLength: 0, maxLength: 10 }),
        // Generator for ghost emotions
        fc.array(fc.constantFrom('sleepy', 'mischievous'), { minLength: 0, maxLength: 10 }),
        (mischiefCount, numSessions, durations, emotions) => {
          // Create session history (can be empty or have any sessions)
          const sessionHistory = [];
          const baseDate = new Date('2024-01-01T10:00:00Z');
          
          for (let i = 0; i < numSessions; i++) {
            const sessionDate = new Date(baseDate);
            sessionDate.setDate(sessionDate.getDate() + i);
            
            sessionHistory.push({
              startTime: sessionDate.toISOString(),
              duration: durations[i % Math.max(1, durations.length)],
              completed: true,
              ghostEmotion: emotions[i % Math.max(1, emotions.length)],
            });
          }
          
          const appData = {
            sessionHistory,
            mischiefCount,
          };
          
          const result = checkAchievements(appData);
          
          // If mischief count is >= 5, the Mischievous Master achievement should be unlocked
          expect(result['mischievous-master'].unlocked).toBe(true);
          expect(result['mischievous-master'].unlockedAt).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: spooky-study-dashboard, Property 17: Achievement persistence
   * Validates: Requirements 6.6
   * 
   * For any unlocked achievement, storing the achievement state to localStorage 
   * and then loading it should preserve the unlocked status and timestamp.
   */
  it('Property 17: Achievement persistence - should preserve unlocked status and timestamp', () => {
    // Import storage utilities for this test
    const { saveToStorage, loadFromStorage } = require('./storage.js');
    const { ACHIEVEMENT_IDS } = require('../constants/achievements.js');

    // Generator for a valid timestamp (ISO string)
    const arbTimestamp = fc.integer({ min: 1577836800000, max: 1924905600000 })
      .map(ms => new Date(ms).toISOString());

    // Generator for a single achievement state
    const arbAchievementState = fc.record({
      unlocked: fc.boolean(),
      unlockedAt: fc.option(arbTimestamp),
    });

    // Generator for achievement state object with all achievement IDs
    const arbAchievementStates = fc.record(
      ACHIEVEMENT_IDS.reduce((acc, id) => {
        acc[id] = arbAchievementState;
        return acc;
      }, {})
    );

    fc.assert(
      fc.property(arbAchievementStates, (achievementStates) => {
        // Store the achievement states
        saveToStorage('achievements', achievementStates);
        
        // Load the achievement states back
        const loadedStates = loadFromStorage('achievements', {});
        
        // The loaded states should match the stored states
        expect(loadedStates).toEqual(achievementStates);
        
        // Verify that unlocked achievements preserve their status and timestamp
        Object.keys(achievementStates).forEach(achievementId => {
          const original = achievementStates[achievementId];
          const loaded = loadedStates[achievementId];
          
          expect(loaded.unlocked).toBe(original.unlocked);
          expect(loaded.unlockedAt).toBe(original.unlockedAt);
          
          // If unlocked, timestamp should be preserved
          if (original.unlocked && original.unlockedAt) {
            expect(loaded.unlockedAt).toBe(original.unlockedAt);
          }
        });
      }),
      { numRuns: 100 }
    );
  });
});
