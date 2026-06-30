const http = require('http');
const https = require('https');

const RENDER_URL = process.env.RENDER_EXTERNAL_URL || 'https://whatsapp-bot-xioi.onrender.com';

/**
 * Server ko sleep se bachane ke liye har 10 minute mein ping karta hai
 * Sirf production mein chalta hai
 */
const keepAlive = () => {
  if (process.env.NODE_ENV !== 'production') return;

  setInterval(() => {
    const url = `${RENDER_URL}/`;
    const client = RENDER_URL.startsWith('https') ? https : http;

    client.get(url, (res) => {
      console.log(`[KeepAlive] Ping sent to ${url} - Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error('[KeepAlive] Ping failed:', err.message);
    });

  }, 10 * 60 * 1000); // Har 10 minute mein

  console.log('[KeepAlive] Server keep-alive service started!');
};

module.exports = keepAlive;
