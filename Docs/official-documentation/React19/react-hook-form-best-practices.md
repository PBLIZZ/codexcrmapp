# React Hook Form Best Practices - Enterprise Form Management

## Document Information

- **Name**: react-hook-form-best-practices.mdc
- **Description**: Comprehensive best practices for form handling with React Hook Form in enterprise applications
- **File Patterns**: `**/*.{tsx,jsx}`
- **Always Apply**: true

## Executive Summary

This document establishes enterprise-grade standards for implementing React Hook Form, focusing on performance optimization, type safety, validation strategies, and accessibility compliance. These practices ensure consistent, maintainable, and user-friendly form experiences that align with Model Context Protocol (MCP) requirements.

## 1. Foundation and Setup

### 1.1 Professional Installation and Configuration

**Complete React Hook Form Setup:**

```bash
# Core packages
npm install react-hook-form
npm install @hookform/resolvers
npm install @hookform/devtools
npm install @hookform/error-message

# Validation libraries
npm install zod
npm install yup
npm install joi

# Additional utilities
npm install react-hook-form-persist
npm install @hookform/resolvers
```

### 1.2 TypeScript Integration

**Professional Type Setup:**

```typescript
// types/forms.ts
import { UseFormReturn, FieldValues, FieldPath, Control } from 'react-hook-form';

// Base form field props
export interface BaseFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

// Form submission states
export interface FormSubmissionState {
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
  submitCount: number;
  errors: Record<string, any>;
}

// Advanced form configuration
export interface FormConfig<T extends FieldValues> {
  defaultValues?: Partial<T>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
  shouldFocusError?: boolean;
  shouldUnregister?: boolean;
  shouldUseNativeValidation?: boolean;
  criteriaMode?: 'firstError' | 'all';
  delayError?: number;
}

// Form hook return type with additional utilities
export interface EnhancedFormReturn<T extends FieldValues> extends UseFormReturn<T> {
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  submitCount: number;
  touchedFields: Partial<Record<FieldPath<T>, boolean>>;
  dirtyFields: Partial<Record<FieldPath<T>, boolean>>;
}

// Generic form component props
export interface FormComponentProps<T extends FieldValues> {
  form: EnhancedFormReturn<T>;
  onSubmit: (data: T) => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}
```

## 2. Advanced Form Patterns

### 2.1 Professional Form Implementation

**Enterprise Form Component:**

```typescript
// components/forms/enhanced-form.tsx
import React from 'react';
import {
  useForm,
  FormProvider,
  useFormContext,
  FieldValues,
  UseFormProps,
  SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import { cn } from '@/lib/utils';

interface EnhancedFormProps<T extends FieldValues> extends UseFormProps<T> {
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
  schema?: any; // Zod schema
  className?: string;
  resetOnSubmit?: boolean;
  showDevTools?: boolean;
  'data-testid'?: string;
}

export function EnhancedForm<T extends FieldValues>({
  children,
  onSubmit,
  schema,
  className,
  resetOnSubmit = false,
  showDevTools = process.env.NODE_ENV === 'development',
  'data-testid': testId,
  ...useFormProps
}: EnhancedFormProps<T>) {
  const methods = useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    mode: 'onBlur',
    shouldFocusError: true,
    ...useFormProps,
  });

  const handleSubmit = async (data: T) => {
    try {
      await onSubmit(data);
      if (resetOnSubmit) {
        methods.reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle server errors here
      if (error instanceof Error) {
        methods.setError('root.serverError', {
          type: 'server',
          message: error.message,
        });
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className={cn('space-y-6', className)}
        noValidate
        data-testid={testId}
      >
        {children}

        {/* Display server errors */}
        {methods.formState.errors?.root?.serverError && (
          <div className='rounded-md bg-destructive/15 p-3'>
            <p className='text-sm text-destructive'>
              {methods.formState.errors.root.serverError.message}
            </p>
          </div>
        )}
      </form>

      {showDevTools && <DevTool control={methods.control} />}
    </FormProvider>
  );
}

// Professional form field wrapper
interface FormFieldWrapperProps {
  children: React.ReactNode;
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
}

export function FormFieldWrapper({
  children,
  name,
  label,
  description,
  required = false,
  className,
}: FormFieldWrapperProps) {
  const {
    formState: { errors },
    getFieldState,
  } = useFormContext();

  const fieldState = getFieldState(name);
  const error = errors[name]?.message as string | undefined;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          htmlFor={name}
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          {label}
          {required && (
            <span className='ml-1 text-destructive' aria-label='required'>
              *
            </span>
          )}
        </label>
      )}

      <div className='relative'>
        {React.cloneElement(children as React.ReactElement, {
          id: name,
          'aria-invalid': fieldState.invalid,
          'aria-describedby': description ? `${name}-description` : undefined,
        })}
      </div>

      {description && (
        <p id={`${name}-description`} className='text-sm text-muted-foreground'>
          {description}
        </p>
      )}

      {error && (
        <p className='text-sm font-medium text-destructive' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}

// Advanced controlled field component
interface ControlledFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  render: ({
    field,
    fieldState,
    formState,
  }: {
    field: any;
    fieldState: any;
    formState: any;
  }) => React.ReactElement;
}

export function ControlledField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  className,
  render,
}: ControlledFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => (
        <FormFieldWrapper
          name={name}
          label={label}
          description={description}
          required={required}
          className={className}
        >
          {render({ field, fieldState, formState })}
        </FormFieldWrapper>
      )}
    />
  );
}
```

