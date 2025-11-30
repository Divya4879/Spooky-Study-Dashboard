import React, { useState, useEffect, useRef } from 'react';

export function LandingPage({ onEnter }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ghostVisible, setGhostVisible] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGhostVisible(prev => !prev);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: '⚰️', title: 'CURSED TIMER', desc: 'Ancient pomodoro rituals bind your focus to the mortal realm' },
    { icon: '👻', title: 'SPECTRAL GUIDES', desc: 'Five haunted spirits possess your productivity sessions' },
    { icon: '🩸', title: 'BLOOD THEMES', desc: 'Vintage horror palettes from the depths of darkness' },
    { icon: '📈', title: 'SOUL TRACKER', desc: 'Chart your descent into obsessive focus and madness' },
    { icon: '🏆', title: 'FORBIDDEN REWARDS', desc: 'Cursed achievements bind you to eternal study' },
    { icon: '💀', title: 'DEATH JOLTS', desc: 'Sudden scares resurrect your dying attention span' }
  ];

  return (
    <div 
      ref={containerRef}
      className="retro-container"
    >
      {/* Scanlines & CRT Effect */}
      <div className="crt-overlay"></div>
      <div className="scanlines"></div>
      
      {/* Interactive Ghost */}
      <div 
        className="cursor-ghost"
        style={{
          left: mousePos.x - 25,
          top: mousePos.y - 25,
          opacity: ghostVisible ? 0.8 : 0
        }}
      >
        👻
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        {['🦇', '🕷️', '🕸️', '🎃', '🔮', '🗝️', '💀', '⚰️'].map((emoji, i) => (
          <div
            key={i}
            className="float-item"
            style={{
              left: `${8 + (i * 12)}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 1.2}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="ghost-mascot">👻</div>
          <h1 className="main-title">
            <span className="title-line">SPOOKY</span>
            <span className="title-line">STUDY</span>
            <span className="title-line">DASHBOARD</span>
          </h1>
          <p className="hero-subtitle">
            Surrender your soul to ancient spirits of productivity.<br/>
            Let cursed rituals guide your focus through eternal darkness.
          </p>
          <button onClick={onEnter} className="crypt-button">
            <span className="button-text">ENTER THE CRYPT</span>
            <span className="button-icon">🗝️</span>
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">CURSED ABILITIES</h2>
        <div className="features-grid">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`feature-card ${activeFeature === i ? 'active' : ''}`}
              onMouseEnter={() => setActiveFeature(i)}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2 className="cta-title">READY TO HAUNT YOUR PRODUCTIVITY?</h2>
        <p className="cta-subtitle">Join the spectral study revolution</p>
        <button onClick={onEnter} className="crypt-button secondary">
          <span className="button-text">BEGIN HAUNTED JOURNEY</span>
          <span className="button-icon">👻</span>
        </button>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Creepster&family=Nosifer&family=Butcherman&display=swap');
        
        .retro-container {
          min-height: 100vh;
          background: 
            radial-gradient(circle at 25% 25%, #1a0b0b 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #0b1a0b 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 25%, #0a0a1a 50%, #1a0a0a 75%, #0a0a0a 100%);
          color: #e8d5b7;
          overflow-x: hidden;
          position: relative;
        }

        .crt-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%);
          pointer-events: none;
          z-index: 1000;
        }

        .scanlines {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, 0.03) 2px,
            rgba(0, 255, 0, 0.03) 4px
          );
          pointer-events: none;
          z-index: 999;
          animation: scanline-flicker 0.15s linear infinite;
        }

        .cursor-ghost {
          position: absolute;
          font-size: 2rem;
          pointer-events: none;
          z-index: 998;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: ghost-float 3s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .float-item {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0.15;
          animation: vintage-float 8s ease-in-out infinite;
        }

        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          z-index: 10;
        }

        .hero-content {
          text-align: center;
          max-width: 800px;
          animation: hero-entrance 2s ease-out forwards;
        }

        .ghost-mascot {
          font-size: 6rem;
          margin-bottom: 2rem;
          animation: mascot-bounce 4s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
        }

        .main-title {
          font-family: 'Nosifer', cursive;
          font-size: clamp(3rem, 8vw, 7rem);
          line-height: 0.9;
          margin-bottom: 2rem;
          text-align: center;
        }

        .title-line {
          display: block;
          background: linear-gradient(45deg, #8b0000, #dc143c, #ff4500, #dc143c, #8b0000);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: blood-flow 4s ease-in-out infinite;
          text-shadow: 
            0 0 30px rgba(220, 20, 60, 0.8),
            0 5px 0 #4a0000,
            0 10px 0 #2a0000,
            0 15px 20px rgba(0, 0, 0, 0.8);
          filter: drop-shadow(0 0 10px rgba(220, 20, 60, 0.5));
        }

        .hero-subtitle {
          font-family: 'Butcherman', serif;
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          line-height: 1.6;
          margin-bottom: 3rem;
          color: #d4af37;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .crypt-button {
          font-family: 'Creepster', cursive;
          font-size: clamp(1.2rem, 3vw, 2rem);
          padding: 1.5rem 3rem;
          background: 
            linear-gradient(45deg, #8b0000, #dc143c, #8b0000),
            linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 200%, 200% 100%;
          border: 3px solid #d4af37;
          border-radius: 0;
          color: #d4af37;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          box-shadow: 
            inset 0 2px 0 rgba(255, 255, 255, 0.2),
            0 0 20px rgba(139, 0, 0, 0.6),
            0 8px 16px rgba(0, 0, 0, 0.8);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          animation: button-pulse 3s ease-in-out infinite;
        }

        .crypt-button:hover {
          transform: scale(1.05) translateY(-2px);
          background-position: 100% 0, 100% 0;
          box-shadow: 
            inset 0 2px 0 rgba(255, 255, 255, 0.3),
            0 0 40px rgba(139, 0, 0, 0.8),
            0 12px 24px rgba(0, 0, 0, 0.9);
          color: #fff;
        }

        .crypt-button.secondary {
          font-size: clamp(1rem, 2.5vw, 1.5rem);
          padding: 1.2rem 2.5rem;
        }

        .button-text {
          margin-right: 0.5rem;
        }

        .button-icon {
          font-size: 1.2em;
          animation: icon-glow 2s ease-in-out infinite alternate;
        }

        .features-section {
          padding: 6rem 2rem;
          position: relative;
          z-index: 10;
        }

        .section-title {
          font-family: 'Creepster', cursive;
          font-size: clamp(2.5rem, 6vw, 4rem);
          text-align: center;
          margin-bottom: 4rem;
          color: #ff4500;
          text-shadow: 
            0 0 20px rgba(255, 69, 0, 0.8),
            0 3px 0 #8b0000,
            0 6px 0 #4a0000,
            0 9px 15px rgba(0, 0, 0, 0.6);
          animation: title-flicker 4s ease-in-out infinite;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 75vw;
        }

        .feature-card {
          background: 
            linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(40, 20, 20, 0.9)),
            radial-gradient(circle at top right, rgba(139, 0, 0, 0.2), transparent);
          border: 3px solid #8b0000;
          border-radius: 0;
          padding: 2.5rem 2rem;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 
            inset 0 2px 0 rgba(139, 0, 0, 0.3),
            0 4px 15px rgba(0, 0, 0, 0.8);
          animation: card-entrance 1s ease-out forwards;
          opacity: 0;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
          transition: left 0.6s ease;
        }

        .feature-card:hover::before,
        .feature-card.active::before {
          left: 100%;
        }

        .feature-card:hover,
        .feature-card.active {
          transform: scale(1.05) translateY(-5px);
          border-color: #d4af37;
          background: 
            linear-gradient(135deg, rgba(139, 0, 0, 0.3), rgba(212, 175, 55, 0.2)),
            radial-gradient(circle at center, rgba(255, 69, 0, 0.1), transparent);
          box-shadow: 
            inset 0 2px 0 rgba(212, 175, 55, 0.5),
            0 0 30px rgba(139, 0, 0, 0.6),
            0 8px 25px rgba(0, 0, 0, 0.9);
        }

        .feature-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.2) rotate(5deg);
          animation: icon-bounce 0.6s ease-in-out;
        }

        .feature-title {
          font-family: 'Creepster', cursive;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: #ff4500;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }

        .feature-desc {
          font-family: 'Butcherman', serif;
          font-size: 0.95rem;
          line-height: 1.5;
          color: #d4af37;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
        }

        .cta-section {
          padding: 6rem 2rem;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .cta-title {
          font-family: 'Creepster', cursive;
          font-size: clamp(2rem, 5vw, 3.5rem);
          margin-bottom: 1.5rem;
          color: #9370db;
          text-shadow: 
            0 0 20px rgba(147, 112, 219, 0.8),
            0 3px 0 #4b0082,
            0 6px 0 #2e0052,
            0 9px 15px rgba(0, 0, 0, 0.6);
          animation: cta-glow 3s ease-in-out infinite;
        }

        .cta-subtitle {
          font-family: 'Butcherman', serif;
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          margin-bottom: 3rem;
          color: #d4af37;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }

        /* Animations */
        @keyframes scanline-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes ghost-float {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }

        @keyframes vintage-float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
          25% { transform: translateY(-20px) rotate(5deg); opacity: 0.2; }
          50% { transform: translateY(-10px) rotate(-3deg); opacity: 0.15; }
          75% { transform: translateY(-25px) rotate(3deg); opacity: 0.2; }
        }

        @keyframes hero-entrance {
          0% { opacity: 0; transform: scale(0.9) translateY(50px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes mascot-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }

        @keyframes blood-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes button-pulse {
          0%, 100% { box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.2), 0 0 20px rgba(139, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.8); }
          50% { box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.3), 0 0 40px rgba(139, 0, 0, 0.8), 0 12px 24px rgba(0, 0, 0, 0.9); }
        }

        @keyframes icon-glow {
          0% { filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.5)); }
          100% { filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.8)); }
        }

        @keyframes title-flicker {
          0%, 100% { opacity: 1; }
          95% { opacity: 1; }
          96% { opacity: 0.8; }
          97% { opacity: 1; }
          98% { opacity: 0.9; }
          99% { opacity: 1; }
        }

        @keyframes card-entrance {
          0% { opacity: 0; transform: translateY(50px) rotateX(45deg); }
          100% { opacity: 1; transform: translateY(0) rotateX(0); }
        }

        @keyframes icon-bounce {
          0%, 100% { transform: scale(1.2) rotate(5deg); }
          50% { transform: scale(1.3) rotate(-5deg); }
        }

        @keyframes cta-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(147, 112, 219, 0.8), 0 3px 0 #4b0082, 0 6px 0 #2e0052, 0 9px 15px rgba(0, 0, 0, 0.6); }
          50% { text-shadow: 0 0 40px rgba(147, 112, 219, 1), 0 3px 0 #4b0082, 0 6px 0 #2e0052, 0 9px 20px rgba(0, 0, 0, 0.8); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
            width: 90vw;
          }
          
          .feature-card {
            padding: 2rem 1.5rem;
          }
          
          .hero-section,
          .features-section,
          .cta-section {
            padding: 4rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
