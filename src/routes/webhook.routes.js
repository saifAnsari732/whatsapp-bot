const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// GET request for Meta to verify the webhook
router.get('/', webhookController.verifyWebhook);

// POST request for Meta to send incoming messages
router.post('/', webhookController.handleIncomingMessage);

module.exports = router;
