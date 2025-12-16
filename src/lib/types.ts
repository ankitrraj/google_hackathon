// Core data types for VoiceForge

export interface Agent {
  id: string;                    // UUID
  user_id: string;               // User identifier (optional for MVP)
  name: string;                  // e.g., "Pizza Delivery Agent"
  industry: string;              // e.g., "restaurant", "salon", "healthcare"
  system_prompt: string;         // Complete system prompt for voice agent
  questions: string[];           // Array of questions agent should ask
  extract_fields: ExtractField[]; // Fields to extract from conversation
  knowledge_base: string | null; // Optional PDF-extracted content
  created_at: string;            // ISO timestamp
}

export interface ExtractField {
  name: string;                  // e.g., "customer_name"
  description: string;           // e.g., "The customer's full name"
  type: 'string' | 'number' | 'date' | 'boolean';
}

export interface Call {
  id: string;                    // UUID
  agent_id: string;              // Foreign key to agents table
  transcript: string;            // Complete conversation transcript
  extracted_data: Record<string, any>; // JSON object with extracted fields
  duration: number;              // Call duration in seconds
  created_at: string;            // ISO timestamp
  status: 'completed' | 'failed' | 'in_progress';
}

export interface AgentConfig {
  name: string;
  industry: string;
  system_prompt: string;
  questions: string[];
  extract_fields: ExtractField[];
}

// Component Props Interfaces
export interface AgentBuilderProps {
  onAgentCreated: (agentId: string) => void;
}

export interface AgentBuilderState {
  prompt: string;
  isGenerating: boolean;
  selectedTemplate: string | null;
  generatedConfig: AgentConfig | null;
}

export interface VoiceInterfaceProps {
  agentId: string;
  systemPrompt: string;
  onCallComplete: (transcript: string, extractedData: Record<string, any>) => void;
}

export interface VoiceInterfaceState {
  isConnected: boolean;
  isRecording: boolean;
  transcript: string[];
  audioLevel: number;
}

export interface DashboardProps {
  userId: string;
}

export interface DashboardData {
  agents: Agent[];
  selectedAgent: Agent | null;
  calls: Call[];
  stats: {
    totalCalls: number;
    avgDuration: number;
    successRate: number;
  };
}

export interface KnowledgeBaseUploadProps {
  agentId: string;
  onUploadComplete: (extractedContent: string) => void;
}

export interface KnowledgeBaseUploadState {
  file: File | null;
  isProcessing: boolean;
  extractedContent: string | null;
}

// API Response Types
export interface CreateAgentResponse {
  success: boolean;
  agentId: string;
  url: string;
  config: AgentConfig;
}

export interface GetAgentResponse {
  agent: Agent;
}

export interface UploadKnowledgeResponse {
  success: boolean;
  extractedContent: string;
  updatedPrompt: string;
}

export interface StartCallResponse {
  callId: string;
  websocketUrl: string;
}

export interface CompleteCallResponse {
  success: boolean;
}

export interface DashboardStatsResponse {
  agents: Agent[];
  calls: Call[];
  stats: {
    totalCalls: number;
    avgDuration: number;
    totalAgents: number;
  };
}

// Error Messages
export const ERROR_MESSAGES = {
  AGENT_NOT_FOUND: "This agent doesn't exist. Please check the URL.",
  GENERATION_FAILED: "Failed to generate agent config. Please try again.",
  CALL_CONNECTION_FAILED: "Unable to connect to voice service. Please check your internet connection.",
  PDF_TOO_LARGE: "PDF file must be under 10MB.",
  PDF_INVALID: "Invalid PDF file. Please upload a valid PDF document.",
  DATABASE_ERROR: "Something went wrong. Please try again later.",
  INVALID_PROMPT: "Please enter a description for your agent.",
} as const;

// Template Types
export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  industry: string;
}

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'restaurant',
    name: 'Restaurant Booking',
    description: 'Create a voice agent for restaurant reservations',
    prompt: 'Create a restaurant booking agent that can take reservations, ask for customer details, preferred time, party size, and any special requests',
    industry: 'restaurant'
  },
  {
    id: 'salon',
    name: 'Salon Appointment',
    description: 'Create a voice agent for salon appointments',
    prompt: 'Create a salon appointment agent that can book appointments, ask for service type, preferred stylist, date and time, and customer contact information',
    industry: 'salon'
  },
  {
    id: 'doctor',
    name: 'Doctor Consultation',
    description: 'Create a voice agent for medical appointments',
    prompt: 'Create a doctor consultation agent that can schedule appointments, ask for patient information, reason for visit, preferred doctor, and insurance details',
    industry: 'healthcare'
  }
];