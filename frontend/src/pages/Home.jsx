import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="ai-status-badge">
          <span className="pulse-dot"></span>
          AI Auto-Reply is Active & Authentic
        </div>
        
        <h1 className="hero-title">
          Welcome to your <span className="neon-text">Smart Tech Assistant</span>
        </h1>
        
        <p className="hero-subtitle">
          Your WhatsApp is now powered by Google Gemini. It reads your business rules, talks to your customers like a real human, and books your services 24/7.
        </p>

        <div className="hero-actions">
          <Link to="/dashboard" className="btn-primary neon-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Go to Live Dashboard <ArrowRight size={20} />
          </Link>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-effect">
            <Bot size={32} className="neon-text" />
            <h3>Intelligent Responses</h3>
            <p>Understands complex customer queries regarding Web, App, and Social Media services.</p>
          </div>
          <div className="feature-card glass-effect">
            <Zap size={32} style={{ color: '#fbbf24' }} />
            <h3>Lightning Fast</h3>
            <p>Instant replies to your customers, ensuring you never miss a lead or inquiry.</p>
          </div>
          <div className="feature-card glass-effect">
            <ShieldCheck size={32} style={{ color: '#10b981' }} />
            <h3>100% Authentic</h3>
            <p>Follows the exact pricing and rules you set in the AI Settings panel.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
