"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// Removed unused date utility imports
// import { formatDateForInput, parseInputDateString } from '@/lib/dateUtils';

// Zod schema for contact validation
export const contactSchema = z.object({
  id: z.string().uuid().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phone: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  profile_image_url: z.string().refine(
    (val) => {
      // Accept empty string or valid URL
      return val === "" || val === null || val === undefined || /^https?:\/\/[^\s]+$/.test(val);
    },
    {
      message: "Invalid URL for profile image. Must be a valid http:// or https:// URL or left empty.",
    }
  ).optional().nullable(),
  source: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  last_contacted_at: z.string().refine(
    (val) => {
      // Accept empty string or valid date string parseable by new Date()
      // This handles datetime-local input format (YYYY-MM-DDTHH:mm)
      return val === "" || val === null || val === undefined || (val && !isNaN(new Date(val).getTime()));
    },
    {
      message: "Invalid date format for Last Contacted At",
    }
  ).optional().nullable(),
  enrichment_status: z.string().optional().nullable(),
  enriched_data: z.any().optional().nullable(), // For JSONB fields
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
  editingContactId
}: ContactFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData || {
      id: undefined,
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company_name: "",
      job_title: "",
      profile_image_url: "",
      source: "",
      notes: "",
      last_contacted_at: "",
      enrichment_status: "",
      enriched_data: null,
    }
  });

  const handleFormSubmit: SubmitHandler<ContactFormData> = async (data) => {
    await onSubmit(data);
  };
  
  return (
    <div className={`mb-8 bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'opacity-100 max-h-[1500px] border border-gray-200' : 'opacity-0 max-h-0 overflow-hidden border-0'}`}>
      <div className="bg-teal-800 text-white px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            {editingContactId ? (
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            ) : (
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
            )}
          </svg>
          {editingContactId ? "Edit Contact" : "Add New Contact"}
        </h2>
        <button 
          type="button"
          onClick={onClose}
          className="text-white hover:text-gray-200 rounded-full p-1 hover:bg-teal-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="p-6">
        {/* Form error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="first_name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("first_name")}
              />
              {errors.first_name && <p className="text-sm text-red-600">{errors.first_name.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="last_name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("last_name")}
              />
              {errors.last_name && <p className="text-sm text-red-600">{errors.last_name.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("email")}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="last_contacted_at" className="block text-sm font-medium text-gray-700">Last Contacted At</label>
              <input
                id="last_contacted_at"
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("last_contacted_at")}
              />
              {errors.last_contacted_at && <p className="text-sm text-red-600">{errors.last_contacted_at.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">Company</label>
              <input
                id="company_name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("company_name")}
              />
              {errors.company_name && <p className="text-sm text-red-600">{errors.company_name.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                id="job_title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("job_title")}
              />
              {errors.job_title && <p className="text-sm text-red-600">{errors.job_title.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="profile_image_url" className="block text-sm font-medium text-gray-700">Profile Image URL</label>
              <input
                id="profile_image_url"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("profile_image_url")}
              />
              {errors.profile_image_url && <p className="text-sm text-red-600">{errors.profile_image_url.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="source" className="block text-sm font-medium text-gray-700">Source</label>
              <input
                id="source"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("source")}
              />
              {errors.source && <p className="text-sm text-red-600">{errors.source.message}</p>}
            </div>
          </div>

          <div className="space-y-1 mt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              id="notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              {...register("notes")}
            />
            {errors.notes && <p className="text-sm text-red-600">{errors.notes.message}</p>}
          </div>
          
          <div className="flex space-x-2 justify-end pt-4 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (editingContactId ? "Update Contact" : "Save Contact")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
