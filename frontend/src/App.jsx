import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import BroadcastModal from './components/BroadcastModal';
import SettingsModal from './components/SettingsModal';

const API_URL = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';

function App() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // ... (keep the rest the same down to return)

  useEffect(() => {
    // Connect Socket.io
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Fetch initial contacts
    axios.get(`${API_URL}/contacts`).then(res => setContacts(res.data));

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new_message', (data) => {
        const { contact, message } = data;
        
        // Update contacts list (bring to top)
        setContacts(prevContacts => {
          const filtered = prevContacts.filter(c => c._id !== contact._id);
          return [contact, ...filtered];
        });

        // Update messages if this contact is currently selected
        setSelectedContact(currentSelected => {
          if (currentSelected && currentSelected._id === contact._id) {
            setMessages(prev => [...prev, message]);
          }
          return currentSelected;
        });
      });
    }
  }, [socket]);

  // Load messages when a contact is selected
  useEffect(() => {
    if (selectedContact) {
      axios.get(`${API_URL}/contacts/${selectedContact._id}/messages`)
        .then(res => setMessages(res.data));
    }
  }, [selectedContact]);

  const handleSendMessage = async (text) => {
    if (!selectedContact) return;
    try {
      await axios.post(`${API_URL}/messages/send`, {
        contactId: selectedContact._id,
        text
      });
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        contacts={contacts} 
        selectedContact={selectedContact} 
        onSelectContact={setSelectedContact} 
        onOpenBroadcast={() => setIsBroadcastOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <ChatWindow 
        contact={selectedContact} 
        messages={messages} 
        onSendMessage={handleSendMessage} 
      />
      <BroadcastModal 
        isOpen={isBroadcastOpen} 
        onClose={() => setIsBroadcastOpen(false)} 
      />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}

export default App;
