'use client';

import { useActionState, useState, useEffect, type FormEvent } from 'react';
import { api } from '@/lib/trpc';
import * as z from 'zod/v4';
import { ImageUpload } from '@/components/ui/image-upload';

// Zod schema remains the same
export const contactSchema = z.object({
  address_street: z.union([z.string(), z.null(), z.undefined()]),
  address_city: z.union([z.string(), z.null(), z.undefined()]),
  address_postal_code: z.union([z.string(), z.null(), z.undefined()]),
  address_country: z.union([z.string(), z.null(), z.undefined()]),
  phone_country_code: z.union([z.string(), z.null(), z.undefined()]),
  website: z.union([
    z.url({ message: 'Invalid URL format' }),
    z.literal(''),
    z.null(),
    z.undefined(),
  ]),
  social_handles: z.union([z.array(z.string()), z.null(), z.undefined()]),
  tags: z.union([z.array(z.string()), z.null(), z.undefined()]),
  id: z.union([z.string().uuid(), z.undefined()]),
  full_name: z.string().min(1, 'Full name is required'),
  email: z.email('Invalid email format').min(1, 'Email is required'),
  phone: z.union([z.string(), z.null(), z.undefined()]),
  company_name: z.union([z.string(), z.null(), z.undefined()]),
  job_title: z.union([z.string(), z.null(), z.undefined()]),
  profile_image_url: z.union([z.string(), z.null(), z.undefined()]),
  source: z.union([z.string(), z.null(), z.undefined()]),
  notes: z.union([z.string(), z.null(), z.undefined()]),
  last_contacted_at: z.union([
    z
      .string()
      .refine(
        (val) =>
          val === '' ||
          val === null ||
          val === undefined ||
          (val && !isNaN(new Date(val).getTime())),
        { message: 'Invalid date format for Last Contacted At' }
      ),
    z.null(),
    z.undefined(),
  ]),
  enrichment_status: z.union([z.string(), z.null(), z.undefined()]),
  enriched_data: z.union([z.record(z.unknown()), z.null(), z.undefined()]),
});

export type ContactFormData = z.infer<typeof contactSchema>;

type RawFormData = {
  [key: string]: FormDataEntryValue | null; // FormDataEntryValue is string | File
  address_street?: string | null;
  address_city?: string | null;
  address_postal_code?: string | null;
  address_country?: string | null;
  phone_country_code?: string | null;
  website?: string | null;
  social_handles?: string | null; // Assuming comma-separated string from input
  tags?: string | null; // Assuming comma-separated string from input
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string | null;
  company_name?: string | null;
  job_title?: string | null;
  profile_image_url?: string | null;
  source?: string | null;
  notes?: string | null;
  last_contacted_at?: string | null;
  // enrichment_status and enriched_data are not from form entries
};

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
  <input
    id={id}
    name={id}
    {...props}
    className='form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-800 focus:ring-1 focus:ring-teal-400 transition-colors sm:text-sm'
  />
);

const FormTextarea = ({ id, ...props }: React.ComponentProps<'textarea'>) => (
  <textarea
    id={id}
    name={id}
    {...props}
    className='form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-800 focus:ring-1 focus:ring-teal-400 transition-colors sm:text-sm'
  />
);

const FormLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className='block text-sm font-medium text-gray-700'>
    {children}
  </label>
);

interface FieldErrorProps {
  message?: string | undefined;
}

const FieldError = ({ message }: FieldErrorProps) =>
  message ? <p className='mt-1 text-sm text-red-600'>{message}</p> : null;

