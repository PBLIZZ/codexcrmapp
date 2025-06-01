import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

// Define paths as constants for maintainability
const PATHS = {
  signIn: '/sign-in',
  home: '/',
};

// Define error types and their messages
type ErrorType = 'expired_link' | 'invalid_link' | 'already_used' | 'oauth_interrupted' | 'unknown';

const ERROR_MESSAGES: Record<ErrorType, string> = {
  expired_link: 'The authentication link has expired.',
  invalid_link: 'The authentication link is invalid or malformed.',
  already_used: 'This authentication link has already been used.',
  oauth_interrupted: 'The sign-in process was interrupted before completion.',
  unknown: 'There was a problem with your authentication request.'
};

/**
 * Authentication Code Error Page
 * 
 * Displays a user-friendly error message when authentication fails.
 * Accepts error type and ID from URL search params to provide more specific information.
 */
export default function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams?: { error?: string; id?: string };
}) {
  // Get error type from search params or default to unknown
  const errorType = (searchParams?.error as ErrorType) || 'unknown';
  const errorId = searchParams?.id;
  
  // Get the appropriate error message
  const errorMessage = ERROR_MESSAGES[errorType] || ERROR_MESSAGES.unknown;
  
  // Determine which list items to highlight based on error type
  const isExpiredOrInvalid = errorType === 'expired_link' || errorType === 'invalid_link';
  const isAlreadyUsed = errorType === 'already_used';
  const isOAuthInterrupted = errorType === 'oauth_interrupted';
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Authentication Error</CardTitle>
          <CardDescription className="text-gray-600">{errorMessage}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p>The authentication process could not be completed. This might be due to:</p>
            <ul className="list-disc text-left pl-8">
              <li className={isExpiredOrInvalid ? 'font-medium text-red-700' : ''}>
                An expired or invalid magic link
              </li>
              <li className={isAlreadyUsed ? 'font-medium text-red-700' : ''}>
                A previously used authentication link
              </li>
              <li className={isOAuthInterrupted ? 'font-medium text-red-700' : ''}>
                An interrupted OAuth flow
              </li>
            </ul>
            {errorId && (
              <p className="text-sm text-gray-500 mt-4">
                Error reference: <code className="bg-gray-100 px-1 py-0.5 rounded">{errorId}</code>
              </p>
            )}
            <p className="mt-4">Please try signing in again with a fresh authentication request.</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild variant="default">
            <Link href={PATHS.signIn}>Return to Sign In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={PATHS.home}>Go to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
