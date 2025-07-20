import { ContactsContent } from './_components/FullPrismaContactsContent';

/**
 * Server component for the Contacts page.
 * Authentication is handled by middleware.
 */
export default function ContactsPage() {
  return (
    <div className='container mx-auto py-8 px-4'>
      <ContactsContent />
    </div>
  );
}
