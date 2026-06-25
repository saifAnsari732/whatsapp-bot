const axios = require('axios');

const sendMessage = async (phoneNumberId, to, payload) => {
  try {
    const token = process.env.META_ACCESS_TOKEN;
    
    if (!token || token === 'your_meta_access_token_here') {
      console.error('ERROR: META_ACCESS_TOKEN is not configured.');
      return;
    }

    const data = {
      messaging_product: 'whatsapp',
      to: to,
      type: payload.type,
      ...payload.content
    };

    const response = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: data,
    });

    console.log(`Message sent successfully to ${to}`);
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = {
  sendMessage,
};
