# Design Document: Spooky Study Dashboard

## Overview

The Spooky Study Dashboard is a browser-based productivity application that gamifies the Pomodoro study technique through Halloween-themed visual elements and an interactive ghost companion system. The application provides timer management, visual customization, productivity tracking, and achievement unlocking to create an engaging study experience.

**Core Design Principles:**
- **Simplicity First**: Single-page application with minimal navigation complexity
- **Immediate Feedback**: Real-time visual and behavioral responses to user actions
- **Persistent State**: All user data stored locally in the browser for privacy and offline capability
- **Playful Engagement**: Halloween theme with animated companions to maintain user interest during study sessions

## Architecture

### Technology Stack

**Frontend Framework**: React with Vite
- Rationale: Fast development experience, component-based architecture ideal for interactive UI elements, excellent HMR support

**Styling**: Tailwind CSS
- Rationale: Utility-first approach enables rapid theme switching, already configured in the project

**Data Visualization**: Recharts
- Rationale: React-native charting library with good TypeScript support for productivity metrics visualization

**State Management**: React Context API + Custom Hooks
- Rationale: Sufficient for application scope, avoids external state management library complexity

**Storage**: Browser LocalStorage API
- Rationale: Simple, synchronous API suitable for small data volumes, no backend required

**Property-Based Testing**: fast-check
- Rationale: Mature JavaScript/TypeScript PBT library with excellent generator support and shrinking capabilities

### Application Structure

```
src/
├── components/
│   ├── Timer/
│   │   ├── TimerDisplay.jsx
│   │   ├── TimerControls.jsx
│   │   └── SessionConfig.jsx
│   ├── Ghost/
│   │   ├── GhostCompanion.jsx
│   │   ├── GhostSelector.jsx
│   │   └── JumpscareAnimation.jsx
│   ├── Theme/
│   │   └── ThemePalette.jsx
│   ├── Metrics/
│   │   ├── MetricsCards.jsx
│   │   ├── ProductivityChart.jsx
│   │   └── StatsDisplay.jsx
│   └── Achievements/
│       ├── AchievementList.jsx
│       └── AchievementNotification.jsx
├── hooks/
│   ├── useTimer.js
│   ├── useLocalStorage.js
│   ├── useAchievements.js
│   └── useMetrics.js
├── context/
│   ├── AppContext.jsx
│   └── ThemeContext.jsx
├── utils/
│   ├── storage.js
│   ├── calculations.js
│   └── achievements.js
├── constants/
│   ├── themes.js
│   ├── ghosts.js
│   └── achievements.js
└── App.jsx
```

## Components and Interfaces

### Timer System

**TimerDisplay Component**
- Displays current countdown time in MM:SS format
- Shows session type indicator (Study/Rest)
- Visual progress ring animation

**TimerControls Component**
- Start/Pause/Reset buttons
- Session configuration inputs (study duration: 25-90 min, rest duration: 5-20 min)
- Pomodoro cycle counter (1-4 cycles)

**Timer State Interface**
```typescript
interface TimerState {
  studyDuration: number;      // minutes (25-90)
  restDuration: number;       // minutes (5-20)
  currentTime: number;        // seconds remaining
  isActive: boolean;
  sessionType: 'study' | 'rest';
  cyclesPlanned: number;      // 1-4
  cyclesCompleted: number;
}
```

### Theme System

**ThemePalette Component**
- Grid of theme selection buttons
- Visual preview of each palette
- Active theme indicator

**Theme Configuration**
```typescript
interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

const THEMES = {
  pumpkinGlow: { /* orange/yellow palette */ },
  vampireCrimson: { /* red/black palette */ },
  witchForest: { /* green/purple palette */ },
  candyCornPastel: { /* pastel orange/yellow/white */ }
};
```

### Ghost Companion System

**GhostCompanion Component**
- Renders selected ghost variant with current emotion
- Handles animation states based on timer status
- Triggers jumpscare animations randomly

