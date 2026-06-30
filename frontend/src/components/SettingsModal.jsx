import React, { useState, useEffect } from 'react';
import { X, Save, Bot } from 'lucide-react';
import { getSettings, updateSettings } from '../services/api';

const SettingsModal = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      const res = await getSettings();
      if (res.data && res.data.systemPrompt) {
        setPrompt(res.data.systemPrompt);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSave = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setStatus('Saving...');
    try {
      await updateSettings(prompt);
      setStatus('Settings saved successfully!');
      setTimeout(() => {
        setStatus('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-effect">
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={24} className="neon-text" /> AI Brain Settings
          </h2>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>
        
        <div className="modal-body">
          <p className="modal-description">
            Teach your AI how to behave. Enter your company's services, prices, and rules below. The AI will read this before answering any customer!
          </p>
          <textarea 
            className="broadcast-textarea neon-border"
            placeholder="e.g. You are a tech assistant for X Solutions. We build websites for $500..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            style={{ minHeight: '200px' }}
          />
          {status && <p className={`status-text ${status.includes('success') ? 'success' : ''}`}>{status}</p>}
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn-primary neon-btn" onClick={handleSave} disabled={loading || !prompt.trim()}>
            <Save size={18} /> {loading ? 'Saving...' : 'Save AI Brain'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
