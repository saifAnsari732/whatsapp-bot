import axios from 'axios';

// ✅ Render par deploy hone ke baad yahan apna Render URL daalein
export const BASE_URL = 'https://whatsapp-bot-xioi.onrender.com';
export const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Contacts ────────────────────────────────────────────────
// Saare contacts fetch karo
export const getContacts = () => api.get('/contacts');

// Ek contact ki saari messages fetch karo
export const getMessages = (contactId) =>
  api.get(`/contacts/${contactId}/messages`);

// ─── Messages ────────────────────────────────────────────────
// Customer ko manual reply bhejo (dashboard se)
export const sendMessage = (contactId, text) =>
  api.post('/messages/send', { contactId, text });

// Naye number par direct message bhejo
export const sendDirectMessage = (phoneNumber, text) =>
  api.post('/messages/direct', { phoneNumber, text });

// Broadcast message bhejo multiple contacts ko
export const broadcastMessage = (text) => {
  return api.post('/messages/broadcast', { text });
};

export const broadcastTemplate = (templateName, languageCode, imageUrl) => {
  return api.post('/messages/broadcast-template', { 
    templateName, 
    languageCode, 
    imageUrl 
  });
};

// ─── Settings (Bot ka System Prompt) ─────────────────────────
// Bot ki current settings fetch karo
export const getSettings = () => api.get('/settings');

// Bot ka system prompt update karo (Agent ki personality)
export const updateSettings = (systemPrompt) =>
  api.post('/settings', { systemPrompt });

export default api;