### 2.2 Input Components with React Hook Form

**Professional Input Components:**

```typescript
// components/forms/form-inputs.tsx
import React from 'react';
import { useController, Control, FieldPath, FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@codexcrm/ui/components/ui/input';
import { Textarea } from '@codexcrm/ui/components/ui/textarea';
import { Checkbox } from '@codexcrm/ui/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@codexcrm/ui/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@codexcrm/ui/components/ui/select';

// Enhanced text input
interface FormInputProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  inputMode?: 'text' | 'email' | 'numeric' | 'tel' | 'url' | 'search';
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  disabled,
  required,
  className,
  type = 'text',
  autoComplete,
  maxLength,
  minLength,
  pattern,
  inputMode,
}: FormInputProps<T>) {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    control,
    name,
    rules: {
      required: required ? 'This field is required' : false,
      maxLength: maxLength
        ? {
            value: maxLength,
            message: `Maximum length is ${maxLength} characters`,
          }
        : undefined,
      minLength: minLength
        ? {
            value: minLength,
            message: `Minimum length is ${minLength} characters`,
          }
        : undefined,
      pattern: pattern
        ? {
            value: new RegExp(pattern),
            message: 'Invalid format',
          }
        : undefined,
    },
  });

  return (
    <FormFieldWrapper
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
    >
      <Input
        {...field}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        inputMode={inputMode}
        className={cn(invalid && 'border-destructive focus-visible:ring-destructive')}
        aria-invalid={invalid}
      />
    </FormFieldWrapper>
  );
}

// Enhanced textarea
interface FormTextareaProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  rows?: number;
  maxLength?: number;
  minLength?: number;
  resize?: boolean;
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  disabled,
  required,
  className,
  rows = 3,
  maxLength,
  minLength,
  resize = true,
}: FormTextareaProps<T>) {
  const {
    field,
    fieldState: { invalid },
  } = useController({
    control,
    name,
    rules: {
      required: required ? 'This field is required' : false,
      maxLength: maxLength
        ? {
            value: maxLength,
            message: `Maximum length is ${maxLength} characters`,
          }
        : undefined,
      minLength: minLength
        ? {
            value: minLength,
            message: `Minimum length is ${minLength} characters`,
          }
        : undefined,
    },
  });

  return (
    <FormFieldWrapper
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
    >
      <Textarea
        {...field}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          invalid && 'border-destructive focus-visible:ring-destructive',
          !resize && 'resize-none'
        )}
        aria-invalid={invalid}
      />
      {maxLength && (
        <div className='text-xs text-muted-foreground text-right mt-1'>
          {field.value?.length || 0}/{maxLength}
        </div>
      )}
    </FormFieldWrapper>
  );
}

// Enhanced select
interface FormSelectProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  allowEmpty?: boolean;
  emptyLabel?: string;
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = 'Select an option',
  disabled,
  required,
  className,
  options,
  allowEmpty = true,
  emptyLabel = 'Select...',
}: FormSelectProps<T>) {
  const {
    field,
    fieldState: { invalid },
  } = useController({
    control,
    name,
    rules: {
      required: required ? 'This field is required' : false,
    },
  });

  return (
    <FormFieldWrapper
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
    >
      <Select value={field.value || ''} onValueChange={field.onChange} disabled={disabled}>
        <SelectTrigger
          className={cn(invalid && 'border-destructive focus:ring-destructive')}
          aria-invalid={invalid}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {allowEmpty && <SelectItem value=''>{emptyLabel}</SelectItem>}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldWrapper>
  );
}

// Enhanced checkbox
interface FormCheckboxProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  checkboxLabel?: string;
}

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  required,
  className,
  checkboxLabel,
}: FormCheckboxProps<T>) {
  const {
    field: { value, onChange, ...field },
    fieldState: { invalid },
  } = useController({
    control,
    name,
    rules: {
      required: required ? 'This field must be checked' : false,
    },
  });

  return (
    <FormFieldWrapper
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
    >
      <div className='flex items-center space-x-2'>
        <Checkbox
          {...field}
          checked={value || false}
          onCheckedChange={onChange}
          disabled={disabled}
          aria-invalid={invalid}
        />
        {checkboxLabel && (
          <label
            htmlFor={name}
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            {checkboxLabel}
          </label>
        )}
      </div>
    </FormFieldWrapper>
  );
}

// Enhanced radio group
interface FormRadioGroupProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  orientation?: 'horizontal' | 'vertical';
}

export function FormRadioGroup<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  required,
  className,
  options,
  orientation = 'vertical',
}: FormRadioGroupProps<T>) {
  const {
    field,
    fieldState: { invalid },
  } = useController({
    control,
    name,
    rules: {
      required: required ? 'Please select an option' : false,
    },
  });

  return (
    <FormFieldWrapper
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
    >
      <RadioGroup
        {...field}
        disabled={disabled}
        className={cn(orientation === 'horizontal' && 'flex flex-row space-x-4')}
        aria-invalid={invalid}
      >
        {options.map((option) => (
          <div key={option.value} className='flex items-center space-x-2'>
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
              disabled={option.disabled || disabled}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
    </FormFieldWrapper>
  );
}
```

