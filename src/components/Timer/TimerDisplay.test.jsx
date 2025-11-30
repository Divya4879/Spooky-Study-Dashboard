import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { TimerDisplay } from './TimerDisplay';

describe('TimerDisplay', () => {
  afterEach(() => {
    cleanup();
  });

  it('should format time correctly in MM:SS format', () => {
    render(
      <TimerDisplay 
        currentTime={125} 
        sessionType="study" 
        progress={0.5} 
        isActive={false}
      />
    );
    
    expect(screen.getByText('02:05')).toBeTruthy();
  });

  it('should display study session label', () => {
    render(
      <TimerDisplay 
        currentTime={1500} 
        sessionType="study" 
        progress={0.5} 
        isActive={false}
      />
    );
    
    expect(screen.getByText('Study Session')).toBeTruthy();
  });

  it('should display rest session label', () => {
    render(
      <TimerDisplay 
        currentTime={300} 
        sessionType="rest" 
        progress={0.5} 
        isActive={false}
      />
    );
    
    expect(screen.getByText('Rest Session')).toBeTruthy();
  });

  it('should show active indicator when timer is active', () => {
    render(
      <TimerDisplay 
        currentTime={1500} 
        sessionType="study" 
        progress={0.5} 
        isActive={true}
      />
    );
    
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('should not show active indicator when timer is paused', () => {
    render(
      <TimerDisplay 
        currentTime={1500} 
        sessionType="study" 
        progress={0.5} 
        isActive={false}
      />
    );
    
    expect(screen.queryByText('Active')).toBeNull();
  });

  it('should format zero time correctly', () => {
    render(
      <TimerDisplay 
        currentTime={0} 
        sessionType="study" 
        progress={1} 
        isActive={false}
      />
    );
    
    expect(screen.getByText('00:00')).toBeTruthy();
  });

  it('should pad single digit minutes and seconds', () => {
    render(
      <TimerDisplay 
        currentTime={65} 
        sessionType="study" 
        progress={0.5} 
        isActive={false}
      />
    );
    
    expect(screen.getByText('01:05')).toBeTruthy();
  });
});