**Ghost Configuration**
```typescript
type GhostVariant = 'baby-ghost' | 'witch-ghost' | 'vampire' | 'werewolf' | 'angel';
type GhostEmotion = 'sleepy' | 'mischievous';

interface GhostState {
  variant: GhostVariant;
  emotion: GhostEmotion;
  isAnimating: boolean;
  mischiefCount: number;
}
```

**Jumpscare System**
- Random trigger during active study sessions (5-15% chance per minute)
- Non-blocking animation overlay
- Increments mischief counter for achievement tracking

### Metrics and Analytics

**MetricsCards Component**
- Tarot card-styled metric displays
- Shows: daily study time, weekly stats, completed sessions, productivity score

**Productivity Score Calculation**
```typescript
interface ProductivityMetrics {
  dailyStudyTime: number;        // minutes
  weeklyStudyTime: number;       // minutes
  completedSessions: number;
  productivityScore: number;     // 0-100
  sessionHistory: SessionRecord[];
}

interface SessionRecord {
  startTime: Date;
  duration: number;              // minutes
  completed: boolean;
  ghostEmotion: GhostEmotion;
}
```

**Productivity Score Logic**:
- Base score from completion rate (completed sessions / started sessions) × 50
- Consistency bonus: +10 for each consecutive day (max +30)
- Session length bonus: +20 for sessions ≥ 45 minutes
- Capped at 100

### Achievement System

**Achievement Definitions**
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  condition: (data: AppData) => boolean;
}

const ACHIEVEMENTS = [
  {
    id: 'cursed-consistency',
    name: 'Cursed Consistency',
    description: 'Study for 7 consecutive days',
    condition: (data) => hasConsecutiveDays(data.sessionHistory, 7)
  },
  {
    id: 'demon-discipline',
    name: 'Demon of Discipline',
    description: 'Complete 10+ sessions in 7 days',
    condition: (data) => getSessionsInLastNDays(data.sessionHistory, 7) >= 10
  },
  {
    id: 'witching-hour',
    name: 'Witching Hour Warrior',
    description: 'Study between midnight and 3 AM',
    condition: (data) => hasSessionInTimeRange(data.sessionHistory, 0, 3)
  },
  {
    id: 'sleepy-survivor',
    name: 'Sleepy Survivor',
    description: 'Complete 3 sessions with sleepy ghost',
    condition: (data) => countSessionsByEmotion(data.sessionHistory, 'sleepy') >= 3
  },
  {
    id: 'mischievous-master',
    name: 'Mischievous Master',
    description: 'Experience 5 jumpscares',
    condition: (data) => data.mischiefCount >= 5
  }
];
```

### Storage Layer

**LocalStorage Schema**
```typescript
interface StoredData {
  preferences: {
    theme: string;
    ghostVariant: GhostVariant;
    studyDuration: number;
    restDuration: number;
    cyclesPlanned: number;
  };
  sessionHistory: SessionRecord[];
  achievements: {
    [achievementId: string]: {
      unlocked: boolean;
      unlockedAt?: string;
    }
  };
  mischiefCount: number;
}
```

**Storage Utilities**
- `saveToStorage(key, data)`: Serializes and stores data
- `loadFromStorage(key, defaultValue)`: Retrieves and deserializes data with fallback
- `clearStorage()`: Resets all stored data
- Error handling for quota exceeded and corrupted data scenarios

## Data Models

### Timer Model
```typescript
class Timer {
  studyDuration: number;
  restDuration: number;
  currentTime: number;
  isActive: boolean;
  sessionType: 'study' | 'rest';
  cyclesPlanned: number;
  cyclesCompleted: number;
  
  start(): void;
  pause(): void;
  reset(): void;
  tick(): void;  // Decrements time, handles transitions
  setStudyDuration(minutes: number): void;  // Validates 25-90
  setRestDuration(minutes: number): void;   // Validates 5-20
  setCyclesPlanned(count: number): void;    // Validates 1-4
}
```

### Session Model
```typescript
class Session {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  completed: boolean;
  ghostEmotion: GhostEmotion;
  
