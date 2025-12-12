import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getDeckWithCards } from "@/db/queries/decks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { SchemaMarkup } from "@/components/schema-markup";
import { getBaseUrl } from "@/lib/seo";
import { AddCardDialog } from "@/components/add-card-dialog";
import { DeleteCardButton } from "@/components/delete-card-button";
import { EditDeckDialog } from "@/components/edit-deck-dialog";
import { EditCardDialog } from "@/components/edit-card-dialog";
import { GenerateAICardsButton } from "@/components/generate-ai-cards-button";

type Props = {
  params: Promise<{ deckId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await auth();
  
  if (!userId) {
    return {
      title: "Deck | FlashyCardy",
      description: "View your flashcard deck",
    };
  }

  const { deckId } = await params;
  const deckIdNum = parseInt(deckId, 10);
  
  if (isNaN(deckIdNum)) {
    return {
      title: "Deck Not Found | FlashyCardy",
      description: "The requested deck could not be found",
    };
  }

  const deck = await getDeckWithCards(deckIdNum, userId);

  if (!deck) {
    return {
      title: "Deck Not Found | FlashyCardy",
      description: "The requested deck could not be found",
    };
  }

  return {
    title: `${deck.name} | FlashyCardy`,
    description: deck.description || `Study ${deck.cards.length} flashcards in ${deck.name}`,
    keywords: ["flashcards", "study", "learning", "deck", deck.name],
    openGraph: {
      title: `${deck.name} | FlashyCardy`,
      description: deck.description || `Study ${deck.cards.length} flashcards`,
      type: "website",
      siteName: "FlashyCardy",
    },
    twitter: {
      card: "summary",
      title: `${deck.name} | FlashyCardy`,
      description: deck.description || `Study ${deck.cards.length} flashcards`,
    },
  };
}

export default async function DeckPage({ params }: Props) {
  const { userId, has } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  const { deckId } = await params;
  const deckIdNum = parseInt(deckId, 10);
  
  if (isNaN(deckIdNum)) {
    notFound();
  }

  const deck = await getDeckWithCards(deckIdNum, userId);

  if (!deck) {
    notFound();
  }

  const hasAIGeneration = has({ feature: "ai_flashcard_generation" });

  const baseUrl = getBaseUrl();
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": deck.name,
    "description": deck.description || `Study ${deck.cards.length} flashcards`,
    "url": `${baseUrl}/decks/${deck.id}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": deck.cards.length,
      "itemListElement": deck.cards.map((card, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": card.front,
        "description": card.back,
      })),
    }
  };

  return (
    <>
      <SchemaMarkup schema={webPageSchema} />
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 md:mb-12">
            <Link 
              href="/dashboard"
              className="inline-flex items-center text-zinc-400 hover:text-white transition-all duration-300 mb-6 group"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mr-3 group-hover:bg-zinc-700/50 group-hover:border-zinc-600 transition-all duration-300">
                <svg 
                  className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" 
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
              </div>
              Back to Dashboard
            </Link>
            
            {/* Hero Card */}
            <div className="relative p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-900/70 to-zinc-950/90 border border-zinc-800/50 backdrop-blur-sm overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl" />
              
              <div className="relative flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-xs font-medium text-zinc-300">
                      {deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'}
                    </div>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent leading-tight">
                    {deck.name}
                  </h1>
                  
                  {deck.description && (
                    <p className="text-base sm:text-lg md:text-xl text-zinc-400 mb-4 sm:mb-6 max-w-2xl leading-relaxed">
                      {deck.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-6 text-sm text-zinc-500">
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/30">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Updated {new Date(deck.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-full lg:w-auto lg:ml-8">
                  <Link href={`/decks/${deck.id}/study`} className="w-full lg:w-auto">
                    <Button className="w-full lg:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Study Deck
                    </Button>
                  </Link>
                  <AddCardDialog deckId={deck.id} />
                  <GenerateAICardsButton 
                    deckId={deck.id} 
                    hasAIGeneration={hasAIGeneration}
                    deckName={deck.name}
                    deckDescription={deck.description}
                  />
                  <EditDeckDialog 
                    deckId={deck.id} 
                    currentName={deck.name}
                    currentDescription={deck.description}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-blue-500" />
                Flashcards
              </h2>
              {deck.cards.length > 0 && (
                <span className="text-sm text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700/30">
                  {deck.cards.length} total
                </span>
              )}
            </div>

            {deck.cards.length === 0 ? (
              <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border-zinc-800/50 border-dashed">
                <CardHeader className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl text-zinc-300">No cards yet</CardTitle>
                  <CardDescription className="text-zinc-500 mt-2">
                    This deck is empty. Add your first flashcard to start learning!
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-8">
                  <AddCardDialog deckId={deck.id} />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deck.cards.map((card, index) => (
                  <Card 
                    key={card.id}
                    className="group relative bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border-zinc-800/50 hover:border-zinc-700/70 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Card Number Badge */}
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-xs font-bold text-zinc-400 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 group-hover:text-purple-300 transition-all duration-300">
                      {index + 1}
                    </div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none" />
                    
                    <CardHeader className="px-5 pt-4 pb-2 relative z-10">
                      <div className="flex items-center justify-end">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 relative z-20">
                          <EditCardDialog
                            cardId={card.id}
                            deckId={deck.id}
                            currentFront={card.front}
                            currentBack={card.back}
                            trigger={
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-all duration-200"
                                title="Edit card"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </Button>
                            }
                          />
                          <DeleteCardButton cardId={card.id} deckId={deck.id} />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="px-5 pb-5 space-y-4 relative z-10">
                      {/* Front Side */}
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                            Question
                          </span>
                        </div>
                        <div className="bg-zinc-800/30 rounded-xl p-4 min-h-[80px] border border-zinc-700/30 group-hover:border-zinc-600/50 transition-colors duration-300">
                          <p className="text-white leading-relaxed whitespace-pre-wrap text-sm">
                            {card.front}
                          </p>
                        </div>
                      </div>
                      
                      {/* Divider */}
                      <div className="flex items-center gap-3 py-1">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
                        <div className="w-6 h-6 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center group-hover:border-purple-500/30 transition-colors duration-300">
                          <svg className="w-3 h-3 text-zinc-500 group-hover:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
                      </div>
                      
                      {/* Back Side */}
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                            Answer
                          </span>
                        </div>
                        <div className="bg-zinc-800/30 rounded-xl p-4 min-h-[80px] border border-zinc-700/30 group-hover:border-zinc-600/50 transition-colors duration-300">
                          <p className="text-white leading-relaxed whitespace-pre-wrap text-sm">
                            {card.back}
                          </p>
                        </div>
                      </div>
                      
                      {/* Card Footer */}
                      <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between">
                        <p className="text-xs text-zinc-600">
                          Added {new Date(card.createdAt).toLocaleDateString()}
                        </p>
                        <div className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-emerald-500 transition-colors duration-500" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}