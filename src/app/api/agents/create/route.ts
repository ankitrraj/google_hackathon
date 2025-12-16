import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini';
import prisma from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { prompt, userId = 'demo_user' } = body;

    // Validate prompt
    if (!prompt || prompt.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide a detailed description (at least 10 characters)' },
        { status: 400 }
      );
    }

    // Generate agent config using Gemini
    console.log('🤖 Generating agent config with Gemini...');
    const agentConfig = await GeminiService.generateAgentConfig(prompt);

    // Validate generated config
    if (!agentConfig.name || !agentConfig.system_prompt) {
      return NextResponse.json(
        { error: 'Failed to generate valid agent configuration' },
        { status: 500 }
      );
    }

    // Save agent to database using Prisma
    console.log('💾 Saving agent to database...');
    const agent = await prisma.agent.create({
      data: {
        userId: userId,
        name: agentConfig.name,
        industry: agentConfig.industry,
        firstMessage: (agentConfig as any).first_message || agentConfig.system_prompt.substring(0, 200),
        systemPrompt: agentConfig.system_prompt,
        questions: agentConfig.questions as any,
        extractFields: agentConfig.extract_fields as any,
      }
    });

    console.log('✅ Agent created:', agent.id);

    // Return success response
    return NextResponse.json({
      success: true,
      agentId: agent.id,
      config: agentConfig,
      agent: {
        id: agent.id,
        name: agent.name,
        industry: agent.industry,
        createdAt: agent.createdAt
      }
    });

  } catch (error: any) {
    console.error('❌ Error creating agent:', error);
    
    // Handle specific errors
    if (error.message?.includes('Gemini') || error.message?.includes('generation')) {
      return NextResponse.json(
        { error: 'Failed to generate agent configuration. Please try again.' },
        { status: 500 }
      );
    }

    if (error.message?.includes('Prisma') || error.message?.includes('database')) {
      return NextResponse.json(
        { error: 'Failed to save agent to database. Please try again.' },
        { status: 503 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred. Please try again.' },
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