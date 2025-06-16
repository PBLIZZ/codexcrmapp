import { requireAuth } from '@/lib/auth/require-auth';

export const metadata = {
  title: "Contacts | CodexCRM",
  description: "Manage your contacts, groups, and relationships efficiently with CodexCRM.",
  keywords: ["contacts","CRM","customer management","relationships"]
};

import { Contact } from '@/app/contacts/ContactsTable'; // Import Contact type
import { ContactsWidgets } from '@/components/contacts/ContactsWidgets';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/server';
import ContactsTableClient from '@/app/contacts/ContactsTableClient';

// A simple loading state for the page content
function ContactsPageSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

// Server component to fetch data
export default async function ContactsPage() {
  await requireAuth();

  // Fetch contacts from Supabase
  try {
    const supabase = await createClient();
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching contacts:', error);
      throw new Error(`Failed to fetch contacts: ${error.message}`);
    }

    // Transform the data to match the Contact type
    const formattedContacts: Contact[] = contacts?.map((contact: any) => ({
      ...contact,
      tags: contact.tags as Array<{ id: string; name: string }> | null
    })) || [];
    
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Suspense fallback={<ContactsPageSkeleton />}>
          <div className="space-y-6">
            <ContactsWidgets />
            <ContactsTableClient initialContacts={formattedContacts} />
          </div>
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error('Error in ContactsPage:', error);
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Contacts</h2>
            <p className="text-red-700">There was a problem fetching your contacts. Please try refreshing the page.</p>
          </div>
        </div>
      </main>
    );
  }


}
