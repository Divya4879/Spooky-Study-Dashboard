import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { GHOST_VARIANTS } from '../../constants/ghosts';

const GHOST_AUDIO_MAP = {
  'baby-ghost': '/ghost.mp3',
  'witch-ghost': '/witch.mp3',
  'vampire': '/vampire.mp3',
  'werewolf': '/werewolf.mp3',
  'angel': '/angel.mp3'
};

const SCARY_AUDIO_FILES = [
  '/haunt-1.mp3',
  '/haunt-2.mp3'
];

export function AudioManager({ onTimerEvent }) {
  const { preferences, timer } = useAppContext();
  const audioRef = useRef(null);
  const mixedAudioRefs = useRef([]);
  const scaryAudioRefs = useRef([]);
  const successAudioRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState('');

  const currentGhost = GHOST_VARIANTS[preferences.ghostVariant] || GHOST_VARIANTS['babyGhost'];
  const currentAudioFile = GHOST_AUDIO_MAP[preferences.ghostVariant] || GHOST_AUDIO_MAP['baby-ghost'];

  const prevTimerRef = useRef({ isActive: false, currentTime: 0 });

  // Initialize audio files
  useEffect(() => {
    mixedAudioRefs.current = Object.values(GHOST_AUDIO_MAP).map(src => {
      const audio = new Audio(src);
      audio.volume = volume * 0.7;
      return audio;
    });

    scaryAudioRefs.current = SCARY_AUDIO_FILES.map(src => {
      const audio = new Audio(src);
      audio.volume = volume * 0.7;
      return audio;
    });

    successAudioRef.current = new Audio('/success.mp3');
    successAudioRef.current.volume = volume;
  }, []);

  // Watch for timer events
  useEffect(() => {
    const prev = prevTimerRef.current;
    
    // Timer paused or reset - SCARY MODE
    if (prev.isActive && !timer.isActive && timer.currentTime > 0) {
      triggerScaryMode();
    }
    
    // Timer completed successfully
    if (prev.currentTime > 0 && timer.currentTime === 0 && !timer.isActive) {
      triggerSuccessMode();
    }

    prevTimerRef.current = { isActive: timer.isActive, currentTime: timer.currentTime };
  }, [timer.isActive, timer.currentTime]);

  // Initialize/update audio when ghost changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(currentAudioFile);
    audio.volume = volume;
    audio.loop = true;
    
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    
    audioRef.current = audio;

    if (isEnabled) {
      setTimeout(() => {
        audio.play().catch(() => {});
      }, 500);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [preferences.ghostVariant, currentAudioFile, isEnabled]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    mixedAudioRefs.current.forEach(audio => {
      audio.volume = volume * 0.7;
    });
    scaryAudioRefs.current.forEach(audio => {
      audio.volume = volume * 0.7;
    });
    if (successAudioRef.current) {
      successAudioRef.current.volume = volume;
    }
  }, [volume]);

  const triggerScaryMode = () => {
    if (!isEnabled) return;
    
    // Play all ghost sounds + scary sounds at full volume
    [...mixedAudioRefs.current, ...scaryAudioRefs.current].forEach(audio => {
      audio.volume = 1.0;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });

    setOverlayType('scary');
    setShowOverlay(true);
    
    setTimeout(() => {
      [...mixedAudioRefs.current, ...scaryAudioRefs.current].forEach(audio => {
        audio.pause();
        audio.volume = volume * 0.7;
      });
      setShowOverlay(false);
    }, 10000);
  };

  const triggerSuccessMode = () => {
    if (!isEnabled) return;

    // Play success sound
    if (successAudioRef.current) {
      successAudioRef.current.currentTime = 0;
      successAudioRef.current.play().catch(() => {});
    }

    setOverlayType('success');
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 10000);
  };

  const toggleAudio = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    
    if (audioRef.current) {
      if (newState) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <>
      <div className="audio-controls">
        <button 
          onClick={toggleAudio}
          className="audio-toggle"
          title={isEnabled ? `Mute ${currentGhost.name} Sounds` : `Enable ${currentGhost.name} Sounds`}
        >
          {isEnabled ? (isPlaying ? '🔊' : '🔉') : '🔇'}
        </button>
        
        {isEnabled && (
          <div className="volume-control">
            <span className="volume-icon">👻</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
            <span className="volume-label">{Math.round(volume * 100)}%</span>
          </div>
        )}
      </div>

      {showOverlay && (
        <div className={`timer-overlay ${overlayType === 'scary' ? 'scary-mode' : overlayType === 'success' ? 'success-mode' : ''}`}>
          {overlayType === 'scary' && (
            <div className="scary-floating-emojis">
              <div className="scary-emoji">🦇</div>
              <div className="scary-emoji">🕷️</div>
              <div className="scary-emoji">👹</div>
              <div className="scary-emoji">🧛</div>
              <div className="scary-emoji">💀</div>
            </div>
          )}
          {overlayType === 'success' && (
            <div className="success-floating-emojis">
              <div className="success-emoji">🎉</div>
              <div className="success-emoji">⭐</div>
              <div className="success-emoji">🏆</div>
              <div className="success-emoji">✨</div>
              <div className="success-emoji">🎊</div>
            </div>
          )}
          <div className={`${overlayType}-animation`}>
            {overlayType === 'scary' ? '💀👻🔥' : overlayType === 'success' ? '🎉🏆✨' : '🎉👻💖'}
          </div>
        </div>
      )}
    </>
  );
}
