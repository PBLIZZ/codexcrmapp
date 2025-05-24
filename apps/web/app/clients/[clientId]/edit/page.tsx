import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * Server component for the Edit Client page.
 * This redirects back to the ClientsContent component with the edit form open.
 */
export default async function EditClientPage({ params }: any) {
  // Get client ID from params
  const clientId = params.clientId;
  
  // Server-side auth check
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Redirect to login if not authenticated
    redirect('/login');
  }
  
  // Redirect to clients page, the client-side component will handle the edit mode
  redirect('/clients');
}
