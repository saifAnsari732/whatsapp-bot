require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
  console.log("Testing Gemini API...");
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API Key:", apiKey);
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey || 'your_gemini_api_key_here');
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    console.log("Sending prompt to Gemini...");
    const result = await model.generateContent("Hello, are you working?");
    const responseText = result.response.text();
    console.log("\n✅ Gemini Success!");
    console.log("Response:", responseText);
  } catch (error) {
    console.error("\n❌ Gemini Error!");
    console.error(error.message);
  }
}

testGemini();
