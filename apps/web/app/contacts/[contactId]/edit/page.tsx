'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContactForm, ContactFormData } from '@/app/contacts/ContactForm';
import { api } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
// Correctly import AlertCircle from lucide-react
import { ArrowLeft, AlertCircle } from 'lucide-react'; 
// Import only the necessary components from your alert file
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Define the props type with proper typing for Next.js 15+
interface EditContactPageProps {
  params: Promise<{
    contactId: string;
  }>;
}

// The component now accepts the props type
export default function EditContactPage({ params }: EditContactPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use the contactId directly from params
  // In Next.js 15+, this is the recommended approach
  const { contactId } = use(params);
  const utils = api.useUtils();

  
  // Fetch contact data
  const { data: contact, isLoading, error: fetchError } = api.contacts.getById.useQuery(
    { contactId },
    {
      enabled: !!contactId,
      retry: 1,
    }
  );

  // Save mutation
  const saveContact = api.contacts.save.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
      utils.contacts.getById.invalidate({ contactId });
      utils.groups.list.invalidate();
      router.push(`/contacts/${contactId}`);
    },
    onError: (error) => {
      setError(`Error saving contact: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await saveContact.mutateAsync({
        id: contactId,
        full_name: data.full_name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        company_name: data.company_name || undefined,
        job_title: data.job_title || undefined,
        profile_image_url: data.profile_image_url || undefined,
        source: data.source || undefined,
        notes: data.notes || undefined,
        last_contacted_at: data.last_contacted_at || undefined,
        // Add other fields as needed
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError || !contact) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {fetchError ? fetchError.message : 'Contact not found'}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={() => router.push('/contacts')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push(`/contacts/${contactId}`)} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contact
        </Button>
        <h1 className="text-2xl font-bold">Edit Contact: {contact.full_name}</h1>
      </div>
      
      <ContactForm
        isOpen={true}
        initialData={{
          id: contact.id,
          full_name: contact.full_name || '',
          email: contact.email || '',
          phone: contact.phone || '',
          company_name: contact.company_name || '',
          job_title: contact.job_title || '',
          profile_image_url: contact.profile_image_url || '',
          source: contact.source || '',
          notes: contact.notes || '',
          last_contacted_at: contact.last_contacted_at || '',
          // Add other fields as needed
        }}
        onSubmit={handleSubmit}
        onClose={() => router.push(`/contacts/${contactId}`)}
        isSubmitting={isSubmitting}
        error={error}
        editingContactId={contactId}
      />
    </div>
  );
}
