// Temporarily disabled for configuration consolidation

/**
 * Props for the ContactDetailPage component following Next.js App Router conventions
 */
interface ContactDetailPageProps {
  params: Promise<{
    contactId: string;
  }>;
}

// Removed unused ContactDetailSkeleton component

/**
 * Contact detail page component
 * Uses Next.js App Router conventions for dynamic route parameters
 */
export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  // Extract contactId from params (await required in Next.js 15)
  const { contactId } = await params;

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>Contact Details</h1>
        <p className='text-muted-foreground'>
          Contact details feature temporarily disabled during configuration consolidation. Will be
          re-enabled in a future branch.
        </p>
        <p className='text-sm text-muted-foreground mt-2'>Contact ID: {contactId}</p>
      </div>
    </div>
  );
}
