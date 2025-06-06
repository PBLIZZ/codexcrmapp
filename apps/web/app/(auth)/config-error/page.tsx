import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

// Define paths as constants for maintainability
const PATHS = {
  signIn: '/sign-in',
  home: '/',
};

// Required environment variables for Supabase
const REQUIRED_ENV_VARS = [
  { name: 'NEXT_PUBLIC_SUPABASE_URL', description: 'Supabase project URL' },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', description: 'Supabase anonymous API key' },
];

/**
 * Configuration Error Page
 * 
 * Displays when the authentication service is not properly configured,
 * typically due to missing environment variables for Supabase.
 * 
 * This page provides information for both users and developers about
 * the configuration issue and how to resolve it.
 */
export default function ConfigErrorPage({
  searchParams,
}: {
  searchParams?: { missing?: string };
}) {
  // Get the specific missing variable from search params if available
  const missingVar = searchParams?.missing;
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-600" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Configuration Error</CardTitle>
          <CardDescription className="text-gray-600">Authentication service configuration issue</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p>The authentication service is not properly configured.</p>
            <p className="text-sm text-gray-600">
              This is likely due to missing environment variables for the Supabase authentication service.
              Please contact the administrator to resolve this issue.
            </p>
            
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm font-medium text-amber-800">For developers:</p>
              <p className="text-xs text-amber-700 mb-2">
                {missingVar ? (
                  <>The <code className="bg-amber-100 px-1 rounded">{missingVar}</code> environment variable is missing.</>
                ) : (
                  <>Ensure that the following environment variables are properly set:</>
                )}
              </p>
              
              {!missingVar && (
                <ul className="text-xs text-amber-700 list-disc pl-5 space-y-1">
                  {REQUIRED_ENV_VARS.map((envVar) => (
                    <li key={envVar.name}>
                      <code className="bg-amber-100 px-1 rounded">{envVar.name}</code>
                      <span className="ml-1">- {envVar.description}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              <p className="text-xs text-amber-700 mt-2">
                Check your <code className="bg-amber-100 px-1 rounded">.env.local</code> file or deployment environment configuration.
              </p>
            </div>
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
