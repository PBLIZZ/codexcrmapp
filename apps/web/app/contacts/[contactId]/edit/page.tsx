import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

// Define a more specific interface for the params prop
interface EditContactPageProps {
  params: Promise<{
    contactId: string;
  }>;
}

/**
 * Server component for the Edit Contact page.
 *
 * This component performs server-side authentication and then redirects to the
 * main contact detail page. The client-side component at /contacts/[contactId]
 * will handle displaying the edit form based on the contact ID.
 *
 * @param props.params - Route parameters containing the contactId
 */
export default async function EditContactPage(
  props: EditContactPageProps,
) {
  const params = await props.params;
  // Get contact ID from params
  const contactId = params.contactId;

  // Basic validation for contactId
  if (!contactId) {
    console.error('Missing contactId in EditContactPage route params');
    redirect('/contacts');
  }

  // Server-side auth check
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Redirect to sign-in if not authenticated
    return redirect('/log-in');
  }

  // Redirect to contacts page, the client-side component will handle the edit mode
  redirect(`/contacts/${contactId}`);
}
