'use client';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
} from '@codexcrm/ui';
import { supabase } from '@/lib/supabase/client';
import OneTapComponent from '../components/OneTapComponent';

// Google Icon SVG Component
const GoogleIcon = () => (
  <svg className='w-4 h-4' viewBox='0 0 24 24'>
    <path
      fill='currentColor'
      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
    />
    <path
      fill='currentColor'
      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
    />
    <path
      fill='currentColor'
      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
    />
    <path
      fill='currentColor'
      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
    />
  </svg>
);

export default function LogInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Redirect will be handled by the auth state change
        window.location.href = '/dashboard';
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Left Column - Branding */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white'>
        <div className='flex flex-col justify-center max-w-md'>
          <div className='mb-8'>
            <Image
              src='/images/logo.png'
              alt='CodexCRM Logo'
              width={60}
              height={60}
              className='rounded-lg shadow-lg'
            />
          </div>
          <h1 className='text-4xl font-bold mb-6'>Welcome to CodexCRM</h1>
          <p className='text-xl opacity-90 mb-8'>
            Streamline your customer relationships with our powerful CRM platform.
          </p>
          <div className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
                ✓
              </div>
              <span>Manage contacts efficiently</span>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
                ✓
              </div>
              <span>Track interactions and deals</span>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
                ✓
              </div>
              <span>Automate your workflow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className='flex-1 flex items-center justify-center p-8'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold'>Log In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm'>
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className='space-y-4'>
              <div>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your password'
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>Or continue with</span>
              </div>
            </div>

            <Button
              type='button'
              variant='outline'
              className='w-full'
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <GoogleIcon />
              <span className='ml-2'>Google</span>
            </Button>

            {/* Google One Tap Component */}
            <OneTapComponent />
          </CardContent>
          <CardFooter className='text-center'>
            <p className='text-sm text-gray-600'>
              Don't have an account?{' '}
              <Link href='/sign-up' className='text-blue-600 hover:underline'>
                Sign up
              </Link>
            </p>
            <p className='text-sm text-gray-600 mt-2'>
              <Link href='/forgot-password' className='text-blue-600 hover:underline'>
                Forgot your password?
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
