import { db } from "@/db";
import { decksTable, cardsTable } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { sql } from "drizzle-orm";

/**
 * Get all decks for a specific user, ordered by creation date (newest first)
 */
export async function getUserDecks(userId: string) {
  return await db.select()
    .from(decksTable)
    .where(eq(decksTable.userId, userId))
    .orderBy(desc(decksTable.createdAt));
}

/**
 * Get all decks for a specific user with card counts, ordered by creation date (newest first)
 */
export async function getUserDecksWithCardCounts(userId: string) {
  const decks = await db.query.decksTable.findMany({
    where: eq(decksTable.userId, userId),
    orderBy: (decks, { desc }) => [desc(decks.createdAt)],
    with: {
      cards: true,
    },
  });

  // Map decks to include card count
  return decks.map(deck => ({
    ...deck,
    cardCount: deck.cards.length,
  }));
}

/**
 * Get a specific deck by ID, verifying it belongs to the user
 */
export async function getDeckById(deckId: number, userId: string) {
  const [deck] = await db.select()
    .from(decksTable)
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ))
    .limit(1);
  
  return deck || null;
}

/**
 * Get a deck with all its cards, verifying it belongs to the user
 */
export async function getDeckWithCards(deckId: number, userId: string) {
  const deck = await db.query.decksTable.findFirst({
    where: and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ),
    with: {
      cards: {
        orderBy: (cards, { desc }) => [desc(cards.updatedAt)],
      },
    },
  });

  return deck || null;
}

type CreateDeckParams = {
  userId: string;
  name: string;
  description?: string;
};

/**
 * Create a new deck for a user
 */
export async function createDeck(params: CreateDeckParams) {
  const [newDeck] = await db.insert(decksTable).values({
    userId: params.userId,
    name: params.name,
    description: params.description,
  }).returning();
  
  return newDeck;
}

type UpdateDeckParams = {
  id: number;
  userId: string;
  name?: string;
  description?: string;
};

/**
 * Update a deck, verifying it belongs to the user
 */
export async function updateDeck(params: UpdateDeckParams) {
  // Verify ownership before update
  const existing = await db.select()
    .from(decksTable)
    .where(and(
      eq(decksTable.id, params.id),
      eq(decksTable.userId, params.userId)
    ))
    .limit(1);
  
  if (existing.length === 0) {
    throw new Error('Deck not found or access denied');
  }
  
  // Update database
  const [updatedDeck] = await db.update(decksTable)
    .set({
      ...(params.name && { name: params.name }),
      ...(params.description !== undefined && { description: params.description }),
      updatedAt: new Date(),
    })
    .where(and(
      eq(decksTable.id, params.id),
      eq(decksTable.userId, params.userId)
    ))
    .returning();
  
  return updatedDeck;
}

type DeleteDeckParams = {
  id: number;
  userId: string;
};

/**
 * Delete a deck, verifying it belongs to the user
 */
export async function deleteDeck(params: DeleteDeckParams) {
  // Verify ownership before delete
  const existing = await db.select()
    .from(decksTable)
    .where(and(
      eq(decksTable.id, params.id),
      eq(decksTable.userId, params.userId)
    ))
    .limit(1);
  
  if (existing.length === 0) {
    throw new Error('Deck not found or access denied');
  }
  
  // Delete from database (cards will be deleted automatically due to cascade)
  await db.delete(decksTable)
    .where(and(
      eq(decksTable.id, params.id),
      eq(decksTable.userId, params.userId)
    ));
}

