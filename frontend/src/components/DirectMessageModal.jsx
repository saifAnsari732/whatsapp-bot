import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { sendDirectMessage } from '../services/api';

const DirectMessageModal = ({ isOpen, onClose, onContactCreated }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!phoneNumber.trim() || !text.trim()) return;
    
    setStatus('Sending...');
    try {
      const res = await sendDirectMessage(phoneNumber, text);
      setStatus('Message sent successfully!');
      
      // If a new contact was created, pass it up so it appears in the sidebar
      if (res.data && res.data.contact) {
        onContactCreated(res.data.contact);
      }
      
      setTimeout(() => {
        setStatus('');
        setPhoneNumber('');
        setText('');
        onClose();
      }, 1500);
    } catch (error) {
      console.error(error);
      setStatus('Error sending message. Check phone number format.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-effect">
        <div className="modal-header">
          <h2>Send Direct Message</h2>
          <button className="icon-btn" onClick={onClose}><X size={24} color="#f8fafc" /></button>
        </div>
        <div className="modal-body">
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Send a message to a new number. Enter number with country code (e.g., 919876543210).
          </p>
          <input
            type="text"
            className="chat-input"
            placeholder="Phone Number (e.g. 919876543210)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <textarea
            className="broadcast-textarea"
            placeholder="Type your message here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {status && <div style={{ marginTop: '1rem', color: status.includes('Error') ? '#ef4444' : '#10b981' }}>{status}</div>}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            className="btn-primary" 
            onClick={handleSend}
            disabled={!phoneNumber.trim() || !text.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Send size={18} /> Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectMessageModal;
