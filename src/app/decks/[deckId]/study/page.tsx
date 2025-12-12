import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getDeckWithCards } from "@/db/queries/decks";
import type { Metadata } from "next";
import { SchemaMarkup } from "@/components/schema-markup";
import { getBaseUrl } from "@/lib/seo";
import { StudyFlashcard } from "@/components/study-flashcard";

type Props = {
  params: Promise<{ deckId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await auth();
  
  if (!userId) {
    return {
      title: "Study Deck | FlashyCardy",
      description: "Study your flashcard deck",
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
    title: `Study ${deck.name} | FlashyCardy`,
    description: `Study ${deck.cards.length} flashcards in ${deck.name}`,
    keywords: ["flashcards", "study", "learning", "deck", deck.name],
    openGraph: {
      title: `Study ${deck.name} | FlashyCardy`,
      description: `Study ${deck.cards.length} flashcards`,
      type: "website",
      siteName: "FlashyCardy",
    },
    twitter: {
      card: "summary",
      title: `Study ${deck.name} | FlashyCardy`,
      description: `Study ${deck.cards.length} flashcards`,
    },
  };
}

export default async function StudyPage({ params }: Props) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  const { deckId } = await params;
  const deckIdNum = parseInt(deckId, 10);
  
  if (isNaN(deckIdNum)) {
    notFound();
  }

  // Fetch deck with cards using query function
  const deck = await getDeckWithCards(deckIdNum, userId);

  if (!deck) {
    notFound();
  }

  if (deck.cards.length === 0) {
    redirect(`/decks/${deck.id}`);
  }

  const baseUrl = getBaseUrl();
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Study ${deck.name}`,
    "description": `Study ${deck.cards.length} flashcards in ${deck.name}`,
    "url": `${baseUrl}/decks/${deck.id}/study`,
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
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-8">
            <Link 
              href={`/decks/${deck.id}`}
              className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-4"
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
              Back to Deck
            </Link>
            
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                {deck.name}
              </h1>
              {deck.description && (
                <p className="text-sm sm:text-base text-zinc-400">{deck.description}</p>
              )}
            </div>
          </div>

          {/* Study Flashcard Component */}
          <StudyFlashcard cards={deck.cards} deckName={deck.name} />
        </div>
      </div>
    </>
  );
}

