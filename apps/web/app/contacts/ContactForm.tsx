'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';

import { ImageUpload } from '@/components/ui/image-upload';
// Removed unused date utility imports
// import { formatDateForInput, parseInputDateString } from '@/lib/dateUtils';

// Zod schema for contact validation
export const contactSchema = z.object({
  // Existing fields from backend schema
  address_street: z.string().optional().nullable(),
  address_city: z.string().optional().nullable(),
  address_postal_code: z.string().optional().nullable(),
  address_country: z.string().optional().nullable(),
  phone_country_code: z.string().optional().nullable(),
  website: z.string().url({ message: "Invalid URL format" }).optional().nullable().or(z.literal('')), // Allow empty string
  social_handles: z.array(z.string()).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  id: z.string().uuid().optional(),
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  phone: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  profile_image_url: z.string().optional().nullable(), // Now just a string for storing the Supabase path
  source: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  last_contacted_at: z
    .string()
    .refine(
      (val) => {
        // Accept empty string or valid date string parseable by new Date()
        // This handles datetime-local input format (YYYY-MM-DDTHH:mm)
        return (
          val === '' ||
          val === null ||
          val === undefined ||
          (val && !isNaN(new Date(val).getTime()))
        );
      },
      {
        message: 'Invalid date format for Last Contacted At',
      }
    )
    .optional()
    .nullable(),
  enrichment_status: z.string().optional().nullable(),
  enriched_data: z.any().optional().nullable(), // For JSONB fields
  // Keep existing fields below
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

export function ContactForm({
  isOpen,
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
  error,
  editingContactId,
}: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid }, // Make sure isDirty and isValid are here
    reset,
    setValue,
    watch,
    control, // Keep control if you are using it elsewhere
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData || {
      // New fields
      address_street: '',
      address_city: '',
      address_postal_code: '',
      address_country: '',
      phone_country_code: '',
      website: '',
      social_handles: [],
      tags: [],
      // Existing fields
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
      // Keep existing fields below
    },
  });

  const handleFormSubmit: SubmitHandler<ContactFormData> = async (data) => {
    await onSubmit(data);
  };

  return (
    <div
      className={`mb-8 bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'opacity-100 max-h-[1500px] border border-gray-200' : 'opacity-0 max-h-0 overflow-hidden border-0'}`}
    >
      <div className="bg-teal-800 text-white px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-medium flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {editingContactId ? (
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            ) : (
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
            )}
          </svg>
          {editingContactId ? 'Edit Contact' : 'Add New Contact'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-white hover:text-gray-200 rounded-full p-1 hover:bg-teal-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="p-6">
        {/* Form error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Profile Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Profile Photo
            </label>
            <ImageUpload
              value={watch('profile_image_url') || null}
              onChange={(url) =>
                setValue('profile_image_url', url, { shouldValidate: true, shouldDirty: true })
              }
              disabled={isSubmitting}
              contactId={editingContactId || undefined}
            />
            {errors.profile_image_url && (
              <p className="text-sm text-red-600">{errors.profile_image_url.message}</p>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold leading-7 text-gray-900">Contact Information</h3>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="full_name" className="block text-sm font-medium leading-6 text-gray-900">
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    id="full_name"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('full_name')}
                  />
                </div>
                {errors.full_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                  Phone
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('phone')}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="phone_country_code" className="block text-sm font-medium leading-6 text-gray-900">
                  Phone Country Code
                </label>
                <div className="mt-2">
                  <input
                    id="phone_country_code"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('phone_country_code')}
                  />
                </div>
                {errors.phone_country_code && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone_country_code.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Details Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold leading-7 text-gray-900">Professional Details</h3>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="company_name" className="block text-sm font-medium leading-6 text-gray-900">
                  Company
                </label>
                <div className="mt-2">
                  <input
                    id="company_name"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('company_name')}
                  />
                </div>
                {errors.company_name && (
                  <p className="mt-2 text-sm text-red-600">{errors.company_name.message}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="job_title" className="block text-sm font-medium leading-6 text-gray-900">
                  Job Title
                </label>
                <div className="mt-2">
                  <input
                    id="job_title"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('job_title')}
                  />
                </div>
                {errors.job_title && (
                  <p className="mt-2 text-sm text-red-600">{errors.job_title.message}</p>
                )}
              </div>

              <div className="sm:col-span-full">
                <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                  Website
                </label>
                <div className="mt-2">
                  <input
                    id="website"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('website')}
                  />
                </div>
                {errors.website && (
                  <p className="mt-2 text-sm text-red-600">{errors.website.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold leading-7 text-gray-900">Address</h3>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="col-span-full">
                <label htmlFor="address_street" className="block text-sm font-medium leading-6 text-gray-900">
                  Street address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="address_street"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('address_street')}
                  />
                </div>
                {errors.address_street && (
                  <p className="mt-2 text-sm text-red-600">{errors.address_street.message}</p>
                )}
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="address_city" className="block text-sm font-medium leading-6 text-gray-900">
                  City
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="address_city"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('address_city')}
                  />
                </div>
                {errors.address_city && (
                  <p className="mt-2 text-sm text-red-600">{errors.address_city.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address_postal_code" className="block text-sm font-medium leading-6 text-gray-900">
                  ZIP / Postal code
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="address_postal_code"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('address_postal_code')}
                  />
                </div>
                {errors.address_postal_code && (
                  <p className="mt-2 text-sm text-red-600">{errors.address_postal_code.message}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address_country" className="block text-sm font-medium leading-6 text-gray-900">
                  Country
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="address_country"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('address_country')}
                  />
                </div>
                {errors.address_country && (
                  <p className="mt-2 text-sm text-red-600">{errors.address_country.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Categorization Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold leading-7 text-gray-900">Categorization</h3>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="social_handles" className="block text-sm font-medium leading-6 text-gray-900">
                  Social Handles (comma-separated)
                </label>
                <div className="mt-2">
                  <input
                    id="social_handles"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={watch('social_handles')?.join(', ') || ''}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setValue('social_handles', value.split(',').map((handle: string) => handle.trim()).filter(handle => handle !== ''), { shouldValidate: true, shouldDirty: true });
                    }}
                  />
                </div>
                {errors.social_handles && (
                  // @ts-ignore
                  <p className="mt-2 text-sm text-red-600">{errors.social_handles.message || errors.social_handles.root?.message}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="tags" className="block text-sm font-medium leading-6 text-gray-900">
                  Tags (comma-separated)
                </label>
                <div className="mt-2">
                  <input
                    id="tags"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={watch('tags')?.join(', ') || ''}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setValue('tags', value.split(',').map((tag: string) => tag.trim()).filter(tag => tag !== ''), { shouldValidate: true, shouldDirty: true });
                    }}
                  />
                </div>
                {errors.tags && (
                  // @ts-ignore
                  <p className="mt-2 text-sm text-red-600">{errors.tags.message || errors.tags.root?.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Other Information Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold leading-7 text-gray-900">Other Information</h3>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="source" className="block text-sm font-medium leading-6 text-gray-900">
                  Source
                </label>
                <div className="mt-2">
                  <input
                    id="source"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('source')}
                  />
                </div>
                {errors.source && (
                  <p className="mt-2 text-sm text-red-600">{errors.source.message}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="last_contacted_at" className="block text-sm font-medium leading-6 text-gray-900">
                  Last Contacted At
                </label>
                <div className="mt-2">
                  <input
                    id="last_contacted_at"
                    type="datetime-local"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register('last_contacted_at')}
                  />
                </div>
                {errors.last_contacted_at && (
                  <p className="mt-2 text-sm text-red-600">{errors.last_contacted_at.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold leading-7 text-gray-900">Notes</h3>
            <div className="mt-2">
              <textarea
                id="notes"
                rows={4}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register('notes')}
              />
            </div>
            {errors.notes && (
              <p className="mt-2 text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex items-center justify-end gap-x-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (typeof window !== 'undefined' && (!isDirty || !isValid))}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : editingContactId ? 'Save Changes' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