### 2.3 Advanced Form Patterns

**Complex Form Management:**

```typescript
// hooks/use-form-persistence.ts
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface FormPersistenceOptions {
  storage?: 'localStorage' | 'sessionStorage';
  exclude?: string[];
  include?: string[];
  onDataRestored?: (data: any) => void;
}

export function useFormPersistence<T>(
  form: UseFormReturn<T>,
  key: string,
  options: FormPersistenceOptions = {}
) {
  const { storage = 'localStorage', exclude = [], include, onDataRestored } = options;

  const storageAPI = storage === 'localStorage' ? localStorage : sessionStorage;

  // Save form data
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (include) {
        const filteredData = include.reduce((acc, field) => {
          if (field in data) {
            acc[field] = data[field];
          }
          return acc;
        }, {} as any);
        storageAPI.setItem(key, JSON.stringify(filteredData));
      } else {
        const filteredData = { ...data };
        exclude.forEach((field) => {
          delete filteredData[field];
        });
        storageAPI.setItem(key, JSON.stringify(filteredData));
      }
    });

    return () => subscription.unsubscribe();
  }, [form, key, include, exclude, storageAPI]);

  // Restore form data
  useEffect(() => {
    try {
      const savedData = storageAPI.getItem(key);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
        onDataRestored?.(parsedData);
      }
    } catch (error) {
      console.warn('Failed to restore form data:', error);
    }
  }, [form, key, storageAPI, onDataRestored]);

  const clearPersistedData = () => {
    storageAPI.removeItem(key);
  };

  return { clearPersistedData };
}

// hooks/use-form-auto-save.ts
import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useDebounce } from '@/hooks/use-debounce';

interface AutoSaveOptions {
  delay?: number;
  onSave?: (data: any) => Promise<void>;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export function useFormAutoSave<T>(form: UseFormReturn<T>, options: AutoSaveOptions = {}) {
  const { delay = 2000, onSave, onError, enabled = true } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const initialRender = useRef(true);

  const formData = form.watch();
  const debouncedFormData = useDebounce(formData, delay);

  useEffect(() => {
    if (!enabled || !onSave || initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (form.formState.isDirty && form.formState.isValid) {
      setIsSaving(true);

      onSave(debouncedFormData)
        .then(() => {
          setLastSaved(new Date());
          form.reset(debouncedFormData, { keepValues: true });
        })
        .catch(onError)
        .finally(() => {
          setIsSaving(false);
        });
    }
  }, [debouncedFormData, enabled, form, onSave, onError]);

  return {
    isSaving,
    lastSaved,
  };
}

// hooks/use-multi-step-form.ts
import { useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface MultiStepFormOptions<T> {
  totalSteps: number;
  validationSchemas?: Array<any>; // Zod schemas for each step
  onStepChange?: (step: number, data: T) => void;
  onComplete?: (data: T) => Promise<void>;
}

export function useMultiStepForm<T>(form: UseFormReturn<T>, options: MultiStepFormOptions<T>) {
  const { totalSteps, validationSchemas, onStepChange, onComplete } = options;

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const goToStep = useCallback(
    async (step: number) => {
      if (step < 0 || step >= totalSteps) return false;

      // Validate current step before moving
      if (validationSchemas && validationSchemas[currentStep]) {
        const isValid = await form.trigger();
        if (!isValid) return false;
      }

      const formData = form.getValues();
      setCurrentStep(step);
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      onStepChange?.(step, formData);

      return true;
    },
    [currentStep, totalSteps, validationSchemas, form, onStepChange]
  );

  const nextStep = useCallback(() => goToStep(currentStep + 1), [currentStep, goToStep]);
  const prevStep = useCallback(() => goToStep(currentStep - 1), [currentStep, goToStep]);

  const handleSubmit = useCallback(
    async (data: T) => {
      if (currentStep === totalSteps - 1) {
        await onComplete?.(data);
      } else {
        await nextStep();
      }
    },
    [currentStep, totalSteps, onComplete, nextStep]
  );

  const canGoNext = currentStep < totalSteps - 1;
  const canGoPrev = currentStep > 0;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return {
    currentStep,
    completedSteps,
    canGoNext,
    canGoPrev,
    isFirstStep,
    isLastStep,
    goToStep,
    nextStep,
    prevStep,
    handleSubmit,
    progress: ((currentStep + 1) / totalSteps) * 100,
  };
}
```

