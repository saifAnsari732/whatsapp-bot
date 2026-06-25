const whatsappService = require('../services/whatsapp.service');
const agentService = require('../services/agent.service');
const Contact = require('../models/Contact');
const Message = require('../models/Message');

const verifyWebhook = (req, res) => {
  const verify_token = process.env.WEBHOOK_VERIFY_TOKEN;

  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verify_token) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
};

const handleIncomingMessage = async (req, res) => {
  try {
    let body = req.body;
    const io = req.app.get('io');

    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        let phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = body.entry[0].changes[0].value.messages[0].from; // sender phone number
        let msgBody = body.entry[0].changes[0].value.messages[0].text?.body; // text message content
        let messageType = body.entry[0].changes[0].value.messages[0].type;
        let profileName = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name || 'Unknown';

        console.log(`Received message from ${from}: ${msgBody} (Type: ${messageType})`);

        if (msgBody) {
          // Find or create contact
          let contact = await Contact.findOne({ phoneNumber: from });
          if (!contact) {
            contact = await Contact.create({ phoneNumber: from, name: profileName });
          } else {
            contact.lastMessageAt = new Date();
            if (profileName !== 'Unknown') contact.name = profileName;
            await contact.save();
          }

          // Save incoming message
          const incomingMsg = await Message.create({
            contactId: contact._id,
            type: 'incoming',
            content: msgBody,
            status: 'received'
          });

          // Emit to frontend
          if (io) {
            io.emit('new_message', { contact, message: incomingMsg });
          }

          // Pass the message to the agent service to generate a response
          const replyPayload = await agentService.generateReply(msgBody, from);
          
          // Send the reply via WhatsApp Service
          if (replyPayload) {
             await whatsappService.sendMessage(phoneNumberId, from, replyPayload);
             
             let savedContent = replyPayload.type === 'image' ? '[Image: ' + replyPayload.content.image.caption + ']' : replyPayload.content.text.body;

             // Save outgoing message
             const outgoingMsg = await Message.create({
               contactId: contact._id,
               type: 'outgoing',
               content: savedContent,
               status: 'sent'
             });

             // Emit to frontend
             if (io) {
               io.emit('new_message', { contact, message: outgoingMsg });
             }
          }
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error handling incoming message:', error);
    res.sendStatus(500);
  }
};

module.exports = {
  verifyWebhook,
  handleIncomingMessage,
};
