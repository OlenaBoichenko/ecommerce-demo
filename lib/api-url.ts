/**
 * Base URL for API requests
 * Works in both development and production environments
 */
export function getBaseUrl() {
  // Browser environment
  if (typeof window !== 'undefined') {
    return '';
  }

  // Netlify deployment
  if (process.env.URL) {
    return process.env.URL;
  }

  // Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Custom deployment URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Local development
  return 'http://localhost:3000';
}
