import { test, expect } from '@playwright/test';
import { signUp } from './helpers/test-utils';

test.describe('Deck Management', () => {
  test.beforeEach(async ({ page }) => {
    // Sign up and create a deck for each test
    await page.goto('/');
    await signUp(page);
    await expect(page).toHaveURL(/\/dashboard/);

    // Create a deck
    await page.getByTestId('create-deck-trigger').click();
    await page.getByTestId('deck-name-input').fill('Test Deck');
    await page.getByTestId('deck-description-input').fill('Test Description');
    await page.getByTestId('create-deck-submit').click();
    await page.waitForTimeout(1000);

    // Click on the deck to open it (assuming deck cards are clickable)
    // We'll click on the first deck link or card
    await page.locator('a[href*="/decks/"]').first().click();
    await page.waitForURL(/\/decks\/\d+/, { timeout: 10000 });
  });

  test('should add a card to deck', async ({ page }) => {
    await page.getByTestId('add-card-trigger').click();
    await page.getByTestId('card-front-input').fill('What is React?');
    await page.getByTestId('card-back-input').fill('A JavaScript library for building user interfaces');
    await page.getByTestId('create-card-submit').click();
    await page.waitForTimeout(1000);

    // Verify card appears in the list
    const cardItems = page.getByTestId('card-item');
    await expect(cardItems).toHaveCount(1);
    await expect(cardItems.first()).toContainText('What is React?');
  });

  test('should edit a card', async ({ page }) => {
    // First add a card
    await page.getByTestId('add-card-trigger').click();
    await page.getByTestId('card-front-input').fill('Original Front');
    await page.getByTestId('card-back-input').fill('Original Back');
    await page.getByTestId('create-card-submit').click();
    await page.waitForTimeout(1000);

    // Edit the card - hover to show edit button, then click it
    const cardItem = page.getByTestId('card-item').first();
    await cardItem.hover();
    
    const editButton = page.getByTestId('edit-card-button').first();
    await editButton.click();

    // Update the card
    await page.getByTestId('edit-card-front-input').fill('Updated Front');
    await page.getByTestId('edit-card-back-input').fill('Updated Back');
    await page.getByTestId('update-card-submit').click();
    await page.waitForTimeout(1000);

    // Verify card was updated
    await expect(cardItem).toContainText('Updated Front');
    await expect(cardItem).toContainText('Updated Back');
  });

  test('should delete a card', async ({ page }) => {
    // First add a card
    await page.getByTestId('add-card-trigger').click();
    await page.getByTestId('card-front-input').fill('Card to Delete');
    await page.getByTestId('card-back-input').fill('Back content');
    await page.getByTestId('create-card-submit').click();
    await page.waitForTimeout(1000);

    // Delete the card - hover to show delete button
    const cardItem = page.getByTestId('card-item').first();
    await cardItem.hover();

    const deleteButton = page.getByTestId('delete-card-button').first();
    await deleteButton.click();

    // Confirm deletion
    await page.getByTestId('confirm-delete-card').click();
    await page.waitForTimeout(1000);

    // Verify card is deleted
    await expect(page.getByTestId('card-item')).toHaveCount(0);
  });

  test('should delete a deck', async ({ page }) => {
    // Navigate back to dashboard first
    await page.goto('/dashboard');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });

    // Find and click delete button for the deck
    // Delete button should be visible on hover or in the deck card
    const deckCard = page.locator('a[href*="/decks/"]').first();
    await deckCard.hover();

    const deleteButton = page.getByTestId('delete-deck-button').first();
    await deleteButton.click();

    // Confirm deletion
    await page.getByTestId('confirm-delete-deck').click();
    await page.waitForTimeout(1000);

    // Should be back on dashboard, and deck should be gone
    await expect(page).toHaveURL(/\/dashboard/);
    // Verify deck count decreased or empty state is shown
    const deckCount = page.getByTestId('deck-count');
    if (await deckCount.isVisible()) {
      await expect(deckCount).toHaveText('(0/3 decks)');
    }
  });
});
