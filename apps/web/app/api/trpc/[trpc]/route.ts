import { appRouter } from '@/lib/trpc/root';
import { createContext } from '@/lib/trpc/context';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

/**
 * tRPC API endpoint configuration
 * Handles both GET and POST requests for tRPC procedures
 */

// Define the tRPC endpoint path as a constant for maintainability
const TRPC_ENDPOINT = '/api/trpc';

// Remove edge runtime to use Node.js for better compatibility with tRPC and Supabase
// export const runtime = 'edge';

/**
 * Standard error response format for consistency
 */
type ApiErrorResponse = {
  error: string;
  message: string;
  code?: string;
};

/**
 * Main request handler for tRPC API calls
 */
export const GET = async (req: Request) => {
  console.info(`[TRPC API] Handling ${req.method} request to ${req.url}`);

  try {
    // Log the headers at debug level for detailed troubleshooting only
    if (process.env.NODE_ENV === 'development') {
      const headers = Object.fromEntries(req.headers.entries());
      // Use debug level for potentially sensitive or verbose information
      console.debug('[TRPC API] Request headers:', JSON.stringify(headers, null, 2));
    }

    // Handle the request with tRPC's fetchRequestHandler
    const response = await fetchRequestHandler({
      endpoint: TRPC_ENDPOINT,
      req,
      router: appRouter,
      // createContext function doesn't take any arguments in tRPC v11
      createContext: createContext,
      // Configure error handling based on environment
      onError:
        process.env.NODE_ENV === 'development'
          ? ({ path, error }) => {
              console.error(`❌ [TRPC API] Failed on ${path}: ${error.message}`);
              console.error(error.stack);
            }
          : ({ path }) => {
              // Log errors in production but without sensitive details
              console.error(`[TRPC API] Error in procedure: ${path}`);
            },
    });

    console.info(`[TRPC API] Response status: ${response.status}`);
    return response;
  } catch (error) {
    console.error('[TRPC API] Unhandled error:', error);

    // Create a standardized error response
    const errorResponse: ApiErrorResponse = {
      error: 'Internal Server Error',
      // Provide generic message in production, detailed in development
      message: 'An unexpected error occurred.',
      // Log detailed error information on the server for debugging purposes
      ...(process.env.NODE_ENV !== 'production' && error instanceof Error
        ? { debugInfo: { message: error.message, stack: error.stack } }
        : {}),
      // Add error code for easier client-side handling
      code: 'INTERNAL_SERVER_ERROR',
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};

// Use the same handler for POST requests
export const POST = GET;
