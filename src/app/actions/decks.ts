"use server";

import { auth } from "@clerk/nextjs/server";
import { createDeck as createDeckQuery, updateDeck as updateDeckQuery, deleteDeck as deleteDeckQuery } from "@/db/queries/decks";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Define Zod schema for create
const createDeckSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().max(5000, "Description is too long").optional(),
});

// Define TypeScript type from Zod schema
type CreateDeckInput = z.infer<typeof createDeckSchema>;

/**
 * Server action to create a new deck
 */
export async function createDeck(input: CreateDeckInput) {
  const { userId, has } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check if user has unlimited decks feature
  const hasUnlimitedDecks = has({ feature: "unlimited_decks" });

  // If user doesn't have unlimited decks, check deck count
  if (!hasUnlimitedDecks) {
    const { getUserDecks } = await import("@/db/queries/decks");
    const currentDecks = await getUserDecks(userId);
    
    if (currentDecks.length >= 3) {
      throw new Error(
        "You have reached the maximum number of decks (3). Upgrade to Pro for unlimited decks."
      );
    }
  }

  // Validate input with Zod
  const validatedInput = createDeckSchema.parse(input);

  // Use mutation function from db/queries
  const newDeck = await createDeckQuery({
    userId,
    name: validatedInput.name,
    description: validatedInput.description,
  });

  // Revalidate the dashboard to show the new deck
  revalidatePath("/dashboard");

  return newDeck;
}

// Define Zod schema for update
const updateDeckSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Name is required").max(255, "Name is too long").optional(),
  description: z.string().max(5000, "Description is too long").optional(),
});

// Define TypeScript type from Zod schema
type UpdateDeckInput = z.infer<typeof updateDeckSchema>;

/**
 * Server action to update a deck
 */
export async function updateDeck(input: UpdateDeckInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Validate input with Zod
  const validatedInput = updateDeckSchema.parse(input);

  // Use mutation function from db/queries
  const updatedDeck = await updateDeckQuery({
    id: validatedInput.id,
    userId,
    name: validatedInput.name,
    description: validatedInput.description,
  });

  // Revalidate the deck page to show the updated deck
  revalidatePath(`/decks/${validatedInput.id}`);
  revalidatePath("/dashboard");

  return updatedDeck;
}

// Define Zod schema for delete
const deleteDeckSchema = z.object({
  id: z.number().int().positive(),
});

// Define TypeScript type from Zod schema
type DeleteDeckInput = z.infer<typeof deleteDeckSchema>;

/**
 * Server action to delete a deck
 */
export async function deleteDeck(input: DeleteDeckInput) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Validate input with Zod
  const validatedInput = deleteDeckSchema.parse(input);

  // Use mutation function from db/queries
  await deleteDeckQuery({
    id: validatedInput.id,
    userId,
  });

  // Revalidate the dashboard to remove the deleted deck
  revalidatePath("/dashboard");
  revalidatePath(`/decks/${validatedInput.id}`);
}


