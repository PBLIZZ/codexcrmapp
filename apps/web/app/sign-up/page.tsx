"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client'; 
import { Input } from '@/components/ui/input'; 
import { Button } from '@/components/ui/button'; 
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Attempt sign up
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setMessage(error.message);
      } else if (data.user) {
        // Standard sign-up success message requiring email confirmation
        setMessage('Account created! Please check your email and click the confirmation link to activate your account and sign in.');
      } else {
         // Handle case where user might already exist but confirmation is pending etc.
         setMessage('Sign-up process initiated. If you have an account, check your email for next steps.');
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-center">Create Account</h1>
      
      <form onSubmit={handleSignUp} className="space-y-4 mb-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
            autoComplete="email"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            required
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full"
            required
            autoComplete="new-password"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded ${message.includes('Check your email') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/sign-in" passHref legacyBehavior>
          <a className="font-medium text-blue-600 hover:underline">Sign in</a>
        </Link>
      </div>
    </div>
  );
}
