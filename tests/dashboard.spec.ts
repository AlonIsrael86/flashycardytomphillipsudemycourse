import { test, expect } from '@playwright/test';
import { signUp } from './helpers/test-utils';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Sign up a new user for each test
    await page.goto('/');
    await signUp(page);
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should show deck count as 0/3 for new user', async ({ page }) => {
    const deckCount = page.getByTestId('deck-count');
    await expect(deckCount).toBeVisible();
    await expect(deckCount).toHaveText('(0/3 decks)');
  });

  test('should create decks 1, 2, 3 and show count 3/3', async ({ page }) => {
    // Create first deck
    await page.getByTestId('create-deck-trigger').click();
    await page.getByTestId('deck-name-input').fill('Deck 1');
    await page.getByTestId('create-deck-submit').click();
    await page.waitForTimeout(1000); // Wait for page refresh

    let deckCount = page.getByTestId('deck-count');
    await expect(deckCount).toHaveText('(1/3 decks)');

    // Create second deck
    await page.getByTestId('create-deck-trigger').click();
    await page.getByTestId('deck-name-input').fill('Deck 2');
    await page.getByTestId('create-deck-submit').click();
    await page.waitForTimeout(1000);

    deckCount = page.getByTestId('deck-count');
    await expect(deckCount).toHaveText('(2/3 decks)');

    // Create third deck
    await page.getByTestId('create-deck-trigger').click();
    await page.getByTestId('deck-name-input').fill('Deck 3');
    await page.getByTestId('create-deck-submit').click();
    await page.waitForTimeout(1000);

    deckCount = page.getByTestId('deck-count');
    await expect(deckCount).toHaveText('(3/3 decks)');
  });

  test('should show upgrade CTA or disable create button when limit reached', async ({ page }) => {
    // Create 3 decks
    for (let i = 1; i <= 3; i++) {
      await page.getByTestId('create-deck-trigger').click();
      await page.getByTestId('deck-name-input').fill(`Deck ${i}`);
      await page.getByTestId('create-deck-submit').click();
      await page.waitForTimeout(1000);
    }

    // Verify deck count shows 3/3
    const deckCount = page.getByTestId('deck-count');
    await expect(deckCount).toHaveText('(3/3 decks)');

    // Check that either:
    // 1. Create button is disabled, OR
    // 2. Upgrade CTA is visible
    const createButton = page.getByTestId('create-deck-trigger');
    const upgradeCTA = page.getByTestId('upgrade-cta');

    const isCreateDisabled = await createButton.isDisabled().catch(() => false);
    const isUpgradeVisible = await upgradeCTA.isVisible().catch(() => false);

    // At least one of these conditions must be true
    expect(isCreateDisabled || isUpgradeVisible).toBeTruthy();
  });
});
