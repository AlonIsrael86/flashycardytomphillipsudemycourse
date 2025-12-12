import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserDecks } from "@/db/queries/decks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { SchemaMarkup } from "@/components/schema-markup";
import { getBaseUrl } from "@/lib/seo";
import { CreateDeckDialog } from "@/components/create-deck-dialog";
import { EditDeckDialog } from "@/components/edit-deck-dialog";
import { DeleteDeckButton } from "@/components/delete-deck-button";
import { WelcomeModal } from "@/components/welcome-modal";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your flashcard decks on FlashyCardy. View, create, and organize your study materials in one place.",
  keywords: ["dashboard", "flashcards", "decks", "study", "learning", "manage flashcards"],
  openGraph: {
    title: "Dashboard | FlashyCardy",
    description: "Manage your flashcard decks and organize your study materials.",
    type: "website",
    siteName: "FlashyCardy",
  },
  twitter: {
    card: "summary",
    title: "Dashboard | FlashyCardy",
    description: "Manage your flashcard decks and organize your study materials.",
  },
};

export default async function DashboardPage() {
  const { userId, has } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  // Fetch user's decks using query function
  const decks = await getUserDecks(userId);

  // Check if user has unlimited decks feature
  const hasUnlimitedDecks = has({ feature: "unlimited_decks" });
  
  // Check if free user has reached the 3 deck limit
  const isDeckLimitReached = !hasUnlimitedDecks && decks.length >= 3;

  const baseUrl = getBaseUrl();
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Dashboard",
    "description": "Manage your flashcard decks and organize your study materials",
    "url": `${baseUrl}/dashboard`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": decks.length,
      "itemListElement": decks.map((deck, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": deck.name,
        "description": deck.description || undefined,
      })).filter(item => item.name),
    }
  };

  return (
    <>
      <SchemaMarkup schema={collectionPageSchema} />
      <WelcomeModal />
      <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-sm sm:text-base text-zinc-400">
                Manage your flashcard decks
                {!hasUnlimitedDecks && (
                  <span className="ml-2 text-zinc-500">
                    ({decks.length}/3 decks)
                  </span>
                )}
              </p>
            </div>
            {isDeckLimitReached ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 w-full sm:w-auto">
                <Button
                  disabled
                  className="bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed w-full sm:w-auto"
                >
                  Create Deck
                </Button>
                <Link href="/pricing" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-sm w-full sm:w-auto"
                  >
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            ) : (
              <CreateDeckDialog
                trigger={
                  <Button className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 w-full sm:w-auto">
                    Create Deck
                  </Button>
                }
              />
            )}
          </div>

          {decks.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>No decks yet</CardTitle>
                <CardDescription>
                  Get started by creating your first flashcard deck
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decks.map((deck) => (
                <Card
                  key={deck.id}
                  className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link
                          href={`/decks/${deck.id}`}
                          className="group block focus:outline-none"
                          prefetch={false}
                        >
                          <CardTitle className="group-hover:text-zinc-300 transition-colors">
                            {deck.name}
                          </CardTitle>
                          {deck.description && (
                            <CardDescription className="mt-2">
                              {deck.description}
                            </CardDescription>
                          )}
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-400">
                        Updated {new Date(deck.updatedAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <EditDeckDialog
                          deckId={deck.id}
                          currentName={deck.name}
                          currentDescription={deck.description}
                          trigger={
                            <Button
                              variant="ghost"
                              className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                              title="Edit deck"
                            >
                              Edit
                            </Button>
                          }
                        />
                        <DeleteDeckButton
                          deckId={deck.id}
                          deckName={deck.name}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
