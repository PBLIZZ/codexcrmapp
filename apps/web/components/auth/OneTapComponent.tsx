'use client'
import Script from 'next/script'
import { supabase } from '@/lib/supabase/client'; 
import { CredentialResponse } from 'google-one-tap'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

const OneTapComponent = () => {
  const router = useRouter();
  const initAttemptedRef = useRef(false);

  // generate nonce to use for google id token sign-in
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return [nonce, hashedNonce]
  }

  const performGoogleOneTapInit = async () => {
    if (initAttemptedRef.current) {
      console.log('[OneTapComponent] Initialization already attempted, skipping.');
      return;
    }
    initAttemptedRef.current = true;
    console.log('[OneTapComponent] Attempting Google One Tap initialization...');

      // Check if Google Identity Services are loaded
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        console.warn('Google GSI client not ready yet. Ensure script is loaded.');
        // The <Script onLoad> should handle triggering this once GSI is ready.
        // If GSI fails to load, this won't proceed, which is intended.
        return;
      }

      // Check for an existing Supabase session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        return; // Don't proceed if session check fails
      }

      if (sessionData.session) {
        console.log('Active session found. Redirecting to dashboard. One Tap will not initialize.');
        // router.push('/dashboard'); // Optionally redirect if user is already logged in and somehow lands here
        return; // Don't initialize One Tap if a session already exists
      }

      console.log('No active session. Initializing Google One Tap.');
      const [nonce, hashedNonce] = await generateNonce();
      console.log('Nonce generated:', { nonce, hashedNonce });
      console.log('[OneTapComponent] Using NEXT_PUBLIC_GOOGLE_CLIENT_ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: CredentialResponse) => {
          console.log('Google Sign-In callback received:', response);
          try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce, // Use the raw nonce
            });

            if (signInError) {
              console.error('Supabase signInWithIdToken error:', signInError);
              throw signInError;
            }

            console.log('Supabase session data after signInWithIdToken:', signInData);
            console.log('Successfully logged in with Google One Tap.');
            router.push('/dashboard');
            router.refresh(); // Ensure UI updates after redirect
          } catch (error) {
            console.error('Error processing Google One Tap sign-in:', error);
          }
        },
        nonce: hashedNonce, // Use the hashed nonce
        use_fedcm_for_prompt: true,
      });

      console.log('Google ID initialized. Displaying One Tap prompt...');
      window.google.accounts.id.prompt((notification: any) => {
        // This notification callback can be used to understand prompt display status
        if (notification.isNotDisplayed()) {
          console.log('Google One Tap prompt was not displayed. Reason:', notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.log('Google One Tap prompt was skipped by the user. Reason:', notification.getSkippedReason());
        } else if (notification.isDismissedMoment()) {
          console.log('Google One Tap prompt was dismissed by the user. Reason:', notification.getDismissedReason());
        }
        // If the prompt is not displayed or skipped, Google's library might show a fallback button
        // if one is configured via HTML (e.g., <div class="g_id_signin">...</div>), or nothing further happens.
        // The Supabase JS example primarily relies on the prompt.
      });
    }
    // This useEffect is primarily for cleanup if needed, or could be removed if onLoad is sufficient.
    // For now, let's rely on onLoad.

    // If the script is already loaded when this component mounts (e.g., cached or fast navigation),
    // and onLoad might not fire, we can try to initialize here too.
    if (window.google && window.google.accounts && window.google.accounts.id) {
        console.log('[OneTapComponent useEffect] GSI already loaded on mount, attempting init.');
        performGoogleOneTapInit();
    }


  useEffect(() => {
    // The <Script onLoad> prop will call initializeAndPrompt once the GSI client is loaded.
    // This useEffect is primarily for cleanup if needed, or could be removed if onLoad is sufficient.
    // For now, let's rely on onLoad.

    // If the script is already loaded when this component mounts (e.g., cached or fast navigation),
    // and onLoad might not fire, we can try to initialize here too.
    if (window.google && window.google.accounts && window.google.accounts.id) {
        console.log('[OneTapComponent useEffect] GSI already loaded on mount, attempting init.');
        performGoogleOneTapInit();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        onLoad={() => {
          console.log('[OneTapComponent <Script onLoad>] Google GSI Script loaded. Initializing One Tap...');
          performGoogleOneTapInit();
        }}
        onError={(e) => {
          console.error('Google GSI Script load error:', e);
        }}
        strategy="afterInteractive"
      />
      {/* This div is used by Google if it needs to anchor the prompt UI. */}
      {/* Matching Supabase example's ID and styling suggestion. */}
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
      {/* 
        If a traditional button is desired as a fallback, it's typically added declaratively 
        using HTML like <div class="g_id_signin" ...>. The Supabase Next.js example focuses on the prompt.
        <div id="oneTapGoogleButton"></div> 
      */}
    </>
  )
}

export default OneTapComponent
