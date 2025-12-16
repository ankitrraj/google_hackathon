import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini';
import { DatabaseService } from '@/lib/supabase';
import { validatePrompt, validateAgentConfig } from '@/utils/validation';
import { generateAgentUrl } from '@/utils/extraction';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { prompt, userId = 'demo_user' } = body;

    // Validate prompt
    const promptValidation = validatePrompt(prompt);
    if (!promptValidation.isValid) {
      return NextResponse.json(
        { error: promptValidation.error },
        { status: 400 }
      );
    }

    // Generate agent config using Gemini
    console.log('Generating agent config with Gemini...');
    const agentConfig = await GeminiService.generateAgentConfig(prompt);

    // Validate generated config
    const configValidation = validateAgentConfig(agentConfig);
    if (!configValidation.isValid) {
      return NextResponse.json(
        { error: `Invalid agent configuration: ${configValidation.error}` },
        { status: 500 }
      );
    }

    // Save agent to database
    console.log('Saving agent to database...');
    const agent = await DatabaseService.createAgent({
      user_id: userId,
      name: agentConfig.name,
      industry: agentConfig.industry,
      system_prompt: agentConfig.system_prompt,
      questions: agentConfig.questions,
      extract_fields: agentConfig.extract_fields,
      knowledge_base: null
    });

    // Generate deployment URL
    const deploymentUrl = generateAgentUrl(agent.id);

    // Return success response
    return NextResponse.json({
      success: true,
      agentId: agent.id,
      url: deploymentUrl,
      config: agentConfig,
      agent: agent
    });

  } catch (error: any) {
    console.error('Error creating agent:', error);
    
    // Handle specific errors
    if (error.message.includes('Gemini')) {
      return NextResponse.json(
        { error: 'Failed to generate agent configuration. Please try again.' },
        { status: 500 }
      );
    }

    if (error.message.includes('database') || error.message.includes('Supabase')) {
      return NextResponse.json(
        { error: 'Failed to save agent. Please try again.' },
        { status: 503 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to check API health
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Agent creation API is running',
    timestamp: new Date().toISOString()
  });
}