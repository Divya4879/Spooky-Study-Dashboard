/**
 * Property-based tests for storage utilities
 * Tests persistence round-trips and error handling
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { saveToStorage, loadFromStorage, clearStorage } from './storage.js';
import { THEMES, THEME_KEYS } from '../constants/themes.js';
import { GHOST_VARIANT_IDS } from '../constants/ghosts.js';
import { ACHIEVEMENT_IDS } from '../constants/achievements.js';

describe('Storage Utilities - Property-Based Tests', () => {
  // Clean up localStorage before and after each test
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  /**
   * Feature: spooky-study-dashboard, Property 4: Theme persistence round-trip
   * Validates: Requirements 2.3, 2.4
   * 
   * For any theme palette selection, storing the theme to localStorage 
   * and then loading it should return the same theme value.
   */
  it('Property 4: Theme persistence round-trip', () => {
    // Generator for valid theme keys
    const arbTheme = fc.constantFrom(...THEME_KEYS);

    fc.assert(
      fc.property(arbTheme, (theme) => {
        // Store the theme
        saveToStorage('theme', theme);
        
        // Load the theme back
        const loadedTheme = loadFromStorage('theme', null);
        
        // The loaded theme should match the stored theme
        expect(loadedTheme).toBe(theme);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: spooky-study-dashboard, Property 18: Preferences persistence round-trip
   * Validates: Requirements 7.1, 7.2
   * 
   * For any set of user preferences (theme, ghost variant, study duration, 
   * rest duration, cycles planned), storing to localStorage and then loading 
   * should return equivalent preference values.
   */
  it('Property 18: Preferences persistence round-trip', () => {
    // Generator for valid preferences object
    const arbPreferences = fc.record({
      theme: fc.constantFrom(...THEME_KEYS),
      ghostVariant: fc.constantFrom(...GHOST_VARIANT_IDS),
      studyDuration: fc.integer({ min: 25, max: 90 }),
      restDuration: fc.integer({ min: 5, max: 20 }),
      cyclesPlanned: fc.integer({ min: 1, max: 4 }),
    });

    fc.assert(
      fc.property(arbPreferences, (preferences) => {
        // Store the preferences
        saveToStorage('preferences', preferences);
        
        // Load the preferences back
        const loadedPreferences = loadFromStorage('preferences', null);
        
        // The loaded preferences should match the stored preferences
        expect(loadedPreferences).toEqual(preferences);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: spooky-study-dashboard, Property 19: Session history persistence round-trip
   * Validates: Requirements 7.3
   * 
   * For any session history array, storing to localStorage and then loading 
   * should return an equivalent array with the same sessions.
   */
  it('Property 19: Session history persistence round-trip', () => {
    // Generator for a valid timestamp (ISO string)
    // Use integer timestamps to avoid invalid date issues
    const arbTimestamp = fc.integer({ min: 1577836800000, max: 1924905600000 })
      .map(ms => new Date(ms).toISOString());

    // Generator for a valid session record
    const arbSession = fc.record({
      id: fc.uuid(),
      startTime: arbTimestamp,
      endTime: fc.option(arbTimestamp),
      duration: fc.integer({ min: 1, max: 180 }), // 1-180 minutes
      completed: fc.boolean(),
      ghostEmotion: fc.constantFrom('sleepy', 'mischievous'),
    });

    // Generator for session history array (0-20 sessions)
    const arbSessionHistory = fc.array(arbSession, { minLength: 0, maxLength: 20 });

    fc.assert(
      fc.property(arbSessionHistory, (sessionHistory) => {
        // Store the session history
        saveToStorage('sessionHistory', sessionHistory);
        
        // Load the session history back
        const loadedHistory = loadFromStorage('sessionHistory', []);
        
        // The loaded history should match the stored history
        expect(loadedHistory).toEqual(sessionHistory);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: spooky-study-dashboard, Property 20: Achievement state persistence round-trip
   * Validates: Requirements 7.4
   * 
   * For any achievement state object, storing to localStorage and then loading 
   * should return equivalent achievement states.
   */
  it('Property 20: Achievement state persistence round-trip', () => {
    // Generator for a valid timestamp (ISO string or null)
    // Use integer timestamps to avoid invalid date issues
    const arbTimestamp = fc.option(
      fc.integer({ min: 1577836800000, max: 1924905600000 })
        .map(ms => new Date(ms).toISOString())
    );

    // Generator for a single achievement state
    const arbAchievementState = fc.record({
      unlocked: fc.boolean(),
      unlockedAt: arbTimestamp,
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
      }),
      { numRuns: 100 }
    );
  });
});
