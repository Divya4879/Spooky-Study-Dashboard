# 🎃 Spooky Study Dashboard

A Halloween-themed productivity application that transforms traditional pomodoro timer functionality into an immersive supernatural experience. Study with ghost companions, unlock spooky achievements, and track your productivity through atmospheric themes and engaging audio experiences.

Check it out here:- https://spooky-study-dashboard.netlify.app

<img width="1235" height="896" alt="image" src="https://github.com/user-attachments/assets/f74c2e16-e31a-4e70-841b-51e575668638" />

---

## ✨ Features

### 🕰️ **Intelligent Timer System**
- **Pomodoro Technique**: Configurable work/break sessions with visual progress tracking
- **Session Management**: Customizable study (25-90 min) and rest (5-20 min) durations
- **Visual Feedback**: Coffin-shaped timer display with animated progress indicators
- **Audio Cues**: Success sounds and atmospheric feedback for session transitions

### 🎨 **Dynamic Theme System**
- **4 Atmospheric Themes**: Vampire Crimson, Witch Forest, Haunted Midnight, and Graveyard
- **WCAG AA Compliant**: All themes meet accessibility standards for color contrast
- **CSS Variable Integration**: Seamless theme switching with Tailwind CSS
- **Animated Backgrounds**: CSS-based environmental animations for each theme

### 👻 **Ghost Companion System**
- **5 Supernatural Companions**: Baby Ghost, Witch Ghost, Vampire, Werewolf, and Angel
- **Emotional States**: Companions react to timer activity and user behavior
- **Ambient Audio**: Each ghost features unique atmospheric soundscapes
- **Framer Motion Animations**: Smooth, engaging companion animations

### 🏆 **Achievement System**
- **Progress Tracking**: Monitor study consistency and productivity patterns
- **Unlockable Rewards**: Halloween-themed achievements with visual notifications
- **Persistent Storage**: Local storage maintains progress across sessions
- **Real-time Feedback**: Achievement unlock animations and screen reader announcements

### 📊 **Analytics & Metrics**
- **Session Statistics**: Track completed sessions, total study time, and productivity trends
- **Visual Charts**: Recharts-powered productivity visualization
- **Historical Data**: Long-term progress monitoring and insights
- **Performance Analytics**: Study habit analysis and improvement suggestions

### 🔊 **Immersive Audio System**
- **Companion Audio**: Continuous ambient sounds for each ghost companion
- **Scary Mode**: Mixed audio overlay triggered by timer interruptions
- **Success Mode**: Celebration audio for completed sessions
- **Volume Controls**: User-adjustable audio levels with mute functionality

### ♿ **Accessibility Features**
- **WCAG 2.1 AA Compliance**: Comprehensive accessibility implementation
- **Screen Reader Support**: ARIA labels, live regions, and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility with focus management
- **Screen Reader Announcements**: Real-time updates for timer and achievement events

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16.0.0 or higher
- **npm** 7.0.0 or higher (or **yarn** 1.22.0+)

### Installation

```bash
# Clone the repository
git clone https://github.com/Divya4879/Spooky-Study-Dashboard.git
cd spooky-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Deployment

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Run Tests

```bash
# Run test suite
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 🏗️ Architecture

### Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend** | React | 19.2.0 | UI framework with modern hooks |
| **Build Tool** | Vite | 7.2.4 | Fast development and optimized builds |
| **Styling** | Tailwind CSS | 4.1.17 | Utility-first CSS framework |
| **Testing** | Vitest | 4.0.14 | Unit and integration testing |
| **Charts** | Recharts | 3.5.1 | Data visualization |
| **Animations** | Framer Motion | 12.23.24 | Smooth UI animations |

### Project Structure

```
spooky-dashboard/
├── .kiro/                 # Kiro development specifications
│   │   ├── specs/
│   │   │   ├── bloodbound-academy/
│   │   │   │   ├── requirements.md
│   │   │   │   └── design.md
│   │   │   │   └── tasks.md
├── public/                    # Static assets
│   ├── *.mp3                  # Audio files for ghost companions
│   └── index.html             # HTML template
├── src/
│   ├── components/            # React components
│   │   ├── Achievements/      # Achievement system components
│   │   ├── Audio/            # Audio management components
│   │   ├── Ghost/            # Ghost companion components
│   │   ├── Metrics/          # Analytics and chart components
│   │   ├── Theme/            # Theme selection components
│   │   └── Timer/            # Core timer functionality
│   ├── context/              # React context providers
│   │   ├── AppContext.jsx    # Global application state
│   │   └── ThemeContext.jsx  # Theme management
│   ├── constants/            # Configuration and data
│   │   ├── achievements.js   # Achievement definitions
│   │   ├── ghosts.js        # Ghost companion data
│   │   └── themes.js        # Theme color palettes
│   ├── hooks/               # Custom React hooks
│   │   ├── useTimer.js      # Timer logic and state
│   │   ├── useMetrics.js    # Analytics and tracking
│   │   ├── useAchievements.js # Achievement system
│   │   └── useLocalStorage.js # Persistent storage
│   ├── utils/               # Helper functions
│   │   ├── achievements.js  # Achievement calculation logic
│   │   ├── calculations.js  # Mathematical utilities
│   │   ├── colorContrast.js # WCAG compliance utilities
│   │   └── storage.js       # Local storage management
│   ├── App.jsx              # Main application component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles and theme variables
├── package.json            # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
```

