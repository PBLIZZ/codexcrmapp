import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { SessionsRepository } from '@codexcrm/database';

import { router, protectedProcedure } from '@codexcrm/api/src/trpc';

// Define Zod schemas for validation
const sessionInputSchema = z.object({
  id: z.string().uuid().optional(),
  contact_id: z.string().uuid(),
  session_time: z.string().datetime(),
  session_type: z.string().optional().nullable(),
  duration_minutes: z.number().int().positive().optional().nullable(),
  location: z.string().optional().nullable(),
  virtual_meeting_link: z.string().url().optional().nullable(),
  notes: z.string().optional().nullable(),
  key_topics: z.array(z.string()).optional().nullable(),
  outcomes: z.string().optional().nullable(),
  follow_up_needed: z.boolean().optional().nullable(),
  follow_up_details: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  service_id: z.string().uuid().optional().nullable(),
  program_id: z.string().uuid().optional().nullable(),
  sentiment: z.string().optional().nullable(),
  ai_insights: z.any().optional().nullable(),
});

const sessionUpdateSchema = sessionInputSchema.partial().extend({
  id: z.string().uuid(),
});

const sessionIdSchema = z.object({
  sessionId: z.string().uuid(),
});

const sessionFilterSchema = z.object({
  contactId: z.string().uuid().optional(),
  upcoming: z.boolean().optional(),
  sessionType: z.string().optional(),
  followUpNeeded: z.boolean().optional(),
  limit: z.number().int().positive().optional(),
});

const aiInsightsSchema = z.object({
  sessionId: z.string().uuid(),
  insights: z.any(),
});

// Define the session router
export const sessionRouter = router({
  // Get all sessions
  list: protectedProcedure
    .input(sessionFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        if (input?.contactId) {
          return await SessionsRepository.getSessionsByContact(input.contactId);
        }

        if (input?.upcoming) {
          const limit = input.limit || 10;
          return await SessionsRepository.getUpcomingSessions(limit);
        }

        if (input?.sessionType) {
          return await SessionsRepository.getSessionsByType(input.sessionType);
        }

        if (input?.followUpNeeded) {
          return await SessionsRepository.getSessionsNeedingFollowUp();
        }

        return await SessionsRepository.getAllSessions();
      } catch (error) {
        console.error('Error fetching sessions:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch sessions',
          cause: error,
        });
      }
    }),

  // Get session by ID
  getById: protectedProcedure
    .input(sessionIdSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const session = await SessionsRepository.getSessionById(input.sessionId);
        
        if (!session) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Session not found',
          });
        }

        return session;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error fetching session by ID:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch session',
          cause: error,
        });
      }
    }),

  // Get session with details (contact and notes)
  getWithDetails: protectedProcedure
    .input(sessionIdSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const session = await SessionsRepository.getSessionWithDetails(input.sessionId);
        
        if (!session) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Session not found',
          });
        }

        return session;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error fetching session with details:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch session details',
          cause: error,
        });
      }
    }),

  // Create a new session
  create: protectedProcedure
    .input(sessionInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const sessionData = {
          ...input,
          user_id: ctx.user.id,
        };

        const session = await SessionsRepository.createSession(sessionData);
        return session;
      } catch (error) {
        console.error('Error creating session:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create session',
          cause: error,
        });
      }
    }),

  // Update a session
  update: protectedProcedure
    .input(sessionUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const { id, ...updates } = input;
        const session = await SessionsRepository.updateSession(id, updates);
        return session;
      } catch (error) {
        console.error('Error updating session:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update session',
          cause: error,
        });
      }
    }),

  // Delete a session
  delete: protectedProcedure
    .input(sessionIdSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const success = await SessionsRepository.deleteSession(input.sessionId);
        return { success, sessionId: input.sessionId };
      } catch (error) {
        console.error('Error deleting session:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete session',
          cause: error,
        });
      }
    }),

  // Update AI insights for a session
  updateAiInsights: protectedProcedure
    .input(aiInsightsSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const session = await SessionsRepository.updateSessionAiInsights(
          input.sessionId,
          input.insights
        );
        return session;
      } catch (error) {
        console.error('Error updating session AI insights:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update session AI insights',
          cause: error,
        });
      }
    }),
});