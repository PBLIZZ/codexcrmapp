"use client";
import { useState } from "react";

// Import the api client from the correct location
import { api } from "../../src/lib/trpc/client";

// Define explicit client type
interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email?: string | null;
  user_id?: string;
  created_at?: string;
}

export default function ClientsPage() {
  // Use the api client to query clients
  const { data: clients, isLoading } = api.clients.testList.useQuery();

  // Use the api client for mutations
  const mutation = api.clients.upsert.useMutation({
    async onSuccess() {
      // Refetch the query instead of using invalidate
      await refetch();
      setForm({ id: undefined, first_name: "", last_name: "", email: "" });
    },
  });
  
  // Add refetch function from the query
  const { refetch } = api.clients.testList.useQuery(undefined, {
    enabled: false, // Don't run automatically since we already have the data
  });

  // Form state with proper typing
  const [form, setForm] = useState({
    id: undefined as number | undefined,
    first_name: "",
    last_name: "",
    email: "",
  });

  if (isLoading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <ul className="mb-6">
        {clients && clients.length > 0 ? (
          clients.map((c: Client) => (
            <li key={c.id} className="mb-2">
              <strong>{c.first_name} {c.last_name}</strong> {c.email && <span>({c.email})</span>}
            </li>
          ))
        ) : (
          <li>No clients yet.</li>
        )}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(form);
        }}
        className="flex flex-col gap-2 max-w-md"
      >
        <input
          className="border rounded p-2"
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Email (optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 mt-2"
          disabled={mutation.status === 'loading'}
        >
          {mutation.status === 'loading' ? 'Saving...' : 'Add Client'}
        </button>
      </form>
    </div>
  );
}
