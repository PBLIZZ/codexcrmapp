"use client";

import { useState } from "react";
// Import the api client using the correct path alias
import { api } from '@/lib/trpc/client'; 
import type { TRPCClientError } from '@trpc/client'; 
import type { AppRouter } from '@codexcrm/server/src/root'; 

// Define explicit client type
interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email?: string | null;
  user_id?: string;
  created_at?: string;
}

// Renamed function to avoid naming conflict with file, using PascalCase
export function ClientsContent() {
  // Use the api client to query clients with type assertion to avoid TypeScript errors
  const { data: clients, isLoading } = api.clients.testList.useQuery() as {
    data: Client[] | undefined;
    isLoading: boolean;
  };

  // Use the public test procedure for mutations with type assertion
  const mutation = api.clients.testUpsert.useMutation({
    async onSuccess() {
      // Refetch the query instead of using invalidate
      await refetch();
      setForm({ id: undefined, first_name: "", last_name: "", email: "" });
    },
    onError(error: TRPCClientError<AppRouter>) { 
      console.error('Mutation error:', error);
      alert(`Error adding client: ${error.message}`);
    }
  } as any); // Keeping 'as any' for now until types are fully stable
  
  // Add refetch function from the query with type assertion
  const { refetch } = api.clients.testList.useQuery(undefined, {
    enabled: false, // Don't run automatically since we already have the data
  }) as { refetch: () => Promise<any> }; // Keeping 'as any' for now

  // Form state with proper typing
  const [form, setForm] = useState({
    id: undefined as number | undefined,
    first_name: "",
    last_name: "",
    email: "",
  });

  // This loading check might be redundant if handled below
  // if (isLoading) return <p className="p-4">Loading...</p>; 

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <button 
          onClick={() => { /* TODO: Implement logic to show form */ }} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Client
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : clients && clients.length > 0 ? (
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
              {clients.map((client: Client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-medium">{client.first_name[0]}{client.last_name[0]}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.first_name} {client.last_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
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
      {/* Client Form - TODO: Show/hide based on state */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add/Edit Client</h2> 
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(form);
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
           {/* Consider adding a hidden input for ID when editing */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
            <input
              id="firstName"
              className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="First Name"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              required // Add required
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
            <input
              id="lastName"
              className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Last Name"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              required // Add required
            />
          </div>
          
          <div className="flex flex-col space-y-2 md:col-span-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          
          <div className="md:col-span-2 flex justify-end mt-4">
             {/* TODO: Add Cancel button */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={mutation.isLoading} // Use isLoading for TanStack Query v4
            >
              {mutation.isLoading ? ( // Use isLoading for TanStack Query v4
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : form.id ? "Update Client" : "Save Client"} 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
