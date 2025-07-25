import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ViewContactForm } from '../_components/ViewContactForm';

/**
 * Props for the ContactDetailPage component following Next.js App Router conventions
 */
interface ContactDetailPageProps {
  params: Promise<{
    contactId: string;
  }>;
}

/**
 * Contact detail page component
 * Uses Next.js App Router conventions for dynamic route parameters
 */
export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  // Extract contactId from params (await required in Next.js 15)
  const { contactId } = await params;

  // Basic validation for contactId
  if (!contactId) {
    redirect('/contacts');
  }

  // Server-side auth check
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/sign-in');
  }

  return <ViewContactForm contactId={contactId} />;
}
