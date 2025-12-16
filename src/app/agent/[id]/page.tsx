'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Agent } from '@/lib/types';
import { Phone, Share2, ArrowLeft, Sparkles } from 'lucide-react';

export default function AgentPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgent();
  }, [agentId]);

  const fetchAgent = async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch agent');
      }

      setAgent(data.agent);
    } catch (err: any) {
      setError(err.message || 'Failed to load agent');
      console.error('Error fetching agent:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Agent URL copied to clipboard!');
  };

  const handleTestCall = () => {
    // TODO: Implement voice testing in Task 3
    alert('Voice testing coming soon! This will open the voice interface.');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">Agent Not Found</h1>
          <p className="text-muted-foreground">{error || 'This agent does not exist.'}</p>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to Dashboard
          </Link>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Agent Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{agent.name}</h1>
            <Badge>{agent.industry}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Created {new Date(agent.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Test Call Button */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Test Your Agent
            </CardTitle>
            <CardDescription>
              Start a voice call to test how your agent responds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleTestCall} size="lg" className="w-full">
              <Phone className="mr-2 h-4 w-4" />
              Start Test Call
            </Button>
          </CardContent>
        </Card>

        {/* System Prompt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              System Prompt
            </CardTitle>
            <CardDescription>
              The instructions that guide your agent's behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md whitespace-pre-wrap">
              {agent.system_prompt}
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation Questions</CardTitle>
            <CardDescription>
              Questions your agent will ask during conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {agent.questions.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary font-semibold">{index + 1}.</span>
                  <span className="text-sm">{question}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Extract Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Data Extraction Fields</CardTitle>
            <CardDescription>
              Information your agent will extract from conversations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {agent.extract_fields.map((field, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{field.name}</h4>
                    <Badge variant="outline">{field.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{field.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Base */}
        {agent.knowledge_base && (
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Additional information to enhance agent responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md whitespace-pre-wrap max-h-64 overflow-y-auto">
                {agent.knowledge_base}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}