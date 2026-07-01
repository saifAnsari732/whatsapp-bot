import React from 'react';
import { MessageCircle, Megaphone, Settings as SettingsIcon } from 'lucide-react';

const Sidebar = ({ contacts, selectedContact, onSelectContact, onOpenBroadcast, onOpenSettings, onOpenDirectMessage }) => {
  return (
    <div className="sidebar glass-effect">
      <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MessageCircle size={24} className="neon-text" />
          <span style={{ fontWeight: 'bold' }}>WhatsApp Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="icon-btn tooltip-container" onClick={onOpenSettings} aria-label="AI Settings">
            <SettingsIcon size={20} color="#f8fafc" />
            <span className="tooltip-text">AI Brain Settings</span>
          </button>
          <button className="icon-btn tooltip-container" onClick={onOpenDirectMessage} aria-label="Direct Message">
            <MessageCircle size={20} color="#10b981" />
            <span className="tooltip-text">New Direct Message</span>
          </button>
          <button className="icon-btn tooltip-container" onClick={onOpenBroadcast} aria-label="Broadcast Message">
            <Megaphone size={20} color="#f8fafc" />
            <span className="tooltip-text">Broadcast to All</span>
          </button>
        </div>
      </div>
      <div className="contacts-list">
        {contacts.map((contact) => (
          <div 
            key={contact._id} 
            className={`contact-item ${selectedContact?._id === contact._id ? 'active' : ''}`}
            onClick={() => onSelectContact(contact)}
          >
            <div className="contact-name">{contact.name || contact.phoneNumber}</div>
            <div className="contact-phone">{contact.phoneNumber}</div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No conversations yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
