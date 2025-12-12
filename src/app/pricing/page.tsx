import type { Metadata } from "next";
import { SchemaMarkup } from "@/components/schema-markup";
import { getBaseUrl } from "@/lib/seo";
import Link from "next/link";
import { PricingTableClient } from "@/components/pricing-table-client";

export const metadata: Metadata = {
  title: "Pricing | FlashyCardy",
  description: "Choose the perfect plan for your flashcard learning needs. Upgrade to Pro for unlimited decks and AI-powered flashcard generation.",
  keywords: ["pricing", "plans", "subscription", "flashcards", "pro", "upgrade", "billing"],
  openGraph: {
    title: "Pricing | FlashyCardy",
    description: "Choose the perfect plan for your flashcard learning needs. Upgrade to Pro for unlimited decks and AI-powered flashcard generation.",
    type: "website",
    siteName: "FlashyCardy",
  },
  twitter: {
    card: "summary",
    title: "Pricing | FlashyCardy",
    description: "Choose the perfect plan for your flashcard learning needs. Upgrade to Pro for unlimited decks and AI-powered flashcard generation.",
  },
};

export default function PricingPage() {
  const baseUrl = getBaseUrl();
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Pricing | FlashyCardy",
    "description": "Choose the perfect plan for your flashcard learning needs",
    "url": `${baseUrl}/pricing`,
    "mainEntity": {
      "@type": "PriceSpecification",
      "description": "Subscription plans for FlashyCardy",
    },
  };

  return (
    <>
      <SchemaMarkup schema={webPageSchema} />
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-6"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Dashboard
            </Link>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto px-4">
              Select the perfect plan to unlock your full learning potential with FlashyCardy
            </p>
          </div>

          {/* Pricing Table */}
          <div className="max-w-5xl mx-auto">
            <PricingTableClient />
          </div>

          {/* Additional Information */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Why Upgrade to Pro?</h2>
              <ul className="space-y-3 text-zinc-300">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Unlimited flashcard decks - create as many as you need</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>AI-powered flashcard generation - let AI create cards from your deck topics</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Priority support and early access to new features</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