### State Management

The application uses a combination of React Context and custom hooks for state management:

- **AppContext**: Global state for timer, achievements, metrics, and user preferences
- **ThemeContext**: Theme selection and CSS variable management
- **Custom Hooks**: Encapsulated logic for timer, achievements, metrics, and storage
- **Local Storage**: Persistent data storage for user progress and preferences

---

## 🎮 Usage Guide

### Getting Started

1. **Launch the Application**: Open the app and click "Enter the Haunted Study Realm"
2. **Select Your Theme**: Choose from 4 atmospheric themes using the theme palette
3. **Choose Your Companion**: Select a ghost companion from the sidebar
4. **Configure Sessions**: Set your preferred study and rest durations
5. **Start Studying**: Click the coffin timer to begin your spooky study session

### Timer Controls

- **Start/Pause**: Click the coffin timer or use spacebar
- **Reset**: Use the reset button to restart the current session
- **Configure**: Adjust study/rest durations and planned cycles

### Theme Customization

Switch between 4 carefully crafted themes:

- **Vampire Crimson**: Dark red palette with blood-inspired animations
- **Witch Forest**: Mystical green tones with haunting forest vibes
- **Haunted Midnight**: Deep purple theme with moonlit atmosphere
- **Graveyard**: Monochromatic gray with toxic green accents

### Ghost Companions

- **Baby Ghost**
- **Witch Ghost**
- **Vampire**
- **Werewolf**
- **Angel**

### Achievement System

Unlock achievements by:
- Completing study sessions consistently
- Reaching time-based milestones
- Exploring different themes and companions
- Maintaining study streaks

---

## 🧪 Testing

### Test Coverage

The application includes comprehensive test coverage:

- **Unit Tests**: Individual component and utility function testing
- **Integration Tests**: Context providers and hook interactions
- **Accessibility Tests**: WCAG compliance and keyboard navigation
- **Theme Tests**: CSS variable application and color contrast verification

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- Timer/TimerDisplay.test.jsx

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode during development
npm test -- --watch
```

### Test Categories

- **Component Tests**: Rendering, props, and user interactions
- **Hook Tests**: Custom hook behavior and state management
- **Context Tests**: Provider functionality and state updates
- **Utility Tests**: Helper functions and calculations
- **Accessibility Tests**: ARIA attributes and keyboard navigation

---

## 🎨 Theme

### CSS Variable Integration

The application uses CSS custom properties for dynamic theming:

```css
:root {
  --color-primary: #8B0000;
  --color-secondary: #DC143C;
  --color-accent: #FF0000;
  --color-background: #0D0208;
  --color-text: #FFE4E1;
}
```

### Tailwind Integration

Theme colors are integrated with Tailwind CSS utilities:

```jsx
<div className="bg-primary text-text border-accent">
  Themed component
</div>
```

### Custom Theme Development

To add new themes:

1. Define colors in `src/constants/themes.js`
2. Ensure WCAG AA compliance using `src/utils/colorContrast.js`
3. Test with all components and add to theme selector

---

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest 2 versions | ✅ Fully supported |
| Firefox | Latest 2 versions | ✅ Fully supported |
| Safari | Latest 2 versions | ✅ Fully supported |
| Edge | Latest 2 versions | ✅ Fully supported |

### Progressive Enhancement

- **Core Functionality**: Works without JavaScript (basic timer display)
- **Enhanced Experience**: Full features with modern browser support
- **Graceful Degradation**: Fallbacks for older browsers

---

## 🚀 Deployment

### Static Site Deployment

The application builds to static files and can be deployed to any static hosting service:

#### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

#### Vercel
```bash
npm run build
# Deploy dist/ folder to Vercel
```

#### GitHub Pages
```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

### Environment Configuration

No environment variables required for basic functionality.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Transform your study sessions into a supernatural adventure!** 👻📚

*Built with 🎃 by Divya who believe productivity should be fun and accessible to everyone.*
