"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { User } from '@supabase/supabase-js';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      if (error || !currentUser) {
        setMessage('Could not fetch user data. Please sign in again.');
        setMessageType('error');
        router.push('/sign-in'); // Redirect if no user
      } else {
        setUser(currentUser);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [router]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setMessage('');
    setMessageType('error');

    if (newPassword !== confirmNewPassword) {
      setMessage('New passwords do not match.');
      setMessageType('error');
      setIsPasswordLoading(false);
      return;
    }
    if (!newPassword) {
      setMessage('Password cannot be empty.');
      setMessageType('error');
      setIsPasswordLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage(`Password update failed: ${error.message}`);
      setMessageType('error');
    } else {
      setMessage('Password updated successfully!');
      setMessageType('success');
      setNewPassword('');
      setConfirmNewPassword('');
    }
    setIsPasswordLoading(false);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(`Sign out failed: ${error.message}`);
      setMessageType('error');
    } else {
      router.push('/sign-in');
    }
    setIsLoading(false);
  };

  if (isLoading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p>Loading account information...</p>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the redirect in useEffect, but as a fallback:
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <p>Please <Link href="/sign-in" className="underline">sign in</Link> to view your account.</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">My Account</CardTitle>
          <CardDescription>Manage your account details and settings.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Account Information</h3>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Account Created:</span> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
            {user.last_sign_in_at && (
                <p><span className="font-medium">Last Sign In:</span> {new Date(user.last_sign_in_at).toLocaleString()}</p>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Change Password</h3>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <Label htmlFor="new_password">New Password</Label>
                <Input 
                  id="new_password" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Enter new password"
                  required 
                />
              </div>
              <div>
                <Label htmlFor="confirm_new_password">Confirm New Password</Label>
                <Input 
                  id="confirm_new_password" 
                  type="password" 
                  value={confirmNewPassword} 
                  onChange={(e) => setConfirmNewPassword(e.target.value)} 
                  placeholder="Confirm new password"
                  required 
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto" disabled={isPasswordLoading}>
                {isPasswordLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>

          {message && (
            <p className={`mt-4 text-sm ${messageType === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}

          <Separator />

          <div>
            <Button variant="destructive" onClick={handleSignOut} className="w-full sm:w-auto" disabled={isLoading || isPasswordLoading}>
              {isLoading && !isPasswordLoading ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="justify-center">
            <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
                Back to Dashboard
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
