/**
 * Validates that deck metadata (title and description) are meaningful and not placeholders.
 * 
 * @example
 * ✅ Valid: "Spanish Vocabulary" + "Learn common Spanish words and phrases for travel."
 * ❌ Invalid: "Fourth Deck" + "..."
 * ❌ Invalid: "Deck 3" + "test"
 * ✅ Valid: "AWS" + "Key AWS services and what they do."
 */

/**
 * Placeholder titles that should be rejected (case-insensitive)
 */
const PLACEHOLDER_TITLES = [
  "deck",
  "new deck",
  "untitled",
  "test",
  "example",
  "sample",
  "demo",
  "practice",
  "my deck",
  "asdf",
  "aaa",
];

/**
 * Placeholder descriptions that should be rejected (case-insensitive)
 */
const PLACEHOLDER_DESCRIPTIONS = [
  "test",
  "lorem ipsum",
  "...",
  "tbd",
  "add description",
  "description",
  "none",
];

/**
 * Normalizes a string: trims, lowercases, and collapses multiple spaces
 */
function normalizeString(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Checks if a title matches placeholder patterns like "Deck 4", "4th deck", "Deck #4", etc.
 */
function isPlaceholderTitlePattern(title: string): boolean {
  const normalized = normalizeString(title);
  
  // Patterns: "deck 4", "deck #4", "deck-4", "4th deck", "fourth deck", "deck four"
  const patterns = [
    /^deck\s*#?\s*\d+$/,           // "deck 4", "deck #4", "deck4"
    /^\d+(st|nd|rd|th)\s+deck$/,   // "4th deck", "1st deck"
    /^deck\s+\d+$/,                 // "deck 4"
    /^deck\s*-\s*\d+$/,             // "deck-4"
    /^(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+deck$/, // "fourth deck"
    /^deck\s+(one|two|three|four|five|six|seven|eight|nine|ten)$/, // "deck four"
  ];
  
  return patterns.some(pattern => pattern.test(normalized));
}

/**
 * Checks if a description is a single word/token
 */
function isSingleToken(str: string): boolean {
  const trimmed = str.trim();
  return trimmed.split(/\s+/).length === 1;
}

/**
 * Validates if deck metadata is meaningful (not a placeholder)
 * 
 * @param title - Deck title
 * @param description - Deck description (can be null or undefined)
 * @returns true if both title and description are meaningful
 */
export function isMeaningfulDeckMetadata(
  title: string,
  description: string | null | undefined
): boolean {
  return getDeckMetadataIssue(title, description) === null;
}

/**
 * Gets a user-friendly error message if deck metadata is invalid, or null if valid
 * 
 * @param title - Deck title
 * @param description - Deck description (can be null or undefined)
 * @returns Error message string if invalid, null if valid
 */
export function getDeckMetadataIssue(
  title: string,
  description: string | null | undefined
): string | null {
  // Normalize title
  const normalizedTitle = normalizeString(title);
  
  // Check title length
  if (normalizedTitle.length < 3) {
    return "Deck title must be at least 3 characters long.";
  }
  
  // Check if title is a placeholder
  if (PLACEHOLDER_TITLES.includes(normalizedTitle)) {
    return "Deck title cannot be a placeholder like 'Deck' or 'Test'.";
  }
  
  // Check if title matches placeholder patterns
  if (isPlaceholderTitlePattern(title)) {
    return "Deck title cannot be a generic pattern like 'Deck 4' or 'Fourth Deck'.";
  }
  
  // Check description exists
  if (!description || typeof description !== "string") {
    return "Deck description is required for AI generation.";
  }
  
  // Normalize description
  const normalizedDescription = normalizeString(description);
  
  // Check description length
  if (normalizedDescription.length < 12) {
    return "Deck description must be at least 12 characters long.";
  }
  
  // Check if description is a placeholder
  if (PLACEHOLDER_DESCRIPTIONS.includes(normalizedDescription)) {
    return "Deck description cannot be a placeholder like 'test' or '...'.";
  }
  
  // Check if description is a single token (unless it's long enough and not a placeholder)
  if (isSingleToken(description) && normalizedDescription.length < 12) {
    return "Deck description must be more than a single word.";
  }
  
  // All checks passed
  return null;
}

