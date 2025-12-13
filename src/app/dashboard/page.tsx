import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserDecksWithCardCounts } from "@/db/queries/decks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  description:
    "Manage your flashcard decks on FlashyCardy. View, create, and organize your study materials in one place.",
  keywords: [
    "dashboard",
    "flashcards",
    "decks",
    "study",
    "learning",
    "manage flashcards",
  ],
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

  const decks = await getUserDecksWithCardCounts(userId);

  const hasUnlimitedDecks = has({ feature: "unlimited_decks" });
  const isDeckLimitReached = !hasUnlimitedDecks && decks.length >= 3;

  const baseUrl = getBaseUrl();
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dashboard",
    description: "Manage your flashcard decks and organize your study materials",
    url: `${baseUrl}/dashboard`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: decks.length,
      itemListElement: decks
        .map((deck, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: deck.name,
          description: deck.description || undefined,
        }))
        .filter((item) => item.name),
    },
  };

  // Optional: only show the explicit 4242… number if you KNOW you're in Stripe test mode
  // If you don't have this env var, this will be false and we’ll keep safer wording.
  const isStripeTestMode = process.env.NEXT_PUBLIC_STRIPE_MODE === "test";

  return (
    <>
      <SchemaMarkup schema={collectionPageSchema} />
      <WelcomeModal />

      <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-zinc-400">
                Manage your flashcard decks
                {!hasUnlimitedDecks && (
                  <span data-testid="deck-count" className="ml-2 text-zinc-500">
                    ({decks.length}/3 decks)
                  </span>
                )}
              </p>
            </div>

            {isDeckLimitReached ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 w-full sm:w-auto">
                <Button
                  data-testid="create-deck-trigger"
                  disabled
                  className="bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed w-full sm:w-auto"
                >
                  Create Deck
                </Button>
                <Link href="/pricing" className="w-full sm:w-auto">
                  <Button
                    data-testid="upgrade-cta"
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
                  <Button
                    data-testid="create-deck-trigger"
                    className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 w-full sm:w-auto"
                  >
                    Create Deck
                  </Button>
                }
              />
            )}
          </div>

          {/* Just In Time demo banner (Free vs Pro copy) */}
          <Card className="mb-6 border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-zinc-900/60 to-purple-500/10">
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/25">
                    <svg
                      className="h-5 w-5 text-emerald-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <div className="text-emerald-300 text-xs font-semibold tracking-widest">
                      JUST IN TIME • CURSOR DEMO
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl leading-tight">
                      Built by Just In Time in Cursor — auth, payments, and AI in
                      one demo
                    </CardTitle>
                    <CardDescription className="text-zinc-200 text-sm sm:text-base leading-relaxed">
                      FlashyCardy is a demo app we use to show what Cursor can
                      build fast: Clerk authentication, Stripe
                      subscriptions/payments, and AI-powered flashcard
                      generation.
                    </CardDescription>
                  </div>
                </div>

                {/* CTA column (fix overflow/cutoff) */}
                <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[280px]">
                  <CreateDeckDialog
                    trigger={
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                        Create your first deck
                      </Button>
                    }
                  />

                  {!hasUnlimitedDecks && (
                    <Link href="/pricing" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/15 text-white font-semibold px-5 sm:px-6 py-2.5 h-auto min-h-[3.25rem] text-sm sm:text-base leading-snug whitespace-normal break-words text-center"
                      >
                        Unlock AI (Use demo card in test mode)
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {!hasUnlimitedDecks ? (
                <>
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
                    <p className="font-semibold text-amber-300 mb-1">
                      Use a demo card to test checkout (Stripe test mode)
                    </p>
                    <p className="text-sm text-zinc-100/90 leading-relaxed">
                      {isStripeTestMode ? (
                        <>
                          To unlock Pro and test AI generation, complete checkout
                          with a test card (e.g. <strong>4242 4242 4242 4242</strong>
                          , any future date, any CVC). No real charge in test
                          mode.
                        </>
                      ) : (
                        <>
                          To unlock Pro and test AI generation, complete checkout
                          using a demo/test card in Stripe test mode (no real
                          charge in test mode).
                        </>
                      )}
                    </p>
                  </div>

                  <div className="text-zinc-200 text-sm sm:text-base">
                    <p className="font-bold text-white mb-2">
                      Try it in 60 seconds:
                    </p>
                    <ol className="list-decimal ml-5 space-y-1">
                      <li>
                        Create a deck (examples:{" "}
                        <span className="text-zinc-100">
                          “Marketing Funnels”, “React Hooks”, “Hebrew
                          Vocabulary”
                        </span>
                        ).
                      </li>
                      <li>Add a short description of what you want to learn.</li>
                      <li>
                        Open the deck and click{" "}
                        <span className="text-zinc-100 font-semibold">
                          Generate cards with AI
                        </span>
                        . Free users will be prompted to unlock Pro (use the demo
                        card in test mode).
                      </li>
                    </ol>
                  </div>
                </>
              ) : (
                <div className="text-zinc-200 text-sm sm:text-base">
                  <p className="font-bold text-white mb-2">Quick Pro flow:</p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Create a deck about a topic you want to learn.</li>
                    <li>
                      Open the deck and click{" "}
                      <span className="text-zinc-100 font-semibold">
                        Generate cards with AI
                      </span>
                      .
                    </li>
                    <li>Study the deck and iterate.</li>
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main content */}
          {decks.length === 0 ? (
            <>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>No decks yet</CardTitle>
                  <CardDescription>
                    Get started by creating your first flashcard deck
                  </CardDescription>
                </CardHeader>
              </Card>

              {!hasUnlimitedDecks && (
                <Card className="mt-6 bg-gradient-to-r from-zinc-900 to-zinc-900 border-zinc-800 border-2">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          Upgrade to Pro
                        </CardTitle>
                        <CardDescription className="text-zinc-400 text-base">
                          Unlock the full potential of FlashyCardy
                        </CardDescription>
                        <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span>
                              <strong>Unlimited decks</strong>
                              <span className="text-zinc-500">
                                {" "}
                                (currently limited to 3)
                              </span>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span>AI-powered card generation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span>Priority support</span>
                          </li>
                        </ul>
                      </div>
                      <div className="sm:ml-4">
                        <Link href="/pricing">
                          <Button className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 w-full sm:w-auto">
                            View Pricing
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map((deck) => (
                  <Card
                    key={deck.id}
                    className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col h-full"
                  >
                    <CardHeader className="flex-1">
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
                          <span className="text-sm text-zinc-400 mt-2 block">
                            {deck.cardCount}{" "}
                            {deck.cardCount === 1 ? "card" : "cards"}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="mt-auto">
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
                                data-testid="edit-deck-button"
                                data-deck-id={deck.id}
                                variant="ghost"
                                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                                title="Edit deck"
                              >
                                Edit
                              </Button>
                            }
                          />
                          <DeleteDeckButton deckId={deck.id} deckName={deck.name} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!hasUnlimitedDecks && (
                <Card
                  className={`mt-6 bg-gradient-to-r ${
                    isDeckLimitReached
                      ? "from-amber-900/20 to-orange-900/20 border-amber-800/50"
                      : "from-zinc-900 to-zinc-900 border-zinc-800"
                  } border-2`}
                >
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {isDeckLimitReached ? (
                            <span className="text-amber-400">
                              You've reached your free limit!
                            </span>
                          ) : (
                            "Upgrade to Pro"
                          )}
                        </CardTitle>
                        <CardDescription className="text-zinc-400 text-base">
                          Unlock the full potential of FlashyCardy
                        </CardDescription>
                        <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span>
                              <strong>Unlimited decks</strong>
                              {!isDeckLimitReached && (
                                <span className="text-zinc-500">
                                  {" "}
                                  (currently limited to 3)
                                </span>
                              )}
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span>AI-powered card generation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span>Priority support</span>
                          </li>
                        </ul>
                      </div>
                      <div className="sm:ml-4">
                        <Link href="/pricing">
                          <Button
                            className={`${
                              isDeckLimitReached
                                ? "bg-amber-600 hover:bg-amber-700 text-white"
                                : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                            } w-full sm:w-auto`}
                          >
                            View Pricing
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
