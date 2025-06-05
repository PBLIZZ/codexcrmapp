import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { router, protectedProcedure } from '../trpc';

export const storageRouter = router({
  // Generate a presigned upload URL for direct browser-to-storage uploads
  getUploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        contentType: z.string(),
        folderPath: z.string().default('contacts'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        // Create a unique file path
        const filePath = `${input.folderPath}/${ctx.user.id}/${input.fileName}`;

        // Generate a signed URL for direct upload
        const { data, error } = await ctx.supabaseAdmin.storage
          .from('contact-profile-photo')
          .createSignedUploadUrl(filePath);

        if (error) {
          console.error('Supabase createSignedUploadUrl error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to generate upload URL: ${error.message}`,
          });
        }

        return {
          signedUrl: data.signedUrl,
          path: data.path,
          token: data.token,
        };
      } catch (error) {
        console.error('Error generating upload URL:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to generate upload URL',
        });
      }
    }),

  // Get a private URL for a specific file
  getFileUrl: protectedProcedure
    .input(
      z.object({
        filePath: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        // Generate a signed URL for private access
        const { data, error } = await ctx.supabaseAdmin.storage
          .from('contact-profile-photo')
          .createSignedUrl(input.filePath, 3600); // URL valid for 1 hour

        if (error) {
          console.error('Supabase createSignedUrl error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to generate signed URL: ${error.message}`,
          });
        }

        return {
          signedUrl: data.signedUrl,
        };
      } catch (error) {
        console.error('Error generating signed URL:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to generate signed URL',
        });
      }
    }),

  // Delete a file from storage
  deleteFile: protectedProcedure
    .input(
      z.object({
        filePath: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        // Only allow users to delete their own files
        if (!input.filePath.includes(`/${ctx.user.id}/`)) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You can only delete your own files',
          });
        }

        // Delete the file
        const { error } = await ctx.supabaseAdmin.storage
          .from('contact-profile-photo')
          .remove([input.filePath]);

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to delete file: ${error.message}`,
          });
        }

        return { success: true };
      } catch (error) {
        console.error('Error deleting file:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error ? error.message : 'Failed to delete file',
        });
      }
    }),
});
