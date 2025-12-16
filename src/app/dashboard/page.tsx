import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to Home
        </Link>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your voice agents and view analytics
            </p>
          </div>
          <Button asChild>
            <Link href="/create">Create New Agent</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Agents</CardTitle>
              <CardDescription>
                View and manage your created voice agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Coming in Task 4: Dashboard with agent list and analytics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call Analytics</CardTitle>
              <CardDescription>
                Track performance and view call history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Coming in Task 4: Call statistics and transcript viewer
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}