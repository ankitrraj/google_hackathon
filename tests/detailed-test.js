// Detailed test to see full agent configuration
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function detailedTest() {
  console.log('🧪 Detailed Agent Generation Test\n');
  
  const prompt = "create a voice agent for booking hotels, hotel name is raj hotel";
  console.log(`📝 Prompt: "${prompt}"\n`);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const fullPrompt = `You are an expert voice AI agent designer. Create a professional voice agent configuration from this user description.

USER DESCRIPTION: "${prompt}"

Generate a complete agent configuration with:
1. **Agent Name**: Professional, clear name
2. **Industry**: Category (hospitality, healthcare, restaurant, salon, retail, etc.)
3. **First Message**: Natural greeting when call starts
4. **System Prompt**: Detailed AI instructions (MOST IMPORTANT - be thorough)
5. **Questions**: Key questions agent should ask
6. **Extract Fields**: Data to collect

Return ONLY valid JSON:
{
  "name": "Agent Name",
  "industry": "industry_type",
  "first_message": "Greeting message",
  "system_prompt": "Detailed instructions...",
  "questions": ["Question 1", "Question 2"],
  "extract_fields": [
    {"name": "field_name", "description": "Description", "type": "string"}
  ]
}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 3000,
      },
    });

    const response = result.response.text();
    
    // Remove markdown code blocks if present
    let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Extract JSON from response
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ Failed to extract JSON');
      return;
    }

    const config = JSON.parse(jsonMatch[0]);
    
    console.log('✅ Generated Agent Configuration:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📌 AGENT NAME:');
    console.log(`   ${config.name}\n`);
    
    console.log('🏢 INDUSTRY:');
    console.log(`   ${config.industry}\n`);
    
    console.log('👋 FIRST MESSAGE:');
    console.log(`   "${config.first_message}"\n`);
    
    console.log('🤖 SYSTEM PROMPT:');
    console.log(`   ${config.system_prompt}\n`);
    
    console.log('❓ QUESTIONS TO ASK:');
    config.questions.forEach((q, i) => {
      console.log(`   ${i + 1}. ${q}`);
    });
    console.log('');
    
    console.log('📊 DATA TO EXTRACT:');
    config.extract_fields.forEach((field, i) => {
      console.log(`   ${i + 1}. ${field.name} (${field.type})`);
      console.log(`      → ${field.description}`);
    });
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ Agent is ready to deploy!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

detailedTest();
