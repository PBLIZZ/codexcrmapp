"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/trpc";

// Simple utility function for date formatting instead of using date-fns
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Client Type Definition (matching the schema from the server)
interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  company_name?: string | null;
  job_title?: string | null;
  profile_image_url?: string | null;
  source?: string | null;
  notes?: string | null;
  last_contacted_at?: string | null;
  enrichment_status?: string | null;
  enriched_data?: any | null;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
}

export function ClientDetailContent() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  // tRPC context for cache invalidation
  const utils = api.useContext();

  // Fetch client data
  const { 
    data: client, 
    isLoading, 
    error 
  } = api.clients.getById.useQuery(
    { clientId },
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  // Delete mutation
  const deleteMutation = api.clients.delete.useMutation({
    onSuccess: () => {
      // Redirect to clients list after successful deletion
      router.push("/clients");
    },
    onError: (error) => {
      console.error("Error deleting client:", error);
      setDeleteError(`Failed to delete client: ${error.message}`);
    },
  });

  // Handle delete action
  const handleDeleteClick = () => {
    setDeleteError(null);
    if (window.confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      deleteMutation.mutate({ clientId });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link 
            href="/clients" 
            className="text-blue-600 hover:text-blue-800 mr-3 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Clients
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link 
            href="/clients" 
            className="text-blue-600 hover:text-blue-800 mr-3 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Clients
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 border border-red-200">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Client</h2>
          <p className="text-gray-700">{error.message}</p>
        </div>
      </div>
    );
  }

  // No client found
  if (!client) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link 
            href="/clients" 
            className="text-blue-600 hover:text-blue-800 mr-3 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Clients
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Client Not Found</h2>
          <p className="text-gray-600">The client you're looking for could not be found or you don't have permission to access it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header with actions */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center mb-3 md:mb-0">
          <Link 
            href="/clients" 
            className="text-blue-600 hover:text-blue-800 mr-3 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Clients
          </Link>
          <h1 className="text-2xl font-bold">{client.first_name} {client.last_name}</h1>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/clients/${client.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Client
          </Link>
          <button
            onClick={handleDeleteClick}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Deleting..." : "Delete Client"}
          </button>
        </div>
      </div>

      {/* Delete Error */}
      {deleteError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {deleteError}
        </div>
      )}

      {/* Client Information Card */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              {client.profile_image_url ? (
                <img 
                  src={client.profile_image_url} 
                  alt={`${client.first_name} ${client.last_name}`} 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl text-gray-500 font-medium">
                  {client.first_name?.[0] ?? ""}{client.last_name?.[0] ?? ""}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {client.first_name} {client.last_name}
              </h2>
              {client.job_title && client.company_name && (
                <p className="text-gray-600">
                  {client.job_title} at {client.company_name}
                </p>
              )}
              {client.job_title && !client.company_name && (
                <p className="text-gray-600">{client.job_title}</p>
              )}
              {!client.job_title && client.company_name && (
                <p className="text-gray-600">{client.company_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Contact Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-600">Email:</span>{" "}
                  {client.email ? (
                    <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                      {client.email}
                    </a>
                  ) : (
                    <span className="text-gray-500">Not provided</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Phone:</span>{" "}
                  {client.phone ? (
                    <a href={`tel:${client.phone}`} className="text-blue-600 hover:underline">
                      {client.phone}
                    </a>
                  ) : (
                    <span className="text-gray-500">Not provided</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Additional Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-600">Source:</span>{" "}
                  {client.source || <span className="text-gray-500">Not provided</span>}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Last Contacted:</span>{" "}
                  {client.last_contacted_at ? (
                    formatDate(client.last_contacted_at)
                  ) : (
                    <span className="text-gray-500">Not recorded</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Client Since:</span>{" "}
                  {client.created_at ? (
                    formatDate(client.created_at.toString())
                  ) : (
                    <span className="text-gray-500">Unknown</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {client.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Notes</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700 whitespace-pre-line">{client.notes}</p>
              </div>
            </div>
          )}

          {/* Enrichment Data Section (if available) */}
          {client.enriched_data && Object.keys(client.enriched_data).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Enriched Data 
                <span className="ml-2 px-2 py-1 text-xs font-normal bg-blue-100 text-blue-800 rounded-full">
                  {client.enrichment_status}
                </span>
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="text-sm overflow-auto">{JSON.stringify(client.enriched_data, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
