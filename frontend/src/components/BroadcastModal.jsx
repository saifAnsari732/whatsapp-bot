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
        response = await broadcastMessage(message.trim());
      } else {
        response = await broadcastTemplate(templateName.trim(), languageCode, imageUrl.trim());
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
      <div className="modal-content">
        <div className="modal-header">
          <h2>Broadcast Message</h2>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>
        
        <div className="modal-body">
          <div className="broadcast-type-toggle" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button 
              className={`btn-${broadcastType === 'text' ? 'primary' : 'secondary'}`} 
              onClick={() => setBroadcastType('text')}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
            >
              <Type size={16} /> Text
            </button>
            <button 
              className={`btn-${broadcastType === 'template' ? 'primary' : 'secondary'}`} 
              onClick={() => setBroadcastType('template')}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
            >
              <Image size={16} /> Template
            </button>
          </div>

          <p className="modal-description">Send a message to ALL your saved contacts at once.</p>
          
          {broadcastType === 'text' ? (
            <textarea 
              className="broadcast-textarea"
              placeholder="Type your announcement or offer here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
          ) : (
            <div className="template-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#666' }}>Template Name</label>
                <input 
                  type="text" 
                  value={templateName} 
                  onChange={(e) => setTemplateName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginTop: '5px' }}
                  disabled={loading}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#666' }}>Language Code (e.g., en, hi)</label>
                <input 
                  type="text" 
                  value={languageCode} 
                  onChange={(e) => setLanguageCode(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginTop: '5px' }}
                  disabled={loading}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#666' }}>Header Image URL (Optional)</label>
                <input 
                  type="text" 
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginTop: '5px' }}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {status && <p className={`status-text ${status.includes('Success') ? 'success' : ''}`}>{status}</p>}
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button 
            className="btn-primary" 
            onClick={handleBroadcast} 
            disabled={loading || (broadcastType === 'text' && !message.trim()) || (broadcastType === 'template' && !templateName.trim())}
          >
            <Send size={18} /> {loading ? 'Sending...' : 'Send to All'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BroadcastModal;
