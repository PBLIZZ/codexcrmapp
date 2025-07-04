'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@codexcrm/ui/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@codexcrm/ui/components/ui/card';
import { Input } from '@codexcrm/ui/components/ui/input';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setMessageType('error');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`, // Important: This will be the page where user sets new password
    });

    if (error) {
      setMessage(error.message);
      setMessageType('error');
    } else {
      setMessage(
        'If an account exists for this email, a password reset link has been sent. Please check your inbox.'
      );
      setMessageType('success');
    }
    setIsLoading(false);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-teal-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-4 pt-6 pb-4 px-6'>
          <div className='flex items-center space-x-3 self-start'>
            <Image
              src='/images/logo.png'
              alt='OmniCRM Logo'
              width={40}
              height={40}
              className='h-10 w-10'
            />
            <div>
              <p className='text-xl font-semibold text-teal-700'>OmniCRM</p>
              <p className='text-xs text-gray-500'>by Omnipotency AI</p>
            </div>
          </div>
          <div className='text-center'>
            <CardTitle className='text-3xl font-bold text-teal-800'>Reset Password</CardTitle>
            <CardDescription className='text-sm text-teal-800'>
              Enter your email to receive a password reset link.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          <form onSubmit={(e) => void handlePasswordReset(e)} className='space-y-4'>
            <div>
              <Input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                placeholder='Email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full border-gray-300 focus:border-teal-500 focus:ring-teal-500'
              />
            </div>

            {message && (
              <p
                className={`text-sm ${messageType === 'error' ? 'text-red-600' : 'text-green-600'}`}
              >
                {message}
              </p>
            )}

            <div>
              <Button
                type='submit'
                className='w-full bg-teal-800 hover:bg-teal-700 text-teal-200 font-semibold disabled:opacity-50 transition-colors'
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className='text-center text-sm text-gray-600 pt-6'>
          <p>
            Remember your password?{' '}
            <Link href='/log-in' className='font-medium text-teal-600 hover:text-teal-500'>
              Back to Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
