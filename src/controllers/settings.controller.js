const Settings = require('../models/Settings');

// Get current settings (or create default if not exists)
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const { systemPrompt } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ systemPrompt });
    } else {
      settings.systemPrompt = systemPrompt;
      settings.updatedAt = Date.now();
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
