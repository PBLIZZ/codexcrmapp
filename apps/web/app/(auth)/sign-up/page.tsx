'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';

import OneTapComponent from '@/app/(auth)/components/auth/OneTapComponent'; // Ensure this path is correct and component exists
import { Button } from '@codexcrm/ui';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@codexcrm/ui';
import { Input } from '@codexcrm/ui';
import { createBrowserClient } from '@codexcrm/auth';

const supabase = createBrowserClient();

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
    <polyline points='20 6 9 17 4 12' />
  </svg>
);

const PasswordRequirements = ({ password }: { password: string }) => {
  const requirements = [
    { text: 'At least 8 characters', met: password.length >= 8, id: 'length' },
    {
      text: 'At least one uppercase letter',
      met: /[A-Z]/.test(password),
      id: 'uppercase',
    },
    {
      text: 'At least one lowercase letter',
      met: /[a-z]/.test(password),
      id: 'lowercase',
    },
    { text: 'At least one number', met: /[0-9]/.test(password), id: 'number' },
    {
      text: 'At least one special character',
      met: /[^A-Za-z0-9]/.test(password),
      id: 'special',
    },
  ];

  return (
    <div className='mt-2 space-y-1 flex flex-col items-end'>
      {requirements.map((req) => (
        <div key={req.id} className='flex items-center'>
          <span className={`mr-2 ${req.met ? 'text-green-500' : 'text-gray-400'}`}>
            {req.met ? '✓' : '○'}
          </span>
          <span className={`text-xs ${req.met ? 'text-gray-700' : 'text-gray-500'}`}>
            {req.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isLoading, setIsLoading] = useState(false);
  // const [isOauthLoading, setIsOauthLoading] = useState<'google' | null>(null); // Replaced by OneTapComponent
  const [showPassword, setShowPassword] = useState(false);
  const [fullNameBlurred, setFullNameBlurred] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);

  const signUpSchema = z.object({
    fullName: z.string().min(1, { message: 'Full name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter.',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter.',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least one special character.',
      }),
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [fullNameError, setFullNameError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('error'); // Reset message type
    setFullNameError(null); // Clear previous errors
    setEmailError(null); // Clear previous errors
    setPasswordError(null);

    // Validate form data
    const validationResult = signUpSchema.safeParse({
      fullName,
      email,
      password,
    });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      if (fieldErrors.fullName) {setFullNameError(fieldErrors.fullName[0] ?? null);}
      if (fieldErrors.email) {setEmailError(fieldErrors.email[0] ?? null);}
      if (fieldErrors.password) {setPasswordError(fieldErrors.password[0] ?? null);}
      setIsLoading(false);
      return;
    }

    // Removed password confirmation check

    setIsLoading(true);
    try {
      // Attempt sign up with email confirmation redirect
      const { data, error } = await supabase.auth.signUp({
        email: validationResult.data.email, // Use validated email
        password: validationResult.data.password, // Use validated password
        options: {
          data: {
            full_name: validationResult.data.fullName, // Add full_name to user_meta_data
          },
          emailRedirectTo: `${
            process.env['NEXT_PUBLIC_APP_URL'] ?? window.location.origin
          }/api/auth/callback?next=/dashboard`,
        },
      });
      if (error) {
        if (
          error.message.toLowerCase().includes('user already registered') ||
          error.message.toLowerCase().includes('email address already in use')
        ) {
          setMessage('USER_ALREADY_REGISTERED');
          setMessageType('error'); // Keep as error type for styling
        } else {
          setMessage(error.message);
          setMessageType('error');
        }
      } else if (data.session) {
        // If session exists, navigate to dashboard
        window.location.href = '/dashboard';
        return;
      } else {
        setMessage('Check your email to confirm your account!'); // Updated message
        setMessageType('success');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };
  // handleOAuthLogin function removed as OneTapComponent handles Google Sign-In

  return (
    <div className='flex min-h-screen items-center justify-center bg-teal-50 p-4 sm:p-6 md:p-8'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='space-y-1 pt-6 pb-4 px-4 sm:px-6'>
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
            <CardTitle className='text-xl sm:text-2xl font-bold text-teal-800 text-center'>
              {' '}
              Account
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm text-gray-600 text-center'>
              Enter your details to create a new account.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-6 px-4 sm:px-6 pb-4 sm:pb-6 pt-4'>
          {/* General Message Display */}
          {message === 'USER_ALREADY_REGISTERED' ? (
            <p className='text-sm text-center text-red-600 mb-4'>
              This email is already registered. Please{' '}
              <Link
                href='/log-in'
                className='font-medium text-teal-600 hover:text-teal-500 underline'
              >
                log in
              </Link>
              .
            </p>
          ) : message ? (
            <p
              className={`text-sm text-center mb-4 ${
                messageType === 'error' ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {message}
            </p>
          ) : null}
          {/* OneTapComponent will render Google Sign-In Button or Prompt */}
          <OneTapComponent />

          {/* Separator */}
          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-gray-500'>OR</span>
            </div>
          </div>

          <form onSubmit={(e) => void handleSignUp(e)} className='space-y-6'>
            {' '}
            {/* Increased space-y for better visual separation with placeholders */}
            {/* Full Name Input */}
            <div className='relative'>
              <Input
                id='fullName'
                name='fullName'
                type='text'
                autoComplete='name'
                required
                placeholder='Full Name'
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFullName(e.target.value);
                  if (fullNameError) {
                    setFullNameError(null);
                  }
                  if (fullNameBlurred) {
                    const result = signUpSchema.shape.fullName.safeParse(e.target.value);
                    if (!result.success) {
                      setFullNameError(result.error.flatten().formErrors[0] ?? null);
                    } else {
                      setFullNameError(null);
                    }
                  }
                }}
                onBlur={() => {
                  setFullNameBlurred(true);
                  const result = signUpSchema.shape.fullName.safeParse(fullName);
                  if (!result.success) {
                    setFullNameError(result.error.flatten().formErrors[0] ?? null);
                  } else {
                    setFullNameError(null);
                  }
                }}
                className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm pr-10 ${
                  fullNameBlurred
                    ? fullNameError
                      ? 'border-red-500'
                      : 'border-green-500'
                    : 'border-gray-300'
                }`}
              />
              {fullNameBlurred && !fullNameError && fullName.length > 0 && (
                <CheckIcon className='absolute inset-y-0 right-0 pr-3 flex items-center text-green-500 pointer-events-none h-5 w-5' />
              )}
              {fullNameError && <p className='mt-1 text-xs text-red-600'>{fullNameError}</p>}
            </div>
            <div className='relative'>
              {/* Email Input - Label removed */}
              <Input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                placeholder='Email' // Label as placeholder
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement> ) => {
                  setEmail(e.target.value);
                  if (emailError) {
                    setEmailError(null);
                  }
                  if (emailBlurred) {
                    const result = signUpSchema.shape.email.safeParse(e.target.value);
                    if (!result.success) {
                      setEmailError(result.error.flatten().formErrors[0] ?? null);
                    } else {
                      setEmailError(null);
                    }
                  }
                }}
                onBlur={() => {
                  setEmailBlurred(true);
                  const result = signUpSchema.shape.email.safeParse(email);
                  if (!result.success) {
                    setEmailError(result.error.flatten().formErrors[0] ?? null);
                  } else {
                    setEmailError(null);
                  }
                }}
                autoFocus
                className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm pr-10 ${
                  emailBlurred
                    ? emailError
                      ? 'border-red-500'
                      : 'border-green-500'
                    : 'border-gray-300'
                }`}
                autoCapitalize='none'
              />
              {emailBlurred && !emailError && email.length > 0 && (
                <CheckIcon className='absolute inset-y-0 right-0 pr-3 flex items-center text-green-500 pointer-events-none h-5 w-5' />
              )}
              {emailError && <p className='mt-1 text-xs text-red-600'>{emailError}</p>}
            </div>
            <div className='relative'>
              {/* Password Input - Label removed */}
              <Input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                autoComplete='new-password'
                required
                placeholder='Password' // Label as placeholder
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  if (passwordError) {
                    setPasswordError(null);
                  }
                  if (passwordBlurred) {
                    const result = signUpSchema.shape.password.safeParse(e.target.value);
                    if (!result.success) {
                      setPasswordError(result.error.flatten().formErrors[0] ?? null);
                    } else {
                      setPasswordError(null);
                    }
                  }
                }}
                onBlur={() => {
                  setPasswordBlurred(true);
                  const result = signUpSchema.shape.password.safeParse(password);
                  if (!result.success) {
                    setPasswordError(result.error.flatten().formErrors[0] ?? null);
                  } else {
                    setPasswordError(null);
                  }
                }}
                className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm pr-10 ${
                  passwordBlurred
                    ? passwordError
                      ? 'border-red-500'
                      : 'border-green-500'
                    : 'border-gray-300'
                }`}
              />
              {passwordBlurred &&
                !passwordError &&
                password.length > 0 &&
                signUpSchema.shape.password.safeParse(password).success && (
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
            </div>{' '}
            {/* Closes <div className="relative"> for password input */}
            {passwordError && <p className='mt-1 text-xs text-red-600'>{passwordError}</p>}
            <PasswordRequirements password={password} />
            <div>
              <Button variant='default' size='md' type='submit'
                className='w-full flex justify-center disabled:opacity-50 bg-teal-800 hover:bg-teal-700 text-teal-200' // Orange button
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Sign Up with Email'}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className='flex flex-col items-center space-y-3 pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6 text-sm text-gray-600'>
          <p>
            Already have an account?{' '}
            <Link href='/log-in' className='font-medium text-teal-600 hover:text-teal-500'>
              Log In
            </Link>
          </p>
          <p className='px-2 text-center text-xs text-gray-500'>
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
