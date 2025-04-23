"use client";

import React from 'react';
import { api } from '../src/lib/trpc/client';

/**
 * Home page: tests the tRPC client.list query
 */
export default function Page() {
  const { data, isLoading, error } = api.clients.testList.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}