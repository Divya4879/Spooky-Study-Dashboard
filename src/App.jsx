import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

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

// Audio components
import { AudioManager } from './components/Audio/AudioManager';

// Accessibility components
import { ScreenReaderAnnouncer } from './components/ScreenReaderAnnouncer';

// Error handling
import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const { timer, achievements } = useAppContext();
  const { currentTheme } = useTheme();
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('timer');
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [announcement, setAnnouncement] = useState('');
  const [showJumpscare, setShowJumpscare] = useState(false);
  
  const previousSessionType = useRef(timer.sessionType);
  const previousIsActive = useRef(timer.isActive);
  const previousCurrentTime = useRef(timer.currentTime);
  const tabRefs = useRef({ timer: null, metrics: null, achievements: null });
  const tabs = ['timer', 'metrics', 'achievements'];

  // Watch for new achievements
  useEffect(() => {
    const newlyUnlocked = achievements.newlyUnlocked || [];
    if (newlyUnlocked.length > 0) {
      setNotificationQueue(prev => [...prev, ...newlyUnlocked]);
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
    if (previousSessionType.current !== timer.sessionType) {
      const sessionName = timer.sessionType === 'study' ? 'Study' : 'Rest';
      setAnnouncement(`${sessionName} session started`);
      previousSessionType.current = timer.sessionType;
    }

    if (!previousIsActive.current && timer.isActive) {
      setAnnouncement('Timer started');
      previousIsActive.current = timer.isActive;
    }

    if (previousIsActive.current && !timer.isActive) {
      setAnnouncement('Timer paused');
      previousIsActive.current = timer.isActive;
    }

    if (previousCurrentTime.current > 0 && timer.currentTime === 0 && timer.isActive) {
      const sessionName = timer.sessionType === 'study' ? 'Study' : 'Rest';
      setAnnouncement(`${sessionName} session completed`);
      
      // Trigger jumpscare on session completion
      setShowJumpscare(true);
      setTimeout(() => setShowJumpscare(false), 3000);
    }
    previousCurrentTime.current = timer.currentTime;
  }, [timer.sessionType, timer.isActive, timer.currentTime]);

  const handleDismissNotification = (achievementId) => {
    setNotificationQueue(prev => prev.filter(id => id !== achievementId));
  };

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

  const getTimerProgress = () => {
    const totalDuration = timer.sessionType === 'study' 
      ? timer.studyDuration * 60 
      : timer.restDuration * 60;
    return timer.currentTime / totalDuration;
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="retro-app" data-theme={currentTheme}>
      {/* CRT Effects */}
      <div className="crt-overlay"></div>
      <div className="scanlines"></div>
      
      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Audio Manager */}
      <AudioManager />

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
      <div className="retro-container" id="main-content">
        {/* Header */}
        <header className="retro-header">
          <h1 className="app-title">
            👻 SPOOKY STUDY DASHBOARD
          </h1>
          <p className="app-subtitle">Your haunted productivity companion</p>
          <div className="theme-selector">
            <ThemePalette />
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="retro-nav" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab}
              ref={(el) => (tabRefs.current[tab] = el)}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(e) => handleTabKeyDown(e, tab)}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === tab}
              tabIndex={activeTab === tab ? 0 : -1}
            >
              {tab === 'timer' && '⚰️ CURSED TIMER'}
              {tab === 'metrics' && '📈 SOUL TRACKER'}
              {tab === 'achievements' && '🏆 FORBIDDEN REWARDS'}
            </button>
          ))}
        </nav>

        {/* Main Content Area */}
        <div className="retro-content">
          {/* Sidebar - Ghost Companion */}
          <div className="retro-sidebar">
            <GhostCompanion />
            <div style={{ marginTop: '2rem' }}>
              <GhostSelector />
            </div>
          </div>

          {/* Main Content */}
          <div className="retro-main">
            {/* Timer Tab */}
            {activeTab === 'timer' && (
              <div role="tabpanel" id="timer-panel" aria-labelledby="timer-tab">
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
                <div style={{ marginTop: '2rem' }}>
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
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <div role="tabpanel" id="metrics-panel" aria-labelledby="metrics-tab">
                <MetricsCards />
                <ProductivityChart period="week" />
                <StatsDisplay />
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div role="tabpanel" id="achievements-panel" aria-labelledby="achievements-tab">
                <AchievementList />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="retro-footer">
          <p className="footer-text">
            Stay spooky and productive! 🎃
          </p>
          <button
            onClick={() => setShowLanding(true)}
            className="back-to-landing"
          >
            Back to Landing Page
          </button>
        </footer>
      </div>
    </div>
  );
}

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
