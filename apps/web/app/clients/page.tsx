import { protectPage } from "../../lib/auth/actions"; // Corrected relative path (go up two levels)
import { ClientsContent } from "./ClientsContent"; // Import the extracted client component

/**
 * Clients Page - Server Component
 * Protects the route and renders the client-side content component.
 */
export default async function ClientsPage() {
  // Protect this page - redirects to /sign-in if not authenticated
  await protectPage();

  // Render the client component which handles data fetching and interaction
  return <ClientsContent />;
}

// All previous client-side code (imports for useState, api, error types, AppRouter,
// Client interface, "use client" directive, and ClientsContent function definition)
// should be REMOVED from this file and exist only in ./ClientsContent.tsx