// Temporarily disabled for configuration consolidation
/**
 * Server component for the Contacts page.
 * Authentication is handled by middleware.
 */
export default function ContactsPage() {
  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>Contacts</h1>
        <p className='text-muted-foreground'>
          Contacts feature temporarily disabled during configuration consolidation. Will be
          re-enabled in a future branch.
        </p>
      </div>
    </div>
  );
}
