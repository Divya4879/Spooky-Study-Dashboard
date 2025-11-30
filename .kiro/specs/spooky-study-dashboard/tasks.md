# Implementation Plan

- [x] 1. Set up project structure and entry point





  - Create index.html with root div and script reference
  - Create src/main.jsx as application entry point
  - Create src/App.jsx as main application component
  - Verify Vite dev server runs successfully
  - _Requirements: All_

- [x] 2. Implement constants and configuration





  - Create src/constants/themes.js with four theme palette definitions (Pumpkin Glow, Vampire Crimson, Witch Forest, Candy Corn Pastel)
  - Create src/constants/ghosts.js with five ghost variant definitions (baby-ghost, witch-ghost, vampire, werewolf, angel)
  - Create src/constants/achievements.js with five achievement definitions
  - _Requirements: 2.2, 3.1, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 3. Implement storage utilities





  - Create src/utils/storage.js with saveToStorage, loadFromStorage, and clearStorage functions
  - Implement error handling for quota exceeded and corrupted data
  - Implement default value fallback for missing data
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 3.1 Write property test for theme persistence






  - **Property 4: Theme persistence round-trip**
  - **Validates: Requirements 2.3, 2.4**

- [ ]* 3.2 Write property test for ghost variant persistence
  - **Property 5: Ghost variant persistence round-trip**
  - **Validates: Requirements 3.3**

- [x] 3.3 Write property test for preferences persistence






  - **Property 18: Preferences persistence round-trip**
  - **Validates: Requirements 7.1, 7.2**

- [x] 3.4 Write property test for session history persistence






  - **Property 19: Session history persistence round-trip**
  - **Validates: Requirements 7.3**
-

- [x] 3.5 Write property test for achievement state persistence







  - **Property 20: Achievement state persistence round-trip**
  - **Validates: Requirements 7.4**
-

- [x] 4. Implement calculation utilities




  - Create src/utils/calculations.js with productivity score calculation logic
  - Implement helper functions: hasConsecutiveDays, getSessionsInLastNDays, hasSessionInTimeRange, countSessionsByEmotion
  - _Requirements: 5.2, 5.5_

- [x] 4.1 Write property test for productivity score consistency






  - **Property 11: Productivity score consistency**
  - **Validates: Requirements 5.5**

- [x] 5. Implement achievement utilities





  - Create src/utils/achievements.js with achievement condition checking functions
  - Implement checkAchievements function that evaluates all achievement conditions
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 5.1 Write property test for Cursed Consistency achievement






  - **Property 12: Cursed Consistency achievement**
  - **Validates: Requirements 6.1**

- [x] 5.2 Write property test for Demon of Discipline achievement






  - **Property 13: Demon of Discipline achievement**
  - **Validates: Requirements 6.2**

- [x] 5.3 Write property test for Witching Hour Warrior achievement






  - **Property 14: Witching Hour Warrior achievement**
  - **Validates: Requirements 6.3**
-

- [x] 5.4 Write property test for Sleepy Survivor achievement




  - **Property 15: Sleepy Survivor achievement**
  - **Validates: Requirements 6.4**

- [x] 5.5 Write property test for Mischievous Master achievement






  - **Property 16: Mischievous Master achievement**
  - **Validates: Requirements 6.5**
-

- [x] 5.6 Write property test for achievement persistence





  - **Property 17: Achievement persistence**
  - **Validates: Requirements 6.6**

- [x] 6. Implement custom hooks





  - Create src/hooks/useLocalStorage.js for localStorage synchronization
  - Create src/hooks/useTimer.js for timer state management and countdown logic
  - Implement timer validation for study duration (25-90 min) and rest duration (5-20 min)
  - Implement automatic session transitions (study → rest)
  - Implement cycle tracking (1-4 cycles)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 8.1, 8.2, 8.3, 8.4_
-

- [x] 6.1 Write property test for timer duration validation





  - **Property 1: Timer duration validation**
  - **Validates: Requirements 1.1, 1.2**

- [x] 6.2 Write property test for timer initialization






  - **Property 2: Timer initialization**
  - **Validates: Requirements 1.3**

- [x] 6.3 Write property test for session state transitions






  - **Property 3: Session state transitions**
  - **Validates: Requirements 1.4**

- [ ]* 6.4 Write property test for cycle progress tracking
  - **Property 21: Cycle progress tracking**
  - **Validates: Requirements 8.2, 8.3**

- [ ]* 6.5 Write property test for dynamic cycle count updates
  - **Property 22: Dynamic cycle count updates**
  - **Validates: Requirements 8.4**

- [x] 7. Implement metrics hook





  - Create src/hooks/useMetrics.js for calculating productivity metrics
  - Implement functions for daily study time, weekly statistics, completed sessions count
  - Integrate with calculations.js utilities
  - _Requirements: 5.1, 5.2_

- [x] 7.1 Write property test for session persistence






  - **Property 10: Session persistence**
  - **Validates: Requirements 5.1**

- [x] 8. Implement achievements hook



  - Create src/hooks/useAchievements.js for achievement tracking and unlocking
  - Implement achievement checking on session completion
  - Implement achievement notification triggering
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 9. Implement application context





  - Create src/context/AppContext.jsx with global state management
  - Provide timer state, session history, achievements, and mischief counter
  - Integrate all custom hooks into context
  - _Requirements: All_

