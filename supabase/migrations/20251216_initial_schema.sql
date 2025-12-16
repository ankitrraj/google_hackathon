-- VoiceForge Initial Schema Migration
-- Created: 2025-12-16
-- Description: Creates agents and calls tables with proper constraints and indexes

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS calls CASCADE;
DROP TABLE IF EXISTS agents CASCADE;

-- Agents table
-- Stores voice agent configurations created by users
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  name TEXT NOT NULL CHECK (length(name) > 0 AND length(name) <= 100),
  industry TEXT NOT NULL CHECK (length(industry) > 0),
  first_message TEXT,
  system_prompt TEXT NOT NULL CHECK (length(system_prompt) >= 50 AND length(system_prompt) <= 10000),
  questions JSONB NOT NULL DEFAULT '[]',
  extract_fields JSONB NOT NULL DEFAULT '[]',
  knowledge_base TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calls table  
-- Stores voice call records and extracted data
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL CHECK (length(transcript) > 0),
  extracted_data JSONB NOT NULL DEFAULT '{}',
  duration INTEGER NOT NULL DEFAULT 0 CHECK (duration >= 0),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('completed', 'failed', 'in_progress')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_created_at ON agents(created_at DESC);
CREATE INDEX idx_calls_agent_id ON calls(agent_id);
CREATE INDEX idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX idx_calls_status ON calls(status);

-- Row Level Security (RLS) policies
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- Agents policies
CREATE POLICY "Allow read access to all agents" ON agents
  FOR SELECT USING (true);

CREATE POLICY "Allow insert access to agents" ON agents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to own agents" ON agents
  FOR UPDATE USING (user_id = auth.uid()::text OR user_id IS NULL);

-- Calls policies  
CREATE POLICY "Allow read access to calls" ON calls
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = calls.agent_id 
      AND (agents.user_id = auth.uid()::text OR agents.user_id IS NULL)
    )
  );

CREATE POLICY "Allow insert access to calls" ON calls
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = calls.agent_id
    )
  );

CREATE POLICY "Allow update access to calls" ON calls
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = calls.agent_id 
      AND (agents.user_id = auth.uid()::text OR agents.user_id IS NULL)
    )
  );

-- Comments for documentation
COMMENT ON TABLE agents IS 'Stores AI voice agent configurations created by users';
COMMENT ON TABLE calls IS 'Stores voice call records and extracted conversation data';
COMMENT ON COLUMN agents.system_prompt IS 'Complete system prompt that defines the agent behavior and conversation flow';
COMMENT ON COLUMN agents.first_message IS 'Initial greeting message when call starts';
COMMENT ON COLUMN agents.questions IS 'JSON array of questions the agent should ask during conversations';
COMMENT ON COLUMN agents.extract_fields IS 'JSON array defining what data fields to extract from conversations';
COMMENT ON COLUMN calls.extracted_data IS 'JSON object containing structured data extracted from the conversation';
COMMENT ON COLUMN calls.duration IS 'Call duration in seconds';
COMMENT ON COLUMN calls.status IS 'Call status: in_progress, completed, or failed';
