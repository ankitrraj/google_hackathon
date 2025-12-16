// Quick test script for Gemini agent generation
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testAgentGeneration() {
  console.log('🧪 Testing Gemini Agent Generation\n');
  
  const testPrompts = [
    "create a voice agent for booking hotels, hotel name is raj hotel",
    "make an appointment booking agent for my dental clinic",
    "create a pizza ordering agent for my restaurant"
  ];

  for (const prompt of testPrompts) {
    console.log(`\n📝 Testing prompt: "${prompt}"\n`);
    
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
        console.error('❌ Failed to extract JSON from response');
        console.log('Response:', response.substring(0, 200) + '...');
        continue;
      }

      const config = JSON.parse(jsonMatch[0]);
      
      console.log('✅ Generated Config:');
      console.log('   Name:', config.name);
      console.log('   Industry:', config.industry);
      console.log('   First Message:', config.first_message?.substring(0, 80) + '...');
      console.log('   System Prompt Length:', config.system_prompt?.length, 'chars');
      console.log('   Questions:', config.questions?.length);
      console.log('   Extract Fields:', config.extract_fields?.length);
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
}

testAgentGeneration().then(() => {
  console.log('\n✅ Test complete!');
}).catch(err => {
  console.error('\n❌ Test failed:', err);
});