  complete(): void;
  getDuration(): number;
  isInTimeRange(startHour: number, endHour: number): boolean;
}
```

### Metrics Model
```typescript
class MetricsCalculator {
  sessionHistory: Session[];
  
  getDailyStudyTime(date: Date): number;
  getWeeklyStudyTime(): number;
  getCompletedSessionsCount(): number;
  calculateProductivityScore(): number;
  getConsecutiveDays(): number;
  getSessionsInLastNDays(days: number): number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, several properties can be combined to eliminate redundancy:

**Persistence Round-Trips**: Properties 2.3+2.4, 7.1+7.2, 7.3, and 7.4 all test persistence mechanisms. These can be consolidated into comprehensive round-trip properties that test storing and retrieving different data types.

**Input Validation**: Properties 1.1 and 1.2 both test duration validation with different ranges. These follow the same pattern and can be tested together.

**Achievement Unlocking**: Properties 6.1-6.5 all test achievement conditions, and 6.6 tests the unlocking mechanism. The unlocking mechanism (6.6) is tested implicitly when testing each achievement condition, so we can combine the persistence aspect into the individual achievement tests.

**Cycle Tracking**: Properties 8.2, 8.3, and 8.4 all relate to cycle management and can be tested as part of a comprehensive cycle tracking property.

### Correctness Properties

**Property 1: Timer duration validation**
*For any* duration value, when setting study duration, the system should accept values in range [25, 90] minutes and reject values outside this range; when setting rest duration, the system should accept values in range [5, 20] minutes and reject values outside this range.
**Validates: Requirements 1.1, 1.2**

**Property 2: Timer initialization**
*For any* valid study duration, when a user starts a study session, the countdown timer should initialize to that duration in seconds.
**Validates: Requirements 1.3**

**Property 3: Session state transitions**
*For any* study session, when the timer reaches zero, the session type should automatically transition from 'study' to 'rest' and the timer should reset to the rest duration.
**Validates: Requirements 1.4**

**Property 4: Theme persistence round-trip**
*For any* theme palette selection, storing the theme to localStorage and then loading it should return the same theme value.
**Validates: Requirements 2.3, 2.4**

**Property 5: Ghost variant persistence round-trip**
*For any* ghost variant selection, storing the variant to localStorage and then loading it should return the same variant value.
**Validates: Requirements 3.3**

**Property 6: Ghost emotion validity**
*For any* ghost state, the emotion property should always be either 'sleepy' or 'mischievous'.
**Validates: Requirements 3.4**

**Property 7: Ghost animation during active session**
*For any* active study session, the ghost companion should have an animation state that is not idle.
**Validates: Requirements 3.5**

**Property 8: Jumpscare timer invariant**
*For any* timer state, triggering a jumpscare should not modify the current time, session type, or isActive status.
**Validates: Requirements 4.2**

**Property 9: Jumpscare mischief counter increment**
*For any* mischief counter value, triggering a jumpscare should increment the counter by exactly 1.
**Validates: Requirements 4.3**

**Property 10: Session persistence**
*For any* completed session, the session data (duration, timestamp, ghost emotion) stored to localStorage should match the original session data when retrieved.
**Validates: Requirements 5.1**

**Property 11: Productivity score consistency**
*For any* session history, calculating the productivity score multiple times should always return the same value, and the score should be in range [0, 100].
**Validates: Requirements 5.5**

**Property 12: Cursed Consistency achievement**
*For any* session history with at least one completed session on each of 7 consecutive days, the "Cursed Consistency" achievement should be unlocked.
**Validates: Requirements 6.1**

**Property 13: Demon of Discipline achievement**
*For any* session history, if there are 10 or more completed sessions within any 7-day period, the "Demon of Discipline" achievement should be unlocked.
**Validates: Requirements 6.2**

**Property 14: Witching Hour Warrior achievement**
*For any* session history, if there is at least one completed session with start time between 00:00 and 03:00, the "Witching Hour Warrior" achievement should be unlocked.
**Validates: Requirements 6.3**

**Property 15: Sleepy Survivor achievement**
*For any* session history, if there are 3 or more completed sessions with ghost emotion 'sleepy', the "Sleepy Survivor" achievement should be unlocked.
**Validates: Requirements 6.4**

**Property 16: Mischievous Master achievement**
*For any* mischief counter value, if the counter is greater than or equal to 5, the "Mischievous Master" achievement should be unlocked.
**Validates: Requirements 6.5**

**Property 17: Achievement persistence**
*For any* unlocked achievement, storing the achievement state to localStorage and then loading it should preserve the unlocked status and timestamp.
**Validates: Requirements 6.6**

**Property 18: Preferences persistence round-trip**
*For any* set of user preferences (theme, ghost variant, study duration, rest duration, cycles planned), storing to localStorage and then loading should return equivalent preference values.
**Validates: Requirements 7.1, 7.2**

**Property 19: Session history persistence round-trip**
*For any* session history array, storing to localStorage and then loading should return an equivalent array with the same sessions.
**Validates: Requirements 7.3**

**Property 20: Achievement state persistence round-trip**
*For any* achievement state object, storing to localStorage and then loading should return equivalent achievement states.
**Validates: Requirements 7.4**

**Property 21: Cycle progress tracking**
*For any* valid cycle count (1-4), when sessions complete, the cycles completed counter should increment correctly and reset when all planned cycles are complete.
**Validates: Requirements 8.2, 8.3**

**Property 22: Dynamic cycle count updates**
*For any* active session with cycles in progress, changing the planned cycle count should update the remaining cycles without affecting completed cycle count.
**Validates: Requirements 8.4**

## Error Handling

### Input Validation Errors

**Timer Duration Validation**
- Study duration < 25 or > 90: Display error message "Study duration must be between 25 and 90 minutes"
- Rest duration < 5 or > 20: Display error message "Rest duration must be between 5 and 20 minutes"
- Non-numeric input: Display error message "Please enter a valid number"

**Cycle Count Validation**
- Cycle count < 1 or > 4: Display error message "Please select between 1 and 4 cycles"

### Storage Errors

**LocalStorage Quota Exceeded**
- Catch QuotaExceededError
- Attempt to clear old session history (keep only last 30 days)
- Retry storage operation
- If still fails, display warning: "Storage limit reached. Some history may not be saved."

**Corrupted Data**
- Catch JSON parse errors during data loading
- Log error to console for debugging
- Initialize with default values
- Display info message: "Settings restored to defaults"

**Missing Data**
- Check for null/undefined values
- Use default values as fallback
- No error message needed (expected for first-time users)

### Timer Errors

**Timer Drift**
- Use Date.now() comparison instead of relying solely on setInterval
- Recalculate remaining time on each tick to prevent drift
- If drift detected > 2 seconds, adjust timer to correct value

**Background Tab Behavior**
- Detect when tab becomes visible again
- Recalculate elapsed time based on timestamps
- Update timer display to reflect actual time passed

### Ghost Animation Errors

**Missing Ghost Asset**
- Fallback to default ghost variant (baby-ghost)
- Log warning to console
- Continue application functionality

**Animation Performance**
- Use requestAnimationFrame for smooth animations
- Reduce animation complexity on low-performance devices
- Provide option to disable animations if needed

## Testing Strategy

### Unit Testing

**Framework**: Vitest (already compatible with Vite setup)

**Unit Test Coverage**:
- Storage utilities (save, load, error handling)
- Calculation functions (productivity score, consecutive days, session counting)
- Achievement condition functions
- Timer state transitions
- Input validation functions

**Example Unit Tests**:
- Test that `calculateProductivityScore` returns 0 for empty session history
- Test that `hasConsecutiveDays` returns false for non-consecutive sessions
- Test that `saveToStorage` handles quota exceeded errors gracefully
- Test that timer transitions from study to rest when time reaches zero
- Test that invalid duration inputs are rejected

### Property-Based Testing

**Framework**: fast-check

**Configuration**: Each property-based test should run a minimum of 100 iterations to ensure thorough coverage of the input space.

**Test Tagging**: Each property-based test must include a comment explicitly referencing the correctness property from this design document using the format: `// Feature: spooky-study-dashboard, Property {number}: {property_text}`

**Property Test Coverage**:
- Timer duration validation with random valid and invalid inputs
- Theme persistence with random theme selections
- Ghost variant persistence with random variant selections
- Session data round-trips with randomly generated sessions
- Achievement unlocking with randomly generated session histories
- Productivity score calculation with various session patterns
- Cycle tracking with random cycle counts and completions

**Generators**:
- `arbDuration(min, max)`: Generates durations within specified range
- `arbTheme()`: Generates random theme from available themes
- `arbGhostVariant()`: Generates random ghost variant
- `arbGhostEmotion()`: Generates random ghost emotion
- `arbSession()`: Generates random session with valid properties
- `arbSessionHistory(minSessions, maxSessions)`: Generates array of sessions
- `arbTimestamp()`: Generates random valid timestamp
- `arbCycleCount()`: Generates cycle count between 1-4

**Example Property Tests**:
- For all valid study durations, setting the duration should succeed and be retrievable
- For all theme selections, the round-trip through storage preserves the theme
- For all session histories with 7 consecutive days, the achievement should unlock
- For all mischief counter values ≥ 5, the achievement should be unlocked
- For all timer states, jumpscares should not modify timer values

### Integration Testing

**Test Scenarios**:
- Complete Pomodoro cycle flow (study → rest → notification)
- Theme change reflects across all components
- Achievement unlocking triggers notification and persists
- Session completion updates metrics and history
- Page reload restores all user preferences and data

### Manual Testing Checklist

- Visual verification of all four theme palettes
- Ghost animations play smoothly during sessions
- Jumpscare animations appear without disrupting timer
- Achievement notifications display correctly
- Metrics cards show accurate data
- Charts render correctly with Recharts
- Responsive design works on different screen sizes

## Implementation Notes

### Performance Considerations

**Timer Accuracy**
- Use Web Workers for timer if main thread performance becomes an issue
- Implement timer using timestamps rather than interval counting to prevent drift

**LocalStorage Optimization**
- Debounce storage writes to prevent excessive I/O
- Compress session history if it grows large (keep last 90 days max)
- Use batch updates when possible

**Animation Performance**
- Use CSS transforms for ghost animations (GPU-accelerated)
- Implement requestAnimationFrame for smooth jumpscare animations
- Lazy load ghost assets

### Accessibility

**Keyboard Navigation**
- All controls accessible via keyboard
- Tab order follows logical flow
- Enter key activates buttons

**Screen Reader Support**
- ARIA labels for timer display
- Announce session transitions
- Announce achievement unlocks

**Visual Accessibility**
- Sufficient color contrast in all themes (WCAG AA minimum)
- Timer visible in all theme palettes
- Focus indicators on interactive elements

### Browser Compatibility

**Target Browsers**:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

**Required APIs**:
- LocalStorage (supported in all modern browsers)
- requestAnimationFrame (supported in all modern browsers)
- CSS Grid and Flexbox (supported in all modern browsers)

### Future Enhancements

**Potential Features** (out of scope for initial release):
- Sound effects for timer completion and jumpscares
- Export study data as CSV
- Cloud sync across devices
- Custom ghost creation
- Social features (share achievements)
- Dark mode toggle independent of theme
- Pomodoro technique variations (52/17, 90-minute deep work)

## Deployment

**Build Process**:
- `npm run build` creates optimized production bundle
- Vite handles code splitting and asset optimization
- Output to `dist/` directory

**Hosting**:
- Static site hosting (Netlify, Vercel, GitHub Pages)
- No backend required
- CDN for fast global delivery

**Environment Variables**:
- None required (all configuration is client-side)

## Security Considerations

**Data Privacy**:
- All data stored locally in browser
- No data transmitted to external servers
- No user authentication required
- No PII collected

**XSS Prevention**:
- React automatically escapes rendered content
- No dangerouslySetInnerHTML usage
- Sanitize any user input (timer durations)

**Content Security Policy**:
- Restrict script sources to self
- No inline scripts
- No eval() usage
