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
import { signUpWithEmail } from '@/lib/auth/auth-actions';
import { Eye, EyeOff, Check } from 'lucide-react';

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fullNameBlurred, setFullNameBlurred] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [businessNameBlurred, setBusinessNameBlurred] = useState(false);

  // Zod schema for signup form
  const signupSchema = z.object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    businessName: z
      .string()
      .min(1, 'Business name is required')
      .min(2, 'Business name must be at least 2 characters'),
  });

  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [businessNameError, setBusinessNameError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    // Clear previous errors
    setFullNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setBusinessNameError(null);

    // Validate form data
    const validationResult = signupSchema.safeParse({ fullName, email, password, businessName });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      if (fieldErrors.fullName?.[0]) {
        setFullNameError(fieldErrors.fullName[0]);
      }
      if (fieldErrors.email?.[0]) {
        setEmailError(fieldErrors.email[0]);
      }
      if (fieldErrors.password?.[0]) {
        setPasswordError(fieldErrors.password[0]);
      }
      if (fieldErrors.businessName?.[0]) {
        setBusinessNameError(fieldErrors.businessName[0]);
      }
      setIsLoading(false);
      return;
    }

    try {
      // Use centralized signUpWithEmail function
      const { error } = await signUpWithEmail({
        fullName,
        email,
        password,
        businessName,
      });

      if (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'An error occurred during sign up';
        setMessage(errorMessage);
        setMessageType('error');
      } else {
        setMessage('Check your email for a confirmation link to complete your registration.');
        setMessageType('success');
        // Clear form
        setFullName('');
        setEmail('');
        setPassword('');
        setBusinessName('');
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
            {/* Full Name Field */}
            <div>
              <label htmlFor='fullName' className='block text-sm font-medium text-gray-700 mb-1'>
                Full Name
              </label>
              <div className='relative mt-1 rounded-md'>
                <Input
                  id='fullName'
                  name='fullName'
                  type='text'
                  autoComplete='name'
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fullNameError) {
                      setFullNameError(null);
                    }
                    if (fullNameBlurred) {
                      const result = z
                        .string()
                        .min(2, { message: 'Full name must be at least 2 characters' })
                        .safeParse(e.target.value);
                      if (!result.success) {
                        setFullNameError(result.error.flatten().formErrors[0] ?? null);
                      } else {
                        setFullNameError(null);
                      }
                    }
                  }}
                  onBlur={() => {
                    setFullNameBlurred(true);
                    const result = z
                      .string()
                      .min(2, { message: 'Full name must be at least 2 characters' })
                      .safeParse(fullName);
                    if (!result.success) {
                      setFullNameError(result.error.flatten().formErrors[0] ?? null);
                    } else {
                      setFullNameError(null);
                    }
                  }}
                  className={`w-full ${
                    fullNameError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder='Enter your full name'
                />
              </div>
              {fullNameError && <p className='mt-1 text-sm text-red-600'>{fullNameError}</p>}
            </div>

            {/* Business Name Field */}
            <div>
              <label
                htmlFor='businessName'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Business Name
              </label>
              <div className='relative mt-1 rounded-md'>
                <Input
                  id='businessName'
                  name='businessName'
                  type='text'
                  autoComplete='organization'
                  required
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (businessNameError) {
                      setBusinessNameError(null);
                    }
                    if (businessNameBlurred) {
                      const result = z
                        .string()
                        .min(2, { message: 'Business name must be at least 2 characters' })
                        .safeParse(e.target.value);
                      if (!result.success) {
                        setBusinessNameError(result.error.flatten().formErrors[0] ?? null);
                      } else {
                        setBusinessNameError(null);
                      }
                    }
                  }}
                  onBlur={() => {
                    setBusinessNameBlurred(true);
                    const result = z
                      .string()
                      .min(2, { message: 'Business name must be at least 2 characters' })
                      .safeParse(businessName);
                    if (!result.success) {
                      setBusinessNameError(result.error.flatten().formErrors[0] ?? null);
                    } else {
                      setBusinessNameError(null);
                    }
                  }}
                  className={`w-full ${
                    businessNameError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                  placeholder='Enter your business name'
                />
              </div>
              {businessNameError && (
                <p className='mt-1 text-sm text-red-600'>{businessNameError}</p>
              )}
            </div>

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
                  <Check className='absolute inset-y-0 right-0 flex items-center pr-3 text-green-500 h-5 w-5' />
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
                  <Check className='absolute inset-y-0 right-0 pr-10 flex items-center text-green-500 pointer-events-none h-5 w-5' />
                )}
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-orange-500'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
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
