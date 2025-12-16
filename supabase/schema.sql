-- VoiceForge Database Schema
-- This file contains the complete database schema for VoiceForge

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agents table
-- Stores voice agent configurations created by users
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT, -- User identifier (optional for MVP, can use demo mode)
  name TEXT NOT NULL CHECK (length(name) > 0 AND length(name) <= 100),
  industry TEXT NOT NULL CHECK (length(industry) > 0),
  system_prompt TEXT NOT NULL CHECK (length(system_prompt) >= 50 AND length(system_prompt) <= 5000),
  questions JSONB NOT NULL DEFAULT '[]' CHECK (jsonb_array_length(questions) > 0),
  extract_fields JSONB NOT NULL DEFAULT '[]' CHECK (jsonb_array_length(extract_fields) > 0),
  knowledge_base TEXT, -- Optional PDF-extracted content
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calls table  
-- Stores voice call records and extracted data
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL CHECK (length(transcript) > 0),
  extracted_data JSONB NOT NULL DEFAULT '{}',
  duration INTEGER NOT NULL DEFAULT 0 CHECK (duration >= 0),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('completed', 'failed', 'in_progress')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_agent_id ON calls(agent_id);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);

-- Row Level Security (RLS) policies
-- Enable RLS on both tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- Agents policies
-- Allow users to read all agents (for demo purposes)
CREATE POLICY IF NOT EXISTS "Allow read access to all agents" ON agents
  FOR SELECT USING (true);

-- Allow users to insert agents (for demo purposes, no user restriction)
CREATE POLICY IF NOT EXISTS "Allow insert access to agents" ON agents
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own agents
CREATE POLICY IF NOT EXISTS "Allow update access to own agents" ON agents
  FOR UPDATE USING (user_id = auth.uid()::text OR user_id IS NULL);

-- Calls policies  
-- Allow read access to calls for agents the user can see
CREATE POLICY IF NOT EXISTS "Allow read access to calls" ON calls
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = calls.agent_id 
      AND (agents.user_id = auth.uid()::text OR agents.user_id IS NULL)
    )
  );

-- Allow insert access to calls for valid agents
CREATE POLICY IF NOT EXISTS "Allow insert access to calls" ON calls
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = calls.agent_id
    )
  );

-- Allow update access to calls for agents the user owns
CREATE POLICY IF NOT EXISTS "Allow update access to calls" ON calls
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = calls.agent_id 
      AND (agents.user_id = auth.uid()::text OR agents.user_id IS NULL)
    )
  );

