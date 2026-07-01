const { GoogleGenerativeAI } = require("@google/generative-ai");
const Settings = require('../models/Settings');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your_gemini_api_key_here');

const generateReply = async (incomingMessage, senderId) => {
  console.log(`Agent processing message from ${senderId}: "${incomingMessage}"`);
  
  const lowerMessage = incomingMessage.toLowerCase().trim();

  // 1. Static Rule-Based Logic (Highest Priority)
  const greetings = ['hi', 'hii', 'hiii', 'hello', 'hey', 'heyy', 'namaste', 'start'];
  if (greetings.includes(lowerMessage)) {
    return {
      type: 'interactive',
      content: {
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "Kisan Digital"
          },
          body: {
            text: "Namaste! 👋 Main Kisan Digital ka AI Assistant hoon. Aapko kis service mein help chahiye?"
          },
          footer: {
            text: "Please select an option below"
          },
          action: {
            button: "View Options 📋",
            sections: [
              {
                title: "Main Services",
                rows: [
                  { id: "row_web", title: "Web Development 💻" },
                  { id: "row_ads", title: "Google & Meta Ads 📈" },
                  { id: "row_seo", title: "SEO & Ranking 🔍" },
                  { id: "row_app", title: "App Development 📱" },
                  { id: "row_social", title: "Social Media 📱" }
                ]
              },
              {
                title: "More Info",
                rows: [
                  { id: "row_pricing", title: "Pricing Packages 💰" },
                  { id: "row_contact", title: "Contact Human 📞" }
                ]
              }
            ]
          }
        }
      }
    };
  }

  if (lowerMessage === 'menu') {
    return {
      type: 'image',
      content: {
        image: {
          link: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          caption: 'Here is our delicious menu! Let us know what you would like to order.'
        }
      }
    };
  }

  // 2. Dynamic Conversational AI (Gemini)
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return {
        type: 'text',
        content: { text: { body: "Hello! I am currently unable to process complex questions because my AI brain is not fully connected yet (Missing API Key)." } }
      };
    }

    // Fetch dynamic prompt from DB
    let settings = await Settings.findOne();
    let dynamicPrompt = settings ? settings.systemPrompt : "You are a helpful assistant.";

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: dynamicPrompt });
    const result = await model.generateContent(incomingMessage);
    const responseText = result.response.text();

    return {
      type: 'text',
      content: {
        text: { body: responseText }
      }
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      type: 'text',
      content: {
        text: { body: 'Sorry, I am having trouble understanding you right now. Please try again later.' }
      }
    };
  }
};

module.exports = {
  generateReply,
};
