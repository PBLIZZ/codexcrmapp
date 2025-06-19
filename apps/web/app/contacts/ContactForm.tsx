'use client';

import { useActionState, useState, useEffect } from 'react';
import { api } from '@/lib/trpc';
import * as z from 'zod';
import { ImageUpload } from '@/components/ui/image-upload';

// Zod schema remains the same
export const contactSchema = z.object({
  address_street: z.string().optional().nullable(),
  address_city: z.string().optional().nullable(),
  address_postal_code: z.string().optional().nullable(),
  address_country: z.string().optional().nullable(),
  phone_country_code: z.string().optional().nullable(),
  website: z.string().url({ message: "Invalid URL format" }).optional().nullable().or(z.literal('')),
  social_handles: z.array(z.string()).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  id: z.string().uuid().optional(),
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  phone: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  profile_image_url: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  last_contacted_at: z
    .string()
    .refine(
      (val) => val === '' || val === null || val === undefined || (val && !isNaN(new Date(val).getTime())),
      { message: 'Invalid date format for Last Contacted At' }
    )
    .optional()
    .nullable(),
  enrichment_status: z.string().optional().nullable(),
  enriched_data: z.record(z.unknown()).optional().nullable(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  isOpen: boolean;
  initialData?: ContactFormData;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
  error: string | null;
  editingContactId: string | null;
}

// Helper component for styled form inputs to keep the main component clean
const FormInput = ({ id, ...props }: React.ComponentProps<'input'>) => (
  <input id={id} name={id} {...props} className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-800 focus:ring-1 focus:ring-teal-400 transition-colors sm:text-sm" />
);

const FormTextarea = ({ id, ...props }: React.ComponentProps<'textarea'>) => (
  <textarea id={id} name={id} {...props} className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-800 focus:ring-1 focus:ring-teal-400 transition-colors sm:text-sm" />
);

const FormLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {children}
  </label>
);

const FieldError = ({ message }: { message?: string }) => (
  message ? <p className="mt-1 text-sm text-red-600">{message}</p> : null
);


export function ContactForm({
  isOpen,
  initialData,
  onClose,
  isSubmitting,
  editingContactId,
}: ContactFormProps) {
  const utils = api.useUtils();
  
  const [formData, setFormData] = useState<ContactFormData>(initialData ?? {
    address_street: '', address_city: '', address_postal_code: '', address_country: '',
    phone_country_code: '', website: '', social_handles: [], tags: [],
    id: undefined, full_name: '', email: '', phone: '', company_name: '',
    job_title: '', profile_image_url: '', source: '', notes: '',
    last_contacted_at: '', enrichment_status: '', enriched_data: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const createContact = api.contacts.save.useMutation({
    onSuccess: () => { void utils.contacts.list.invalidate(); onClose(); },
    onError: (error) => console.error('Create contact error:', error)
  });
  
  const saveContact = api.contacts.save.useMutation({
    onSuccess: () => {
      void utils.contacts.list.invalidate();
      if (editingContactId) {
        void utils.contacts.getById.invalidate({ contactId: editingContactId });
      }
      onClose();
    },
    onError: (error) => console.error('Save contact error:', error)
  });

  const submitAction = async (
    prevState: { success: boolean; message: string; errors: Record<string, string[]> },
    formDataFromForm: FormData
  ): Promise<{ success: boolean; message: string; errors: Record<string, string[]> }> => {
    try {
      const rawData = Object.fromEntries(formDataFromForm.entries());
      const processedData = {
        ...rawData,
        profile_image_url: formData.profile_image_url,
        social_handles: rawData.social_handles ? (rawData.social_handles as string).split(',').map(s => s.trim()).filter(Boolean) : [],
        tags: rawData.tags ? (rawData.tags as string).split(',').map(s => s.trim()).filter(Boolean) : [],
        phone: rawData.phone ?? null, company_name: rawData.company_name ?? null,
        job_title: rawData.job_title ?? null, website: rawData.website ?? null,
        address_street: rawData.address_street ?? null, address_city: rawData.address_city ?? null,
        address_postal_code: rawData.address_postal_code ?? null, address_country: rawData.address_country ?? null,
        phone_country_code: rawData.phone_country_code ?? null, source: rawData.source ?? null,
        notes: rawData.notes ?? null, last_contacted_at: rawData.last_contacted_at ?? null,
      };

      const validatedData = contactSchema.parse(processedData);

      if (editingContactId) {
        await saveContact.mutateAsync({ id: editingContactId, ...validatedData });
      } else {
        await createContact.mutateAsync(validatedData);
      }

      return { success: true, message: editingContactId ? 'Contact updated successfully!' : 'Contact created successfully!', errors: {} };
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        const typedErrors: Record<string, string[]> = {};
        Object.entries(fieldErrors).forEach(([key, value]) => {
          if (value) {typedErrors[key] = Array.isArray(value) ? value : [String(value)];}
        });
        return { success: false, message: 'Please fix the errors below.', errors: typedErrors };
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to save contact.';
      return { success: false, message: errorMessage, errors: {} };
    }
  };

  const [state, formAction, isPending] = useActionState(submitAction, {
    success: false, message: '', errors: {} as Record<string, string[]>,
  });

  const handleInputChange = (field: keyof ContactFormData, value: string | string[] | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldBlur = (field: 'social_handles' | 'tags', value: string) => {
    const arrayValue = value.split(',').map((item: string) => item.trim()).filter(Boolean);
    handleInputChange(field, arrayValue);
  };

  const handleImageChange = (url: string | null) => {
    handleInputChange('profile_image_url', url);
  };

  const isLoading = isPending || isSubmitting || createContact.isPending || saveContact.isPending;

  return (
    <div
      className={`mb-8 bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'opacity-100 max-h-[2000px] border border-gray-200' : 'opacity-0 max-h-0 overflow-hidden border-0'
      }`}
    >
      {/* Header with Title and Action Buttons */}
      <div className="bg-teal-800 text-white px-6 py-3 flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
            {editingContactId ? <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /> : <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />}
          </svg>
          {editingContactId ? 'Edit Contact' : 'Add New Contact'}
        </h2>
        <div className="flex items-center gap-x-2">
          <button type="button" onClick={onClose} disabled={isLoading} className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-teal-700/50 transition-colors">
            Cancel
          </button>
          <button type="submit" form="contact-form" disabled={isLoading} className="rounded-md bg-white text-teal-800 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-teal-100 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50 transition-colors">
            {isLoading ? 'Processing...' : (editingContactId ? 'Save Changes' : 'Create Contact')}
          </button>
        </div>
      </div>
      
      {/* Form Body */}
      <div className="p-6">
        {state.message && (
          <div className={`mb-4 p-3 border rounded-md flex items-center text-sm ${state.success ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            {state.message}
          </div>
        )}

        <form id="contact-form" action={formAction} className="w-full">
          {editingContactId && <input type="hidden" name="id" value={editingContactId} />}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
            
            {/* === COLUMN 1: PRIMARY INFO === */}
            <div className="space-y-6 lg:pr-8">
              <div className="space-y-4">
                <FormLabel htmlFor="profile_image_url">Profile Photo</FormLabel>
                <ImageUpload value={formData.profile_image_url ?? null} onChange={handleImageChange} disabled={isLoading} contactId={editingContactId ?? undefined} />
                <FieldError message={state.errors?.profile_image_url?.[0]} />
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-base font-semibold text-gray-800">Contact & Professional</h3>
                <div>
                  <FormLabel htmlFor="full_name">Full Name *</FormLabel>
                  <FormInput id="full_name" type="text" required defaultValue={formData.full_name} />
                  <FieldError message={state.errors?.full_name?.[0]} />
                </div>
                <div>
                  <FormLabel htmlFor="email">Email *</FormLabel>
                  <FormInput id="email" type="email" required defaultValue={formData.email} />
                  <FieldError message={state.errors?.email?.[0]} />
                </div>
                <div>
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <FormInput id="phone" type="text" defaultValue={formData.phone ?? ''} />
                  <FieldError message={state.errors?.phone?.[0]} />
                </div>
                <div>
                  <FormLabel htmlFor="company_name">Company</FormLabel>
                  <FormInput id="company_name" type="text" defaultValue={formData.company_name ?? ''} />
                  <FieldError message={state.errors?.company_name?.[0]} />
                </div>
                <div>
                  <FormLabel htmlFor="job_title">Job Title</FormLabel>
                  <FormInput id="job_title" type="text" defaultValue={formData.job_title ?? ''} />
                  <FieldError message={state.errors?.job_title?.[0]} />
                </div>
              </div>
            </div>

            {/* === COLUMN 2: LOCATION & ONLINE PRESENCE === */}
            <div className="space-y-6 pt-6 md:pt-0 lg:px-8 lg:border-l lg:border-r border-gray-200">
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-800">Location</h3>
                <div>
                  <FormLabel htmlFor="address_street">Street address</FormLabel>
                  <FormInput type="text" id="address_street" defaultValue={formData.address_street ?? ''} />
                  <FieldError message={state.errors?.address_street?.[0]} />
                </div>
                <div>
                  <FormLabel htmlFor="address_city">City</FormLabel>
                  <FormInput type="text" id="address_city" defaultValue={formData.address_city ?? ''} />
                  <FieldError message={state.errors?.address_city?.[0]} />
                </div>
                <div>
                  <FormLabel htmlFor="address_postal_code">ZIP / Postal code</FormLabel>
                  <FormInput type="text" id="address_postal_code" defaultValue={formData.address_postal_code ?? ''} />
                  <FieldError message={state.errors?.address_postal_code?.[0]} />
                </div>
                <div>
                  <FormLabel htmlFor="address_country">Country</FormLabel>
                  <FormInput type="text" id="address_country" defaultValue={formData.address_country ?? ''} />
                  <FieldError message={state.errors?.address_country?.[0]} />
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-base font-semibold text-gray-800">Online Presence</h3>
                <div>
                  <FormLabel htmlFor="website">Website</FormLabel>
                  <FormInput id="website" type="text" defaultValue={formData.website ?? ''} />
                  <FieldError message={state.errors?.website?.[0]} />
                </div>
                <div>
                  <FormLabel htmlFor="social_handles">Social Handles (comma-separated)</FormLabel>
                  <FormInput id="social_handles" type="text" defaultValue={formData.social_handles?.join(', ') ?? ''} onBlur={(e) => handleArrayFieldBlur('social_handles', e.target.value)} />
                  <FieldError message={state.errors?.social_handles?.[0]} />
                </div>
              </div>
            </div>

            {/* === COLUMN 3: CRM & NOTES === */}
            <div className="space-y-6 pt-6 lg:pt-0 lg:pl-8">
              <div className="space-y-4">
                 <h3 className="text-base font-semibold text-gray-800">CRM Data</h3>
                 <div>
                  <FormLabel htmlFor="tags">Tags (comma-separated)</FormLabel>
                  <FormInput id="tags" type="text" defaultValue={formData.tags?.join(', ') ?? ''} onBlur={(e) => handleArrayFieldBlur('tags', e.target.value)} />
                  <FieldError message={state.errors?.tags?.[0]} />
                </div>
                <div>
                  <FormLabel htmlFor="source">Source</FormLabel>
                  <FormInput id="source" type="text" defaultValue={formData.source ?? ''} />
                  <FieldError message={state.errors?.source?.[0]} />
                </div>
                <div>
                  <FormLabel htmlFor="last_contacted_at">Last Contacted</FormLabel>
                  <FormInput id="last_contacted_at" type="datetime-local" defaultValue={formData.last_contacted_at ?? ''} />
                  <FieldError message={state.errors?.last_contacted_at?.[0]} />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-base font-semibold text-gray-800">Notes</h3>
                <div>
                  <FormTextarea id="notes" rows={8} defaultValue={formData.notes ?? ''} />
                  <FieldError message={state.errors?.notes?.[0]} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}