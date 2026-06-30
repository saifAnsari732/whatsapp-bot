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
          console.log(`[STEP 1] Message received from ${from}: "${msgBody}"`);

          // Find or create contact
          let contact = await Contact.findOne({ phoneNumber: from });
          if (!contact) {
            contact = await Contact.create({ phoneNumber: from, name: profileName });
            console.log(`[STEP 2] New contact created: ${profileName}`);
          } else {
            contact.lastMessageAt = new Date();
            if (profileName !== 'Unknown') contact.name = profileName;
            await contact.save();
            console.log(`[STEP 2] Existing contact updated: ${profileName}`);
          }

          // Save incoming message
          const incomingMsg = await Message.create({
            contactId: contact._id,
            type: 'incoming',
            content: msgBody,
            status: 'received'
          });
          console.log(`[STEP 3] Incoming message saved to DB`);

          // Emit to frontend
          if (io) io.emit('new_message', { contact, message: incomingMsg });

          // Generate AI reply
          console.log(`[STEP 4] Calling Gemini AI...`);
          const replyPayload = await agentService.generateReply(msgBody, from);
          console.log(`[STEP 5] Gemini reply generated: ${JSON.stringify(replyPayload)}`);

          // Send the reply via WhatsApp
          if (replyPayload) {
            console.log(`[STEP 6] Sending reply via WhatsApp API... PhoneID: ${phoneNumberId}, To: ${from}`);
            await whatsappService.sendMessage(phoneNumberId, from, replyPayload);
            console.log(`[STEP 7] Reply sent successfully!`);

            let savedContent = replyPayload.type === 'image'
              ? '[Image: ' + replyPayload.content.image.caption + ']'
              : replyPayload.content.text.body;

            const outgoingMsg = await Message.create({
              contactId: contact._id,
              type: 'outgoing',
              content: savedContent,
              status: 'sent'
            });

            if (io) io.emit('new_message', { contact, message: outgoingMsg });
            console.log(`[DONE] Full flow completed successfully!`);
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
