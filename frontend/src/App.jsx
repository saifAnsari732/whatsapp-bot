import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SettingsModal from './components/SettingsModal';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import './index.css'; // Make sure this is imported

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <Router>
      <div className="app-layout">
        <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </div>
    </Router>
  );
}

export default App;
