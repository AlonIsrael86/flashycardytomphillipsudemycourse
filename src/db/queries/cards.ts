import { db } from "@/db";
import { cardsTable, decksTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

type CreateCardParams = {
  deckId: number;
  front: string;
  back: string;
  userId: string;
};

/**
 * Create a new card in a deck, verifying the deck belongs to the user
 */
export async function createCard(params: CreateCardParams) {
  // Verify deck ownership before creating card
  const deck = await db.select()
    .from(decksTable)
    .where(and(
      eq(decksTable.id, params.deckId),
      eq(decksTable.userId, params.userId)
    ))
    .limit(1);

  if (deck.length === 0) {
    throw new Error("Deck not found or access denied");
  }

  // Create the card
  const [newCard] = await db.insert(cardsTable).values({
    deckId: params.deckId,
    front: params.front,
    back: params.back,
  }).returning();

  return newCard;
}

type CreateCardsBulkParams = {
  deckId: number;
  cards: Array<{ front: string; back: string }>;
  userId: string;
};

/**
 * Create multiple cards in a deck in a single operation, verifying the deck belongs to the user
 */
export async function createCardsBulk(params: CreateCardsBulkParams) {
  // Verify deck ownership before creating cards
  const deck = await db.select()
    .from(decksTable)
    .where(and(
      eq(decksTable.id, params.deckId),
      eq(decksTable.userId, params.userId)
    ))
    .limit(1);

  if (deck.length === 0) {
    throw new Error("Deck not found or access denied");
  }

  // Create all cards in a single insert operation
  const newCards = await db.insert(cardsTable).values(
    params.cards.map(card => ({
      deckId: params.deckId,
      front: card.front.trim(),
      back: card.back.trim(),
    }))
  ).returning();

  return newCards;
}

type DeleteCardParams = {
  cardId: number;
  userId: string;
};

/**
 * Delete a card, verifying the deck it belongs to is owned by the user
 */
export async function deleteCard(params: DeleteCardParams) {
  // First, get the card to find its deck
  const card = await db.select()
    .from(cardsTable)
    .where(eq(cardsTable.id, params.cardId))
    .limit(1);

  if (card.length === 0) {
    throw new Error("Card not found");
  }

  // Verify deck ownership before deleting card
  const deck = await db.select()
    .from(decksTable)
    .where(and(
      eq(decksTable.id, card[0].deckId),
      eq(decksTable.userId, params.userId)
    ))
    .limit(1);

  if (deck.length === 0) {
    throw new Error("Deck not found or access denied");
  }

  // Delete the card
  await db.delete(cardsTable)
    .where(eq(cardsTable.id, params.cardId));
}

type UpdateCardParams = {
  cardId: number;
  front: string;
  back: string;
  userId: string;
};

/**
 * Update a card, verifying the deck it belongs to is owned by the user
 */
export async function updateCard(params: UpdateCardParams) {
  // First, get the card to find its deck
  const card = await db.select()
    .from(cardsTable)
    .where(eq(cardsTable.id, params.cardId))
    .limit(1);

  if (card.length === 0) {
    throw new Error("Card not found");
  }

  // Verify deck ownership before updating card
  const deck = await db.select()
    .from(decksTable)
    .where(and(
      eq(decksTable.id, card[0].deckId),
      eq(decksTable.userId, params.userId)
    ))
    .limit(1);

  if (deck.length === 0) {
    throw new Error("Deck not found or access denied");
  }

  // Update the card
  const [updatedCard] = await db.update(cardsTable)
    .set({
      front: params.front,
      back: params.back,
      updatedAt: new Date(),
    })
    .where(eq(cardsTable.id, params.cardId))
    .returning();

  return updatedCard;
}

