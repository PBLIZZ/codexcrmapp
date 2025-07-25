'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  ArrowLeft,
  Building,
  ChevronDown,
  ChevronRight,
  Heart,
  Mail,
  Save,
  User,
  X,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
} from '@codexcrm/ui';
import { ImageUpload } from '@/components/ui/image-upload';
import { api } from '@/lib/trpc';
import { CONTACT_GROUPS } from '@/lib/constants/contact-groups';

// Enhanced schema with better validation for editing contacts
const editContactSchema = z.object({
  id: z.string(),
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name is too long')
    .refine((val) => val.trim().length > 0, 'Full name cannot be just whitespace'),
  email: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val || val === '') return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val.trim());
    }, 'Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true;
      const phoneRegex = /\d/;
      return phoneRegex.test(val.trim());
    }, 'Phone number must contain at least one digit'),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  website: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val || val === '') return true;
      const url = val.trim();

      // Allow common website formats - we'll auto-fix them in the submit handler
      if (url.includes('.') && url.length > 3) {
        return true;
      }

      return false;
    }, 'Please enter a valid website address (e.g., example.com or https://example.com)'),
  profileImageUrl: z.string().optional(),

  // Address fields
  addressStreet: z.string().optional(),
  addressCity: z.string().optional(),
  addressPostalCode: z.string().optional(),
  addressCountry: z.string().optional(),

  // Business fields
  notes: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true;
      // Check for special characters that might cause issues
      const hasProblematicChars = /[<>"'&]/.test(val);
      return !hasProblematicChars;
    }, 'Notes cannot contain special characters: < > " \' &'),
  source: z.string().optional(),
  referralSource: z.string().optional(),
  relationshipStatus: z.string().optional(),
  lastContactedAt: z.string().optional(),

  // Wellness fields
  wellnessStatus: z.string().optional(),
  wellnessJourneyStage: z.string().optional(),
  clientSince: z.string().optional(),

  // Array fields (handled separately)
  tags: z.array(z.string()).optional(),
  socialHandles: z.array(z.string()).optional(),
  wellnessGoals: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
});

type EditContactFormData = z.infer<typeof editContactSchema>;