export function ContactForm({
  isOpen,
  initialData,
  onClose,
  isSubmitting,
  editingContactId,
}: ContactFormProps) {
  const utils = api.useUtils();

  const [formData, setFormData] = useState<ContactFormData>(
    initialData ?? {
      address_street: '',
      address_city: '',
      address_postal_code: '',
      address_country: '',
      phone_country_code: '',
      website: '',
      social_handles: [],
      tags: [],
      id: undefined,
      full_name: '',
      email: '',
      phone: '',
      company_name: '',
      job_title: '',
      profile_image_url: '',
      source: '',
      notes: '',
      last_contacted_at: '',
      enrichment_status: '',
      enriched_data: null,
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const createContact = api.contacts.save.useMutation({
    onSuccess: () => {
      void utils.contacts.list.invalidate();
      onClose();
    },
    onError: (error) => console.error('Create contact error:', error),
  });

  const saveContact = api.contacts.save.useMutation({
    onSuccess: () => {
      void utils.contacts.list.invalidate();
      if (editingContactId) {
        void utils.contacts.getById.invalidate({ contactId: editingContactId });
      }
      onClose();
    },
    onError: (error) => console.error('Save contact error:', error),
  });

  const submitAction = async (
    _prevState: { success: boolean; message: string; errors: Record<string, string[]> },
    formDataFromForm: FormData
  ): Promise<{ success: boolean; message: string; errors: Record<string, string[]> }> => {
    try {
      const rawData = Object.fromEntries(formDataFromForm.entries()) as RawFormData;
      const processedData: ContactFormData = {
        ...formData, // Start with existing formData to include non-form fields like enrichment_status
        ...rawData, // Override with raw form data
        profile_image_url: formData.profile_image_url, // Keep the state value for image URL
        social_handles: rawData['social_handles']
          ? rawData['social_handles']
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        tags: rawData['tags']
          ? rawData['tags']
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        // Use nullish coalescing for fields that can be null or undefined
        phone: rawData['phone'] ?? null,
        company_name: rawData['company_name'] ?? null,
        job_title: rawData['job_title'] ?? null,
        website: rawData['website'] ?? null,
        address_street: rawData['address_street'] ?? null,
        address_city: rawData['address_city'] ?? null,
        address_postal_code: rawData['address_postal_code'] ?? null,
        address_country: rawData['address_country'] ?? null,
        phone_country_code: rawData['phone_country_code'] ?? null,
        source: rawData['source'] ?? null,
        notes: rawData['notes'] ?? null,
        last_contacted_at: rawData['last_contacted_at'] ?? null,
        // Ensure id is included if editing
        id: editingContactId ?? undefined,
        // Keep existing values for fields not in the form, like enrichment_status and enriched_data
        enrichment_status: formData.enrichment_status,
        enriched_data: formData.enriched_data,
      };

      // Ensure array fields are explicitly arrays, even if empty
      processedData.social_handles ??= [];
      processedData.tags ??= [];

      const validatedData = contactSchema.parse(processedData);

      if (editingContactId) {
        await saveContact.mutateAsync({ id: editingContactId, ...validatedData });
      } else {
        await createContact.mutateAsync(validatedData);
      }

      return {
        success: true,
        message: editingContactId
          ? 'Contact updated successfully!'
          : 'Contact created successfully!',
        errors: {},
      };
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        const typedErrors: Record<string, string[]> = {};
        Object.entries(fieldErrors).forEach(([key, value]) => {
          if (value) {
            typedErrors[key] = Array.isArray(value) ? value : [String(value)];
          }
        });
        return { success: false, message: 'Please fix the errors below.', errors: typedErrors };
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to save contact.';
      return { success: false, message: errorMessage, errors: {} };
    }
  };

  type FormErrors = Record<string, string[]>;

  type FormState = {
    success: boolean;
    message: string;
    errors: FormErrors;
  };

  const [state, formAction, isPending] = useActionState<FormState, FormData>(submitAction, {
    success: false,
    message: '',
    errors: {},
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataEntries = new FormData(e.currentTarget);
    formAction(formDataEntries);
  };

  // Helper function to safely get error messages
  const getErrorMessage = (field: string): string | undefined => {
    return state?.errors?.[field]?.[0];
  };

  const handleInputChange = (field: keyof ContactFormData, value: string | string[] | null) => {
    setFormData((prev: ContactFormData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayFieldBlur = (field: 'social_handles' | 'tags', value: string) => {
    const arrayValue = value
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean);
    handleInputChange(field, arrayValue);
  };

  const handleImageChange = (url: string | null) => {
    handleInputChange('profile_image_url', url);
  };

  const isLoading = isPending || isSubmitting || createContact.isPending || saveContact.isPending;

  return (
    <div
      className={`mb-8 bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen
          ? 'opacity-100 max-h-[2000px] border border-gray-200'
          : 'opacity-0 max-h-0 overflow-hidden border-0'
      }`}
    >
      {/* Header with Title and Action Buttons */}
      <div className='bg-teal-800 text-white px-6 py-3 flex justify-between items-center'>
        <h2 className='text-xl font-semibold flex items-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 mr-3'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            {editingContactId ? (
              <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
            ) : (
              <path d='M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z' />
            )}
          </svg>
          {editingContactId ? 'Edit Contact' : 'Add New Contact'}
        </h2>
        <div className='flex items-center gap-x-2'>
          <button
            type='button'
            onClick={onClose}
            disabled={isLoading}
            className='rounded-md px-3 py-2 text-sm font-semibold hover:bg-teal-700/50 transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            form='contact-form'
            disabled={isLoading}
            className='rounded-md bg-white text-teal-800 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-teal-100 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50 transition-colors'
          >
            {isLoading ? 'Processing...' : editingContactId ? 'Save Changes' : 'Create Contact'}
          </button>
        </div>
      </div>

      {/* Form Body */}
      <div className='p-6'>
        {state.message && (
          <div
            className={`mb-4 p-3 border rounded-md flex items-center text-sm ${
              state.success
                ? 'bg-teal-50 border-teal-200 text-teal-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {state.message}
          </div>
        )}

        <form id='contact-form' onSubmit={handleSubmit} className='w-full'>
          {editingContactId && <input type='hidden' name='id' value={editingContactId} />}

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8'>
            {/* === COLUMN 1: PRIMARY INFO === */}
            <div className='space-y-6 lg:pr-8'>
              <div className='space-y-4'>
                <FormLabel htmlFor='profile_image_url'>Profile Photo</FormLabel>
                <ImageUpload
                  value={formData.profile_image_url ?? null}
                  onChange={handleImageChange}
                  disabled={isLoading}
                  contactId={editingContactId ?? undefined}
                />
                <FieldError message={getErrorMessage('profile_image_url')} />
              </div>

              <div className='space-y-4 pt-4 border-t border-gray-200'>
                <h3 className='text-base font-semibold text-gray-800'>Contact & Professional</h3>
                <div>
                  <FormLabel htmlFor='full_name'>Full Name *</FormLabel>
                  <FormInput
                    id='full_name'
                    type='text'
                    required
                    defaultValue={formData.full_name}
                  />
                  <FieldError message={getErrorMessage('full_name')} />
                </div>
                <div>
                  <FormLabel htmlFor='email'>Email *</FormLabel>
                  <FormInput id='email' type='email' required defaultValue={formData.email} />
                  <FieldError message={getErrorMessage('email')} />
                </div>
                <div>
                  <FormLabel htmlFor='phone'>Phone</FormLabel>
                  <FormInput id='phone' type='text' defaultValue={formData.phone ?? ''} />
                  <FieldError message={state.errors?.['phone']?.[0]} />
                </div>
                <div>
                  <FormLabel htmlFor='company_name'>Company</FormLabel>
                  <FormInput
                    id='company_name'
                    type='text'
                    defaultValue={formData.company_name ?? ''}
                  />
                  <FieldError message={getErrorMessage('company_name')} />
                </div>
                <div>
                  <FormLabel htmlFor='job_title'>Job Title</FormLabel>
                  <FormInput id='job_title' type='text' defaultValue={formData.job_title ?? ''} />
                  <FieldError message={getErrorMessage('job_title')} />
                </div>
              </div>
            </div>

            {/* === COLUMN 2: LOCATION & ONLINE PRESENCE === */}
            <div className='space-y-6 pt-6 md:pt-0 lg:px-8 lg:border-l lg:border-r border-gray-200'>
              <div className='space-y-4'>
                <h3 className='text-base font-semibold text-gray-800'>Location</h3>
                <div>
                  <FormLabel htmlFor='address_street'>Street address</FormLabel>
                  <FormInput
                    type='text'
                    id='address_street'
                    defaultValue={formData.address_street ?? ''}
                  />
                  <FieldError message={getErrorMessage('address_street')} />
                </div>
                <div>
                  <FormLabel htmlFor='address_city'>City</FormLabel>
                  <FormInput
                    type='text'
                    id='address_city'
                    defaultValue={formData.address_city ?? ''}
                  />
                  <FieldError message={getErrorMessage('address_city')} />
                </div>
                <div>
                  <FormLabel htmlFor='address_postal_code'>ZIP / Postal code</FormLabel>
                  <FormInput
                    type='text'
                    id='address_postal_code'
                    defaultValue={formData.address_postal_code ?? ''}
                  />
                  <FieldError message={getErrorMessage('address_postal_code')} />
                </div>
                <div>
                  <FormLabel htmlFor='address_country'>Country</FormLabel>
                  <FormInput
                    type='text'
                    id='address_country'
                    defaultValue={formData.address_country ?? ''}
                  />
                  <FieldError message={getErrorMessage('address_country')} />
                </div>
              </div>
              <div className='space-y-4 pt-4 border-t border-gray-200'>
                <h3 className='text-base font-semibold text-gray-800'>Online Presence</h3>
                <div>
                  <FormLabel htmlFor='website'>Website</FormLabel>
                  <FormInput id='website' type='text' defaultValue={formData.website ?? ''} />
                  <FieldError message={getErrorMessage('website')} />
                </div>
                <div>
                  <FormLabel htmlFor='social_handles'>Social Handles (comma-separated)</FormLabel>
                  <FormInput
                    id='social_handles'
                    type='text'
                    defaultValue={formData.social_handles?.join(', ') ?? ''}
                    onBlur={(e) => handleArrayFieldBlur('social_handles', e.target.value)}
                  />
                  <FieldError message={getErrorMessage('social_handles')} />
                </div>
              </div>
            </div>

            {/* === COLUMN 3: CRM & NOTES === */}
            <div className='space-y-6 pt-6 lg:pt-0 lg:pl-8'>
              <div className='space-y-4'>
                <h3 className='text-base font-semibold text-gray-800'>CRM Data</h3>
                <div>
                  <FormLabel htmlFor='tags'>Tags (comma-separated)</FormLabel>
                  <FormInput
                    id='tags'
                    type='text'
                    defaultValue={formData.tags?.join(', ') ?? ''}
                    onBlur={(e) => handleArrayFieldBlur('tags', e.target.value)}
                  />
                  <FieldError message={getErrorMessage('tags')} />
                </div>
                <div>
                  <FormLabel htmlFor='source'>Source</FormLabel>
                  <FormInput id='source' type='text' defaultValue={formData.source ?? ''} />
                  <FieldError message={getErrorMessage('source')} />
                </div>
                <div>
                  <FormLabel htmlFor='last_contacted_at'>Last Contacted</FormLabel>
                  <FormInput
                    id='last_contacted_at'
                    type='datetime-local'
                    defaultValue={formData.last_contacted_at ?? ''}
                  />
                  <FieldError message={getErrorMessage('last_contacted_at')} />
                </div>
              </div>

              <div className='space-y-4 pt-4 border-t border-gray-200'>
                <h3 className='text-base font-semibold text-gray-800'>Notes</h3>
                <div>
                  <FormTextarea id='notes' rows={8} defaultValue={formData.notes ?? ''} />
                  <FieldError message={getErrorMessage('notes')} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
