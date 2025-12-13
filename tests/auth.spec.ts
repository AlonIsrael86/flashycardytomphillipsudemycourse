import { test, expect } from '@playwright/test';
import { signUp, signIn, randomEmail } from './helpers/test-utils';

test.describe('Authentication', () => {
  test('should sign up new user and redirect to dashboard', async ({ page }) => {
    await page.goto('/');
    
    const { email, password } = await signUp(page);
    
    // Should be redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should sign out and redirect to home', async ({ page }) => {
    // First sign up
    await page.goto('/');
    const { email, password } = await signUp(page);
    await expect(page).toHaveURL(/\/dashboard/);

    // Sign out using Clerk's UserButton
    // Clerk's UserButton opens a menu when clicked
    const userButton = page.locator('[data-testid="user-button"], button[aria-label*="User"], button[aria-label*="Account"]').first();
    
    // Try to find and click the user button - Clerk uses different selectors
    // Try common Clerk UserButton selectors
    const userButtonSelector = 'button[aria-label*="User"], button:has([data-clerk-element="userButton"]), [data-clerk-element="userButton"]';
    await page.locator(userButtonSelector).first().click().catch(() => {
      // If that doesn't work, try clicking on any element that might be the user button
      page.locator('header button').last().click();
    });

    // Wait for the menu to appear and click sign out
    // Clerk's sign out button is typically labeled "Sign out" or "Sign Out"
    await page.waitForTimeout(500); // Small delay for menu to appear
    await page.locator('button:has-text("Sign out"), button:has-text("Sign Out"), a:has-text("Sign out"), a:has-text("Sign Out")').first().click();

    // Should redirect to home page
    await page.waitForURL('/', { timeout: 10000 });
    await expect(page).toHaveURL('/');
  });

  test('should sign in with existing credentials and redirect to dashboard', async ({ page }) => {
    // First sign up to create an account
    await page.goto('/');
    const { email, password } = await signUp(page);
    await expect(page).toHaveURL(/\/dashboard/);

    // Sign out first
    const userButtonSelector = 'button[aria-label*="User"], button:has([data-clerk-element="userButton"]), [data-clerk-element="userButton"]';
    await page.locator(userButtonSelector).first().click().catch(() => {
      page.locator('header button').last().click();
    });
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Sign out"), button:has-text("Sign Out")').first().click();
    await page.waitForURL('/', { timeout: 10000 });

    // Now sign in with the same credentials
    await signIn(page, email, password);
    
    // Should be redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
