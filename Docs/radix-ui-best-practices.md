Radix UI Best Practices - Accessible Component Standards
Document Information
Name: radix-ui-best-practices.mdc
Description: Comprehensive best practices for using Radix UI components in enterprise applications
File Patterns: **/*.{tsx,jsx}
Always Apply: true
Executive Summary
This document establishes enterprise-grade standards for implementing Radix UI components, focusing on accessibility compliance, customization patterns, and professional composition techniques. These practices ensure consistent, accessible, and maintainable user interfaces that align with Model Context Protocol (MCP) requirements.
1. Foundation and Setup
1.1 Professional Installation and Configuration
Complete Radix UI Setup:
# Core primitive packages
npm install @radix-ui/react-accordion
npm install @radix-ui/react-alert-dialog
npm install @radix-ui/react-avatar
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-collapsible
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-form
npm install @radix-ui/react-hover-card
npm install @radix-ui/react-label
npm install @radix-ui/react-navigation-menu
npm install @radix-ui/react-popover
npm install @radix-ui/react-progress
npm install @radix-ui/react-radio-group
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-select
npm install @radix-ui/react-separator
npm install @radix-ui/react-slider
npm install @radix-ui/react-switch
npm install @radix-ui/react-tabs
npm install @radix-ui/react-toast
npm install @radix-ui/react-toggle
npm install @radix-ui/react-toggle-group
npm install @radix-ui/react-toolbar
npm install @radix-ui/react-tooltip

# Utility packages
npm install @radix-ui/react-compose-refs
npm install @radix-ui/react-slot
npm install @radix-ui/react-use-controllable-state
npm install @radix-ui/react-use-previous
npm install @radix-ui/react-visually-hidden

1.2 TypeScript Configuration for Radix
Professional Type Setup:

  // types/radix.d.ts
import * as React from 'react'

declare module '@radix-ui/react-*' {
  interface ComponentProps {
    'data-testid'?: string
    'data-state'?: string
    'data-orientation'?: 'horizontal' | 'vertical'
    'data-side'?: 'top' | 'right' | 'bottom' | 'left'
    'data-align'?: 'start' | 'center' | 'end'
  }
}

// Global Radix component types
export interface RadixComponentProps {
  className?: string
  asChild?: boolean
  'data-testid'?: string
}

export type RadixTriggerProps = RadixComponentProps & {
  disabled?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

export type RadixContentProps = RadixComponentProps & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  alignOffset?: number
  avoidCollisions?: boolean
  collisionPadding?: number
  sticky?: 'partial' | 'always'
}

// Compound component type helper
export type CompoundComponent<T, U = {}> = T & {
  [K in keyof U]: U[K]
}
2. Core Component Implementations
2.1 Dialog and Modal Patterns
Professional Dialog Implementation:
// components/ui/dialog.tsx
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  }
>(({ className, children, showCloseButton = true, size = 'md', ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        'rounded-lg',
        {
          'max-w-sm': size === 'sm',
          'max-w-lg': size === 'md',
          'max-w-2xl': size === 'lg',
          'max-w-4xl': size === 'xl',
          'max-w-[95vw] max-h-[95vh]': size === 'full',
        },
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// Professional usage example
interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  variant?: 'default' | 'destructive'
  loading?: boolean
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  loading = false,
}: ConfirmationDialogProps) {
  const [isConfirming, setIsConfirming] = React.useState(false)

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsConfirming(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isConfirming || loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isConfirming || loading}
            loading={isConfirming || loading}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
Use code with caution.
TypeScript
2.2 Form Components
Professional Form Implementation:
// components/ui/form.tsx
import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form'
import { cn } from '@/lib/utils'

const Form = FormProvider

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

interface FormItemContextValue {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    required?: boolean
  }
>(({ className, required, children, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        error && 'text-destructive',
        className
      )}
      htmlFor={formItemId}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-destructive" aria-label="required">
          *
        </span>
      )}
    </LabelPrimitive.Root>
  )
})
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

// Professional form example
interface UserFormData {
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  notifications: boolean
  bio?: string
}

export function UserForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<UserFormData>
  onSubmit: (data: UserFormData) => Promise<void>
}) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      notifications: true,
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormDescription>
                This will be displayed as your public name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Email Notifications</FormLabel>
                <FormDescription>
                  Receive notifications about account activity via email.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={!form.formState.isValid}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
Use code with caution.
TypeScript
2.3 Navigation Components
Professional Navigation Implementation:
// components/ui/navigation-menu.tsx
import * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { cva } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      'group flex flex-1 list-none items-center justify-center space-x-1',
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
  >
    {children}{' '}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn('absolute left-0 top-full flex justify-center')}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

// Professional navigation example
interface NavigationItem {
  title: string
  href?: string
  description?: string
  items?: NavigationItem[]
  external?: boolean
}

interface MainNavigationProps {
  items: NavigationItem[]
  className?: string
}

export function MainNavigation({ items, className }: MainNavigationProps) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {items.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.items ? (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href={item.href}
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            {item.title}
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            {item.description}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    {item.items.map((subItem, subIndex) => (
                      <ListItem
                        key={subIndex}
                        href={subItem.href}
                        title={subItem.title}
                      >
                        {subItem.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                {item.title}
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
Use code with caution.
TypeScript
3. Advanced Component Patterns
3.1 Compound Components with Radix
Professional Compound Component Implementation:
// components/ui/data-table.tsx
import * as React from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DataTableContextValue {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (column: string) => void
  selectable?: boolean
  selectedRows?: Set<string>
  onRowSelect?: (rowId: string, selected: boolean) => void
  onSelectAll?: (selected: boolean) => void
}

const DataTableContext = React.createContext<DataTableContextValue>({})

const useDataTable = () => {
  const context = React.useContext(DataTableContext)
  if (!context) {
    throw new Error('DataTable components must be used within DataTable')
  }
  return context
}

interface DataTableProps {
  children: React.ReactNode
  className?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (column: string) => void
  selectable?: boolean
  selectedRows?: Set<string>
  onRowSelect?: (rowId: string, selected: boolean) => void
  onSelectAll?: (selected: boolean) => void
}

const DataTable = React.forwardRef<
  HTMLTableElement,
  DataTableProps
>(({
  className,
  children,
  sortBy,
  sortOrder,
  onSort,
  selectable,
  selectedRows,
  onRowSelect,
  onSelectAll,
  ...props
}, ref) => {
  const contextValue: DataTableContextValue = {
    sortBy,
    sortOrder,
    onSort,
    selectable,
    selectedRows,
    onRowSelect,
    onSelectAll,
  }

  return (
    <DataTableContext.Provider value={contextValue}>
      <div className="relative w-full overflow-auto">
        <table
          ref={ref}
          className={cn('w-full caption-bottom text-sm', className)}
          {...props}
        >
          {children}
        </table>
      </div>
    </DataTableContext.Provider>
  )
})
DataTable.displayName = 'DataTable'

const DataTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
))
DataTableHeader.displayName = 'DataTableHeader'

const DataTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
DataTableBody.displayName = 'DataTableBody'

const DataTableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('bg-primary font-medium text-primary-foreground', className)}
    {...props}
  />
))
DataTableFooter.displayName = 'DataTableFooter'

const DataTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    rowId?: string
    selectable?: boolean
  }
>(({ className, rowId, selectable, ...props }, ref) => {
  const { selectedRows, onRowSelect } = useDataTable()
  const isSelected = rowId ? selectedRows?.has(rowId) : false

  const handleSelect = () => {
    if (rowId && onRowSelect) {
      onRowSelect(rowId, !isSelected)
    }
  }

  return (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-muted/50',
        isSelected && 'bg-muted',
        selectable && 'cursor-pointer',
        className
      )}
      onClick={selectable ? handleSelect : undefined}
      data-state={isSelected ? 'selected' : undefined}
      {...props}
    />
  )
})
DataTableRow.displayName = 'DataTableRow'

const DataTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    sortable?: boolean
    sortKey?: string
  }
>(({ className, children, sortable, sortKey, ...props }, ref) => {
  const { sortBy, sortOrder, onSort, selectable, selectedRows, onSelectAll } = useDataTable()
  const isSorted = sortKey && sortBy === sortKey
  const isSelectAllColumn = selectable && sortKey === 'select'

  const handleSort = () => {
    if (sortable && sortKey && onSort) {
      onSort(sortKey)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked)
    }
  }

  if (isSelectAllColumn) {
    const allSelected = selectedRows && selectedRows.size > 0
    const indeterminate = selectedRows && selectedRows.size > 0 && !allSelected

    return (
      <th
        ref={ref}
        className={cn(
          'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
          className
        )}
        {...props}
      >
        <Checkbox
          checked={allSelected}
          indeterminate={indeterminate}
          onCheckedChange={handleSelectAll}
          aria-label="Select all"
        />
      </th>
    )
  }

  return (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
        sortable && 'cursor-pointer select-none hover:text-foreground',
        className
      )}
      onClick={sortable ? handleSort : undefined}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <span>{children}</span>
        {sortable && (
          <span className="ml-2 flex-shrink-0">
            {isSorted ? (
              sortOrder === 'asc' ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )
            ) : (
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            )}
          </span>
        )}
      </div>
    </th>
  )
})
DataTableHead.displayName = 'DataTableHead'

const DataTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    rowId?: string
  }
>(({ className, rowId, children, ...props }, ref) => {
  const { selectable, selectedRows } = useDataTable()
  const isSelectColumn = selectable && props.role === 'checkbox'
  const isSelected = rowId ? selectedRows?.has(rowId) : false

  if (isSelectColumn) {
    return (
      <td
        ref={ref}
        className={cn('px-4 py-2 align-middle [&:has([role=checkbox])]:pr-0', className)}
        {...props}
      >
        <Checkbox
          checked={isSelected}
          aria-label={`Select row ${rowId}`}
          onClick={(e) => e.stopPropagation()}
        />
      </td>
    )
  }

  return (
    <td
      ref={ref}
      className={cn('px-4 py-2 align-middle', className)}
      {...props}
    >
      {children}
    </td>
  )
})
DataTableCell.displayName = 'DataTableCell'

const DataTableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
))
DataTableCaption.displayName = 'DataTableCaption'

// Professional usage example
interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  lastLogin: Date
}

interface UsersTableProps {
  users: User[]
  onUserSelect?: (userIds: string[]) => void
}

export function UsersTable({ users, onUserSelect }: UsersTableProps) {
  const [sortBy, setSortBy] = React.useState<string>('name')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc')
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const handleRowSelect = (rowId: string, selected: boolean) => {
    const newSelection = new Set(selectedRows)
    if (selected) {
      newSelection.add(rowId)
    } else {
      newSelection.delete(rowId)
    }
    setSelectedRows(newSelection)
    onUserSelect?.(Array.from(newSelection))
  }

  const handleSelectAll = (selected: boolean) => {
    const newSelection = selected ? new Set(users.map(user => user.id)) : new Set<string>()
    setSelectedRows(newSelection)
    onUserSelect?.(Array.from(newSelection))
  }

  const sortedUsers = React.useMemo(() => {
    return [...users].sort((a, b) => {
      const aValue = a[sortBy as keyof User]
      const bValue = b[sortBy as keyof User]
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [users, sortBy, sortOrder])

  return (
    <DataTable
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={handleSort}
      selectable
      selectedRows={selectedRows}
      onRowSelect={handleRowSelect}
      onSelectAll={handleSelectAll}
    >
      <DataTableHeader>
        <DataTableRow>
          <DataTableHead sortKey="select" />
          <DataTableHead sortable sortKey="name">Name</DataTableHead>
          <DataTableHead sortable sortKey="email">Email</DataTableHead>
          <DataTableHead sortable sortKey="role">Role</DataTableHead>
          <DataTableHead sortable sortKey="status">Status</DataTableHead>
          <DataTableHead sortable sortKey="lastLogin">Last Login</DataTableHead>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {sortedUsers.map((user) => (
          <DataTableRow key={user.id} rowId={user.id} selectable>
            <DataTableCell role="checkbox" rowId={user.id} />
            <DataTableCell className="font-medium">{user.name}</DataTableCell>
            <DataTableCell>{user.email}</DataTableCell>
            <DataTableCell>{user.role}</DataTableCell>
            <DataTableCell>
              <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                {user.status}
              </Badge>
            </DataTableCell>
            <DataTableCell>{user.lastLogin.toLocaleDateString()}</DataTableCell>
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  )
}

export {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableFooter,
  DataTableHead,
  DataTableRow,
  DataTableCell,
  DataTableCaption,
}
Use code with caution.
TypeScript
3.2 Custom Hooks for Radix Components
Professional Hook Implementations:
// hooks/use-radix-state.ts
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { usePrevious } from '@radix-ui/react-use-previous'
import React from 'react'

// Enhanced controllable state hook with validation
export function useValidatedControllableState<T>({
  prop,
  defaultProp,
  onChange,
  validator,
}: {
  prop?: T
  defaultProp?: T
  onChange?: (value: T) => void
  validator?: (value: T) => boolean
}) {
  const [state, setState] = useControllableState({
    prop,
    defaultProp,
    onChange,
  })

  const setValidatedState = React.useCallback((value: T) => {
    if (!validator || validator(value)) {
      setState(value)
    } else {
      console.warn('Invalid value provided:', value)
    }
  }, [setState, validator])

  return [state, setValidatedState] as const
}

// Hook for managing complex dialog states
export function useDialogState(defaultOpen = false) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const openDialog = React.useCallback(() => {
    setOpen(true)
    setError(null)
  }, [])

  const closeDialog = React.useCallback(() => {
    setOpen(false)
    setLoading(false)
    setError(null)
  }, [])

  const handleAsync = React.useCallback(async (asyncFn: () => Promise<void>) => {
    setLoading(true)
    setError(null)
    
    try {
      await asyncFn()
      closeDialog()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [closeDialog])

  return {
    open,
    loading,
    error,
    openDialog,
    closeDialog,
    handleAsync,
    setOpen,
    setLoading,
    setError,
  }
}

// Hook for managing dropdown menu state with keyboard navigation
export function useDropdownMenu() {
  const [open, setOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const itemsRef = React.useRef<(HTMLElement | null)[]>([])

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex(prev => 
          prev < itemsRef.current.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : itemsRef.current.length - 1
        )
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (selectedIndex >= 0) {
          itemsRef.current[selectedIndex]?.click()
        }
        break
      case 'Escape':
        setOpen(false)
        setSelectedIndex(-1)
        break
    }
  }, [selectedIndex])

  const registerItem = React.useCallback((element: HTMLElement | null, index: number) => {
    itemsRef.current[index] = element
  }, [])

  React.useEffect(() => {
    if (selectedIndex >= 0 && itemsRef.current[selectedIndex]) {
      itemsRef.current[selectedIndex]?.focus()
    }
  }, [selectedIndex])

  return {
    open,
    setOpen,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    registerItem,
  }
}

// Hook for managing form field state with Radix components
export function useFormField<T>({
  name,
  defaultValue,
  validate,
  required = false,
}: {
  name: string
  defaultValue?: T
  validate?: (value: T) => string | undefined
  required?: boolean
}) {
  const [value, setValue] = React.useState<T | undefined>(defaultValue)
  const [error, setError] = React.useState<string | undefined>()
  const [touched, setTouched] = React.useState(false)
  const previousValue = usePrevious(value)

  const validateField = React.useCallback((val: T | undefined) => {
    if (required && (val === undefined || val === null || val === '')) {
      return 'This field is required'
    }
    
    if (val !== undefined && validate) {
      return validate(val)
    }
    
    return undefined
  }, [required, validate])

  React.useEffect(() => {
    if (touched && value !== previousValue) {
      const validationError = validateField(value)
      setError(validationError)
    }
  }, [value, previousValue, touched, validateField])

  const handleChange = React.useCallback((newValue: T) => {
    setValue(newValue)
    if (touched) {
      const validationError = validateField(newValue)
      setError(validationError)
    }
  }, [touched, validateField])

  const handleBlur = React.useCallback(() => {
    setTouched(true)
    const validationError = validateField(value)
    setError(validationError)
  }, [value, validateField])

  const reset = React.useCallback(() => {
    setValue(defaultValue)
    setError(undefined)
    setTouched(false)
  }, [defaultValue])

  return {
    value,
    error,
    touched,
    isValid: !error && touched,
    onChange: handleChange,
    onBlur: handleBlur,
    reset,
    name,
  }
}

// Hook for managing toast notifications
export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{
    id: string
    title: string
    description?: string
    variant?: 'default' | 'destructive' | 'success' | 'warning'
    duration?: number
  }>>([])

  const addToast = React.useCallback(({
    title,
    description,
    variant = 'default',
    duration = 5000,
  }: {
    title: string
    description?: string
    variant?: 'default' | 'destructive' | 'success' | 'warning'
    duration?: number
  }) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast = { id, title, description, variant, duration }
    
    setToasts(prev => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    toast: addToast, // Alias for convenience
  }
}
Use code with caution.
TypeScript
4. Accessibility Best Practices
4.1 ARIA and Screen Reader Support
Professional Accessibility Implementation:
// components/accessible/radix-wrapper.tsx
import React from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

// Enhanced Radix components with additional accessibility features
interface AccessibleDialogProps {
  children: React.ReactNode
  title: string
  description?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: 'dialog' | 'alertdialog'
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
}

export function AccessibleDialog({
  children,
  title,
  description,
  open,
  onOpenChange,
  role = 'dialog',
  closeOnEscape = true,
  closeOnOverlayClick = true,
}: AccessibleDialogProps) {
  const titleId = React.useId()
  const descriptionId = React.useId()

  // Focus management
  const previousActiveElement = React.useRef<HTMLElement | null>(null)
  const dialogRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (open) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement
      
      // Focus the dialog
      setTimeout(() => {
        dialogRef.current?.focus()
      }, 0)
    } else {
      // Restore focus to the previously focused element
      setTimeout(() => {
        previousActiveElement.current?.focus()
      }, 0)
    }
  }, [open])

  // Escape key handler
  React.useEffect(() => {
    if (!closeOnEscape) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, closeOnEscape, onOpenChange])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role={role}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? () => onOpenChange(false) : undefined}
        aria-hidden="true"
      />
      
      {/* Dialog content */}
      <div
        ref={dialogRef}
        className="relative bg-background border rounded-lg shadow-lg max-w-md w-full mx-4 p-6"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <VisuallyHidden>
          <h2 id={titleId}>{title}</h2>
          {description && <p id={descriptionId}>{description}</p>}
        </VisuallyHidden>
        
        {children}
      </div>
    </div>
  )
}

