'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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
import { Label } from '@codexcrm/ui';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export function ResetPasswordContent() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [tokenFound, setTokenFound] = useState(false);

  // Supabase sends the recovery token in the URL hash like #access_token=TOKEN&type=recovery&...
  // We need to parse it on the client side.
  useEffect(() => {
    const checkToken = async () => {
      try {
        const hash = window.location.hash;

        if (!hash) {
          setMessage('No password reset token found in URL.');
          setMessageType('error');
          setTokenFound(false);
          return;
        }

        // Parse the URL fragment
        const params = new URLSearchParams(hash.substring(1)); // remove #
        const _accessToken = params.get('access_token');
        const type = params.get('type');

        if (!_accessToken) {
          setMessage('Invalid or missing password reset token in URL.');
          setMessageType('error');
          setTokenFound(false);
          return;
        }

        if (type !== 'recovery') {
          setMessage('Invalid token type. Expected a password recovery token.');
          setMessageType('error');
          setTokenFound(false);
          return;
        }

        // Check token validity with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash: _accessToken,
          type: 'recovery',
        });

        if (error) {
          console.error('Token verification failed:', error);
          setMessage(`Invalid or expired token: ${error.message}`);
          setMessageType('error');
          setTokenFound(false);
          return;
        }

        setTokenFound(true); // Token is valid, show password form
      } catch (err) {
        console.error('Error processing reset token:', err);
        setMessage('Error processing password reset token. Please try again.');
        setMessageType('error');
        setTokenFound(false);
      }
    };

    void checkToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }

    if (password.length < 8) {
      setMessage('Password should be at least 8 characters long.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Call Supabase to update the password
      const { data: _data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error('Password update failed:', error);
        setMessage(`Failed to update password: ${error.message}`);
        setMessageType('error');
      } else {
        console.warn('Password updated successfully');
        setMessage('Password has been successfully reset! Redirecting to sign-in...');
        setMessageType('success');

        // Clear the URL hash to remove the token
        window.location.hash = '';

        // Redirect after a short delay
        setTimeout(() => {
          router.push('/log-in');
        }, 3000);
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setMessage('An unexpected error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container flex items-center justify-center min-h-screen py-12'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Reset Password</CardTitle>
          <CardDescription>Enter a new password for your account</CardDescription>
        </CardHeader>

        <CardContent>
          {message && (
            <div
              className={`p-3 mb-4 rounded text-sm ${
                messageType === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
              }`}
            >
              {message}
            </div>
          )}

          {tokenFound ? (
            <form onSubmit={(e) => void handleSubmit(e)}>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='password'>New Password</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='Enter your new password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='confirmPassword'>Confirm Password</Label>
                  <Input
                    id='confirmPassword'
                    type='password'
                    placeholder='Confirm your new password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <Button type='submit' className='w-full mt-6' disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Reset Password'}
              </Button>
            </form>
          ) : (
            <div className='text-center'>
              <p className='mb-4'>
                Please check your email for a password reset link, or request a new one.
              </p>
              <Link href='/log-in' className='text-blue-600 hover:underline'>
                Return to sign in
              </Link>
            </div>
          )}
        </CardContent>

        <CardFooter className='flex justify-center'>
          <Link href='/log-in' className='text-sm text-gray-500 hover:underline'>
            Return to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
