'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AGENT_TEMPLATES, AgentConfig } from '@/lib/types';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AgentBuilder() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<AgentConfig | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    const template = AGENT_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setPrompt(template.prompt);
      setSelectedTemplate(templateId);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your agent');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/agents/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate agent');
      }

      setGeneratedConfig(data.config);
      setAgentId(data.agentId);
      setShowPreview(true);

    } catch (err: any) {
      setError(err.message || 'Failed to generate agent. Please try again.');
      console.error('Error generating agent:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeploy = () => {
    if (agentId) {
      router.push(`/agent/${agentId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Create Your Voice Agent</h1>
        <p className="text-muted-foreground">
          Describe your ideal agent in plain English, and AI will generate it for you
        </p>
      </div>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Templates</CardTitle>
          <CardDescription>
            Choose a template to get started quickly, or write your own description below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {AGENT_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{template.industry}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prompt Input */}
      <Card>
        <CardHeader>
          <CardTitle>Describe Your Agent</CardTitle>
          <CardDescription>
            Tell us what your voice agent should do. Be specific about the tasks, questions, and data you need.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: Create a pizza delivery agent that takes orders, asks for customer name, phone number, delivery address, and pizza preferences. It should be friendly and confirm all details before ending the call."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className="resize-none"
          />

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Agent...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Agent with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Agent Generated Successfully!
            </DialogTitle>
            <DialogDescription>
              Review your agent configuration below. You can deploy it or make changes.
            </DialogDescription>
          </DialogHeader>

          {generatedConfig && (
            <div className="space-y-4 mt-4">
              {/* Agent Name */}
              <div>
                <h3 className="font-semibold mb-2">Agent Name</h3>
                <p className="text-sm text-muted-foreground">{generatedConfig.name}</p>
              </div>

              {/* Industry */}
              <div>
                <h3 className="font-semibold mb-2">Industry</h3>
                <Badge>{generatedConfig.industry}</Badge>
              </div>

              {/* System Prompt */}
              <div>
                <h3 className="font-semibold mb-2">System Prompt</h3>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md max-h-40 overflow-y-auto">
                  {generatedConfig.system_prompt}
                </div>
              </div>

              {/* Questions */}
              <div>
                <h3 className="font-semibold mb-2">Questions ({generatedConfig.questions.length})</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {generatedConfig.questions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>

              {/* Extract Fields */}
              <div>
                <h3 className="font-semibold mb-2">Data Fields ({generatedConfig.extract_fields.length})</h3>
                <div className="space-y-2">
                  {generatedConfig.extract_fields.map((field, index) => (
                    <div key={index} className="text-sm bg-muted p-2 rounded-md">
                      <div className="font-medium">{field.name}</div>
                      <div className="text-muted-foreground text-xs">{field.description}</div>
                      <Badge variant="outline" className="mt-1 text-xs">{field.type}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleDeploy} className="flex-1">
                  Deploy Agent
                </Button>
                <Button variant="outline" onClick={() => setShowPreview(false)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}