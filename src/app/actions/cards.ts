"use server";

import { auth } from "@clerk/nextjs/server";
import { createCard as createCardQuery, deleteCard as deleteCardQuery, updateCard as updateCardQuery, createCardsBulk } from "@/db/queries/cards";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { getDeckMetadataIssue } from "@/lib/deck-validation";
import { flashcardSchema, flashcardsArrayOfLength } from "@/lib/ai/schemas";

// Define Zod schema
const createCardSchema = z.object({
  deckId: z.number().int().positive(),
  front: z.string().min(1, "Front text is required").max(5000, "Front text is too long"),
  back: z.string().min(1, "Back text is required").max(5000, "Back text is too long"),
});

// Define TypeScript type from Zod schema
type CreateCardInput = z.infer<typeof createCardSchema>;

/**
 * Server action to create a new card
 */
export async function createCard(input: CreateCardInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Validate input with Zod
  const validatedInput = createCardSchema.parse(input);

  // Use mutation function from db/queries
  const newCard = await createCardQuery({
    deckId: validatedInput.deckId,
    front: validatedInput.front,
    back: validatedInput.back,
    userId,
  });

  // Revalidate the deck page to show the new card
  revalidatePath(`/decks/${validatedInput.deckId}`);

  return newCard;
}

// Define Zod schema for delete
const deleteCardSchema = z.object({
  cardId: z.number().int().positive(),
  deckId: z.number().int().positive(),
});

// Define TypeScript type from Zod schema
type DeleteCardInput = z.infer<typeof deleteCardSchema>;

/**
 * Server action to delete a card
 */
export async function deleteCard(input: DeleteCardInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Validate input with Zod
  const validatedInput = deleteCardSchema.parse(input);

  // Use mutation function from db/queries
  await deleteCardQuery({
    cardId: validatedInput.cardId,
    userId,
  });

  // Revalidate the deck page to reflect the deletion
  revalidatePath(`/decks/${validatedInput.deckId}`);
}

// Define Zod schema for update
const updateCardSchema = z.object({
  cardId: z.number().int().positive(),
  deckId: z.number().int().positive(),
  front: z.string().min(1, "Front text is required").max(5000, "Front text is too long"),
  back: z.string().min(1, "Back text is required").max(5000, "Back text is too long"),
});

// Define TypeScript type from Zod schema
type UpdateCardInput = z.infer<typeof updateCardSchema>;

/**
 * Server action to update a card
 */
export async function updateCard(input: UpdateCardInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Validate input with Zod
  const validatedInput = updateCardSchema.parse(input);

  // Use mutation function from db/queries
  const updatedCard = await updateCardQuery({
    cardId: validatedInput.cardId,
    front: validatedInput.front,
    back: validatedInput.back,
    userId,
  });

  // Revalidate the deck page to show the updated card
  revalidatePath(`/decks/${validatedInput.deckId}`);

  return updatedCard;
}

// Define Zod schema for AI generation
const generateAICardsSchema = z.object({
  deckId: z.number().int().positive(),
  cardCount: z.number().int().min(1).max(4).default(4),
});

// Define TypeScript type from Zod schema
type GenerateAICardsInput = z.infer<typeof generateAICardsSchema>;

/**
 * Server action to generate AI cards for a deck
 */
export async function generateAICards(input: GenerateAICardsInput) {
  const { userId, has } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check if user has AI generation feature
  const hasAIGeneration = has({ feature: "ai_flashcard_generation" });
  
  if (!hasAIGeneration) {
    throw new Error("AI flashcard generation is only available for Pro users. Please upgrade to access this feature.");
  }

  // Validate input with Zod
  const validatedInput = generateAICardsSchema.parse(input);

  // Get deck information
  const { getDeckById } = await import("@/db/queries/decks");
  const deck = await getDeckById(validatedInput.deckId, userId);

  if (!deck) {
    throw new Error("Deck not found or access denied");
  }

  // Validate deck metadata is meaningful (hard enforcement - never call OpenAI if invalid)
  const metadataIssue = getDeckMetadataIssue(deck.name, deck.description);
  if (metadataIssue) {
    throw new Error(`To generate cards with AI, update the deck title and description to be specific (not placeholders like 'Fourth Deck'). ${metadataIssue}`);
  }

  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("AI generation is not configured. Please contact support.");
  }

  const cardCount = validatedInput.cardCount || 4;
  const prompt = `Generate exactly ${cardCount} high-quality flashcard pair${cardCount === 1 ? '' : 's'} based on the following deck information:

Deck Title: ${deck.name}
Deck Description: ${deck.description || "No description provided"}

For each flashcard, create a question on the front and a comprehensive answer on the back. The flashcards should be educational, clear, and directly related to the deck topic.

Make sure to return exactly ${cardCount} card${cardCount === 1 ? '' : 's'}.`;

  try {
    // Generate AI cards using Vercel AI SDK with structured output
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      output: "array",
      schema: flashcardSchema,
      prompt: [
        `You are a helpful assistant that creates educational flashcards.`,
        `Generate exactly ${cardCount} flashcard${cardCount === 1 ? '' : 's'} based on the following deck information:`,
        ``,
        `Deck Title: ${deck.name}`,
        `Deck Description: ${deck.description || "No description provided"}`,
        ``,
        `For each flashcard, create a question on the front and a comprehensive answer on the back.`,
        `The flashcards should be educational, clear, and directly related to the deck topic.`,
        `Return exactly ${cardCount} flashcard${cardCount === 1 ? '' : 's'}.`,
      ].join("\n"),
      temperature: 0.7,
    });

    // Validate the returned array strictly equals cardCount
    const validatedCards = flashcardsArrayOfLength(cardCount).parse(object);

    // Create all cards in the database using bulk insert
    const createdCards = await createCardsBulk({
      deckId: validatedInput.deckId,
      cards: validatedCards,
      userId,
    });

    // Revalidate the deck page to show the new cards
    revalidatePath(`/decks/${validatedInput.deckId}`);

    return { success: true, cardsCreated: createdCards.length };
  } catch (error) {
    console.error("Error generating AI cards:", error);
    throw new Error("Failed to generate AI cards. Please try again.");
  }
}

