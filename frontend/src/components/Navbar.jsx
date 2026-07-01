import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, MessageCircle, Settings, Home } from 'lucide-react';

const Navbar = ({ onOpenSettings }) => {
  const location = useLocation();

  return (
    <nav className="global-navbar glass-effect">
      <div className="nav-brand">
        <Bot size={28} className="neon-text" />
        <h1>Kisan Digital AI</h1>
      </div>
      
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={18} /> Home
        </Link>
        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <MessageCircle size={18} /> Dashboard
        </Link>
      </div>

      <div className="nav-actions">
        <button className="settings-btn neon-border" onClick={onOpenSettings}>
          <Settings size={18} /> AI Settings
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