- [x] 10. Implement theme context





  - Create src/context/ThemeContext.jsx for theme management
  - Implement theme switching and persistence
  - Apply theme colors to CSS variables
  - _Requirements: 2.1, 2.3, 2.4_

- [x] 11. Implement timer display component





  - Create src/components/Timer/TimerDisplay.jsx
  - Display countdown in MM:SS format
  - Show session type indicator (Study/Rest)
  - Implement visual progress ring animation
  - _Requirements: 1.3, 1.4_

- [x] 12. Implement timer controls component





  - Create src/components/Timer/TimerControls.jsx
  - Implement Start/Pause/Reset buttons
  - Add keyboard accessibility (Enter key, Space bar)
  - _Requirements: 1.3_

- [x] 13. Implement session configuration component





  - Create src/components/Timer/SessionConfig.jsx
  - Implement study duration input (25-90 min) with validation
  - Implement rest duration input (5-20 min) with validation
  - Implement Pomodoro cycle selector (1-4 cycles)
  - Display validation error messages
  - _Requirements: 1.1, 1.2, 8.1_

- [x] 14. Implement theme palette component





  - Create src/components/Theme/ThemePalette.jsx
  - Display grid of four theme selection buttons
  - Show visual preview of each palette
  - Highlight active theme
  - _Requirements: 2.1, 2.2_

- [x] 15. Implement ghost selector component




  - Create src/components/Ghost/GhostSelector.jsx
  - Display five ghost variant options
  - Implement ghost selection and persistence
  - _Requirements: 3.1, 3.2, 3.3_
-

- [x] 16. Implement ghost companion component




  - Create src/components/Ghost/GhostCompanion.jsx
  - Render selected ghost variant with current emotion
  - Implement animation states based on timer status (idle, studying, resting)
  - Use Framer Motion for smooth animations
  - _Requirements: 3.2, 3.4, 3.5_

- [ ]* 16.1 Write property test for ghost emotion validity
  - **Property 6: Ghost emotion validity**
  - **Validates: Requirements 3.4**

- [ ]* 16.2 Write property test for ghost animation during active session
  - **Property 7: Ghost animation during active session**
  - **Validates: Requirements 3.5**

- [x] 17. Implement jumpscare animation component





  - Create src/components/Ghost/JumpscareAnimation.jsx
  - Implement random jumpscare trigger logic (5-15% chance per minute during study)
  - Create non-blocking overlay animation
  - Increment mischief counter on jumpscare
  - _Requirements: 4.1, 4.2, 4.3_

- [ ]* 17.1 Write property test for jumpscare timer invariant
  - **Property 8: Jumpscare timer invariant**
  - **Validates: Requirements 4.2**

- [ ]* 17.2 Write property test for jumpscare mischief counter increment
  - **Property 9: Jumpscare mischief counter increment**
  - **Validates: Requirements 4.3**

- [x] 18. Implement metrics cards component





  - Create src/components/Metrics/MetricsCards.jsx
  - Display tarot card-styled metric cards
  - Show daily study time, weekly stats, completed sessions, productivity score
  - _Requirements: 5.2, 5.3_

- [x] 19. Implement productivity chart component





  - Create src/components/Metrics/ProductivityChart.jsx
  - Integrate Recharts library for data visualization
  - Display study time trends over days/weeks
  - _Requirements: 5.4_

- [x] 20. Implement stats display component





  - Create src/components/Metrics/StatsDisplay.jsx
  - Display detailed productivity metrics
  - Show session history summary
  - _Requirements: 5.2_

- [x] 21. Implement achievement list component





  - Create src/components/Achievements/AchievementList.jsx
  - Display all five achievements with locked/unlocked states
  - Show achievement descriptions and unlock timestamps
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 22. Implement achievement notification component





  - Create src/components/Achievements/AchievementNotification.jsx
  - Display toast-style notification when achievement unlocks
  - Auto-dismiss after 5 seconds
  - Use Framer Motion for entrance/exit animations
  - _Requirements: 6.6_



- [x] 23. Integrate all components in App.jsx



  - Import and compose all components in main App component
  - Wrap with AppContext and ThemeContext providers
  - Implement responsive layout with Tailwind CSS
  - Ensure proper component hierarchy and data flow
  - _Requirements: All_

- [x] 24. Implement Tailwind theme integration





  - Configure Tailwind to use CSS variables from ThemeContext
  - Ensure all four theme palettes apply correctly
  - Verify color contrast meets WCAG AA standards
  - _Requirements: 2.1, 2.2, 2.3, 2.4_
-

- [x] 25. Add accessibility features




  - Implement ARIA labels for timer display and controls
  - Add keyboard navigation support (Tab, Enter, Space)
  - Ensure focus indicators are visible
  - Add screen reader announcements for session transitions and achievements
  - _Requirements: All_

- [x] 26. Implement error boundaries





  - Create error boundary component for graceful error handling
  - Display user-friendly error messages
  - Log errors to console for debugging
  - _Requirements: 7.5_
-

- [x] 27. Final checkpoint - Ensure all tests pass




  - Run all property-based tests and unit tests
  - Verify all features work end-to-end
  - Test localStorage persistence across page reloads
  - Test all four themes and five ghost variants
  - Verify achievement unlocking works correctly
  - Ask the user if questions arise

- [ ]* 28. Create test configuration and setup
  - Install and configure Vitest for unit testing
  - Install and configure fast-check for property-based testing
  - Create test utilities and generators (arbDuration, arbTheme, arbGhostVariant, arbSession, etc.)
  - Set up test file structure matching src/ directory
