# Accessibility Features

This document outlines the accessibility features implemented in the Spooky Study Dashboard to ensure the application is usable by everyone, including users with disabilities.

## Overview

The application follows WCAG 2.1 Level AA guidelines and implements comprehensive accessibility features including:

- ARIA labels and landmarks
- Keyboard navigation support
- Screen reader announcements
- Visible focus indicators
- Semantic HTML structure

## Implemented Features

### 1. ARIA Labels and Semantic HTML

#### Timer Components
- **TimerDisplay**: 
  - `role="timer"` with descriptive `aria-label`
  - Progress ring has `role="img"` with progress percentage
  - Time display includes screen reader-friendly description
  - Live region for timer status updates

- **TimerControls**:
  - Buttons have descriptive `aria-label` attributes
  - Start/Pause/Reset buttons clearly labeled

- **SessionConfig**:
  - Form inputs properly labeled with `<label>` elements
  - Error messages linked via `aria-describedby`
  - Invalid states indicated with `aria-invalid`
  - Error messages have `role="alert"`

#### Navigation
- Tab navigation uses proper `role="tablist"` and `role="tab"`
- Each tab has `aria-selected` and `aria-controls` attributes
- Tab panels have `role="tabpanel"` and `aria-labelledby`

#### Theme and Ghost Selection
- Selection buttons use `aria-pressed` to indicate active state
- Descriptive `aria-label` for each option
- Visual indicators supplemented with text alternatives

#### Achievements
- Achievement cards use `role="article"`
- Locked/unlocked status communicated via `aria-label`
- Notifications use `role="alert"` and `aria-live="polite"`

### 2. Keyboard Navigation

#### Global Keyboard Support
- **Skip to main content**: Press Tab on page load to reveal skip link
- **Tab navigation**: All interactive elements accessible via Tab key
- **Enter/Space**: Activate buttons and controls

#### Tab Navigation
- **Arrow Left/Right**: Navigate between Timer, Metrics, and Achievements tabs
- **Home**: Jump to first tab
- **End**: Jump to last tab
- Active tab receives focus automatically

#### Timer Controls
- **Enter or Space**: Start/pause timer (when not focused on input/button)
- Works globally when timer is visible

#### Form Inputs
- **Tab**: Move between form fields
- **Enter**: Submit/blur input field
- **Escape**: Cancel input (browser default)

### 3. Screen Reader Announcements

The application includes a custom `ScreenReaderAnnouncer` component that provides real-time updates:

#### Session Transitions
- "Study session started" when study begins
- "Rest session started" when rest begins
- "Study session completed" when study timer reaches zero
- "Rest session completed" when rest timer reaches zero

#### Timer State Changes
- "Timer started" when user starts the timer
- "Timer paused" when user pauses the timer

#### Achievement Unlocks
- "Achievement unlocked: [Achievement Name]" when earned
- Announcements use `aria-live="polite"` to avoid interrupting user

#### Implementation
```javascript
// Live region with polite priority
<div role="status" aria-live="polite" aria-atomic="true">
  {announcement}
</div>
```

### 4. Focus Indicators

#### Visual Focus Styles
All interactive elements have visible focus indicators:

```css
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

#### Enhanced Focus for Interactive Elements
- Buttons: 2px accent-colored outline with offset
- Links: Same outline treatment
- Form inputs: Ring style focus with accent color
- Custom focus styles respect theme colors

### 5. Screen Reader Only Content

#### SR-Only Utility Class
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

#### Usage
- Timer status descriptions
- Additional context for visual elements
- Skip to main content link (visible on focus)

### 6. Color Contrast

All themes meet WCAG AA standards for text contrast:
- Text on background: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Focus indicators: Clearly visible in all themes

## Testing Accessibility

### Keyboard Navigation Testing
1. Load the application
2. Press Tab to reveal "Skip to main content" link
3. Navigate through all interactive elements using Tab
4. Use Arrow keys to navigate between tabs
5. Verify all controls are reachable and operable

### Screen Reader Testing
1. Enable screen reader (NVDA, JAWS, VoiceOver, etc.)
2. Navigate through the application
3. Verify announcements for:
   - Session transitions
   - Timer state changes
   - Achievement unlocks
4. Verify all interactive elements are properly labeled

### Focus Indicator Testing
1. Navigate using keyboard only
2. Verify focus indicators are visible on all interactive elements
3. Test in all four theme palettes
4. Ensure focus indicators have sufficient contrast

## Browser Support

Accessibility features are supported in:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Future Enhancements

Potential accessibility improvements for future releases:
- High contrast mode support
- Reduced motion preferences
- Font size customization
- Additional keyboard shortcuts
- Voice control support
- More granular screen reader announcements

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/)
