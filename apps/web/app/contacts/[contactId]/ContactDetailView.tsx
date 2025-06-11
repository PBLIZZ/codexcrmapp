'use client';

// React/Next.js hooks
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
  CheckCircle,
  XCircle,
  Tag,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Third-party libraries
import { ContactGroupsSection } from './ContactGroupsSection';
import { ContactTimeline } from './ContactTimeline';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AvatarImage as CustomAvatarImage } from '@/components/ui/avatar-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'; // Only used for delete dialog
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Local Utilities
import {
  formatDateTime,
} from '@/lib/dateUtils';
import { api } from '@/lib/trpc';

// Local Components

// Define tab values as constants for maintainability
const TABS = {
  NOTES: 'notes',
  TASKS: 'tasks',
  TIMELINE: 'timeline',
} as const;

type TabValue = (typeof TABS)[keyof typeof TABS];

// Constants for enrichment status values
const ENRICHMENT_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'failed',
} as const;


/**
 * ContactDetailView Component
 *
 * Displays and manages a single contact's details, including viewing, editing, and deleting.
 * Uses tRPC for data fetching and mutations.
 */
export function ContactDetailView({ contactId }: { contactId: string }) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>(TABS.NOTES);

  const utils = api.useUtils();

  // Fetch client data
  const {
    data: contact,
    isLoading,
    error: queryError, // Renamed to avoid conflict with other error states if any
  } = api.contacts.getById.useQuery(
    { contactId }, // Use contactId consistently
    {
      enabled: !!contactId,
      retry: 1,
    }
  );

  useEffect(() => {
    if (queryError) {
      console.error('Error fetching contact:', queryError);
    }
  }, [queryError]);

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


  const handleDeleteContact = () => {
    deleteMutation.mutate({ contactId: contact.id });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (queryError || !contact) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {queryError ? queryError.message : 'Contact not found'}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={() => router.push('/contacts')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Delete Error Alert */}
      {deleteError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      {/* Header with navigation and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Button variant="outline" onClick={() => router.push('/contacts')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contacts
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/contacts/${contactId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Contact
          </Button>
          <Button variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800">
            <Sparkles className="mr-2 h-4 w-4" />
            Enrich Contact
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Contact Profile Card */}
      <Card className="mb-8 overflow-hidden">
        {/* Hero Banner - Reduced height */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-16 relative">
          {/* Status Badge - Positioned in top right */}
          {contact.enrichment_status && (
            <div className="absolute top-4 right-4">
              <Badge
                className="text-sm px-3 py-1"
                variant={
                  contact.enrichment_status === ENRICHMENT_STATUS.COMPLETED
                    ? 'default'
                    : contact.enrichment_status === ENRICHMENT_STATUS.PENDING
                      ? 'outline'
                      : contact.enrichment_status === ENRICHMENT_STATUS.FAILED
                        ? 'destructive'
                        : 'secondary'
                }
              >
                {contact.enrichment_status === ENRICHMENT_STATUS.COMPLETED ? (
                  <CheckCircle className="mr-1 h-3 w-3" />
                ) : contact.enrichment_status === ENRICHMENT_STATUS.PENDING ? (
                  <Clock className="mr-1 h-3 w-3" />
                ) : contact.enrichment_status === ENRICHMENT_STATUS.FAILED ? (
                  <XCircle className="mr-1 h-3 w-3" />
                ) : null}
                {contact.enrichment_status &&
                  contact.enrichment_status.charAt(0).toUpperCase() +
                    contact.enrichment_status.slice(1)}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <CustomAvatarImage
                src={contact.profile_image_url}
                alt={contact.full_name || 'Contact'}
                size="xl"
                className="h-24 w-24 border-4 border-white shadow-lg"
              />
            </div>

            {/* Main Info Column */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column - Basic Contact Info */}
                <div>
                  <h1 className="text-2xl font-bold mb-2">{contact.full_name}</h1>
                  <div className="space-y-2">
                    {contact.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {contact.email}
                        </a>
                      </div>
                    )}

                    {contact.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    )}

                    {contact.job_title && (
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{contact.job_title}</span>
                      </div>
                    )}

                    {contact.company_name && (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{contact.company_name}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {contact.source && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {contact.source}
                        </Badge>
                      )}
                      {contact.last_contacted_at && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-3 w-3" />
                          Last contact: {formatDateTime(contact.last_contacted_at)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right Column - AI Enriched Data */}
                {contact.enriched_data && Object.keys(contact.enriched_data).length > 0 && (
                  <div className="bg-purple-50 p-3 rounded-md border border-purple-100">
                    <h3 className="text-sm font-medium text-purple-800 flex items-center mb-2">
                      <Sparkles className="h-4 w-4 mr-1" />
                      AI Enriched Data
                    </h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(contact.enriched_data as Record<string, any>).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium text-purple-700">{key.replace(/_/g, ' ')}:</span>{' '}
                          <span className="text-gray-700">{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value={TABS.NOTES}>Notes</TabsTrigger>
          <TabsTrigger value={TABS.TASKS}>Tasks</TabsTrigger>
          <TabsTrigger value={TABS.TIMELINE}>Timeline</TabsTrigger>
        </TabsList>

        {/* Notes Tab */}
        <TabsContent value={TABS.NOTES}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Notes</CardTitle>
                <CardDescription>
                  Important information and observations about this client
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/contacts/${contactId}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Notes
              </Button>
            </CardHeader>
            <CardContent>
              {contact.notes ? (
                <div className="prose max-w-none bg-muted/30 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{contact.notes}</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No notes yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Click the Edit button to add notes about this contact.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push(`/contacts/${contactId}/edit`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Add Notes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value={TABS.TASKS}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Upcoming and completed tasks related to this contact
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" disabled>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">
                  Task Management Coming Soon
                </h3>
                <p className="text-muted-foreground mt-1">
                  This feature will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value={TABS.TIMELINE} className="space-y-6">
          <ContactTimeline contactId={contactId} />
        </TabsContent>
      </Tabs>

      {/* Groups Section */}
      <div className="mt-8">
        <ContactGroupsSection contactId={contactId} />
      </div>


      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete{' '}
              <span className="font-semibold">{contact.full_name}</span> and all
              associated data.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteContact}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
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
