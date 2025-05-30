"use client";

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';

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
      setMessage('If an account exists for this email, a password reset link has been sent. Please check your inbox.');
      setMessageType('success');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="text-center space-y-2">
  <img src="/images/logo.png" alt="OmniCRM" className="mx-auto h-12 w-12" />
  <CardTitle className="text-3xl font-bold text-teal-800">OmniCRM</CardTitle>
  <CardDescription className="text-sm text-teal-400">by Omnipotency AI</CardDescription>
  <CardDescription className="text-base text-gray-700">Reset your password</CardDescription>
</CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            {message && (
              <p className={`text-sm ${messageType === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}

            <div>
              <Button 
  type="submit"
  className="w-full bg-teal-400 hover:bg-teal-400 text-teal-800 hover:text-orange-500 font-semibold disabled:opacity-50 transition-colors"
  disabled={isLoading}
>
  {isLoading ? 'Sending...' : 'Send Password Reset Link'}
</Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2">
          <Link href="/sign-in" className="text-orange-500 hover:text-teal-800 font-semibold transition-colors text-sm">Sign In</Link>
        </CardFooter>

        <CardFooter className="text-center text-sm text-gray-600 justify-center">
          Remembered your password?{' '}
          <Link href="/sign-in" className="font-medium text-blue-600 hover:underline ml-1">
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
