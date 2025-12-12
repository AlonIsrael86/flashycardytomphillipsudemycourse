/**
 * Get the base URL for the site
 * Uses NEXT_PUBLIC_SITE_URL environment variable if available
 * Falls back to a placeholder that should be configured in production
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Fallback - should be configured via environment variable in production
  return "https://flashycardy.com";
}






