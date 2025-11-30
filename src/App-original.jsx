import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

// Landing page
import { LandingPage } from './components/LandingPage';

// Timer components
import { TimerDisplay } from './components/Timer/TimerDisplay';
import { TimerControls } from './components/Timer/TimerControls';
import { SessionConfig } from './components/Timer/SessionConfig';

// Theme components
import { ThemePalette } from './components/Theme/ThemePalette';

// Ghost components
import { GhostSelector } from './components/Ghost/GhostSelector';
import { GhostCompanion } from './components/Ghost/GhostCompanion';
import { JumpscareAnimation } from './components/Ghost/JumpscareAnimation';

// Metrics components
import { MetricsCards } from './components/Metrics/MetricsCards';
import { ProductivityChart } from './components/Metrics/ProductivityChart';
import { StatsDisplay } from './components/Metrics/StatsDisplay';

// Achievement components
import { AchievementList } from './components/Achievements/AchievementList';
import { AchievementNotificationContainer } from './components/Achievements/AchievementNotification';

// Accessibility components
import { ScreenReaderAnnouncer } from './components/ScreenReaderAnnouncer';

// Error handling
import ErrorBoundary from './components/ErrorBoundary';

/**
 * Main application content component
 * Separated from App to access context hooks
 */
function AppContent() {
  const { timer, achievements } = useAppContext();
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('timer'); // timer, metrics, achievements

  // Track which achievements to show notifications for
  const [notificationQueue, setNotificationQueue] = useState([]);

  // Screen reader announcements
  const [announcement, setAnnouncement] = useState('');
  const previousSessionType = useRef(timer.sessionType);
  const previousIsActive = useRef(timer.isActive);
  const previousCurrentTime = useRef(timer.currentTime);

  // Tab navigation refs
  const tabRefs = useRef({
    timer: null,
    metrics: null,
    achievements: null
  });

  const tabs = ['timer', 'metrics', 'achievements'];

  // Watch for new achievements and add to notification queue
  useEffect(() => {
    const newlyUnlocked = achievements.newlyUnlocked || [];
    if (newlyUnlocked.length > 0) {
      setNotificationQueue(prev => [...prev, ...newlyUnlocked]);
      
      // Announce achievement unlock to screen readers
      const achievementNames = newlyUnlocked.map(id => {
        const achievement = Object.values(achievements.list).find(a => a.id === id);
        return achievement ? achievement.name : '';
      }).filter(Boolean).join(', ');
      
      if (achievementNames) {
        setAnnouncement(`Achievement unlocked: ${achievementNames}`);
      }
    }
  }, [achievements.newlyUnlocked, achievements.list]);

  // Announce session transitions
  useEffect(() => {
    // Session type changed (study -> rest or rest -> study)
    if (previousSessionType.current !== timer.sessionType) {
      const sessionName = timer.sessionType === 'study' ? 'Study' : 'Rest';
      setAnnouncement(`${sessionName} session started`);
      previousSessionType.current = timer.sessionType;
    }

    // Timer started
    if (!previousIsActive.current && timer.isActive) {
      setAnnouncement('Timer started');
      previousIsActive.current = timer.isActive;
    }

    // Timer paused
    if (previousIsActive.current && !timer.isActive) {
      setAnnouncement('Timer paused');
      previousIsActive.current = timer.isActive;
    }

    // Session completed (time reached 0)
    if (previousCurrentTime.current > 0 && timer.currentTime === 0 && timer.isActive) {
      const sessionName = timer.sessionType === 'study' ? 'Study' : 'Rest';
      setAnnouncement(`${sessionName} session completed`);
    }
    previousCurrentTime.current = timer.currentTime;
  }, [timer.sessionType, timer.isActive, timer.currentTime]);

  /**
   * Handle notification dismissal
   */
  const handleDismissNotification = (achievementId) => {
    setNotificationQueue(prev => prev.filter(id => id !== achievementId));
  };

  /**
   * Handle keyboard navigation for tabs
   */
  const handleTabKeyDown = (event, tabName) => {
    const currentIndex = tabs.indexOf(tabName);
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const newTab = tabs[newIndex];
    setActiveTab(newTab);
    tabRefs.current[newTab]?.focus();
  };

  /**
   * Calculate timer progress for display
   */
  const getTimerProgress = () => {
    const totalDuration = timer.sessionType === 'study' 
      ? timer.studyDuration * 60 
      : timer.restDuration * 60;
    return timer.currentTime / totalDuration;
  };

  // Show landing page first
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
        style={{
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-background)',
        }}
      >
        Skip to main content
      </a>

      {/* Screen Reader Announcements */}
      <ScreenReaderAnnouncer message={announcement} priority="polite" />

      {/* Jumpscare Animation Overlay */}
      <JumpscareAnimation />

      {/* Achievement Notifications */}
      <AchievementNotificationContainer
        achievements={notificationQueue}
        onDismiss={handleDismissNotification}
      />

      {/* Main Container */}
      <div className="container mx-auto px-6 py-10 max-w-7xl" id="main-content">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 
            className="text-6xl font-bold mb-3"
            style={{ color: 'var(--color-text)' }}
            tabIndex="-1"
            id="main-heading"
          >
            👻 Spooky Study Dashboard
          </h1>
          <p 
            className="text-xl mb-6"
            style={{ color: 'var(--color-text)', opacity: 0.8 }}
          >
            Your haunted productivity companion
          </p>
          
          {/* Theme Selector */}
          <div className="flex justify-center">
            <ThemePalette />
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav 
          className="flex justify-center gap-6 mb-12"
          role="tablist"
          aria-label="Main navigation"
        >
          <button
            ref={(el) => (tabRefs.current.timer = el)}
            onClick={() => setActiveTab('timer')}
            onKeyDown={(e) => handleTabKeyDown(e, 'timer')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              activeTab === 'timer' ? 'shadow-lg' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'timer' ? 'var(--color-accent)' : 'var(--color-primary)',
              color: 'var(--color-background)',
            }}
            role="tab"
            aria-selected={activeTab === 'timer'}
            aria-controls="timer-panel"
            id="timer-tab"
            tabIndex={activeTab === 'timer' ? 0 : -1}
          >
            🕐 Timer
          </button>
          <button
            ref={(el) => (tabRefs.current.metrics = el)}
            onClick={() => setActiveTab('metrics')}
            onKeyDown={(e) => handleTabKeyDown(e, 'metrics')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              activeTab === 'metrics' ? 'shadow-lg' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'metrics' ? 'var(--color-accent)' : 'var(--color-primary)',
              color: 'var(--color-background)',
            }}
            role="tab"
            aria-selected={activeTab === 'metrics'}
            aria-controls="metrics-panel"
            id="metrics-tab"
            tabIndex={activeTab === 'metrics' ? 0 : -1}
          >
            📊 Metrics
          </button>
          <button
            ref={(el) => (tabRefs.current.achievements = el)}
            onClick={() => setActiveTab('achievements')}
            onKeyDown={(e) => handleTabKeyDown(e, 'achievements')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              activeTab === 'achievements' ? 'shadow-lg' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'achievements' ? 'var(--color-accent)' : 'var(--color-primary)',
              color: 'var(--color-background)',
            }}
            role="tab"
            aria-selected={activeTab === 'achievements'}
            aria-controls="achievements-panel"
            id="achievements-tab"
            tabIndex={activeTab === 'achievements' ? 0 : -1}
          >
            🏆 Achievements
          </button>
        </nav>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Ghost Companion (visible on all tabs) */}
          <div className="lg:col-span-1">
            <div 
              className="rounded-xl shadow-2xl p-8 sticky top-8"
              style={{
                backgroundColor: 'var(--color-background)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'var(--color-primary)',
              }}
            >
              <GhostCompanion />
              <div className="mt-8">
                <GhostSelector />
              </div>
            </div>
          </div>

          {/* Right Column - Tab Content */}
          <div className="lg:col-span-2">
            {/* Timer Tab */}
            {activeTab === 'timer' && (
              <div 
                className="space-y-10"
                role="tabpanel"
                id="timer-panel"
                aria-labelledby="timer-tab"
              >
                {/* Timer Display */}
                <div 
                  className="rounded-xl shadow-2xl p-10"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-primary)',
                  }}
                >
                  <TimerDisplay
                    currentTime={timer.currentTime}
                    sessionType={timer.sessionType}
                    progress={getTimerProgress()}
                    isActive={timer.isActive}
                  />
                  <TimerControls
                    isActive={timer.isActive}
                    onStart={timer.start}
                    onPause={timer.pause}
                    onReset={timer.reset}
                  />
                </div>

                {/* Session Configuration */}
                <div 
                  className="rounded-xl shadow-2xl"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-primary)',
                  }}
                >
                  <SessionConfig
                    studyDuration={timer.studyDuration}
                    restDuration={timer.restDuration}
                    cyclesPlanned={timer.cyclesPlanned}
                    onStudyDurationChange={timer.setStudyDuration}
                    onRestDurationChange={timer.setRestDuration}
                    onCyclesPlannedChange={timer.setCyclesPlanned}
                    disabled={timer.isActive}
                  />
                </div>

                {/* Cycle Progress */}
                <div 
                  className="rounded-xl shadow-2xl p-8"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: 'var(--color-primary)',
                  }}
                >
                  <h3 
                    className="text-lg font-semibold mb-4 text-center"
                    style={{ color: 'var(--color-text)' }}
                  >
                    Pomodoro Progress
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: timer.cyclesPlanned }).map((_, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300"
                        style={{
                          backgroundColor: index < timer.cyclesCompleted 
                            ? 'var(--color-accent)' 
                            : 'var(--color-secondary)',
                          color: 'var(--color-background)',
                          opacity: index < timer.cyclesCompleted ? 1 : 0.5,
                        }}
                        aria-label={`Cycle ${index + 1} ${index < timer.cyclesCompleted ? 'completed' : 'pending'}`}
                      >
                        {index < timer.cyclesCompleted ? '✓' : index + 1}
                      </div>
                    ))}
                  </div>
                  <p 
                    className="text-center mt-4 text-sm"
                    style={{ color: 'var(--color-text)', opacity: 0.8 }}
                  >
                    {timer.cyclesCompleted} of {timer.cyclesPlanned} cycles completed
                  </p>
                </div>
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <div 
                className="space-y-10"
                role="tabpanel"
                id="metrics-panel"
                aria-labelledby="metrics-tab"
              >
                <MetricsCards />
                <ProductivityChart period="week" />
                <StatsDisplay />
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div
                role="tabpanel"
                id="achievements-panel"
                aria-labelledby="achievements-tab"
              >
                <AchievementList />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center pb-8">
          <p 
            className="text-base mb-2"
            style={{ color: 'var(--color-text)', opacity: 0.7 }}
          >
            Stay spooky and productive! 🎃
          </p>
          <button
            onClick={() => setShowLanding(true)}
            className="text-sm underline hover:no-underline transition-all"
            style={{ color: 'var(--color-text)', opacity: 0.5 }}
          >
            Back to Landing Page
          </button>
        </footer>
      </div>
    </div>
  );
}

/**
 * Main App component
 * Wraps application with context providers and error boundary
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
