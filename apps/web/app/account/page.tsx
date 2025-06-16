'use client';

import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useReducer } from 'react';
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
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  fetchCurrentUser,
  updateUserPassword,
  mapAuthErrorMessage,
} from '@/lib/auth/service';

// Constants
const MIN_PASSWORD_LENGTH = 6;
const ROUTES = {
  signIn: '/log-in',
  dashboard: '/dashboard',
} as const;

// Message state management with useReducer
type MessageState = {
  text: string;
  type: 'error' | 'success';
};

type MessageAction =
  | {
      type: 'SET_MESSAGE';
      payload: { text: string; type: 'error' | 'success' };
    }
  | { type: 'CLEAR_MESSAGE' };

const initialMessageState: MessageState = {
  text: '',
  type: 'error',
};

function messageReducer(
  state: MessageState,
  action: MessageAction
): MessageState {
  switch (action.type) {
    case 'SET_MESSAGE':
      return {
        text: action.payload.text,
        type: action.payload.type,
      };
    case 'CLEAR_MESSAGE':
      return initialMessageState;
    default:
      return state;
  }
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [messageState, dispatchMessage] = useReducer(
    messageReducer,
    initialMessageState
  );

  // Fetch user data on component mount
  useEffect(() => {
    const getUserData = async () => {
      setIsFetchingUser(true);

      const { user: currentUser, error } = await fetchCurrentUser();

      if (error || !currentUser) {
        dispatchMessage({
          type: 'SET_MESSAGE',
          payload: {
            text: 'Could not fetch user data. Please sign in again.',
            type: 'error',
          },
        });
        router.push(ROUTES.signIn);
      } else {
        setUser(currentUser);
      }

      setIsFetchingUser(false);
    };

    getUserData();
  }, [router]);

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    dispatchMessage({ type: 'CLEAR_MESSAGE' });

    // Validate passwords
    if (!newPassword) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          text: 'Password cannot be empty.',
          type: 'error',
        },
      });
      setIsPasswordLoading(false);
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          text: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
          type: 'error',
        },
      });
      setIsPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          text: 'New passwords do not match.',
          type: 'error',
        },
      });
      setIsPasswordLoading(false);
      return;
    }

    // Update password
    const { error } = await updateUserPassword(newPassword);

    if (error) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          text: `Password update failed: ${mapAuthErrorMessage(error.message)}`,
          type: 'error',
        },
      });
    } else {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          text: 'Password updated successfully!',
          type: 'success',
        },
      });
    }

    // Always clear password fields after attempt
    setNewPassword('');
    setConfirmNewPassword('');
    setIsPasswordLoading(false);
  };

  // Loading state
  if (isFetchingUser && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p>Loading account information...</p>
      </div>
    );
  }

  // No user state (fallback if redirect in useEffect fails)
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p>
          Please{' '}
          <Link href={ROUTES.signIn} className="underline">
            sign in
          </Link>{' '}
          to view your account.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-teal-600">
            My Account
          </CardTitle>
          <CardDescription>
            Manage your account details and settings.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Account Information</h3>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Account Created:</span>{' '}
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : 'N/A'}
            </p>
            {user.last_sign_in_at && (
              <p>
                <span className="font-medium">Last Log In:</span>{' '}
                {new Date(user.last_sign_in_at!).toLocaleString()}
              </p>
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
                <Label htmlFor="confirm_new_password">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm_new_password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isPasswordLoading}
              >
                {isPasswordLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>

          {messageState.text && (
            <p
              className={`mt-4 text-sm ${messageState.type === 'error' ? 'text-red-600' : 'text-green-600'}`}
            >
              {messageState.text}
            </p>
          )}

          <Separator />
        </CardContent>

        <CardFooter className="justify-center">
          <Link
            href={ROUTES.dashboard}
            className="text-sm font-medium text-teal-600 hover:underline"
          >
            Back to Dashboard
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

