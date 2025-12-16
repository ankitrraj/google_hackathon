// List all available Gemini models
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  console.log('🔍 Fetching available Gemini models...\n');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env.local');
    return;
  }

  console.log('API Key:', apiKey.substring(0, 10) + '...\n');

  try {
    // Fetch available models from Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      const error = await response.text();
      console.error('Error details:', error);
      return;
    }

    const data = await response.json();
    
    if (!data.models || data.models.length === 0) {
      console.log('❌ No models found');
      return;
    }

    console.log(`✅ Found ${data.models.length} models:\n`);
    
    // Filter and display models that support generateContent
    const contentModels = data.models.filter(model => 
      model.supportedGenerationMethods?.includes('generateContent')
    );

    console.log('📝 Models supporting generateContent:\n');
    contentModels.forEach(model => {
      console.log(`  ✓ ${model.name}`);
      console.log(`    Display Name: ${model.displayName}`);
      console.log(`    Description: ${model.description}`);
      console.log(`    Input Token Limit: ${model.inputTokenLimit}`);
      console.log(`    Output Token Limit: ${model.outputTokenLimit}`);
      console.log('');
    });

    console.log('\n💡 Recommended models for VoiceForge:');
    const recommended = contentModels.filter(m => 
      m.name.includes('gemini-1.5') || m.name.includes('gemini-pro')
    );
    
    recommended.forEach(model => {
      console.log(`  🎯 ${model.name.split('/').pop()}`);
    });

    console.log('\n📋 To use a model, update gemini.ts:');
    console.log('   const model = genAI.getGenerativeModel({ model: "MODEL_NAME" });');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listModels();
