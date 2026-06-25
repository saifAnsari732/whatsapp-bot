const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  systemPrompt: {
    type: String,
    default: "You are a helpful assistant."
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', settingsSchema);
