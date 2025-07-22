'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import * as z from 'zod';
import OneTapComponent from '../components/OneTapComponent';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
} from '@codexcrm/ui';
import { supabase } from '@/lib/supabase/client';

// Eye Icon SVG Components
const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' />
    <circle cx='12' cy='12' r='3' />
  </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M9.88 9.88a3 3 0 1 0 4.24 4.24' />
    <path d='M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68' />
    <path d='M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61' />
    <line x1='2' x2='22' y1='2' y2='22' />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polyline points='20 6 9 17 4 12'></polyline>
  </svg>
);

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);

  // Zod schema for signup form
  const signupSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setEmailError(null); // Clear previous errors
    setPasswordError(null);

    // Validate form data
    const validationResult = signupSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      if (fieldErrors.email?.[0]) {
        setEmailError(fieldErrors.email[0]);
      }
      if (fieldErrors.password?.[0]) {
        setPasswordError(fieldErrors.password[0]);
      }
      setIsLoading(false);
      return;
    }

    try {
      // Attempt sign up with email confirmation redirect
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
        setMessageType('error');
      } else {
        setMessage('Check your email for a confirmation link to complete your registration.');
        setMessageType('success');
        // Clear form
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred during sign up');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-teal-50 p-4 sm:p-6 md:p-8'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-4 pt-6 pb-4 px-4 sm:px-6'>
          <div className='flex items-center space-x-3 self-start'>
            <Image
              src='/images/logo.png'
              alt='CodexCRM Logo'
              width={40}
              height={40}
              className='h-8 w-8 sm:h-10 sm:w-10'
            />
            <div>
              <p className='text-xl font-semibold text-teal-700'>OmniCRM</p>
              <p className='text-xs text-gray-500'>by Omnipotency AI</p>
            </div>
          </div>
          <div className='text-center'>
            <CardTitle className='text-xl sm:text-2xl font-bold text-teal-800'>Sign Up</CardTitle>
            <CardDescription className='text-xs sm:text-sm text-gray-600'>
              Create your account to get started.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-6 px-4 sm:px-6 pb-4 sm:pb-6 pt-4'>
          {/* Message Display */}
          {message && (
            <p
              className={`text-sm text-center mb-4 ${
                messageType === 'error' ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {message}
            </p>
          )}
          {/* OneTapComponent will render Google Sign-In Button or Prompt */}
          <OneTapComponent />

          {/* Separator */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-gray-500'>Or continue with</span>
            </div>
          </div>

          {/* Email Sign Up Form */}
          <form onSubmit={handleSignUp} className='space-y-4'>
            {/* Email Field */}
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                Email address
              </label>
              <div className='relative mt-1 rounded-md'>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) {
                      setEmailError(null);
                    }
                    if (emailBlurred) {
                      const result = z
                        .string()
                        .email({ message: 'Invalid email address' })
                        .safeParse(e.target.value);
                      if (!result.success) {
                        setEmailError(result.error.flatten().formErrors[0] ?? null);
                      } else {
                        setEmailError(null);
                      }
                    }
                  }}
                  onBlur={() => {
                    setEmailBlurred(true);
                    const result = z
                      .string()
                      .email({ message: 'Invalid email address' })
                      .safeParse(email);
                    if (!result.success) {
                      setEmailError(result.error.flatten().formErrors[0] ?? null);
                    } else {
                      setEmailError(null);
                    }
                  }}
                  placeholder='you@example.com'
                  className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm ${
                    emailBlurred
                      ? emailError
                        ? 'border-red-500'
                        : 'border-green-500'
                      : 'border-gray-300'
                  }`}
                />
                {emailBlurred && !emailError && email.length > 0 && (
                  <CheckIcon className='absolute inset-y-0 right-0 flex items-center pr-3 text-green-500 h-5 w-5' />
                )}
              </div>
              {emailError && <p className='mt-1 text-xs text-red-600'>{emailError}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <div className='relative mt-1 rounded-md'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) {
                      setPasswordError(null);
                    }
                    if (passwordBlurred) {
                      const result = z
                        .string()
                        .min(6, { message: 'Password must be at least 6 characters' })
                        .safeParse(e.target.value);
                      if (!result.success) {
                        setPasswordError(result.error.flatten().formErrors[0] ?? null);
                      } else {
                        setPasswordError(null);
                      }
                    }
                  }}
                  onBlur={() => {
                    setPasswordBlurred(true);
                    const result = z
                      .string()
                      .min(6, { message: 'Password must be at least 6 characters' })
                      .safeParse(password);
                    if (!result.success) {
                      setPasswordError(result.error.flatten().formErrors[0] ?? null);
                    } else {
                      setPasswordError(null);
                    }
                  }}
                  placeholder='••••••••'
                  className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm pr-10 ${
                    passwordBlurred
                      ? passwordError
                        ? 'border-red-500'
                        : 'border-green-500'
                      : 'border-gray-300'
                  }`}
                />
                {passwordBlurred && !passwordError && password.length > 0 && (
                  <CheckIcon className='absolute inset-y-0 right-0 pr-10 flex items-center text-green-500 pointer-events-none h-5 w-5' />
                )}
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-orange-500'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOffIcon className='h-5 w-5' />
                  ) : (
                    <EyeIcon className='h-5 w-5' />
                  )}
                </button>
              </div>
              {passwordError && <p className='mt-1 text-xs text-red-600'>{passwordError}</p>}
            </div>

            {/* No confirm password field - removed as requested */}

            {/* Submit Button Container - Styled like login page */}
            <div className='flex justify-between items-end mt-2'>
              <Button
                type='submit'
                className='flex justify-center disabled:opacity-50 bg-teal-800 hover:bg-teal-700 text-teal-200 px-8 py-2 text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600'
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Sign up with Email'}
              </Button>
              {/* Empty div to maintain the flex layout similar to login page */}
              <div></div>
            </div>
          </form>
        </CardContent>

        <CardFooter className='flex flex-col items-center space-y-4 px-4 sm:px-6 pb-4 sm:pb-6 text-sm text-gray-600'>
          <p className='text-center'>
            Already have an account?{' '}
            <Link href='/log-in' className='font-medium text-teal-600 hover:text-teal-500'>
              Log in
            </Link>
          </p>
          <p className='mt-4 px-2 text-center text-xs text-gray-500'>
            By creating an account, you agree to our{' '}
            <Link href='/terms' className='underline hover:text-teal-700'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href='/privacy' className='underline hover:text-teal-700'>
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
