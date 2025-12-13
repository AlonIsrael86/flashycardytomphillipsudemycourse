import { Page, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

export function randomEmail(): string {
  return `test-${randomUUID()}@example.com`;
}

export async function signUp(page: Page): Promise<{ email: string; password: string }> {
  const email = randomEmail();
  const password = 'TestPassword123!';

  // Open sign up dialog
  await page.getByTestId('auth-signup-trigger').click();

  // Wait for Clerk sign up form to be visible
  await page.waitForSelector('input[name="emailAddress"], input[type="email"]', { timeout: 10000 });

  // Fill email - Clerk uses name="emailAddress" or type="email"
  const emailInput = page.locator('input[name="emailAddress"]').first();
  if (await emailInput.isVisible()) {
    await emailInput.fill(email);
  } else {
    await page.locator('input[type="email"]').first().fill(email);
  }

  // Fill password - Clerk uses name="password" or type="password" inside the form
  const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
  await passwordInput.fill(password);

  // Click continue/submit button - Clerk uses various button labels
  const continueButton = page.locator('button[type="submit"], button:has-text("Continue"), button:has-text("Sign up"), button:has-text("Create account")').first();
  await continueButton.click();

  // Wait for navigation to dashboard (email verification is disabled, so should redirect immediately)
  await page.waitForURL(/\/dashboard/, { timeout: 30000 });

  return { email, password };
}

export async function signIn(page: Page, email: string, password: string): Promise<void> {
  // Open sign in dialog
  await page.getByTestId('auth-signin-trigger').click();

  // Wait for Clerk sign in form to be visible
  await page.waitForSelector('input[name="identifier"], input[type="email"], input[name="emailAddress"]', { timeout: 10000 });

  // Fill email/identifier
  const emailInput = page.locator('input[name="identifier"], input[name="emailAddress"], input[type="email"]').first();
  await emailInput.fill(email);

  // Fill password
  const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
  await passwordInput.fill(password);

  // Click continue/submit button
  const continueButton = page.locator('button[type="submit"], button:has-text("Continue"), button:has-text("Sign in")').first();
  await continueButton.click();

  // Wait for navigation to dashboard
  await page.waitForURL(/\/dashboard/, { timeout: 30000 });
}
