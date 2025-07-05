'use client';

import _React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ContactFormData } from '@/app/(authorisedRoute)/contacts/new/ContactForm';
import { ContactForm } from '@/app/(authorisedRoute)/contacts/new/ContactForm';
import { api } from '@/lib/trpc';
import { Button } from '@codexcrm/ui';
import { Alert, AlertTitle, AlertDescription } from '@codexcrm/ui';
import type { Tables } from '@codexcrm/database/types'; // Import Tables type

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
  const {
    data: contact, // Type the contact data
    isLoading,
    error: fetchError,
  } = api.contacts.getById.useQuery<Tables<'contacts'> | undefined>( // Explicitly type the query result
    { contactId },
    {
      enabled: !!contactId,
      retry: 1,
    }
  );

  // Save mutation
  const saveContact = api.contacts.save.useMutation({
    onSuccess: () => {
      void utils.contacts.list.invalidate(); // Prepend with void
      void utils.contacts.getById.invalidate({ contactId }); // Prepend with void
      void utils.groups.list.invalidate(); // Prepend with void
      router.push(`/contacts/${contactId}`);
    },
    onError: (saveError) => {
      // Renamed error variable
      setError(`Error saving contact: ${saveError.message}`);
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
        email: data.email,
        phone: data.phone,
        company_name: data.company_name,
        job_title: data.job_title,
        profile_image_url: data.profile_image_url,
        source: data.source,
        notes: data.notes,
        last_contacted_at: data.last_contacted_at,
        // Add other fields as needed
      });
    } catch (err: unknown) {
      // Changed 'any' to 'unknown' and added type guard
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError || !contact) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <Alert variant='destructive' className='max-w-4xl mx-auto'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {fetchError ? fetchError.message : 'Contact not found'}
          </AlertDescription>
        </Alert>
        <div className='flex justify-center mt-8'>
          <Button variant='outline' onClick={() => router.push('/contacts')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Contacts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='flex items-center mb-6'>
        <Button
          variant='outline'
          onClick={() => router.push(`/contacts/${contactId}`)}
          className='mr-4'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Contact
        </Button>
        <h1 className='text-2xl font-bold'>
          Edit Contact: {contact?.full_name} {/* Use optional chaining */}
        </h1>
      </div>

      <ContactForm
        isOpen={true}
        initialData={{
          id: contact?.id, // Use optional chaining
          full_name: contact?.full_name ?? '', // Use ??
          email: contact?.email ?? '', // Use ??
          phone: contact?.phone ?? '', // Use ??
          company_name: contact?.company_name ?? '', // Use ??
          job_title: contact?.job_title ?? '', // Use ??
          profile_image_url: contact?.profile_image_url ?? '', // Use ??
          source: contact?.source ?? '', // Use ??
          notes: contact?.notes ?? '', // Use ??
          last_contacted_at: contact?.last_contacted_at ?? '', // Use ??
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
