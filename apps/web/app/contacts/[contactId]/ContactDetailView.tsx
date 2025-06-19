'use client';

// React/Next.js hooks
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

// Lucide React Icons
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  ExternalLink,
  Globe,
  Home,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  User,
} from 'lucide-react';

// Shadcn/ui and local components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AvatarImage as CustomAvatarImage } from '@/components/ui/avatar-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea'; // For inline notes
import { toast } from 'sonner';

// Utilities and API
import { formatDateTime } from '@/lib/dateUtils';
import { api } from '@/lib/trpc';
import { ContactGroupsSection } from './ContactGroupsSection';
import { ContactTimeline } from './ContactTimeline';
import type { Tables } from '../../../../../packages/db/src/database.types';

const TABS = { NOTES: 'notes', TASKS: 'tasks', TIMELINE: 'timeline' } as const;

/**
 * NotesEditSection Component
 * A self-contained component for inline note editing, using 'sonner' for notifications.
 */
function NotesEditSection({
  contactId,
  initialNotes,
}: {
  contactId: string;
  initialNotes: string | null;
}) {
  const utils = api.useUtils();
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes ?? '');
  const [isPending, startTransition] = useTransition();

  // You will need to create this new mutation in your tRPC router.
  // It should take `{ contactId: string, notes: string }` and update the contact.
  const updateNotesMutation = api.contacts.updateNotes.useMutation({
    onSuccess: async () => {
      // Using sonner's success method
      toast.success('Notes Updated', {
        description: 'Your changes have been saved.',
      });
      await utils.contacts.getById.invalidate({ contactId });
      setIsEditing(false);
    },
    onError: (error) => {
      // Using sonner's error method
      toast.error('Update Failed', {
        description: `Failed to update notes: ${error.message}`,
      });
    },
  });

  const handleSave = () => {
    startTransition(() => {
      updateNotesMutation.mutate({ contactId, notes });
    });
  };

  const handleCancel = () => {
    setNotes(initialNotes ?? '');
    setIsEditing(false);
  };

  return (
    <div>
      <div className='flex flex-row items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-gray-800'>Contact Notes</h3>
        {!isEditing && (
          <Button size='sm' variant='outline' onClick={() => setIsEditing(true)}>
            <Edit className='mr-2 h-4 w-4' /> Edit Notes
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className='space-y-4'>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder='Add notes about this contact...'
            rows={8}
            className='w-full'
          />
          <div className='flex justify-end gap-2'>
            <Button variant='ghost' onClick={handleCancel} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Notes'}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {initialNotes ? (
            <div className='prose max-w-none text-gray-700 whitespace-pre-wrap p-4 bg-gray-50 rounded-md border'>
              {initialNotes}
            </div>
          ) : (
            <div className='text-center py-16 bg-gray-50 rounded-lg'>
              <User className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-800'>No notes yet</h3>
              <p className='text-gray-500 mt-1'>
                Click &quot;Edit Notes&quot; to add important details.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function ContactDetailView({ contactId }: { contactId: string }) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: contact,
    isLoading,
    error: queryError,
  } = api.contacts.getById.useQuery<Tables<'contacts'> | undefined>(
    { contactId },
    { enabled: !!contactId, retry: 1 }
  );

  const deleteMutation = api.contacts.delete.useMutation({
    onSuccess: () => {
      toast.success('Contact Deleted');
      router.push('/contacts');
    },
    onError: (error) => {
      setDeleteError(`Failed to delete contact: ${error.message}`);
      setIsDeleteDialogOpen(false);
    },
  });

  const handleDeleteContact = () => {
    if (contact?.id) {
      void deleteMutation.mutate({ contactId: contact.id });
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-96'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800'></div>
      </div>
    );
  }

  if (queryError || !contact) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <Alert variant='destructive' className='max-w-2xl mx-auto'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error Loading Contact</AlertTitle>
          <AlertDescription>
            {queryError ? queryError.message : 'The requested contact could not be found.'}
          </AlertDescription>
        </Alert>
        <div className='text-center mt-6'>
          <Button variant='outline' onClick={() => router.push('/contacts')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Contacts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8 px-4 space-y-8'>
      {/* Header with Back Navigation */}
      <div>
        <Button
          variant='ghost'
          onClick={() => router.push('/contacts')}
          className='text-gray-600 hover:text-gray-900 mb-4'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          All Contacts
        </Button>
        {deleteError && (
          <Alert variant='destructive' className='mb-6'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Contact Header with Title and Action Buttons */}
      <div className='bg-teal-800 text-white px-6 py-3 flex justify-between items-center rounded-t-lg shadow-md'>
        <h2 className='text-xl font-semibold flex items-center'>
          <User className='h-5 w-5 mr-3' />
          Contact Details
        </h2>
        <div className='flex items-center gap-x-2'>
          <Button
            variant='ghost'
            className='text-white hover:bg-teal-700/50'
            onClick={() => router.push(`/contacts/${contactId}/edit`)}
          >
            <Edit className='mr-2 h-4 w-4' /> Edit Contact
          </Button>
          <Button
            variant='outline'
            className='bg-transparent text-white border-white hover:bg-teal-700/50'
          >
            <Sparkles className='mr-2 h-4 w-4' /> Enrich Contact
          </Button>
          <Button
            variant='destructive'
            className='bg-red-600 hover:bg-red-700'
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className='mr-2 h-4 w-4' /> Delete
          </Button>
        </div>
      </div>

      {/* Main Content with Three-Column Layout */}
      <div className='bg-white shadow-lg rounded-b-lg border border-gray-200 p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8'>
          {/* === COLUMN 1: PRIMARY INFO === */}
          <div className='space-y-6 lg:pr-8'>
            <div className='flex flex-col items-center lg:items-start text-center lg:text-left'>
              <CustomAvatarImage
                src={contact.profile_image_url}
                alt={contact.full_name ?? 'Contact'}
                size='xl'
                className='h-28 w-28 mb-4 shadow-lg border-4 border-white'
              />
              <h1 className='text-3xl font-bold text-gray-900'>{contact.full_name}</h1>
              {contact.job_title && <p className='text-lg text-gray-500'>{contact.job_title}</p>}
            </div>

            <div className='space-y-4 pt-4 border-t border-gray-200'>
              <h3 className='text-base font-semibold text-gray-800'>Contact & Professional</h3>
              <div className='space-y-3'>
                <div className='flex items-center'>
                  <Mail className='h-4 w-4 mr-3 text-gray-400' />
                  <a href={`mailto:${contact.email}`} className='text-teal-700 hover:underline'>
                    {contact.email}
                  </a>
                </div>
                {contact.phone && (
                  <div className='flex items-center'>
                    <Phone className='h-4 w-4 mr-3 text-gray-400' />
                    <span>{contact.phone}</span>
                    {contact.phone_country_code && (
                      <span className='text-gray-500 ml-1'>({contact.phone_country_code})</span>
                    )}
                  </div>
                )}
                {contact.company_name && (
                  <div className='flex items-center'>
                    <Building className='h-4 w-4 mr-3 text-gray-400' />
                    <span>{contact.company_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* === COLUMN 2: LOCATION & ONLINE PRESENCE === */}
          <div className='space-y-6 pt-6 md:pt-0 lg:px-8 lg:border-l lg:border-r border-gray-200'>
            {contact.address_street ||
            contact.address_city ||
            contact.address_postal_code ||
            contact.address_country ? (
              <div className='space-y-4'>
                <h3 className='text-base font-semibold text-gray-800'>Location</h3>
                <div className='space-y-3'>
                  {contact.address_street && (
                    <div className='flex items-center'>
                      <Home className='h-4 w-4 mr-3 text-gray-400' />
                      <span>{contact.address_street}</span>
                    </div>
                  )}
                  {contact.address_city && (
                    <div className='flex items-center'>
                      <MapPin className='h-4 w-4 mr-3 text-gray-400' />
                      <span>{contact.address_city}</span>
                      {contact.address_postal_code && (
                        <span className='ml-1'>{contact.address_postal_code}</span>
                      )}
                    </div>
                  )}
                  {contact.address_country && (
                    <div className='flex items-center'>
                      <Globe className='h-4 w-4 mr-3 text-gray-400' />
                      <span>{contact.address_country}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className='space-y-4 pt-4 border-t border-gray-200'>
              <h3 className='text-base font-semibold text-gray-800'>Online Presence</h3>
              <div className='space-y-3'>
                {contact.website && (
                  <div className='flex items-center'>
                    <ExternalLink className='h-4 w-4 mr-3 text-gray-400' />
                    <a
                      href={contact.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-teal-700 hover:underline'
                    >
                      {contact.website}
                    </a>
                  </div>
                )}
                {contact.social_handles && contact.social_handles.length > 0 && (
                  <div className='flex items-start'>
                    <LinkIcon className='h-4 w-4 mr-3 text-gray-400 mt-1' />
                    <div className='flex flex-col'>
                      {contact.social_handles.map((handle: string, index: number) => (
                        <span key={index} className='text-gray-700'>
                          {handle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* === COLUMN 3: CRM & TAGS === */}
          <div className='space-y-6 pt-6 lg:pt-0 lg:pl-8'>
            <div className='space-y-4'>
              <h3 className='text-base font-semibold text-gray-800'>CRM Data</h3>
              <div className='space-y-3'>
                {contact.tags && contact.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 mb-3'>
                    {contact.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant='secondary' className='flex items-center gap-1'>
                        <Tag className='h-3 w-3' />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {contact.source && (
                  <div className='flex items-center'>
                    <Briefcase className='h-4 w-4 mr-3 text-gray-400' />
                    <span>
                      Source: <Badge variant='outline'>{contact.source}</Badge>
                    </span>
                  </div>
                )}
                {contact.last_contacted_at && (
                  <div className='flex items-center'>
                    <Clock className='h-4 w-4 mr-3 text-gray-400' />
                    <span>Last contact: {formatDateTime(contact.last_contacted_at)}</span>
                  </div>
                )}
                {contact.enrichment_status && (
                  <div className='flex items-start'>
                    <Sparkles className='h-4 w-4 mr-3 text-gray-400 mt-1' />
                    <div>
                      <div className='flex items-center'>
                        <span className='mr-2'>Enrichment:</span>
                        <Badge
                          className='text-sm'
                          variant={
                            contact.enrichment_status === 'completed' ? 'default' : 'destructive'
                          }
                        >
                          {contact.enrichment_status === 'completed' ? (
                            <>
                              <CheckCircle className='mr-1 h-3 w-3' /> Completed
                            </>
                          ) : (
                            <>
                              <AlertCircle className='mr-1 h-3 w-3' /> {contact.enrichment_status}
                            </>
                          )}
                        </Badge>
                      </div>
                      {contact.enriched_data && (
                        <div className='mt-2 text-sm bg-gray-50 p-2 rounded-md'>
                          {Object.entries(contact.enriched_data || {}).map(([key, value]) => (
                            <div key={key} className='flex items-start mb-1'>
                              <span className='font-medium mr-1'>{key}:</span>
                              <span>
                                {typeof value === 'string' ? value : JSON.stringify(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Tab Structure --- */}
      <div className='bg-white shadow-lg rounded-lg border border-gray-200 mt-8'>
        <Tabs defaultValue={TABS.NOTES} className='w-full'>
          <TabsList className='grid w-full grid-cols-3 bg-teal-50/50 rounded-t-lg'>
            <TabsTrigger value={TABS.NOTES}>Notes</TabsTrigger>
            <TabsTrigger value={TABS.TASKS}>Tasks</TabsTrigger>
            <TabsTrigger value={TABS.TIMELINE}>Timeline</TabsTrigger>
          </TabsList>

          <div className='min-h-[400px]'>
            <TabsContent value={TABS.NOTES} className='p-6'>
              <NotesEditSection contactId={contact.id} initialNotes={contact.notes} />
            </TabsContent>

            <TabsContent value={TABS.TASKS} className='p-6'>
              <div className='flex flex-row items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-800'>Tasks</h3>
                <Button size='sm' variant='outline' disabled>
                  <Plus className='mr-2 h-4 w-4' /> Add Task
                </Button>
              </div>
              <div className='text-center py-16 bg-gray-50 rounded-lg'>
                <Calendar className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-800'>Task Management Coming Soon</h3>
                <p className='text-gray-500 mt-1'>
                  This feature will be available in a future update.
                </p>
              </div>
            </TabsContent>

            <TabsContent value={TABS.TIMELINE} className='p-6'>
              <ContactTimeline contactId={contactId} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Groups Section */}
      <div className='bg-white shadow-lg rounded-lg border border-gray-200 mt-8 p-6'>
        <ContactGroupsSection contactId={contactId} />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <p className='text-sm text-muted-foreground'>
            This will permanently delete <span className='font-semibold'>{contact.full_name}</span>.
          </p>
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
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Contact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
