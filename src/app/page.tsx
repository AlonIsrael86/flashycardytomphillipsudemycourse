import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SchemaMarkup } from "@/components/schema-markup";
import { getBaseUrl } from "@/lib/seo";
import { WelcomeModal } from "@/components/welcome-modal";
import { AuthDialogButtons } from "@/components/auth/auth-dialog-buttons";

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
      
      {/* Changed overflow-hidden to overflow-x-hidden to prevent vertical clipping */}
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 md:px-8 overflow-x-hidden relative">
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

        {/* Content - Added top padding to prevent logo clipping */}
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto py-16 sm:py-20">
          {/* Logo Icon - Added margin top for safety */}
          <div className="flex justify-center mb-6 mt-4">
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
            
            {/* NEW: "by Just In Time" with trademark green and cool effect */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-zinc-500 text-lg sm:text-xl font-light">by</span>
              <a 
                href="https://justintime.co.il" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lg sm:text-xl font-semibold tracking-wide hover:scale-105 transition-all duration-300 relative group"
                style={{ color: '#8bdbab' }}
              >
                <span className="relative z-10">Just In Time</span>
                {/* Glow effect on hover */}
                <span 
                  className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"
                  style={{ backgroundColor: '#8bdbab' }}
                />
                {/* Underline animation */}
                <span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: '#8bdbab' }}
                />
              </a>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
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
            <AuthDialogButtons />
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

          {/* Demo Badge - Updated with JustInTime green */}
          <div className="pt-8">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm"
              style={{ 
                backgroundColor: 'rgba(139, 219, 171, 0.1)', 
                borderColor: 'rgba(139, 219, 171, 0.3)',
                color: '#8bdbab'
              }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: '#8bdbab' }}
              />
              <span>Proof of Concept by Just In Time</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
