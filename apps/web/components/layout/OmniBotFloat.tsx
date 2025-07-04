'use client';

import { OmniBot } from '@/components/omni-bot/OmniBot';
import { Button } from '@codexcrm/ui/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@codexcrm/ui/components/ui/sheet';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * OmniBotFloat provides a global Floating Action Button (FAB) that opens
 * the OmniBot AI assistant in a floating side panel.
 */
export function OmniBotFloat() {
  return (
    // The Sheet component manages the open/closed state of the panel.
    <Sheet>
      {/* 1. The Floating Action Button (FAB) */}
      <SheetTrigger asChild>
        <Button
          size="icon"
          className={cn(
            'fixed bottom-6 right-6 z-50', // Positioning and z-index
            'h-14 w-14 rounded-full shadow-lg', // Sizing and appearance
            'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground', // Styling
            'hover:scale-105 transition-transform' // Hover effect
          )}
        >
          <Bot className="h-7 w-7" />
          <span className="sr-only">Open OmniBot Assistant</span>
        </Button>
      </SheetTrigger>
      
      {/* 2. The Floating Sidebar Panel */}
      <SheetContent
        side="right"
        // This is the key to the custom styling. We override the default sheet styles.
        className={cn(
          // Reset default sheet styles
          'h-auto w-auto p-0 border-none bg-transparent shadow-none', 
          // Positioning and Sizing
          'fixed inset-y-6 right-6 flex',
          // Set a max-height to prevent overflow and a width for the panel
          'max-h-[calc(100vh-3rem)] w-[400px]'
        )}
      >
        {/* The visible container for the panel content */}
        <div 
          className={cn(
            'flex flex-col w-full h-full',
            'bg-card text-card-foreground border rounded-xl shadow-2xl'
          )}
        >
          {/* You can add an optional header here if you like */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Bot className="h-5 w-5" />
              OmniBot Assistant
            </h3>
          </div>
          
          {/* Render the actual OmniBot component inside */}
          <div className="flex-1 p-4 overflow-y-auto">
            <OmniBot />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
