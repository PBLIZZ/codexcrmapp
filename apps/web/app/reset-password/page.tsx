import { Suspense } from 'react';
import { ResetPasswordContent } from './ResetPasswordContent';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * Server Component wrapper with Suspense boundary for the ResetPasswordContent.
 * This pattern is required because the ResetPasswordContent component uses hooks like
 * useSearchParams and useRouter which must be wrapped in a Suspense boundary when used
 * in the App Router. This prevents the "useSearchParams should be wrapped in suspense boundary" error.
 * 
 * The Suspense boundary allows the app to show a fallback UI while the client component loads,
 * handling asynchronous dependencies gracefully.
 */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="container flex items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
            <CardDescription>Please wait while we load the password reset page</CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
