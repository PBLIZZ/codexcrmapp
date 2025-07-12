import { redirect } from 'next/navigation';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@codexcrm/ui';
import { createSupabaseServer } from '@/lib/supabase/server';

export default async function AuthCodeErrorPage() {
  const supabase = await createSupabaseServer();

  // Check if the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // If user is authenticated, redirect to dashboard
    redirect('/dashboard');
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold text-red-600'>Authentication Error</CardTitle>
          <CardDescription className='text-gray-600'>
            There was an error with your authentication request.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-center text-sm text-gray-500'>This could be due to:</div>
          <ul className='text-sm text-gray-600 space-y-1 list-disc list-inside'>
            <li>Invalid or expired authentication link</li>
            <li>Network connectivity issues</li>
            <li>Configuration problems</li>
          </ul>
          <div className='flex flex-col space-y-2'>
            <Button onClick={() => (window.location.href = '/log-in')} className='w-full'>
              Try Again
            </Button>
            <Button
              variant='outline'
              onClick={() => (window.location.href = '/')}
              className='w-full'
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
