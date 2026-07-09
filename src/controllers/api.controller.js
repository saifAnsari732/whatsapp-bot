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

// Send a broadcast template message to all contacts
const broadcastTemplate = async (req, res) => {
  try {
    const { templateName, languageCode, imageUrl } = req.body;
    const io = req.app.get('io');
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    const contacts = await Contact.find();
    if (!contacts.length) {
      return res.status(404).json({ error: 'No contacts found' });
    }

    const payload = {
      type: 'template',
      content: {
        template: {
          name: templateName,
          language: { code: languageCode || 'en' },
          components: imageUrl ? [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: {
                    link: imageUrl
                  }
                }
              ]
            }
          ] : []
        }
      }
    };

    let sentCount = 0;

    for (const contact of contacts) {
      try {
        await whatsappService.sendMessage(phoneNumberId, contact.phoneNumber, payload);
        
        const outgoingMsg = await Message.create({
          contactId: contact._id,
          type: 'outgoing',
          content: `[TEMPLATE BROADCAST] ${templateName}`,
          status: 'sent'
        });

        if (io) {
          io.emit('new_message', { contact, message: outgoingMsg });
        }
        sentCount++;
      } catch (err) {
        console.error(`Failed to broadcast template to ${contact.phoneNumber}:`, err.message);
      }
    }

    res.json({ success: true, sentCount, totalContacts: contacts.length });
  } catch (error) {
    console.error('Error broadcasting template:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Send a direct message to a new or existing number
const sendDirectMessage = async (req, res) => {
  try {
    const { phoneNumber, text } = req.body;
    const io = req.app.get('io');
    
    if (!phoneNumber || !text) {
      return res.status(400).json({ error: 'Phone number and text are required' });
    }

    // Format phone number (remove +, spaces, etc if needed, though usually they send pure digits)
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // Find or create contact
    let contact = await Contact.findOne({ phoneNumber: cleanPhone });
    if (!contact) {
      contact = await Contact.create({ phoneNumber: cleanPhone, name: 'New Contact' });
    }

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    // Send via Meta API
    const payload = {
      type: 'text',
      content: { text: { body: text } }
    };
    
    await whatsappService.sendMessage(phoneNumberId, cleanPhone, payload);

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

    res.json({ success: true, contact, message: outgoingMsg });
  } catch (error) {
    console.error('Error sending direct message:', error);
    res.status(500).json({ error: 'Failed to send message. Ensure number is correct and within 24h window or uses template.' });
  }
};

module.exports = {
  getContacts,
  getMessages,
  sendMessage,
  broadcastMessage,
  broadcastTemplate,
  sendDirectMessage
};
