/**
 * Route utilities for consistent URL handling throughout the application
 */

/**
 * Creates a properly formatted route from a given path
 * @param path The route path to format
 * @returns A properly formatted route string
 */
export function createRoute(path: string): string {
  // Ensure path starts with a forward slash
  if (!path.startsWith('/') && path !== '') {
    path = '/' + path;
  }
  
  // Remove trailing slash unless it's the root path
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  
  return path;
}