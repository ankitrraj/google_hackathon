import { GoogleGenerativeAI } from "@google/generative-ai";
import { AgentConfig, ExtractField } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export class GeminiService {
  /**
   * Simplified agent config generation - Focus on system prompt quality
   * Based on market research: Vapi, Bland, Retell approach
   */
  static async generateAgentConfig(userPrompt: string): Promise<AgentConfig> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const prompt = `You are an expert voice AI agent designer. Create a professional voice agent configuration from this user description.

USER DESCRIPTION: "${userPrompt}"

Generate a complete agent configuration with:
1. **Agent Name**: Professional, clear name
2. **Industry**: Category (hospitality, healthcare, restaurant, salon, retail, etc.)
3. **First Message**: Natural greeting when call starts
4. **System Prompt**: Detailed AI instructions (MOST IMPORTANT - be thorough)
5. **Questions**: Key questions agent should ask
6. **Extract Fields**: Data to collect

SYSTEM PROMPT MUST INCLUDE:
- Role and purpose
- Personality and tone
- Specific responsibilities
- Conversation flow
- Important rules
- Example interactions
- Error handling

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
}

EXAMPLE 1:
User: "create a voice agent for booking hotels, hotel name is raj hotel"
{
  "name": "Raj Hotel Booking Assistant",
  "industry": "hospitality",
  "first_message": "Hello! Thank you for calling Raj Hotel. I'm here to help you book a room. When would you like to check in?",
  "system_prompt": "You are a professional hotel booking assistant for Raj Hotel.

ROLE & PERSONALITY:
- Warm, welcoming, and professional
- Patient and understanding
- Clear and efficient communicator

RESPONSIBILITIES:
1. Greet customer warmly
2. Collect check-in and check-out dates
3. Ask number of guests
4. Inquire about room type (single, double, suite)
5. Gather contact info (name, phone, email)
6. Ask about special requests
7. Confirm all details
8. Provide booking confirmation

CONVERSATION FLOW:
- Ask one question at a time
- Confirm important details by repeating
- Keep conversation natural
- Handle interruptions gracefully

RULES:
- Always confirm dates to avoid errors
- Spell out important information
- Ask for clarification if unclear
- Be flexible with customer responses
- Thank customer at the end

EXAMPLE:
Agent: 'Hello! Thank you for calling Raj Hotel. When would you like to check in?'
Customer: 'Next Friday'
Agent: 'Perfect! And when will you be checking out?'
Customer: 'Sunday'
Agent: 'Great! How many guests?'
Customer: 'Two'
Agent: 'What type of room would you prefer - single, double, or suite?'
Customer: 'Double room'
Agent: 'Excellent! May I have your name?'
Customer: 'John Smith'
Agent: 'Thank you Mr. Smith. Phone number?'
Customer: '555-1234'
Agent: 'And your email?'
Customer: 'john@email.com'
Agent: 'Perfect! Let me confirm: Double room for 2 guests, checking in Friday [date], checking out Sunday [date]. Contact: 555-1234, john@email.com. Correct?'
Customer: 'Yes'
Agent: 'Wonderful! Booking confirmed. You'll receive confirmation email shortly. Anything else?'",
  "questions": [
    "When would you like to check in?",
    "When will you be checking out?",
    "How many guests?",
    "What type of room?",
    "May I have your name?",
    "Phone number?",
    "Email address?",
    "Any special requests?"
  ],
  "extract_fields": [
    {"name": "check_in_date", "description": "Check-in date", "type": "date"},
    {"name": "check_out_date", "description": "Check-out date", "type": "date"},
    {"name": "guest_count", "description": "Number of guests", "type": "number"},
    {"name": "room_type", "description": "Type of room", "type": "string"},
    {"name": "guest_name", "description": "Guest full name", "type": "string"},
    {"name": "phone", "description": "Contact phone", "type": "string"},
    {"name": "email", "description": "Email address", "type": "string"},
    {"name": "special_requests", "description": "Special requests", "type": "string"}
  ]
}

EXAMPLE 2:
User: "appointment booking for dental clinic"
{
  "name": "Dental Clinic Appointment Assistant",
  "industry": "healthcare",
  "first_message": "Hello! Thank you for calling. I'm here to help schedule your dental appointment. What type of service do you need?",
  "system_prompt": "You are a professional dental clinic appointment assistant.

ROLE & PERSONALITY:
- Caring, patient, understanding
- Calm and reassuring tone
- Empathetic to dental anxiety
- Professional yet warm

RESPONSIBILITIES:
1. Greet patient warmly
2. Determine appointment type
3. Check if new or existing patient
4. Collect patient info (name, DOB, contact)
5. Offer available times
6. Confirm appointment
7. Provide pre-appointment instructions

CONVERSATION FLOW:
- Begin with warm greeting
- Ask about service type first
- Be sensitive to anxiety/emergencies
- Collect info systematically
- Offer clear appointment options
- Confirm all details

RULES:
- Prioritize emergencies (pain, injury)
- Be gentle with anxious patients
- Verify DOB for identification
- Confirm date and time clearly
- Mention any preparation needed
- Provide confirmation number

EXAMPLE:
Agent: 'Hello! What type of dental service do you need?'
Patient: 'Cleaning'
Agent: 'Have you visited us before?'
Patient: 'Yes'
Agent: 'May I have your name?'
Patient: 'Sarah Johnson'
Agent: 'Date of birth for verification?'
Patient: 'March 15, 1985'
Agent: 'Phone number?'
Patient: '555-9876'
Agent: 'Do you prefer morning or afternoon?'
Patient: 'Morning'
Agent: 'I have Tuesday 9 AM or Thursday 10 AM. Which works?'
Patient: 'Tuesday at 9'
Agent: 'Perfect! Cleaning on Tuesday [date] at 9 AM. Arrive 10 minutes early. Confirmation text to 555-9876. Anything else?'",
  "questions": [
    "What type of service do you need?",
    "Are you a new or existing patient?",
    "May I have your name?",
    "Date of birth?",
    "Phone number?",
    "Morning or afternoon preference?",
    "Which date and time works best?"
  ],
  "extract_fields": [
    {"name": "patient_name", "description": "Patient full name", "type": "string"},
    {"name": "date_of_birth", "description": "Patient DOB", "type": "date"},
    {"name": "phone", "description": "Contact phone", "type": "string"},
    {"name": "appointment_type", "description": "Type of service", "type": "string"},
    {"name": "appointment_date", "description": "Appointment date", "type": "date"},
    {"name": "appointment_time", "description": "Appointment time", "type": "string"},
    {"name": "is_new_patient", "description": "New or existing", "type": "boolean"}
  ]
}

Now generate for the user's description above. Return ONLY the JSON, no other text.`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
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
        throw new Error("Failed to parse Gemini response as JSON");
      }

      const parsedConfig = JSON.parse(jsonMatch[0]);

      // Transform to our AgentConfig format
      const agentConfig: AgentConfig = {
        name: parsedConfig.name,
        industry: parsedConfig.industry,
        system_prompt: parsedConfig.system_prompt,
        questions: parsedConfig.questions || [],
        extract_fields: parsedConfig.extract_fields || [],
      };

      // Add first_message if available
      if (parsedConfig.first_message) {
        (agentConfig as any).first_message = parsedConfig.first_message;
      }

      return agentConfig;
    } catch (error: any) {
      console.error("Error generating agent config with Gemini:", error);
      throw new Error(`Gemini generation failed: ${error.message}`);
    }
  }

  /**
   * Enhance system prompt with knowledge base content
   */
  static async enhancePromptWithKnowledge(
    systemPrompt: string,
    knowledgeBase: string
  ): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const enhancementPrompt = `Enhance this voice agent's system prompt with additional knowledge.

Current system prompt:
${systemPrompt}

Additional knowledge:
${knowledgeBase}

Create an enhanced system prompt that:
1. Maintains original personality and tone
2. Incorporates knowledge naturally
3. Instructs agent to use knowledge when relevant
4. Keeps prompt concise and actionable

Return ONLY the enhanced system prompt text.`;

      const result = await model.generateContent(enhancementPrompt);
      return result.response.text().trim();
    } catch (error: any) {
      console.error("Error enhancing prompt with Gemini:", error);
      throw new Error(`Failed to enhance prompt: ${error.message}`);
    }
  }

  /**
   * Extract structured data from conversation transcript
   */
  static async extractDataFromTranscript(
    transcript: string,
    extractFields: ExtractField[]
  ): Promise<Record<string, any>> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const extractionPrompt = `Extract information from this conversation:

Fields to extract:
${extractFields
  .map((field) => `- ${field.name} (${field.type}): ${field.description}`)
  .join("\n")}

Conversation:
"${transcript}"

Return ONLY valid JSON with extracted data. Use null if not found.

Example:
{
  "field_name": "value",
  "another_field": null
}`;

      const result = await model.generateContent(extractionPrompt);
      const response = result.response.text();

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from Gemini");
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error: any) {
      console.error("Error extracting data with Gemini:", error);
      throw new Error(`Failed to extract data: ${error.message}`);
    }
  }
}
