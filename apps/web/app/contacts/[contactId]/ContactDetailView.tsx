"use client";

// React/Next.js hooks
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

// Third-party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  Plus
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AvatarImage as CustomAvatarImage } from "@/components/ui/avatar-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
// Local Utilities
import { formatDateTime, formatDateForInput, parseInputDateString } from '@/lib/dateUtils';
import { api } from "@/lib/trpc";

// Local Components
import { ContactGroupsSection } from "./ContactGroupsSection";

// Define tab values as constants for maintainability
const TABS = {
  OVERVIEW: "overview",
  NOTES: "notes",
  TASKS: "tasks"
} as const;

type TabValue = typeof TABS[keyof typeof TABS];

// Constants for enrichment status values
const ENRICHMENT_STATUS = {
  COMPLETED: "completed",
  PENDING: "pending",
  FAILED: "failed",
} as const;

// Contact schema for validation - using API field names for consistency
const contactSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").optional().nullable(),
  phone: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  profile_image_url: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  last_contacted_at: z.string()
    .optional()
    .nullable()
    .refine(value => {
      if (!value) return true; // null or empty string is valid
      // Basic regex check for datetime-local format (YYYY-MM-DDTHH:mm)
      return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
    }, {
      message: "Invalid date and time format (expected YYYY-MM-DDTHH:mm)"
    }),
  enrichment_status: z.string().optional().nullable(),
  enriched_data: z.any().optional().nullable(),
});

type ContactFormData = z.infer<typeof contactSchema>;

/**
 * ContactDetailView Component
 * 
 * Displays and manages a single contact's details, including viewing, editing, and deleting.
 * Uses tRPC for data fetching and mutations.
 */
