/**
 * TaskForm - Task Creation & Editing Form Component
 * 
 * This component handles the UI and form logic for creating and editing tasks in the CodexCRM app.
 * It integrates with react-hook-form and Zod for form validation and handles the conversion
 * between frontend camelCase properties and backend snake_case database fields.
 * 
 * Key features:
 * - Form validation with Zod schema
 * - Task property editing (title, notes, status, priority, category, etc.)
 * - Date picker for task due dates
 * - Contact selection for assigning tasks
 * - Support for both create and edit modes
 * - Proper handling of enum values (TaskStatus, TaskPriority, TaskCategory)
 * 
 * The component accepts snake_case task data (TaskOutput) from tRPC and converts it to
 * camelCase for the form, then back to the appropriate format for submission. This ensures
 * type safety throughout the application while maintaining the database structure.
 * 
 * Parent components: 
 * - ThingsMainContent (used in modals for task creation/editing)
 * - TaskDetailView (potentially used for inline editing)
 * 
 * Date: June 11, 2025
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { type AppRouter } from '@codexcrm/server/src/root';
import { type inferRouterOutputs } from '@trpc/server';
import { TaskStatus, TaskPriority, TaskCategory } from '@codexcrm/db/src/models/Task';

type RouterOutput = inferRouterOutputs<AppRouter>;
// This will be the type of a single task object returned by the `tasks.list` procedure
export type TaskOutput = RouterOutput['tasks']['list'][number];

// The actual shape of task data from the API
interface TaskData {
  id: string;
  title: string;
  notes?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  due_date?: string | null;
  contact_id?: string | null;
  // Other fields omitted for brevity
}

// Form schema
const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  category: z.nativeEnum(TaskCategory).optional(),
  color: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  contactId: z.string().optional().nullable(),
  business_impact: z.number().optional().nullable(),
  ai_generated: z.boolean().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export interface TaskFormProps {
  initialData?: TaskOutput | null;
  onSubmit: (data: TaskFormValues) => void;
  onClose: () => void;
  isSubmitting: boolean;
  error?: string | null;
  categories?: string[];
}

export function TaskForm({
  onSubmit,
  initialData,
  onClose,
  isSubmitting,
  error,
  categories = [],
}: TaskFormProps) {
  // Initialize form with default values or initial data
  // Create a properly typed version of initialData to satisfy TypeScript
  const safeInitialData = initialData as unknown as TaskData | null;
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: safeInitialData
      ? {
          title: safeInitialData.title,
          notes: safeInitialData.notes || '',
          status: safeInitialData.status,
          priority: safeInitialData.priority,
          category: safeInitialData.category || TaskCategory.INBOX,
          dueDate: safeInitialData.due_date ? new Date(safeInitialData.due_date) : null,
          contactId: safeInitialData.contact_id || null,
          // Form-only fields not in the DB model yet
          color: '',
          business_impact: null,
          ai_generated: false,
        }
      : {
          title: '',
          notes: '',
          status: TaskStatus.TODO,
          priority: TaskPriority.NONE,
          category: TaskCategory.INBOX,
          color: '',
          dueDate: null,
          contactId: null,
          business_impact: null,
          ai_generated: false,
        },
  });

  // Status options
  const statusOptions = [
    { value: TaskStatus.TODO, label: 'To Do' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TaskStatus.DONE, label: 'Done' },
    { value: TaskStatus.CANCELED, label: 'Canceled' },
  ];

  // Priority options
  const priorityOptions = [
    { value: TaskPriority.HIGH, label: 'High' },
    { value: TaskPriority.MEDIUM, label: 'Medium' },
    { value: TaskPriority.LOW, label: 'Low' },
    { value: TaskPriority.NONE, label: 'None' },
  ];

  // Color options
  const colorOptions = [
    { value: '#e2e8f0', label: 'Default' },
    { value: '#f87171', label: 'Red' },
    { value: '#fb923c', label: 'Orange' },
    { value: '#facc15', label: 'Yellow' },
    { value: '#4ade80', label: 'Green' },
    { value: '#60a5fa', label: 'Blue' },
    { value: '#a78bfa', label: 'Purple' },
    { value: '#f472b6', label: 'Pink' },
  ];

  // Business impact options
  const businessImpactOptions = [
    { value: 1, label: '1 - Very Low' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5 - Medium' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10 - Very High' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Task description"
                  className="min-h-[100px]"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === 'none-category' ? null : value)}
                value={field.value || 'none-category'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={TaskCategory.INBOX}>Inbox</SelectItem>
                  <SelectItem value={TaskCategory.TODAY}>Today</SelectItem>
                  <SelectItem value={TaskCategory.UPCOMING}>Upcoming</SelectItem>
                  <SelectItem value={TaskCategory.ANYTIME}>Anytime</SelectItem>
                  <SelectItem value={TaskCategory.SOMEDAY}>Someday</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Color */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value || '#e2e8f0')}
                value={field.value || '#e2e8f0'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: field.value || '#e2e8f0' }}
                        />
                        {colorOptions.find(c => c.value === field.value)?.label || 'Default'}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: option.value }}
                        />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Due Date */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Business Impact */}
        <FormField
          control={form.control}
          name="business_impact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Impact (1-10)</FormLabel>
              <Select
                onValueChange={(value) => {
                  try {
                    field.onChange(value === 'none' ? null : parseInt(value, 10));
                  } catch (e) {
                    console.error('Invalid number format:', value);
                    field.onChange(null);
                  }
                }}
                value={field.value?.toString() || 'none'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business impact" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none-impact">None</SelectItem>
                  {businessImpactOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Rate the business impact of this task from 1 (lowest) to 10 (highest)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Form actions */}
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Form>
  );
}