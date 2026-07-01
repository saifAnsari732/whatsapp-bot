const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api.controller');
const settingsController = require('../controllers/settings.controller');

router.get('/contacts', apiController.getContacts);
router.get('/contacts/:contactId/messages', apiController.getMessages);
router.post('/messages/send', apiController.sendMessage);
router.post('/messages/broadcast', apiController.broadcastMessage);
router.post('/messages/direct', apiController.sendDirectMessage);

// Settings routes
router.get('/settings', settingsController.getSettings);
router.post('/settings', settingsController.updateSettings);

module.exports = router;
