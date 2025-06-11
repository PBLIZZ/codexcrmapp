import React from 'react';
import { ThemeProvider } from '../src/components/core/ThemeProvider';

// Ensure React is available globally
if (typeof window !== 'undefined' && !window.React) {
  window.React = React;
}

// This decorator wraps all stories with the necessary providers for React 19
export const withReact19 = (Story: React.ComponentType) => {
  // Use a simple div wrapper to avoid React 19 specific APIs
  return (
    <div className="storybook-wrapper">
      <ThemeProvider defaultTheme="light">
        <Story />
      </ThemeProvider>
    </div>
  );
};