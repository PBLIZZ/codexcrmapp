import { z } from 'zod';
/**
 * Heading model for the Things-like task management system
 * Headings are used to organize tasks within projects
 */
export declare const HeadingSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    project_id: z.ZodString;
    position: z.ZodNumber;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    user_id: string;
    project_id: string;
    position: number;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    deleted_at?: string | null | undefined;
}, {
    id: string;
    title: string;
    user_id: string;
    project_id: string;
    position: number;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    deleted_at?: string | null | undefined;
}>;
export type Heading = z.infer<typeof HeadingSchema>;
export declare const HeadingCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    title: z.ZodString;
    project_id: z.ZodString;
    position: z.ZodNumber;
    user_id: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
    deleted_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "id" | "created_at" | "updated_at" | "deleted_at"> & {
    id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    user_id: string;
    project_id: string;
    position: number;
    id?: string | undefined;
}, {
    title: string;
    user_id: string;
    project_id: string;
    position: number;
    id?: string | undefined;
}>;
export type HeadingCreate = z.infer<typeof HeadingCreateSchema>;
export declare const HeadingUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    user_id: z.ZodOptional<z.ZodString>;
    project_id: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodNumber>;
} & {
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    title?: string | undefined;
    user_id?: string | undefined;
    project_id?: string | undefined;
    position?: number | undefined;
}, {
    id: string;
    title?: string | undefined;
    user_id?: string | undefined;
    project_id?: string | undefined;
    position?: number | undefined;
}>;
export type HeadingUpdate = z.infer<typeof HeadingUpdateSchema>;
/**
 * Heading class with validation and business logic
 */
export declare class HeadingModel {
    private data;
    constructor(data: Heading);
    get id(): string;
    get title(): string;
    get projectId(): string;
    get position(): number;
    get userId(): string;
    get createdAt(): string | undefined;
    get updatedAt(): string | undefined;
    get deletedAt(): string | null | undefined;
    getData(): Heading;
    softDelete(): void;
    restore(): void;
    update(data: Partial<HeadingUpdate>): void;
    setPosition(position: number): void;
    static create(data: HeadingCreate): HeadingModel;
    static fromDatabase(data: Heading): HeadingModel;
}
