'use client';

import { useState } from 'react';
import { ContactsMainContent } from './ContactsMainContent';

export function ContactsLayout() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // The sidebar is now handled by MainLayout.tsx
  return (
    <div className="flex h-full">
      {/* Main Content */}
      <ContactsMainContent
        selectedGroupId={selectedGroupId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
}