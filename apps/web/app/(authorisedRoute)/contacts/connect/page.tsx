import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ConnectDataSources } from './ConnectDataSources';

export default async function ConnectDataPage() {
  // Server-side auth check
  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/sign-in');
  }

  return <ConnectDataSources />;
}
