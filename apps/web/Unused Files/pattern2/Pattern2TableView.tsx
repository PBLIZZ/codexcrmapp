'use client';
import { useState } from 'react';

import { api } from '@/lib/trpc';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
}

/**
 * Pattern2TableView: A responsive table with a faceted filter sidebar (tags placeholder).
 */
export function Pattern2TableView() {
  const { data: contacts, isLoading } = api.contacts.list.useQuery<Contact[]>({});
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  if (isLoading) {
    return <p>Loading Table view...</p>;
  }

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="flex">
      {/* Sidebar: Tag filters (stubbed) */}
      <aside className="w-1/4 p-4 border-r">
        <h3 className="font-semibold mb-2">Filters</h3>
        <div className="space-y-2">
          {['Yoga', 'Corporate', 'VIP'].map((tag) => (
            <button
              key={tag}
              onClick={() => toggleFilter(tag)}
              className={`block w-full text-left px-2 py-1 rounded ${activeFilters.includes(tag) ? 'bg-blue-200' : 'bg-gray-100'} hover:bg-blue-100`}
            >
              {tag}
            </button>
          ))}
        </div>
      </aside>
      {/* Main Pane: Filter chips and table */}
      <main className="flex-1 p-4">
        {/* Active filter chips */}
        <div className="mb-4 flex flex-wrap gap-2">
          {activeFilters.map((f) => (
            <span
              key={f}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center"
            >
              {f}
              <button
                onClick={() => toggleFilter(f)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        {/* Table of contacts */}
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Phone</th>
            </tr>
          </thead>
          <tbody>
            {contacts?.map((contact: Contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">
                  {contact.first_name} {contact.last_name}
                </td>
                <td className="border px-2 py-1">{contact.email || '-'}</td>
                <td className="border px-2 py-1">{contact.phone || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
