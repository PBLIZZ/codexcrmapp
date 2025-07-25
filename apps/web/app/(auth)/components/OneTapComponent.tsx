'use client';
import * as Sentry from '@sentry/nextjs'; // Added Sentry
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useCallback } from 'react';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

const OneTapComponent = () => {
  const router = useRouter();
  const initAttemptedRef = useRef(false);
  const [showButton, setShowButton] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleGoogleSignIn = useCallback(
    async (response: CredentialResponse) => {
      setIsPending(true);
      try {
        const { error: signInError } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        });

        if (signInError) {
          console.error('Supabase signInWithIdToken error:', signInError);
          Sentry.captureException(signInError);
          throw signInError;
        }

        Sentry.captureMessage('Successfully logged in with Google.', 'info');
        router.push('/dashboard');
        router.refresh(); // Ensure UI updates after redirect
      } catch (error) {
        console.error('Error processing Google sign-in:', error);
        Sentry.captureException(error);
      } finally {
        setIsPending(false);
      }
    },
    [router]
  );

  const performGoogleOneTapInit = useCallback(async () => {
    if (initAttemptedRef.current) {
      return;
    }
    initAttemptedRef.current = true;
    Sentry.captureMessage('[OneTapComponent] Attempting Google One Tap initialization...', 'info');

    // Check if Google Identity Services are loaded
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      console.warn('Google GSI client not ready yet. Ensure script is loaded.');
      Sentry.captureMessage('Google GSI client not ready yet. Ensure script is loaded.', 'warning');
      return;
    }

    // Check for an existing Supabase session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      Sentry.captureException(sessionError);
      return;
    }

    if (session?.user) {
      return; // Don't initialize One Tap if a session already exists
    }

    Sentry.captureMessage(
      '[OneTapComponent] No active session. Initializing Google One Tap.',
      'info'
    );

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleGoogleSignIn,
      use_fedcm_for_prompt: true,
    });

    Sentry.captureMessage(
      '[OneTapComponent] Google ID initialized. Displaying One Tap prompt...',
      'info'
    );

    window.google.accounts.id.prompt((notification: PromptMomentNotification) => {
      if (notification.isNotDisplayed()) {
        const reason = notification.getNotDisplayedReason();
        console.warn('Google One Tap prompt was not displayed. Reason:', reason);
        Sentry.captureMessage(
          `Google One Tap prompt was not displayed. Reason: ${reason}`,
          'warning'
        );
        // Show the button as fallback
        setShowButton(true);
      } else if (notification.isSkippedMoment()) {
        const reason = notification.getSkippedReason();
        console.warn('Google One Tap prompt was skipped by the user. Reason:', reason);
        Sentry.captureMessage(
          `Google One Tap prompt was skipped by the user. Reason: ${reason}`,
          'warning'
        );
        // Show the button as fallback
        setShowButton(true);
      } else if (notification.isDismissedMoment()) {
        const reason = notification.getDismissedReason();
        console.warn('Google One Tap prompt was dismissed by the user. Reason:', reason);
        Sentry.captureMessage(
          `Google One Tap prompt was dismissed by the user. Reason: ${reason}`,
          'warning'
        );
        // Show the button as fallback
        setShowButton(true);
      }
    });

    // Always show the button after a short delay as additional fallback
    setTimeout(() => {
      setShowButton(true);
    }, 2000);
  }, [handleGoogleSignIn]);

  const renderGoogleButton = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      const buttonElement = document.getElementById('google-signin-button');
      if (buttonElement) {
        // Clear any existing content
        buttonElement.innerHTML = '';
        // Render the sign-in button
        window.google.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
        });
      }
    }
  };

  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      performGoogleOneTapInit();
    }
  }, [performGoogleOneTapInit]);

  // Render the Google button when showButton becomes true
  useEffect(() => {
    if (showButton) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        renderGoogleButton();
      }, 100);
    }
  }, [showButton]);

  return (
    <>
      <Script
        src='https://accounts.google.com/gsi/client'
        async
        defer
        onLoad={() => {
          Sentry.captureMessage(
            '[OneTapComponent <Script onLoad>] Google GSI Script loaded. Initializing One Tap...',
            'info'
          );
          performGoogleOneTapInit();
        }}
        onError={(e) => {
          console.error('Google GSI Script load error:', e);
          Sentry.captureException(e);
          // Show button as fallback if script fails
          setShowButton(true);
        }}
        strategy='afterInteractive'
      />
      {/* This div is used by Google if it needs to anchor the prompt UI. */}
      <div id='oneTap' className='fixed top-0 right-0 z-[100]' />

      {/* Google Sign-In Button */}
      {showButton && (
        <div className='w-full'>
          <div
            id='google-signin-button'
            className='w-full flex justify-center'
            style={{ minHeight: '44px' }}
          />
          {isPending && (
            <div className='flex items-center justify-center mt-2'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600'></div>
              <span className='ml-2 text-sm text-gray-600'>Signing in with Google...</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default OneTapComponent;