## 3. Validation Strategies

### 3.1 Zod Integration

**Professional Validation Patterns:**

```typescript
// schemas/user-schema.ts
import { z } from 'zod';

// Base validation schemas
export const userValidationSchema = z
  .object({
    // Personal information
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(/^[a-zA-Z\s]*$/, 'First name can only contain letters and spaces'),

    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces'),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .max(100, 'Email must be less than 100 characters'),

    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\+?[\d\s\-\(\)]{10,}$/.test(val),
        'Please enter a valid phone number'
      ),

    // Account information
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .regex(/^[a-zA-Z0-9_]*$/, 'Username can only contain letters, numbers, and underscores'),

    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

    confirmPassword: z.string().min(1, 'Please confirm your password'),

    // Preferences
    dateOfBirth: z
      .date()
      .optional()
      .refine((date) => !date || date <= new Date(), 'Date of birth cannot be in the future')
      .refine(
        (date) => !date || new Date().getFullYear() - date.getFullYear() >= 13,
        'You must be at least 13 years old'
      ),

    role: z.enum(['user', 'admin', 'moderator'], {
      errorMap: () => ({ message: 'Please select a valid role' }),
    }),

    permissions: z.array(z.string()).min(1, 'At least one permission must be selected').optional(),

    // Agreements
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, 'You must accept the terms and conditions'),

    marketingOptIn: z.boolean().optional(),

    // Profile information
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),

    website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),

    location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Conditional validation schemas
export const createUserSchema = userValidationSchema.omit({
  confirmPassword: true,
});

export const updateUserSchema = userValidationSchema
  .omit({
    password: true,
    confirmPassword: true,
    termsAccepted: true,
  })
  .partial();

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: userValidationSchema.shape.password,
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  });

// Dynamic validation based on conditions
export const createConditionalUserSchema = (isAdmin: boolean) => {
  const baseSchema = userValidationSchema;

  if (isAdmin) {
    return baseSchema.extend({
      permissions: z.array(z.string()).min(1, 'Admin users must have at least one permission'),
      department: z.string().min(1, 'Department is required for admin users'),
    });
  }

  return baseSchema.omit({ permissions: true });
};

// Type inference
export type UserFormData = z.infer<typeof userValidationSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

// Validation utilities
export const validateField = <T>(schema: z.ZodSchema<T>, value: T) => {
  try {
    schema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0]?.message || 'Validation failed',
      };
    }
    return { isValid: false, error: 'Validation failed' };
  }
};

export const getFieldSchema = (schema: z.ZodSchema<any>, fieldPath: string) => {
  try {
    return schema.shape[fieldPath];
  } catch {
    return null;
  }
};
```

