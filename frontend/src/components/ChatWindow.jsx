import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';

const ChatWindow = ({ contact, messages, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  if (!contact) {
    return (
      <div className="empty-state">
        <User size={64} color="rgba(255,255,255,0.1)" style={{ marginBottom: '1rem' }} />
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-info">
          <h2>{contact.name || contact.phoneNumber}</h2>
          <p>{contact.phoneNumber}</p>
        </div>
      </div>

      <div className="messages-area">
        {messages.map((msg) => (
          <div key={msg._id} className={`message-bubble ${msg.type}`}>
            <div className="message-content" style={{ marginBottom: '4px' }}>{msg.content}</div>
            <div className="message-time" style={{ fontSize: '11px', opacity: 0.7, textAlign: 'right' }}>
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="send-button" disabled={!inputText.trim()}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
