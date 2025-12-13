import { test, expect } from '@playwright/test';
import { signUp } from './helpers/test-utils';

test.describe('Study Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Sign up and create a deck with cards
    await page.goto('/');
    await signUp(page);
    await expect(page).toHaveURL(/\/dashboard/);

    // Create a deck
    await page.getByTestId('create-deck-trigger').click();
    await page.getByTestId('deck-name-input').fill('Study Deck');
    await page.getByTestId('create-deck-submit').click();
    await page.waitForTimeout(1000);

    // Open the deck
    await page.locator('a[href*="/decks/"]').first().click();
    await page.waitForURL(/\/decks\/\d+/, { timeout: 10000 });

    // Add cards to the deck
    await page.getByTestId('add-card-trigger').click();
    await page.getByTestId('card-front-input').fill('Card 1 Front');
    await page.getByTestId('card-back-input').fill('Card 1 Back');
    await page.getByTestId('create-card-submit').click();
    await page.waitForTimeout(1000);

    await page.getByTestId('add-card-trigger').click();
    await page.getByTestId('card-front-input').fill('Card 2 Front');
    await page.getByTestId('card-back-input').fill('Card 2 Back');
    await page.getByTestId('create-card-submit').click();
    await page.waitForTimeout(1000);

    // Navigate to study mode
    await page.getByTestId('study-deck-button').click();
    await page.waitForURL(/\/decks\/\d+\/study/, { timeout: 10000 });
  });

  test('should display flashcard in study mode', async ({ page }) => {
    // Verify flashcard is visible
    const flashcard = page.getByTestId('study-flashcard');
    await expect(flashcard).toBeVisible();

    // Verify front side is shown initially
    await expect(flashcard).toContainText('Card 1 Front');
  });

  test('should flip card to show back', async ({ page }) => {
    const flashcard = page.getByTestId('study-flashcard');
    
    // Initially should show front
    await expect(flashcard).toContainText('Card 1 Front');
    await expect(flashcard).not.toContainText('Card 1 Back');

    // Click flip button or card itself
    await page.getByTestId('study-flip-button').click();
    await page.waitForTimeout(500); // Wait for flip animation

    // Should now show back
    await expect(flashcard).toContainText('Card 1 Back');
  });

  test('should navigate to next card', async ({ page }) => {
    const nextButton = page.getByTestId('study-next-button');
    
    // Should be enabled (not on last card yet)
    await expect(nextButton).toBeEnabled();

    // Click next
    await nextButton.click();
    await page.waitForTimeout(500);

    // Should show second card
    const flashcard = page.getByTestId('study-flashcard');
    await expect(flashcard).toContainText('Card 2 Front');

    // Next button should now be disabled (on last card)
    await expect(nextButton).toBeDisabled();
  });

  test('should navigate to previous card', async ({ page }) => {
    const previousButton = page.getByTestId('study-previous-button');
    const nextButton = page.getByTestId('study-next-button');

    // Previous should be disabled on first card
    await expect(previousButton).toBeDisabled();

    // Navigate to second card first
    await nextButton.click();
    await page.waitForTimeout(500);

    // Previous should now be enabled
    await expect(previousButton).toBeEnabled();

    // Click previous
    await previousButton.click();
    await page.waitForTimeout(500);

    // Should show first card again
    const flashcard = page.getByTestId('study-flashcard');
    await expect(flashcard).toContainText('Card 1 Front');
  });

  test('should show progress indicator', async ({ page }) => {
    // Progress should be visible
    // The progress text typically shows "X of Y cards viewed"
    const progressText = page.locator('text=/\\d+ of \\d+ cards viewed/');
    await expect(progressText).toBeVisible();

    // Initially should show 1 of 2
    await expect(progressText).toContainText('1 of 2');
  });

  test('should complete study session with all cards', async ({ page }) => {
    const nextButton = page.getByTestId('study-next-button');
    const flashcard = page.getByTestId('study-flashcard');

    // View first card
    await expect(flashcard).toContainText('Card 1 Front');

    // Navigate to second card
    await nextButton.click();
    await page.waitForTimeout(500);
    await expect(flashcard).toContainText('Card 2 Front');

    // Verify we're on the last card (next button disabled)
    await expect(nextButton).toBeDisabled();

    // Progress should show both cards viewed
    const progressText = page.locator('text=/\\d+ of \\d+ cards viewed/');
    await expect(progressText).toContainText('2 of 2');
  });
});
