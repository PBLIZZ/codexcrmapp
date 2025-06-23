/**
 * This helper file provides debugging utilities for the Next.js App Router setup
 * It helps identify issues with:
 * - Client/server component boundaries
 * - TanStack Query and tRPC integration
 * - Supabase auth flows
 */

/**
 * Inspects the environment to detect potential issues with client/server components
 */
export const debugComponentBoundaries = () => {
  // Only runs in client components
  if (typeof window === 'undefined') {
    return {
      environment: 'server',
      message:
        'Running in server environment - cannot debug client component boundaries',
    };
  }

  return {
    environment: 'client',
    nextJsRuntime: (window as { __NEXT_DATA__?: { buildId?: string } })
      .__NEXT_DATA__?.buildId
      ? 'Next.js App Router'
      : 'Unknown',
    hydrationState: (window as { __NEXT_DATA__?: { props?: unknown } })
      .__NEXT_DATA__?.props
      ? 'Hydrated'
      : 'Not hydrated',
    providerPresent: !!document.querySelector('[data-trpc-provider]'),
    message: 'Client component boundary debugging complete',
  };
};

/**
 * Inspects the tRPC and TanStack Query integration
 */
export const debugTrpcSetup = () => {
  // Only runs in client components
  if (typeof window === 'undefined') {
    return {
      environment: 'server',
      message: 'Running in server environment - cannot debug tRPC setup',
    };
  }

  // Check for TanStack Query devtools presence (if enabled)
  const tanstackDevtools = !!document.querySelector('[data-rq-portal]');

  return {
    environment: 'client',
    tanstackDevtoolsPresent: tanstackDevtools,
    queryCache: (window as { __REACT_QUERY_GLOBAL_CACHE__?: unknown })
      .__REACT_QUERY_GLOBAL_CACHE__
      ? 'Global cache found'
      : 'No global cache detected',
    message: 'tRPC and TanStack Query debugging complete',
  };
};

/**
 * Log any debugging information to help troubleshoot issues
 */
export const logDebugInfo = () => {
  // Skip in server environment
  if (typeof window === 'undefined') return;

  console.error('CodexCRM Debugging Information');
  console.warn(
    'App version:',
    process.env.NEXT_PUBLIC_APP_VERSION || 'development'
  );
  console.warn(
    'Next.js version:',
    (window as { __NEXT_DATA__?: { buildId?: string } }).__NEXT_DATA__
      ?.buildId || 'Unknown'
  );
  console.warn('Component boundaries:', debugComponentBoundaries());
  console.warn('tRPC setup:', debugTrpcSetup());
  console.error('End of debugging information');
};

// Add this to a client component to debug issues
// Example usage:
// useEffect(() => { logDebugInfo(); }, []);
