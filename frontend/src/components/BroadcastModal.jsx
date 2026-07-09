import React, { useState } from 'react';
import { X, Send, Image, Type } from 'lucide-react';
import { broadcastMessage, broadcastTemplate } from '../services/api';

const BroadcastModal = ({ isOpen, onClose }) => {
  const [broadcastType, setBroadcastType] = useState('text'); // 'text' or 'template'
  const [message, setMessage] = useState('');
  
  // Template states
  const [templateName, setTemplateName] = useState('join_kisanchoice_company');
  const [languageCode, setLanguageCode] = useState('en');
  const [imageUrl, setImageUrl] = useState('');
  
  // Manual numbers state
  const [manualNumbers, setManualNumbers] = useState('');

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleBroadcast = async () => {
    if (broadcastType === 'text' && !message.trim()) return;
    if (broadcastType === 'template' && !templateName.trim()) return;
    
    setLoading(true);
    setStatus('Sending broadcast to all contacts...');
    
    try {
      let response;
      if (broadcastType === 'text') {
        response = await broadcastMessage(message.trim(), manualNumbers);
      } else {
        response = await broadcastTemplate(templateName.trim(), languageCode, imageUrl.trim(), manualNumbers);
      }
      
      setStatus(`Success! Message sent to ${response.data.sentCount} out of ${response.data.totalContacts} contacts.`);
      setTimeout(() => {
        onClose();
        setMessage('');
        setStatus('');
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus('Failed to send broadcast.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-effect">
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={20} className="neon-text" /> 
            Broadcast Message
          </h2>
          <button onClick={onClose} className="icon-btn"><X size={20} /></button>
        </div>
        
        <div className="modal-body">
          <div className="toggle-container">
            <button 
              className={`toggle-btn ${broadcastType === 'text' ? 'active' : ''}`} 
              onClick={() => setBroadcastType('text')}
            >
              <Type size={16} /> Text Message
            </button>
            <button 
              className={`toggle-btn ${broadcastType === 'template' ? 'active' : ''}`} 
              onClick={() => setBroadcastType('template')}
            >
              <Image size={16} /> Template Message
            </button>
          </div>

          <p className="modal-description" style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            Reach all your customers instantly. Choose a regular text message or an approved rich template.
          </p>
          
          {broadcastType === 'text' ? (
            <div className="template-card">
              <div className="form-group">
                <label className="form-label">Message Content</label>
                <textarea 
                  className="form-control"
                  style={{ minHeight: '120px', resize: 'vertical' }}
                  placeholder="Type your announcement or offer here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          ) : (
            <div className="template-card">
              <div className="form-group">
                <label className="form-label">Template Name</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={templateName} 
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., join_kisanchoice_company"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Language Code</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={languageCode} 
                  onChange={(e) => setLanguageCode(e.target.value)}
                  placeholder="e.g., en, hi"
                  disabled={loading}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Header Image URL (Optional)</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="https://example.com/banner.jpg"
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="template-card" style={{ marginTop: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Send to Specific Numbers (Optional)</label>
              <textarea 
                className="form-control"
                style={{ minHeight: '60px', resize: 'vertical' }}
                placeholder="Leave blank to send to ALL contacts. Or paste comma-separated numbers here (e.g. 919000000000, 918000000000)"
                value={manualNumbers}
                onChange={(e) => setManualNumbers(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {status && (
            <div className={`status-badge ${status.includes('Success') ? 'success' : 'error'}`}>
              {status}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button 
            className="btn-primary neon-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={handleBroadcast} 
            disabled={loading || (broadcastType === 'text' && !message.trim()) || (broadcastType === 'template' && !templateName.trim())}
          >
            <Send size={18} /> {loading ? 'Sending...' : 'Broadcast Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BroadcastModal;
