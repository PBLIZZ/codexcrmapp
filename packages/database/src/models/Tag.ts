import { z } from 'zod';

/**
 * Tag model for the Things-like task management system
 * Tags can be applied to tasks and projects
 */

// Validation schema for Tag
export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  deleted_at: z.string().datetime().nullable().optional(),
});

// Type for Tag from schema
export type Tag = z.infer<typeof TagSchema>;

// Type for creating a new Tag
export const TagCreateSchema = TagSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
}).extend({
  id: z.string().uuid().optional(),
});

export type TagCreate = z.infer<typeof TagCreateSchema>;

// Type for updating a Tag
export const TagUpdateSchema = TagCreateSchema.partial().extend({
  id: z.string().uuid(),
});

export type TagUpdate = z.infer<typeof TagUpdateSchema>;

/**
 * Tag class with validation and business logic
 */
export class TagModel {
  private data: Tag;

  constructor(data: Tag) {
    // Validate data against schema
    this.data = TagSchema.parse(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get color(): string | undefined {
    return this.data.color;
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
  getData(): Tag {
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

  // Update tag data
  update(data: Partial<TagUpdate>): void {
    // Validate update data
    const validatedData = TagUpdateSchema.partial().parse(data);
    
    // Update fields
    this.data = {
      ...this.data,
      ...validatedData,
      updated_at: new Date().toISOString(),
    };
  }

  // Static methods for creating tags
  static create(data: TagCreate): TagModel {
    const now = new Date().toISOString();
    
    const tagData: Tag = {
      ...data,
      id: data.id || crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };
    
    return new TagModel(tagData);
  }

  static fromDatabase(data: Tag): TagModel {
    return new TagModel(data);
  }
}