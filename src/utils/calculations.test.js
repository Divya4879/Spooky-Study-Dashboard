/**
 * Property-based tests for calculation utilities
 * Tests productivity score calculation and session analysis functions
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateProductivityScore } from './calculations.js';

describe('Calculation Utilities - Property-Based Tests', () => {
  /**
   * Feature: spooky-study-dashboard, Property 11: Productivity score consistency
   * Validates: Requirements 5.5
   * 
   * For any session history, calculating the productivity score multiple times 
   * should always return the same value, and the score should be in range [0, 100].
   */
  it('Property 11: Productivity score consistency', () => {
    // Generator for a valid timestamp (ISO string)
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

    // Generator for session history array (0-50 sessions)
    const arbSessionHistory = fc.array(arbSession, { minLength: 0, maxLength: 50 });

    fc.assert(
      fc.property(arbSessionHistory, (sessionHistory) => {
        // Calculate the productivity score twice
        const score1 = calculateProductivityScore(sessionHistory);
        const score2 = calculateProductivityScore(sessionHistory);
        
        // The scores should be identical (consistency)
        expect(score1).toBe(score2);
        
        // The score should be in the valid range [0, 100]
        expect(score1).toBeGreaterThanOrEqual(0);
        expect(score1).toBeLessThanOrEqual(100);
        
        // The score should be an integer
        expect(Number.isInteger(score1)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