export function ContactDetailView({ contactId }: { contactId: string }) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>(TABS.OVERVIEW);

  const utils = api.useUtils();

  // Fetch client data
  const { data: contact, isLoading, error } = api.contacts.getById.useQuery(
    { contactId },
    {
      enabled: !!contactId,
      retry: 1,
      onError: (err) => {
        console.error("Error fetching contact:", err);
      },
    }
  );

  // Save mutation
  const saveContact = api.contacts.save.useMutation({
    onSuccess: (updatedContact) => {
      utils.contacts.getById.setData({ contactId }, updatedContact);
      utils.contacts.getById.invalidate({ contactId }); 
      utils.contacts.list.invalidate();
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      setFormError(`Error saving contact: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = api.contacts.delete.useMutation({
    onSuccess: () => {
      router.push("/contacts");
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
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      id: contactId,
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company_name: "", 
      job_title: "",
      profile_image_url: "", 
      source: "",
      notes: "",
      last_contacted_at: "",
      enrichment_status: "",
      enriched_data: null,
    },
  });

  // Update form when contact data changes
  useEffect(() => {
    if (contact) {
      reset({
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email ?? "",
        phone: contact.phone ?? "",
        company_name: contact.company_name ?? "", 
        job_title: contact.job_title ?? "",
        profile_image_url: contact.profile_image_url ?? "", 
        source: contact.source ?? "",
        notes: contact.notes ?? "",
        last_contacted_at: formatDateForInput(contact.last_contacted_at),
        enrichment_status: contact.enrichment_status ?? "",
        enriched_data: contact.enriched_data ?? null,
      });
    }
  }, [contact, reset]);

  /**
   * Form submission handler that prepares and submits contact data to the API
   * - Trims optional text fields and converts empty strings to null
   * - Parses date input string to ISO format for the API
   * - Handles errors and provides user feedback
   */
  const onSubmit = async (data: ContactFormData) => {
    setFormError(null);

    const mutationData: ContactFormData = {
      ...data,
      id: contactId,
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      company_name: data.company_name?.trim() || null,
      job_title: data.job_title?.trim() || null,
      profile_image_url: data.profile_image_url?.trim() || null,
      source: data.source?.trim() || null,
      notes: data.notes?.trim() || null,
      last_contacted_at: parseInputDateString(data.last_contacted_at),
      enrichment_status: data.enrichment_status,
      enriched_data: data.enriched_data,
    };

    try {
      await saveContact.mutateAsync(mutationData);
      setIsEditDialogOpen(false);
    } catch (err: unknown) { 
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("An unexpected error occurred");
      }
      console.error("Error updating contact:", err);
    }
  };

  const handleDeleteContact = () => {
    deleteMutation.mutate({ contactId });
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
  if (error || !contact) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error ? error.message : "Contact not found"}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={() => router.push("/contacts")}>
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
        <Button variant="outline" onClick={() => router.push("/contacts")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contacts
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Contact
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Contact Profile Card */}
      <Card className="mb-8 overflow-hidden">
        {/* Hero Banner - Optional background color or image */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
          {/* Status Badge - Positioned in top right */}
          {contact.enrichment_status && (
            <div className="absolute top-4 right-4">
              <Badge
                className="text-sm px-3 py-1"
                variant={
                  contact.enrichment_status === ENRICHMENT_STATUS.COMPLETED
                    ? "default"
                    : contact.enrichment_status === ENRICHMENT_STATUS.PENDING
                    ? "outline"
                    : contact.enrichment_status === ENRICHMENT_STATUS.FAILED
                    ? "destructive"
                    : "secondary"
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
        
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <CustomAvatarImage
                src={contact.profile_image_url}
                alt={`${contact.first_name} ${contact.last_name}`}
                size="xl"
                className="h-32 w-32 border-4 border-white shadow-lg"
              />
            </div>

            {/* Basic Info Section */}
            <div className="flex-1 pt-4 md:pt-8">
              <h1 className="text-3xl font-bold mb-2">
                {contact.first_name} {contact.last_name}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mt-4">
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
              </div>
              
              {/* Tags/Categories - For future implementation */}
              <div className="flex flex-wrap gap-2 mt-4">
                {contact.source && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {contact.source}
                  </Badge>
                )}
                {contact.last_contacted_at && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last contact: {formatDateTime(contact.last_contacted_at)}
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
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value={TABS.OVERVIEW}>Overview</TabsTrigger>
          <TabsTrigger value={TABS.NOTES}>Notes</TabsTrigger>
          <TabsTrigger value={TABS.TASKS}>Tasks</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value={TABS.OVERVIEW} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Complete profile information for {contact.first_name} {contact.last_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                <Separator className="mb-4" />
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">First Name</dt>
                    <dd className="mt-1">{contact.first_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Last Name</dt>
                    <dd className="mt-1">{contact.last_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                    <dd className="mt-1">{contact.email || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                    <dd className="mt-1">{contact.phone || "—"}</dd>
                  </div>
                </dl>
              </div>
              
              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-medium mb-2">Professional Information</h3>
                <Separator className="mb-4" />
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Company</dt>
                    <dd className="mt-1">{contact.company_name || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Job Title</dt>
                    <dd className="mt-1">{contact.job_title || "—"}</dd>
                  </div>
                </dl>
              </div>
              
              {/* Groups Section */}
              <ContactGroupsSection contactId={contactId} />
              
              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-medium mb-2">Additional Information</h3>
                <Separator className="mb-4" />
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Source</dt>
                    <dd className="mt-1">{contact.source || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Last Contacted</dt>
                    <dd className="mt-1">
                      {contact.last_contacted_at ? formatDateTime(contact.last_contacted_at) : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                    <dd className="mt-1">
                      {contact.created_at ? formatDateTime(contact.created_at) : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Updated</dt>
                    <dd className="mt-1">
                      {contact.updated_at ? formatDateTime(contact.updated_at) : "—"}
                    </dd>
                  </div>
                </dl>
              </div>
              
              {/* Enrichment Data (if available) */}
              {contact.enriched_data && Object.keys(contact.enriched_data).length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Enriched Information</h3>
                  <Separator className="mb-4" />
                  <div className="bg-muted/50 p-4 rounded-md">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(contact.enriched_data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
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
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
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
                  <Button className="mt-4" onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Add Notes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tasks Tab (Placeholder for future implementation) */}
        <TabsContent value={TABS.TASKS}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Upcoming and completed tasks related to this client
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
                <h3 className="text-lg font-medium">Task Management Coming Soon</h3>
                <p className="text-muted-foreground mt-1">
                  This feature will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Update information for {contact.first_name} {contact.last_name}
            </DialogDescription>
          </DialogHeader>
          
          {formError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information Section */}
              <div className="space-y-2 md:col-span-2">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <Separator />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  {...register("first_name")}
                  className={errors.first_name ? "border-destructive" : ""}
                />
                {errors.first_name && (
                  <p className="text-sm text-destructive">{errors.first_name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  {...register("last_name")}
                  className={errors.last_name ? "border-destructive" : ""}
                />
                {errors.last_name && (
                  <p className="text-sm text-destructive">{errors.last_name.message}</p>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Profile Photo</Label>
                <ImageUpload
                  value={watch("profile_image_url") || null}
                  onChange={(url) => setValue("profile_image_url", url, { shouldValidate: true })}
                  disabled={isSubmitting}
                  contactId={contact.id}
                />
                {errors.profile_image_url && (
                  <p className="text-sm text-destructive">{errors.profile_image_url.message}</p>
                )}
              </div>
              
              {/* Professional Information Section */}
              <div className="space-y-2 md:col-span-2 pt-4">
                <h3 className="text-lg font-medium">Professional Information</h3>
                <Separator />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_name">Company</Label>
                <Input
                  id="company_name"
                  {...register("company_name")}
                  className={errors.company_name ? "border-destructive" : ""}
                />
                {errors.company_name && (
                  <p className="text-sm text-destructive">{errors.company_name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  {...register("job_title")}
                  className={errors.job_title ? "border-destructive" : ""}
                />
                {errors.job_title && (
                  <p className="text-sm text-destructive">{errors.job_title.message}</p>
                )}
              </div>
              
              {/* Additional Information Section */}
              <div className="space-y-2 md:col-span-2 pt-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <Separator />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  {...register("source")}
                  className={errors.source ? "border-destructive" : ""}
                  placeholder="How did you meet this client?"
                />
                {errors.source && (
                  <p className="text-sm text-destructive">{errors.source.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_contacted_at">Last Contacted</Label>
                <Input
                  id="last_contacted_at"
                  type="datetime-local"
                  {...register("last_contacted_at")}
                  aria-label="Last contacted date and time"
                />
                {errors.last_contacted_at && (
                  <p className="text-sm text-destructive">{errors.last_contacted_at.message}</p>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  className={`min-h-[100px] ${errors.notes ? "border-destructive" : ""}`}
                  placeholder="Add any notes about this contact..."
                />
                {errors.notes && (
                  <p className="text-sm text-destructive">{errors.notes.message}</p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Updating...
                  </>
                ) : (
                  <>Update Client</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete <span className="font-semibold">{contact.first_name} {contact.last_name}</span> and all associated data.
            </p>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteContact}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? (
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