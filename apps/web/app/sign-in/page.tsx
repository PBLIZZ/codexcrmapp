"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Check your email for the login link!');
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setMessage(error.message);
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        setMessage(error.message);
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during Google sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-center">Sign In to CodexCRM</h1>
      
      {/* Google Sign In Button */}
      <div className="mb-6">
        <Button 
          type="button" 
          onClick={handleGoogleLogin} 
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
          disabled={isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Separator className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </Separator>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      
      {/* Email/Password Sign In Form */}
      <form onSubmit={handlePasswordLogin} className="space-y-4 mb-6">
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
          />
          <div className="flex justify-end items-center mt-2 text-sm">
             <Link href="/forgot-password" passHref legacyBehavior>
               <a className="text-blue-600 hover:underline">Forgot password?</a>
             </Link>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
        
        <div className="text-center text-sm text-gray-600">
           Don't have an account?{' '}
           <Link href="/sign-up" passHref legacyBehavior>
             <a className="font-medium text-blue-600 hover:underline">Sign up</a>
           </Link>
         </div>
      </form>
      
      {/* Magic Link Option */}
      <div className="relative mb-6">
        <Separator className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </Separator>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>
      
      <form onSubmit={handleMagicLinkLogin} className="space-y-4">
        <div>
          <label htmlFor="magic-email" className="block text-sm font-medium text-gray-700 mb-1">Email for Magic Link</label>
          <Input
            id="magic-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gray-800 hover:bg-gray-900"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Magic Link'}
        </Button>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded ${message.includes('Check your email') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
}