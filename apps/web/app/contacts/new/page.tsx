'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContactForm, ContactFormData } from '@/app/contacts/ContactForm';
import { api } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const utils = api.useUtils();
  
  // Save mutation
  const saveContact = api.contacts.save.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
      utils.groups.list.invalidate();
      router.push('/contacts');
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push('/contacts')} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contacts
        </Button>
        <h1 className="text-2xl font-bold">Add New Contact</h1>
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