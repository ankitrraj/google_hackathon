import { createClient } from '@supabase/supabase-js';

// Validate environment variables
function validateEnvVar(name: string, value: string | undefined): string {
  if (!value || value.includes('your_') || value.includes('_here')) {
    throw new Error(
      `${name} is not configured. Please add it to your .env.local file.\n` +
      `Get it from: https://supabase.com/dashboard/project/_/settings/api`
    );
  }
  return value;
}

const supabaseUrl = validateEnvVar('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = validateEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const supabaseServiceRoleKey = validateEnvVar('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY);

// Client for frontend operations (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for backend operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database helper functions
export class DatabaseService {
  // Agent operations
  static async createAgent(agent: Omit<import('./types').Agent, 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('agents')
      .insert(agent)
      .select()
      .single();

    if (error) {
      console.error('Error creating agent:', error);
      throw new Error('Failed to create agent');
    }

    return data;
  }

  static async getAgent(id: string) {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching agent:', error);
      throw new Error('Agent not found');
    }

    return data;
  }

  static async updateAgent(id: string, updates: Partial<import('./types').Agent>) {
    const { data, error } = await supabaseAdmin
      .from('agents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating agent:', error);
      throw new Error('Failed to update agent');
    }

    return data;
  }

  static async getUserAgents(userId: string) {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user agents:', error);
      throw new Error('Failed to fetch agents');
    }

    return data;
  }

  // Call operations
  static async createCall(call: Omit<import('./types').Call, 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('calls')
      .insert(call)
      .select()
      .single();

    if (error) {
      console.error('Error creating call:', error);
      throw new Error('Failed to create call');
    }

    return data;
  }

  static async updateCall(id: string, updates: Partial<import('./types').Call>) {
    const { data, error } = await supabaseAdmin
      .from('calls')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating call:', error);
      throw new Error('Failed to update call');
    }

    return data;
  }

  static async getAgentCalls(agentId: string) {
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agent calls:', error);
      throw new Error('Failed to fetch calls');
    }

    return data;
  }

  static async getCallStats(agentId?: string) {
    let query = supabase
      .from('calls')
      .select('duration, status, created_at');

    if (agentId) {
      query = query.eq('agent_id', agentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching call stats:', error);
      throw new Error('Failed to fetch call statistics');
    }

    const totalCalls = data.length;
    const completedCalls = data.filter(call => call.status === 'completed');
    const avgDuration = completedCalls.length > 0 
      ? completedCalls.reduce((sum, call) => sum + call.duration, 0) / completedCalls.length 
      : 0;
    const successRate = totalCalls > 0 ? (completedCalls.length / totalCalls) * 100 : 0;

    return {
      totalCalls,
      avgDuration: Math.round(avgDuration),
      successRate: Math.round(successRate)
    };
  }
}