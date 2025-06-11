import { z } from 'zod';

/**
 * Heading model for the Things-like task management system
 * Headings are used to organize tasks within projects
 */

// Validation schema for Heading
export const HeadingSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  project_id: z.string().uuid(),
  position: z.number().int().nonnegative(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  deleted_at: z.string().datetime().nullable().optional(),
});

// Type for Heading from schema
export type Heading = z.infer<typeof HeadingSchema>;

// Type for creating a new Heading
export const HeadingCreateSchema = HeadingSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
}).extend({
  id: z.string().uuid().optional(),
});

export type HeadingCreate = z.infer<typeof HeadingCreateSchema>;

// Type for updating a Heading
export const HeadingUpdateSchema = HeadingCreateSchema.partial().extend({
  id: z.string().uuid(),
});

export type HeadingUpdate = z.infer<typeof HeadingUpdateSchema>;

/**
 * Heading class with validation and business logic
 */
export class HeadingModel {
  private data: Heading;

  constructor(data: Heading) {
    // Validate data against schema
    this.data = HeadingSchema.parse(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }

  get title(): string {
    return this.data.title;
  }

  get projectId(): string {
    return this.data.project_id;
  }

  get position(): number {
    return this.data.position;
  }

  get userId(): string {
    return this.data.user_id;
  }

  get createdAt(): string | undefined {
    return this.data.created_at;
  }

  get updatedAt(): string | undefined {
    return this.data.updated_at;
  }

  get deletedAt(): string | null | undefined {
    return this.data.deleted_at;
  }

  // Get full data
  getData(): Heading {
    return this.data;
  }

  // Business logic methods
  softDelete(): void {
    this.data.deleted_at = new Date().toISOString();
    this.data.updated_at = new Date().toISOString();
  }

  restore(): void {
    this.data.deleted_at = null;
    this.data.updated_at = new Date().toISOString();
  }

  // Update heading data
  update(data: Partial<HeadingUpdate>): void {
    // Validate update data
    const validatedData = HeadingUpdateSchema.partial().parse(data);
    
    // Update fields
    this.data = {
      ...this.data,
      ...validatedData,
      updated_at: new Date().toISOString(),
    };
  }

  // Update position
  setPosition(position: number): void {
    this.data.position = position;
    this.data.updated_at = new Date().toISOString();
  }

  // Static methods for creating headings
  static create(data: HeadingCreate): HeadingModel {
    const now = new Date().toISOString();
    
    const headingData: Heading = {
      ...data,
      id: data.id || crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };
    
    return new HeadingModel(headingData);
  }

  static fromDatabase(data: Heading): HeadingModel {
    return new HeadingModel(data);
  }
}