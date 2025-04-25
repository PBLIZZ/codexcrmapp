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
  id: z.number().optional(), // Optional for creation
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"), // Email is now required
  // user_id will be handled by the backend procedure
});

type ClientFormData = z.infer<typeof clientSchema>;

// Manually define Client type based on expected data from the list query
interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email?: string | null;
  created_at?: string | Date | null; // Allow Date type as well
}

export function ClientsContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<number | null>(null); // Track if editing
  
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
      first_name: "",
      last_name: "",
      email: "",
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
    const mutationData = {
        ...data,
        // Make sure ID is properly handled for creation vs update
        id: editingClientId || undefined,
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        email: data.email.trim(),
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
    reset({ id: undefined, first_name: "", last_name: "", email: "" }); // Clear form
    setEditingClientId(null); // Ensure not in editing mode
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (client: Client) => {
    // Map Client API data to ClientFormData, EXPLICITLY handling email
    const formData: ClientFormData = { 
      id: client.id,
      first_name: client.first_name,
      last_name: client.last_name,
      // Ensure email is string or undefined, never null for the form
      email: client.email === null || client.email === undefined ? '' : client.email, 
    };
    reset(formData); // Pass explicitly typed data to reset
    setEditingClientId(client.id); 
    setFormError(null);
    setIsFormOpen(true);
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

      {/* Form Section - Visibility controlled by CSS */}
      <div className={`mb-8 bg-white shadow-md rounded-lg p-6 border border-blue-200 transition-all duration-300 ease-in-out ${isFormOpen ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden p-0 border-0'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{editingClientId ? "Edit Client" : "Add New Client"}</h2>
          <button 
            type="button" // Important: Prevent default form submission
            onClick={() => { setIsFormOpen(false); reset(); setFormError(null); setEditingClientId(null); }}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button> 
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hidden ID field - value is managed by useEffect and setValue */}
          <input type="hidden" {...register("id")} />
          
          {/* First Name */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
            <input
              id="firstName"
              {...register("first_name")}
              className={`border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="First Name"
              disabled={isSubmitting}
            />
            {errors.first_name && <p className="text-xs text-red-600">{errors.first_name.message}</p>}
          </div>

          {/* Last Name */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
            <input
              id="lastName"
              {...register("last_name")}
              className={`border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Last Name"
              disabled={isSubmitting}
            />
            {errors.last_name && <p className="text-xs text-red-600">{errors.last_name.message}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-1 md:col-span-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Email"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>

          {/* Form Actions */}
          <div className="md:col-span-2 flex justify-end items-center mt-4 space-x-3">
             {formError && <p className="text-sm text-red-600 mr-auto">{formError}</p>}
             <button 
               type="button" 
               onClick={() => {
                 setIsFormOpen(false); 
                 reset(); 
                 setFormError(null); 
                 setEditingClientId(null);
               }}
               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
               disabled={isSubmitting} // Keep disabled state if needed
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
