'use client';

import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { CredentialResponse } from 'google-one-tap';

interface GoogleTokenPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
  jti: string;
  nbf: number;
  nonce: string;
}

/**
 * OneTap Component for Google Sign-In
 *
 * This component handles Google One Tap authentication flow:
 * 1. Checks if user is already authenticated
 * 2. If not, initializes Google One Tap
 * 3. Handles the credential callback
 * 4. Signs in user with Supabase using the Google ID token
 * 5. Redirects to dashboard on success
 */
export default function OneTapComponent() {
  const performGoogleOneTapInit = useCallback(async () => {
    try {
      // Check if user is already authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // User is already authenticated, don't show One Tap
        return;
      }

      // Generate a nonce for security
      const nonce = generateNonce();

      // Wait for Google Identity Services to load
      if (!window.google?.accounts?.id) {
        console.log('Google Identity Services not loaded yet');
        return;
      }

      // Initialize Google One Tap
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: CredentialResponse) => {
          try {
            // Verify the JWT token contains our nonce
            const payload = parseJwt(response.credential) as GoogleTokenPayload;
            if (payload.nonce !== nonce) {
              console.error('Nonce mismatch in Google token');
              return;
            }

            // Use the Google ID token to sign in with Supabase
            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce: nonce,
            });

            if (error) {
              console.error('Google sign in error:', error);
              return;
            }

            // Success! Redirect to dashboard
            window.location.href = '/dashboard';
          } catch (error) {
            console.error('Error in Google One Tap callback:', error);
          }
        },
        nonce: nonce,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the One Tap prompt
      window.google.accounts.id.prompt(
        (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => {
          if (notification.isNotDisplayed()) {
            console.log('One Tap was not displayed');
          }
          if (notification.isSkippedMoment()) {
            console.log('One Tap was skipped');
          }
        }
      );
    } catch (error) {
      console.error('Error in Google One Tap initialization:', error);
    }
  }, []);

  useEffect(() => {
    // Only initialize if we're on a sign-in page and Google client ID is available
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      // Small delay to ensure Google script is loaded
      const timer = setTimeout(() => {
        performGoogleOneTapInit();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [performGoogleOneTapInit]);

  return null; // This component doesn't render anything
}

// Helper function to generate a secure nonce
function generateNonce(length: number = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }

  return result;
}

// Helper function to parse JWT token
function parseJwt(token: string): object {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return {};
  }
}
