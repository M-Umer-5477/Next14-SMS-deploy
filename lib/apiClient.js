/**
 * Get the base URL for API calls.
 * - On client: uses relative URLs (empty string)
 * - On server: uses NEXTAUTH_URL or defaults to localhost:3000
 */
export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use relative URLs
    return '';
  }

  // Server-side: construct full URL
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

/**
 * Helper function to build complete API URLs
 */
export const buildApiUrl = (path) => {
  return `${getApiUrl()}${path}`;
};
