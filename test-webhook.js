const axios = require('axios');

async function testWebhook() {
  try {
    const payload = {
      "object": "whatsapp_business_account",
      "entry": [
        {
          "id": "1915619655765382",
          "changes": [
            {
              "value": {
                "messaging_product": "whatsapp",
                "metadata": {
                  "display_phone_number": "15556636727",
                  "phone_number_id": "1162758233587976"
                },
                "contacts": [
                  {
                    "profile": {
                      "name": "Test User"
                    },
                    "wa_id": "919905234866"
                  }
                ],
                "messages": [
                  {
                    "from": "919905234866",
                    "id": "wamid.HBgLOTE5OTA1MjM0ODY2...",
                    "timestamp": "1725514682",
                    "text": {
                      "body": "Hello bot"
                    },
                    "type": "text"
                  }
                ]
              },
              "field": "messages"
            }
          ]
        }
      ]
    };

    console.log("Sending simulated webhook...");
    const response = await axios.post('http://localhost:3001/webhook', payload);
    console.log("Webhook response status:", response.status);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testWebhook();