### 3.2 Server-Side Validation Integration

**Professional Server Validation:**

```typescript
// hooks/use-server-validation.ts
import { useCallback } from 'react';
import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';

interface ServerValidationOptions<T extends FieldValues> {
  validateUrl: string;
  debounceMs?: number;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

interface ServerValidationResponse {
  isValid: boolean;
  errors?: Record<string, string[]>;
  message?: string;
}

export function useServerValidation<T extends FieldValues>(
  form: UseFormReturn<T>,
  options: ServerValidationOptions<T>
) {
  const {
    validateUrl,
    debounceMs = 500,
    validateOnBlur = true,
    validateOnChange = false,
  } = options;

  const validateField = useCallback(
    async (fieldName: FieldPath<T>, value: any) => {
      try {
        const response = await fetch(validateUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            field: fieldName,
            value,
            formData: form.getValues(),
          }),
        });

        const result: ServerValidationResponse = await response.json();

        if (!result.isValid && result.errors?.[fieldName]) {
          form.setError(fieldName, {
            type: 'server',
            message: result.errors[fieldName][0],
          });
        } else {
          form.clearErrors(fieldName);
        }

        return result;
      } catch (error) {
        console.error('Server validation error:', error);
        return { isValid: true }; // Fail silently on network errors
      }
    },
    [form, validateUrl]
  );

  const validateForm = useCallback(async () => {
    try {
      const formData = form.getValues();
      const response = await fetch(validateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      const result: ServerValidationResponse = await response.json();

      if (!result.isValid && result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          form.setError(field as FieldPath<T>, {
            type: 'server',
            message: messages[0],
          });
        });
      }

      return result;
    } catch (error) {
      console.error('Server form validation error:', error);
      return { isValid: true };
    }
  }, [form, validateUrl]);

  // Debounced validation
  const debouncedValidateField = useMemo(
    () => debounce(validateField, debounceMs),
    [validateField, debounceMs]
  );

  const createFieldValidator = useCallback(
    (fieldName: FieldPath<T>) => ({
      onBlur: validateOnBlur
        ? (e: React.FocusEvent) => debouncedValidateField(fieldName, e.target.value)
        : undefined,
      onChange: validateOnChange
        ? (value: any) => debouncedValidateField(fieldName, value)
        : undefined,
    }),
    [debouncedValidateField, validateOnBlur, validateOnChange]
  );

  return {
    validateField,
    validateForm,
    createFieldValidator,
  };
}

// Custom validation rules
export const customValidationRules = {
  uniqueEmail: (apiEndpoint: string) => ({
    validate: async (email: string) => {
      try {
        const response = await fetch(`${apiEndpoint}/check-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const result = await response.json();
        return result.isUnique || 'This email is already in use';
      } catch {
        return true; // Fail silently on network errors
      }
    },
  }),

  uniqueUsername: (apiEndpoint: string) => ({
    validate: async (username: string) => {
      try {
        const response = await fetch(`${apiEndpoint}/check-username`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });
        const result = await response.json();
        return result.isUnique || 'This username is already taken';
      } catch {
        return true;
      }
    },
  }),

  strongPassword: {
    validate: (password: string) => {
      const checks = [
        { regex: /.{8,}/, message: 'At least 8 characters' },
        { regex: /[A-Z]/, message: 'At least one uppercase letter' },
        { regex: /[a-z]/, message: 'At least one lowercase letter' },
        { regex: /\d/, message: 'At least one number' },
        { regex: /[^A-Za-z0-9]/, message: 'At least one special character' },
      ];

      const failed = checks.find((check) => !check.regex.test(password));
      return failed ? failed.message : true;
    },
  },

  fileSize: (maxSizeMB: number) => ({
    validate: (files: FileList) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      const maxSize = maxSizeMB * 1024 * 1024;
      return file.size <= maxSize || `File size must be less than ${maxSizeMB}MB`;
    },
  }),

  fileType: (allowedTypes: string[]) => ({
    validate: (files: FileList) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      return (
        allowedTypes.includes(file.type) || `File type must be one of: ${allowedTypes.join(', ')}`
      );
    },
  }),
};
```

## 4. Performance Optimization

### 4.1 Form Performance Patterns

**Optimized Form Implementation:**

```typescript
// hooks/use-optimized-form.ts
import { useMemo, useCallback } from 'react';
import { useForm, UseFormProps, FieldValues } from 'react-hook-form';

