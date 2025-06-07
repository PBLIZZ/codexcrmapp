'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';

import OneTapComponent from '@/components/auth/OneTapComponent'; // Ensure this path is correct and component exists
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase/client';

// Google Icon SVG Component
const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isLoading, setIsLoading] = useState(false);
  // const [isOauthLoading, setIsOauthLoading] = useState<'google' | null>(null); // Replaced by OneTapComponent
  const [showPassword, setShowPassword] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);

  // Zod schema for login form
  const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }), // Or a more specific minLength, e.g., .min(6, 'Password must be at least 6 characters')
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setEmailError(null); // Clear previous errors
    setPasswordError(null);

    // Validate form data
    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      if (fieldErrors.email) setEmailError(fieldErrors.email[0]);
      if (fieldErrors.password) setPasswordError(fieldErrors.password[0]);
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setMessageType('error');
      } else {
        // Successful login - redirect to dashboard explicitly
        // This ensures the login screen disappears
        window.location.href = '/dashboard';
      }
      // Middleware will handle redirect, but we force it here too for better UX
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'An error occurred during log in'
      );
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };
  // handleOAuthLogin function removed as OneTapComponent handles Google Sign-In

  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-50 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 pt-6 pb-4 px-4 sm:px-6">
          <div className="flex items-center space-x-3 self-start">
            <Image
              src="/images/logo.png"
              alt="CodexCRM Logo"
              width={40} 
              height={40}
              className="h-8 w-8 sm:h-10 sm:w-10"
            />
            <div>
              <p className="text-xl font-semibold text-teal-700">OmniCRM</p>
              <p className="text-xs text-gray-500">by Omnipotency AI</p>
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-xl sm:text-2xl font-bold text-teal-800">
              Log In
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-600">
              Welcome back! Log in to your account.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-4 sm:px-6 pb-4 sm:pb-6 pt-4">
          {/* Message Display */}
          {message && (
            <p
              className={`text-sm text-center mb-4 ${messageType === 'error' ? 'text-red-600' : 'text-green-600'}`}
            >
              {message}
            </p>
          )}
          {/* OneTapComponent will render Google Sign-In Button or Prompt */}
          <OneTapComponent />

          {/* Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">OR</span>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) {
                    setEmailError(null); // Clear error if user starts typing
                  }
                  if (emailBlurred) {
                    // If already blurred once, validate on change
                    const result = loginSchema.shape.email.safeParse(
                      e.target.value
                    );
                    if (!result.success) {
                      setEmailError(result.error.flatten().formErrors[0]);
                    } else {
                      setEmailError(null); // Clear error if now valid
                    }
                  }
                }}
                onBlur={() => {
                  setEmailBlurred(true); // Mark as blurred
                  const result = loginSchema.shape.email.safeParse(email);
                  if (!result.success) {
                    setEmailError(result.error.flatten().formErrors[0]);
                  } else {
                    setEmailError(null);
                  }
                }}
                autoFocus
                className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm pr-10 ${emailBlurred ? (emailError ? 'border-red-500' : 'border-green-500') : 'border-gray-300'}`}
                autoCapitalize="none"
              />
              {emailBlurred && !emailError && email.length > 0 && (
                <CheckIcon className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500 pointer-events-none h-5 w-5" />
              )}
              {emailError && (
                <p className="mt-1 text-xs text-red-600">{emailError}</p>
              )}
            </div>

            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) {
                    setPasswordError(null);
                  }
                  if (passwordBlurred) {
                    const result = loginSchema.shape.password.safeParse(
                      e.target.value
                    );
                    if (!result.success) {
                      setPasswordError(result.error.flatten().formErrors[0]);
                    } else {
                      setPasswordError(null);
                    }
                  }
                }}
                onBlur={() => {
                  setPasswordBlurred(true);
                  const result = loginSchema.shape.password.safeParse(password);
                  if (!result.success) {
                    setPasswordError(result.error.flatten().formErrors[0]);
                  } else {
                    setPasswordError(null);
                  }
                }}
                className={`block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm pr-10 ${passwordBlurred ? (passwordError ? 'border-red-500' : 'border-green-500') : 'border-gray-300'}`}
              />
              {passwordBlurred && !passwordError && password.length > 0 && (
                <CheckIcon className="absolute inset-y-0 right-0 pr-10 flex items-center text-green-500 pointer-events-none h-5 w-5" />
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-orange-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1 text-xs text-red-600">{passwordError}</p>
            )}

            {/* Submit Button and Forgot Password Link Container */}
            <div className="flex justify-between items-end mt-2">
              <Button
                type="submit"
                className="flex justify-center disabled:opacity-50 bg-teal-800 hover:bg-teal-700 text-teal-200 px-8 py-2 text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In with Email'}
              </Button>
              <Link
                href="/forgot-password" // Assuming this is the route
                className="text-xs font-medium text-teal-600 hover:text-teal-500"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
          {/* Closing the form tag here */}
        </CardContent>

        {/* Optional Footer for Sign Up link etc. */}
        <CardFooter className="flex flex-col items-center space-y-4 px-4 sm:px-6 pb-4 sm:pb-6 text-sm text-gray-600">
          <p className="text-center">
            Don't have an account?{' '}
            <Link
              href="/sign-up"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Sign Up
            </Link>
          </p>
          <p className="mt-4 px-2 text-center text-xs text-gray-500">
            By logging in, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-teal-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-teal-700">
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