// Accessible form field wrapper
interface AccessibleFormFieldProps {
  children: React.ReactNode
  label: string
  description?: string
  error?: string
  required?: boolean
  id?: string
}

export function AccessibleFormField({
  children,
  label,
  description,
  error,
  required = false,
  id: providedId,
}: AccessibleFormFieldProps) {
  const id = providedId || React.useId()
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && (
          <span className="ml-1 text-destructive" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-describedby': [
          description ? descriptionId : '',
          error ? errorId : '',
        ].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? 'true' : undefined,
        'aria-required': required ? 'true' : undefined,
      })}
      
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Accessible data table with proper ARIA attributes
interface AccessibleTableProps {
  children: React.ReactNode
  caption?: string
  className?: string
  sortable?: boolean
  selectable?: boolean
}

export function AccessibleTable({
  children,
  caption,
  className,
  sortable = false,
  selectable = false,
}: AccessibleTableProps) {
  return (
    <div className="overflow-auto" role="region" aria-label={caption || "Data table"}>
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        role="table"
        aria-label={caption}
      >
        {caption && (
          <caption className="mt-4 text-sm text-muted-foreground">
            {caption}
          </caption>
        )}
        {children}
      </table>
      
      {/* Screen reader instructions */}
      <VisuallyHidden>
        <div role="region" aria-live="polite" aria-label="Table instructions">
          {sortable && "Use arrow keys to navigate. Press Enter to sort columns."}
          {selectable && " Use Space to select rows."}
        </div>
      </VisuallyHidden>
    </div>
  )
}

