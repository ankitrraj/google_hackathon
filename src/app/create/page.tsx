"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ConversationSection {
  id: string;
  title: string;
  enabled: boolean;
  content?: string;
}

interface AssistantConfig {
  name: string;
  language: string;
  voice: string;
  aiModel: string;
  transcription: string;
  welcomeMessage: string;
  sections: ConversationSection[];
}

const defaultSections: ConversationSection[] = [
  { id: "1", title: "Introduction", enabled: true },
  { id: "2", title: "Understanding Issue", enabled: true },
  { id: "3", title: "Gathering Information", enabled: true },
];

export default function CreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [config, setConfig] = useState<AssistantConfig>({
    name: "Hospital Appointment Assistant",
    language: "No languages selected",
    voice: "Google",
    aiModel: "Azure-Gpt-4o-Mini",
    transcription: "Azure",
    welcomeMessage: "Namaste ji, main City Hospital se bol raha hoon. Aapko appointment book karna hai?",
    sections: defaultSections,
  });

  const [chatMessages, setChatMessages] = useState([
    {
      type: "system",
      text: "Your assistant is ready. This helper chat will guide you with your agent setup, integrations, and platform help. Ask anything, like: \"How do I integrate with N8N?\""
    },
    {
      type: "system", 
      text: "Happy with the result? You can now fine-tune or launch!",
      timestamp: "December 10, 2025 at 09:14 AM"
    }
  ]);

  useEffect(() => {
    const savedPrompt = sessionStorage.getItem("agentPrompt");
    if (savedPrompt) {
      setPrompt(savedPrompt);
      // Simulate AI processing
      setTimeout(() => {
        setShowDashboard(true);
        setIsLoading(false);
        // Generate config based on prompt
        if (savedPrompt.toLowerCase().includes("appointment")) {
          setConfig(prev => ({
            ...prev,
            name: "Hospital Appointment Assistant",
            welcomeMessage: "Namaste ji, main City Hospital se bol raha hoon. Aapko appointment book karna hai?",
          }));
        } else if (savedPrompt.toLowerCase().includes("lead")) {
          setConfig(prev => ({
            ...prev,
            name: "Lead Generation Assistant",
            welcomeMessage: "Hello! I'm here to help you find the perfect solution. May I know your requirements?",
          }));
        } else if (savedPrompt.toLowerCase().includes("support")) {
          setConfig(prev => ({
            ...prev,
            name: "Customer Support Assistant",
            welcomeMessage: "Hi there! How can I assist you today?",
          }));
        }
      }, 1500);
    } else {
      setIsLoading(false);
    }
  }, []);

  const toggleSection = (id: string) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === id ? { ...s, enabled: !s.enabled } : s
      )
    }));
  };

  const addSection = () => {
    const newId = String(config.sections.length + 1);
    setConfig(prev => ({
      ...prev,
      sections: [...prev.sections, { id: newId, title: "New Section", enabled: true }]
    }));
  };

  const tabs = [
    { id: "details", label: "Assistant Details" },
    { id: "call", label: "Call Configurations" },
    { id: "knowledge", label: "Knowledge Base" },
    { id: "integrations", label: "Integrations" },
    { id: "postcall", label: "Post-Call" },
    { id: "recent", label: "Recent Calls" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Creating your assistant...</p>
        </div>
      </div>
    );
  }

  if (!showDashboard) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to Home
        </Link>
        <div className="max-w-2xl mx-auto mt-12">
          <h1 className="text-2xl font-bold mb-4">Describe your Voice AI Assistant</h1>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Create a voice AI assistant for booking hospital appointments..."
            className="min-h-[150px] mb-4"
          />
          <Button 
            onClick={() => {
              sessionStorage.setItem("agentPrompt", prompt);
              setIsLoading(true);
              setTimeout(() => {
                setShowDashboard(true);
                setIsLoading(false);
              }, 1500);
            }}
            disabled={!prompt.trim()}
            className="bg-primary"
          >
            Create Assistant →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar - Chat Helper */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 flex-1">
          <div className="space-y-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="text-sm">
                <p className="text-primary">{msg.text}</p>
                {msg.timestamp && (
                  <p className="text-xs text-muted-foreground mt-1">{msg.timestamp}</p>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              Configure settings →
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              Test with simulation →
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
              Upload knowledge →
            </Button>
          </div>
        </div>
        
        {/* Balance Warning */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between bg-card rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div>
                <p className="text-sm font-medium">$ 0.087</p>
                <p className="text-xs text-muted-foreground">Low balance - consider upgrading</p>
              </div>
            </div>
            <Button size="sm" className="bg-primary text-xs">
              Upgrade Now →
            </Button>
          </div>
        </div>
        
        {/* Chat Input */}
        <div className="p-4 border-t border-border">
          <div className="relative">
            <Input placeholder="Ask anything..." className="pr-10" />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="text-muted-foreground hover:text-foreground">
              ←
            </button>
            <h1 className="font-semibold">{config.name} (Co...</h1>
            <span className="flex items-center gap-1 text-sm text-primary">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Incoming
            </span>
            <span className="text-sm text-muted-foreground">Cost/Minute: $0.100</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Test with</span>
            <Button variant="outline" size="sm" className="gap-2">
              <span>💬</span> Chat
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-primary text-primary">
              <span>🌐</span> Web Call
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-primary text-primary">
              <span>📞</span> Phone Call
            </Button>
            <Button className="bg-primary gap-2">
              <span>🚀</span> Deploy ▼
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border px-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm transition-colors ${
                    activeTab === tab.id
                      ? "text-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">UI</span>
              <div className="w-10 h-5 bg-muted rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-primary rounded-full"></div>
              </div>
              <span className="text-sm">Code</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {/* Assistant Settings */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Assistant Settings
              <span className="w-4 h-4 rounded-full border border-muted-foreground text-xs flex items-center justify-center">?</span>
            </h2>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">🌐</span>
                  <span className="font-medium">Languages</span>
                  <span className="ml-auto w-4 h-4 rounded-full border border-muted-foreground text-xs flex items-center justify-center">?</span>
                </div>
                <p className="text-sm text-muted-foreground">{config.language}</p>
              </div>
              
              <div className="bg-card border border-primary rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">🎙️</span>
                  <span className="font-medium">Voice (TTS)</span>
                  <span className="ml-auto w-4 h-4 rounded-full border border-muted-foreground text-xs flex items-center justify-center">?</span>
                </div>
                <p className="text-sm text-muted-foreground">{config.voice}</p>
              </div>
              
              <div className="bg-card border border-primary rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">🤖</span>
                  <span className="font-medium">AI Model (LLM)</span>
                  <span className="ml-auto w-4 h-4 rounded-full border border-muted-foreground text-xs flex items-center justify-center">?</span>
                </div>
                <p className="text-sm text-muted-foreground">{config.aiModel}</p>
              </div>
              
              <div className="bg-card border border-primary rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">📝</span>
                  <span className="font-medium">Transcription (STT)</span>
                  <span className="ml-auto w-4 h-4 rounded-full border border-muted-foreground text-xs flex items-center justify-center">?</span>
                </div>
                <p className="text-sm text-muted-foreground">{config.transcription}</p>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Welcome Message
                <span className="w-4 h-4 rounded-full border border-muted-foreground text-xs flex items-center justify-center">?</span>
              </h2>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  Dynamic
                  <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  Interruption
                  <div className="w-10 h-5 bg-muted rounded-full relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-gray-400 rounded-full"></div>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <Textarea
                value={config.welcomeMessage}
                onChange={(e) => setConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                className="bg-transparent border-0 resize-none focus-visible:ring-0 min-h-[80px]"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Character limit: 300</span>
                <span>{300 - config.welcomeMessage.length} remaining</span>
              </div>
            </div>
          </div>

          {/* Conversational Flow */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Conversational Flow (Assistant&apos;s Instructions)
                <span className="w-4 h-4 rounded-full border border-muted-foreground text-xs flex items-center justify-center">?</span>
              </h2>
              <Button variant="outline" size="sm" onClick={addSection} className="gap-1">
                + Add Section
              </Button>
            </div>
            
            <div className="space-y-3">
              {config.sections.map((section, index) => (
                <div key={section.id} className="bg-card border border-border rounded-lg">
                  <div className="flex items-center gap-3 p-4">
                    <button className="text-muted-foreground hover:text-foreground">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <span className="text-muted-foreground">⋮⋮</span>
                    <span className="text-muted-foreground">{index + 1}.</span>
                    <span className="font-medium flex-1">{section.title}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">ON</span>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${
                          section.enabled ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                          section.enabled ? "right-0.5" : "left-0.5"
                        }`}></div>
                      </button>
                      <button className="text-muted-foreground hover:text-red-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us Button */}
      <button className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm">
        Contact Us
      </button>
    </div>
  );
}
