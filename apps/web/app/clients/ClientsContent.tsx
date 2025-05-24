"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { api } from '@/lib/trpc';
import { supabase } from '@/lib/supabase/client';
import type { TRPCClientError } from '@trpc/client';
import type { AppRouter } from '@codexcrm/server/src/root';

// Zod schema for validation
const clientSchema = z.object({
  id: z.string().uuid().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  avatar_url: z.string().url({ message: "Invalid URL for avatar" }).optional().nullable(),
  source: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  last_contacted_at: z.string().datetime({ message: "Invalid date format for Last Contacted At" }).optional().nullable(),
  enrichment_status: z.string().optional().nullable(),
  enriched_data: z.any().optional().nullable(), // For JSONB fields
});

type ClientFormData = z.infer<typeof clientSchema>;

// Manually define Client type based on expected data from the list query
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
  last_contacted_at?: string | null; // Stored as TIMESTAMPTZ, received as string
  enrichment_status?: string | null;
  enriched_data?: any | null; // JSONB
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
}

export function ClientsContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null); // Track if editing - ID is UUID string
  const [deleteError, setDeleteError] = useState<string | null>(null); // For delete errors
  
  const utils = api.useContext(); // Get tRPC context for cache invalidation

  // --- Queries & Mutations ---
  const { data: clients, isLoading, error: queryError } = api.clients.list.useQuery<Client[]>();

  const saveMutation = api.clients.save.useMutation({
    // We'll handle success/error in the onSubmit function to have more control
    // and avoid race conditions
    onMutate: (variables) => {
      console.log('Starting mutation with variables:', variables);
    },
  });

  // Mutation for deleting a client
  const deleteMutation = api.clients.delete.useMutation({
    onSuccess: (data) => {
      console.log(`Successfully deleted client ${data.deletedClientId}. Invalidating list cache.`);
      utils.clients.list.invalidate(); // Refresh the list on successful delete
      setDeleteError(null); // Clear any previous delete error
    },
    onError: (error) => {
      console.error('Error deleting client:', error);
      setDeleteError(`Failed to delete client: ${error.message}`);
    },
  });

  // --- Form Handling ---
  const {
    register,
    handleSubmit,
    reset,
    setValue, // Use setValue to programmatically set values
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      id: undefined,
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      job_title: "",
      avatar_url: "",
      source: "",
      notes: "",
      last_contacted_at: "",
      enrichment_status: "",
      enriched_data: null,
    },
  });

  // Update form values when editingClientId changes
  useEffect(() => {
    // Only set the ID when we're in edit mode
    if (editingClientId !== null) {
      setValue("id", editingClientId);
    } else {
      setValue("id", undefined); // Clear ID when adding new client
    }
  }, [editingClientId, setValue]);

  const onSubmit: SubmitHandler<ClientFormData> = async (data) => {
    setFormError(null);
    console.log("Submitting client form:", data);
    
    // Ensure optional email is null if empty string for the backend
    const mutationData: ClientFormData = {
        ...data,
        id: editingClientId || undefined,
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || null,
        company: data.company?.trim() || null,
        job_title: data.job_title?.trim() || null,
        avatar_url: data.avatar_url?.trim() || null,
        source: data.source?.trim() || null,
        notes: data.notes?.trim() || null,
        last_contacted_at: data.last_contacted_at ? new Date(data.last_contacted_at).toISOString() : null,
        enrichment_status: data.enrichment_status?.trim() || null,
        enriched_data: data.enriched_data, // Pass as is, backend Zod schema uses z.any()
    };
    
    console.log("Mutation data being sent to server:", mutationData);
    
    try {
      // First check if we're authenticated using the Supabase client directly
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Cannot add client: User not authenticated with Supabase");
        setFormError("Authentication error. Please sign out and sign back in.");
        return;
      }
      
      console.log(`[onSubmit:Async] Authenticated as user: ${user.id}`);
      
      // Execute mutation
      console.log('[onSubmit:Async] Calling saveMutation.mutateAsync...');
      try {
        const result = await saveMutation.mutateAsync(mutationData);
        console.log('[onSubmit:Async] Mutation successful. Result:', result);

        // --- Success Handling --- 
        console.log('[onSubmit:Async] Calling utils.clients.list.invalidate()...');
        await utils.clients.list.invalidate(); // Can await invalidation if needed, though not strictly necessary
        console.log('[onSubmit:Async] Invalidation complete. Closing form and resetting.');
        setIsFormOpen(false);
        reset();
        setFormError(null);
        setEditingClientId(null);
      } catch (err: any) {
        // --- Error Handling --- 
        console.error('[onSubmit:Async] Mutation failed:', err);
        // Attempt to get a more specific message from tRPC error
        const message = err.message ?? 'Unknown error saving client';
        setFormError(message);
      }
      console.log('[onSubmit:Async] Finished handling mutation.');
    } catch (authError) {
      console.error('[onSubmit:Async] Authentication check failed:', authError);
      setFormError(authError instanceof Error ? authError.message : 'Authentication error');
    }
  };

  // --- Action Handlers ---
  const handleAddNewClick = () => {
    reset({
      id: undefined,
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      job_title: "",
      avatar_url: "",
      source: "",
      notes: "",
      last_contacted_at: "",
      enrichment_status: "",
      enriched_data: null,
    });
    setEditingClientId(null);
    setFormError(null);
    setDeleteError(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (client: Client) => {
    // Map Client API data to ClientFormData
    const formData: ClientFormData = { 
      id: client.id,
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email ?? '',
      phone: client.phone ?? '',
      company: client.company ?? '',
      job_title: client.job_title ?? '',
      avatar_url: client.avatar_url ?? '',
      source: client.source ?? '',
      notes: client.notes ?? '',
      last_contacted_at: client.last_contacted_at ? new Date(client.last_contacted_at).toISOString().substring(0, 16) : '', // Format for datetime-local
      enrichment_status: client.enrichment_status ?? '',
      enriched_data: client.enriched_data ?? null,
    };
    reset(formData); // Pass explicitly typed data to reset
    setEditingClientId(client.id); 
    setFormError(null);
    setDeleteError(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (clientId: string) => {
    setDeleteError(null); // Clear previous errors
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      console.log(`Attempting to delete client with ID: ${clientId}`);
      deleteMutation.mutate({ clientId });
    }
  };

  // --- Rendering ---
  if (queryError) {
    return <p className="p-4 text-red-600">Error loading clients: {queryError.message}</p>;
  }

  if (isLoading) {
    return <p className="p-4 text-gray-500">Loading clients...</p>;
  }

  // Ensure clients is an array before mapping (handle potential undefined/null)
  const clientList = Array.isArray(clients) ? clients : [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <button 
          onClick={handleAddNewClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Client
        </button>
      </div>

      {/* Display Delete Error */}
      {deleteError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {deleteError}
        </div>
      )}

      {/* Form Section - Visibility controlled by CSS */}
      <div className={`mb-8 bg-white shadow-md rounded-lg p-6 border border-blue-200 transition-all duration-300 ease-in-out ${isFormOpen ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden p-0 border-0'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{editingClientId ? "Edit Client" : "Add New Client"}</h2>
          <button 
            type="button" // Important: Prevent default form submission
            onClick={() => { setIsFormOpen(false); reset(); setFormError(null); setEditingClientId(null); setDeleteError(null); }}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        {/* Form error message */}
        {formError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields would go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="first_name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("first_name")}
              />
              {errors.first_name && <p className="text-sm text-red-600">{errors.first_name.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="last_name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("last_name")}
              />
              {errors.last_name && <p className="text-sm text-red-600">{errors.last_name.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                {...register("email")}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>
          
          <div className="flex space-x-2 justify-end mt-4">
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                reset();
                setFormError(null);
                setEditingClientId(null);
                setDeleteError(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isSubmitting || saveMutation.isLoading}
            >
              {isSubmitting || saveMutation.isLoading ? "Saving..." : (editingClientId ? "Update Client" : "Save Client")}
            </button>
          </div>
        </form>
      </div>

      {/* Client List Table */}
      {clientList.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientList.map((client: Client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {/* Handle missing names gracefully */}
                        <span className="text-gray-500 font-medium">{(client.first_name?.[0] ?? '')}{(client.last_name?.[0] ?? '')}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.first_name} {client.last_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEditClick(client)}
                      className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={saveMutation.isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(client.id)}
                      className="ml-2 text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={deleteMutation.isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No clients found. Add your first client to get started.</p>
        </div>
      )}
    </div>
  );
}