// Accessible navigation menu with proper keyboard support
interface AccessibleMenuProps {
  children: React.ReactNode
  label: string
  orientation?: 'horizontal' | 'vertical'
}

export function AccessibleMenu({
  children,
  label,
  orientation = 'horizontal',
}: AccessibleMenuProps) {
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const itemsRef = React.useRef<(HTMLElement | null)[]>([])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const items = itemsRef.current.filter(Boolean)
    const currentIndex = focusedIndex

    switch (event.key) {
      case orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown':
        event.preventDefault()
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        setFocusedIndex(nextIndex)
        items[nextIndex]?.focus()
        break
        
      case orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp':
        event.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        setFocusedIndex(prevIndex)
        items[prevIndex]?.focus()
        break
        
      case 'Home':
        event.preventDefault()
        setFocusedIndex(0)
        items[0]?.focus()
        break
        
      case 'End':
        event.preventDefault()
        const lastIndex = items.length - 1
        setFocusedIndex(lastIndex)
        items[lastIndex]?.focus()
        break
    }
  }

  const registerItem = React.useCallback((element: HTMLElement | null, index: number) => {
    itemsRef.current[index] = element
  }, [])

  return (
    <nav
      role="menubar"
      aria-label={label}
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      className="flex"
    >
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as React.ReactElement, {
          ref: (el: HTMLElement) => registerItem(el, index),
          role: 'menuitem',
          tabIndex: focusedIndex === index ? 0 : -1,
          onFocus: () => setFocusedIndex(index),
        })
      )}
    </nav>
  )
}
Use code with caution.
TypeScript
4.2 Focus Management and Keyboard Navigation
Professional Focus Management:
// hooks/use-focus-management.ts
import React from 'react'

