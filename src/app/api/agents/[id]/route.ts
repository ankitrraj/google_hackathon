import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/supabase';
import { validateUUID } from '@/utils/validation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;

    // Validate UUID format
    if (!validateUUID(agentId)) {
      return NextResponse.json(
        { error: 'Invalid agent ID format' },
        { status: 400 }
      );
    }

    // Fetch agent from database
    const agent = await DatabaseService.getAgent(agentId);

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Return agent data
    return NextResponse.json({
      agent
    });

  } catch (error: any) {
    console.error('Error fetching agent:', error);

    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    const body = await request.json();

    // Validate UUID format
    if (!validateUUID(agentId)) {
      return NextResponse.json(
        { error: 'Invalid agent ID format' },
        { status: 400 }
      );
    }

    // Update agent in database
    const updatedAgent = await DatabaseService.updateAgent(agentId, body);

    return NextResponse.json({
      success: true,
      agent: updatedAgent
    });

  } catch (error: any) {
    console.error('Error updating agent:', error);

    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}