interface OptimizedFormOptions<T extends FieldValues> extends UseFormProps<T> {
  enableOptimizations?: boolean;
  watchFields?: Array<keyof T>;
  isolateFields?: Array<keyof T>;
}

export function useOptimizedForm<T extends FieldValues>(options: OptimizedFormOptions<T> = {}) {
  const {
    enableOptimizations = true,
    watchFields = [],
    isolateFields = [],
    ...formOptions
  } = options;

  // Create form with performance optimizations
  const form = useForm<T>({
    mode: 'onBlur', // Reduce validation frequency
    shouldUnregister: true, // Clean up unused fields
    shouldFocusError: true, // Improve UX
    ...formOptions,
  });

  // Memoized form methods to prevent unnecessary re-renders
  const memoizedMethods = useMemo(
    () => ({
      setValue: form.setValue,
      getValue: form.getValues,
      trigger: form.trigger,
      clearErrors: form.clearErrors,
      setError: form.setError,
      reset: form.reset,
    }),
    [form]
  );

  // Optimized field registration
  const registerField = useCallback(
    (name: keyof T, options?: any) => {
      if (enableOptimizations && isolateFields.includes(name)) {
        // Use isolated registration for frequently changing fields
        return form.register(name as string, {
          ...options,
          shouldUnregister: true,
        });
      }
      return form.register(name as string, options);
    },
    [form, enableOptimizations, isolateFields]
  );

  // Selective field watching
  const watchedValues = form.watch(watchFields as string[]);
  const watchedObject = useMemo(() => {
    return watchFields.reduce((acc, field, index) => {
      acc[field] = watchedValues[index];
      return acc;
    }, {} as Partial<T>);
  }, [watchFields, watchedValues]);

  return {
    ...form,
    ...memoizedMethods,
    registerField,
    watchedValues: watchedObject,
  };
}

// Memoized form components to prevent unnecessary re-renders
export const MemoizedFormInput = React.memo(FormInput) as typeof FormInput;
export const MemoizedFormSelect = React.memo(FormSelect) as typeof FormSelect;
export const MemoizedFormTextarea = React.memo(FormTextarea) as typeof FormTextarea;
export const MemoizedFormCheckbox = React.memo(FormCheckbox) as typeof FormCheckbox;
export const MemoizedFormRadioGroup = React.memo(FormRadioGroup) as typeof FormRadioGroup;

// Performance monitoring hook
export function useFormPerformance<T extends FieldValues>(
  form: UseFormReturn<T>,
  formName: string
) {
  const startTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);
  const validationCount = useRef<number>(0);

  // Track render count
  renderCount.current++;

  // Track validation count
  useEffect(() => {
    if (form.formState.isValidating) {
      validationCount.current++;
    }
  }, [form.formState.isValidating]);

  // Log performance metrics
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const timeElapsed = Date.now() - startTime.current;
      console.log(`Form Performance Metrics for ${formName}:`, {
        renderCount: renderCount.current,
        validationCount: validationCount.current,
        timeElapsed: `${timeElapsed}ms`,
        isDirty: form.formState.isDirty,
        isValid: form.formState.isValid,
        touchedFields: Object.keys(form.formState.touchedFields).length,
        errors: Object.keys(form.formState.errors).length,
      });
    }
  }, [form.formState, formName]);

  return {
    renderCount: renderCount.current,
    validationCount: validationCount.current,
    timeElapsed: Date.now() - startTime.current,
  };
}
```

## 5. Testing Strategies

### 5.1 Comprehensive Form Testing

**Professional Testing Implementation:**

```typescript
// __tests__/form-testing-utils.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UseFormReturn } from 'react-hook-form';
import { vi } from 'vitest';