// Enhanced focus trap hook
export function useFocusTrap(isActive: boolean) {
  const containerRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // Focus the first element
    firstElement?.focus()

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isActive])

  return containerRef
}

// Roving tabindex hook for component groups
export function useRovingTabIndex<T extends HTMLElement>() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const itemsRef = React.useRef<T[]>([])

  const registerItem = React.useCallback((element: T | null, index: number) => {
    if (element) {
      itemsRef.current[index] = element
    }
  }, [])

  const moveFocus = React.useCallback((direction: 'next' | 'prev' | 'first' | 'last') => {
    const items = itemsRef.current
    const length = items.length

    let newIndex: number

    switch (direction) {
      case 'next':
        newIndex = currentIndex < length - 1 ? currentIndex + 1 : 0
        break
      case 'prev':
        newIndex = currentIndex > 0 ? currentIndex - 1 : length - 1
        break
      case 'first':
        newIndex = 0
        break
      case 'last':
        newIndex = length - 1
        break
      default:
        return
    }

    setCurrentIndex(newIndex)
    items[newIndex]?.focus()
  }, [currentIndex])

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        moveFocus('next')
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        moveFocus('prev')
        break
      case 'Home':
        event.preventDefault()
        moveFocus('first')
        break
      case 'End':
        event.preventDefault()
        moveFocus('last')
        break
    }
  }, [moveFocus])

  return {
    currentIndex,
    registerItem,
    handleKeyDown,
    moveFocus,
  }
}

