'use server';

import { z } from 'zod';
import { contactSchema } from '@/app/(authorisedRoute)/contacts/new/ContactForm';
import { api } from '@/lib/trpc/server-client';
import { revalidatePath } from 'next/cache';

export type SubmitContactActionState = {
  success: boolean;
  message: string;
  data?: z.infer<typeof contactSchema>;
  errors?: Record<string, string[]>;
};

// Server action for creating/updating contacts
export async function submitContactAction(formData: FormData): Promise<SubmitContactActionState> {
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
      await api.contact.update(validatedData);
    } else {
      await api.contact.create(validatedData);
    }

    revalidatePath('/contacts');

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

export async function deleteContactAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await api.contact.delete({ id });
    revalidatePath('/contacts');
    return { success: true, message: 'Contact deleted successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to delete contact' };
  }
}