// Form testing utilities
export const FormTestUtils = {
  // Fill form fields
  async fillForm(fields: Record<string, any>) {
    const user = userEvent.setup();

    for (const [fieldName, value] of Object.entries(fields)) {
      const field = screen.getByLabelText(new RegExp(fieldName, 'i'));

      if (field.type === 'checkbox' || field.type === 'radio') {
        if (value) {
          await user.click(field);
        }
      } else {
        await user.clear(field);
        await user.type(field, String(value));
      }
    }
  },

  // Submit form
  async submitForm() {
    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /submit|save|create/i });
    await user.click(submitButton);
  },

  // Validate error messages
  expectErrors(errors: Record<string, string>) {
    Object.entries(errors).forEach(([field, message]) => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  },

  // Validate field values
  expectFieldValues(values: Record<string, any>) {
    Object.entries(values).forEach(([fieldName, expectedValue]) => {
      const field = screen.getByLabelText(new RegExp(fieldName, 'i'));
      expect(field).toHaveValue(expectedValue);
    });
  },
};

// Mock form hook
export function createMockForm<T>(overrides: Partial<UseFormReturn<T>> = {}): UseFormReturn<T> {
  return {
    register: vi.fn(),
    unregister: vi.fn(),
    formState: {
      errors: {},
      isDirty: false,
      isValid: true,
      isSubmitting: false,
      isSubmitted: false,
      isSubmitSuccessful: false,
      submitCount: 0,
      touchedFields: {},
      dirtyFields: {},
      isValidating: false,
      defaultValues: {},
    },
    watch: vi.fn(),
    getValues: vi.fn(() => ({} as T)),
    getFieldState: vi.fn(),
    setError: vi.fn(),
    clearErrors: vi.fn(),
    setValue: vi.fn(),
    trigger: vi.fn(),
    reset: vi.fn(),
    resetField: vi.fn(),
    setFocus: vi.fn(),
    control: {} as any,
    handleSubmit: vi.fn((fn) => vi.fn()),
    ...overrides,
  };
}

// Test scenarios
describe('UserForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate required fields', async () => {
    render(<UserForm onSubmit={mockOnSubmit} />);

    await FormTestUtils.submitForm();

    FormTestUtils.expectErrors({
      firstName: 'First name is required',
      lastName: 'Last name is required',
      email: 'Email is required',
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid form data', async () => {
    render(<UserForm onSubmit={mockOnSubmit} />);

    await FormTestUtils.fillForm({
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'john@example.com',
      Username: 'johndoe',
      Password: 'SecurePass123!',
      'Confirm Password': 'SecurePass123!',
    });

    await FormTestUtils.submitForm();

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      });
    });
  });

  it('should display validation errors for invalid data', async () => {
    render(<UserForm onSubmit={mockOnSubmit} />);

    await FormTestUtils.fillForm({
      'First Name': 'A',
      Email: 'invalid-email',
      Password: '123',
    });

    // Trigger validation by blurring fields
    const firstNameField = screen.getByLabelText(/first name/i);
    fireEvent.blur(firstNameField);

    await waitFor(() => {
      FormTestUtils.expectErrors({
        'First name must be at least 2 characters': '',
        'Please enter a valid email address': '',
        'Password must be at least 8 characters': '',
      });
    });
  });

  it('should handle server validation errors', async () => {
    const serverError = 'Email already exists';
    mockOnSubmit.mockRejectedValue(new Error(serverError));

    render(<UserForm onSubmit={mockOnSubmit} />);

    await FormTestUtils.fillForm({
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'existing@example.com',
    });

    await FormTestUtils.submitForm();

    await waitFor(() => {
      expect(screen.getByText(serverError)).toBeInTheDocument();
    });
  });
});
```

## 6. Documentation and Maintenance

### 6.1 Form Documentation Standards

**Professional Documentation:**

````typescript
/**
 * UserForm Component
 *
 * A comprehensive user registration form with advanced validation,
 * accessibility features, and performance optimizations.
 *
 * @example
 * ```tsx
 * <UserForm
 *   onSubmit={handleUserSubmit}
 *   defaultValues={existingUser}
 *   mode="edit"
 * />
 * ```
 *
 * @features
 * - Real-time validation with Zod
 * - Server-side validation integration
 * - Auto-save functionality
 * - Form persistence
 * - Accessibility compliance
 * - Performance optimizations
 *
 * @validation
 * - Client-side: Zod schema validation
 * - Server-side: API endpoint validation
 * - Real-time: Field-level validation on blur
 * - Async: Username/email uniqueness checks
 */
````

This comprehensive React Hook Form best practices document establishes enterprise-grade standards for form management, ensuring consistent, performant, and accessible form experiences that align with Model Context Protocol requirements.
