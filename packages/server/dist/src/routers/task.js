import { protectedProcedure, router } from '../trpc';
import { z } from 'zod';
import { TasksRepository } from '@codexcrm/db/src/repositories/tasks-repository';
import { TRPCError } from '@trpc/server';
import { TaskStatus, TaskCategory, TaskPriority } from '@codexcrm/db/src/models';
export const taskRouter = router({
    list: protectedProcedure
        .input(z.object({
        view: z.string().optional(),
        projectId: z.string().optional().nullable(),
        contactId: z.string().optional().nullable(),
    }))
        .query(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        return tasksRepo.list(ctx.user.id, input);
    }),
    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        return tasksRepo.getById(input.id);
    }),
    create: protectedProcedure
        .input(z.object({
        title: z.string(),
        notes: z.string().optional(),
        status: z.nativeEnum(TaskStatus).optional(),
        priority: z.nativeEnum(TaskPriority).optional(),
        category: z.nativeEnum(TaskCategory).optional(),
        dueDate: z.string().optional().nullable(),
        completionDate: z.string().optional().nullable(),
        contactId: z.string().optional().nullable(),
        projectId: z.string().optional().nullable(),
        headingId: z.string().optional().nullable(),
        position: z.number().optional(),
        is_repeating: z.boolean().optional(),
    }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        const taskInput = {
            title: input.title, // from input, required
            notes: input.notes, // from input, optional
            status: input.status ?? TaskStatus.TODO, // from input (optional) or default
            priority: input.priority ?? TaskPriority.NONE, // from input (optional) or default
            category: input.category ?? TaskCategory.INBOX, // from input (optional) or default
            due_date: input.dueDate, // from input, optional (camelCase from tRPC input)
            project_id: input.projectId, // from input, optional (camelCase from tRPC input)
            contact_id: input.contactId, // from input, optional (camelCase from tRPC input)
            user_id: ctx.user.id, // from context
            is_repeating: false, // default for TaskCreate
            position: 0, // default for TaskCreate (based on TaskModel.create logic)
            // repeat_rule, heading_id, id are truly optional in TaskCreate and not in input, so can be omitted
        };
        return tasksRepo.create(taskInput);
    }),
    update: protectedProcedure
        .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        notes: z.string().optional(),
        status: z.nativeEnum(TaskStatus).optional(),
        priority: z.nativeEnum(TaskPriority).optional(),
        category: z.nativeEnum(TaskCategory).optional(),
        dueDate: z.string().optional().nullable(),
        completionDate: z.string().optional().nullable(),
        contactId: z.string().optional().nullable(),
        projectId: z.string().optional().nullable(),
        headingId: z.string().optional().nullable(),
        position: z.number().optional(),
        is_repeating: z.boolean().optional(),
    }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        const { id, dueDate, completionDate, contactId, projectId, headingId, ...restOfInput } = input;
        const taskDataForUpdate = {
            id,
            ...restOfInput, // Properties like title, notes, status, priority, category, position, is_repeating
            // Conditionally add snake_case properties if their camelCase counterparts are present
            ...(dueDate !== undefined && { due_date: dueDate }),
            ...(completionDate !== undefined && { completion_date: completionDate }),
            ...(contactId !== undefined && { contact_id: contactId }),
            ...(projectId !== undefined && { project_id: projectId }),
            ...(headingId !== undefined && { heading_id: headingId }),
        };
        return tasksRepo.update(taskDataForUpdate);
    }),
    softDelete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        await tasksRepo.softDelete(input.id);
        return { success: true };
    }),
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        await tasksRepo.delete(input.id);
        return { success: true };
    }),
    restore: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        return tasksRepo.restore(input.id);
    }),
    complete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        return tasksRepo.complete(input.id);
    }),
    reopen: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        return tasksRepo.reopen(input.id);
    }),
    cancel: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        return tasksRepo.cancel(input.id);
    }),
    updatePositions: protectedProcedure
        .input(z.array(z.object({ id: z.string(), position: z.number() })))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        await tasksRepo.updatePositions(input);
        return { success: true };
    }),
    moveToCategory: protectedProcedure
        .input(z.object({ id: z.string(), category: z.nativeEnum(TaskCategory) }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        return tasksRepo.moveToCategory(input.id, input.category);
    }),
    moveToProject: protectedProcedure
        .input(z.object({
        id: z.string(),
        projectId: z.string().nullable(),
        headingId: z.string().nullable().optional(),
    }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        return tasksRepo.moveToProject(input.id, input.projectId, input.headingId);
    }),
    setDueDate: protectedProcedure
        .input(z.object({ id: z.string(), dueDate: z.string().nullable() }))
        .mutation(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        return tasksRepo.setDueDate(input.id, input.dueDate);
    }),
    getCategoryCounts: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        return tasksRepo.getCategoryCounts(ctx.user.id);
    }),
    getCategories: protectedProcedure.query(async () => {
        return Object.values(TaskCategory);
    }),
    getTasksByContactId: protectedProcedure
        .input(z.object({ contactId: z.string() }))
        .query(async ({ ctx, input }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        const tasksRepo = new TasksRepository(ctx.supabaseUser);
        return tasksRepo.getTasksByContactId(ctx.user.id, input.contactId);
    }),
});
