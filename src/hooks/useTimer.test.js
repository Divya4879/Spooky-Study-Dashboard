/**
 * Property-based tests for useTimer hook
 * Tests timer duration validation and state management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer.js';

describe('useTimer Hook - Property-Based Tests', () => {
  /**
   * Feature: spooky-study-dashboard, Property 1: Timer duration validation
   * Validates: Requirements 1.1, 1.2
   * 
   * For any duration value, when setting study duration, the system should accept 
   * values in range [25, 90] minutes and reject values outside this range; 
   * when setting rest duration, the system should accept values in range [5, 20] 
   * minutes and reject values outside this range.
   */
  it('Property 1: Timer duration validation', () => {
    // Generator for any integer (including invalid ranges)
    const arbAnyInteger = fc.integer({ min: -100, max: 200 });

    fc.assert(
      fc.property(arbAnyInteger, arbAnyInteger, (studyDuration, restDuration) => {
        // Render the hook
        const { result } = renderHook(() => useTimer());

        // Test study duration validation
        let studyResult;
        act(() => {
          studyResult = result.current.setStudyDuration(studyDuration);
        });

        if (studyDuration >= 25 && studyDuration <= 90) {
          // Valid study duration should be accepted
          expect(studyResult.success).toBe(true);
          expect(studyResult.error).toBeUndefined();
          expect(result.current.studyDuration).toBe(studyDuration);
        } else {
          // Invalid study duration should be rejected
          expect(studyResult.success).toBe(false);
          expect(studyResult.error).toBe('Study duration must be between 25 and 90 minutes');
          // Duration should not change from default
          expect(result.current.studyDuration).toBe(25);
        }

        // Test rest duration validation
        let restResult;
        act(() => {
          restResult = result.current.setRestDuration(restDuration);
        });

        if (restDuration >= 5 && restDuration <= 20) {
          // Valid rest duration should be accepted
          expect(restResult.success).toBe(true);
          expect(restResult.error).toBeUndefined();
          expect(result.current.restDuration).toBe(restDuration);
        } else {
          // Invalid rest duration should be rejected
          expect(restResult.success).toBe(false);
          expect(restResult.error).toBe('Rest duration must be between 5 and 20 minutes');
          // Duration should not change from default
          expect(result.current.restDuration).toBe(5);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: spooky-study-dashboard, Property 2: Timer initialization
   * Validates: Requirements 1.3
   * 
   * For any valid study duration, when a user starts a study session, 
   * the countdown timer should initialize to that duration in seconds.
   */
  it('Property 2: Timer initialization', () => {
    // Generator for valid study durations (25-90 minutes)
    const arbValidStudyDuration = fc.integer({ min: 25, max: 90 });

    fc.assert(
      fc.property(arbValidStudyDuration, (studyDuration) => {
        // Render the hook with the specified study duration
        const { result } = renderHook(() => 
          useTimer({ initialStudyDuration: studyDuration })
        );

        // Verify timer initializes to study duration in seconds
        const expectedSeconds = studyDuration * 60;
        expect(result.current.currentTime).toBe(expectedSeconds);
        expect(result.current.sessionType).toBe('study');
        expect(result.current.isActive).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: spooky-study-dashboard, Property 3: Session state transitions
   * Validates: Requirements 1.4
   * 
   * For any study session, when the timer reaches zero, the session type should 
   * automatically transition from 'study' to 'rest' and the timer should reset 
   * to the rest duration.
   */
  it('Property 3: Session state transitions', async () => {
    // Generator for valid study and rest durations
    const arbValidStudyDuration = fc.integer({ min: 25, max: 90 });
    const arbValidRestDuration = fc.integer({ min: 5, max: 20 });

    await fc.assert(
      fc.asyncProperty(
        arbValidStudyDuration, 
        arbValidRestDuration, 
        async (studyDuration, restDuration) => {
          // Track session completion callback
          let sessionCompleteData = null;
          const onSessionComplete = (data) => {
            sessionCompleteData = data;
          };

          // Render the hook with specified durations
          const { result, unmount } = renderHook(() => 
            useTimer({ 
              initialStudyDuration: studyDuration,
              initialRestDuration: restDuration,
              onSessionComplete
            })
          );

          try {
            // Verify initial state is study session
            expect(result.current).not.toBeNull();
            expect(result.current.sessionType).toBe('study');
            expect(result.current.currentTime).toBe(studyDuration * 60);
            expect(result.current.isActive).toBe(false);

            // Mock Date.now to control time
            const originalDateNow = Date.now;
            let mockTime = Date.now();
            Date.now = vi.fn(() => mockTime);

            try {
              // Start the timer
              await act(async () => {
                result.current.start();
              });

              expect(result.current.isActive).toBe(true);

              // Advance mock time to complete the study session
              mockTime += studyDuration * 60 * 1000 + 200;

              // Wait for the interval to fire and detect the time change
              await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 300));
              });

              // After transition, verify the state
              expect(result.current.sessionType).toBe('rest');
              expect(result.current.currentTime).toBe(restDuration * 60);
              expect(result.current.isActive).toBe(false);

              // Verify session complete callback was triggered
              expect(sessionCompleteData).not.toBeNull();
              expect(sessionCompleteData.sessionType).toBe('study');
              expect(sessionCompleteData.duration).toBe(studyDuration);
            } finally {
              // Restore Date.now
              Date.now = originalDateNow;
            }
          } finally {
            // Cleanup
            unmount();
          }
        }
      ),
      { numRuns: 10 }  // Reduced from 100 due to async timer complexity
    );
  }, 30000);  // 30 second timeout for async property test
});
