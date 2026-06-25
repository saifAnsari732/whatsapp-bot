const Contact = require('../models/Contact');
const Message = require('../models/Message');
const whatsappService = require('../services/whatsapp.service');

// Get all contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ lastMessageAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get messages for a specific contact
const getMessages = async (req, res) => {
  try {
    const { contactId } = req.params;
    const messages = await Message.find({ contactId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Send a manual message from dashboard
const sendMessage = async (req, res) => {
  try {
    const { contactId, text } = req.body;
    const io = req.app.get('io');
    
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    // Send via Meta API
    const payload = {
      type: 'text',
      content: { text: { body: text } }
    };
    await whatsappService.sendMessage(phoneNumberId, contact.phoneNumber, payload);

    // Save to DB
    const outgoingMsg = await Message.create({
      contactId: contact._id,
      type: 'outgoing',
      content: text,
      status: 'sent'
    });

    // Emit to frontend
    if (io) {
      io.emit('new_message', { contact, message: outgoingMsg });
    }

    res.json(outgoingMsg);
  } catch (error) {
    console.error('Error sending manual message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Send a broadcast message to all contacts
const broadcastMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const io = req.app.get('io');
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    const contacts = await Contact.find();
    if (!contacts.length) {
      return res.status(404).json({ error: 'No contacts found' });
    }

    const payload = {
      type: 'text',
      content: { text: { body: text } }
    };

    let sentCount = 0;

    for (const contact of contacts) {
      try {
        await whatsappService.sendMessage(phoneNumberId, contact.phoneNumber, payload);
        
        const outgoingMsg = await Message.create({
          contactId: contact._id,
          type: 'outgoing',
          content: `[BROADCAST] ${text}`,
          status: 'sent'
        });

        if (io) {
          io.emit('new_message', { contact, message: outgoingMsg });
        }
        sentCount++;
      } catch (err) {
        console.error(`Failed to broadcast to ${contact.phoneNumber}:`, err.message);
      }
    }

    res.json({ success: true, sentCount, totalContacts: contacts.length });
  } catch (error) {
    console.error('Error broadcasting message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getContacts,
  getMessages,
  sendMessage,
  broadcastMessage
};
