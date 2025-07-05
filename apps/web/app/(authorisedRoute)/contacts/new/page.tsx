'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ContactFormData } from '@/app/(authorisedRoute)/contacts/new/ContactForm';
import { ContactForm } from '@/app/(authorisedRoute)/contacts/new/ContactForm';
import { api } from '@/lib/trpc';
import { Button } from '@codexcrm/ui';
import { ArrowLeft } from 'lucide-react';

export default function NewContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const utils = api.useUtils();

  // Save mutation
  const saveContact = api.contacts.save.useMutation({
    onSuccess: () => {
      void utils.contacts.list.invalidate(); // Prepend with void
      void utils.groups.list.invalidate(); // Prepend with void
      router.push('/contacts');
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
        full_name: data.full_name,
        email: data.email ?? undefined, // Use ??
        phone: data.phone ?? undefined, // Use ??
        company_name: data.company_name ?? undefined, // Use ??
        job_title: data.job_title ?? undefined, // Use ??
        profile_image_url: data.profile_image_url ?? undefined, // Use ??
        source: data.source ?? undefined, // Use ??
        notes: data.notes ?? undefined, // Use ??
        last_contacted_at: data.last_contacted_at ?? undefined, // Use ??
        // Add other fields as needed
      });
    } catch (err: unknown) {
      // Changed 'any' to 'unknown'
      if (err instanceof Error) {
        // Added type guard
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='flex items-center mb-6'>
        <Button variant='outline' onClick={() => router.push('/contacts')} className='mr-4'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Contacts
        </Button>
        <h1 className='text-2xl font-bold'>Add New Contact</h1>
      </div>

      <ContactForm
        isOpen={true}
        onSubmit={handleSubmit}
        onClose={() => router.push('/contacts')}
        isSubmitting={isSubmitting}
        error={error}
        editingContactId={null}
      />
    </div>
  );
}
