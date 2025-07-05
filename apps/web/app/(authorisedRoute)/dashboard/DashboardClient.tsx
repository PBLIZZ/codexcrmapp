'use client';

import React from 'react';
import { Skeleton } from '@codexcrm/ui';
import { Alert, AlertDescription, AlertTitle } from '@codexcrm/ui';
import { AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

// Use dynamic imports with error boundaries for components that might fail
const DashboardContent = dynamic(() => import('./DashboardContent'), {
  loading: () => <Skeleton className="h-[500px] w-full" />,
  ssr: false
});

const OmniBot = dynamic(() => import('../../../components/omni-bot/OmniBot').then(mod => ({ default: mod.OmniBot })), {
  loading: () => null,
  ssr: false
});

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Dashboard Error</AlertTitle>
            <AlertDescription>
              There was an error loading the dashboard. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function DashboardClient() {
  return (
    <ErrorBoundary>
      <DashboardContent />
      <OmniBot />
    </ErrorBoundary>
  );
}