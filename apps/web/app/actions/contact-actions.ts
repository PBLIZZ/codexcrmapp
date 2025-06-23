'use server';

import { z } from 'zod';
import { contactSchema } from '@/app/contacts/ContactForm';

export type SubmitContactActionState = {
  success: boolean;
  message: string;
  data?: z.infer<typeof contactSchema>;
  errors?: Record<string, string[]>;
};

// Server action for creating/updating contacts
export function submitContactAction(formData: FormData) {
  try {
    // Convert FormData to object
    const rawData = Object.fromEntries(formData.entries());

    // Handle arrays (social_handles, tags)
    const processedData = {
      ...rawData,
      social_handles: rawData['social_handles']
        ? (rawData['social_handles'] as string)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      tags: rawData['tags']
        ? (rawData['tags'] as string)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };

    // Validate with Zod
    const validatedData = contactSchema.parse(processedData);

    // Your database logic here
    const isEdit = validatedData.id;
    if (isEdit) {
      // Update contact
      // await updateContact(validatedData.id, validatedData);
    } else {
      // Create contact
      // await createContact(validatedData);
    }

    return {
      success: true,
      message: isEdit ? 'Contact updated successfully' : 'Contact created successfully',
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      message: 'Failed to save contact',
      errors: {},
    };
  }
}
