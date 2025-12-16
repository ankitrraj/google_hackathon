import { GoogleGenerativeAI } from '@google/generative-ai';
import { AgentConfig, ExtractField } from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class GeminiService {
  // Using gemini-1.5-flash for faster responses (1-1.5s vs 2-3s with pro)
  private static model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  /**
   * Generate agent configuration from natural language prompt
   */
  static async generateAgentConfig(prompt: string): Promise<AgentConfig> {
    try {
      const systemPrompt = `
You are an AI assistant that creates voice agent configurations. Given a user's description, generate a complete voice agent configuration.

The user wants: "${prompt}"

Return a JSON object with this EXACT structure:
{
  "name": "Agent Name (descriptive, under 50 chars)",
  "industry": "industry category (restaurant/salon/healthcare/retail/support/other)",
  "system_prompt": "Complete system prompt for the voice agent. Include personality, conversation flow, what questions to ask, how to handle responses, and what data to extract. Be specific and detailed (200-500 words).",
  "questions": ["Array of 3-5 specific questions the agent should ask during conversation"],
  "extract_fields": [
    {
      "name": "field_name_snake_case",
      "description": "Clear description of what this field contains",
      "type": "string|number|date|boolean"
    }
  ]
}

Guidelines:
- Make the system_prompt conversational and natural
- Include specific instructions for handling edge cases
- Questions should flow logically
- Extract fields should capture all important data mentioned in the prompt
- Be industry-specific and practical
- Ensure the agent can handle real conversations

Return ONLY the JSON object, no additional text.`;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      // Check if response is empty
      if (!text || text.trim().length === 0) {
        throw new Error('Gemini returned an empty response. Please try again.');
      }

      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Gemini response:', text);
        throw new Error('Could not extract valid JSON from Gemini response. Please try again.');
      }

      const config = JSON.parse(jsonMatch[0]) as AgentConfig;

      // Validate the response structure
      this.validateAgentConfig(config);

      return config;
    } catch (error) {
      console.error('Error generating agent config:', error);
      throw new Error('Failed to generate agent configuration. Please try again.');
    }
  }

  /**
   * Extract knowledge from PDF content
   */
  static async extractKnowledgeFromPDF(pdfContent: string, agentPurpose: string): Promise<string> {
    try {
      const systemPrompt = `
You are an AI assistant that extracts relevant knowledge from documents to enhance voice agents.

The voice agent is for: "${agentPurpose}"

Document content:
"${pdfContent}"

Extract and summarize the most relevant information that would help this voice agent provide better service. Focus on:
- Key facts and data
- Procedures and processes
- Important details customers might ask about
- Specific information relevant to the agent's purpose

Format the response as clear, concise bullet points that can be added to the agent's knowledge base.
Keep it under 500 words and focus on actionable information.

Return only the extracted knowledge, no additional commentary.`;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error extracting PDF knowledge:', error);
      throw new Error('Failed to extract knowledge from PDF. Please try again.');
    }
  }

  /**
   * Validate agent configuration structure
   */
  private static validateAgentConfig(config: any): asserts config is AgentConfig {
    const requiredFields = ['name', 'industry', 'system_prompt', 'questions', 'extract_fields'];
    
    for (const field of requiredFields) {
      if (!(field in config)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof config.name !== 'string' || config.name.length === 0) {
      throw new Error('Agent name must be a non-empty string');
    }

    if (typeof config.industry !== 'string' || config.industry.length === 0) {
      throw new Error('Industry must be a non-empty string');
    }

    if (typeof config.system_prompt !== 'string' || config.system_prompt.length < 50) {
      throw new Error('System prompt must be at least 50 characters long');
    }

    if (!Array.isArray(config.questions) || config.questions.length === 0) {
      throw new Error('Questions must be a non-empty array');
    }

    if (!Array.isArray(config.extract_fields) || config.extract_fields.length === 0) {
      throw new Error('Extract fields must be a non-empty array');
    }

    // Validate extract fields structure
    for (const field of config.extract_fields) {
      if (!field.name || !field.description || !field.type) {
        throw new Error('Each extract field must have name, description, and type');
      }
      
      if (!['string', 'number', 'date', 'boolean'].includes(field.type)) {
        throw new Error('Extract field type must be string, number, date, or boolean');
      }
    }
  }

  /**
   * Generate enhanced system prompt with knowledge base
   */
  static enhanceSystemPromptWithKnowledge(originalPrompt: string, knowledgeBase: string): string {
    return `${originalPrompt}

ADDITIONAL KNOWLEDGE BASE:
${knowledgeBase}

Use this additional information to provide more accurate and helpful responses to customers. Reference specific details from the knowledge base when relevant to their questions.`;
  }
}