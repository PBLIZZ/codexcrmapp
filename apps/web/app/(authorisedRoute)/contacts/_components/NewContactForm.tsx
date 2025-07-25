'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Sparkles, Upload, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  useToast,
} from '@codexcrm/ui';
import { api } from '@/lib/trpc';
import { CONTACT_GROUPS } from '@/lib/constants/contact-groups';

// Enhanced schema with better validation and formatting
const newContactSchema = z.object({
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
      // Allow various phone formats but require some digits
      const phoneRegex = /\d/;
      return phoneRegex.test(val.trim());
    }, 'Phone number must contain at least one digit'),
  companyName: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true;
      return val.trim().length > 0;
    }, 'Company name cannot be just whitespace'),
  jobTitle: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true;
      return val.trim().length > 0;
    }, 'Job title cannot be just whitespace'),
  groups: z.string().optional(),
});

type NewContactFormData = z.infer<typeof newContactSchema>;

interface NewContactFormProps {
  onSuccess?: (contactId: string) => void;
}

export function NewContactForm({ onSuccess }: NewContactFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [formError, setFormError] = useState<string | null>(null);
  const [isLLMEnhancing, setIsLLMEnhancing] = useState(false);

  // Create contact mutation with enhanced feedback
  const createContact = api.contacts.save.useMutation({
    onSuccess: (savedContact) => {
      console.log('✅ Contact created successfully:', {
        id: savedContact.id,
        name: savedContact.fullName,
        email: savedContact.email,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: 'Contact Created',
        description: `${savedContact.fullName} has been added to your contacts.`,
        variant: 'default',
      });

      if (onSuccess) {
        onSuccess(savedContact.id);
      } else {
        router.push(`/contacts/${savedContact.id}`);
      }
    },
    onError: (error) => {
      console.error('❌ Contact creation failed:', {
        error: error.message,
        code: error.data?.code,
        timestamp: new Date().toISOString(),
      });

      const errorMessage = `Error creating contact: ${error.message}`;
      setFormError(errorMessage);

      toast({
        title: 'Creation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Form handling with minimal required fields
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch,
    setValue,
  } = useForm<NewContactFormData>({
    resolver: zodResolver(newContactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      jobTitle: '',
      groups: '',
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: NewContactFormData) => {
    setFormError(null);

    console.log('📝 Starting contact creation with data:', {
      fullName: data.fullName?.trim(),
      email: data.email?.trim(),
      phone: data.phone?.trim(),
      companyName: data.companyName?.trim(),
      jobTitle: data.jobTitle?.trim(),
      groups: data.groups,
      timestamp: new Date().toISOString(),
    });

    try {
      // Data validation and formatting
      const cleanedData = {
        fullName: data.fullName.trim(),
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        companyName: data.companyName?.trim() || null,
        jobTitle: data.jobTitle?.trim() || null,
        groups: data.groups ? [data.groups] : [],
      };

      // Additional client-side validation
      if (cleanedData.email && !cleanedData.email.includes('@')) {
        throw new Error('Email must contain @ symbol');
      }

      console.log('🔄 Sending cleaned data to server:', cleanedData);

      await createContact.mutateAsync(cleanedData);
    } catch {
      console.error('Error creating contact');
    }
  };

  const handleLLMEnhancement = async () => {
    if (!watchedValues.fullName || !watchedValues.companyName) {
      setFormError('Please provide at least a name and company for LLM enhancement');
      return;
    }

    setIsLLMEnhancing(true);
    setFormError(null);

    try {
      // TODO: Integrate with LLM enhancement API
      // This would typically call an endpoint that:
      // 1. Fetches company information
      // 2. Suggests profile photo
      // 3. Enriches contact data
      // 4. Auto-classifies group membership

      // Simulate LLM enhancement delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For now, just show success message
      console.log('LLM enhancement would be triggered here');
    } catch {
      setFormError('LLM enhancement failed. You can still create the contact manually.');
    } finally {
      setIsLLMEnhancing(false);
    }
  };

  return (
    <div className='container mx-auto py-8 px-4 max-w-2xl'>
      {/* Header */}
      <div className='flex items-center gap-4 mb-6'>
        <Button variant='outline' onClick={() => router.push('/contacts')}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Contacts
        </Button>
        <div>
          <h1 className='text-2xl font-bold'>Add New Contact</h1>
          <p className='text-muted-foreground'>Quick capture for essential contact information</p>
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

      {/* Main Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Upload className='h-5 w-5' />
            Essential Contact Information
          </CardTitle>
          <CardDescription>
            Enter the key details below. Our AI will enhance the profile automatically after
            creation.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Essential Fields Section */}
            <div className='space-y-4'>
              {/* Full Name - Required */}
              <div className='space-y-2'>
                <Label htmlFor='fullName' className='text-sm font-medium'>
                  Full Name *
                </Label>
                <Input
                  id='fullName'
                  {...register('fullName')}
                  className={errors.fullName ? 'border-destructive' : ''}
                  placeholder="Enter contact's full name"
                  autoFocus
                />
                {errors.fullName && (
                  <p className='text-sm text-destructive'>{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email' className='text-sm font-medium'>
                  Email Address
                </Label>
                <Input
                  id='email'
                  type='email'
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                  placeholder='contact@example.com'
                />
                {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className='space-y-2'>
                <Label htmlFor='phone' className='text-sm font-medium'>
                  Phone Number
                </Label>
                <Input id='phone' {...register('phone')} placeholder='+1 (555) 123-4567' />
              </div>

              {/* Company and Job Title - Side by side */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='companyName' className='text-sm font-medium'>
                    Company
                  </Label>
                  <Input id='companyName' {...register('companyName')} placeholder='Company name' />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='jobTitle' className='text-sm font-medium'>
                    Job Title
                  </Label>
                  <Input id='jobTitle' {...register('jobTitle')} placeholder='Position or role' />
                </div>
              </div>

              {/* Group Assignment - Optional with smart messaging */}
              <div className='space-y-2'>
                <Label htmlFor='groups' className='text-sm font-medium'>
                  Contact Group
                  <Badge variant='secondary' className='ml-2 text-xs'>
                    Optional
                  </Badge>
                </Label>
                <Select
                  value={watchedValues.groups}
                  onValueChange={(value) => setValue('groups', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Let AI classify automatically, or select manually' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CONTACT_GROUPS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className='text-xs text-muted-foreground'>
                  If left unassigned, our AI will suggest the most appropriate group based on the
                  contact information.
                </p>
              </div>
            </div>

            {/* LLM Enhancement Section */}
            {watchedValues.fullName && watchedValues.companyName && (
              <div className='border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Sparkles className='h-5 w-5 text-blue-600' />
                    <div>
                      <h3 className='font-medium'>AI Enhancement Ready</h3>
                      <p className='text-sm text-muted-foreground'>
                        Enhance this contact with company data, profile photo, and group
                        classification
                      </p>
                    </div>
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleLLMEnhancement}
                    disabled={isLLMEnhancing}
                    className='shrink-0'
                  >
                    {isLLMEnhancing ? (
                      <>
                        <div className='animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full' />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles className='mr-2 h-4 w-4' />
                        Enhance with AI
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className='flex justify-end space-x-2 pt-6 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/contacts')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting || !isDirty || !watchedValues.fullName}>
                {isSubmitting ? (
                  <>
                    <div className='animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full' />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Create Contact
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* CSV Import Hint */}
      <Card className='mt-6'>
        <CardContent className='pt-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='font-medium'>Bulk Import Available</h3>
              <p className='text-sm text-muted-foreground'>
                Need to add multiple contacts? Use our CSV import feature for batch processing.
              </p>
            </div>
            <Button variant='outline' onClick={() => router.push('/contacts/import')}>
              Import CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
