// packages/ui/src/components/theme-provider.tsx
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// --- THIS IS THE CORRECT WAY TO GET THE TYPE ---
// We use React's built-in `ComponentProps` utility type to extract the props
// from the `NextThemesProvider` component itself. This is guaranteed to be stable.
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;
// --- END OF CORRECTION ---

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Now, our props are perfectly typed without any deep imports.
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
