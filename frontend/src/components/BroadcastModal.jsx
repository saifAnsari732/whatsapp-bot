import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { broadcastMessage } from '../services/api';

const BroadcastModal = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleBroadcast = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setStatus('Sending broadcast to all contacts...');
    
    try {
      const response = await broadcastMessage(null, message.trim());
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
          <p className="modal-description">Send a message to ALL your saved contacts at once.</p>
          <textarea 
            className="broadcast-textarea"
            placeholder="Type your announcement or offer here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
          {status && <p className={`status-text ${status.includes('Success') ? 'success' : ''}`}>{status}</p>}
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn-primary" onClick={handleBroadcast} disabled={loading || !message.trim()}>
            <Send size={18} /> {loading ? 'Sending...' : 'Send to All'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BroadcastModal;
