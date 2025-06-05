import { ContactsContent } from './ContactsContent'; // Import the extracted contact component

/**
 * Server component for the Contacts page.
 * Authentication is handled by middleware.
 */
export default function ContactsPage() {
  // Render the contact component that handles data fetching and display
  return <ContactsContent />;
}
