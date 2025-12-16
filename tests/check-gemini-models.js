require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  console.log('🔍 Checking Gemini API Key and Available Models\n');
  console.log('API Key:', process.env.GEMINI_API_KEY ? '✅ Found' : '❌ Not found');
  console.log('API Key (first 10 chars):', process.env.GEMINI_API_KEY?.substring(0, 10) + '...\n');
  
  try {
    // Try a simple generation with different model names
    const modelNames = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'models/gemini-pro',
      'models/gemini-1.5-pro'
    ];

    for (const modelName of modelNames) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        console.log(`✅ ${modelName} works!`);
        console.log(`   Response: ${result.response.text().substring(0, 50)}...\n`);
        break; // If one works, we're good
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message.substring(0, 100)}...\n`);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listModels();
