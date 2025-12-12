import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SchemaMarkup } from "@/components/schema-markup";
import { getBaseUrl } from "@/lib/seo";
import { WelcomeModal } from "@/components/welcome-modal";

export const metadata: Metadata = {
  title: "FlashyCardy | AI-Powered Flashcard Platform",
  description: "FlashyCardy - Your personal flashcard platform. Create, manage, and study with AI-powered flashcard decks to enhance your learning experience.",
  keywords: ["flashcards", "study", "learning", "education", "memorization", "quiz", "flashcard app", "AI"],
  openGraph: {
    title: "FlashyCardy | AI-Powered Flashcard Platform",
    description: "Create, manage, and study with your personal flashcard platform. Organize your learning with customizable decks and AI-generated cards.",
    type: "website",
    siteName: "FlashyCardy",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlashyCardy | AI-Powered Flashcard Platform",
    description: "Create, manage, and study with your personal flashcard platform.",
  },
};

export default async function Home() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }

  const baseUrl = getBaseUrl();
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FlashyCardy",
    "description": "Your personal flashcard platform for creating, managing, and studying with customizable flashcard decks",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <SchemaMarkup schema={websiteSchema} />
      <WelcomeModal />
      
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 md:px-8 overflow-hidden relative">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Grid Pattern Overlay */}
        <div 
          className="fixed inset-0 z-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-bounce-slow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent leading-tight">
              FlashyCardy
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500" />
              <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">AI-Powered</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500" />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Your personal flashcard platform with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-semibold">
              AI-powered
            </span>{" "}
            card generation
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {[
              { icon: "✨", text: "AI Generation" },
              { icon: "📚", text: "Unlimited Decks" },
              { icon: "🎯", text: "Smart Study" },
              { icon: "🔒", text: "Secure" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-sm hover:border-purple-500/50 hover:bg-zinc-800 transition-all duration-300"
              >
                <span>{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8">
            <SignUpButton mode="modal">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105 text-lg px-8 py-6 rounded-xl"
              >
                <span>Get Started Free</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-zinc-800/50 hover:bg-zinc-700 text-white border-zinc-600 hover:border-zinc-500 transition-all duration-300 hover:scale-105 text-lg px-8 py-6 rounded-xl"
              >
                Sign In
              </Button>
            </SignInButton>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 flex flex-col items-center gap-4">
            <p className="text-zinc-500 text-sm">Powered by</p>
            <div className="flex flex-wrap justify-center gap-6 items-center opacity-60">
              {["Next.js", "OpenAI", "Clerk", "Stripe", "Cursor AI"].map((tech) => (
                <span key={tech} className="text-zinc-400 text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Demo Badge */}
          <div className="pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>Proof of Concept by JustInTime</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
