"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// Google Icon SVG Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.35 10H12V14.26H18.19C17.94 15.63 17.1 16.79 15.8 17.57V20.34H19.94C21.63 18.67 22.56 15.69 22.56 12.25Z" fill="#4285F4"/>
    <path d="M12 23C14.97 23 17.45 22.02 19.28 20.34L15.8 17.57C14.83 18.23 13.5 18.66 12 18.66C9.14 18.66 6.7 16.73 5.84 14.09H1.69V16.92C3.47 20.53 7.39 23 12 23Z" fill="#34A853"/>
    <path d="M5.84 14.09C5.62 13.43 5.5 12.73 5.5 12C5.5 11.27 5.62 10.57 5.84 9.91V7.08H1.69C.97 8.55 0.5 10.22 0.5 12C0.5 13.78 .97 15.45 1.69 16.92L5.84 14.09Z" fill="#FBBC05"/>
    <path d="M12 5.34C13.62 5.34 15.06 5.93 16.2 7L19.34 3.86C17.45 2.09 14.97 1 12 1C7.39 1 3.47 3.47 1.69 7.08L5.84 9.91C6.7 7.27 9.14 5.34 12 5.34Z" fill="#EA4335"/>
  </svg>
);

// Apple Icon SVG Component
const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.816 14.6179C18.816 14.6179 18.031 12.0519 19.805 10.5889C20.948 9.6889 21.299 8.0409 20.68 6.7179C19.63 4.4509 17.489 3.7919 16.621 3.7389C14.617 3.5809 12.858 4.7839 11.907 4.7839C10.956 4.7839 9.576 3.7379 7.91 3.7649C6.081 3.7949 4.242 4.8109 3.174 6.8319C1.034 10.7899 3.299 16.3029 5.311 19.0999C6.353 20.5269 7.691 22.0269 9.319 22.0009C10.861 21.9749 11.346 21.1129 13.238 21.0869C15.142 21.0599 15.577 21.9999 17.167 21.9749C18.798 21.9499 19.881 20.4499 20.832 19.0239C21.167 18.4929 21.466 17.9309 21.702 17.3439C21.769 17.1879 19.63 16.1409 18.816 14.6179ZM14.939 2.6179C15.744 1.7439 16.205 0.5969 16.091 0.0249C14.932 0.1009 13.676 0.7819 12.882 1.6549C12.206 2.3659 11.617 3.4659 11.817 4.3659C13.056 4.3989 14.225 3.4009 14.939 2.6179Z"/>
  </svg>
);

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [isOauthLoading, setIsOauthLoading] = useState<'google' | 'apple' | null>(null);
  const [authMethod, setAuthMethod] = useState<'password' | 'magicLink'>('password');

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
        setMessageType('error');
      } else {
        // Successful login - redirect to dashboard explicitly
        // This ensures the login screen disappears
        window.location.href = '/dashboard';
      }
      // Middleware will handle redirect, but we force it here too for better UX
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during sign in');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const [messageType, setMessageType] = useState<'error' | 'success'>('error');

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMagicLinkLoading(true);
    setMessage('');
    
    try {
      // Use the official Supabase auth callback handler with the 'next' parameter
      // to specify where to redirect after authentication
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard`,
        },
      });
      
      if (error) {
        setMessage(error.message);
        setMessageType('error');
      } else {
        setMessage('Check your email for a login link!');
        setMessageType('success');
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred sending the magic link');
      setMessageType('error');
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setIsOauthLoading(provider);
    setMessage('');
    
    try {
      console.log(`Starting ${provider} OAuth login flow`);
      
      // Use current URL to determine appropriate return path
      const returnPath = '/dashboard';
      const redirectUrl = `${window.location.origin}/api/auth/callback?next=${returnPath}`;
      
      console.log(`OAuth redirect URL: ${redirectUrl}`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          // Force consent screen to ensure we get refresh tokens
          queryParams: provider === 'google' ? 
            { access_type: 'offline', prompt: 'consent', hd: '*' } : undefined,
        },
      });
      
      if (error) {
        console.error(`${provider} OAuth error:`, error);
        setMessage(error.message);
        setMessageType('error');
        setIsOauthLoading(null);
        return;
      }
      
      if (!data.url) {
        console.error(`${provider} OAuth flow didn't return a URL`);
        setMessage(`Error starting ${provider} sign in - no redirect URL returned`);
        setMessageType('error');
        setIsOauthLoading(null);
        return;
      }
      
      console.log(`${provider} OAuth initiated successfully, redirecting to:`, data.url);
      // Force navigate to the provider's authorization URL
      window.location.href = data.url;
    } catch (error: any) {
      console.error(`Unexpected error in ${provider} OAuth:`, error);
      setMessage(`An error occurred during ${provider} sign in`);
      setMessageType('error');
      setIsOauthLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-blue-600">CodexCRM</CardTitle>
          <CardDescription>Welcome back! Sign in to your account.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button 
              type="button" 
              onClick={() => handleOAuthLogin('google')}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isLoading || !!isOauthLoading}
            >
              <GoogleIcon />
              {isOauthLoading === 'google' ? 'Redirecting...' : 'Continue with Google'}
            </Button>
            <Button 
              type="button" 
              onClick={() => handleOAuthLogin('apple')}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isLoading || !!isOauthLoading}
            >
              <AppleIcon />
              {isOauthLoading === 'apple' ? 'Redirecting...' : 'Continue with Apple'}
            </Button>
          </div>

          {/* Separator */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Method Selection Buttons */}
          <div className="flex justify-center space-x-4">
            <Button 
              type="button" 
              variant={authMethod === 'password' ? 'default' : 'outline'}
              onClick={() => setAuthMethod('password')}
              size="sm"
              className={authMethod === 'password' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
            >
              Password
            </Button>
            <Button 
              type="button" 
              variant={authMethod === 'magicLink' ? 'default' : 'outline'}
              onClick={() => setAuthMethod('magicLink')}
              size="sm"
              className={authMethod === 'magicLink' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
            >
              Magic Link
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={authMethod === 'password' ? handlePasswordLogin : handleMagicLinkLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
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
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>

            {authMethod === 'password' && (
              <>
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>

                {/* Forgot Password Link for password method */} 
                <div className="text-sm text-right mt-2">
                  <Link href="/forgot-password" className="font-medium text-blue-600 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </>
            )}

          {/* Message Display */} 
          {message && (
            <p className={`text-sm ${messageType === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}

          {/* Submit Button Container */}
          <div>
            <Button 
              type="submit" 
              className="w-full flex justify-center disabled:opacity-50"
              disabled={authMethod === 'password' ? (isLoading || !!isOauthLoading) : (isMagicLinkLoading || !!isOauthLoading)}
            >
              {authMethod === 'password'
                ? (isLoading ? 'Signing in...' : 'Sign in with Password')
                : (isMagicLinkLoading ? 'Sending link...' : 'Send Magic Link')}
            </Button>
          </div>
          </form> {/* Closing the form tag here */} 
        </CardContent>

        {/* Optional Footer for Sign Up link etc. */}
        <CardFooter className="text-center text-sm text-gray-600">
          Don't have an account? <Link href="/sign-up" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
        </CardFooter>

      </Card>
    </div>
  );
}