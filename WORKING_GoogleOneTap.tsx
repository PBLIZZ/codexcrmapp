import React, { useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { authConfig } from '../../lib/auth-config';

interface GoogleOneTapProps {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    google: any;
    googleOneTapInitialized: boolean;
  }
}

const GoogleOneTap: React.FC<GoogleOneTapProps> = ({ onSuccess, onError }) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || window.googleOneTapInitialized) return;

    const initializeGoogleOneTap = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: authConfig.google.clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
          }
        );

        // Show One Tap prompt
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('One Tap not displayed or skipped');
          }
        });

        window.googleOneTapInitialized = true;
        initialized.current = true;
      }
    };

    const handleCredentialResponse = async (response: any) => {
      try {
        // Verify the JWT token with Supabase
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        });

        if (error) {
          console.error('Supabase auth error:', error);
          onError?.(error);
          return;
        }

        console.log('Authentication successful:', data);
        onSuccess?.(data);
      } catch (error) {
        console.error('Authentication error:', error);
        onError?.(error);
      }
    };

    // Load Google Identity Services script
    if (!document.querySelector('script[src*="accounts.google.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleOneTap;
      document.head.appendChild(script);
    } else if (window.google) {
      initializeGoogleOneTap();
    }

    return () => {
      // Cleanup if needed
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [onSuccess, onError]);

  return (
    <div className="w-full">
      <div id="google-signin-button" className="w-full"></div>
    </div>
  );
};

export default GoogleOneTap;