interface EditContactFormProps {
  contactId: string;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
  badge,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant='ghost'
          className='w-full justify-between p-4 h-auto hover:bg-accent/50 rounded-lg border'
        >
          <div className='flex items-center gap-3'>
            {icon}
            <span className='font-medium'>{title}</span>
            {badge && (
              <Badge variant='secondary' className='ml-2'>
                {badge}
              </Badge>
            )}
          </div>
          {isOpen ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className='px-4 pb-4'>{children}</CollapsibleContent>
    </Collapsible>
  );
}

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <div className='space-y-2'>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        onBlur={() => {
          if (inputValue.trim()) {
            addTag(inputValue);
          }
        }}
      />
      <div className='flex flex-wrap gap-2 min-h-[32px]'>
        {value.map((tag, index) => (
          <Badge key={index} variant='secondary' className='flex items-center gap-1'>
            {tag}
            <X
              className='h-3 w-3 cursor-pointer hover:text-destructive'
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function EditContactForm({ contactId }: EditContactFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  const utils = api.useUtils();

  // Fetch contact data
  const {
    data: contact,
    isLoading,
    error,
  } = api.contacts.getById.useQuery(
    { contactId },
    {
      retry: 1,
    }
  );

  // Update mutation with enhanced feedback
  const updateContact = api.contacts.save.useMutation({
    onSuccess: (savedContact) => {
      console.log('✅ Contact updated successfully:', {
        id: savedContact.id,
        name: savedContact.fullName,
        changes: ['Profile updated'],
        timestamp: new Date().toISOString(),
      });

      toast({
        title: 'Contact Updated',
        description: `${savedContact.fullName}'s information has been saved.`,
        variant: 'default',
      });

      // Invalidate storage URLs if profile image was updated
      if (savedContact.profileImageUrl) {
        utils.storage.getFileUrl.invalidate({ filePath: savedContact.profileImageUrl });
      }

      // Update cache and redirect
      utils.contacts.getById.setData({ contactId }, savedContact);
      utils.contacts.list.invalidate();

      setTimeout(() => {
        router.push(`/contacts/${contactId}`);
      }, 100);
    },
    onError: (error) => {
      console.error('❌ Contact update failed:', {
        contactId,
        error: error.message,
        code: error.data?.code,
        timestamp: new Date().toISOString(),
      });

      const errorMessage = `Error updating contact: ${error.message}`;
      setFormError(errorMessage);

      toast({
        title: 'Update Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Form handling with comprehensive validation and change tracking
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
    watch,
    setValue,
  } = useForm<EditContactFormData>({
    resolver: zodResolver(editContactSchema),
    defaultValues: {
      id: contactId,
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      jobTitle: '',
      website: '',
      profileImageUrl: '',
      addressStreet: '',
      addressCity: '',
      addressPostalCode: '',
      addressCountry: '',
      notes: '',
      source: '',
      referralSource: '',
      relationshipStatus: '',
      lastContactedAt: '',
      wellnessStatus: '',
      wellnessJourneyStage: '',
      clientSince: '',
      tags: [],
      socialHandles: [],
      wellnessGoals: [],
      groups: [],
    },
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track changes including array fields and image uploads
  useEffect(() => {
    if (contact && (Object.keys(dirtyFields).length > 0 || hasUnsavedChanges)) {
      setHasUnsavedChanges(true);
    } else if (contact && Object.keys(dirtyFields).length === 0) {
      setHasUnsavedChanges(false);
    }
  }, [dirtyFields, contact, hasUnsavedChanges]);

  // Update form when contact data loads
  useEffect(() => {
    if (contact) {
      console.log('📋 Loading contact data into form:', {
        id: contact.id,
        name: contact.fullName,
        email: contact.email,
        hasImage: !!contact.profileImageUrl,
        timestamp: new Date().toISOString(),
      });

      reset({
        id: contact.id,
        fullName: contact.fullName,
        email: contact.email ?? '',
        phone: contact.phone ?? '',
        companyName: contact.companyName ?? '',
        jobTitle: contact.jobTitle ?? '',
        website: contact.website ?? '',
        profileImageUrl: contact.profileImageUrl ?? '',
        addressStreet: contact.addressStreet ?? '',
        addressCity: contact.addressCity ?? '',
        addressPostalCode: contact.addressPostalCode ?? '',
        addressCountry: contact.addressCountry ?? '',
        notes: contact.notes ?? '',
        source: contact.source ?? '',
        referralSource: contact.referralSource ?? '',
        relationshipStatus: contact.relationshipStatus ?? 'none',
        lastContactedAt: contact.lastContactedAt
          ? new Date(contact.lastContactedAt).toISOString().slice(0, 16)
          : '',
        wellnessStatus: contact.wellnessStatus ?? 'not_specified',
        wellnessJourneyStage: contact.wellnessJourneyStage ?? 'not_specified',
        clientSince: contact.clientSince
          ? new Date(contact.clientSince).toISOString().slice(0, 10)
          : '',
        tags: contact.tags || [],
        socialHandles: contact.socialHandles || [],
        wellnessGoals: contact.wellnessGoals || [],
        groups: contact.groups || [],
      });
      setHasUnsavedChanges(false);
    }
  }, [contact, reset]);

  const onSubmit = async (data: EditContactFormData) => {
    setFormError(null);

    console.log('📝 Starting contact update with data:', {
      contactId,
      changes: Object.entries(data)
        .filter(([key, value]) => {
          const originalValue = contact?.[key as keyof typeof contact];
          return value !== originalValue;
        })
        .map(([key]) => key),
      timestamp: new Date().toISOString(),
    });

    try {
      // Data validation and formatting
      const cleanedData = {
        id: contactId,
        fullName: data.fullName.trim(),
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        companyName: data.companyName?.trim() || null,
        jobTitle: data.jobTitle?.trim() || null,
        website: data.website?.trim() || null,
        profileImageUrl: data.profileImageUrl?.trim() || null,
        addressStreet: data.addressStreet?.trim() || null,
        addressCity: data.addressCity?.trim() || null,
        addressPostalCode: data.addressPostalCode?.trim() || null,
        addressCountry: data.addressCountry?.trim() || null,
        notes: data.notes?.trim() || null,
        source: data.source?.trim() || null,
        referralSource: data.referralSource?.trim() || null,
        relationshipStatus:
          data.relationshipStatus?.trim() && data.relationshipStatus !== 'none'
            ? data.relationshipStatus.trim()
            : null,
        lastContactedAt: data.lastContactedAt ? new Date(data.lastContactedAt) : null,
        wellnessStatus:
          data.wellnessStatus?.trim() && data.wellnessStatus !== 'not_specified'
            ? data.wellnessStatus.trim()
            : null,
        wellnessJourneyStage:
          data.wellnessJourneyStage?.trim() && data.wellnessJourneyStage !== 'not_specified'
            ? data.wellnessJourneyStage.trim()
            : null,
        clientSince: data.clientSince ? new Date(data.clientSince) : null,
        tags: data.tags || [],
        socialHandles: data.socialHandles || [],
        wellnessGoals: data.wellnessGoals || [],
        groups: data.groups || [],
      };

      // Additional client-side validation and auto-fixing
      if (cleanedData.email && !cleanedData.email.includes('@')) {
        throw new Error('Email must contain @ symbol');
      }

      // Auto-fix website URL if missing protocol
      if (cleanedData.website) {
        if (
          !cleanedData.website.startsWith('http://') &&
          !cleanedData.website.startsWith('https://')
        ) {
          const originalUrl = cleanedData.website;
          cleanedData.website = `https://${cleanedData.website}`;
          console.log('🔧 Auto-fixed website URL:', cleanedData.website);

          // Show user-friendly notification
          toast({
            title: 'Website URL Auto-Fixed',
            description: `Changed "${originalUrl}" to "${cleanedData.website}"`,
            variant: 'default',
          });
        }

        // Validate the final URL
        try {
          new URL(cleanedData.website);
        } catch {
          throw new Error(
            `Invalid website URL: "${cleanedData.website}". Please enter a valid website address.`
          );
        }
      }

      console.log('🔄 Sending cleaned data to server:', cleanedData);

      await updateContact.mutateAsync(cleanedData);
    } catch (err) {
      console.error('❌ Form submission error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setFormError(errorMessage);

      toast({
        title: 'Validation Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Helper functions for array field updates
  const updateTags = (newTags: string[]) => {
    setValue('tags', newTags, { shouldValidate: true, shouldDirty: true });
    setHasUnsavedChanges(true);
    console.log('🏷️ Tags updated:', newTags);
  };

  const updateGroups = (newGroups: string[]) => {
    setValue('groups', newGroups, { shouldValidate: true, shouldDirty: true });
    setHasUnsavedChanges(true);
    console.log('👥 Groups updated:', newGroups);
  };

  const updateSocialHandles = (newHandles: string[]) => {
    setValue('socialHandles', newHandles, { shouldValidate: true, shouldDirty: true });
    setHasUnsavedChanges(true);
    console.log('📱 Social handles updated:', newHandles);
  };

  const updateWellnessGoals = (newGoals: string[]) => {
    setValue('wellnessGoals', newGoals, { shouldValidate: true, shouldDirty: true });
    setHasUnsavedChanges(true);
    console.log('❤️ Wellness goals updated:', newGoals);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !contact) {
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

  return (
    <div className='container mx-auto py-8 px-4'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' onClick={() => router.push('/contacts')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Contacts
          </Button>
          <h1 className='text-2xl font-bold'>Edit {contact.fullName}</h1>
        </div>
      </div>

      {/* Form Error Alert */}
      {formError && (
        <Alert variant='destructive' className='mb-6'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Essential Information - Always Visible */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Essential Information
            </CardTitle>
            <CardDescription>
              Core contact details and frequently updated information
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='fullName'>Full Name *</Label>
                <Input
                  id='fullName'
                  {...register('fullName')}
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && (
                  <p className='text-sm text-destructive'>{errors.fullName.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='phone'>Phone</Label>
                <Input
                  id='phone'
                  {...register('phone')}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && <p className='text-sm text-destructive'>{errors.phone.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='companyName'>Company</Label>
                <Input id='companyName' {...register('companyName')} />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='jobTitle'>Job Title</Label>
                <Input id='jobTitle' {...register('jobTitle')} />
              </div>
            </div>

            {/* Profile Photo */}
            <div className='space-y-2'>
              <Label>Profile Photo</Label>
              <ImageUpload
                value={watch('profileImageUrl') || null}
                onChange={(url) => {
                  setValue('profileImageUrl', url || undefined, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setHasUnsavedChanges(true);
                  console.log('🖼️ Profile image updated:', { url, contactId });
                }}
                disabled={isSubmitting}
              />
            </div>

            {/* Groups */}
            <div className='space-y-2'>
              <Label>Contact Groups</Label>
              <div className='flex flex-wrap gap-2 min-h-[32px]'>
                {Object.entries(CONTACT_GROUPS).map(([key, label]) => {
                  const isSelected = watch('groups')?.includes(key);
                  return (
                    <Badge
                      key={key}
                      variant={isSelected ? 'default' : 'outline'}
                      className='cursor-pointer'
                      onClick={() => {
                        const current = watch('groups') || [];
                        const newGroups = isSelected
                          ? current.filter((g) => g !== key)
                          : [...current, key];
                        updateGroups(newGroups);
                      }}
                    >
                      {label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className='space-y-2'>
              <Label htmlFor='notes'>Notes</Label>
              <Textarea
                id='notes'
                {...register('notes')}
                className={`min-h-[100px] ${errors.notes ? 'border-destructive' : ''}`}
                placeholder='Important information about this contact...'
              />
              {errors.notes && <p className='text-sm text-destructive'>{errors.notes.message}</p>}
            </div>

            {/* Tags */}
            <div className='space-y-2'>
              <Label>Tags</Label>
              <TagInput
                value={watch('tags') || []}
                onChange={updateTags}
                placeholder='Add tags (separate with commas or press Enter)'
              />
            </div>
          </CardContent>
        </Card>

        {/* Collapsible Sections */}
        <div className='space-y-4'>
          {/* Professional Information */}
          <CollapsibleSection
            title='Professional Information'
            icon={<Building className='h-4 w-4' />}
            badge={contact.companyName ? '1' : undefined}
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='website'>Website</Label>
                <Input
                  id='website'
                  {...register('website')}
                  placeholder='https://example.com'
                  className={errors.website ? 'border-destructive' : ''}
                />
                {errors.website && (
                  <p className='text-sm text-destructive'>{errors.website.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='source'>Source</Label>
                <Input
                  id='source'
                  {...register('source')}
                  placeholder='How did you meet this contact?'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='referralSource'>Referral Source</Label>
                <Input id='referralSource' {...register('referralSource')} />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='relationshipStatus'>Relationship Status</Label>
                <Select
                  value={watch('relationshipStatus') || ''}
                  onValueChange={(value) =>
                    setValue('relationshipStatus', value, { shouldDirty: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='none'>None</SelectItem>
                    <SelectItem value='prospect'>Prospect</SelectItem>
                    <SelectItem value='client'>Client</SelectItem>
                    <SelectItem value='partner'>Partner</SelectItem>
                    <SelectItem value='referrer'>Referrer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='lastContactedAt'>Last Contacted</Label>
                <Input
                  id='lastContactedAt'
                  type='datetime-local'
                  {...register('lastContactedAt')}
                />
              </div>
            </div>

            <div className='space-y-2 mt-4'>
              <Label>Social Media Handles</Label>
              <TagInput
                value={watch('socialHandles') || []}
                onChange={updateSocialHandles}
                placeholder='Add social media handles (e.g., @username, linkedin.com/in/user)'
              />
            </div>
          </CollapsibleSection>

          {/* Address Information */}
          <CollapsibleSection
            title='Address Information'
            icon={<Mail className='h-4 w-4' />}
            badge={contact.addressStreet ? '1' : undefined}
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='addressStreet'>Street Address</Label>
                <Input id='addressStreet' {...register('addressStreet')} />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='addressCity'>City</Label>
                <Input id='addressCity' {...register('addressCity')} />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='addressPostalCode'>Postal Code</Label>
                <Input id='addressPostalCode' {...register('addressPostalCode')} />
              </div>

              <div className='space-y-2 md:col-span-2'>
                <Label htmlFor='addressCountry'>Country</Label>
                <Input id='addressCountry' {...register('addressCountry')} />
              </div>
            </div>
          </CollapsibleSection>

          {/* Wellness Tracking */}
          <CollapsibleSection
            title='Wellness & Goals'
            icon={<Heart className='h-4 w-4' />}
            badge={
              contact.wellnessGoals?.length ? contact.wellnessGoals.length.toString() : undefined
            }
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='wellnessStatus'>Wellness Status</Label>
                <Select
                  value={watch('wellnessStatus') || ''}
                  onValueChange={(value) =>
                    setValue('wellnessStatus', value, { shouldDirty: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='not_specified'>Not specified</SelectItem>
                    <SelectItem value='getting_started'>Getting Started</SelectItem>
                    <SelectItem value='making_progress'>Making Progress</SelectItem>
                    <SelectItem value='maintaining'>Maintaining</SelectItem>
                    <SelectItem value='challenged'>Challenged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='wellnessJourneyStage'>Journey Stage</Label>
                <Select
                  value={watch('wellnessJourneyStage') || ''}
                  onValueChange={(value) =>
                    setValue('wellnessJourneyStage', value, { shouldDirty: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select stage' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='not_specified'>Not specified</SelectItem>
                    <SelectItem value='awareness'>Awareness</SelectItem>
                    <SelectItem value='contemplation'>Contemplation</SelectItem>
                    <SelectItem value='preparation'>Preparation</SelectItem>
                    <SelectItem value='action'>Action</SelectItem>
                    <SelectItem value='maintenance'>Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='clientSince'>Client Since</Label>
                <Input id='clientSince' type='date' {...register('clientSince')} />
              </div>
            </div>

            <div className='space-y-2 mt-4'>
              <Label>Wellness Goals</Label>
              <TagInput
                value={watch('wellnessGoals') || []}
                onChange={updateWellnessGoals}
                placeholder='Add wellness goals (e.g., weight loss, stress management)'
              />
            </div>
          </CollapsibleSection>
        </div>

        {/* Form Actions */}
        <div className='flex justify-end space-x-2 pt-6 border-t'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push(`/contacts/${contactId}`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={isSubmitting || (!isDirty && !hasUnsavedChanges)}
            className='min-w-[120px]'
          >
            {isSubmitting ? (
              <>
                <div className='animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full'></div>
                Saving...
              </>
            ) : (
              <>
                <Save className='mr-2 h-4 w-4' />
                Update Contact
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
