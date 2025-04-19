"use client";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function ClientsPage() {
  const { data: clients, isLoading } = trpc.client.list.useQuery();
  const utils = trpc.useContext();
  const mutation = trpc.client.upsert.useMutation({
    async onSuccess() {
      await utils.client.list.invalidate();
      setForm({ id: undefined, first_name: "", last_name: "", email: "" });
    },
  });
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
          clients.map((c) => (
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
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'Saving...' : 'Add Client'}
        </button>
      </form>
    </div>
  );
}
