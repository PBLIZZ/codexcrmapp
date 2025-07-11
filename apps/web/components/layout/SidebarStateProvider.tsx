'use client';

import { ReactNode, useState } from 'react';
import { SidebarProvider } from '@codexcrm/ui';

interface SidebarStateProviderProps {
  children: ReactNode;
}

export function SidebarStateProvider({ children }: SidebarStateProviderProps) {
  const [open, setOpen] = useState(true);

  return (
    <SidebarProvider className='w-full h-full' style={{}} open={open} onOpenChange={setOpen}>
      {children}
    </SidebarProvider>
  );
}
