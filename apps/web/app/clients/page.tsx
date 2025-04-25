// import { protectPage } from "../../lib/auth/actions"; // Corrected relative path (go up two levels)
import { ClientsContent } from "./ClientsContent"; // Import the extracted client component

/**
 * Server component for the Clients page.
 * Authentication is handled by middleware.
 */
export default async function ClientsPage() {
  // Remove the protectPage call
  // await protectPage();
  
  // Render the client component that handles data fetching and display
  return <ClientsContent />;
}

// All previous client-side code (imports for useState, api, error types, AppRouter,
// Client interface, "use client" directive, and ClientsContent function definition)
// should be REMOVED from this file and exist only in ./ClientsContent.tsx