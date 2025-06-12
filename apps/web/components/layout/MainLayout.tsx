'use client';

import { ReactNode } from 'react';

// Import the specialized layout components we've built
import { Header } from './Header';
import { AppSidebarController } from './AppSidebarController';
import { OmniBotFloat } from './OmniBotFloat';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout - The final, clean Application Shell.
 * It orchestrates the primary layout structure and ensures the sidebar
 * has a full, persistent height while the main content scrolls.
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      
      {/* 
        This is the main content grid. 
        `flex-1` makes this container take up all available vertical space
        left over by the Header.
      */}
      <div className="container mx-auto flex-1 items-start md:grid md:grid-cols-[260px_1fr] md:gap-x-8">
        
        {/* --- THE SIDEBAR --- */}
        {/* This <aside> element contains the key classes for the sticky layout. */}
        <aside className="hidden md:block sticky top-20 h-[calc(100vh-5rem)]">
          {/* 
            - `sticky`: Makes the element stick to the viewport.
            - `top-20`: Sets the "stuck" position 5rem (80px) from the top, leaving space for the header.
            - `h-[calc(100vh-5rem)]`: THIS IS THE CRITICAL FIX. It sets the sidebar's height
              to be the full viewport height (100vh) minus the space for the header (5rem),
              guaranteeing it extends to the bottom of the screen.
          */}
          <AppSidebarController />
        </aside>

        {/* --- THE MAIN CONTENT --- */}
        {/* The main content area will scroll naturally if its content is taller than the screen. */}
        <main className="py-6">
          {children}
        </main>
      </div>

      <OmniBotFloat />
    </div>
  );
}