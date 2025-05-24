"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc";
import { formatDateTime, formatDateForInput, parseInputDateString } from '@/lib/dateUtils';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  Building,
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
  Briefcase,
  Clock,
  Info,
  CheckCircle,
  XCircle,
  Tag,
  Plus
} from "lucide-react";

// Client schema for validation
const clientSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  avatar_url: z.string().url({ message: "Invalid URL for avatar" }).optional().nullable(),
  source: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // Accept local datetime-local input (YYYY-MM-DDTHH:mm), we'll convert to ISO in onSubmit
  last_contacted_at: z.string().optional().nullable(),
  enrichment_status: z.string().optional().nullable(),
  enriched_data: z.any().optional().nullable(), // For JSONB fields
});

type ClientFormData = z.infer<typeof clientSchema>;

// Client interface
interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  job_title?: string | null;
  avatar_url?: string | null;
  source?: string | null;
  notes?: string | null;
  last_contacted_at?: string | null;
  enrichment_status?: string | null;
  enriched_data?: any | null;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
}

// Helper function to get initials from name
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

export function ClientDetailView({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const utils = api.useContext();

  // Fetch client data
  const { data: client, isLoading, error } = api.clients.getById.useQuery(
    { clientId },
    {
      enabled: !!clientId,
      retry: 1,
      onError: (err) => {
        console.error("Error fetching client:", err);
      },
    }
  );

  // Save mutation
  const saveMutation = api.clients.save.useMutation({
    // On success, immediately update cached client data and close dialog
    onSuccess: (updatedClient) => {
      // Update the detail cache so UI reflects new values without waiting for refetch
      utils.clients.getById.setData({ clientId }, updatedClient);
      // Invalidate the client list so list view will refresh when needed
      utils.clients.list.invalidate();
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      setFormError(`Error saving client: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = api.clients.delete.useMutation({
    onSuccess: () => {
      router.push("/clients");
    },
    onError: (error) => {
      setDeleteError(`Failed to delete client: ${error.message}`);
      setIsDeleteDialogOpen(false);
    },
  });

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      id: clientId,
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      job_title: "",
      avatar_url: "",
      source: "",
      notes: "",
      // last_contacted_at is a local datetime input (YYYY-MM-DDTHH:mm)
      last_contacted_at: "",
      enrichment_status: "",
      enriched_data: null,
    },
  });

  // Update form when client data changes
  useEffect(() => {
    if (client) {
      reset({
        id: client.id,
        first_name: client.first_name,
        last_name: client.last_name,
        email: client.email ?? "",
        phone: client.phone ?? "",
        company: client.company ?? "",
        job_title: client.job_title ?? "",
        avatar_url: client.avatar_url ?? "",
        source: client.source ?? "",
        notes: client.notes ?? "",
        last_contacted_at: formatDateForInput(client.last_contacted_at),
        enrichment_status: client.enrichment_status ?? "",
        enriched_data: client.enriched_data ?? null,
      });
    }
  }, [client, reset]);

  const onSubmit = async (data: ClientFormData) => {
    setFormError(null);

    const mutationData: ClientFormData = {
      ...data,
      id: clientId,
      // Ensure optional fields are null if empty, or use their values
      phone: data.phone?.trim() || null,
      company: data.company?.trim() || null,
      job_title: data.job_title?.trim() || null,
      avatar_url: data.avatar_url?.trim() || null,
      source: data.source?.trim() || null,
      notes: data.notes?.trim() || null,
      last_contacted_at: parseInputDateString(data.last_contacted_at),
      enrichment_status: data.enrichment_status?.trim() || null,
      enriched_data: data.enriched_data, // Pass as is
    };

    try {
      // Trigger save mutation
      await saveMutation.mutateAsync(mutationData);
    } catch (err: any) {
      setFormError(err?.message || "An unexpected error occurred");
    }
  };

  const handleDeleteClient = () => {
    deleteMutation.mutate({ clientId });
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
  if (error || !client) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error ? error.message : "Client not found"}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={() => router.push("/clients")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
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
        <Button variant="outline" onClick={() => router.push("/clients")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Client
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Client Profile Card */}
      <Card className="mb-8 overflow-hidden">
        {/* Hero Banner - Optional background color or image */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
          {/* Status Badge - Positioned in top right */}
          {client.enrichment_status && (
            <div className="absolute top-4 right-4">
              <Badge
                className="text-sm px-3 py-1"
                variant={
                  client.enrichment_status === "completed"
                    ? "default"
                    : client.enrichment_status === "pending"
                    ? "outline"
                    : "secondary"
                }
              >
                {client.enrichment_status === "completed" ? (
                  <CheckCircle className="mr-1 h-3 w-3" />
                ) : client.enrichment_status === "failed" ? (
                  <XCircle className="mr-1 h-3 w-3" />
                ) : (
                  <Clock className="mr-1 h-3 w-3" />
                )}
                {client.enrichment_status.charAt(0).toUpperCase() +
                  client.enrichment_status.slice(1)}
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                {client.avatar_url ? (
                  <AvatarImage
                    src={client.avatar_url}
                    alt={`${client.first_name} ${client.last_name}`}
                  />
                ) : null}
                <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                  {getInitials(client.first_name, client.last_name)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Basic Info Section */}
            <div className="flex-1 pt-4 md:pt-8">
              <h1 className="text-3xl font-bold mb-2">
                {client.first_name} {client.last_name}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mt-4">
                {client.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a
                      href={`mailto:${client.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {client.email}
                    </a>
                  </div>
                )}
                
                {client.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a
                      href={`tel:${client.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {client.phone}
                    </a>
                  </div>
                )}
                
                {client.job_title && (
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{client.job_title}</span>
                  </div>
                )}
                
                {client.company && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{client.company}</span>
                  </div>
                )}
              </div>
              
              {/* Tags/Categories - For future implementation */}
              <div className="flex flex-wrap gap-2 mt-4">
                {client.source && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {client.source}
                  </Badge>
                )}
                {client.last_contacted_at && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last contact: {formatDateTime(client.last_contacted_at)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>
                Complete profile information for {client.first_name} {client.last_name}
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
                    <dd className="mt-1">{client.first_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Last Name</dt>
                    <dd className="mt-1">{client.last_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                    <dd className="mt-1">{client.email || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                    <dd className="mt-1">{client.phone || "—"}</dd>
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
                    <dd className="mt-1">{client.company || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Job Title</dt>
                    <dd className="mt-1">{client.job_title || "—"}</dd>
                  </div>
                </dl>
              </div>
              
              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-medium mb-2">Additional Information</h3>
                <Separator className="mb-4" />
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Source</dt>
                    <dd className="mt-1">{client.source || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Last Contacted</dt>
                    <dd className="mt-1">
                      {client.last_contacted_at ? formatDateTime(client.last_contacted_at) : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                    <dd className="mt-1">
                      {client.created_at ? formatDateTime(client.created_at) : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Updated</dt>
                    <dd className="mt-1">
                      {client.updated_at ? formatDateTime(client.updated_at) : "—"}
                    </dd>
                  </div>
                </dl>
              </div>
              
              {/* Enrichment Data (if available) */}
              {client.enriched_data && Object.keys(client.enriched_data).length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Enriched Information</h3>
                  <Separator className="mb-4" />
                  <div className="bg-muted/50 p-4 rounded-md">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(client.enriched_data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notes Tab */}
        <TabsContent value="notes">
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
              {client.notes ? (
                <div className="prose max-w-none bg-muted/30 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{client.notes}</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No notes yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Click the Edit button to add notes about this client.
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
        <TabsContent value="tasks">
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
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update information for {client.first_name} {client.last_name}
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
              
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Profile Image URL</Label>
                <Input
                  id="avatar_url"
                  {...register("avatar_url")}
                  className={errors.avatar_url ? "border-destructive" : ""}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.avatar_url && (
                  <p className="text-sm text-destructive">{errors.avatar_url.message}</p>
                )}
              </div>
              
              {/* Professional Information Section */}
              <div className="space-y-2 md:col-span-2 pt-4">
                <h3 className="text-lg font-medium">Professional Information</h3>
                <Separator />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  {...register("company")}
                  className={errors.company ? "border-destructive" : ""}
                />
                {errors.company && (
                  <p className="text-sm text-destructive">{errors.company.message}</p>
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
                  className={errors.last_contacted_at ? "border-destructive" : ""}
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
                  placeholder="Add any notes about this client..."
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
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete <span className="font-semibold">{client.first_name} {client.last_name}</span> and all associated data.
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
              onClick={handleDeleteClient}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Deleting...
                </>
              ) : (
                <>Delete Client</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 