import { z } from 'zod';
/**
 * ProjectTag model for the Things-like task management system
 * Represents the many-to-many relationship between projects and tags
 */
export declare const ProjectTagSchema: z.ZodObject<{
    id: z.ZodString;
    project_id: z.ZodString;
    tag_id: z.ZodString;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    user_id: string;
    project_id: string;
    tag_id: string;
    created_at?: string | undefined;
}, {
    id: string;
    user_id: string;
    project_id: string;
    tag_id: string;
    created_at?: string | undefined;
}>;
export type ProjectTag = z.infer<typeof ProjectTagSchema>;
export declare const ProjectTagCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    project_id: z.ZodString;
    tag_id: z.ZodString;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
}, "id" | "created_at"> & {
    id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user_id: string;
    project_id: string;
    tag_id: string;
    id?: string | undefined;
}, {
    user_id: string;
    project_id: string;
    tag_id: string;
    id?: string | undefined;
}>;
export type ProjectTagCreate = z.infer<typeof ProjectTagCreateSchema>;
/**
 * ProjectTag class with validation and business logic
 */
export declare class ProjectTagModel {
    private data;
    constructor(data: ProjectTag);
    get id(): string;
    get projectId(): string;
    get tagId(): string;
    get userId(): string;
    get createdAt(): string | undefined;
    getData(): ProjectTag;
    static create(data: ProjectTagCreate): ProjectTagModel;
    static fromDatabase(data: ProjectTag): ProjectTagModel;
}
