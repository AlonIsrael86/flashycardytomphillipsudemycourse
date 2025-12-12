import { z } from "zod";

/**
 * Schema for a single flashcard
 */
export const flashcardSchema = z.object({
  front: z.string().min(1).max(5000),
  back: z.string().min(1).max(5000),
});

/**
 * Helper function to create an array schema for a specific number of flashcards
 * @param count - The exact number of flashcards expected (1-4)
 * @returns A Zod array schema that validates exactly `count` flashcards
 */
export function flashcardsArrayOfLength(count: number) {
  return z.array(flashcardSchema).length(count);
}

