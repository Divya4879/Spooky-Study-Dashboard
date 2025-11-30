# 🎃 Spooky Study Dashboard

A Halloween-themed productivity application that gamifies study sessions with supernatural companions, atmospheric themes, and immersive audio experiences.

## 🌟 Overview

The Spooky Study Dashboard transforms traditional pomodoro timer functionality into an engaging Halloween experience. Users can customize their study environment with different supernatural themes, select ghost companions, and track their productivity through an achievement system.

## 🛠️ Technology Stack

- **Frontend**: React 19.2.0 with modern hooks and context API
- **Build Tool**: Vite 7.2.4 for fast development and optimized builds
- **Styling**: Tailwind CSS 4.1.17 with custom CSS animations
- **Testing**: Vitest 4.0.14 with React Testing Library
- **Charts**: Recharts 3.5.1 for productivity visualization
- **Animations**: Framer Motion 12.23.24 for smooth transitions

## 🎨 Core Features

### Timer System
- **Pomodoro Timer**: Configurable work and break sessions
- **Session Types**: Work sessions, short breaks, and long breaks
- **Visual Display**: Coffin-shaped timer with progress indicators
- **Audio Feedback**: Success and scary mode sound effects

### Theme System
- **4 Atmospheric Themes**:
  - **Vampire Crimson**: Dark red palette with blood droplet animations
  - **Witch Forest**: Green tones with haunting tree silhouettes
  - **Haunted Midnight**: Black theme with flickering moonlight
  - **Graveyard**: Gray palette with toxic green accents
- **Dynamic Backgrounds**: CSS-based animated environments
- **Responsive Design**: Adapts to different screen sizes

### Ghost Companions
- **5 Supernatural Companions**:
  - Baby Ghost (innocent and cute)
  - Witch Ghost (magical powers)
  - Vampire (sophisticated night creature)
  - Werewolf (fierce and loyal)
  - Angel (heavenly guardian)
- **Companion Audio**: Each ghost has unique ambient sounds
- **Emotional States**: Companions react to user activity

### Audio System
- **Ambient Sounds**: Continuous background audio per ghost companion
- **Scary Mode**: Triggered when timer is paused/reset (mixed audio overlay)
- **Success Mode**: Celebration audio when sessions complete
- **Volume Controls**: User-adjustable audio levels

### Achievement System
- **Progress Tracking**: Monitors study consistency and patterns
- **Unlockable Achievements**: Halloween-themed rewards
- **Visual Notifications**: Achievement unlock animations
- **Persistence**: Local storage for progress retention

### Metrics & Analytics
- **Session Statistics**: Track completed sessions and time studied
- **Productivity Charts**: Visual representation of study patterns
- **Historical Data**: Long-term progress monitoring
- **Performance Insights**: Study habit analysis

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── Achievements/     # Achievement system
│   ├── Audio/           # Audio management
│   ├── Ghost/           # Companion system
│   ├── Metrics/         # Analytics and charts
│   ├── Theme/           # Theme selection
│   └── Timer/           # Core timer functionality
├── context/             # React context providers
├── constants/           # Configuration data
├── hooks/              # Custom React hooks
└── utils/              # Helper functions
```

### State Management
- **React Context**: Global state management for timer, themes, and preferences
- **Local Storage**: Persistent data storage for user progress
- **Custom Hooks**: Reusable logic for timer, achievements, and metrics

### Accessibility
- **Screen Reader Support**: ARIA labels and announcements
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus indicators
- **Color Contrast**: WCAG compliant color schemes

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd spooky-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Development
The application runs on `http://localhost:5173` in development mode with hot module replacement enabled.

## 📁 Project Structure

### Key Files
- `src/App.jsx` - Main application component with routing logic
- `src/context/AppContext.jsx` - Global state management
- `src/context/ThemeContext.jsx` - Theme system management
- `src/index.css` - Global styles and theme animations
- `public/` - Static assets including audio files

### Configuration
- `vite.config.js` - Build tool configuration
- `tailwind.config.js` - CSS framework setup
- `package.json` - Dependencies and scripts

## 🎵 Audio Assets

The application includes atmospheric audio files:
- Ghost companion ambient sounds (5 files)
- Scary mode sound effects (2 files)
- Success celebration audio (1 file)

## 🧪 Testing

Comprehensive test suite covering:
- Component rendering and interactions
- Context providers and state management
- Custom hooks functionality
- Utility functions
- Integration tests for theme system

## 📱 Responsive Design

Optimized for:
- Desktop computers (primary target)
- Tablets and mobile devices
- Various screen resolutions
- Different aspect ratios

## 🔧 Build & Deployment

- **Development**: Vite dev server with HMR
- **Production**: Optimized build with code splitting
- **Deployment**: Static site generation compatible with Netlify, Vercel, etc.

## 📄 License

ISC License - See package.json for details.

---

*Transform your study sessions into a supernatural adventure with the Spooky Study Dashboard!* 👻📚
