/**
 * Helper functions for working with Next.js routes in a type-safe way
 */

/**
 * Creates a properly typed pathname object for Next.js Link component
 * This helps with the stricter type checking in Next.js 15+
 * 
 * @param path The route path as a string
 * @returns A properly typed pathname object for the Link component
 */
export function createRoute(path: string) {
  return { pathname: path };
}
