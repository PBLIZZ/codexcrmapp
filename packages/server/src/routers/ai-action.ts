import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { AiActionsRepository } from '@codexcrm/database';

import { router, protectedProcedure } from '../trpc';

// Define Zod schemas for validation
const aiActionInputSchema = z.object({
  id: z.string().uuid().optional(),
  action_type: z.string(),
  contact_id: z.string().uuid(),
  session_id: z.string().uuid().optional().nullable(),
  suggestion: z.string(),
  status: z.string().default('pending'),
  priority: z.string().optional().nullable(),
  context: z.any().optional().nullable(),
  implemented: z.boolean().default(false),
  implementation_date: z.string().datetime().optional().nullable(),
  feedback: z.string().optional().nullable(),
});

const aiActionUpdateSchema = aiActionInputSchema.partial().extend({
  id: z.string().uuid(),
});

const aiActionIdSchema = z.object({
  actionId: z.string().uuid(),
});

const aiActionStatusUpdateSchema = z.object({
  actionId: z.string().uuid(),
  status: z.string(),
  feedback: z.string().optional(),
});

const aiActionImplementSchema = z.object({
  actionId: z.string().uuid(),
  feedback: z.string().optional(),
});

const aiActionFilterSchema = z.object({
  contactId: z.string().uuid().optional(),
  sessionId: z.string().uuid().optional(),
  status: z.string().optional(),
  actionType: z.string().optional(),
});

// Define the AI action router
export const aiActionRouter = router({
  // Get all AI actions
  list: protectedProcedure
    .input(aiActionFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        if (input?.contactId) {
          return await AiActionsRepository.getAiActionsByContact(input.contactId);
        }

        if (input?.sessionId) {
          return await AiActionsRepository.getAiActionsBySession(input.sessionId);
        }

        if (input?.status) {
          return await AiActionsRepository.getAiActionsByStatus(input.status);
        }

        if (input?.actionType) {
          return await AiActionsRepository.getAiActionsByType(input.actionType);
        }

        return await AiActionsRepository.getAllAiActions();
      } catch (error) {
        console.error('Error fetching AI actions:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch AI actions',
          cause: error,
        });
      }
    }),

  // Get AI action by ID
  getById: protectedProcedure
    .input(aiActionIdSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const aiAction = await AiActionsRepository.getAiActionById(input.actionId);
        
        if (!aiAction) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'AI action not found',
          });
        }

        return aiAction;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error fetching AI action by ID:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch AI action',
          cause: error,
        });
      }
    }),

  // Get AI action with details (contact and session)
  getWithDetails: protectedProcedure
    .input(aiActionIdSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const aiAction = await AiActionsRepository.getAiActionWithDetails(input.actionId);
        
        if (!aiAction) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'AI action not found',
          });
        }

        return aiAction;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error fetching AI action with details:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch AI action details',
          cause: error,
        });
      }
    }),

  // Create a new AI action
  create: protectedProcedure
    .input(aiActionInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const aiActionData = {
          ...input,
          user_id: ctx.user.id,
        };

        const aiAction = await AiActionsRepository.createAiAction(aiActionData);
        return aiAction;
      } catch (error) {
        console.error('Error creating AI action:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create AI action',
          cause: error,
        });
      }
    }),

  // Update an AI action
  update: protectedProcedure
    .input(aiActionUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const { id, ...updates } = input;
        const aiAction = await AiActionsRepository.updateAiAction(id, updates);
        return aiAction;
      } catch (error) {
        console.error('Error updating AI action:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update AI action',
          cause: error,
        });
      }
    }),

  // Delete an AI action
  delete: protectedProcedure
    .input(aiActionIdSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const success = await AiActionsRepository.deleteAiAction(input.actionId);
        return { success, actionId: input.actionId };
      } catch (error) {
        console.error('Error deleting AI action:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete AI action',
          cause: error,
        });
      }
    }),

  // Update AI action status (approve/reject)
  updateStatus: protectedProcedure
    .input(aiActionStatusUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const aiAction = await AiActionsRepository.updateAiActionStatus(
          input.actionId,
          input.status,
          input.feedback
        );
        return aiAction;
      } catch (error) {
        console.error('Error updating AI action status:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update AI action status',
          cause: error,
        });
      }
    }),

  // Mark AI action as implemented
  markImplemented: protectedProcedure
    .input(aiActionImplementSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const aiAction = await AiActionsRepository.markAiActionImplemented(
          input.actionId,
          input.feedback
        );
        return aiAction;
      } catch (error) {
        console.error('Error marking AI action as implemented:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to mark AI action as implemented',
          cause: error,
        });
      }
    }),
});