// Hook for managing focus restoration
export function useFocusRestoration() {
  const previousActiveElement = React.useRef<HTMLElement | null>(null)

  const saveFocus = React.useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = React.useCallback(() => {
    if (previousActiveElement.current) {
      previousActiveElement.current.focus()
      previousActiveElement.current = null
    }
  }, [])

  return { saveFocus, restoreFocus }
}

// Professional accessible button component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export function AccessibleButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  icon,
  iconPosition = 'left',
  disabled,
  className,
  'aria-label': ariaLabel,
  ...props
}: AccessibleButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
        },
        {
          'h-9 px-3 text-sm rounded-md': size === 'sm',
          'h-10 px-4 py-2 text-sm rounded-md': size === 'md',
          'h-11 px-8 text-base rounded-md': size === 'lg',
        },
        className
      )}
      disabled={isDisabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      <span className={loading ? 'sr-only' : undefined}>
        {loading ? loadingText : children}
      </span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
      
      {loading && (
        <span aria-live="polite" className="sr-only">
          {loadingText}
        </span>
      )}
    </button>
  )
}
Use code with caution.
TypeScript
5. Performance and Bundle Optimization
5.1 Selective Radix Imports
Optimized Import Strategy:
// lib/radix-components.ts
// Import only the components you need to reduce bundle size

