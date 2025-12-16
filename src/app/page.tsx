"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const useCases = [
  "Lead Generation",
  "Appointments", 
  "Support",
  "Negotiation",
  "Collections",
];

const features = [
  {
    icon: "🤖",
    title: "AI-Powered",
    description: "Advanced AI that understands context and responds naturally",
  },
  {
    icon: "⚡",
    title: "Instant Setup",
    description: "Get your voice assistant running in minutes, not days",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description: "Enterprise-grade security for all your conversations",
  },
  {
    icon: "📊",
    title: "Real Analytics",
    description: "Track performance and optimize your voice agents",
  },
  {
    icon: "🎯",
    title: "Custom Flows",
    description: "Build custom conversation flows for any use case",
  },
  {
    icon: "🌐",
    title: "Multi-Language",
    description: "Support for multiple languages out of the box",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: "✍️",
    title: "Describe",
    description: "Tell us what you want your voice AI to do",
  },
  {
    step: "02", 
    icon: "⚙️",
    title: "Configure",
    description: "AI generates the perfect configuration",
  },
  {
    step: "03",
    icon: "🧪",
    title: "Test",
    description: "Test your agent with real voice calls",
  },
  {
    step: "04",
    icon: "🚀",
    title: "Deploy",
    description: "Deploy and start handling calls",
  },
];

const integrations = [
  "OpenAI", "Google", "Twilio", "Salesforce", "HubSpot", "Zendesk"
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [guidedFlow, setGuidedFlow] = useState(true);
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
  const router = useRouter();

  const handleUseCaseClick = (useCase: string) => {
    setSelectedUseCase(useCase);
    const prompts: Record<string, string> = {
      "Lead Generation": "Create a voice AI assistant for qualifying leads and collecting contact information",
      "Appointments": "Create a voice AI assistant for booking appointments and scheduling meetings",
      "Support": "Create a voice AI assistant for customer support and handling inquiries",
      "Negotiation": "Create a voice AI assistant for price negotiation and deal closing",
      "Collections": "Create a voice AI assistant for payment reminders and debt collection",
    };
    setPrompt(prompts[useCase] || "");
  };

  const handleCreateAgent = () => {
    if (prompt.trim()) {
      sessionStorage.setItem("agentPrompt", prompt);
      sessionStorage.setItem("guidedFlow", String(guidedFlow));
      router.push("/create");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-[oklch(0.08_0.02_180)]">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-primary text-2xl font-bold">With</span>
            <span className="text-foreground text-2xl font-light">Caring</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                Solutions
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact Us
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Book an Appointment
            </Link>
          </div>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 pt-16 pb-20">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Create your <span className="italic font-normal">Free</span>{" "}
            <span className="text-primary">Voice AI</span> Assistant
          </h1>
          
          <p className="text-muted-foreground mb-10">
            Build, test, and ship reliable voice AI assistants
          </p>

          {/* Main Input Card */}
          <div className="bg-card border border-border rounded-xl p-1 mb-6 shadow-2xl shadow-primary/5">
            <Textarea
              placeholder="Describe your ideal Voice AI Assistant"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] bg-transparent border-0 resize-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
            
            <div className="flex items-center justify-between px-3 pb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={guidedFlow}
                  onChange={(e) => setGuidedFlow(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary accent-primary"
                />
                <span className="text-sm text-foreground">Guided Flow</span>
              </label>
              
              <Button 
                onClick={handleCreateAgent}
                disabled={!prompt.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6"
              >
                Create Agent →
              </Button>
            </div>
          </div>

          {/* Use Cases */}
          <div className="text-left mb-4">
            <p className="text-sm text-muted-foreground mb-3">Choose from use cases</p>
            <div className="flex flex-wrap gap-2">
              {useCases.map((useCase) => (
                <button
                  key={useCase}
                  onClick={() => handleUseCaseClick(useCase)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    selectedUseCase === useCase
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/50 text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {useCase}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Why Choose <span className="text-primary">WithCaring</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">How it Works</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center text-3xl mx-auto hover:border-primary/50 transition-all">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Integrations and Partners
          </h2>
          
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            {integrations.map((name, index) => (
              <div
                key={index}
                className="text-xl font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <p className="text-lg md:text-xl text-foreground mb-6 italic">
              "WithCaring transformed how we handle customer calls. Our response time dropped by 80% 
              and customer satisfaction increased significantly. The AI understands context perfectly."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                JD
              </div>
              <div className="text-left">
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-muted-foreground">CEO, TechCorp Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Create your first voice AI assistant in minutes. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push("/create")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg"
            >
              Start Building Free →
            </Button>
            <Button 
              variant="outline"
              className="rounded-full px-8 py-6 text-lg border-border hover:border-primary/50"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-1 mb-4">
                <span className="text-primary text-xl font-bold">With</span>
                <span className="text-foreground text-xl font-light">Caring</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Build intelligent voice AI assistants that care about your customers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Integrations</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 WithCaring. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom gradient glow effect */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
    </div>
  );
}
