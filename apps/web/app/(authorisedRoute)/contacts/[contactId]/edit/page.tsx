import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { EditContactForm } from '../../_components/EditContactForm';

// Define a more specific interface for the params prop
interface EditContactPageProps {
  params: Promise<{
    contactId: string;
  }>;
}

/**
 * Server component for the Edit Contact page.
 *
 * @param props.params - Route parameters containing the contactId
 */
export default async function EditContactPage({ params }: EditContactPageProps) {
  // Get contact ID from params (await since params is now a Promise in Next.js 15)
  const { contactId } = await params;

  // Basic validation for contactId
  if (!contactId) {
    console.error('Missing contactId in EditContactPage route params');
    redirect('/contacts');
  }

  // Server-side auth check
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Redirect to sign-in if not authenticated
    redirect('/sign-in');
  }

  return <EditContactForm contactId={contactId} />;
}