// Dialog components
export {
  Root as Dialog,
  Trigger as DialogTrigger,
  Portal as DialogPortal,
  Overlay as DialogOverlay,
  Content as DialogContent,
  Title as DialogTitle,
  Description as DialogDescription,
  Close as DialogClose,
} from '@radix-ui/react-dialog'

// Form components
export {
  Root as Form,
  Field as FormField,
  Label as FormLabel,
  Control as FormControl,
  Message as FormMessage,
  ValidityState as FormValidityState,
} from '@radix-ui/react-form'

// Navigation components
export {
  Root as NavigationMenu,
  List as NavigationMenuList,
  Item as NavigationMenuItem,
  Trigger as NavigationMenuTrigger,
  Content as NavigationMenuContent,
  Link as NavigationMenuLink,
  Indicator as NavigationMenuIndicator,
  Viewport as NavigationMenuViewport,
} from '@radix-ui/react-navigation-menu'
Use code with caution.
TypeScript
6. Testing Strategies
6.1 Testing Radix Components
Professional Testing Approach:
// __tests__/radix-components.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ConfirmationDialog } from '../components/ui/dialog'

describe('ConfirmationDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed?',
    onConfirm: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with correct ARIA attributes', () => {
    render(<ConfirmationDialog {...defaultProps} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby')
    expect(dialog).toHaveAttribute('aria-describedby')
  })

  it('should handle keyboard navigation correctly', async () => {
    render(<ConfirmationDialog {...defaultProps} />)
    
    const user = userEvent.setup()
    
    // Should focus first interactive element
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    expect(cancelButton).toHaveFocus()
    
    // Tab should move to confirm button
    await user.tab()
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toHaveFocus()
    
    // Shift+Tab should move back
    await user.tab({ shift: true })
    expect(cancelButton).toHaveFocus()
  })

  it('should close on Escape key', async () => {
    render(<ConfirmationDialog {...defaultProps} />)
    
    const user = userEvent.setup()
    await user.keyboard('{Escape}')
    
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('should handle async confirm action', async () => {
    const asyncConfirm = vi.fn().mockResolvedValue(undefined)
    render(
      <ConfirmationDialog 
        {...defaultProps} 
        onConfirm={asyncConfirm}
      />
    )
    
    const user = userEvent.setup()
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    
    await user.click(confirmButton)
    
    expect(asyncConfirm).toHaveBeenCalled()
    await waitFor(() => {
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
Use code with caution.
TypeScript
7. Documentation and Maintenance Standards
7.1 Component Documentation
Professional Documentation Template:
/**
 * ConfirmationDialog Component
 * 
 * A fully accessible confirmation dialog built on Radix UI primitives.
 * Provides consistent styling, keyboard navigation, and focus management.
 * 
 * @example
 * ```tsx
 * <ConfirmationDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Delete User"
 *   description="This action cannot be undone."
 *   variant="destructive"
 *   onConfirm={handleDelete}
 * />
 * ```
 * 
 * @features
 * - WCAG 2.1 AA compliant
 * - Keyboard navigation support
 * - Focus trap and restoration
 * - Async action handling
 * - Loading states
 * - Customizable variants
 * 
 * @accessibility
 * - Screen reader announcements
 * - Proper ARIA attributes
 * - Keyboard navigation
 * - Focus management
 * - High contrast support
 */
Use code with caution.
TypeScript
7.2 Maintenance Checklist
Quality Assurance Standards:
Daily Maintenance:
All Radix components use proper ARIA attributes
Keyboard navigation works correctly
Focus management is implemented
No accessibility violations detected
TypeScript types are properly defined
Weekly Maintenance:
Review component composition patterns
Update Radix UI versions
Test across different screen readers
Validate color contrast ratios
Check responsive behavior
Monthly Maintenance:
Comprehensive accessibility audit
Performance optimization review
Bundle size analysis
Cross-browser testing
Documentation updates
This comprehensive Radix UI best practices document establishes enterprise-grade standards for building accessible, maintainable, and professional user interface components that align with Model Context Protocol requirements.
