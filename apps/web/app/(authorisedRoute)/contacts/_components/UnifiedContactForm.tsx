'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  ArrowLeft,
  Building,
  Calendar,
  Edit,
  Mail,
  Phone,
  Trash2,
  User,
  Briefcase,
  Clock,
  Tag,
  Plus,
  Save,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@codexcrm/ui';
import { ImageUpload } from '@/components/ui/image-upload';
import { ContactAvatar } from './ContactAvatar';
import { api } from '@/lib/trpc';

// Define contact modes
type ContactMode = 'view' | 'edit' | 'new';

// Contact schema for validation
const contactSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  job_title: z.string().optional(),
  profile_image_url: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  last_contacted_at: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
      },
      {
        message: 'Invalid date and time format (expected YYYY-MM-DDTHH:mm)',
      }
    ),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface UnifiedContactFormProps {
  contactId?: string;
  mode: ContactMode;
}

const TABS = {
  OVERVIEW: 'overview',
  NOTES: 'notes',
  TASKS: 'tasks',
} as const;

type TabValue = (typeof TABS)[keyof typeof TABS];

export function UnifiedContactForm({ contactId, mode }: UnifiedContactFormProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>(TABS.OVERVIEW);

  const utils = api.useUtils();

  // Fetch contact data for edit/view modes
  const {
    data: contact,
    isLoading,
    error,
  } = api.contacts.getById.useQuery(
    { contactId: contactId! },
    {
      enabled: !!contactId && mode !== 'new',
      retry: 1,
    }
  );

  // Save mutation (handles both create and update)
  const saveContact = api.contacts.save.useMutation({
    onSuccess: (savedContact) => {
      // Invalidate storage URLs if profile image was updated
      if (savedContact.profileImageUrl) {
        utils.storage.getFileUrl.invalidate({ filePath: savedContact.profileImageUrl });
      }

      if (mode === 'new') {
        router.push(`/contacts/${savedContact.id}`);
      } else {
        // Update cache data and invalidate queries
        utils.contacts.getById.setData({ contactId: contactId! }, savedContact);
        utils.contacts.list.invalidate();
        // Force refetch of contact data to ensure fresh data
        utils.contacts.getById.invalidate({ contactId: contactId! });

        if (mode === 'edit') {
          // Add a small delay to ensure cache updates are processed
          setTimeout(() => {
            router.push(`/contacts/${contactId}`);
          }, 100);
        }
      }
    },
    onError: (error) => {
      // Handle specific error cases
      if (error.data?.code === 'CONFLICT') {
        setFormError(error.message);
      } else {
        setFormError(`Error saving contact: ${error.message}`);
      }
    },
  });

  // Delete mutation
  const deleteMutation = api.contacts.delete.useMutation({
    onSuccess: () => {
      router.push('/contacts');
    },
    onError: (error) => {
      setDeleteError(`Failed to delete contact: ${error.message}`);
      setIsDeleteDialogOpen(false);
    },
  });

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
    watch,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      id: contactId,
      full_name: '',
      email: '',
      phone: '',
      company_name: '',
      job_title: '',
      profile_image_url: '',
      source: '',
      notes: '',
      last_contacted_at: '',
    },
  });

  // Update form when contact data changes (for edit/view modes)
  useEffect(() => {
    if (contact && mode !== 'new') {
      console.log('Form reset with contact data:', {
        contactId: contact.id,
        profileImageUrl: contact.profileImageUrl,
        fullName: contact.fullName,
      });

      reset({
        id: contact.id,
        full_name: contact.fullName,
        email: contact.email ?? '',
        phone: contact.phone ?? '',
        company_name: contact.companyName ?? '',
        job_title: contact.jobTitle ?? '',
        profile_image_url: contact.profileImageUrl ?? '',
        source: contact.source ?? '',
        notes: contact.notes ?? '',
        last_contacted_at: formatDateForInput(contact.lastContactedAt),
      });
    }
  }, [contact, reset, mode]);

  const onSubmit = async (data: ContactFormData) => {
    setFormError(null);

    const mutationData = {
      id: mode === 'new' ? undefined : contactId,
      fullName: data.full_name?.trim() || '',
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      companyName: data.company_name?.trim() || null,
      jobTitle: data.job_title?.trim() || null,
      profileImageUrl: data.profile_image_url?.trim() || null,
      source: data.source?.trim() || null,
      notes: data.notes?.trim() || null,
      lastContactedAt: parseInputDateString(data.last_contacted_at),
    };

    console.log('Form submission data:', {
      formData: data,
      mutationData,
      profileImageUrl: data.profile_image_url,
    });

    try {
      await saveContact.mutateAsync(mutationData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('An unexpected error occurred');
      }
      console.error('Error saving contact:', err);
    }
  };

  const handleDeleteContact = () => {
    if (contactId) {
      deleteMutation.mutate({ contactId });
    }
  };

  // Loading state for edit/view modes
  if ((mode === 'edit' || mode === 'view') && isLoading) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
        </div>
      </div>
    );
  }

  // Error state for edit/view modes
  if ((mode === 'edit' || mode === 'view') && (error || !contact)) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <Alert variant='destructive' className='max-w-4xl mx-auto'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error ? error.message : 'Contact not found'}</AlertDescription>
        </Alert>
        <div className='flex justify-center mt-8'>
          <Button variant='outline' onClick={() => router.push('/contacts')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Contacts
          </Button>
        </div>
      </div>
    );
  }

  const getTitle = () => {
    switch (mode) {
      case 'new':
        return 'New Contact';
      case 'edit':
        return `Edit ${contact?.fullName || 'Contact'}`;
      case 'view':
        return contact?.fullName || 'Contact Details';
      default:
        return 'Contact';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <div className='container mx-auto py-8 px-4'>
      {/* Delete Error Alert */}
      {deleteError && (
        <Alert variant='destructive' className='mb-6'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      {/* Header with navigation and actions */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' onClick={() => router.push('/contacts')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Contacts
          </Button>
          <h1 className='text-2xl font-bold'>{getTitle()}</h1>
        </div>

        {mode === 'view' && contact && (
          <div className='flex space-x-2'>
            <Button variant='outline' onClick={() => router.push(`/contacts/${contactId}/edit`)}>
              <Edit className='mr-2 h-4 w-4' />
              Edit Contact
            </Button>
            <Button variant='destructive' onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Form Error Alert */}
      {formError && (
        <Alert variant='destructive' className='mb-6'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      {mode === 'view' && contact ? (
        // View Mode - Display contact details in tabs
        <>
          {/* Contact Profile Card */}
          <Card className='mb-8 overflow-hidden'>
            <div className='bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative'>
              {contact.enrichmentStatus && (
                <div className='absolute top-4 right-4'>
                  <Badge variant='default'>
                    {contact.enrichmentStatus.charAt(0).toUpperCase() +
                      contact.enrichmentStatus.slice(1)}
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className='pt-0'>
              <div className='flex flex-col md:flex-row gap-6 -mt-16 mb-6'>
                <div className='flex flex-col items-center'>
                  <ContactAvatar
                    profileImageUrl={contact.profileImageUrl}
                    fullName={contact.fullName}
                    size='xl'
                    className='border-4 border-white shadow-lg'
                  />
                </div>

                <div className='flex-1 pt-4 md:pt-8'>
                  <h1 className='text-3xl font-bold mb-2'>{contact.fullName}</h1>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mt-4'>
                    {contact.email && (
                      <div className='flex items-center'>
                        <Mail className='h-4 w-4 mr-2 text-muted-foreground' />
                        <a
                          href={`mailto:${contact.email}`}
                          className='text-blue-600 hover:underline'
                        >
                          {contact.email}
                        </a>
                      </div>
                    )}

                    {contact.phone && (
                      <div className='flex items-center'>
                        <Phone className='h-4 w-4 mr-2 text-muted-foreground' />
                        <a href={`tel:${contact.phone}`} className='text-blue-600 hover:underline'>
                          {contact.phone}
                        </a>
                      </div>
                    )}

                    {contact.jobTitle && (
                      <div className='flex items-center'>
                        <Briefcase className='h-4 w-4 mr-2 text-muted-foreground' />
                        <span>{contact.jobTitle}</span>
                      </div>
                    )}

                    {contact.companyName && (
                      <div className='flex items-center'>
                        <Building className='h-4 w-4 mr-2 text-muted-foreground' />
                        <span>{contact.companyName}</span>
                      </div>
                    )}
                  </div>

                  <div className='flex flex-wrap gap-2 mt-4'>
                    {contact.source && (
                      <Badge variant='outline' className='flex items-center gap-1'>
                        <Tag className='h-3 w-3' />
                        {contact.source}
                      </Badge>
                    )}
                    {contact.lastContactedAt && (
                      <Badge variant='secondary' className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        Last contact: {formatDateTime(contact.lastContactedAt)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different sections */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabValue)}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value={TABS.OVERVIEW}>Overview</TabsTrigger>
              <TabsTrigger value={TABS.NOTES}>Notes</TabsTrigger>
              <TabsTrigger value={TABS.TASKS}>Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value={TABS.OVERVIEW} className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Complete profile information for {contact.fullName}
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-medium mb-2'>Personal Information</h3>
                    <Separator className='mb-4' />
                    <dl className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <dt className='text-sm font-medium text-muted-foreground'>Full Name</dt>
                        <dd className='mt-1'>{contact.fullName}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-muted-foreground'>Email</dt>
                        <dd className='mt-1'>{contact.email || '—'}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-muted-foreground'>Phone</dt>
                        <dd className='mt-1'>{contact.phone || '—'}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className='text-lg font-medium mb-2'>Professional Information</h3>
                    <Separator className='mb-4' />
                    <dl className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <dt className='text-sm font-medium text-muted-foreground'>Company</dt>
                        <dd className='mt-1'>{contact.companyName || '—'}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-muted-foreground'>Job Title</dt>
                        <dd className='mt-1'>{contact.jobTitle || '—'}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className='text-lg font-medium mb-2'>Additional Information</h3>
                    <Separator className='mb-4' />
                    <dl className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <dt className='text-sm font-medium text-muted-foreground'>Source</dt>
                        <dd className='mt-1'>{contact.source || '—'}</dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-muted-foreground'>
                          Last Contacted
                        </dt>
                        <dd className='mt-1'>
                          {contact.lastContactedAt ? formatDateTime(contact.lastContactedAt) : '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-muted-foreground'>Created</dt>
                        <dd className='mt-1'>
                          {contact.createdAt ? formatDateTime(contact.createdAt) : '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className='text-sm font-medium text-muted-foreground'>Updated</dt>
                        <dd className='mt-1'>
                          {contact.updatedAt ? formatDateTime(contact.updatedAt) : '—'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value={TABS.NOTES}>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div>
                    <CardTitle>Notes</CardTitle>
                    <CardDescription>Important information about this contact</CardDescription>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => router.push(`/contacts/${contactId}/edit`)}
                  >
                    <Edit className='mr-2 h-4 w-4' />
                    Edit Notes
                  </Button>
                </CardHeader>
                <CardContent>
                  {contact.notes ? (
                    <div className='prose max-w-none bg-muted/30 p-4 rounded-md'>
                      <p className='whitespace-pre-wrap'>{contact.notes}</p>
                    </div>
                  ) : (
                    <div className='text-center py-12'>
                      <User className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                      <h3 className='text-lg font-medium'>No notes yet</h3>
                      <p className='text-muted-foreground mt-1'>
                        Click the Edit button to add notes about this contact.
                      </p>
                      <Button
                        className='mt-4'
                        onClick={() => router.push(`/contacts/${contactId}/edit`)}
                      >
                        <Edit className='mr-2 h-4 w-4' />
                        Add Notes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value={TABS.TASKS}>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div>
                    <CardTitle>Tasks</CardTitle>
                    <CardDescription>
                      Upcoming and completed tasks related to this contact
                    </CardDescription>
                  </div>
                  <Button variant='outline' size='sm' disabled>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Task
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className='text-center py-12'>
                    <Calendar className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                    <h3 className='text-lg font-medium'>Task Management Coming Soon</h3>
                    <p className='text-muted-foreground mt-1'>
                      This feature will be available in a future update.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        // Edit/New Mode - Show form
        <Card>
          <CardHeader>
            <CardTitle>{mode === 'new' ? 'Create New Contact' : 'Edit Contact'}</CardTitle>
            <CardDescription>
              {mode === 'new'
                ? 'Enter the details for the new contact'
                : `Update information for ${contact?.fullName || 'this contact'}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Basic Information Section */}
                <div className='space-y-2 md:col-span-2'>
                  <h3 className='text-lg font-medium'>Basic Information</h3>
                  <Separator />
                </div>

                <div className='space-y-2 md:col-span-2'>
                  <Label htmlFor='full_name'>Full Name *</Label>
                  <Input
                    id='full_name'
                    {...register('full_name')}
                    className={errors.full_name ? 'border-destructive' : ''}
                    readOnly={isReadOnly}
                  />
                  {errors.full_name && (
                    <p className='text-sm text-destructive'>{errors.full_name.message}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                    readOnly={isReadOnly}
                  />
                  {errors.email && (
                    <p className='text-sm text-destructive'>{errors.email.message}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='phone'>Phone Number</Label>
                  <Input
                    id='phone'
                    {...register('phone')}
                    className={errors.phone ? 'border-destructive' : ''}
                    readOnly={isReadOnly}
                  />
                  {errors.phone && (
                    <p className='text-sm text-destructive'>{errors.phone.message}</p>
                  )}
                </div>

                {/* Profile Photo Upload */}
                <div className='space-y-2 md:col-span-2'>
                  <Label>Profile Photo</Label>
                  <ImageUpload
                    value={watch('profile_image_url') || null}
                    onChange={(url) =>
                      setValue('profile_image_url', url || undefined, { shouldValidate: true })
                    }
                    disabled={isSubmitting || isReadOnly}
                    contactId={contact?.id || undefined}
                  />
                  {errors.profile_image_url && (
                    <p className='text-sm text-destructive'>{errors.profile_image_url.message}</p>
                  )}
                </div>

                {/* Professional Information Section */}
                <div className='space-y-2 md:col-span-2 pt-4'>
                  <h3 className='text-lg font-medium'>Professional Information</h3>
                  <Separator />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='company_name'>Company</Label>
                  <Input
                    id='company_name'
                    {...register('company_name')}
                    className={errors.company_name ? 'border-destructive' : ''}
                    readOnly={isReadOnly}
                  />
                  {errors.company_name && (
                    <p className='text-sm text-destructive'>{errors.company_name.message}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='job_title'>Job Title</Label>
                  <Input
                    id='job_title'
                    {...register('job_title')}
                    className={errors.job_title ? 'border-destructive' : ''}
                    readOnly={isReadOnly}
                  />
                  {errors.job_title && (
                    <p className='text-sm text-destructive'>{errors.job_title.message}</p>
                  )}
                </div>

                {/* Additional Information Section */}
                <div className='space-y-2 md:col-span-2 pt-4'>
                  <h3 className='text-lg font-medium'>Additional Information</h3>
                  <Separator />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='source'>Source</Label>
                  <Input
                    id='source'
                    {...register('source')}
                    className={errors.source ? 'border-destructive' : ''}
                    placeholder='How did you meet this contact?'
                    readOnly={isReadOnly}
                  />
                  {errors.source && (
                    <p className='text-sm text-destructive'>{errors.source.message}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='last_contacted_at'>Last Contacted</Label>
                  <Input
                    id='last_contacted_at'
                    type='datetime-local'
                    {...register('last_contacted_at')}
                    readOnly={isReadOnly}
                  />
                  {errors.last_contacted_at && (
                    <p className='text-sm text-destructive'>{errors.last_contacted_at.message}</p>
                  )}
                </div>

                <div className='space-y-2 md:col-span-2'>
                  <Label htmlFor='notes'>Notes</Label>
                  <Textarea
                    id='notes'
                    {...register('notes')}
                    className={`min-h-[100px] ${errors.notes ? 'border-destructive' : ''}`}
                    placeholder='Add any notes about this contact...'
                    readOnly={isReadOnly}
                  />
                  {errors.notes && (
                    <p className='text-sm text-destructive'>{errors.notes.message}</p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              {!isReadOnly && (
                <div className='flex justify-end space-x-2 pt-6 border-t'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => router.push('/contacts')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isSubmitting || !isDirty}>
                    {isSubmitting ? (
                      <>
                        <div className='animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full'></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className='mr-2 h-4 w-4' />
                        {mode === 'new' ? 'Create Contact' : 'Update Contact'}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <p className='text-sm text-muted-foreground'>
              This will permanently delete{' '}
              <span className='font-semibold'>{contact?.fullName}</span> and all associated data.
            </p>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDeleteContact}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <div className='animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full'></div>
                  Deleting...
                </>
              ) : (
                <>Delete Contact</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatDateForInput(dateTime: Date | null): string {
  if (!dateTime) return '';
  return dateTime.toISOString().slice(0, 16);
}

function parseInputDateString(dateString: string | null | undefined): Date | null {
  if (!dateString || dateString.trim() === '') return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

function formatDateTime(dateTime: string | Date | null): string {
  if (!dateTime) return 'Never';
  const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