-- Utility functions
-- Function to validate extract fields JSON structure
CREATE OR REPLACE FUNCTION validate_extract_fields(fields JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if it's an array
  IF jsonb_typeof(fields) != 'array' THEN
    RETURN FALSE;
  END IF;
  
  -- Check each field has required properties
  FOR i IN 0..jsonb_array_length(fields)-1 LOOP
    IF NOT (
      fields->i ? 'name' AND 
      fields->i ? 'description' AND 
      fields->i ? 'type' AND
      fields->i->>'type' IN ('string', 'number', 'date', 'boolean')
    ) THEN
      RETURN FALSE;
    END IF;
  END LOOP;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to validate questions JSON structure  
CREATE OR REPLACE FUNCTION validate_questions(questions JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if it's an array
  IF jsonb_typeof(questions) != 'array' THEN
    RETURN FALSE;
  END IF;
  
  -- Check each question is a non-empty string
  FOR i IN 0..jsonb_array_length(questions)-1 LOOP
    IF jsonb_typeof(questions->i) != 'string' OR length(questions->>i) = 0 THEN
      RETURN FALSE;
    END IF;
  END LOOP;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add validation constraints
ALTER TABLE agents ADD CONSTRAINT valid_extract_fields 
  CHECK (validate_extract_fields(extract_fields));

ALTER TABLE agents ADD CONSTRAINT valid_questions 
  CHECK (validate_questions(questions));

-- Views for analytics
-- Agent statistics view
CREATE OR REPLACE VIEW agent_stats AS
SELECT 
  a.id,
  a.name,
  a.industry,
  a.created_at,
  COUNT(c.id) as total_calls,
  COUNT(CASE WHEN c.status = 'completed' THEN 1 END) as completed_calls,
  AVG(CASE WHEN c.status = 'completed' THEN c.duration END) as avg_duration,
  MAX(c.created_at) as last_call_at
FROM agents a
LEFT JOIN calls c ON a.id = c.agent_id
GROUP BY a.id, a.name, a.industry, a.created_at;

-- Call analytics view
CREATE OR REPLACE VIEW call_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as call_date,
  COUNT(*) as total_calls,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_calls,
  AVG(CASE WHEN status = 'completed' THEN duration END) as avg_duration,
  EXTRACT(HOUR FROM created_at) as call_hour
FROM calls
GROUP BY DATE_TRUNC('day', created_at), EXTRACT(HOUR FROM created_at);

-- Sample data for testing (optional)
-- Uncomment to insert sample agents for development

/*
INSERT INTO agents (name, industry, system_prompt, questions, extract_fields, user_id) VALUES
(
  'Pizza Delivery Agent',
  'restaurant',
  'You are a friendly pizza delivery agent. Your job is to take pizza orders from customers. Ask for their name, phone number, delivery address, and what pizza they would like to order. Be polite and confirm all details before ending the call. If they ask about prices or menu items, let them know you can help with that.',
  '["What''s your name?", "What''s your phone number?", "What''s your delivery address?", "What pizza would you like to order?", "Would you like any drinks or sides?"]',
  '[
    {"name": "customer_name", "description": "Customer''s full name", "type": "string"},
    {"name": "phone_number", "description": "Customer''s phone number", "type": "string"},
    {"name": "delivery_address", "description": "Full delivery address", "type": "string"},
    {"name": "pizza_order", "description": "Pizza order details", "type": "string"},
    {"name": "total_amount", "description": "Total order amount", "type": "number"}
  ]',
  'demo_user'
),
(
  'Salon Appointment Agent',
  'salon',
  'You are a professional salon appointment booking agent. Help customers schedule appointments by asking for their name, contact information, preferred service, stylist preference, and desired date/time. Be friendly and accommodating while gathering all necessary information.',
  '["What''s your name?", "What''s your phone number?", "What service would you like?", "Do you have a preferred stylist?", "What date and time work best for you?"]',
  '[
    {"name": "customer_name", "description": "Customer''s full name", "type": "string"},
    {"name": "phone_number", "description": "Customer''s contact number", "type": "string"},
    {"name": "service_type", "description": "Type of service requested", "type": "string"},
    {"name": "preferred_stylist", "description": "Preferred stylist name", "type": "string"},
    {"name": "appointment_date", "description": "Preferred appointment date", "type": "date"},
    {"name": "appointment_time", "description": "Preferred appointment time", "type": "string"}
  ]',
  'demo_user'
);
*/

-- Comments for documentation
COMMENT ON TABLE agents IS 'Stores AI voice agent configurations created by users';
COMMENT ON TABLE calls IS 'Stores voice call records and extracted conversation data';
COMMENT ON COLUMN agents.system_prompt IS 'Complete system prompt that defines the agent behavior and conversation flow';
COMMENT ON COLUMN agents.questions IS 'JSON array of questions the agent should ask during conversations';
COMMENT ON COLUMN agents.extract_fields IS 'JSON array defining what data fields to extract from conversations';
COMMENT ON COLUMN calls.extracted_data IS 'JSON object containing structured data extracted from the conversation';
COMMENT ON COLUMN calls.duration IS 'Call duration in seconds';
COMMENT ON COLUMN calls.status IS 'Call status: in_progress, completed, or failed';