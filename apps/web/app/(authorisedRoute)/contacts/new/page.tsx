import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UnifiedContactForm } from '../_components/UnifiedContactForm';

export default async function NewContactPage() {
  // Server-side auth check
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/sign-in');
  }

  return <UnifiedContactForm mode='new' />;
}
