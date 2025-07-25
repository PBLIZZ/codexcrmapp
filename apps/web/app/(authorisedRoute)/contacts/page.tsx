import { ContactsContent } from './_components/ContactsContent';

/**
 * Server component for the Contacts page.
 * Authentication is handled by middleware.
 */
export default function ContactsPage() {
  return (
    <div className='h-full flex flex-col'>
      <ContactsContent />
    </div>
  );
}
