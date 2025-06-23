import { z } from 'zod';
/**
 * Tag model for the Things-like task management system
 * Tags can be applied to tasks and projects
 */
export declare const TagSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    color: z.ZodOptional<z.ZodString>;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    user_id: string;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    color?: string | undefined;
    deleted_at?: string | null | undefined;
}, {
    name: string;
    id: string;
    user_id: string;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    color?: string | undefined;
    deleted_at?: string | null | undefined;
}>;
export type Tag = z.infer<typeof TagSchema>;
export declare const TagCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    color: z.ZodOptional<z.ZodString>;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "id" | "created_at" | "updated_at" | "deleted_at"> & {
    id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    user_id: string;
    id?: string | undefined;
    color?: string | undefined;
}, {
    name: string;
    user_id: string;
    id?: string | undefined;
    color?: string | undefined;
}>;
export type TagCreate = z.infer<typeof TagCreateSchema>;
export declare const TagUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name?: string | undefined;
    user_id?: string | undefined;
    color?: string | undefined;
}, {
    id: string;
    name?: string | undefined;
    user_id?: string | undefined;
    color?: string | undefined;
}>;
export type TagUpdate = z.infer<typeof TagUpdateSchema>;
/**
 * Tag class with validation and business logic
 */
export declare class TagModel {
    private data;
    constructor(data: Tag);
    get id(): string;
    get name(): string;
    get color(): string | undefined;
    get userId(): string;
    get createdAt(): string | undefined;
    get updatedAt(): string | undefined;
    get deletedAt(): string | null | undefined;
    getData(): Tag;
    softDelete(): void;
    restore(): void;
    update(data: Partial<TagUpdate>): void;
    static create(data: TagCreate): TagModel;
    static fromDatabase(data: Tag): TagModel;
}
